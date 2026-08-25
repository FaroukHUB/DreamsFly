import type { MetadataRoute } from "next";
import { sanityClient } from "@/lib/sanity/client";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamsfly.fr";

/**
 * Sitemap dynamique — généré à partir des documents Sanity publiés
 * (publishedAt <= now ET pas noindex).
 *
 * Stratégie progressive : seules les pages avec publishedAt rempli apparaissent.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // Pages statiques toujours présentes
  const staticPages: MetadataRoute.Sitemap = [
    // ─── Home + catégories piliers (priorité SEO max) ───
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/matelas`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/lits`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/sommiers`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/oreillers`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/lits-coffre`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },

    // ─── Landings SEO hardcodées ───
    { url: `${SITE_URL}/matelas-mal-de-dos`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/matelas-memoire-de-forme`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },

    // ─── Hubs éditoriaux ───
    { url: `${SITE_URL}/magazine`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/comparatifs`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${SITE_URL}/glossaire`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },

    // ─── Conversion / service ───
    { url: `${SITE_URL}/magasins`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${SITE_URL}/quiz`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${SITE_URL}/aide/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },

    // ─── Plan du site ───
    { url: `${SITE_URL}/plan-du-site`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },

    // ─── Légal ───
    { url: `${SITE_URL}/mentions-legales`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/cgv`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/confidentialite`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  if (!sanityClient) return staticPages;

  try {
    // Landing pages publiées
    const landingPages = await sanityClient.fetch<
      { slug: string; publishedAt: string; lastReviewedAt?: string; noindex?: boolean }[]
    >(`*[_type == "landingPage" && defined(publishedAt) && publishedAt <= now() && !(noindex == true)]{
        "slug": slug.current,
        publishedAt,
        lastReviewedAt,
        noindex
      }`);

    // Produits — par catégorie pour URL correcte selon productType
    const products = await sanityClient.fetch<
      { slug: string; productType?: string; updatedAt?: string }[]
    >(`*[_type == "product" && defined(slug.current) && defined(images[0]) && defined(variants[0].price)]{
        "slug": slug.current,
        productType,
        "updatedAt": _updatedAt
      }`);

    function productUrl(p: { slug: string; productType?: string }): string {
      const type = p.productType || "matelas";
      if (type === "lit") return `${SITE_URL}/lits/${p.slug}`;
      if (type === "sommier") return `${SITE_URL}/sommiers/${p.slug}`;
      if (type === "oreiller") return `${SITE_URL}/oreillers/${p.slug}`;
      return `${SITE_URL}/matelas/${p.slug}`;
    }

    // Guides publiés
    const guides = await sanityClient.fetch<
      { slug: string; publishedAt: string; updatedAt?: string }[]
    >(`*[_type == "guide" && defined(publishedAt) && publishedAt <= now()]{
        "slug": slug.current,
        publishedAt,
        updatedAt
      }`);

    // Comparatifs publiés
    const comparisons = await sanityClient.fetch<
      { slug: string; publishedAt: string }[]
    >(`*[_type == "comparison" && defined(publishedAt) && publishedAt <= now()]{
        "slug": slug.current,
        publishedAt
      }`);

    // Glossaire publié
    const glossaryTerms = await sanityClient.fetch<
      { slug: string; publishedAt: string }[]
    >(`*[_type == "glossary" && defined(publishedAt) && publishedAt <= now()]{
        "slug": slug.current,
        publishedAt
      }`);

    // Showrooms publiés
    const showrooms = await sanityClient.fetch<
      { slug: string; publishedAt: string }[]
    >(`*[_type == "showroom" && defined(publishedAt) && publishedAt <= now()]{
        "slug": slug.current,
        publishedAt
      }`);

    return [
      ...staticPages,
      ...landingPages.map((p) => ({
        url: `${SITE_URL}/${p.slug}`,
        lastModified: p.lastReviewedAt || p.publishedAt,
        changeFrequency: "weekly" as const,
        priority: 0.85,
      })),
      ...products.map((p) => ({
        url: productUrl(p),
        lastModified: p.updatedAt || now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...guides.map((g) => ({
        url: `${SITE_URL}/magazine/${g.slug}`,
        lastModified: g.updatedAt || g.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      ...comparisons.map((c) => ({
        url: `${SITE_URL}/comparatifs/${c.slug}`,
        lastModified: c.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...glossaryTerms.map((t) => ({
        url: `${SITE_URL}/glossaire/${t.slug}`,
        lastModified: t.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
      ...showrooms.map((s) => ({
        url: `${SITE_URL}/magasins/${s.slug}`,
        lastModified: s.publishedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  } catch (err) {
    console.error("[sitemap] fetch error:", err);
    return staticPages;
  }
}
