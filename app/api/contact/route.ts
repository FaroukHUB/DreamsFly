import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
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

  const sent = await sendContactEmail(data);
  if (!sent.ok) {
    // Le message est loggé pour ne rien perdre même si l'email échoue
    console.error("[contact] échec envoi email:", sent.error, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
    });
    return NextResponse.json(
      { error: "L'envoi a échoué. Écrivez-nous directement à contact@dreamsfly.fr." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

type ContactData = z.infer<typeof ContactSchema>;

/**
 * Envoie le message via Resend.
 * - `to`   : CONTACT_EMAIL_TO (défaut contact@dreamsfly.fr)
 * - `from` : CONTACT_EMAIL_FROM — doit être une adresse d'un domaine
 *            vérifié dans Resend (ex. contact@dreamsfly.fr)
 * - `replyTo` : l'email du visiteur, pour répondre en un clic
 *
 * Si RESEND_API_KEY n'est pas défini, on log et on considère l'envoi
 * réussi côté UX (mode dégradé de développement).
 */
async function sendContactEmail(data: ContactData): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO || "contact@dreamsfly.fr";
  const from = process.env.CONTACT_EMAIL_FROM || "DreamsFly <contact@dreamsfly.fr>";

  if (!apiKey) {
    console.warn("[contact] RESEND_API_KEY absent — message loggé sans envoi:", {
      name: data.name,
      email: data.email,
      subject: data.subject,
    });
    return { ok: true };
  }

  try {
    const resend = new Resend(apiKey);
    const subject = data.subject
      ? `[Contact site] ${data.subject} — ${data.name}`
      : `[Contact site] Message de ${data.name}`;

    const rows: [string, string][] = [
      ["Nom", data.name],
      ["Email", data.email],
      ...(data.phone ? ([["Téléphone", data.phone]] as [string, string][]) : []),
      ...(data.subject ? ([["Sujet", data.subject]] as [string, string][]) : []),
    ];

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject,
      text: [
        ...rows.map(([k, v]) => `${k} : ${v}`),
        "",
        "Message :",
        data.message,
      ].join("\n"),
      html: `
        <div style="font-family:system-ui,-apple-system,sans-serif;max-width:640px;color:#0F172A">
          <p style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#8B7355;margin:0 0 4px">
            Nouveau message · formulaire de contact
          </p>
          <h2 style="font-family:Georgia,serif;font-weight:400;font-size:22px;margin:0 0 20px">
            ${escapeHtml(data.name)}
          </h2>
          <table style="border-collapse:collapse;width:100%;font-size:14px">
            ${rows
              .map(
                ([k, v]) => `
              <tr>
                <td style="padding:8px 12px 8px 0;color:#8B7355;white-space:nowrap;vertical-align:top">${k}</td>
                <td style="padding:8px 0">${escapeHtml(v)}</td>
              </tr>`,
              )
              .join("")}
          </table>
          <div style="margin-top:20px;padding-top:16px;border-top:1px solid #E2E8F0">
            <p style="color:#8B7355;font-size:11px;letter-spacing:.14em;text-transform:uppercase;margin:0 0 8px">Message</p>
            <p style="white-space:pre-wrap;line-height:1.6;margin:0">${escapeHtml(data.message)}</p>
          </div>
        </div>
      `,
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error)?.message || "erreur inconnue" };
  }
}

/** Échappe le HTML pour éviter toute injection dans l'email. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
