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
    <section className="section-cream section-editorial">
      <div className="mx-auto max-w-site">
        <div className="mb-14 max-w-3xl reveal md:mb-20">
          <span className="eyebrow-editorial on-cream mb-3">Notre collection signature</span>
          <h2 className="display-serif on-cream mt-5 text-[2.4rem] font-normal md:text-[4rem]">
            Le sommeil porte un <em>nom</em>.
          </h2>
          <p className="mt-6 max-w-lg font-sans text-[15px] leading-relaxed text-taupe md:text-[17px]">
            Chaque matelas porte le nom d'une ville du monde. Choisissez votre destination de sommeil.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
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
      className="group relative flex flex-col rounded-[28px] border border-ink/10 bg-ivoire p-6 transition-all duration-500 hover:-translate-y-2 hover:border-noir/40 hover:shadow-[0_30px_60px_-20px_rgba(11,11,15,0.25)] md:p-7"
    >
      <div className="relative mb-7 aspect-[4/3] overflow-hidden rounded-[20px] bg-creme p-4">
        {p.image ? (
          <Image
            src={urlFor(p.image).width(700).quality(88).url()}
            alt={(p.image as any)?.alt || p.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain transition-transform duration-[900ms] group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-taupe">
            <MattressIcon />
          </div>
        )}
        {discount !== null && discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-noir px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-or">
            −{discount}%
          </span>
        )}
        {p.badges?.includes("new") && (
          <span className="absolute right-3 top-3 rounded-full border border-noir bg-ivoire px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-noir">
            Nouveau
          </span>
        )}
      </div>

      <h3 className="display-serif on-cream text-[1.4rem] font-normal leading-tight md:text-[1.7rem]">
        {p.name}
      </h3>
      <p className="mt-3 line-clamp-2 font-sans text-[14px] leading-relaxed text-taupe md:text-[15px]">
        {p.tagline || p.title}
      </p>

      <div className="mt-6 flex items-baseline gap-3 border-t border-ink/10 pt-5">
        <span className="font-sans text-[11px] uppercase tracking-[0.16em] text-taupe">Dès</span>
        <span className="font-serif text-[1.7rem] font-normal text-noir md:text-[1.9rem]">
          {p.minPrice}€
        </span>
        {p.compareAtPrice && p.compareAtPrice > (p.minPrice || 0) && (
          <span className="font-sans text-[14px] text-taupe line-through">
            {p.compareAtPrice}€
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
