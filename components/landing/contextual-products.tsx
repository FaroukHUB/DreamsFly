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
      <h2 className="mb-2 font-sora text-3xl font-semibold tracking-tight text-ink">
        Nos matelas recommandés
      </h2>
      <p className="mb-8 max-w-2xl text-pierre">
        Sélection automatique parmi notre collection — adaptée à cette page.
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
              className="group flex flex-col rounded-2xl border border-border bg-ivoire p-4 transition-all hover:-translate-y-1 hover:border-midnight"
            >
              <div className="relative mb-4 aspect-[5/4] overflow-hidden rounded-xl bg-sable">
                {p.image && (
                  <Image
                    src={urlFor(p.image).width(500).url()}
                    alt={p.name}
                    fill
                    sizes="(max-width:1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                {discount !== null && discount > 0 && (
                  <span className="absolute left-3 top-3 rounded bg-discount px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                    -{discount}%
                  </span>
                )}
              </div>
              <h3 className="font-sora text-base font-semibold text-ink">{p.name}</h3>
              <p className="mb-3 line-clamp-2 text-[13px] text-pierre">{p.tagline}</p>
              <div className="mt-auto flex items-baseline gap-2 border-t border-border pt-3">
                <span className="text-[11px] text-brume">Dès</span>
                <span className="font-sora text-lg font-bold text-discount">{price} €</span>
                {compareAtPrice && compareAtPrice > price && (
                  <span className="text-xs text-brume line-through">{compareAtPrice} €</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
