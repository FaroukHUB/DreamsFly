import { groq } from "next-sanity";

/** Récupère une fiche produit complète par slug (tous types). */
export const productBySlugFullQuery = groq`
  *[_type == "product" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    lifestyleImage{ ..., asset->{...} },
    compositionImage{ ..., asset->{...} },
    compositionVideo{ asset->{url} },
    images[]{ ..., asset->{...}, "alt": coalesce(alt, ^.name) },
    videos[]{
      _key, alt, autoplay,
      file{ asset->{url, mimeType} },
      poster{ ..., asset->{...} }
    },
    colors[]{
      _key, name, hex, isDefault,
      image{ ..., asset->{...} }
    },
    variants[]{
      _key, size, colorName, sku, price, compareAtPrice, weightKg, stockStatus, stripePriceId
    },
    relatedProducts[]->{
      _id, name, title, "slug": slug.current, tagline,
      "image": images[0],
      "minPrice": variants[0].price,
      "compareAtPrice": variants[0].compareAtPrice,
      badges
    }
  }
`;

/** Slugs publiés pour generateStaticParams. */
export const allProductSlugsQuery = groq`
  *[_type == "product" && defined(slug.current)]{ "slug": slug.current }
`;

/** Liste produits pour la page pilier /matelas — matelas uniquement (+ legacy sans type). */
export const allProductsForPillarQuery = groq`
  *[_type == "product" && (productType == "matelas" || !defined(productType))] | order(name asc) {
    _id, name, title, "slug": slug.current, tagline, type, firmness,
    thicknessCm,
    "image": images[0],
    "minPrice": variants[0].price,
    "compareAtPrice": variants[0].compareAtPrice,
    "variants": variants[]{ size },
    badges, rating
  }
`;

/** Page pilier configurée dans Sanity (landingPage avec slug=matelas). */
export const pillarPageQuery = groq`
  *[_type == "landingPage" && slug.current == "matelas"][0]{
    _id, h1, intro, metaTitle, metaDescription, editorialAngle,
    sections[]{
      ...,
      _type == "productsGrid" => {
        ...,
        manualProducts[]->{
          _id, name, title, "slug": slug.current, tagline,
          "image": images[0],
          "minPrice": variants[0].price,
          "compareAtPrice": variants[0].compareAtPrice,
          badges
        }
      }
    },
    categoryAdvantagesOverride,
    buyingCriteriaOverride,
    categoryTipsOverride,
    categoryCareStepsOverride,
    categoryFaqOverride,
    categoryComparisonOverride,
    categorySeoHidden,
    publishedAt
  }
`;

/** Tous les lits — page pilier /lits (grille + explorers). */
export const allLitsQuery = groq`
  *[_type == "product" && productType == "lit"] | order(name asc) {
    _id, name, title, "slug": slug.current, tagline,
    "image": images[0],
    "minPrice": variants[0].price,
    "compareAtPrice": variants[0].compareAtPrice,
    badges, rating
  }
`;

/** Slugs des lits publiés — generateStaticParams. */
export const allLitSlugsQuery = groq`
  *[_type == "product" && productType == "lit" && defined(slug.current)]{
    "slug": slug.current
  }
`;

/** Fiche complète d'un lit par slug. */
export const litBySlugQuery = groq`
  *[_type == "product" && productType == "lit" && slug.current == $slug][0]{
    ...,
    "slug": slug.current,
    lifestyleImage{ ..., asset->{...} },
    compositionImage{ ..., asset->{...} },
    compositionVideo{ asset->{url} },
    images[]{ ..., asset->{...}, "alt": coalesce(alt, ^.name) },
    videos[]{
      _key, alt, autoplay,
      file{ asset->{url, mimeType} },
      poster{ ..., asset->{...} }
    },
    colors[]{
      _key, name, hex, isDefault,
      image{ ..., asset->{...} }
    },
    variants[]{
      _key, size, colorName, sku, price, compareAtPrice, weightKg, stockStatus, stripePriceId
    },
    relatedProducts[]->{
      _id, name, title, "slug": slug.current, tagline,
      "image": images[0],
      "minPrice": variants[0].price,
      "compareAtPrice": variants[0].compareAtPrice,
      badges
    }
  }
`;

/** Page pilier /lits configurée dans Sanity (landingPage avec slug=lits). */
export const pillarLitsQuery = groq`
  *[_type == "landingPage" && slug.current == "lits"][0]{
    _id, h1, intro, metaTitle, metaDescription, editorialAngle,
    sections[]{
      ...,
      _type == "productsGrid" => {
        ...,
        manualProducts[]->{
          _id, name, title, "slug": slug.current, tagline,
          "image": images[0],
          "minPrice": variants[0].price,
          "compareAtPrice": variants[0].compareAtPrice,
          badges
        }
      }
    },
    categoryAdvantagesOverride,
    buyingCriteriaOverride,
    categoryTipsOverride,
    categoryCareStepsOverride,
    categoryFaqOverride,
    categoryComparisonOverride,
    categorySeoHidden,
    publishedAt
  }
`;
