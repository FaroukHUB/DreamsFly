import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/newsletter — inscription à la newsletter via Brevo.
 *
 * Crée (ou met à jour) un contact dans une liste Brevo. Le double opt-in
 * est géré côté Brevo si tu configures un DOI template — sinon le contact
 * est ajouté directement.
 *
 * Variables d'environnement :
 *  - BREVO_API_KEY      : clé API v3
 *  - BREVO_LIST_ID      : identifiant numérique de la liste (Brevo →
 *                         Contacts → Listes → colonne ID)
 *
 * Sécurité : rate limit 5 inscriptions / 10 min / IP, validation Zod,
 * honeypot. Sans BREVO_API_KEY, mode dégradé (log + succès côté UX).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NewsletterSchema = z.object({
  email: z.string().trim().email("Email invalide").max(254),
  // Honeypot — doit rester vide
  website: z.string().max(0).optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  const limited = enforceRateLimit(req, "newsletter", 5, 10 * 60_000);
  if (limited) return limited;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const parsed = NewsletterSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Email invalide" },
      { status: 400 },
    );
  }
  const { email, website } = parsed.data;

  // Bot détecté → succès silencieux
  if (website) return NextResponse.json({ ok: true });

  const apiKey = process.env.BREVO_API_KEY;
  const listIdRaw = process.env.BREVO_LIST_ID;

  if (!apiKey || !listIdRaw) {
    console.warn("[newsletter] BREVO_API_KEY ou BREVO_LIST_ID absent — inscription loggée:", email);
    return NextResponse.json({ ok: true });
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        listIds: [Number(listIdRaw)],
        updateEnabled: true, // ré-inscription d'un contact existant = pas d'erreur
      }),
    });

    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      // Contact déjà présent dans la liste → on considère que c'est un succès
      if (detail?.code === "duplicate_parameter") {
        return NextResponse.json({ ok: true });
      }
      console.error("[newsletter] Brevo", res.status, detail);
      return NextResponse.json(
        { error: "L'inscription a échoué. Réessayez dans un instant." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter] erreur réseau:", (err as Error)?.message, email);
    return NextResponse.json(
      { error: "L'inscription a échoué. Réessayez dans un instant." },
      { status: 502 },
    );
  }
}
