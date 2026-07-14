"use client";
import { useMemo, useState } from "react";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { useCart } from "@/lib/cart/store";

type Variant = {
  _key: string;
  size?: string;
  colorName?: string;
  sku?: string;
  price?: number;
  compareAtPrice?: number;
  stockStatus?: string;
  stripePriceId?: string;
};

type ColorOption = {
  _key: string;
  name: string;
  hex?: string;
  isDefault?: boolean;
  image?: SanityImage;
};

type SanityImage = { asset?: any; alt?: string };

type ProductVideo = {
  _key: string;
  alt?: string;
  autoplay?: boolean;
  file?: { asset?: { url?: string; mimeType?: string } };
  poster?: SanityImage;
};

type GalleryItem =
  | { type: "image"; key: string; image: SanityImage }
  | { type: "video"; key: string; video: ProductVideo };

export function ProductBuyBox({
  productId,
  productSlug,
  images,
  videos,
  variants,
  colors,
  name,
}: {
  productId: string;
  productSlug: string;
  images?: SanityImage[];
  videos?: ProductVideo[];
  variants?: Variant[];
  colors?: ColorOption[];
  name: string;
}) {
  const { add } = useCart();
  const [adding, setAdding] = useState(false);

  // ─── Sélection couleur ─────────────────────────────────────
  const hasColors = (colors?.length || 0) > 0;
  const defaultColor = colors?.find((c) => c.isDefault)?.name || colors?.[0]?.name;
  const [selectedColorName, setSelectedColorName] = useState<string | undefined>(defaultColor);
  const selectedColor = colors?.find((c) => c.name === selectedColorName);

  // ─── Galerie combinée (photos couleur → photos produit → vidéos) ──
  const gallery: GalleryItem[] = useMemo(() => {
    const items: GalleryItem[] = [];
    if (hasColors && selectedColor?.image?.asset) {
      items.push({ type: "image", key: `color-${selectedColor._key}`, image: selectedColor.image });
    }
    if (images?.length) {
      images.forEach((img, i) => {
        if (img?.asset) items.push({ type: "image", key: `img-${i}`, image: img });
      });
    }
    if (videos?.length) {
      videos.forEach((v) => {
        if (v?.file?.asset?.url) items.push({ type: "video", key: `vid-${v._key}`, video: v });
      });
    }
    return items;
  }, [images, videos, hasColors, selectedColor]);

  const [selectedImage, setSelectedImage] = useState(0);

  // Reset image quand on change de couleur
  useMemo(() => setSelectedImage(0), [selectedColorName]);

  // ─── Tailles dispo pour la couleur sélectionnée ──────────
  const availableVariants = useMemo(() => {
    if (!variants?.length) return [];
    const filtered = hasColors
      ? variants.filter((v) => (v.colorName || "").trim() === (selectedColorName || "").trim())
      : variants;
    // Dédup par taille (garde la moins chère)
    const bySize = new Map<string, Variant>();
    for (const v of filtered) {
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
  }, [variants, hasColors, selectedColorName]);

  const [selectedVariantKey, setSelectedVariantKey] = useState<string | null>(null);

  // Reset variant quand la liste change (nouvelle couleur)
  useMemo(() => {
    setSelectedVariantKey(availableVariants[0]?._key || null);
  }, [availableVariants]);

  const variant = availableVariants.find((v) => v._key === selectedVariantKey) || availableVariants[0];
  const price = variant?.price;
  const compareAtPrice = variant?.compareAtPrice;
  const discount = compareAtPrice && price ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : null;
  const inStock = variant?.stockStatus !== "rupture";

  const currentItem = gallery[selectedImage];
  // Pour le panier : on stocke l'URL de la 1re image dispo (jamais une vidéo)
  const cartImageSource: SanityImage | undefined =
    currentItem?.type === "image" ? currentItem.image : gallery.find((g) => g.type === "image") as any;
  const imageUrl = cartImageSource ? urlFor(cartImageSource).width(400).url() : undefined;

  async function handleAdd() {
    if (!variant || !price) return;
    setAdding(true);
    add({
      productId,
      productSlug,
      productName: name,
      variantKey: variant._key,
      variantSize: variant.size,
      variantColor: variant.colorName,
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
          {currentItem?.type === "image" && (
            <Image
              src={urlFor(currentItem.image).width(1000).quality(90).url()}
              alt={currentItem.image.alt || name}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              priority
              className="object-cover"
            />
          )}
          {currentItem?.type === "video" && currentItem.video.file?.asset?.url && (
            <video
              key={currentItem.key}
              src={currentItem.video.file.asset.url}
              poster={currentItem.video.poster?.asset ? urlFor(currentItem.video.poster).width(1000).url() : undefined}
              autoPlay={currentItem.video.autoplay !== false}
              muted
              loop
              playsInline
              controls
              aria-label={currentItem.video.alt || `Vidéo de présentation ${name}`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </div>
        {gallery.length > 1 && (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:thin]">
            {gallery.map((item, i) => {
              const isSel = i === selectedImage;
              const thumb =
                item.type === "image"
                  ? urlFor(item.image).width(200).url()
                  : item.video.poster?.asset
                    ? urlFor(item.video.poster).width(200).url()
                    : null;
              return (
                <button
                  key={item.key}
                  onClick={() => setSelectedImage(i)}
                  className={`group relative aspect-square w-16 flex-none overflow-hidden rounded-xl border-2 bg-sable transition-all md:w-20 ${
                    isSel ? "border-midnight" : "border-transparent hover:border-border"
                  }`}
                  aria-label={item.type === "video" ? `Lire la vidéo ${i + 1}` : `Voir image ${i + 1}`}
                >
                  {thumb ? (
                    <Image src={thumb} alt="" fill sizes="80px" className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-midnight" />
                  )}
                  {item.type === "video" && (
                    <span
                      aria-hidden
                      className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/40"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-midnight">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Buy box */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        {/* Sélecteur COULEUR */}
        {hasColors && colors && colors.length > 1 && (
          <div className="mb-6">
            <div className="mb-3 flex items-baseline gap-2 text-sm font-semibold uppercase tracking-wide text-pierre">
              <span>Couleur</span>
              <span className="text-ink normal-case">— {selectedColorName}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {colors.map((c) => {
                const isSel = c.name === selectedColorName;
                return (
                  <button
                    key={c._key}
                    onClick={() => setSelectedColorName(c.name)}
                    aria-label={c.name}
                    title={c.name}
                    className={`group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-2 transition-all md:h-16 md:w-16 ${
                      isSel ? "border-midnight shadow-md" : "border-border hover:border-midnight/50"
                    }`}
                  >
                    {c.image?.asset ? (
                      <Image
                        src={urlFor(c.image).width(120).height(120).url()}
                        alt={c.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className="block h-8 w-8 rounded-full border border-black/10"
                        style={{ background: c.hex || "#EEE" }}
                      />
                    )}
                    {isSel && (
                      <span className="absolute inset-0 rounded-2xl ring-2 ring-midnight ring-offset-2 ring-offset-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sélecteur TAILLE */}
        {availableVariants.length > 1 && (
          <div className="mb-6">
            <div className="mb-3 flex items-baseline gap-2 text-sm font-semibold uppercase tracking-wide text-pierre">
              <span>Taille</span>
              {variant?.size && <span className="text-ink normal-case">— {variant.size}</span>}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {availableVariants.map((v) => (
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

        {availableVariants.length === 0 && hasColors && (
          <div className="mb-6 rounded-xl border border-brume/60 bg-sable px-4 py-3 text-sm text-pierre">
            Aucune taille disponible dans cette couleur. Choisissez une autre couleur ci-dessus.
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
