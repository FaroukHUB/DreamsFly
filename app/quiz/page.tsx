import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { allProductsForPillarQuery } from "@/lib/sanity/product-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { LineIcon, iconNameForEmoji } from "@/components/line-icon";
import { QuizWidget } from "@/components/quiz/quiz-widget";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, organizationSchema, faqSchema } from "@/lib/seo/jsonld";
import { defaultQuizSteps, defaultQuizContent, type QuizStep } from "@/lib/quiz-defaults";
import { groq } from "next-sanity";

export const revalidate = 300;

const quizPageQuery = groq`*[_type == "quizPage"][0]{
  ...,
  questions[]{
    ...,
    options[]{
      ...,
      image{ ..., asset->{ url }, "url": asset->url }
    }
  }
}`;

export async function generateMetadata(): Promise<Metadata> {
  const doc = sanityClient ? await sanityClient.fetch<any>(quizPageQuery).catch(() => null) : null;
  return buildMetadata({
    title: doc?.metaTitle || doc?.heroTitle || "Quel matelas choisir ? Quiz personnalisé — DreamsFly",
    description:
      doc?.metaDescription ||
      "Notre quiz en 60 secondes vous guide vers le matelas idéal selon votre position, gabarit, budget et priorités. Recommandation personnalisée, algorithme d'expert.",
    path: "/quiz",
  });
}

/** Reconstruit la liste des étapes depuis Sanity (fallback sur défauts). */
function buildSteps(doc: any): QuizStep[] {
  if (!doc?.questions?.length) return defaultQuizSteps;
  return doc.questions.map((q: any) => {
    if (q.type === "slider") {
      return {
        key: q.key,
        type: "slider",
        question: q.question,
        subtitle: q.subtitle,
        min: q.min || 200,
        max: q.max || 2500,
        step: q.step || 50,
      };
    }
    return {
      key: q.key,
      type: q.type || "single",
      question: q.question,
      subtitle: q.subtitle,
      options: (q.options || []).map((o: any) => ({
        value: o.value,
        label: o.label,
        subtitle: o.subtitle,
        imageUrl: o.image?.url,
        imageAlt: o.image?.alt,
      })),
    };
  });
}

export default async function QuizPage() {
  const [doc, products, siteSettings] = await Promise.all([
    sanityClient?.fetch<any>(quizPageQuery).catch(() => null) ?? null,
    sanityClient?.fetch<any[]>(allProductsForPillarQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
  ]);

  const steps = buildSteps(doc);
  const hero = {
    eyebrow: doc?.heroEyebrow || defaultQuizContent.hero.eyebrow,
    title: doc?.heroTitle || defaultQuizContent.hero.title,
    subtitle: doc?.heroSubtitle || defaultQuizContent.hero.subtitle,
    image: doc?.heroImage,
  };
  const methodTitle = doc?.methodTitle || defaultQuizContent.method.title;
  const methodSteps = doc?.methodSteps?.length ? doc.methodSteps : defaultQuizContent.method.steps;
  const criteriaTitle = doc?.criteriaTitle || defaultQuizContent.criteria.title;
  const criteriaItems = doc?.criteriaItems?.length ? doc.criteriaItems : defaultQuizContent.criteria.items;
  const pitfallsTitle = doc?.pitfallsTitle || defaultQuizContent.pitfalls.title;
  const pitfallsItems = doc?.pitfallsItems?.length ? doc.pitfallsItems : defaultQuizContent.pitfalls.items;
  const faqTitle = doc?.faqTitle || defaultQuizContent.faq.title;
  const faqItems = doc?.faqItems?.length ? doc.faqItems : defaultQuizContent.faq.items;

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Quiz matelas", url: "/quiz" },
  ];

  return (
    <>
      <Header settings={siteSettings} />

      <EditorialPageHeader
        breadcrumbs={[
          { name: "Accueil", url: "/" },
          { name: "Quiz matelas", url: "/quiz" },
        ]}
        eyebrow={hero.eyebrow}
        title={hero.title}
        lead={hero.subtitle}
        image={hero.image}
      />

      <main className="mx-auto max-w-site px-6 py-14 md:px-10 md:py-20">
        {/* QUIZ WIDGET */}
        <section id="quiz" className="mb-24 rounded-[28px] border border-ink/10 bg-ivoire p-6 md:mb-32 md:p-12">
          <QuizWidget steps={steps} products={products} />
        </section>

        {/* MÉTHODE */}
        <section className="mb-24 md:mb-32">
          <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
            <span className="eyebrow-editorial on-cream mb-2 mx-auto">Notre méthode</span>
            <h2 className="display-serif on-cream mt-4 text-[2.2rem] font-normal md:text-[3.4rem]">
              {methodTitle}
            </h2>
          </div>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {methodSteps.map((s: any, i: number) => (
              <div key={i}>
                <div className="mb-5 flex items-center gap-4">
                  <span className="num-editorial !text-[38px] !text-or">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {s.icon && <LineIcon name={iconNameForEmoji(s.icon)} size={20} className="text-noir" />}
                </div>
                <h3 className="display-serif on-cream text-[1.15rem] font-normal md:text-[1.3rem]">{s.title}</h3>
                <p className="mt-3 font-sans text-[14px] leading-relaxed text-taupe md:text-[15px]">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CRITÈRES DÉTAILLÉS */}
        <section className="mb-24 rounded-[28px] bg-creme p-8 md:mb-32 md:p-14">
          <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
            <span className="eyebrow-editorial on-cream mb-2 mx-auto">Approche experte</span>
            <h2 className="display-serif on-cream mt-4 text-[2.2rem] font-normal md:text-[3.4rem]">
              {criteriaTitle}
            </h2>
          </div>
          <div className="mx-auto max-w-4xl space-y-6">
            {criteriaItems.map((c: any, i: number) => (
              <article key={i} className="grid gap-5 rounded-[20px] bg-ivoire p-7 md:grid-cols-[auto_1fr] md:gap-8 md:p-10">
                <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full border border-ink/15 text-noir">
                  <LineIcon name={iconNameForEmoji(c.icon)} size={22} strokeWidth={1.3} />
                </span>
                <div>
                  <h3 className="display-serif on-cream text-[1.25rem] font-normal md:text-[1.45rem]">{c.title}</h3>
                  <p className="mt-2 font-sans text-[14.5px] leading-relaxed text-taupe md:text-[15.5px]">{c.text}</p>
                  {c.source && (
                    <p className="mt-4 border-t border-ink/10 pt-3 font-sans text-[10.5px] uppercase tracking-[0.16em] text-taupe">
                      <span className="mr-2 text-or">◆</span>Source : {c.source}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PIÈGES À ÉVITER */}
        <section className="mb-24 md:mb-32">
          <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
            <span className="eyebrow-editorial on-cream mb-2 mx-auto">Attention</span>
            <h2 className="display-serif on-cream mt-4 text-[2.2rem] font-normal md:text-[3.4rem]">
              {pitfallsTitle}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3 md:gap-7">
            {pitfallsItems.map((p: any, i: number) => (
              <div key={i} className="rounded-[20px] border-l-2 border-or bg-ivoire p-7">
                <div className="mb-3 num-editorial !text-[28px] !text-or">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="display-serif on-cream text-[1.15rem] font-normal">{p.title}</h3>
                <p className="mt-3 font-sans text-[14.5px] leading-relaxed text-taupe md:text-[15px]">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-24 md:mb-32">
          <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
            <span className="eyebrow-editorial on-cream mb-2 mx-auto">FAQ</span>
            <h2 className="display-serif on-cream mt-4 text-[2.2rem] font-normal md:text-[3.4rem]">
              {faqTitle}
            </h2>
          </div>
          <div className="mx-auto max-w-3xl divide-y divide-ink/10 border-y border-ink/10">
            {faqItems.map((q: any, i: number) => (
              <details key={i} className="group py-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                  <h3 className="display-serif on-cream text-[19px] font-normal leading-tight md:text-[21px]">{q.question}</h3>
                  <span aria-hidden className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full text-or transition-transform group-open:rotate-45">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 5v14M5 12h14"/></svg>
                  </span>
                </summary>
                <p className="mt-4 max-w-[64ch] font-sans text-[15px] leading-relaxed text-taupe">{q.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final éditorial */}
        <section className="rounded-[28px] bg-noir p-10 text-center text-ivoire md:p-16">
          <span className="eyebrow-editorial mb-3 mx-auto">Encore une hésitation</span>
          <h2 className="display-serif mt-4 text-[2rem] font-normal text-ivoire md:text-[3rem]">
            Toujours <em>indécis</em> ?
          </h2>
          <p className="mx-auto mt-5 max-w-lg font-serif text-[17px] italic leading-relaxed text-ivoire/70 md:text-[19px]">
            Parlez à un conseiller sommeil DreamsFly — réponse en moins de 4 h ouvrées, sans obligation d'achat.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link
              href="/aide/contact"
              className="inline-flex items-center gap-3 rounded-pill bg-ivoire px-7 py-3.5 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-noir transition-all hover:bg-or hover:-translate-y-px"
            >
              Nous contacter
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </Link>
            <Link
              href="/magasins"
              className="border-b border-white/30 pb-1 font-sans text-[12px] uppercase tracking-[0.14em] text-ivoire/80 transition-colors hover:text-or hover:border-or"
            >
              Trouver un showroom
            </Link>
          </div>
        </section>
      </main>

      <Footer settings={siteSettings} />

      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      {faqItems.length > 0 && <JsonLd data={faqSchema(faqItems)} />}
    </>
  );
}
