import { groq } from "next-sanity";

/**
 * RÉSOLUTION PAR SLUG — pourquoi ces quatre requêtes renvoient un TABLEAU
 *
 * Elles acceptent le slug actuel d'un produit ET ses anciens slugs, saisis à
 * la main dans le champ « Anciens slugs » de la fiche. Deux documents peuvent
 * donc légitimement répondre : celui dont c'est le slug actuel, et un autre
 * qui a conservé cette valeur comme ancienne adresse.
 *
 * Un `[0]` sur un résultat non ordonné choisirait au hasard, et servirait
 * parfois la fiche périmée. Le tri est donc fait côté TypeScript par
 * `resolveProductBySlug` (lib/product-slug.ts), qui donne toujours la
 * priorité à la correspondance exacte sur le slug actuel.
 *
 * `$slug in previousSlugs` est sans danger quand le champ est absent : GROQ
 * renvoie faux plutôt que de lever une erreur. Les fiches créées avant
 * l'introduction du champ continuent donc de se résoudre normalement.
 *
 * `previousSlugs` remonte via le `...` de la projection.
 */

/** Récupère les fiches produit complètes correspondant à un slug (tous types). */
export const productBySlugFullQuery = groq`
  *[_type == "product" && (slug.current == $slug || $slug in previousSlugs)]{
    ...,
    "slug": slug.current,
    lifestyleImage{ ..., asset->{...} },
    compositionImage{ ..., asset->{...} },
    compositionVideo{ asset->{url} },
    images[]{ ..., asset->{...}, "url": asset->url, "alt": coalesce(alt, ^.name) },
    videos[]{
      _key, alt, autoplay,
      file{ asset->{url, mimeType} },
      poster{ ..., asset->{...} }
    },
    colors[]{
      _key, name, hex, isDefault,
      image{ ..., asset->{...}, "url": asset->url }
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

/** Tous les lits — page pilier /lits (grille + explorers + filtres). */
export const allLitsQuery = groq`
  *[_type == "product" && productType == "lit"] | order(name asc) {
    _id, name, title, "slug": slug.current, tagline,
    litMaterial,
    "image": images[0],
    "minPrice": variants[0].price,
    "compareAtPrice": variants[0].compareAtPrice,
    "variants": variants[]{ size },
    badges, rating
  }
`;

/** Slugs des lits publiés — generateStaticParams. */
export const allLitSlugsQuery = groq`
  *[_type == "product" && productType == "lit" && defined(slug.current)]{
    "slug": slug.current
  }
`;

/** Fiches d'un lit correspondant à un slug — actuel ou ancien. */
export const litBySlugQuery = groq`
  *[_type == "product" && productType == "lit" && (slug.current == $slug || $slug in previousSlugs)]{
    ...,
    "slug": slug.current,
    lifestyleImage{ ..., asset->{...} },
    compositionImage{ ..., asset->{...} },
    compositionVideo{ asset->{url} },
    images[]{ ..., asset->{...}, "url": asset->url, "alt": coalesce(alt, ^.name) },
    videos[]{
      _key, alt, autoplay,
      file{ asset->{url, mimeType} },
      poster{ ..., asset->{...} }
    },
    colors[]{
      _key, name, hex, isDefault,
      image{ ..., asset->{...}, "url": asset->url }
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

/** Tous les sommiers — page pilier /sommiers. */
export const allSommiersQuery = groq`
  *[_type == "product" && productType == "sommier"] | order(name asc) {
    _id, name, title, "slug": slug.current, tagline,
    sommierType, thicknessCm,
    "image": images[0],
    "minPrice": variants[0].price,
    "compareAtPrice": variants[0].compareAtPrice,
    "variants": variants[]{ size },
    badges, rating
  }
`;

/** Slugs des sommiers publiés — generateStaticParams. */
export const allSommierSlugsQuery = groq`
  *[_type == "product" && productType == "sommier" && defined(slug.current)]{
    "slug": slug.current
  }
`;

/** Fiches d'un sommier correspondant à un slug — actuel ou ancien. */
export const sommierBySlugQuery = groq`
  *[_type == "product" && productType == "sommier" && (slug.current == $slug || $slug in previousSlugs)]{
    ...,
    "slug": slug.current,
    lifestyleImage{ ..., asset->{...} },
    images[]{ ..., asset->{...}, "url": asset->url, "alt": coalesce(alt, ^.name) },
    videos[]{
      _key, alt, autoplay,
      file{ asset->{url, mimeType} },
      poster{ ..., asset->{...} }
    },
    colors[]{
      _key, name, hex, isDefault,
      image{ ..., asset->{...}, "url": asset->url }
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

/** Tous les oreillers — page pilier /oreillers. */
export const allOreillersQuery = groq`
  *[_type == "product" && productType == "oreiller"] | order(name asc) {
    _id, name, title, "slug": slug.current, tagline,
    oreillerFilling, oreillerShape, firmness, thicknessCm,
    "image": images[0],
    "minPrice": variants[0].price,
    "compareAtPrice": variants[0].compareAtPrice,
    "variants": variants[]{ size },
    badges, rating
  }
`;

export const allOreillerSlugsQuery = groq`
  *[_type == "product" && productType == "oreiller" && defined(slug.current)]{
    "slug": slug.current
  }
`;

/** Fiches d'un oreiller correspondant à un slug — actuel ou ancien. */
export const oreillerBySlugQuery = groq`
  *[_type == "product" && productType == "oreiller" && (slug.current == $slug || $slug in previousSlugs)]{
    ...,
    "slug": slug.current,
    lifestyleImage{ ..., asset->{...} },
    images[]{ ..., asset->{...}, "url": asset->url, "alt": coalesce(alt, ^.name) },
    videos[]{
      _key, alt, autoplay,
      file{ asset->{url, mimeType} },
      poster{ ..., asset->{...} }
    },
    colors[]{
      _key, name, hex, isDefault,
      image{ ..., asset->{...}, "url": asset->url }
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

export const pillarOreillersQuery = groq`
  *[_type == "landingPage" && slug.current == "oreillers"][0]{
    _id, h1, intro, metaTitle, metaDescription, editorialAngle,
    sections[]{ ... },
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

/** Page pilier /sommiers dans Sanity. */
export const pillarSommiersQuery = groq`
  *[_type == "landingPage" && slug.current == "sommiers"][0]{
    _id, h1, intro, metaTitle, metaDescription, editorialAngle,
    sections[]{ ... },
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

/**
 * Produits du quiz — les TROIS types proposés, pas seulement les matelas.
 *
 * `allProductsForPillarQuery` ne charge que `productType == "matelas"` : le
 * quiz notait donc un ensemble sans aucun lit ni oreiller, et recommandait
 * fatalement un matelas quel que soit le produit demandé.
 *
 * Les champs spécifiques à chaque type sont inclus — sans eux, l'algorithme
 * n'aurait rien pour départager un lit d'un autre.
 */
export const quizProductsQuery = groq`
  *[_type == "product" && productType in ["matelas", "lit", "oreiller"]
    && defined(slug.current) && defined(variants[0].price)] | order(name asc) {
    _id, name, title, "slug": slug.current, tagline, productType,
    type, firmness, welcome, thicknessCm, features,
    "image": images[0],
    "minPrice": variants[0].price,
    "compareAtPrice": variants[0].compareAtPrice,
    "variants": variants[]{ size },
    badges, rating,
    // Oreiller
    oreillerFilling, oreillerShape,
    // Lit coffre
    litMaterial, litColor, litCoffreType, litCoffreCapacityL
  }
`;
