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
      <main className="mx-auto max-w-3xl px-8 py-12 md:py-16">
        <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-pierre">
          <Link href="/" className="hover:text-midnight">Accueil</Link>
          <span className="text-brume">/</span>
          <Link href="/glossaire" className="hover:text-midnight">Glossaire</Link>
          <span className="text-brume">/</span>
          <span className="font-medium text-ink">{t.term}</span>
        </nav>

        <article>
          {t.category && <div className="eyebrow mb-3">{t.category}</div>}
          <h1 className="font-sora text-4xl font-semibold leading-tight tracking-tight text-ink md:text-5xl">
            {t.term}
          </h1>

          {/* Définition courte — AI extract */}
          <div className="my-8 rounded-2xl border border-aurora/50 bg-aurora/10 p-6">
            <h2 className="mb-2 font-sora text-sm font-semibold uppercase tracking-wider text-midnight">
              Définition
            </h2>
            <p className="text-lg leading-relaxed text-ink">{t.shortDefinition}</p>
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
