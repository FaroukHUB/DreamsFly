import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity/client";
import { magazineHubQuery } from "@/lib/sanity/guide-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, organizationSchema } from "@/lib/seo/jsonld";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 300;

export const metadata: Metadata = buildMetadata({
  title: "Magazine du sommeil",
  description:
    "Guides d'experts, conseils pratiques et études sur le sommeil, le matelas et le bien-être. Rédigé par notre équipe et nos partenaires.",
  path: "/magazine",
});

const TYPE_LABELS: Record<string, string> = {
  "buying-guide": "Guide d'achat",
  "how-to": "Tutoriel",
  comparison: "Comparatif",
  health: "Santé du sommeil",
  tips: "Conseils",
  review: "Banc d'essai",
};

export default async function MagazineHub() {
  const [data, siteSettings] = await Promise.all([
    sanityClient?.fetch<any>(magazineHubQuery).catch(() => null) ?? null,
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
  ]);

  const featured = data?.featured;
  const recent = data?.recent || [];

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Magazine", url: "/magazine" },
  ];

  return (
    <>
      <Header settings={siteSettings} />
      <EditorialPageHeader
        breadcrumbs={[{ name: "Accueil", url: "/" }, { name: "Magazine", url: "/magazine" }]}
        eyebrow="Magazine du sommeil"
        title="Tout comprendre sur le sommeil."
        lead="Guides pratiques, conseils d'experts et études sur le matelas, le confort et la qualité de votre repos."
      />
      <main className="mx-auto max-w-site px-6 py-14 md:px-10 md:py-20">

        {/* Article featured */}
        {featured && (
          <Link
            href={`/magazine/${featured.slug}`}
            className="group mb-16 grid grid-cols-1 gap-8 overflow-hidden rounded-3xl border border-border bg-ivoire transition-all hover:border-midnight lg:grid-cols-2"
          >
            <div className="relative aspect-[4/3] bg-sable lg:aspect-auto">
              {featured.coverImage && (
                <Image
                  src={urlFor(featured.coverImage).width(1200).quality(85).url()}
                  alt={featured.title}
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <div className="eyebrow mb-3">
                {TYPE_LABELS[featured.articleType] || "Article"}
              </div>
              <h2 className="mb-4 font-sora text-3xl font-semibold leading-tight tracking-tight text-ink md:text-4xl">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="mb-5 text-[16px] leading-relaxed text-pierre line-clamp-3">
                  {featured.excerpt}
                </p>
              )}
              <div className="text-xs uppercase tracking-wide text-midnight font-semibold">
                Lire l'article →
              </div>
            </div>
          </Link>
        )}

        {/* Articles récents */}
        {recent.length > 0 && (
          <section>
            <h2 className="mb-8 font-sora text-2xl font-semibold tracking-tight text-ink">
              Articles récents
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recent.map((a: any) => (
                <Link
                  key={a._id}
                  href={`/magazine/${a.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-ivoire transition-all hover:-translate-y-1 hover:border-midnight"
                >
                  <div className="relative aspect-[16/10] bg-sable">
                    {a.coverImage && (
                      <Image
                        src={urlFor(a.coverImage).width(600).quality(85).url()}
                        alt={a.title}
                        fill
                        sizes="(max-width:1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-midnight">
                      {TYPE_LABELS[a.articleType] || "Article"}
                    </div>
                    <h3 className="font-sora text-lg font-semibold tracking-tight text-ink group-hover:text-midnight">
                      {a.title}
                    </h3>
                    {a.excerpt && (
                      <p className="mt-2 line-clamp-2 text-[13.5px] text-pierre">{a.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {recent.length === 0 && !featured && (
          <p className="text-pierre">
            Aucun article publié pour le moment. Le magazine s'enrichit progressivement.
          </p>
        )}
      </main>
      <Footer settings={siteSettings} />

      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
