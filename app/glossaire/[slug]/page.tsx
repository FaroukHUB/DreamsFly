import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import {
  glossaryTermBySlugQuery,
  allGlossarySlugsQuery,
} from "@/lib/sanity/extra-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  JsonLd,
  breadcrumbSchema,
  definedTermSchema,
  organizationSchema,
} from "@/lib/seo/jsonld";

export const revalidate = 600;

type Params = { slug: string };

export async function generateStaticParams() {
  if (!sanityClient) return [];
  try {
    const slugs = await sanityClient.fetch<{ slug: string }[]>(allGlossarySlugsQuery);
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  if (!sanityClient) return buildMetadata({ path: `/glossaire/${slug}` });
  const t = await sanityClient.fetch<any>(glossaryTermBySlugQuery, { slug }).catch(() => null);
  if (!t) return buildMetadata({ path: `/glossaire/${slug}`, noindex: true });

  return buildMetadata({
    title: `${t.term} — Définition`,
    description: t.shortDefinition,
    path: `/glossaire/${slug}`,
    type: "article",
  });
}

export default async function GlossaryTermPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!sanityClient) notFound();

  const [t, siteSettings] = await Promise.all([
    sanityClient.fetch<any>(glossaryTermBySlugQuery, { slug }).catch(() => null),
    sanityClient.fetch<any>(siteSettingsQuery).catch(() => null),
  ]);

  if (!t) notFound();

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Glossaire", url: "/glossaire" },
    { name: t.term, url: `/glossaire/${slug}` },
  ];

  return (
    <>
      <Header settings={siteSettings} />
      <main className="mx-auto max-w-3xl px-6 py-14 md:px-8 md:py-20">
        <nav className="mb-10 flex flex-wrap items-center gap-2 font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">
          <Link href="/" className="transition-colors hover:text-or">Accueil</Link>
          <span className="opacity-40">/</span>
          <Link href="/glossaire" className="transition-colors hover:text-or">Glossaire</Link>
          <span className="opacity-40">/</span>
          <span className="text-ink">{t.term}</span>
        </nav>

        <article>
          {t.category && <span className="eyebrow-editorial on-cream mb-3">{t.category}</span>}
          <h1 className="display-serif on-cream mt-4 text-[2.4rem] font-normal md:text-[4rem]">
            {t.term}
          </h1>

          <div className="my-10 border-l-2 border-or bg-creme/40 px-8 py-6">
            <h2 className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-taupe">
              <span className="mr-2 text-or">◆</span>Définition
            </h2>
            <p className="font-serif text-[19px] italic leading-relaxed text-ink">{t.shortDefinition}</p>
          </div>

          {/* Synonymes */}
          {t.synonyms && t.synonyms.length > 0 && (
            <div className="mb-8 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-pierre">Synonymes :</span>
              {t.synonyms.map((syn: string, i: number) => (
                <span key={i} className="rounded-pill bg-sable px-3 py-1 text-sm text-ink">
                  {syn}
                </span>
              ))}
            </div>
          )}

          {/* Définition longue */}
          {t.longDefinition && (
            <div className="prose-content mt-10">
              <PortableText value={t.longDefinition} />
            </div>
          )}

          {/* Termes liés */}
          {t.relatedTerms && t.relatedTerms.length > 0 && (
            <section className="mt-16 border-t border-border pt-10">
              <h2 className="mb-6 font-sora text-2xl font-semibold tracking-tight">À découvrir aussi</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {t.relatedTerms.map((r: any) => (
                  <Link
                    key={r._id}
                    href={`/glossaire/${r.slug}`}
                    className="group rounded-2xl border border-border bg-ivoire p-5 transition-all hover:-translate-y-0.5 hover:border-midnight"
                  >
                    <h3 className="font-sora text-base font-semibold tracking-tight text-ink group-hover:text-midnight">
                      {r.term}
                    </h3>
                    {r.shortDefinition && (
                      <p className="mt-1.5 line-clamp-2 text-[13.5px] text-pierre">{r.shortDefinition}</p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>
      <Footer settings={siteSettings} />

      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={definedTermSchema(t.term, t.shortDefinition)} />
    </>
  );
}
