import { groq } from "next-sanity";

/** Article complet par slug, uniquement si publié. */
export const guideBySlugQuery = groq`
  *[_type == "guide" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{
    _id,
    title,
    "slug": slug.current,
    articleType,
    excerpt,
    coverImage{ ..., asset->{...} },
    body[]{
      ...,
      _type == "image" => { ..., asset->{...} },
      _type == "howToStep" => { ..., image{ ..., asset->{...} } }
    },
    faq,
    sources,
    author->{ name, role, "photo": photo, isPlaceholder, "slug": slug.current, bioShort },
    reviewer->{ name, role, isPlaceholder },
    relatedProducts[]->{
      _id, name, "slug": slug.current, tagline,
      "image": images[0],
      "minPrice": variants[0].price
    },
    relatedGuides[]->{
      _id, title, "slug": slug.current, excerpt, articleType,
      "coverImage": coverImage
    },
    tags,
    metaTitle,
    metaDescription,
    focusKeyword,
    publishedAt,
    updatedAt
  }
`;

/** Slugs publiés. */
export const allGuideSlugsQuery = groq`
  *[_type == "guide" && defined(publishedAt) && publishedAt <= now()]{
    "slug": slug.current
  }
`;

/** Hub magazine — articles récents groupés par catégorie. */
export const magazineHubQuery = groq`
  {
    "featured": *[_type == "guide" && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) [0]{
      _id, title, "slug": slug.current, excerpt, articleType, publishedAt,
      "coverImage": coverImage,
      author->{ name, isPlaceholder }
    },
    "recent": *[_type == "guide" && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) [1..12]{
      _id, title, "slug": slug.current, excerpt, articleType, publishedAt,
      "coverImage": coverImage,
      author->{ name, isPlaceholder }
    },
    "byCategory": *[_type == "guide" && defined(publishedAt) && publishedAt <= now()] {
      _id, title, "slug": slug.current, articleType, publishedAt,
      "coverImage": coverImage
    } | order(publishedAt desc)
  }
`;
