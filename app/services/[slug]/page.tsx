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

export const revalidate = 300;
type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  if (!sanityClient) return buildMetadata({ path: `/services/${slug}` });
  const p = await sanityClient.fetch<any>(staticPageBySectionSlugQuery, { section: "services", slug }).catch(() => null);
  if (!p) return buildMetadata({ path: `/services/${slug}`, noindex: true });
  return buildMetadata({
    title: p.metaTitle || p.title,
    description: p.metaDescription || p.excerpt,
    path: `/services/${slug}`,
    noindex: p.noindex,
  });
}

export default async function ServicesPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!sanityClient) notFound();
  const [page, siteSettings] = await Promise.all([
    sanityClient.fetch<any>(staticPageBySectionSlugQuery, { section: "services", slug }).catch(() => null),
    sanityClient.fetch<any>(siteSettingsQuery).catch(() => null),
  ]);
  if (!page) notFound();

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Services", url: "/services/livraison" },
    { name: page.title, url: `/services/${slug}` },
  ];

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
