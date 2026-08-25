import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/contact — reçoit les messages du formulaire contact.
 *
 * Sécurité :
 *  1. Rate limit : 3 messages / 10 min / IP
 *  2. Validation Zod stricte (types, longueurs, format email)
 *  3. Honeypot : champ caché `website` — un bot qui le remplit est rejeté
 *     silencieusement (on renvoie ok pour ne pas lui apprendre)
 *  4. Cloudflare Turnstile (optionnel) : activé dès que TURNSTILE_SECRET_KEY
 *     est défini côté Vercel. Sans la clé, la vérification est sautée —
 *     le formulaire reste fonctionnel.
 *
 * TODO : brancher Resend pour envoyer un email à contact@dreamsfly.fr
 * ET stocker en Sanity comme document "contactMessage".
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ContactSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(120),
  email: z.string().trim().email("Email invalide").max(254),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+0-9 ().-]*$/, "Téléphone invalide")
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message trop court").max(5000),
  // Honeypot — doit rester vide (champ invisible pour les humains)
  website: z.string().max(0).optional().or(z.literal("")),
  // Jeton Turnstile (si le widget est actif côté client)
  turnstileToken: z.string().max(4096).optional(),
});

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Turnstile non configuré → on n'exige pas de jeton
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = await res.json();
    return data?.success === true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // 3 messages / 10 minutes / IP
  const limited = enforceRateLimit(req, "contact", 3, 10 * 60_000);
  if (limited) return limited;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message || "Formulaire invalide" },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Honeypot rempli → bot. On répond ok sans rien faire (silencieux).
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const human = await verifyTurnstile(data.turnstileToken, ip);
  if (!human) {
    return NextResponse.json(
      { error: "Vérification anti-robot échouée — rechargez la page et réessayez." },
      { status: 403 },
    );
  }

  // TODO : envoyer email via Resend + créer doc Sanity
  console.log("[contact]", {
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message.slice(0, 200),
  });

  return NextResponse.json({ ok: true });
}
