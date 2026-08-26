import "server-only";
import { sanityClient } from "@/lib/sanity/client";
import { SHIPPING_FEE_EUR, UNAVAILABLE_STOCK_STATUSES } from "@/lib/cart/constants";

/**
 * Tarification autoritaire du panier — SERVEUR UNIQUEMENT.
 *
 * ⚠️  Règle de sécurité : on ne fait JAMAIS confiance aux prix envoyés par
 * le navigateur. Le panier vit dans le localStorage du client, donc
 * n'importe qui peut y écrire `unitPrice: 1` et payer un matelas 1 €.
 * Le client n'envoie que des identifiants et des quantités ; tous les
 * montants sont relus dans Sanity ici.
 *
 * Le montant renvoyé par `priceCart()` est le seul qui doit servir à
 * créer un PaymentIntent.
 */

/** Ce que le navigateur a le droit d'envoyer : des références, pas des prix. */
export type CartRef = {
  productId: string;
  /** `_key` de la variante dans le tableau `variants` du produit Sanity. */
  variantKey: string;
  quantity: number;
};

export type PricedLine = {
  productId: string;
  productName: string;
  productSlug?: string;
  variantKey: string;
  size?: string;
  colorName?: string;
  sku?: string;
  /** Prix unitaire en centimes, relu dans Sanity. */
  unitAmount: number;
  quantity: number;
  /** unitAmount × quantity, en centimes. */
  lineAmount: number;
};

export type PricedCart = {
  lines: PricedLine[];
  /** Tous les montants sont en centimes — l'unité attendue par Stripe. */
  subtotal: number;
  shipping: number;
  total: number;
};

export class CartPricingError extends Error {}

/** Quantité maximale par ligne — garde-fou contre les commandes absurdes. */
const MAX_QUANTITY_PER_LINE = 20;

/**
 * Convertit des euros en centimes sans erreur de virgule flottante.
 * `Math.round(139.99 * 100)` donne bien 13999, mais on centralise la
 * conversion pour qu'elle soit faite au même endroit partout.
 */
function toCents(euros: number): number {
  return Math.round(euros * 100);
}

/**
 * Relit les prix dans Sanity et recalcule le total.
 *
 * Lève une CartPricingError si une référence ne correspond à rien —
 * mieux vaut refuser la commande que facturer un montant douteux.
 */
export async function priceCart(refs: CartRef[]): Promise<PricedCart> {
  if (!sanityClient) {
    throw new CartPricingError("Catalogue indisponible — commande impossible.");
  }
  if (!Array.isArray(refs) || refs.length === 0) {
    throw new CartPricingError("Panier vide.");
  }

  // Normalisation défensive : on ne garde que des entiers positifs.
  const cleaned = refs.map((r) => {
    const quantity = Math.floor(Number(r?.quantity));
    if (!Number.isFinite(quantity) || quantity < 1) {
      throw new CartPricingError("Quantité invalide.");
    }
    if (quantity > MAX_QUANTITY_PER_LINE) {
      throw new CartPricingError(
        `Quantité maximale de ${MAX_QUANTITY_PER_LINE} par article. Contactez-nous pour une commande en volume.`,
      );
    }
    if (typeof r?.productId !== "string" || typeof r?.variantKey !== "string") {
      throw new CartPricingError("Référence produit invalide.");
    }
    return { productId: r.productId, variantKey: r.variantKey, quantity };
  });

  const ids = [...new Set(cleaned.map((r) => r.productId))];
  const products: any[] = await sanityClient.fetch(
    `*[_type == "product" && _id in $ids]{
      _id, name, "slug": slug.current,
      variants[]{ _key, size, colorName, sku, price, stockStatus }
    }`,
    { ids },
  );

  const byId = new Map(products.map((p) => [p._id, p]));

  const lines: PricedLine[] = cleaned.map((ref) => {
    const product = byId.get(ref.productId);
    if (!product) {
      throw new CartPricingError("Un article de votre panier n'est plus disponible.");
    }
    const variant = (product.variants || []).find((v: any) => v._key === ref.variantKey);
    if (!variant) {
      throw new CartPricingError(
        `La taille choisie pour « ${product.name} » n'est plus disponible.`,
      );
    }
    // « precommande » reste commandable — seul « rupture » bloque l'achat.
    if (UNAVAILABLE_STOCK_STATUSES.includes(variant.stockStatus)) {
      throw new CartPricingError(`« ${product.name} » n'est plus en stock dans cette taille.`);
    }
    const price = Number(variant.price);
    if (!Number.isFinite(price) || price <= 0) {
      throw new CartPricingError(`Prix indisponible pour « ${product.name} ».`);
    }

    const unitAmount = toCents(price);
    return {
      productId: product._id,
      productName: product.name,
      productSlug: product.slug,
      variantKey: variant._key,
      size: variant.size,
      colorName: variant.colorName,
      sku: variant.sku,
      unitAmount,
      quantity: ref.quantity,
      lineAmount: unitAmount * ref.quantity,
    };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.lineAmount, 0);
  const shipping = toCents(SHIPPING_FEE_EUR);

  return { lines, subtotal, shipping, total: subtotal + shipping };
}
