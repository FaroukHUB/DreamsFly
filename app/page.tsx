import { sanityClient } from "@/lib/sanity/client";
import { homepageQuery, siteSettingsQuery } from "@/lib/sanity/queries";
import { Hero } from "@/components/hero";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UspStrip } from "@/components/usp-strip";
import { BestSellers } from "@/components/best-sellers";
import { MosaicCollections } from "@/components/home/mosaic-collections";
import { QuizCTA } from "@/components/home/quiz-cta";
import { CategoryTiles } from "@/components/home/category-tiles";
import { Newsletter } from "@/components/home/newsletter";
import { Advantages } from "@/components/home/advantages";
import { WhyUs } from "@/components/home/why-us";
import { BuyingGuide } from "@/components/home/buying-guide";
import { Commitments } from "@/components/home/commitments";
import { HomepageFaq } from "@/components/home/homepage-faq";
import { GuidesSection } from "@/components/home/guides-section";
import { LatestArticles } from "@/components/home/latest-articles";
import { Testimonials } from "@/components/home/testimonials";
import { BrandLogos } from "@/components/home/brand-logos";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  JsonLd,
  organizationSchema,
  websiteSchema,
  faqSchema,
} from "@/lib/seo/jsonld";
import { defaultHomepageFaq } from "@/lib/homepage-defaults";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  title: "Matelas & literie premium fabriqués en Europe",
  description:
    "DreamsFly : matelas, lits coffre, sommiers et oreillers premium fabriqués en Europe. 30 nuits d'essai, livraison gratuite à l'étage, paiement en 4× sans frais.",
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

  const faqQuestions = homepage?.homepageFaq?.questions?.length
    ? homepage.homepageFaq.questions
    : defaultHomepageFaq.questions;

  return (
    <>
      <Header settings={siteSettings} />
      <main>
        {/* 1. HERO — préservé */}
        <Hero hero={homepage?.hero} heroSecondary={homepage?.heroSecondary} slides={homepage?.heroSlides} />

        {/* 2. USP strip */}
        <UspStrip items={homepage?.uspStrip} />

        {/* 3. Best-sellers matelas */}
        <BestSellers manualProducts={homepage?.bestSellers} />

        {/* 4. Mosaïque de collections (gammes) — préservé */}
        <MosaicCollections cards={homepage?.mosaicCollections} />

        {/* 5. Pourquoi DreamsFly — NEW */}
        <WhyUs data={homepage?.whyUs} />

        {/* 6. Catégories (tuiles) — préservé */}
        <CategoryTiles tiles={homepage?.categoryTiles} />

        {/* 7. Guide d'achat — NEW */}
        <BuyingGuide data={homepage?.buyingGuide} />

        {/* 8. Nos engagements — NEW */}
        <Commitments data={homepage?.commitments} />

        {/* 9. Quiz CTA — préservé */}
        <QuizCTA data={homepage?.quizCta} />

        {/* 10. Avis clients — NEW */}
        <Testimonials data={homepage?.testimonials} />

        {/* 11. Nos guides éditoriaux — NEW */}
        <GuidesSection data={homepage?.guidesSection} />

        {/* 12. Derniers articles blog — NEW */}
        <LatestArticles data={homepage?.latestArticles} />

        {/* 13. FAQ SEO 20+ questions — NEW */}
        <HomepageFaq data={homepage?.homepageFaq} />

        {/* 14. Marques / partenaires — NEW */}
        <BrandLogos data={homepage?.brandLogos} />

        {/* 15. Advantages + Newsletter — préservé */}
        <Advantages items={homepage?.advantages} />
        <Newsletter />
      </main>
      <Footer settings={siteSettings} />

      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={faqSchema(faqQuestions.map((q: any) => ({ question: q.question, answer: q.answer })))} />
    </>
  );
}
