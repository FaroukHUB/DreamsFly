import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity/client";
import { staticPageBySectionSlugQuery } from "@/lib/sanity/static-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { StaticPageContent } from "@/components/static-page-renderer";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, organizationSchema } from "@/lib/seo/jsonld";

export const revalidate = 600;
const SLUG = "confidentialite";

export async function generateMetadata(): Promise<Metadata> {
  if (!sanityClient) return buildMetadata({ path: `/${SLUG}` });
  const p = await sanityClient.fetch<any>(staticPageBySectionSlugQuery, { section: "legal", slug: SLUG }).catch(() => null);
  return buildMetadata({
    title: p?.metaTitle || p?.title,
    description: p?.metaDescription || p?.excerpt,
    path: `/${SLUG}`,
  });
}

export default async function LegalPage() {
  if (!sanityClient) notFound();
  const [page, siteSettings] = await Promise.all([
    sanityClient.fetch<any>(staticPageBySectionSlugQuery, { section: "legal", slug: SLUG }).catch(() => null),
    sanityClient.fetch<any>(siteSettingsQuery).catch(() => null),
  ]);
  if (!page) notFound();

  const breadcrumbs = [{ name: "Accueil", url: "/" }, { name: page.title, url: `/${SLUG}` }];

  return (
    <>
      <Header settings={siteSettings} />
      <StaticPageContent page={page} breadcrumbs={breadcrumbs} />
      <Footer settings={siteSettings} />
      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
