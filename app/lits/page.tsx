import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity/client";
import { pillarLitsQuery, allLitsQuery } from "@/lib/sanity/product-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SeoCrossLinks } from "@/components/seo-cross-links";
import { Sections } from "@/components/landing/blocks";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { fetchPageHeros, pickHeroImageUrl } from "@/lib/sanity/page-heros";
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

  const [pillar, allProducts, siteSettings, heros] = await Promise.all([
    sanityClient?.fetch<any>(pillarLitsQuery).catch(() => null) ?? null,
    sanityClient?.fetch<any[]>(allLitsQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
    fetchPageHeros(),
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
      <EditorialPageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Collection lits"
        title={h1}
        lead={intro}
        imageUrl={pickHeroImageUrl(heros.lits, "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg?auto=compress&cs=tinysrgb&w=1400")}
      />
      <main className="mx-auto max-w-site px-6 py-14 md:px-10 md:py-20">
        <section id="modeles" className="scroll-mt-20">
          <div className="md:grid md:grid-cols-[260px_1fr] md:gap-10 lg:gap-12">
            <FiltersSidebar
              groups={[materialGroup, sizeGroup]}
              price={priceGroup}
              totalCount={allProducts.length}
              filteredCount={products.length}
            />
            <div>
              <div className="mb-8 flex items-baseline justify-between">
                <h2 className="display-serif on-cream text-[1.5rem] font-normal md:text-[2rem]">
                  {products.length} lit{products.length > 1 ? "s" : ""}
                  <span className="ml-3 font-sans text-[13px] font-normal uppercase tracking-[0.14em] text-taupe">
                    {selectedMaterials.length + selectedSizes.length + (priceMin || priceMax ? 1 : 0) > 0
                      ? `/ ${allProducts.length}`
                      : "disponibles"}
                  </span>
                </h2>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 md:gap-8">
                  {products.map((p: any) => {
                    const m = detectMaterial(p);
                    return (
                      <Link
                        key={p._id}
                        href={`/lits/${p.slug}`}
                        className="group flex flex-col overflow-hidden rounded-[20px] bg-ivoire transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(11,11,15,0.2)]"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-creme">
                          {p.image && (
                            <Image
                              src={urlFor(p.image).width(800).url()}
                              alt={p.name}
                              fill
                              sizes="(max-width:1024px) 50vw, 33vw"
                              className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
                            />
                          )}
                          <span className="absolute left-4 top-4 rounded-md bg-noir px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-ivoire">
                            Essayez-le en magasin
                          </span>
                          {p.compareAtPrice && p.compareAtPrice > p.minPrice && (
                            <span className="absolute right-4 top-4 rounded-md bg-discount px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-ivoire">
                              −{Math.round(((p.compareAtPrice - p.minPrice) / p.compareAtPrice) * 100)}%
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col p-5 md:p-6">
                          <div className="font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-taupe">{p.name}</div>
                          <h3 className="mt-2 line-clamp-2 font-serif text-[16px] font-normal leading-snug text-noir md:text-[17px]">{p.tagline || p.title}</h3>
                          <div className="mt-4 flex items-baseline gap-2.5">
                            <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">Dès</span>
                            <span className={`font-serif text-[1.35rem] font-semibold ${p.compareAtPrice && p.compareAtPrice > p.minPrice ? "text-discount" : "text-noir"}`}>{p.minPrice}€</span>
                            {p.compareAtPrice && p.compareAtPrice > p.minPrice && (
                              <span className="font-sans text-[13px] text-taupe line-through">{p.compareAtPrice}€</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[24px] border border-ink/10 bg-creme p-10 text-center">
                  <p className="font-serif text-[17px] italic text-taupe">Aucun lit ne correspond à ces filtres.</p>
                  <Link href="/lits#modeles" className="mt-5 inline-block border-b border-noir pb-1 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-noir hover:text-or hover:border-or">
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

      <SeoCrossLinks
        links={[
          { href: "/lits-coffre", label: "Guide du lit coffre" },
          { href: "/magazine/guide-choisir-lit", label: "Comment choisir son lit" },
          { href: "/sommiers", label: "Nos sommiers" },
          { href: "/matelas", label: "Nos matelas" },
        ]}
      />
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
