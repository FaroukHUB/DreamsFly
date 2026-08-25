/**
 * Création d'une Checkout Session Stripe — POST /api/checkout
 *
 * Body : { lines: CartLine[] }
 * Response: { url } pour redirection navigateur, ou { error }
 *
 * Construit dynamiquement les line_items à partir du panier.
 * - Si la variante a un stripePriceId : on utilise price
 * - Sinon : on construit price_data inline (nom + prix unitaire en cents)
 */
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamsfly.fr";

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Stripe non configuré (STRIPE_SECRET_KEY manquant)." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(secret);

  let body: { lines?: any[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const lines = body.lines || [];
  if (!lines.length) {
    return NextResponse.json({ error: "Panier vide" }, { status: 400 });
  }

  const lineItems = lines.map((l: any) => {
    if (l.stripePriceId) {
      return { price: l.stripePriceId, quantity: l.quantity };
    }
    return {
      quantity: l.quantity,
      price_data: {
        currency: "eur",
        unit_amount: Math.round((l.unitPrice || 0) * 100),
        product_data: {
          name: l.productName,
          description: l.variantSize ? `Taille ${l.variantSize}` : undefined,
          images: l.image ? [l.image] : undefined,
          metadata: { productId: l.productId, sku: l.sku || "" },
        },
      },
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${SITE_URL}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/panier`,
      shipping_address_collection: { allowed_countries: ["FR", "BE", "LU", "CH"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 9900, currency: "eur" },
            display_name: "Livraison France métropolitaine",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
      billing_address_collection: "auto",
      phone_number_collection: { enabled: true },
      automatic_tax: { enabled: false },
      locale: "fr",
      payment_method_types: ["card"],
      allow_promotion_codes: true,
      metadata: {
        source: "dreamsfly-web",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: err.message || "Erreur Stripe" }, { status: 500 });
  }
}
