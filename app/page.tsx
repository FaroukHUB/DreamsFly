import { sanityClient } from "@/lib/sanity/client";
import { homepageQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { Hero } from "@/components/hero";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UspStrip } from "@/components/usp-strip";
import { BestSellers } from "@/components/best-sellers";
import { MosaicCollections } from "@/components/home/mosaic-collections";
import { QuizCTA } from "@/components/home/quiz-cta";
import { Newsletter } from "@/components/home/newsletter";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, organizationSchema, websiteSchema } from "@/lib/seo/jsonld";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Matelas premium conçus en France",
  description:
    "DreamsFly : matelas mémoire de forme, hybrides, ressorts ensachés et mousse. Confection française, livraison à domicile, paiement en plusieurs fois.",
  path: "/",
});

async function safeFetch<T>(query: string): Promise<T | null> {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<T>(query);
  } catch (err) {
    console.error("[Sanity fetch error]", err);
    return null;
  }
}

export default async function HomePage() {
  const [homepage, siteSettings] = await Promise.all([
    safeFetch<any>(homepageQuery),
    safeFetch<any>(siteSettingsQuery),
  ]);

  return (
    <>
      <Header settings={siteSettings} />
      <main>
        <Hero hero={homepage?.hero} heroSecondary={homepage?.heroSecondary} />
        <UspStrip items={homepage?.uspStrip} />
        <BestSellers />
        <MosaicCollections cards={homepage?.mosaicCollections} />
        <QuizCTA data={homepage?.quizCta} />
        <Newsletter />
      </main>
      <Footer settings={siteSettings} />

      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={websiteSchema()} />
    </>
  );
}
