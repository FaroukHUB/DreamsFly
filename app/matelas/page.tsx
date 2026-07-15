import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity/client";
import { pillarPageQuery, allProductsForPillarQuery } from "@/lib/sanity/product-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Sections } from "@/components/landing/blocks";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, organizationSchema, faqSchema } from "@/lib/seo/jsonld";
import { CategorySeoSections } from "@/components/category/category-seo-sections";
import { categoryFaq } from "@/lib/category-defaults";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 120;

type SearchParams = Promise<{ type?: string; size?: string }>;

const TYPE_LABELS: Record<string, string> = {
  "memoire-ressorts": "Mémoire de forme",
  "mousse-hr-ressorts": "Hybride",
  "mousse-ressorts": "Ressorts ensachés",
  "mousse-polyurethane": "Mousse polyuréthane",
};

const TYPE_TILES = [
  { slug: "memoire-ressorts", title: "Mémoire de forme", subtitle: "Enveloppant · Soulagement des points de pression" },
  { slug: "mousse-hr-ressorts", title: "Hybride", subtitle: "Mémoire de forme + ressorts ensachés" },
  { slug: "mousse-ressorts", title: "Ressorts ensachés", subtitle: "Indépendance de couchage maximale" },
  { slug: "mousse-polyurethane", title: "Mousse polyuréthane", subtitle: "Excellent rapport qualité-prix" },
];

const SIZE_TILES = ["90 x 190", "140 x 190", "160 x 200", "180 x 200", "140 x 200"];

/**
 * Extrait les dimensions largeur × longueur depuis un texte de taille.
 * Accepte tous les formats : "90x190", "90 x 190", "90×190", "90X190",
 * "90x190 cm", "90 x 190cm", etc.
 */
/**
 * Extrait les 2 premiers nombres 2-3 chiffres d'un texte, triés.
 * Marche pour n'importe quel séparateur : x, X, ×, /, -, espace, cm, texte...
 * Ex : "90x190" → [90, 190] ; "90 / 190 cm" → [90, 190] ; "L 90 · l 190" → [90, 190]
 */
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

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { type, size } = await searchParams;
  const pillar = sanityClient ? await sanityClient.fetch<any>(pillarPageQuery).catch(() => null) : null;

  const filterLabel = type
    ? ` — ${TYPE_LABELS[type] || type}`
    : size
      ? ` — ${size}`
      : "";

  return buildMetadata({
    title: (pillar?.metaTitle || pillar?.h1 || "Tous nos matelas") + filterLabel,
    description:
      pillar?.metaDescription ||
      "Découvrez l'intégralité des matelas DreamsFly : mémoire de forme, hybride, ressorts ensachés, mousse polyuréthane. Confection française.",
    path: "/matelas",
  });
}

export default async function MatelasPillar({ searchParams }: { searchParams: SearchParams }) {
  const { type, size } = await searchParams;

  const [pillar, allProducts, siteSettings] = await Promise.all([
    sanityClient?.fetch<any>(pillarPageQuery).catch(() => null) ?? null,
    sanityClient?.fetch<any[]>(allProductsForPillarQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
  ]);

  // Filtrage server-side
  let products = allProducts;
  if (type) {
    products = products.filter((p: any) => p.type === type);
  }
  if (size) {
    products = products.filter((p: any) =>
      (p.variants || []).some((v: any) => sizesMatch(v.size, size))
    );
  }

  const activeFilter = type ? TYPE_LABELS[type] || type : size || null;
  const clearFilterHref = "/matelas#modeles";

  const h1 = pillar?.h1 || "Tous nos matelas DreamsFly";
  const intro =
    pillar?.intro ||
    "Notre collection complète de matelas premium, du modèle d'entrée de gamme à la pièce d'exception. Chaque modèle porte le nom d'une ville : choisissez votre destination de sommeil parmi nos technologies signature.";

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Matelas", url: "/matelas" },
  ];

  return (
    <>
      <Header settings={siteSettings} />

      <main className="mx-auto max-w-site px-6 py-12 md:px-8 md:py-16">
        {/* Breadcrumbs */}
        <nav aria-label="Fil d'Ariane" className="mb-8 flex items-center gap-1.5 text-sm text-pierre">
          <Link href="/" className="hover:text-midnight">Accueil</Link>
          <span className="text-brume">/</span>
          <span className="font-medium text-ink">Matelas</span>
        </nav>

        {/* H1 + intro */}
        <header className="mb-14 max-w-3xl md:mb-16">
          <div className="eyebrow mb-3">Collection complète</div>
          <h1 className="font-sora text-3xl font-semibold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            {h1}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-pierre md:mt-6 md:text-xl">{intro}</p>
        </header>

        {/* Explorer par technologie */}
        <section className="mb-14 md:mb-16">
          <h2 className="mb-2 font-sora text-xl font-semibold tracking-tight text-ink md:text-3xl">
            Par technologie
          </h2>
          <p className="mb-6 max-w-xl text-pierre md:mb-8">
            Chaque technologie a ses atouts. Cliquez pour filtrer la collection.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-4">
            {TYPE_TILES.map((t) => (
              <FilterTile
                key={t.slug}
                title={t.title}
                subtitle={t.subtitle}
                href={`/matelas?type=${t.slug}#modeles`}
                active={type === t.slug}
              />
            ))}
          </div>
        </section>

        {/* Explorer par taille */}
        <section className="mb-14 md:mb-16">
          <h2 className="mb-2 font-sora text-xl font-semibold tracking-tight text-ink md:text-3xl">
            Par taille
          </h2>
          <p className="mb-6 max-w-xl text-pierre md:mb-8">
            Du studio compact au lit king size — filtrez la collection par format.
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3 lg:grid-cols-5">
            {SIZE_TILES.map((s) => {
              const paramValue = s.replace(/\s/g, "").toLowerCase();
              const isActive = sizesMatch(size, s);
              return (
                <FilterTile
                  key={s}
                  compact
                  title={s.replace(/ /g, "")}
                  href={`/matelas?size=${paramValue}#modeles`}
                  active={isActive}
                />
              );
            })}
          </div>
        </section>

        {/* Grille produits + indicateur filtre actif */}
        <section id="modeles" className="mb-16 scroll-mt-20 md:mb-20">
          <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-sora text-xl font-semibold tracking-tight text-ink md:text-3xl">
                {activeFilter ? `Matelas — ${activeFilter}` : "La collection complète"}
              </h2>
              <p className="mt-1 text-sm text-pierre md:text-base">
                {products.length} modèle{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
                {activeFilter && ` (sur ${allProducts.length})`}
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
                  href={`/matelas/${p.slug}`}
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
              <p className="text-pierre">Aucun matelas ne correspond à ce filtre.</p>
              <Link href={clearFilterHref} className="mt-4 inline-block text-sm font-semibold text-midnight underline">
                Voir tous les matelas
              </Link>
            </div>
          )}
        </section>

        {/* Sections SEO enrichies (avantages, guide, comparatif, conseils, entretien, FAQ) */}
        <CategorySeoSections productType="matelas" categoryLabel="matelas" overrides={pillar} />

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
          pillar?.categoryFaqOverride?.length ? pillar.categoryFaqOverride : categoryFaq("matelas")
        )}
      />
    </>
  );
}

function FilterTile({
  title,
  subtitle,
  href,
  compact,
  active,
}: {
  title: string;
  subtitle?: string;
  href: string;
  compact?: boolean;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col justify-between rounded-2xl border p-4 transition-all hover:-translate-y-1 md:p-5 ${
        active
          ? "border-midnight bg-midnight text-white hover:bg-midnight-dark"
          : "border-border bg-ivoire text-ink hover:border-midnight"
      } ${compact ? "min-h-[80px] md:min-h-[90px]" : "min-h-[130px] md:min-h-[140px]"}`}
    >
      <div>
        <h3 className={`font-sora ${compact ? "text-sm md:text-base" : "text-base md:text-lg"} font-semibold tracking-tight`}>
          {title}
        </h3>
        {subtitle && (
          <p className={`mt-1 text-[12px] md:text-[13px] ${active ? "text-white/75" : "text-pierre"}`}>
            {subtitle}
          </p>
        )}
      </div>
      <span className={`mt-3 text-[10px] font-semibold uppercase tracking-widest md:text-xs ${active ? "text-aurora" : "text-midnight"}`}>
        {active ? "Filtré ✓" : "Filtrer →"}
      </span>
    </Link>
  );
}
