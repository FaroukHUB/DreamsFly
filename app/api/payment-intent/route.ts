import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { priceCart, CartPricingError, type PricedCart } from "@/lib/cart/price-server";
import { enforceRateLimit } from "@/lib/rate-limit";
import { sanityWriteClient } from "@/lib/sanity/client";

/**
 * POST /api/payment-intent — prépare un paiement pour le tunnel intégré.
 *
 * Body     : { lines: [{ productId, variantKey, quantity }], email?, paymentIntentId? }
 * Réponse  : { clientSecret, amount, subtotal, shipping, lines }
 *
 * Le navigateur n'envoie que des références et des quantités. Les prix sont
 * relus dans Sanity par `priceCart()` : c'est ce montant, et lui seul, qui
 * est envoyé à Stripe. Voir lib/cart/price-server.ts.
 *
 * Le détail de la commande est enregistré dans un document Sanity `order`
 * au statut « pending », dont l'identifiant voyage dans les métadonnées du
 * PaymentIntent. Le webhook n'a alors qu'à basculer ce document en « paid ».
 * On évite ainsi la limite de 500 caractères par valeur de métadonnée
 * Stripe, qui déborderait sur un panier de plusieurs lignes.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Libellé ajouté sur le relevé bancaire du client.
 *
 * Le compte Stripe porte le nom de la société, qui exploite plusieurs
 * marques. Sans ce suffixe, un client DreamsFly voit sur son relevé un nom
 * qu'il ne reconnaît pas — première cause de contestation de paiement : le
 * client fait opposition sur un achat pourtant légitime, et la société paie
 * des frais de litige.
 *
 * Le relevé affichera « PREFIXE* DREAMSFLY ».
 *
 * ⚠️  Contrainte Stripe : préfixe + « * » + espace + suffixe ≤ 22 caractères.
 * Avec un préfixe de 14 caractères, il ne reste que 6 caractères de suffixe.
 * Le préfixe se lit dans Stripe → Paramètres → Informations publiques.
 * Ajuster via STRIPE_STATEMENT_SUFFIX si le libellé est tronqué.
 *
 * Caractères interdits par Stripe : < > ' " *
 */
const STATEMENT_SUFFIX = (process.env.STRIPE_STATEMENT_SUFFIX || "DREAMSFLY")
  .replace(/[<>'"*]/g, "")
  .trim()
  .slice(0, 22);

const BodySchema = z.object({
  lines: z
    .array(
      z.object({
        productId: z.string().min(1).max(200),
        variantKey: z.string().min(1).max(100),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1)
    .max(30),
  email: z.string().trim().email().max(254).optional().or(z.literal("")),
  /**
   * PaymentIntent déjà ouvert pour ce panier. Permet de mettre à jour le
   * montant quand le client modifie son panier sans repartir de zéro —
   * et sans laisser derrière lui une traînée d'intentions abandonnées.
   */
  paymentIntentId: z.string().max(200).optional(),
});

export async function POST(req: NextRequest) {
  // 30 tentatives / 10 min / IP : large pour un tunnel normal (le montant
  // est rafraîchi à chaque changement de panier), serré pour un script.
  const limited = enforceRateLimit(req, "payment-intent", 30, 10 * 60_000);
  if (limited) return limited;

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Paiement indisponible." }, { status: 503 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: "Panier invalide." }, { status: 400 });
  }
  const { lines, email, paymentIntentId } = parsed.data;

  let cart: PricedCart;
  try {
    cart = await priceCart(lines);
  } catch (err) {
    if (err instanceof CartPricingError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error("[payment-intent] pricing:", err);
    return NextResponse.json({ error: "Impossible de calculer le total." }, { status: 500 });
  }

  const stripe = new Stripe(secret);

  try {
    const orderId = await upsertPendingOrder(cart, email, paymentIntentId);

    const metadata: Record<string, string> = {
      source: "dreamsfly-web",
      // Sépare les deux marques du compte dans les exports et les rapports
      // Stripe : la société est unique, les activités ne le sont pas.
      brand: "DreamsFly",
      // Le webhook retrouve la commande par cette clé.
      ...(orderId ? { sanityOrderId: orderId } : {}),
    };

    let intent: Stripe.PaymentIntent;
    if (paymentIntentId) {
      // Mise à jour d'un paiement en cours (panier modifié). Stripe refuse
      // la mise à jour d'une intention déjà réglée ou annulée — dans ce cas
      // on repart proprement sur une nouvelle.
      try {
        intent = await stripe.paymentIntents.update(paymentIntentId, {
          amount: cart.total,
          metadata,
          ...(email ? { receipt_email: email } : {}),
        });
      } catch {
        intent = await stripe.paymentIntents.create({
          amount: cart.total,
          currency: "eur",
          automatic_payment_methods: { enabled: true },
          metadata,
          ...(STATEMENT_SUFFIX ? { statement_descriptor_suffix: STATEMENT_SUFFIX } : {}),
          ...(email ? { receipt_email: email } : {}),
        });
      }
    } else {
      intent = await stripe.paymentIntents.create({
        amount: cart.total,
        currency: "eur",
        automatic_payment_methods: { enabled: true },
        metadata,
        ...(STATEMENT_SUFFIX ? { statement_descriptor_suffix: STATEMENT_SUFFIX } : {}),
        ...(email ? { receipt_email: email } : {}),
      });
    }

    // L'identifiant du PaymentIntent n'existe qu'après création : on le
    // réinjecte dans la commande pour que le prochain rafraîchissement du
    // panier retrouve CE document au lieu d'en créer un nouveau à chaque fois.
    if (orderId && sanityWriteClient) {
      try {
        await sanityWriteClient.patch(orderId).set({ stripePaymentIntent: intent.id }).commit();
      } catch (err) {
        console.error("[payment-intent] liaison commande ↔ intent:", err);
      }
    }

    return NextResponse.json({
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      subtotal: cart.subtotal,
      shipping: cart.shipping,
      amount: cart.total,
      // Moyens de paiement réellement activés sur le compte Stripe pour ce
      // montant. La page les affiche tels quels : impossible d'y promettre
      // un moyen de paiement qui ne serait pas proposé au client.
      paymentMethodTypes: intent.payment_method_types,
      // Renvoyé pour que le récapitulatif affiche les prix du serveur,
      // pas ceux du localStorage : si les deux divergent, le client voit
      // immédiatement le montant réellement facturé.
      lines: cart.lines,
    });
  } catch (err: any) {
    console.error("[payment-intent]", err);
    return NextResponse.json({ error: "Le paiement n'a pas pu être initialisé." }, { status: 502 });
  }
}

/**
 * Écrit (ou met à jour) la commande en attente dans Sanity.
 *
 * Renvoie l'identifiant du document, ou null si l'écriture échoue : un
 * problème de CMS ne doit pas empêcher un client de payer. Dans ce cas la
 * commande sera reconstruite par le webhook à partir de Stripe seul.
 */
async function upsertPendingOrder(
  cart: PricedCart,
  email: string | undefined,
  paymentIntentId: string | undefined,
): Promise<string | null> {
  if (!sanityWriteClient) return null;

  const items = cart.lines.map((l) => ({
    _key: l.variantKey,
    name: [l.productName, l.size].filter(Boolean).join(" — "),
    quantity: l.quantity,
    unitAmount: l.unitAmount / 100,
    totalAmount: l.lineAmount / 100,
  }));

  try {
    if (paymentIntentId) {
      const existing = await sanityWriteClient.fetch<{ _id: string } | null>(
        `*[_type == "order" && stripePaymentIntent == $pi][0]{ _id }`,
        { pi: paymentIntentId },
      );
      if (existing?._id) {
        await sanityWriteClient
          .patch(existing._id)
          .set({
            items,
            totalAmount: cart.total / 100,
            shippingAmount: cart.shipping / 100,
            ...(email ? { customerEmail: email } : {}),
          })
          .commit();
        return existing._id;
      }
    }

    const created = await sanityWriteClient.create({
      _type: "order",
      status: "pending",
      currency: "eur",
      items,
      totalAmount: cart.total / 100,
      shippingAmount: cart.shipping / 100,
      ...(email ? { customerEmail: email } : {}),
      ...(paymentIntentId ? { stripePaymentIntent: paymentIntentId } : {}),
      createdAt: new Date().toISOString(),
    });
    return created._id;
  } catch (err) {
    console.error("[payment-intent] écriture commande Sanity:", err);
    return null;
  }
}
