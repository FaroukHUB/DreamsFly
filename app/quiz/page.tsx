import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { allProductsForPillarQuery } from "@/lib/sanity/product-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { QuizWidget } from "@/components/quiz/quiz-widget";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, organizationSchema, faqSchema } from "@/lib/seo/jsonld";
import { defaultQuizSteps, defaultQuizContent, type QuizStep } from "@/lib/quiz-defaults";
import { groq } from "next-sanity";

export const revalidate = 300;

const quizPageQuery = groq`*[_type == "quizPage"][0]{ ... }`;

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

      <main className="mx-auto max-w-site px-6 py-10 md:px-8 md:py-16">
        {/* Breadcrumbs */}
        <nav aria-label="Fil d'Ariane" className="mb-8 flex items-center gap-1.5 text-sm text-pierre">
          <Link href="/" className="hover:text-midnight">Accueil</Link>
          <span className="text-brume">/</span>
          <span className="font-medium text-ink">Quiz matelas</span>
        </nav>

        {/* HERO */}
        <header className="mb-12 text-center md:mb-16">
          <div className="eyebrow mb-3">{hero.eyebrow}</div>
          <h1 className="mx-auto max-w-4xl font-sora text-3xl font-semibold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          {hero.subtitle && (
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pierre md:mt-6 md:text-lg">
              {hero.subtitle}
            </p>
          )}
        </header>

        {/* QUIZ WIDGET */}
        <section id="quiz" className="mb-20 rounded-3xl border border-border bg-white p-6 md:mb-24 md:p-10">
          <QuizWidget steps={steps} products={products} />
        </section>

        {/* MÉTHODE */}
        <section className="mb-20 md:mb-24">
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <div className="eyebrow mb-2">Notre méthode</div>
            <h2 className="font-sora text-2xl font-semibold tracking-tight text-ink md:text-4xl">
              {methodTitle}
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {methodSteps.map((s: any, i: number) => (
              <div key={i} className="rounded-2xl border border-border bg-white p-6">
                <span aria-hidden className="mb-3 block text-3xl">{s.icon}</span>
                <h3 className="font-sora text-base font-semibold text-ink md:text-lg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-pierre">{s.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CRITÈRES DÉTAILLÉS */}
        <section className="mb-20 rounded-3xl bg-ivoire p-6 md:mb-24 md:p-12">
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <div className="eyebrow mb-2">Approche experte</div>
            <h2 className="font-sora text-2xl font-semibold tracking-tight text-ink md:text-4xl">
              {criteriaTitle}
            </h2>
          </div>
          <div className="mx-auto max-w-4xl space-y-6">
            {criteriaItems.map((c: any, i: number) => (
              <article key={i} className="grid gap-4 rounded-2xl bg-white p-6 md:grid-cols-[auto_1fr] md:gap-6 md:p-8">
                <span aria-hidden className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-aurora text-2xl md:h-14 md:w-14 md:text-3xl">
                  {c.icon}
                </span>
                <div>
                  <h3 className="font-sora text-lg font-semibold text-ink md:text-xl">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-pierre md:text-base">{c.text}</p>
                  {c.source && (
                    <p className="mt-3 text-[11px] uppercase tracking-widest text-brume md:text-xs">
                      Source : {c.source}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* PIÈGES À ÉVITER */}
        <section className="mb-20 md:mb-24">
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <div className="eyebrow mb-2">Attention</div>
            <h2 className="font-sora text-2xl font-semibold tracking-tight text-ink md:text-4xl">
              {pitfallsTitle}
            </h2>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {pitfallsItems.map((p: any, i: number) => (
              <div key={i} className="rounded-2xl border-l-4 border-terracotta bg-white p-6 shadow-sm">
                <h3 className="font-sora text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-pierre md:text-base">{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20 md:mb-24">
          <div className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
            <div className="eyebrow mb-2">FAQ</div>
            <h2 className="font-sora text-2xl font-semibold tracking-tight text-ink md:text-4xl">
              {faqTitle}
            </h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-3">
            {faqItems.map((q: any, i: number) => (
              <details key={i} className="group rounded-2xl border border-border bg-white p-5 open:border-midnight md:p-6">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <h3 className="font-sora text-base font-semibold text-ink md:text-lg">{q.question}</h3>
                  <span aria-hidden className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-border text-midnight transition-transform group-open:rotate-45">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 text-sm leading-relaxed text-pierre md:text-base">{q.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="rounded-3xl bg-gradient-to-br from-midnight to-midnight-dark p-8 text-center text-white md:p-12">
          <h2 className="font-sora text-2xl font-semibold tracking-tight md:text-3xl">
            Toujours indécis ?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/85 md:text-lg">
            Parlez à un conseiller sommeil DreamsFly — réponse en moins de 4 h ouvrées, sans obligation d'achat.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/aide/contact"
              className="inline-flex items-center justify-center rounded-pill bg-ivoire px-6 py-3 font-sora text-sm font-semibold text-midnight transition-all hover:bg-aurora hover:-translate-y-px md:text-base"
            >
              Nous contacter
            </Link>
            <Link
              href="/magasins"
              className="inline-flex items-center justify-center rounded-pill border border-white/40 px-6 py-3 font-sora text-sm font-semibold text-white transition-all hover:bg-white/10 md:text-base"
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
