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
const SLUG = "lits";

export async function generateMetadata(): Promise<Metadata> {
  if (!sanityClient) return buildMetadata({ path: `/${SLUG}` });
  const p = await sanityClient.fetch<any>(staticPageBySectionSlugQuery, { section: "category", slug: SLUG }).catch(() => null);
  return buildMetadata({
    title: p?.metaTitle || p?.title,
    description: p?.metaDescription || p?.excerpt,
    path: `/${SLUG}`,
  });
}

export default async function CategoryStaticPage() {
  if (!sanityClient) {
    return (
      <>
        <h1>Bientôt disponible</h1>
      </>
    );
  }
  const [page, siteSettings] = await Promise.all([
    sanityClient.fetch<any>(staticPageBySectionSlugQuery, { section: "category", slug: SLUG }).catch(() => null),
    sanityClient.fetch<any>(siteSettingsQuery).catch(() => null),
  ]);

  // Fallback : page "Bientôt disponible" si pas configurée
  if (!page) {
    const titles: Record<string, string> = {
      lits: "Lits",
      sommiers: "Sommiers",
      oreillers: "Oreillers",
    };
    return (
      <>
        <Header settings={siteSettings} />
        <main className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-24 text-center md:py-32">
          <div className="mb-4 text-5xl">🛋️</div>
          <h1 className="font-sora text-3xl font-semibold text-ink md:text-5xl">{titles[SLUG]}</h1>
          <p className="mt-4 text-lg text-pierre">Cette gamme arrive très prochainement. Rejoignez la newsletter pour être informé du lancement.</p>
          <a href="/" className="mt-8 inline-flex rounded-pill bg-midnight px-7 py-3.5 font-sora text-sm font-semibold text-white hover:bg-midnight-dark">Retour à l'accueil</a>
        </main>
        <Footer settings={siteSettings} />
      </>
    );
  }

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
