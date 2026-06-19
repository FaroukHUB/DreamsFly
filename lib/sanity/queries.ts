import { groq } from "next-sanity";

/** Récupère le contenu complet de la page d'accueil (hero modulaire + sections). */
export const homepageQuery = groq`
  *[_type == "homepage"][0]{
    hero {
      type,
      videoFile { asset->{url, originalFilename} },
      videoPoster { ..., asset->{...} },
      image { ..., asset->{...}, alt },
      promoBadge,
      promoImage { ..., asset->{...} },
      promoPrice,
      title,
      subtitle,
      ctaPrimary,
      ctaSecondary,
      trustNote
    },
    heroSecondary,
    uspStrip,
    trustCounter,
    bestSellers[]->{
      _id, name, title, "slug": slug.current, tagline, type, firmness, thicknessCm,
      "image": images[0],
      "minPrice": variants[0].price,
      "compareAtPrice": variants[0].compareAtPrice,
      badges,
      rating
    },
    quizCta {
      ...,
      backgroundImage{ ..., asset->{...} }
    },
    categoryTiles[]{
      ...,
      image{ ..., asset->{...} }
    },
    mosaicCollections[]{
      ...,
      image{ ..., asset->{...} }
    },
    awards,
    brandStatement,
    advantages,
    seo
  }
`;

/** Paramètres globaux du site (header / footer / top bar). */
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]
`;

/** Liste paginée de tous les matelas. */
export const productsListQuery = groq`
  *[_type == "product"] | order(name asc) {
    _id, name, title, "slug": slug.current, tagline, type, firmness,
    "image": images[0],
    "minPrice": variants[0].price,
    "compareAtPrice": variants[0].compareAtPrice,
    badges,
    rating
  }
`;

/** Fiche produit par slug. */
export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0]{
    ...,
    images[]{ ..., asset->{...} },
    relatedProducts[]->{
      _id, name, title, "slug": slug.current, tagline,
      "image": images[0],
      "minPrice": variants[0].price
    }
  }
`;
