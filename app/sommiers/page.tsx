import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity/client";
import { pillarSommiersQuery, allSommiersQuery } from "@/lib/sanity/product-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
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
  types?: string;
  sizes?: string;
  priceMin?: string;
  priceMax?: string;
  sort?: string;
}>;

const TYPE_LABELS: Record<string, string> = {
  "lattes-apparentes": "À lattes apparentes",
  "lattes-recouvertes": "À lattes recouvertes",
  tapissier: "Tapissier",
  ressorts: "À ressorts",
  coffre: "Coffre avec rangement",
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
  const text = `${product.title || ""} ${product.name || ""} ${product.slug || ""}`;
  const found: string[] = text.match(/\d{2,3}/g) || [];
  return found.includes(String(target[0])) && found.includes(String(target[1]));
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const sp = await searchParams;
  const pillar = sanityClient ? await sanityClient.fetch<any>(pillarSommiersQuery).catch(() => null) : null;
  const nbFilters = [sp.types, sp.sizes, sp.priceMin, sp.priceMax].filter(Boolean).length;
  const filterLabel = nbFilters > 0 ? " — sélection filtrée" : "";
  return buildMetadata({
    title: (pillar?.metaTitle || pillar?.h1 || "Sommiers premium — DreamsFly") + filterLabel,
    description:
      pillar?.metaDescription ||
      "Découvrez notre collection de sommiers : à lattes, tapissiers, avec pieds inclus. Compatibilité tous matelas, garantie 5 ans, livraison à domicile.",
    path: "/sommiers",
  });
}

export default async function SommiersPillar({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const [pillar, allProducts, siteSettings, heros] = await Promise.all([
    sanityClient?.fetch<any>(pillarSommiersQuery).catch(() => null) ?? null,
    sanityClient?.fetch<any[]>(allSommiersQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
    fetchPageHeros(),
  ]);

  const selectedTypes = (sp.types || "").split(",").filter(Boolean);
  const selectedSizes = (sp.sizes || "").split(",").filter(Boolean);
  const priceMin = sp.priceMin ? parseInt(sp.priceMin, 10) : undefined;
  const priceMax = sp.priceMax ? parseInt(sp.priceMax, 10) : undefined;
  const sort = sp.sort || "featured";

  const allPrices = allProducts.map((p: any) => p.minPrice).filter((n: any) => typeof n === "number" && n > 0);
  const priceMaxBound = Math.ceil(Math.max(...allPrices, 800) / 50) * 50;
  const priceMinBound = Math.floor(Math.min(...allPrices, 100) / 50) * 50;

  let products = allProducts.slice();
  if (selectedTypes.length > 0) {
    products = products.filter((p: any) => p.sommierType && selectedTypes.includes(p.sommierType));
  }
  if (selectedSizes.length > 0) {
    products = products.filter((p: any) => selectedSizes.some((s) => productMatchesSize(p, s)));
  }
  if (typeof priceMin === "number") products = products.filter((p: any) => (p.minPrice || 0) >= priceMin);
  if (typeof priceMax === "number") products = products.filter((p: any) => (p.minPrice || 0) <= priceMax);

  if (sort === "price-asc") products.sort((a: any, b: any) => (a.minPrice || 0) - (b.minPrice || 0));
  else if (sort === "price-desc") products.sort((a: any, b: any) => (b.minPrice || 0) - (a.minPrice || 0));
  else if (sort === "name") products.sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));

  const countByType: Record<string, number> = {};
  for (const p of allProducts) {
    if (p.sommierType) countByType[p.sommierType] = (countByType[p.sommierType] || 0) + 1;
  }
  const countBySize: Record<string, number> = {};
  for (const p of allProducts) {
    for (const s of STANDARD_SIZES) {
      if (productMatchesSize(p, s)) countBySize[s] = (countBySize[s] || 0) + 1;
    }
  }

  const typeGroup = {
    key: "types",
    label: "Type",
    options: Object.entries(TYPE_LABELS).map(([value, label]) => ({
      value,
      label,
      count: countByType[value] || 0,
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
      { label: "< 200 €", max: 200 },
      { label: "200 – 400 €", min: 200, max: 400 },
      { label: "> 400 €", min: 400 },
    ],
  };

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
      <EditorialPageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Collection sommiers"
        title={h1}
        lead={intro}
        imageUrl={pickHeroImageUrl(heros.sommiers, "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1400")}
      />
      <main className="mx-auto max-w-site px-6 py-14 md:px-10 md:py-20">
        <section id="modeles" className="scroll-mt-20">
          <div className="md:grid md:grid-cols-[260px_1fr] md:gap-10 lg:gap-12">
            <FiltersSidebar
              groups={[typeGroup, sizeGroup]}
              price={priceGroup}
              totalCount={allProducts.length}
              filteredCount={products.length}
            />
            <div>
              <div className="mb-8 flex items-baseline justify-between">
                <h2 className="display-serif on-cream text-[1.5rem] font-normal md:text-[2rem]">
                  {products.length} sommier{products.length > 1 ? "s" : ""}
                  <span className="ml-3 font-sans text-[13px] font-normal uppercase tracking-[0.14em] text-taupe">
                    {selectedTypes.length + selectedSizes.length + (priceMin || priceMax ? 1 : 0) > 0
                      ? `/ ${allProducts.length}`
                      : "disponibles"}
                  </span>
                </h2>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 md:gap-8">
                  {products.map((p: any) => (
                    <Link
                      key={p._id}
                      href={`/sommiers/${p.slug}`}
                      className="group flex flex-col rounded-[24px] border border-ink/10 bg-ivoire p-5 transition-all duration-500 hover:-translate-y-1 hover:border-noir/40 hover:shadow-[0_24px_50px_-20px_rgba(11,11,15,0.2)]"
                    >
                      <div className="relative mb-6 aspect-[5/4] overflow-hidden rounded-[16px] bg-creme">
                        {p.image && (
                          <Image
                            src={urlFor(p.image).width(700).url()}
                            alt={p.name}
                            fill
                            sizes="(max-width:1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
                          />
                        )}
                        {p.sommierType && TYPE_LABELS[p.sommierType] && (
                          <span className="absolute left-3 top-3 rounded-full border border-noir bg-ivoire/95 px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-noir backdrop-blur-sm">
                            {TYPE_LABELS[p.sommierType].split(" ").slice(0, 2).join(" ")}
                          </span>
                        )}
                      </div>
                      <h3 className="display-serif on-cream text-[1.2rem] font-normal leading-tight md:text-[1.4rem]">{p.name}</h3>
                      <p className="mt-2 line-clamp-2 font-sans text-[13px] leading-relaxed text-taupe md:text-[14px]">{p.tagline}</p>
                      <div className="mt-5 flex items-baseline gap-2 border-t border-ink/10 pt-4">
                        <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">Dès</span>
                        <span className="font-serif text-[1.4rem] font-normal text-noir">{p.minPrice}€</span>
                        {p.compareAtPrice && p.compareAtPrice > p.minPrice && (
                          <span className="font-sans text-[13px] text-taupe line-through">{p.compareAtPrice}€</span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] border border-ink/10 bg-creme p-10 text-center">
                  <p className="font-serif text-[17px] italic text-taupe">
                    {allProducts.length === 0
                      ? "Aucun sommier publié pour le moment."
                      : "Aucun sommier ne correspond à ces filtres."}
                  </p>
                  <Link href="/sommiers#modeles" className="mt-5 inline-block border-b border-noir pb-1 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-noir hover:text-or hover:border-or">
                    Effacer les filtres
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

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
