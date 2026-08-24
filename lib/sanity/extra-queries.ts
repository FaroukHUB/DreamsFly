import { groq } from "next-sanity";

// Showrooms
export const showroomBySlugQuery = groq`
  *[_type == "showroom" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{
    _id, name, "slug": slug.current,
    address, coordinates, phone, email, openingHours,
    images[]{ ..., asset->{...} },
    description,
    googlePlaceId,
    publishedAt
  }
`;

export const allShowroomsQuery = groq`
  *[_type == "showroom" && defined(publishedAt) && publishedAt <= now()] | order(address.city asc) {
    _id, name, "slug": slug.current,
    address, phone,
    "image": images[0],
    openingHours
  }
`;

export const allShowroomSlugsQuery = groq`
  *[_type == "showroom" && defined(publishedAt) && publishedAt <= now()]{ "slug": slug.current }
`;

export const showroomsPageQuery = groq`
  *[_type == "showroomsPage"][0]{
    heroEyebrow, heroTitle, heroSubtitle, heroImage,
    argumentsTitle,
    argumentsItems[]{ icon, title, text },
    faqTitle,
    faqItems[]{ question, answer },
    metaTitle, metaDescription
  }
`;

// Glossary
export const glossaryTermBySlugQuery = groq`
  *[_type == "glossary" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{
    _id, term, "slug": slug.current, shortDefinition, longDefinition,
    category, synonyms,
    relatedTerms[]->{ _id, term, "slug": slug.current, shortDefinition },
    publishedAt
  }
`;

export const allGlossaryTermsQuery = groq`
  *[_type == "glossary" && defined(publishedAt) && publishedAt <= now()] | order(term asc) {
    _id, term, "slug": slug.current, shortDefinition, category
  }
`;

export const allGlossarySlugsQuery = groq`
  *[_type == "glossary" && defined(publishedAt) && publishedAt <= now()]{ "slug": slug.current }
`;

// Comparisons
export const comparisonBySlugQuery = groq`
  *[_type == "comparison" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{
    _id, title, "slug": slug.current,
    intro, criteria, verdict,
    metaTitle, metaDescription,
    publishedAt
  }
`;

export const allComparisonsQuery = groq`
  *[_type == "comparison" && defined(publishedAt) && publishedAt <= now()] | order(publishedAt desc) {
    _id, title, "slug": slug.current, intro, publishedAt
  }
`;

export const allComparisonSlugsQuery = groq`
  *[_type == "comparison" && defined(publishedAt) && publishedAt <= now()]{ "slug": slug.current }
`;
