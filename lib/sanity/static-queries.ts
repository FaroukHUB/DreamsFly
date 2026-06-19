import { groq } from "next-sanity";

export const staticPageBySectionSlugQuery = groq`
  *[_type == "staticPage" && section == $section && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{
    _id, title, "slug": slug.current, section, excerpt,
    body[]{
      ...,
      _type == "image" => { ..., asset->{...} }
    },
    metaTitle, metaDescription, noindex, publishedAt
  }
`;

export const staticPageByTopLevelSlugQuery = groq`
  *[_type == "staticPage" && section == "legal" && slug.current == $slug && defined(publishedAt) && publishedAt <= now()][0]{
    _id, title, "slug": slug.current, section, excerpt,
    body[]{
      ...,
      _type == "image" => { ..., asset->{...} }
    },
    metaTitle, metaDescription, noindex, publishedAt
  }
`;
