import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/contact — reçoit les messages du formulaire contact.
 * TODO : brancher Resend pour envoyer un email à contact@dreamsfly.fr
 * ET stocker en Sanity comme document "contactMessage".
 *
 * Pour l'instant : log + accusé de réception OK.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }

  const { name, email, phone, subject, message } = body || {};
  if (!name || !email || !message) {
    return NextResponse.json({ error: "Nom, email et message obligatoires" }, { status: 400 });
  }

  // TODO : envoyer email via Resend + créer doc Sanity
  console.log("[contact]", { name, email, phone, subject, message });

  return NextResponse.json({ ok: true });
}
