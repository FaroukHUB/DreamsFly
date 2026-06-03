import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { allComparisonsQuery } from "@/lib/sanity/extra-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, organizationSchema } from "@/lib/seo/jsonld";

export const revalidate = 600;

export const metadata: Metadata = buildMetadata({
  title: "Comparatifs matelas — DreamsFly face aux concurrents",
  description:
    "Comparatifs honnêtes entre DreamsFly et les autres marques françaises de matelas en ligne. Tests, technologies, prix, garanties.",
  path: "/comparatifs",
});

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
      <main className="mx-auto max-w-site px-8 py-12 md:py-16">
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-pierre">
          <Link href="/" className="hover:text-midnight">Accueil</Link>
          <span className="text-brume">/</span>
          <span className="font-medium text-ink">Comparatifs</span>
        </nav>

        <header className="mb-12 max-w-3xl">
          <div className="eyebrow mb-3">Confrontation</div>
          <h1 className="font-sora text-4xl font-semibold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            Comparatifs matelas
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-pierre md:text-xl">
            DreamsFly face aux autres marques. Analyse honnête, critère par critère.
            Pas de bullshit marketing — juste les faits.
          </p>
        </header>

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
