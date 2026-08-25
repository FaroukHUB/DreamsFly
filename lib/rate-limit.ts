import { NextRequest, NextResponse } from "next/server";

/**
 * Rate limiter en mémoire — fenêtre glissante par IP.
 *
 * Zéro dépendance, zéro service externe. Limitation connue : sur Vercel
 * serverless, chaque instance chaude a sa propre mémoire — la limite est
 * donc "par instance" et non globale. C'est suffisant pour stopper les
 * bursts d'un même client (le scénario réel du spam/abus), car un client
 * donné est généralement routé vers la même instance chaude.
 *
 * Pour une limite globale stricte (multi-région, gros trafic), migrer vers
 * @upstash/ratelimit — l'API de ce module est prévue pour être compatible.
 */

type Bucket = { timestamps: number[] };

const store = new Map<string, Bucket>();
const MAX_KEYS = 5_000; // garde-fou mémoire

/** Purge les clés dont tous les hits sont expirés (appelée paresseusement). */
function cleanup(windowMs: number) {
  if (store.size < MAX_KEYS) return;
  const cutoff = Date.now() - windowMs;
  for (const [key, bucket] of store) {
    bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff);
    if (bucket.timestamps.length === 0) store.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

/**
 * Vérifie et consomme un hit pour `key`.
 * @param key       identifiant client (IP + nom de route)
 * @param limit     nombre de requêtes autorisées par fenêtre
 * @param windowMs  taille de la fenêtre en ms
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  cleanup(windowMs);
  const now = Date.now();
  const cutoff = now - windowMs;

  let bucket = store.get(key);
  if (!bucket) {
    bucket = { timestamps: [] };
    store.set(key, bucket);
  }
  bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0];
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
    };
  }

  bucket.timestamps.push(now);
  return { ok: true, remaining: limit - bucket.timestamps.length, retryAfterSeconds: 0 };
}

/** Extrait l'IP client d'une requête Next (Vercel met la vraie IP en premier). */
export function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Garde-fou prêt à l'emploi pour un route handler.
 * Retourne une réponse 429 si la limite est dépassée, null sinon.
 *
 * Usage :
 *   const limited = enforceRateLimit(req, "chat", 10, 60_000);
 *   if (limited) return limited;
 */
export function enforceRateLimit(
  req: NextRequest,
  routeName: string,
  limit: number,
  windowMs: number,
): NextResponse | null {
  const result = rateLimit(`${routeName}:${clientIp(req)}`, limit, windowMs);
  if (result.ok) return null;
  return NextResponse.json(
    { error: "Trop de requêtes — réessayez dans un instant." },
    {
      status: 429,
      headers: {
        "Retry-After": String(result.retryAfterSeconds),
        "Cache-Control": "no-store",
      },
    },
  );
}
