import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import { enforceRateLimit } from "@/lib/rate-limit";

/**
 * Recherche universelle DreamsFly.
 * Cherche dans : produits, guides magazine, glossaire, comparatifs,
 * landings SEO. Retourne max 6 résultats par catégorie, avec URL, titre,
 * tagline, catégorie, image thumbnail.
 *
 * Query : GET /api/search?q=matelas
 */
export const runtime = "edge";

const SEARCH_QUERY = groq`{
  "products": *[_type == "product" && (
    name match $q + "*" ||
    title match $q + "*" ||
    tagline match $q + "*" ||
    pt::text(descriptionRich) match $q + "*"
  )][0...6] | order(name asc) {
    _id, _type,
    "title": coalesce(name, title),
    tagline,
    "slug": slug.current,
    "type": productType,
    "image": images[0]
  },
  "guides": *[_type == "guide" && defined(publishedAt) && (
    title match $q + "*" ||
    excerpt match $q + "*"
  )][0...4] | order(publishedAt desc) {
    _id, _type, title, excerpt, "slug": slug.current, articleType,
    "image": coverImage
  },
  "glossary": *[_type == "glossary" && defined(publishedAt) && (
    term match $q + "*" ||
    shortDefinition match $q + "*"
  )][0...4] | order(term asc) {
    _id, _type, "title": term, "excerpt": shortDefinition,
    "slug": slug.current, category
  },
  "comparisons": *[_type == "comparison" && defined(publishedAt) && (
    title match $q + "*" ||
    intro match $q + "*"
  )][0...3] | order(publishedAt desc) {
    _id, _type, title, "excerpt": intro, "slug": slug.current
  },
  "landings": *[_type == "landingPage" && (
    h1 match $q + "*" ||
    intro match $q + "*" ||
    focusKeyword match $q + "*"
  )][0...4] | order(_updatedAt desc) {
    _id, _type, "title": h1, "excerpt": intro, "slug": slug.current,
    pageType
  }
}`;

export async function GET(req: NextRequest) {
  // 30 recherches / minute / IP — le debounce client fait ~4-5 req/s max en tapant
  const limited = enforceRateLimit(req, "search", 30, 60_000);
  if (limited) return limited;

  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 2) {
    return NextResponse.json({ products: [], guides: [], glossary: [], comparisons: [], landings: [] });
  }
  if (!sanityClient) {
    return NextResponse.json({ error: "Sanity indisponible" }, { status: 503 });
  }
  try {
    const results = await sanityClient.fetch(SEARCH_QUERY, { q });
    return NextResponse.json(results);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Search error" }, { status: 500 });
  }
}
