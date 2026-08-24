import Image from "next/image";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";

/**
 * Produits contextuels à la landing — affiche automatiquement les matelas
 * pertinents selon le pageType + slug.
 *
 * Ex : pageType=size + slug=matelas-140x190 → filtre les produits ayant
 * une variante 140x190.
 *
 * Pas affiché si l'éditeur a déjà ajouté un bloc productsGrid manuel.
 */
type Props = {
  pageType?: string;
  slug?: string;
  alreadyHasProductsGrid?: boolean;
};

export async function ContextualProducts({ pageType, slug, alreadyHasProductsGrid }: Props) {
  if (alreadyHasProductsGrid || !pageType || !sanityClient) return null;

  let products: any[] = [];

  if (pageType === "size") {
    // Extract size from slug (matelas-140x190 → 140 x 190)
    const sizeMatch = slug?.match(/(\d{2,3})\s*x?\s*(\d{2,3})/i);
    if (sizeMatch) {
      const sizeQuery = `${sizeMatch[1]} x ${sizeMatch[2]}`;
      products = await sanityClient.fetch<any[]>(
        `*[_type == "product" && count(variants[size match $size]) > 0] | order(name asc) [0..3]{
          _id, name, title, "slug": slug.current, tagline,
          "image": images[0],
          "minPrice": variants[variants[size match $size][0].size][0].price,
          "matchingVariant": variants[size match $size][0]{ price, compareAtPrice }
        }`,
        { size: `*${sizeQuery}*` }
      );
    }
  } else if (pageType === "technology") {
    const typeMap: Record<string, string> = {
      "matelas-memoire-de-forme": "memoire-ressorts",
      "matelas-hybride": "memoire-ressorts",
      "matelas-ressorts-ensaches": "mousse-ressorts",
      "matelas-mousse": "mousse-polyurethane",
    };
    const type = slug ? typeMap[slug] : undefined;
    if (type) {
      products = await sanityClient.fetch<any[]>(
        `*[_type == "product" && type == $type] | order(name asc) [0..3]{
          _id, name, title, "slug": slug.current, tagline,
          "image": images[0],
          "minPrice": variants[0].price,
          "compareAtPrice": variants[0].compareAtPrice
        }`,
        { type }
      );
    }
  } else if (pageType === "firmness") {
    const firmnessMap: Record<string, string> = {
      "matelas-ferme": "ferme",
      "matelas-mi-ferme": "mi-ferme",
      "matelas-moelleux": "moelleux",
    };
    const firmness = slug ? firmnessMap[slug] : undefined;
    if (firmness) {
      products = await sanityClient.fetch<any[]>(
        `*[_type == "product" && firmness == $firmness] | order(name asc) [0..3]{
          _id, name, title, "slug": slug.current, tagline,
          "image": images[0],
          "minPrice": variants[0].price,
          "compareAtPrice": variants[0].compareAtPrice
        }`,
        { firmness }
      );
    }
  }

  if (!products.length) return null;

  return (
    <section>
      <span className="eyebrow-editorial on-cream mb-3">Sélection contextuelle</span>
      <h2 className="display-serif on-cream mt-3 text-[1.9rem] font-normal md:text-[2.6rem]">
        Nos matelas <em>recommandés</em>
      </h2>
      <p className="mt-4 mb-10 max-w-2xl font-sans text-[15px] leading-relaxed text-taupe md:text-[17px]">
        Sélection automatique parmi notre collection — adaptée à cette page.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8">
        {products.map((p) => {
          const price = p.matchingVariant?.price || p.minPrice;
          const compareAtPrice = p.matchingVariant?.compareAtPrice || p.compareAtPrice;
          const discount =
            compareAtPrice && price
              ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
              : null;
          return (
            <Link
              key={p._id}
              href={`/matelas/${p.slug}`}
              className="group flex flex-col rounded-[24px] border border-ink/10 bg-ivoire p-5 transition-all duration-500 hover:-translate-y-1 hover:border-noir/40 hover:shadow-[0_24px_50px_-20px_rgba(11,11,15,0.2)]"
            >
              <div className="relative mb-5 aspect-[5/4] overflow-hidden rounded-[16px] bg-creme">
                {p.image && (
                  <Image
                    src={urlFor(p.image).width(600).url()}
                    alt={p.name}
                    fill
                    sizes="(max-width:1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
                  />
                )}
                {discount !== null && discount > 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-noir px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-or">
                    −{discount}%
                  </span>
                )}
              </div>
              <h3 className="display-serif on-cream text-[1.1rem] font-normal">{p.name}</h3>
              <p className="mt-2 line-clamp-2 font-sans text-[13px] leading-relaxed text-taupe">{p.tagline}</p>
              <div className="mt-4 flex items-baseline gap-2 border-t border-ink/10 pt-3">
                <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">Dès</span>
                <span className="font-serif text-[1.25rem] font-normal text-noir">{price}€</span>
                {compareAtPrice && compareAtPrice > price && (
                  <span className="font-sans text-[13px] text-taupe line-through">{compareAtPrice}€</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
