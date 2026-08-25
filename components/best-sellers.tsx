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
      className="group relative flex flex-col overflow-hidden rounded-[20px] bg-ivoire transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_rgba(11,11,15,0.25)]"
    >
      {/* Image full-bleed */}
      <div className="relative aspect-[4/3] overflow-hidden bg-creme">
        {p.image ? (
          <Image
            src={urlFor(p.image).width(900).quality(88).url()}
            alt={(p.image as any)?.alt || p.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-taupe">
            <MattressIcon />
          </div>
        )}
        {/* Pill signature — Essayez en magasin */}
        <span className="absolute left-4 top-4 rounded-md bg-noir px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-ivoire">
          Essayez-le en magasin
        </span>
        {discount !== null && discount > 0 && (
          <span className="absolute right-4 top-4 rounded-md bg-discount px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-ivoire">
            −{discount}%
          </span>
        )}
      </div>

      {/* Contenu bas */}
      <div className="flex flex-col p-5 md:p-6">
        <div className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-taupe">
          {p.name}
        </div>
        <h3 className="mt-2 line-clamp-2 font-serif text-[16px] font-normal leading-snug text-noir md:text-[17px]">
          {p.tagline || p.title}
        </h3>
        <div className="mt-4 flex items-baseline gap-2.5">
          {p.compareAtPrice && p.compareAtPrice > (p.minPrice || 0) ? (
            <>
              <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">Dès</span>
              <span className="font-serif text-[1.35rem] font-semibold text-discount">
                {p.minPrice}€
              </span>
              <span className="font-sans text-[14px] text-taupe line-through">
                {p.compareAtPrice}€
              </span>
            </>
          ) : (
            <>
              <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">Dès</span>
              <span className="font-serif text-[1.35rem] font-semibold text-noir">
                {p.minPrice}€
              </span>
            </>
          )}
        </div>
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
