import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity/client";
import { pillarSommiersQuery, allSommiersQuery } from "@/lib/sanity/product-queries";
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

type SearchParams = Promise<{ type?: string; size?: string }>;

const TYPE_LABELS: Record<string, string> = {
  "lattes-apparentes": "À lattes apparentes",
  "lattes-recouvertes": "À lattes recouvertes",
  tapissier: "Tapissier",
  ressorts: "À ressorts",
  coffre: "Coffre avec rangement",
};

const TYPE_TILES = [
  { slug: "lattes-apparentes", title: "Lattes apparentes", subtitle: "Ventilation maximale" },
  { slug: "lattes-recouvertes", title: "Lattes recouvertes", subtitle: "Look plus fini" },
  { slug: "tapissier", title: "Tapissier", subtitle: "Soutien dense, silencieux" },
];

const SIZE_TILES = [
  { label: "90 × 190", subtitle: "Une place", param: "90x190" },
  { label: "140 × 190", subtitle: "Deux places", param: "140x190" },
  { label: "160 × 200", subtitle: "Queen", param: "160x200" },
  { label: "180 × 200", subtitle: "King", param: "180x200" },
];

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
  const pillar = sanityClient ? await sanityClient.fetch<any>(pillarSommiersQuery).catch(() => null) : null;
  const filterLabel = type ? ` — ${TYPE_LABELS[type] || type}` : size ? ` — ${size}` : "";
  return buildMetadata({
    title: (pillar?.metaTitle || pillar?.h1 || "Sommiers premium — DreamsFly") + filterLabel,
    description:
      pillar?.metaDescription ||
      "Découvrez notre collection de sommiers : à lattes, tapissiers, avec pieds inclus. Compatibilité tous matelas, garantie 5 ans, livraison à domicile.",
    path: "/sommiers",
  });
}

export default async function SommiersPillar({ searchParams }: { searchParams: SearchParams }) {
  const { type, size } = await searchParams;

  const [pillar, allProducts, siteSettings] = await Promise.all([
    sanityClient?.fetch<any>(pillarSommiersQuery).catch(() => null) ?? null,
    sanityClient?.fetch<any[]>(allSommiersQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
  ]);

  let products = allProducts;
  if (type) products = products.filter((p: any) => p.sommierType === type);
  if (size) {
    products = products.filter((p: any) => {
      const inVariants = (p.variants || []).some((v: any) => sizesMatch(v.size, size));
      return inVariants || sizesMatch(p.title, size) || sizesMatch(p.name, size) || sizesMatch(p.slug, size);
    });
  }

  const countByType: Record<string, number> = {};
  for (const p of allProducts) {
    if (p.sommierType) countByType[p.sommierType] = (countByType[p.sommierType] || 0) + 1;
  }

  const activeFilter = type ? TYPE_LABELS[type] || type : size || null;
  const h1 = pillar?.h1 || "Sommiers premium DreamsFly";
  const intro =
    pillar?.intro ||
    "Le sommier est la fondation de vos nuits — souvent oublié, il conditionne pourtant la durée de vie de votre matelas et la qualité de votre sommeil. Notre sélection privilégie bois massif européen, ventilation et longévité.";

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Sommiers", url: "/sommiers" },
  ];

  return (
    <>
      <Header settings={siteSettings} />

      <main className="mx-auto max-w-site px-6 py-10 md:px-8 md:py-16">
        <nav aria-label="Fil d'Ariane" className="mb-8 flex items-center gap-1.5 text-sm text-pierre">
          <Link href="/" className="hover:text-midnight">Accueil</Link>
          <span className="text-brume">/</span>
          <span className="font-medium text-ink">Sommiers</span>
        </nav>

        <header className="mb-14 max-w-3xl md:mb-16">
          <div className="eyebrow mb-3">Collection sommiers</div>
          <h1 className="font-sora text-3xl font-semibold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            {h1}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-pierre md:mt-6 md:text-xl">{intro}</p>
        </header>

        {/* Explorer par type */}
        <section className="mb-14 md:mb-16">
          <h2 className="mb-2 font-sora text-xl font-semibold tracking-tight text-ink md:text-3xl">Par type</h2>
          <p className="mb-6 max-w-xl text-pierre md:mb-8">Chaque type a ses atouts — filtrer la collection.</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
            {TYPE_TILES.map((t) => {
              const count = countByType[t.slug] || 0;
              const isActive = type === t.slug;
              return (
                <Link
                  key={t.slug}
                  href={`/sommiers?type=${t.slug}#modeles`}
                  className={`group flex flex-col justify-between rounded-2xl border p-5 transition-all hover:-translate-y-1 min-h-[120px] ${
                    isActive ? "border-midnight bg-midnight text-white" : "border-border bg-ivoire text-ink hover:border-midnight"
                  }`}
                >
                  <div>
                    <h3 className="font-sora text-lg font-semibold tracking-tight">{t.title}</h3>
                    <p className={`mt-1 text-[13px] ${isActive ? "text-white/75" : "text-pierre"}`}>
                      {count > 0 && `${count} modèle${count > 1 ? "s" : ""} · `}{t.subtitle}
                    </p>
                  </div>
                  <span className={`mt-3 text-xs font-semibold uppercase tracking-widest ${isActive ? "text-aurora" : "text-midnight"}`}>
                    {isActive ? "Filtré ✓" : "Filtrer →"}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Explorer par taille */}
        <section className="mb-14 md:mb-16">
          <h2 className="mb-2 font-sora text-xl font-semibold tracking-tight text-ink md:text-3xl">Par taille</h2>
          <p className="mb-6 max-w-xl text-pierre md:mb-8">Choisis le format adapté à ton matelas.</p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:gap-3">
            {SIZE_TILES.map((s) => {
              const isActive = sizesMatch(size, s.param);
              return (
                <Link
                  key={s.param}
                  href={`/sommiers?size=${s.param}#modeles`}
                  className={`flex flex-col justify-between rounded-2xl border p-4 transition-all hover:-translate-y-1 md:p-5 min-h-[80px] md:min-h-[90px] ${
                    isActive ? "border-midnight bg-midnight text-white" : "border-border bg-ivoire text-ink hover:border-midnight"
                  }`}
                >
                  <div>
                    <h3 className="font-sora text-sm font-semibold tracking-tight md:text-base">{s.label}</h3>
                    <p className={`mt-1 text-[11px] md:text-[13px] ${isActive ? "text-white/75" : "text-pierre"}`}>{s.subtitle}</p>
                  </div>
                  <span className={`mt-2 text-[10px] font-semibold uppercase tracking-widest md:text-xs ${isActive ? "text-aurora" : "text-midnight"}`}>
                    {isActive ? "Filtré ✓" : "Filtrer →"}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Grille produits */}
        <section id="modeles" className="mb-16 scroll-mt-20 md:mb-20">
          <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-sora text-xl font-semibold tracking-tight text-ink md:text-3xl">
                {activeFilter ? `Sommiers — ${activeFilter}` : "La collection complète"}
              </h2>
              <p className="mt-1 text-sm text-pierre md:text-base">
                {products.length} sommier{products.length > 1 ? "s" : ""}
                {activeFilter && ` (sur ${allProducts.length})`} · Livraison gratuite · Paiement en plusieurs fois
              </p>
            </div>
            {activeFilter && (
              <Link
                href="/sommiers#modeles"
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
                  href={`/sommiers/${p.slug}`}
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
              <p className="text-pierre">
                {allProducts.length === 0
                  ? "Aucun sommier publié pour le moment."
                  : "Aucun sommier ne correspond à ce filtre."}
              </p>
              {activeFilter && (
                <Link href="/sommiers#modeles" className="mt-4 inline-block text-sm font-semibold text-midnight underline">
                  Voir tous les sommiers
                </Link>
              )}
            </div>
          )}
        </section>

        {/* Sections SEO enrichies */}
        <CategorySeoSections productType="sommier" categoryLabel="sommier" overrides={pillar} />

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
          pillar?.categoryFaqOverride?.length ? pillar.categoryFaqOverride : categoryFaq("sommier")
        )}
      />
    </>
  );
}
