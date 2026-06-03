/**
 * Webhook Stripe — POST /api/stripe-webhook
 *
 * Reçoit les événements Stripe (checkout.session.completed notamment),
 * écrit la commande dans Sanity.
 *
 * Configuration côté Stripe :
 *   Dashboard → Developers → Webhooks → Add endpoint
 *   URL : https://dreams-fly.vercel.app/api/stripe-webhook
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

    // TODO: envoyer email de confirmation via Resend
  }

  return NextResponse.json({ received: true });
}
