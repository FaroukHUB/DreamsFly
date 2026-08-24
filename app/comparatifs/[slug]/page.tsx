import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { sanityClient } from "@/lib/sanity/client";
import {
  comparisonBySlugQuery,
  allComparisonSlugsQuery,
} from "@/lib/sanity/extra-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  JsonLd,
  breadcrumbSchema,
  articleSchema,
  organizationSchema,
} from "@/lib/seo/jsonld";

export const revalidate = 600;

type Params = { slug: string };

export async function generateStaticParams() {
  if (!sanityClient) return [];
  try {
    const slugs = await sanityClient.fetch<{ slug: string }[]>(allComparisonSlugsQuery);
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  if (!sanityClient) return buildMetadata({ path: `/comparatifs/${slug}` });
  const c = await sanityClient.fetch<any>(comparisonBySlugQuery, { slug }).catch(() => null);
  if (!c) return buildMetadata({ path: `/comparatifs/${slug}`, noindex: true });

  return buildMetadata({
    title: c.metaTitle || c.title,
    description: c.metaDescription || c.intro,
    path: `/comparatifs/${slug}`,
    type: "article",
    publishedTime: c.publishedAt,
  });
}

export default async function ComparisonPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!sanityClient) notFound();

  const [c, siteSettings] = await Promise.all([
    sanityClient.fetch<any>(comparisonBySlugQuery, { slug }).catch(() => null),
    sanityClient.fetch<any>(siteSettingsQuery).catch(() => null),
  ]);

  if (!c) notFound();

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Comparatifs", url: "/comparatifs" },
    { name: c.title, url: `/comparatifs/${slug}` },
  ];

  return (
    <>
      <Header settings={siteSettings} />
      <main className="mx-auto max-w-3xl px-6 py-14 md:px-8 md:py-20">
        <nav className="mb-10 flex flex-wrap items-center gap-2 font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">
          <Link href="/" className="transition-colors hover:text-or">Accueil</Link>
          <span className="opacity-40">/</span>
          <Link href="/comparatifs" className="transition-colors hover:text-or">Comparatifs</Link>
          <span className="opacity-40">/</span>
          <span className="text-ink line-clamp-1">{c.title}</span>
        </nav>

        <article>
          <header className="mb-14">
            <span className="eyebrow-editorial on-cream mb-3">Comparatif</span>
            <h1 className="display-serif on-cream mt-4 text-[2.2rem] font-normal md:text-[3.6rem]">
              {c.title}
            </h1>
            {c.intro && (
              <p className="mt-6 font-serif text-[18px] italic leading-relaxed text-taupe md:text-[22px]">{c.intro}</p>
            )}
          </header>

          {/* Tableau critères */}
          {c.criteria && c.criteria.length > 0 && (
            <section className="my-12">
              <h2 className="mb-6 font-sora text-2xl font-semibold tracking-tight text-ink">
                Critère par critère
              </h2>
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-sable">
                    <tr>
                      <th className="border-b border-border p-4 text-left font-sora font-semibold text-ink">
                        Critère
                      </th>
                      <th className="border-b border-border p-4 text-left font-sora font-semibold text-midnight">
                        DreamsFly
                      </th>
                      <th className="border-b border-border p-4 text-left font-sora font-semibold text-ink">
                        Concurrent
                      </th>
                      <th className="border-b border-border p-4 text-center font-sora font-semibold text-ink">
                        Avantage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.criteria.map((cr: any, i: number) => (
                      <tr key={i} className={i % 2 ? "bg-sable/40" : ""}>
                        <td className="border-b border-border p-4 font-semibold text-ink">{cr.label}</td>
                        <td className="border-b border-border p-4 text-pierre">{cr.us}</td>
                        <td className="border-b border-border p-4 text-pierre">{cr.them}</td>
                        <td className="border-b border-border p-4 text-center">
                          {cr.winner === "us" && <span className="text-success font-bold">✓ DreamsFly</span>}
                          {cr.winner === "them" && <span className="text-error font-bold">Concurrent</span>}
                          {cr.winner === "tie" && <span className="text-pierre">Égalité</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Verdict */}
          {c.verdict && (
            <section className="my-12 rounded-3xl bg-midnight p-8 text-white md:p-10">
              <h2 className="mb-4 font-sora text-2xl font-semibold tracking-tight">Verdict</h2>
              <div className="prose-content prose-invert max-w-none [&_p]:text-white/85 [&_strong]:text-white">
                <PortableText value={c.verdict} />
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="my-12 rounded-2xl border border-border bg-sable p-8 text-center">
            <h2 className="font-sora text-2xl font-semibold tracking-tight text-ink">
              Convaincu par DreamsFly ?
            </h2>
            <p className="mt-2 text-pierre">
              Découvrez notre collection complète et trouvez le matelas qui vous correspond.
            </p>
            <Link
              href="/matelas"
              className="mt-5 inline-flex items-center gap-2 rounded-pill bg-midnight px-7 py-3.5 font-sora text-base font-semibold text-white transition-all hover:bg-midnight-dark hover:-translate-y-px"
            >
              Voir tous les matelas →
            </Link>
          </section>
        </article>
      </main>
      <Footer settings={siteSettings} />

      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={articleSchema({
          title: c.title,
          description: c.metaDescription || c.intro,
          url: `/comparatifs/${slug}`,
          publishedAt: c.publishedAt,
        })}
      />
    </>
  );
}
