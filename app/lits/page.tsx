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

type SearchParams = Promise<{ material?: string; size?: string }>;

const MATERIAL_LABELS: Record<string, string> = {
  velours: "Velours",
  "tissu-trame": "Tissu tramé",
  lin: "Lin",
  capitonne: "Capitonné",
  "simili-cuir": "Simili cuir",
};

/** Extraction fuzzy des 2 nombres de dimension (marche pour tous séparateurs). */
function extractDimensionsSet(s?: string): number[] {
  if (!s) return [];
  const nums = String(s).match(/\d{2,3}/g);
  if (!nums || nums.length < 2) return [];
  return nums.slice(0, 2).map((n) => parseInt(n, 10)).sort((a, b) => a - b);
}
function sizesMatch(a?: string, b?: string): boolean {
  const da = extractDimensionsSet(a);
  const db = extractDimensionsSet(b);
  if (da.length !== 2 || db.length !== 2) return false;
  return da[0] === db[0] && da[1] === db[1];
}

/** Détecte la matière depuis titre/tagline/champ litMaterial. */
function detectMaterial(product: any): string | null {
  if (product.litMaterial) return product.litMaterial;
  const text = `${product.title || ""} ${product.tagline || ""} ${product.name || ""}`.toLowerCase();
  if (/velour/.test(text)) return "velours";
  if (/capiton|matelass/.test(text)) return "capitonne";
  if (/\blin\b/.test(text)) return "lin";
  if (/simili|cuir/.test(text)) return "simili-cuir";
  if (/tissu|trame/.test(text)) return "tissu-trame";
  return null;
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { material, size } = await searchParams;
  const pillar = sanityClient ? await sanityClient.fetch<any>(pillarLitsQuery).catch(() => null) : null;

  const filterLabel = material
    ? ` — ${MATERIAL_LABELS[material] || material}`
    : size
      ? ` — ${size}`
      : "";

  return buildMetadata({
    title: (pillar?.metaTitle || pillar?.h1 || "Lits coffre & lits une place — DreamsFly") + filterLabel,
    description:
      pillar?.metaDescription ||
      "Découvrez notre collection de lits coffre et lits une place : rangement optimisé, tissus premium (velours, lin, capitonné), livraison à domicile. Fabriqués en Europe.",
    path: "/lits",
  });
}

export default async function LitsPillar({ searchParams }: { searchParams: SearchParams }) {
  const { material, size } = await searchParams;

  const [pillar, allProducts, siteSettings] = await Promise.all([
    sanityClient?.fetch<any>(pillarLitsQuery).catch(() => null) ?? null,
    sanityClient?.fetch<any[]>(allLitsQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
  ]);

  // Filtre server-side
  let products = allProducts;
  if (material) {
    products = products.filter((p: any) => detectMaterial(p) === material);
  }
  if (size) {
    products = products.filter((p: any) => {
      const inVariants = (p.variants || []).some((v: any) => sizesMatch(v.size, size));
      return inVariants || sizesMatch(p.title, size) || sizesMatch(p.name, size) || sizesMatch(p.slug, size) || sizesMatch(p.tagline, size);
    });
  }

  // Comptage pour les tuiles (basé sur allProducts, pas products filtré)
  const countByMaterial: Record<string, number> = {};
  for (const p of allProducts) {
    const m = detectMaterial(p);
    if (m) countByMaterial[m] = (countByMaterial[m] || 0) + 1;
  }

  const activeFilter = material ? MATERIAL_LABELS[material] || material : size || null;
  const clearFilterHref = "/lits#modeles";

  const h1 = pillar?.h1 || "Lits coffre & lits une place DreamsFly";
  const intro =
    pillar?.intro ||
    "Un lit ne se résume pas à un cadre : c'est le socle de vos nuits, souvent la pièce maîtresse de la chambre. Notre sélection combine rangement optimisé (coffre), tissus nobles (velours, lin, capitonné) et fabrication européenne.";

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Lits", url: "/lits" },
  ];

  const MATERIAL_TILES = [
    { slug: "velours", title: "Velours", subtitle: "Toucher chaleureux", accent: "from-midnight to-midnight-dark text-white" },
    { slug: "tissu-trame", title: "Tissu tramé", subtitle: "Sobriété contemporaine", accent: "from-aurora to-ivoire text-ink" },
    { slug: "capitonne", title: "Capitonné", subtitle: "Élégance travaillée", accent: "from-sable to-ivoire text-ink" },
  ];

  const SIZE_TILES = [
    { label: "90 × 190", subtitle: "Une place", param: "90x190" },
    { label: "140 × 190", subtitle: "Deux places", param: "140x190" },
    { label: "140 × 200", subtitle: "Deux places", param: "140x200" },
    { label: "160 × 200", subtitle: "Queen", param: "160x200" },
    { label: "180 × 200", subtitle: "King", param: "180x200" },
  ];

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
            Chaque tissu a sa personnalité — cliquez pour filtrer la collection.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {MATERIAL_TILES.map((t) => {
              const count = countByMaterial[t.slug] || 0;
              const isActive = material === t.slug;
              return (
                <Link
                  key={t.slug}
                  href={`/lits?material=${t.slug}#modeles`}
                  className={`group relative flex flex-col justify-between rounded-2xl bg-gradient-to-br p-6 transition-all hover:-translate-y-1 ${t.accent} ${
                    isActive ? "ring-2 ring-midnight ring-offset-2" : ""
                  } min-h-[140px]`}
                >
                  <div>
                    <h3 className="font-sora text-xl font-semibold tracking-tight">{t.title}</h3>
                    <p className="mt-1.5 text-[13px] opacity-80">
                      {count} modèle{count > 1 ? "s" : ""} · {t.subtitle}
                    </p>
                  </div>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-wide opacity-90">
                    {isActive ? "Filtré ✓" : "Filtrer →"}
                  </span>
                </Link>
              );
            })}
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
            {SIZE_TILES.map((s) => {
              const isActive = sizesMatch(size, s.param);
              return (
                <Link
                  key={s.param}
                  href={`/lits?size=${s.param}#modeles`}
                  className={`flex flex-col justify-between rounded-2xl border p-4 transition-all hover:-translate-y-1 md:p-5 ${
                    isActive
                      ? "border-midnight bg-midnight text-white"
                      : "border-border bg-ivoire text-ink hover:border-midnight"
                  } min-h-[80px] md:min-h-[90px]`}
                >
                  <div>
                    <h3 className="font-sora text-sm font-semibold tracking-tight md:text-base">
                      {s.label}
                    </h3>
                    <p className={`mt-1 text-[11px] md:text-[13px] ${isActive ? "text-white/75" : "text-pierre"}`}>
                      {s.subtitle}
                    </p>
                  </div>
                  <span className={`mt-2 text-[10px] font-semibold uppercase tracking-widest md:text-xs ${isActive ? "text-aurora" : "text-midnight"}`}>
                    {isActive ? "Filtré ✓" : "Filtrer →"}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Tous les lits + indicateur de filtre */}
        <section id="modeles" className="mb-16 scroll-mt-20 md:mb-20">
          <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-sora text-xl font-semibold tracking-tight text-ink md:text-3xl">
                {activeFilter ? `Lits — ${activeFilter}` : "La collection complète"}
              </h2>
              <p className="mt-1 text-sm text-pierre md:text-base">
                {products.length} lit{products.length > 1 ? "s" : ""}
                {activeFilter && ` (sur ${allProducts.length})`}
                {" · Livraison gratuite · Paiement en plusieurs fois"}
              </p>
            </div>
            {activeFilter && (
              <Link
                href={clearFilterHref}
                className="inline-flex w-fit items-center gap-2 rounded-pill border border-border bg-white px-4 py-2 text-sm font-medium text-midnight hover:border-midnight"
              >
                ✕ Retirer le filtre
              </Link>
            )}
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p: any) => (
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
          ) : (
            <div className="rounded-2xl border border-border bg-sable p-8 text-center">
              <p className="text-pierre">Aucun lit ne correspond à ce filtre.</p>
              <Link href={clearFilterHref} className="mt-4 inline-block text-sm font-semibold text-midnight underline">
                Voir tous les lits
              </Link>
            </div>
          )}
        </section>

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
