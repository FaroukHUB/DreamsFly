import Image from "next/image";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";

/**
 * Sélection hiérarchique :
 *  1. Si homepage.bestSellers[] a des refs → on les prend (contrôle manuel)
 *  2. Sinon on prend les matelas featured==true (via ce query)
 *  3. Sinon fallback : matelas les plus récents
 * Le tout filtre productType == "matelas" || undefined pour éviter que
 * les lits importés récemment ne prennent la place des matelas.
 */
const featuredMatelasQuery = `
  *[_type == "product" && featured == true && (productType == "matelas" || !defined(productType))]
    | order(name asc) [0..3] {
    _id, name, title, "slug": slug.current, tagline, type, firmness, thicknessCm,
    "image": images[0],
    "minPrice": variants[0].price,
    "compareAtPrice": variants[0].compareAtPrice,
    badges
  }
`;

const fallbackMatelasQuery = `
  *[_type == "product" && (productType == "matelas" || !defined(productType))]
    | order(_createdAt desc) [0..3] {
    _id, name, title, "slug": slug.current, tagline, type, firmness, thicknessCm,
    "image": images[0],
    "minPrice": variants[0].price,
    "compareAtPrice": variants[0].compareAtPrice,
    badges
  }
`;

type Product = {
  _id: string;
  name: string;
  title: string;
  slug: string;
  tagline?: string;
  type?: string;
  firmness?: string;
  thicknessCm?: number;
  image?: any;
  minPrice?: number;
  compareAtPrice?: number;
  badges?: string[];
};

export async function BestSellers({ manualProducts }: { manualProducts?: Product[] }) {
  let products: Product[] = manualProducts?.filter(Boolean) ?? [];

  if (!products.length && sanityClient) {
    try {
      products = (await sanityClient.fetch<Product[]>(featuredMatelasQuery)) ?? [];
    } catch (err) {
      console.error("[BestSellers] featured fetch failed:", err);
    }
  }

  if (!products.length && sanityClient) {
    try {
      products = (await sanityClient.fetch<Product[]>(fallbackMatelasQuery)) ?? [];
    } catch (err) {
      console.error("[BestSellers] fallback fetch failed:", err);
    }
  }

  if (!products.length) return null;

  return (
    <section className="mx-auto max-w-site px-6 py-16 md:px-8 md:py-24">
      <div className="mb-10 text-center md:mb-12">
        <div className="eyebrow mb-3">Notre collection signature</div>
        <h2 className="font-sora text-3xl font-semibold tracking-tight text-ink md:text-5xl">
          Le sommeil porte un nom.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-pierre">
          Chaque matelas porte le nom d'une ville du monde.
          Choisissez votre destination de sommeil.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  const discount =
    p.compareAtPrice && p.minPrice
      ? Math.round(((p.compareAtPrice - p.minPrice) / p.compareAtPrice) * 100)
      : null;

  return (
    <Link
      href={`/matelas/${p.slug}`}
      className="group relative flex flex-col rounded-2xl border border-border bg-ivoire p-4 transition-all duration-300 hover:-translate-y-1 hover:border-midnight hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
    >
      <div className="relative mb-5 aspect-[5/4] overflow-hidden rounded-xl bg-sable">
        {p.image ? (
          <Image
            src={urlFor(p.image).width(600).quality(85).url()}
            alt={(p.image as any)?.alt || p.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brume">
            <MattressIcon />
          </div>
        )}
        {discount !== null && discount > 0 && (
          <span className="absolute left-3 top-3 rounded bg-discount px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
            -{discount}%
          </span>
        )}
        {p.badges?.includes("new") && (
          <span className="absolute right-3 top-3 rounded bg-midnight px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
            Nouveau
          </span>
        )}
      </div>

      <h3 className="font-sora text-lg font-semibold tracking-tight text-ink">
        {p.name}
      </h3>
      <p className="mb-4 line-clamp-2 text-[13px] text-pierre">
        {p.tagline || p.title}
      </p>

      <div className="mt-auto flex items-baseline gap-2 border-t border-border pt-3">
        <span className="text-[11px] uppercase tracking-wide text-brume">Dès</span>
        <span className="font-sora text-xl font-bold text-discount">
          {p.minPrice} €
        </span>
        {p.compareAtPrice && p.compareAtPrice > (p.minPrice || 0) && (
          <span className="text-[13px] text-brume line-through">
            {p.compareAtPrice} €
          </span>
        )}
      </div>
    </Link>
  );
}

function MattressIcon() {
  return (
    <svg width="80" height="48" viewBox="0 0 80 48" fill="none" className="opacity-30">
      <rect x="2" y="20" width="76" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <line x1="14" y1="20" x2="14" y2="40" stroke="currentColor" strokeWidth="1" />
      <line x1="26" y1="20" x2="26" y2="40" stroke="currentColor" strokeWidth="1" />
      <line x1="40" y1="20" x2="40" y2="40" stroke="currentColor" strokeWidth="1" />
      <line x1="54" y1="20" x2="54" y2="40" stroke="currentColor" strokeWidth="1" />
      <line x1="66" y1="20" x2="66" y2="40" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
