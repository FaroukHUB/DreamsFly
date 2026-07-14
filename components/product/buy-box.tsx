"use client";
import { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { useCart } from "@/lib/cart/store";

type Variant = {
  _key: string;
  size?: string;
  sku?: string;
  price?: number;
  compareAtPrice?: number;
  stockStatus?: string;
  stripePriceId?: string;
};

type SanityImage = { asset?: any; alt?: string };

export function ProductBuyBox({
  productId,
  productSlug,
  images,
  variants,
  name,
}: {
  productId: string;
  productSlug: string;
  images?: SanityImage[];
  variants?: Variant[];
  name: string;
}) {
  // Dédup par taille : garde la variante la moins chère par taille distincte,
  // trie ensuite par taille croissante (90 → 180).
  const uniqueVariants = (() => {
    if (!variants?.length) return [];
    const bySize = new Map<string, Variant>();
    for (const v of variants) {
      const size = (v.size || "").trim();
      if (!size) continue;
      const existing = bySize.get(size);
      if (!existing || (v.price ?? Infinity) < (existing.price ?? Infinity)) {
        bySize.set(size, v);
      }
    }
    const parseWidth = (s: string) => {
      const m = s.match(/(\d+)/);
      return m ? parseInt(m[1], 10) : 9999;
    };
    return Array.from(bySize.values()).sort((a, b) => parseWidth(a.size!) - parseWidth(b.size!));
  })();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantKey, setSelectedVariantKey] = useState<string | null>(
    uniqueVariants[0]?._key || null
  );
  const { add } = useCart();
  const [adding, setAdding] = useState(false);

  const variant = uniqueVariants.find((v) => v._key === selectedVariantKey) || uniqueVariants[0];
  const price = variant?.price;
  const compareAtPrice = variant?.compareAtPrice;
  const discount = compareAtPrice && price ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : null;
  const inStock = variant?.stockStatus !== "rupture";

  const imageUrl = images?.[selectedImage] ? urlFor(images[selectedImage]).width(400).url() : undefined;

  async function handleAdd() {
    if (!variant || !price) return;
    setAdding(true);
    add({
      productId,
      productSlug,
      productName: name,
      variantKey: variant._key,
      variantSize: variant.size,
      sku: variant.sku,
      unitPrice: price,
      compareAtPrice,
      image: imageUrl,
      stripePriceId: variant.stripePriceId,
    });
    setTimeout(() => setAdding(false), 800);
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.1fr_1fr]">
      {/* Galerie */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-sable">
          {images?.[selectedImage] && (
            <Image
              src={urlFor(images[selectedImage]).width(1000).quality(90).url()}
              alt={images[selectedImage].alt || name}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
              className="object-cover"
            />
          )}
        </div>
        {images && images.length > 1 && (
          <div className="mt-4 grid grid-cols-5 gap-3">
            {images.slice(0, 5).map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-sable transition-all ${
                  i === selectedImage ? "border-midnight" : "border-transparent hover:border-border"
                }`}
                aria-label={`Voir image ${i + 1}`}
              >
                <Image src={urlFor(img).width(200).url()} alt={img.alt || ""} fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Buy box */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        {uniqueVariants.length > 1 && (
          <div className="mb-6">
            <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-pierre">Taille</div>
            <div className="grid grid-cols-3 gap-2">
              {uniqueVariants.map((v) => (
                <button
                  key={v._key}
                  onClick={() => setSelectedVariantKey(v._key)}
                  className={`rounded-xl border-2 p-3 text-sm font-medium transition-all ${
                    v._key === selectedVariantKey
                      ? "border-midnight bg-midnight text-white"
                      : "border-border bg-ivoire text-ink hover:border-midnight"
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 flex items-baseline gap-3 border-y border-border py-5">
          {discount !== null && discount > 0 && (
            <span className="rounded bg-discount px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
              -{discount}%
            </span>
          )}
          <span className="font-sora text-4xl font-bold text-discount">{price} €</span>
          {compareAtPrice && compareAtPrice > (price || 0) && (
            <span className="text-lg text-brume line-through">{compareAtPrice} €</span>
          )}
        </div>

        <div className="mb-6 flex items-center gap-2 text-sm">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${inStock ? "bg-success" : "bg-error"}`} />
          <span className="font-medium text-ink">
            {inStock ? "En stock — expédition sous 48h" : "Rupture temporaire"}
          </span>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAdd}
            disabled={!inStock || !price || adding}
            className="flex w-full items-center justify-center gap-2 rounded-pill bg-midnight px-7 py-4 font-sora text-base font-semibold text-white transition-all hover:bg-midnight-dark hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
          >
            {adding ? "✓ Ajouté !" : "Ajouter au panier"}
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-pierre">
          ou <strong className="text-ink">{Math.round((price || 0) / 4)} €</strong> × 4 sans frais avec Alma
        </p>

        <ul className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
          <ReassuranceItem icon="🚚" title="Livraison à domicile" subtitle="Dès 39 € · partout en France" />
          <ReassuranceItem icon="🏬" title="3 magasins physiques" subtitle="Venez tester en boutique" />
          <ReassuranceItem icon="🔒" title="Paiement 100 % sécurisé" subtitle="Alma · Stripe · CB" />
          <ReassuranceItem icon="🛡️" title="Garantie 2 ans" subtitle="Confection française" />
        </ul>
      </div>
    </div>
  );
}

function ReassuranceItem({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <li className="flex items-start gap-3">
      <span aria-hidden className="text-lg">{icon}</span>
      <span className="flex flex-col">
        <strong className="text-[14px] font-semibold text-ink">{title}</strong>
        <span className="text-[12.5px] text-pierre">{subtitle}</span>
      </span>
    </li>
  );
}
