import { groq } from "next-sanity";

/** Récupère une fiche produit complète par slug. */
export const productBySlugFullQuery = groq`
  *[_type == "product" && slug.current == $slug][0]{
    _id,
    name,
    title,
    "slug": slug.current,
    sku,
    tagline,
    description,
    type,
    firmness,
    welcome,
    thicknessCm,
    features,
    composition,
    variants[]{
      _key,
      size,
      sku,
      price,
      compareAtPrice,
      weightKg,
      stockStatus,
      stripePriceId
    },
    images[]{ ..., asset->{...}, "alt": coalesce(alt, ^.name) },
    rating,
    badges,
    relatedProducts[]->{
      _id, name, title, "slug": slug.current, tagline,
      "image": images[0],
      "minPrice": variants[0].price,
      "compareAtPrice": variants[0].compareAtPrice,
      badges
    },
    seo
  }
`;

/** Slugs publiés pour generateStaticParams. */
export const allProductSlugsQuery = groq`
  *[_type == "product" && defined(slug.current)]{ "slug": slug.current }
`;

/** Liste produits pour la page pilier /matelas. */
export const allProductsForPillarQuery = groq`
  *[_type == "product"] | order(name asc) {
    _id, name, title, "slug": slug.current, tagline, type, firmness,
    thicknessCm,
    "image": images[0],
    "minPrice": variants[0].price,
    "compareAtPrice": variants[0].compareAtPrice,
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
    publishedAt
  }
`;
