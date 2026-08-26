/**
 * Webhook Stripe — POST /api/stripe-webhook
 *
 * Reçoit les événements Stripe (checkout.session.completed notamment),
 * écrit la commande dans Sanity.
 *
 * Configuration côté Stripe :
 *   Dashboard → Developers → Webhooks → Add endpoint
 *   URL : https://dreamsfly.fr/api/stripe-webhook
 *   Events : checkout.session.completed
 *   Copier le signing secret dans STRIPE_WEBHOOK_SECRET (Vercel env vars)
 */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sanityWriteClient } from "@/lib/sanity/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe non configuré (clés manquantes côté serveur)" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secret);
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error("[stripe-webhook] verification failed:", err.message);
    return NextResponse.json({ error: `Webhook invalid: ${err.message}` }, { status: 400 });
  }

  // ─── Cloisonnement : ce compte Stripe est partagé ───────────────────
  //
  // Le compte héberge aussi une autre activité (Mobilier Malin). Un compte
  // Stripe émet ses événements pour TOUS les paiements qu'il traite : sans
  // filtre, chaque vente de l'autre marque créerait une fausse commande
  // dans le Sanity de DreamsFly. Une clé API distincte n'y change rien —
  // elle authentifie, elle ne cloisonne pas.
  //
  // Chaque paiement initié par ce site porte `metadata.source` valant
  // "dreamsfly-web" (posé dans /api/payment-intent). Tout événement sans ce
  // marqueur vient d'ailleurs et doit être ignoré.
  //
  // En cas de doute on IGNORE : rater une commande se voit dans les logs et
  // se rattrape en rejouant l'événement ; enregistrer la commande d'une
  // autre entreprise mélange deux comptabilités.
  if (!belongsToDreamsFly(event)) {
    console.info(
      `[stripe-webhook] ${event.type} ignoré — hors périmètre DreamsFly (compte Stripe partagé)`,
    );
    return NextResponse.json({ received: true, ignored: true });
  }

  // ─── Tunnel intégré (PaymentElement) ────────────────────────────────
  // Le paiement se fait sur dreamsfly.fr, sans Checkout Session : c'est
  // donc le PaymentIntent qui fait foi. La commande a déjà été écrite en
  // « pending » par /api/payment-intent ; on la bascule en « paid ».
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object as Stripe.PaymentIntent;
    await markOrderPaid(intent);
    return NextResponse.json({ received: true });
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    console.warn(
      "[stripe-webhook] paiement échoué:",
      intent.id,
      intent.last_payment_error?.message,
    );
    return NextResponse.json({ received: true });
  }

  // ─── Ancien tunnel Checkout hébergé ─────────────────────────────────
  // Conservé pour les sessions encore en vol au moment de la bascule.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Fetch line items pour avoir les détails complets
    let lineItems: Stripe.ApiList<Stripe.LineItem> | null = null;
    try {
      lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 50, expand: ["data.price.product"] });
    } catch (err) {
      console.warn("[stripe-webhook] listLineItems failed:", err);
    }

    if (sanityWriteClient) {
      try {
        await sanityWriteClient.create({
          _type: "order",
          stripeSessionId: session.id,
          stripePaymentIntent: session.payment_intent,
          customerEmail: session.customer_details?.email,
          customerName: session.customer_details?.name,
          phone: session.customer_details?.phone,
          totalAmount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency,
          status: "paid",
          shippingAddress: session.shipping_details
            ? {
                line1: session.shipping_details.address?.line1,
                line2: session.shipping_details.address?.line2,
                postalCode: session.shipping_details.address?.postal_code,
                city: session.shipping_details.address?.city,
                country: session.shipping_details.address?.country,
              }
            : undefined,
          items:
            lineItems?.data.map((item: any) => ({
              _key: item.id,
              name: item.description || (item.price?.product as any)?.name,
              quantity: item.quantity,
              unitAmount: item.price?.unit_amount ? item.price.unit_amount / 100 : 0,
              totalAmount: item.amount_total ? item.amount_total / 100 : 0,
            })) || [],
          paidAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error("[stripe-webhook] sanity write failed:", err);
      }
    }

    // TODO: envoyer email de confirmation via Brevo
  }

  return NextResponse.json({ received: true });
}

/** Marqueur posé sur tout paiement initié par ce site. */
const SOURCE_MARKER = "dreamsfly-web";

/**
 * L'événement concerne-t-il une commande DreamsFly ?
 *
 * Le compte Stripe est partagé avec une autre activité : il faut distinguer
 * ce qui vient de ce site de ce qui vient de l'autre.
 *
 * Le marqueur est cherché à deux endroits, car les deux tunnels ne le
 * posent pas au même niveau :
 *  · tunnel intégré → sur le PaymentIntent lui-même
 *  · ancien Checkout → sur la Session ; le PaymentIntent qu'elle engendre
 *    n'hérite PAS de ses métadonnées. L'événement payment_intent.succeeded
 *    d'une session sera donc ignoré, et c'est checkout.session.completed
 *    qui fera foi — ce qui évite au passage tout double traitement.
 */
function belongsToDreamsFly(event: Stripe.Event): boolean {
  const object = event.data.object as { metadata?: Record<string, string> | null };
  return object?.metadata?.source === SOURCE_MARKER;
}

/**
 * Bascule la commande en « payée » à réception de payment_intent.succeeded.
 *
 * Trois façons de retrouver le document, de la plus fiable à la dernière
 * chance : l'identifiant Sanity placé dans les métadonnées à la création du
 * paiement, puis une recherche par identifiant de PaymentIntent, et enfin
 * la création d'une commande à partir des seules données Stripe si l'écriture
 * initiale avait échoué. Un client qui a payé doit toujours finir avec une
 * commande enregistrée.
 *
 * Idempotent : Stripe peut livrer le même événement plusieurs fois, et une
 * commande déjà marquée payée n'est pas retouchée.
 */
async function markOrderPaid(intent: Stripe.PaymentIntent) {
  if (!sanityWriteClient) {
    console.error("[stripe-webhook] Sanity indisponible — commande non enregistrée:", intent.id);
    return;
  }

  const charge = (intent as any).latest_charge;
  const details = intent.shipping || null;
  const billing = typeof charge === "object" ? charge?.billing_details : null;

  const paidFields = {
    status: "paid",
    stripePaymentIntent: intent.id,
    totalAmount: intent.amount_received ? intent.amount_received / 100 : intent.amount / 100,
    currency: intent.currency,
    customerEmail: intent.receipt_email || billing?.email || undefined,
    customerName: details?.name || billing?.name || undefined,
    phone: details?.phone || billing?.phone || undefined,
    shippingAddress: details?.address
      ? {
          line1: details.address.line1 || undefined,
          line2: details.address.line2 || undefined,
          postalCode: details.address.postal_code || undefined,
          city: details.address.city || undefined,
          country: details.address.country || undefined,
        }
      : undefined,
    paidAt: new Date().toISOString(),
  };

  try {
    const orderId = intent.metadata?.sanityOrderId;
    let existing: { _id: string; status?: string } | null = null;

    if (orderId) {
      existing = await sanityWriteClient.fetch(`*[_id == $id][0]{ _id, status }`, { id: orderId });
    }
    if (!existing) {
      existing = await sanityWriteClient.fetch(
        `*[_type == "order" && stripePaymentIntent == $pi][0]{ _id, status }`,
        { pi: intent.id },
      );
    }

    if (existing?._id) {
      if (existing.status === "paid") return; // événement rejoué
      await sanityWriteClient.patch(existing._id).set(paidFields).commit();
      return;
    }

    // Filet de sécurité : la commande « pending » n'a jamais été écrite.
    // On repart de ce que Stripe sait, quitte à perdre le détail des lignes.
    console.warn("[stripe-webhook] commande pending introuvable, création:", intent.id);
    await sanityWriteClient.create({ _type: "order", ...paidFields });
  } catch (err) {
    console.error("[stripe-webhook] écriture commande payée:", err);
  }
}
