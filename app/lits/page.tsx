import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity/client";
import { pillarLitsQuery, allLitsQuery } from "@/lib/sanity/product-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Sections } from "@/components/landing/blocks";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, organizationSchema, faqSchema } from "@/lib/seo/jsonld";
import { urlFor } from "@/lib/sanity/image";
import { CategorySeoSections } from "@/components/category/category-seo-sections";
import { categoryFaq } from "@/lib/category-defaults";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const pillar = sanityClient
    ? await sanityClient.fetch<any>(pillarLitsQuery).catch(() => null)
    : null;

  return buildMetadata({
    title: pillar?.metaTitle || pillar?.h1 || "Lits coffre & lits une place — DreamsFly",
    description:
      pillar?.metaDescription ||
      "Découvrez notre collection de lits coffre et lits une place : rangement optimisé, tissus premium (velours, lin, capitonné), livraison à domicile. Fabriqués en Europe.",
    path: "/lits",
  });
}

export default async function LitsPillar() {
  const [pillar, products, siteSettings] = await Promise.all([
    sanityClient?.fetch<any>(pillarLitsQuery).catch(() => null) ?? null,
    sanityClient?.fetch<any[]>(allLitsQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
  ]);

  const h1 = pillar?.h1 || "Lits coffre & lits une place DreamsFly";
  const intro =
    pillar?.intro ||
    "Un lit ne se résume pas à un cadre : c'est le socle de vos nuits, souvent la pièce maîtresse de la chambre. Notre sélection combine rangement optimisé (coffre), tissus nobles (velours, lin, capitonné) et fabrication européenne.";

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Lits", url: "/lits" },
  ];

  // Détection matière depuis titre/tagline pour explorers
  const byMaterial = {
    velours: products.filter((p) => /velours/i.test(p.title || "")),
    tissu: products.filter((p) => /tissu/i.test(p.title || "") && !/velours/i.test(p.title || "")),
    capitonne: products.filter((p) => /capiton|matelass/i.test(p.title || "")),
  };

  return (
    <>
      <Header settings={siteSettings} />

      <main className="mx-auto max-w-site px-6 py-10 md:px-8 md:py-16">
        {/* Breadcrumbs */}
        <nav aria-label="Fil d'Ariane" className="mb-8 flex items-center gap-1.5 text-sm text-pierre">
          <Link href="/" className="hover:text-midnight">Accueil</Link>
          <span className="text-brume">/</span>
          <span className="font-medium text-ink">Lits</span>
        </nav>

        {/* H1 + intro */}
        <header className="mb-14 max-w-3xl md:mb-16">
          <div className="eyebrow mb-3">Collection lits</div>
          <h1 className="font-sora text-3xl font-semibold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            {h1}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-pierre md:mt-6 md:text-xl">{intro}</p>
        </header>

        {/* Explorer par matière */}
        <section className="mb-16 md:mb-20">
          <h2 className="mb-2 font-sora text-xl font-semibold tracking-tight text-ink md:text-3xl">
            Par matière
          </h2>
          <p className="mb-6 max-w-xl text-pierre md:mb-8">
            Chaque tissu a sa personnalité — profondeur du velours, sobriété du tissu tramé, élégance du capitonné.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <MaterialTile
              title="Velours"
              subtitle={`${byMaterial.velours.length} modèle${byMaterial.velours.length > 1 ? "s" : ""} · Toucher chaleureux`}
              accent="from-midnight to-midnight-dark text-white"
            />
            <MaterialTile
              title="Tissu tramé"
              subtitle={`${byMaterial.tissu.length} modèle${byMaterial.tissu.length > 1 ? "s" : ""} · Sobriété contemporaine`}
              accent="from-aurora to-ivoire text-ink"
            />
            <MaterialTile
              title="Capitonné"
              subtitle={`${byMaterial.capitonne.length} modèle${byMaterial.capitonne.length > 1 ? "s" : ""} · Élégance travaillée`}
              accent="from-sable to-ivoire text-ink"
            />
          </div>
        </section>

        {/* Explorer par taille */}
        <section className="mb-16 md:mb-20">
          <h2 className="mb-2 font-sora text-xl font-semibold tracking-tight text-ink md:text-3xl">
            Par taille
          </h2>
          <p className="mb-6 max-w-xl text-pierre md:mb-8">
            Du lit une place pour la chambre d'ami au format king size pour la chambre parentale.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
            <ExploreTile compact title="90 × 190" subtitle="Une place" />
            <ExploreTile compact title="140 × 190" subtitle="Deux places" highlighted />
            <ExploreTile compact title="140 × 200" subtitle="Deux places" />
            <ExploreTile compact title="160 × 200" subtitle="Queen" />
            <ExploreTile compact title="180 × 200" subtitle="King" />
          </div>
        </section>

        {/* Tous les lits */}
        {products.length > 0 && (
          <section className="mb-16 md:mb-20">
            <h2 className="mb-2 font-sora text-xl font-semibold tracking-tight text-ink md:text-3xl">
              La collection complète
            </h2>
            <p className="mb-8 text-pierre">
              {products.length} lits · Livraison gratuite · Paiement en plusieurs fois
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <Link
                  key={p._id}
                  href={`/lits/${p.slug}`}
                  className="group flex flex-col rounded-2xl border border-border bg-ivoire p-4 transition-all hover:-translate-y-1 hover:border-midnight"
                >
                  <div className="relative mb-4 aspect-[5/4] overflow-hidden rounded-xl bg-sable">
                    {p.image && (
                      <Image
                        src={urlFor(p.image).width(500).url()}
                        alt={p.name}
                        fill
                        sizes="(max-width:1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h3 className="font-sora text-base font-semibold text-ink">{p.name}</h3>
                  <p className="mb-3 line-clamp-2 text-[13px] text-pierre">{p.tagline}</p>
                  <div className="mt-auto flex items-baseline gap-2 border-t border-border pt-3">
                    <span className="text-[11px] text-brume">Dès</span>
                    <span className="font-sora text-lg font-bold text-discount">{p.minPrice} €</span>
                    {p.compareAtPrice && p.compareAtPrice > p.minPrice && (
                      <span className="text-xs text-brume line-through">{p.compareAtPrice} €</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Sections SEO enrichies */}
        <CategorySeoSections productType="lit" categoryLabel="lit" overrides={pillar} />

        {/* Sections éditoriales depuis Sanity */}
        {pillar?.sections && (
          <div className="mt-16 md:mt-20">
            <Sections sections={pillar.sections} />
          </div>
        )}
      </main>

      <Footer settings={siteSettings} />

      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={faqSchema(
          pillar?.categoryFaqOverride?.length ? pillar.categoryFaqOverride : categoryFaq("lit")
        )}
      />
    </>
  );
}

function MaterialTile({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className={`flex flex-col justify-between rounded-2xl bg-gradient-to-br ${accent} p-6 min-h-[140px]`}>
      <div>
        <h3 className="font-sora text-xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-1.5 text-[13px] opacity-80">{subtitle}</p>
      </div>
      <span className="mt-4 text-xs font-semibold uppercase tracking-wide opacity-90">
        Découvrir ↓
      </span>
    </div>
  );
}

function ExploreTile({
  title,
  subtitle,
  compact,
  highlighted,
}: {
  title: string;
  subtitle?: string;
  compact?: boolean;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`flex flex-col justify-between rounded-2xl border p-4 md:p-5 ${
        highlighted
          ? "border-midnight bg-midnight text-white"
          : "border-border bg-ivoire text-ink"
      } ${compact ? "min-h-[80px] md:min-h-[90px]" : "min-h-[140px]"}`}
    >
      <div>
        <h3 className={`font-sora ${compact ? "text-sm md:text-base" : "text-lg"} font-semibold tracking-tight`}>
          {title}
        </h3>
        {subtitle && (
          <p className={`mt-1 text-[11px] md:text-[13px] ${highlighted ? "text-white/75" : "text-pierre"}`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
