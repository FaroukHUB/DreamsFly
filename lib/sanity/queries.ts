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
    heroSlides[]{
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
      imagePosition,
      backgroundImage{ ..., asset->{...}, hotspot, crop }
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
    whyUs {
      ...,
      image{ ..., asset->{...} },
      pillars[]{ _key, icon, title, text }
    },
    buyingGuide {
      ...,
      guides[]{ _key, icon, title, text, ctaLabel, ctaLink, image{ ..., asset->{...} } }
    },
    commitments {
      ...,
      items[]{ _key, icon, title, text, image{ ..., asset->{...} } }
    },
    homepageFaq {
      ...,
      questions[]{ _key, category, question, answer }
    },
    testimonials {
      ...,
      items[]{ _key, name, location, rating, text, productBought, date, photo{ ..., asset->{...} } }
    },
    "reviewDocs": *[_type == "review"] | order(coalesce(date, _createdAt) desc) [0..11] {
      _id,
      "name": author,
      "location": city,
      rating,
      text,
      "date": coalesce(date, _createdAt),
      "productBought": product->name,
      "photo": null
    },
    brandLogos {
      ...,
      items[]{ _key, name, url, logo{ ..., asset->{...} } }
    },
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
