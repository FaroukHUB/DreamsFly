import { sanityClient } from "@/lib/sanity/client";
import { homepageQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { Hero } from "@/components/hero";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UspStrip } from "@/components/usp-strip";

export const revalidate = 60; // ISR : page régénérée toutes les minutes max

export default async function HomePage() {
  const [homepage, siteSettings] = await Promise.all([
    sanityClient.fetch(homepageQuery).catch(() => null),
    sanityClient.fetch(siteSettingsQuery).catch(() => null),
  ]);

  return (
    <>
      <Header settings={siteSettings} />
      <main>
        <Hero hero={homepage?.hero} heroSecondary={homepage?.heroSecondary} />
        <UspStrip items={homepage?.uspStrip} />
        {/* TODO Phase 2 : Trust counter, Best-sellers, Mosaïque, Quiz CTA, Catégories, Awards, Brand statement, Magazine, Newsletter */}
      </main>
      <Footer settings={siteSettings} />
    </>
  );
}
