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

export async function generateMetadata(): Promise<Metadata> {
  if (!sanityClient) return buildMetadata({ path: "/cgv" });
  const p = await sanityClient.fetch<any>(staticPageBySectionSlugQuery, { section: "legal", slug: "cgv" }).catch(() => null);
  return buildMetadata({
    title: p?.metaTitle || p?.title || "Conditions générales de vente",
    description: p?.metaDescription || p?.excerpt,
    path: "/cgv",
  });
}

export default async function CgvPage() {
  if (!sanityClient) notFound();
  const [page, siteSettings] = await Promise.all([
    sanityClient.fetch<any>(staticPageBySectionSlugQuery, { section: "legal", slug: "cgv" }).catch(() => null),
    sanityClient.fetch<any>(siteSettingsQuery).catch(() => null),
  ]);
  if (!page) notFound();

  return (
    <>
      <Header settings={siteSettings} />
      <StaticPageContent page={page} breadcrumbs={[{ name: "Accueil", url: "/" }, { name: page.title, url: "/cgv" }]} />
      <Footer settings={siteSettings} />
      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema([{ name: "Accueil", url: "/" }, { name: page.title, url: "/cgv" }])} />
    </>
  );
}
