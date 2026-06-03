import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { allGlossaryTermsQuery } from "@/lib/sanity/extra-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, organizationSchema } from "@/lib/seo/jsonld";

export const revalidate = 600;

export const metadata: Metadata = buildMetadata({
  title: "Glossaire de la literie — Tout le vocabulaire du sommeil",
  description:
    "Mémoire de forme, ressorts ensachés, densité, latex, indépendance de couchage : toutes les définitions des termes literie expliquées simplement.",
  path: "/glossaire",
});

export default async function GlossaireHub() {
  const [terms, siteSettings] = await Promise.all([
    sanityClient?.fetch<any[]>(allGlossaryTermsQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
  ]);

  // Grouper par catégorie
  const byCategory: Record<string, any[]> = {};
  terms.forEach((t) => {
    const cat = t.category || "Autres";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(t);
  });

  // Lettre initiale (index alphabétique)
  const byLetter: Record<string, any[]> = {};
  terms.forEach((t) => {
    const letter = (t.term?.[0] || "?").toUpperCase();
    if (!byLetter[letter]) byLetter[letter] = [];
    byLetter[letter].push(t);
  });
  const letters = Object.keys(byLetter).sort();

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Glossaire", url: "/glossaire" },
  ];

  return (
    <>
      <Header settings={siteSettings} />
      <main className="mx-auto max-w-site px-8 py-12 md:py-16">
        <nav className="mb-8 flex items-center gap-1.5 text-sm text-pierre">
          <Link href="/" className="hover:text-midnight">Accueil</Link>
          <span className="text-brume">/</span>
          <span className="font-medium text-ink">Glossaire</span>
        </nav>

        <header className="mb-12 max-w-3xl">
          <div className="eyebrow mb-3">Vocabulaire du sommeil</div>
          <h1 className="font-sora text-4xl font-semibold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            Glossaire de la literie.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-pierre md:text-xl">
            Densité, mémoire de forme, ressorts ensachés, accueil tonique :
            toutes les définitions des termes literie expliquées simplement.
          </p>
        </header>

        {terms.length === 0 ? (
          <p className="text-pierre">
            Le glossaire s'enrichit progressivement. Les premières définitions arrivent bientôt.
          </p>
        ) : (
          <>
            {/* Index alphabétique */}
            <nav aria-label="Index alphabétique" className="mb-10 flex flex-wrap gap-2">
              {letters.map((l) => (
                <a
                  key={l}
                  href={`#${l}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-ivoire font-sora text-sm font-semibold text-ink transition-colors hover:border-midnight hover:bg-midnight hover:text-white"
                >
                  {l}
                </a>
              ))}
            </nav>

            {/* Listes par lettre */}
            <div className="space-y-12">
              {letters.map((l) => (
                <section key={l} id={l}>
                  <h2 className="mb-4 font-sora text-3xl font-semibold tracking-tight text-midnight">
                    {l}
                  </h2>
                  <div className="grid gap-3 md:grid-cols-2">
                    {byLetter[l].map((t) => (
                      <Link
                        key={t._id}
                        href={`/glossaire/${t.slug}`}
                        className="group block rounded-2xl border border-border bg-ivoire p-5 transition-all hover:-translate-y-0.5 hover:border-midnight"
                      >
                        <h3 className="font-sora text-base font-semibold tracking-tight text-ink group-hover:text-midnight">
                          {t.term}
                        </h3>
                        {t.shortDefinition && (
                          <p className="mt-1.5 line-clamp-2 text-[13.5px] text-pierre">{t.shortDefinition}</p>
                        )}
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer settings={siteSettings} />

      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}
