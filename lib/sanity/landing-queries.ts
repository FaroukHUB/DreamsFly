import { groq } from "next-sanity";

/** Récupère une landing page complète par slug, uniquement si publiée. */
export const landingPageBySlugQuery = groq`
  *[_type == "landingPage" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{
    _id,
    name,
    "slug": slug.current,
    pageType,
    editorialAngle,
    h1,
    intro,
    focusKeyword,
    secondaryKeywords,
    searchVolume,
    searchIntent,
    metaTitle,
    metaDescription,
    "ogImage": ogImage{ ..., asset->{...} },
    layout,
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
      },
      _type == "expertQuoteBlock" => {
        ...,
        expert->{ name, role, "photo": photo, isPlaceholder, "slug": slug.current }
      },
      _type == "relatedPagesBlock" => {
        ...,
        manualLinks[]->{
          _type, _id, "slug": slug.current,
          _type == "landingPage" => { h1, intro },
          _type == "guide" => { title, excerpt }
        }
      }
    },
    tags,
    author->{ name, role, isPlaceholder, "slug": slug.current },
    reviewer->{ name, role, isPlaceholder },
    lastReviewedAt,
    publishedAt,
    noindex
  }
`;

/** Récupère les pages liées via tags (maillage interne automatique). */
export const relatedLandingPagesQuery = groq`
  *[_type == "landingPage"
    && _id != $currentId
    && defined(publishedAt) && publishedAt <= now()
    && !(noindex == true)
    && count(tags[@ in $currentTags]) > 0]
    | order(searchVolume desc)
    [0..$limit]{
      _id, name, h1, "slug": slug.current, pageType, focusKeyword,
      "image": ogImage
    }
`;

/** Liste tous les slugs publiés (utilisé pour generateStaticParams). */
export const allLandingSlugsQuery = groq`
  *[_type == "landingPage" && defined(publishedAt) && publishedAt <= now()]{
    "slug": slug.current
  }
`;
