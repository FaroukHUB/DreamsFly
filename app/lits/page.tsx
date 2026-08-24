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
import { FiltersSidebar } from "@/components/category/filters-sidebar";
import { categoryFaq } from "@/lib/category-defaults";

export const revalidate = 120;

type SearchParams = Promise<{
  materials?: string;
  sizes?: string;
  priceMin?: string;
  priceMax?: string;
  sort?: string;
}>;

const MATERIAL_LABELS: Record<string, string> = {
  velours: "Velours",
  "tissu-trame": "Tissu tramé",
  lin: "Lin",
  capitonne: "Capitonné",
  "simili-cuir": "Simili cuir",
};

const STANDARD_SIZES = ["90x190", "140x190", "140x200", "160x200", "180x200"];
const SIZE_LABELS: Record<string, string> = {
  "90x190": "90 × 190 (une place)",
  "140x190": "140 × 190 (deux places)",
  "140x200": "140 × 200",
  "160x200": "160 × 200 (Queen)",
  "180x200": "180 × 200 (King)",
};

function extractDims(s?: string): number[] {
  if (!s) return [];
  const nums = String(s).match(/\d{2,3}/g);
  if (!nums || nums.length < 2) return [];
  return nums.slice(0, 2).map((n) => parseInt(n, 10)).sort((a, b) => a - b);
}

function productMatchesSize(product: any, sizeKey: string): boolean {
  const target = extractDims(sizeKey);
  if (target.length !== 2) return false;
  const inVariants = (product.variants || []).some((v: any) => {
    const d = extractDims(v.size);
    return d.length === 2 && d[0] === target[0] && d[1] === target[1];
  });
  if (inVariants) return true;
  const text = `${product.title || ""} ${product.name || ""} ${product.slug || ""} ${product.tagline || ""}`;
  const found: string[] = text.match(/\d{2,3}/g) || [];
  return found.includes(String(target[0])) && found.includes(String(target[1]));
}

/** Détecte la matière depuis litMaterial ou fallback texte. */
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
  const sp = await searchParams;
  const pillar = sanityClient ? await sanityClient.fetch<any>(pillarLitsQuery).catch(() => null) : null;
  const nbFilters = [sp.materials, sp.sizes, sp.priceMin, sp.priceMax].filter(Boolean).length;
  const filterLabel = nbFilters > 0 ? " — sélection filtrée" : "";
  return buildMetadata({
    title: (pillar?.metaTitle || pillar?.h1 || "Lits coffre & lits une place — DreamsFly") + filterLabel,
    description:
      pillar?.metaDescription ||
      "Découvrez notre collection de lits coffre et lits une place : rangement optimisé, tissus premium (velours, lin, capitonné), livraison à domicile. Fabriqués en Europe.",
    path: "/lits",
  });
}

export default async function LitsPillar({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const [pillar, allProducts, siteSettings] = await Promise.all([
    sanityClient?.fetch<any>(pillarLitsQuery).catch(() => null) ?? null,
    sanityClient?.fetch<any[]>(allLitsQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
  ]);

  const selectedMaterials = (sp.materials || "").split(",").filter(Boolean);
  const selectedSizes = (sp.sizes || "").split(",").filter(Boolean);
  const priceMin = sp.priceMin ? parseInt(sp.priceMin, 10) : undefined;
  const priceMax = sp.priceMax ? parseInt(sp.priceMax, 10) : undefined;
  const sort = sp.sort || "featured";

  const allPrices = allProducts.map((p: any) => p.minPrice).filter((n: any) => typeof n === "number" && n > 0);
  const priceMaxBound = Math.ceil(Math.max(...allPrices, 2000) / 100) * 100;
  const priceMinBound = Math.floor(Math.min(...allPrices, 200) / 100) * 100;

  let products = allProducts.slice();
  if (selectedMaterials.length > 0) {
    products = products.filter((p: any) => {
      const m = detectMaterial(p);
      return m && selectedMaterials.includes(m);
    });
  }
  if (selectedSizes.length > 0) {
    products = products.filter((p: any) => selectedSizes.some((s) => productMatchesSize(p, s)));
  }
  if (typeof priceMin === "number") products = products.filter((p: any) => (p.minPrice || 0) >= priceMin);
  if (typeof priceMax === "number") products = products.filter((p: any) => (p.minPrice || 0) <= priceMax);

  if (sort === "price-asc") products.sort((a: any, b: any) => (a.minPrice || 0) - (b.minPrice || 0));
  else if (sort === "price-desc") products.sort((a: any, b: any) => (b.minPrice || 0) - (a.minPrice || 0));
  else if (sort === "name") products.sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));

  const countByMaterial: Record<string, number> = {};
  for (const p of allProducts) {
    const m = detectMaterial(p);
    if (m) countByMaterial[m] = (countByMaterial[m] || 0) + 1;
  }
  const countBySize: Record<string, number> = {};
  for (const p of allProducts) {
    for (const s of STANDARD_SIZES) {
      if (productMatchesSize(p, s)) countBySize[s] = (countBySize[s] || 0) + 1;
    }
  }

  const materialGroup = {
    key: "materials",
    label: "Matière",
    options: Object.entries(MATERIAL_LABELS).map(([value, label]) => ({
      value,
      label,
      count: countByMaterial[value] || 0,
    })),
  };
  const sizeGroup = {
    key: "sizes",
    label: "Taille",
    options: STANDARD_SIZES.map((s) => ({
      value: s,
      label: SIZE_LABELS[s] || s,
      count: countBySize[s] || 0,
    })),
  };
  const priceGroup = {
    label: "Prix",
    min: priceMinBound,
    max: priceMaxBound,
    suggestions: [
      { label: "Tous", min: priceMinBound, max: priceMaxBound },
      { label: "< 600 €", max: 600 },
      { label: "600 – 900 €", min: 600, max: 900 },
      { label: "900 – 1 300 €", min: 900, max: 1300 },
      { label: "> 1 300 €", min: 1300 },
    ],
  };

  const h1 = pillar?.h1 || "Lits coffre & lits une place DreamsFly";
  const intro =
    pillar?.intro ||
    "Un lit ne se résume pas à un cadre : c'est le socle de vos nuits, souvent la pièce maîtresse de la chambre. Notre sélection combine rangement optimisé (coffre), tissus nobles (velours, lin, capitonné) et fabrication européenne.";
  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Lits", url: "/lits" },
  ];

  return (
    <>
      <Header settings={siteSettings} />
      <main className="mx-auto max-w-site px-6 py-10 md:px-8 md:py-16">
        <nav aria-label="Fil d'Ariane" className="mb-8 flex items-center gap-1.5 text-sm text-pierre">
          <Link href="/" className="hover:text-midnight">Accueil</Link>
          <span className="text-brume">/</span>
          <span className="font-medium text-ink">Lits</span>
        </nav>

        <header className="mb-10 max-w-3xl md:mb-14">
          <div className="eyebrow mb-3">Collection lits</div>
          <h1 className="font-sora text-3xl font-semibold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">{h1}</h1>
          <p className="mt-5 text-base leading-relaxed text-pierre md:mt-6 md:text-lg">{intro}</p>
        </header>

        <section id="modeles" className="scroll-mt-20">
          <div className="md:grid md:grid-cols-[260px_1fr] md:gap-10 lg:gap-12">
            <FiltersSidebar
              groups={[materialGroup, sizeGroup]}
              price={priceGroup}
              totalCount={allProducts.length}
              filteredCount={products.length}
            />
            <div>
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="font-sora text-xl font-semibold tracking-tight text-ink md:text-2xl">
                  {products.length} lit{products.length > 1 ? "s" : ""}
                  <span className="ml-2 text-sm font-normal text-pierre">
                    {selectedMaterials.length + selectedSizes.length + (priceMin || priceMax ? 1 : 0) > 0
                      ? `sur ${allProducts.length}`
                      : "disponibles"}
                  </span>
                </h2>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {products.map((p: any) => {
                    const m = detectMaterial(p);
                    return (
                      <Link
                        key={p._id}
                        href={`/lits/${p.slug}`}
                        className="group flex flex-col rounded-2xl border border-border bg-ivoire p-4 transition-all hover:-translate-y-1 hover:border-midnight"
                      >
                        <div className="relative mb-4 aspect-[5/4] overflow-hidden rounded-xl bg-sable">
                          {p.image && (
                            <Image
                              src={urlFor(p.image).width(600).url()}
                              alt={p.name}
                              fill
                              sizes="(max-width:1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )}
                          {m && MATERIAL_LABELS[m] && (
                            <span className="absolute left-2 top-2 rounded-pill bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-midnight backdrop-blur-sm">
                              {MATERIAL_LABELS[m]}
                            </span>
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
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-sable p-8 text-center">
                  <p className="text-pierre">Aucun lit ne correspond à ces filtres.</p>
                  <Link href="/lits#modeles" className="mt-4 inline-block text-sm font-semibold text-midnight underline">
                    Effacer les filtres
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <CategorySeoSections productType="lit" categoryLabel="lit" overrides={pillar} />

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
