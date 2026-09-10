import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { allComparisonsQuery, publishedComparisonsCountQuery } from "@/lib/sanity/extra-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { Footer } from "@/components/footer";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, organizationSchema } from "@/lib/seo/jsonld";

export const revalidate = 600;

/**
 * `noindex` tant qu'aucun comparatif n'est publié.
 *
 * La page affiche alors un titre, un chapô et une phrase d'attente — une
 * trentaine de mots. Ce n'est pas une page vide, mais c'est une page en
 * attente de contenu, et Google la classe en contenu insuffisant.
 *
 * `follow` est conservé : les liens internes continuent de circuler, et la
 * page reste crawlable — indispensable pour que le retrait du `noindex`
 * soit constaté le jour où les comparatifs arrivent.
 *
 * La retirer du sitemap n'aurait rien changé : elle est liée depuis le pied
 * de page, donc découverte de toute façon. Le sitemap suggère, il ne
 * contrôle pas l'indexation.
 */
export async function generateMetadata(): Promise<Metadata> {
  const count = sanityClient
    ? await sanityClient.fetch<number>(publishedComparisonsCountQuery).catch(() => 0)
    : 0;

  return buildMetadata({
    title: "Comparatifs matelas — DreamsFly face aux concurrents",
    description:
      "Comparatifs honnêtes entre DreamsFly et les autres marques françaises de matelas en ligne. Tests, technologies, prix, garanties.",
    path: "/comparatifs",
    noindex: !count,
  });
}

export default async function ComparatifsHub() {
  const [items, siteSettings] = await Promise.all([
    sanityClient?.fetch<any[]>(allComparisonsQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
  ]);

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Comparatifs", url: "/comparatifs" },
  ];

  return (
    <>
      <Header settings={siteSettings} />
      <EditorialPageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Confrontation"
        title="Comparatifs matelas"
        lead="DreamsFly face aux autres marques, critère par critère : technologies, fermetés, garanties et prix. Sans raccourci."
      />
      <main className="mx-auto max-w-site px-6 py-14 md:px-10 md:py-20">

        {items.length === 0 ? (
          <p className="text-pierre">Les comparatifs arrivent prochainement.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((c) => (
              <Link
                key={c._id}
                href={`/comparatifs/${c.slug}`}
                className="group flex flex-col rounded-2xl border border-border bg-ivoire p-6 transition-all hover:-translate-y-1 hover:border-midnight"
              >
                <h2 className="font-sora text-xl font-semibold tracking-tight text-ink group-hover:text-midnight">
                  {c.title}
                </h2>
                {c.intro && (
                  <p className="mt-3 line-clamp-3 text-[14.5px] text-pierre">{c.intro}</p>
                )}
                <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wide text-midnight">
                  Lire le comparatif →
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer settings={siteSettings} />

      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
