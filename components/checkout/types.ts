/** Ligne de panier telle que le serveur l'a tarifée. Montants en centimes. */
export type PricedLine = {
  productId: string;
  productName: string;
  productSlug?: string;
  variantKey: string;
  size?: string;
  colorName?: string;
  sku?: string;
  unitAmount: number;
  quantity: number;
  lineAmount: number;
};

/** Formate des centimes en euros — « 1 299,00 € ». */
export function formatCents(cents: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);
}
