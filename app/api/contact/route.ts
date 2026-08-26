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
    // La référence (code HTTP renvoyé par Brevo) aide au diagnostic sans
    // rien exposer de sensible : 401 = clé invalide, 400 = expéditeur ou
    // payload refusé, 403 = domaine non autorisé.
    //
    // Le détail complet reste dans les logs serveur ci-dessus. Il était
    // renvoyé au navigateur pendant la mise au point de Brevo ; ce champ a
    // été retiré une fois l'envoi opérationnel — la réponse d'un
    // prestataire n'a rien à faire dans une réponse HTTP publique.
    const ref = sent.status ? ` (réf. ${sent.status})` : "";
    return NextResponse.json(
      { error: `L'envoi a échoué${ref}. Écrivez-nous directement à contact@dreamsfly.fr.` },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

type ContactData = z.infer<typeof ContactSchema>;

/**
 * Envoie le message via l'API transactionnelle Brevo (ex-Sendinblue).
 *
 * Appel REST direct en fetch natif — pas de SDK, donc aucun risque de
 * module qui ne se charge pas sur le runtime serverless.
 *
 * Variables d'environnement :
 *  - BREVO_API_KEY      : clé API v3 (Brevo → SMTP & API → Clés API)
 *  - CONTACT_EMAIL_TO   : destinataire (défaut contact@dreamsfly.fr)
 *  - CONTACT_EMAIL_FROM : expéditeur, doit être un expéditeur vérifié
 *                         chez Brevo (défaut contact@dreamsfly.fr)
 *
 * Sans BREVO_API_KEY : le message est loggé et l'UX reste fonctionnelle
 * (mode dégradé de développement).
 */
async function sendContactEmail(
  data: ContactData,
): Promise<{ ok: boolean; error?: string; status?: number }> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const to = parseAddress(process.env.CONTACT_EMAIL_TO, "contact@dreamsfly.fr").email;
  const fromParsed = parseAddress(process.env.CONTACT_EMAIL_FROM, "contact@dreamsfly.fr");
  const fromEmail = fromParsed.email;
  const fromName =
    process.env.CONTACT_EMAIL_FROM_NAME?.trim() || fromParsed.name || "DreamsFly — Site web";

  if (!apiKey) {
    console.warn("[contact] BREVO_API_KEY absent — message loggé sans envoi:", {
      name: data.name,
      email: data.email,
      subject: data.subject,
    });
    return { ok: true };
  }

  const subject = data.subject
    ? `[Contact site] ${data.subject} — ${data.name}`
    : `[Contact site] Message de ${data.name}`;

  const rows: [string, string][] = [
    ["Nom", data.name],
    ["Email", data.email],
    ...(data.phone ? ([["Téléphone", data.phone]] as [string, string][]) : []),
    ...(data.subject ? ([["Sujet", data.subject]] as [string, string][]) : []),
  ];

  const htmlContent = `
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
  `;

  const textContent = [
    ...rows.map(([k, v]) => `${k} : ${v}`),
    "",
    "Message :",
    data.message,
  ].join("\n");

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: fromName },
        to: [{ email: to }],
        // Répondre à l'email ouvre directement une réponse au visiteur
        replyTo: { email: data.email, name: data.name },
        subject,
        htmlContent,
        textContent,
        tags: ["contact-site"],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return {
        ok: false,
        status: res.status,
        error: `Brevo ${res.status} — ${detail.slice(0, 300)}`,
      };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error)?.message || "erreur réseau" };
  }
}

/**
 * Accepte les deux écritures d'adresse et renvoie toujours l'email seul :
 *   "contact@dreamsfly.fr"             → { email }
 *   "DreamsFly <contact@dreamsfly.fr>" → { email, name }
 * Brevo exige l'email nu dans sender.email — un format "Nom <email>" y
 * serait rejeté en 400.
 */
function parseAddress(raw: string | undefined, fallback: string): { email: string; name?: string } {
  const value = raw?.trim();
  if (!value) return { email: fallback };
  const angle = value.match(/^\s*(.*?)\s*<\s*([^<>@\s]+@[^<>@\s]+)\s*>\s*$/);
  if (angle) {
    const name = angle[1].replace(/^["']|["']$/g, "").trim();
    return { email: angle[2], name: name || undefined };
  }
  return { email: value };
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
