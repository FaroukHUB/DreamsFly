import { sanityClient } from "@/lib/sanity/client";
import { homepageQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { Hero } from "@/components/hero";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UspStrip } from "@/components/usp-strip";
import { BestSellers } from "@/components/best-sellers";

export const revalidate = 60;

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
      </main>
      <Footer settings={siteSettings} />
    </>
  );
}
