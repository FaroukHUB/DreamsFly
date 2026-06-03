/**
 * Route catch-all flat — sert toutes les landing pages SEO :
 *   /matelas-140x190, /matelas-memoire-de-forme, /matelas-mal-de-dos, etc.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import {
  landingPageBySlugQuery,
  allLandingSlugsQuery,
  relatedLandingPagesQuery,
} from "@/lib/sanity/landing-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Sections } from "@/components/landing/blocks";
import { LandingHero } from "@/components/landing/landing-hero";
import { ContextualProducts } from "@/components/landing/contextual-products";
import { TrustBar } from "@/components/trust-bar";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  JsonLd,
  breadcrumbSchema,
  articleSchema,
  organizationSchema,
} from "@/lib/seo/jsonld";

const RESERVED = new Set([
  "matelas", "magazine", "comparatifs", "glossaire", "magasins", "marque",
  "panier", "checkout", "compte", "aide", "studio", "api", "debug", "test",
  "robots.txt", "sitemap.xml", "favicon.ico",
]);

type Params = { slug: string };

export const revalidate = 60;

export async function generateStaticParams() {
  if (!sanityClient) return [];
  try {
    const slugs = await sanityClient.fetch<{ slug: string }[]>(allLandingSlugsQuery);
    return slugs.filter((s) => s.slug && !RESERVED.has(s.slug)).map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED.has(slug)) return {};
  if (!sanityClient) return buildMetadata({ path: `/${slug}` });

  const page = await sanityClient.fetch<any>(landingPageBySlugQuery, { slug }).catch(() => null);
  if (!page) return buildMetadata({ path: `/${slug}`, noindex: true });

  return buildMetadata({
    title: page.metaTitle || page.h1,
    description: page.metaDescription || page.intro,
    path: `/${slug}`,
    noindex: page.noindex,
    type: "article",
    publishedTime: page.publishedAt,
    modifiedTime: page.lastReviewedAt || page.publishedAt,
  });
}

export default async function LandingPageRoute({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (RESERVED.has(slug)) notFound();
  if (!sanityClient) notFound();

  const [page, siteSettings] = await Promise.all([
    sanityClient.fetch<any>(landingPageBySlugQuery, { slug }).catch(() => null),
    sanityClient.fetch<any>(siteSettingsQuery).catch(() => null),
  ]);

  if (!page) notFound();

  // Maillage interne automatique via tags
  let relatedPages: any[] = [];
  if (page.tags?.length) {
    relatedPages = await sanityClient
      .fetch<any[]>(relatedLandingPagesQuery, {
        currentId: page._id,
        currentTags: page.tags,
        limit: 5,
      })
      .catch(() => []);
  }

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Matelas", url: "/matelas" },
    { name: page.h1 || page.name, url: `/${slug}` },
  ];

  // Détecte si l'éditeur a déjà placé un productsGrid pour éviter le doublon
  const hasManualProductsGrid = page.sections?.some(
    (s: any) => s._type === "productsGrid"
  );

  return (
    <>
      <Header settings={siteSettings} />

      {/* TrustBar pleine largeur sous le header */}
      <TrustBar />

      <main className="mx-auto max-w-site px-8 py-12 md:py-16">
        {/* Breadcrumbs visibles */}
        <nav aria-label="Fil d'Ariane" className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-pierre">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-brume">/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className="font-medium text-ink">{b.name}</span>
              ) : (
                <Link href={b.url} className="hover:text-midnight">
                  {b.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Hero zone enrichi (texte + visuel ou OG image) */}
        <LandingHero
          editorialAngle={page.editorialAngle}
          h1={page.h1}
          intro={page.intro}
          focusKeyword={page.focusKeyword}
          ogImage={page.ogImage}
        />

        {/* Produits contextuels auto (uniquement si pas déjà placés manuellement) */}
        <div className="my-16">
          <ContextualProducts
            pageType={page.pageType}
            slug={slug}
            alreadyHasProductsGrid={hasManualProductsGrid}
          />
        </div>
      </main>

      {/* Sections composables — full-bleed avec shells alternés selon layout */}
      <Sections sections={page.sections} layout={page.layout || "editorial"} withShells />

      <main className="mx-auto max-w-site px-8 py-12 md:py-16">
        {/* Maillage interne automatique (tags) */}
        {relatedPages.length > 0 && (
          <section className="mt-4 border-t border-border pt-12">
            <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink">
              Explorez aussi
            </h2>
            <p className="mb-6 max-w-xl text-pierre">
              Approfondissez votre choix avec ces autres univers DreamsFly.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPages.map((p: any) => (
                <Link
                  key={p._id}
                  href={`/${p.slug}`}
                  className="group rounded-2xl border border-border bg-ivoire p-5 transition-all hover:-translate-y-1 hover:border-midnight"
                >
                  <h3 className="font-sora text-base font-semibold tracking-tight text-ink group-hover:text-midnight">
                    {p.h1}
                  </h3>
                  {p.focusKeyword && (
                    <div className="mt-2 text-xs uppercase tracking-wide text-brume">
                      {p.focusKeyword}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA final vers la collection */}
        <section className="mt-16 rounded-3xl bg-midnight p-12 text-center text-white">
          <h2 className="font-sora text-3xl font-semibold tracking-tight md:text-4xl">
            Pas encore décidé ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-lg text-white/85">
            Explorez l'intégralité de notre collection ou contactez nos conseillers.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/matelas"
              className="inline-flex items-center gap-2 rounded-pill bg-ivoire px-7 py-3.5 font-sans text-base font-semibold text-midnight transition-all hover:bg-aurora hover:-translate-y-px"
            >
              Voir tous les matelas →
            </Link>
            <Link
              href="/aide/contact"
              className="text-sm font-medium text-white/80 hover:text-aurora"
            >
              Parler à un conseiller
            </Link>
          </div>
        </section>

        {/* E-E-A-T footer */}
        {(page.lastReviewedAt || (page.author?.name && !page.author?.isPlaceholder)) && (
          <footer className="mt-16 border-t border-border pt-6 text-sm text-pierre">
            {page.author?.name && !page.author?.isPlaceholder && (
              <p>
                Article rédigé par <strong className="text-ink">{page.author.name}</strong>
                {page.author.role && <span>, {page.author.role}</span>}
              </p>
            )}
            {page.reviewer?.name && !page.reviewer?.isPlaceholder && (
              <p className="mt-1">
                Relu et validé par <strong className="text-ink">{page.reviewer.name}</strong>
                {page.reviewer.role && <span>, {page.reviewer.role}</span>}
              </p>
            )}
            {page.lastReviewedAt && (
              <p className="mt-1">
                Dernière mise à jour :{" "}
                {new Date(page.lastReviewedAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </footer>
        )}
      </main>

      <Footer settings={siteSettings} />

      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={articleSchema({
          title: page.h1,
          description: page.metaDescription || page.intro,
          url: `/${slug}`,
          publishedAt: page.publishedAt,
          updatedAt: page.lastReviewedAt,
          author:
            page.author?.name && !page.author?.isPlaceholder
              ? { name: page.author.name }
              : undefined,
          reviewedBy:
            page.reviewer?.name && !page.reviewer?.isPlaceholder
              ? { name: page.reviewer.name }
              : undefined,
          articleType: "Article",
        })}
      />
    </>
  );
}
