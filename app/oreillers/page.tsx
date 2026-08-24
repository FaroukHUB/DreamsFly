import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity/client";
import { pillarOreillersQuery, allOreillersQuery } from "@/lib/sanity/product-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Sections } from "@/components/landing/blocks";
import { EditorialPageHeader } from "@/components/editorial-page-header";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd, breadcrumbSchema, organizationSchema, faqSchema } from "@/lib/seo/jsonld";
import { urlFor } from "@/lib/sanity/image";
import { CategorySeoSections } from "@/components/category/category-seo-sections";
import { FiltersSidebar } from "@/components/category/filters-sidebar";
import { categoryFaq } from "@/lib/category-defaults";

export const revalidate = 120;

type SearchParams = Promise<{
  fillings?: string;
  shapes?: string;
  priceMin?: string;
  priceMax?: string;
  sort?: string;
}>;

const FILLING_LABELS: Record<string, string> = {
  "duvet-oie": "Duvet d'oie",
  plumes: "Plumes",
  "memoire-forme": "Mémoire de forme",
  latex: "Latex naturel",
  "fibre-recyclee": "Fibre recyclée",
  microfibre: "Microfibre",
};

const SHAPE_LABELS: Record<string, string> = {
  rectangulaire: "Rectangulaire",
  carre: "Carré",
  ergonomique: "Ergonomique (cervical)",
  traversin: "Traversin",
};

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const sp = await searchParams;
  const pillar = sanityClient ? await sanityClient.fetch<any>(pillarOreillersQuery).catch(() => null) : null;
  const nbFilters = [sp.fillings, sp.shapes, sp.priceMin, sp.priceMax].filter(Boolean).length;
  const filterLabel = nbFilters > 0 ? " — sélection filtrée" : "";
  return buildMetadata({
    title: (pillar?.metaTitle || pillar?.h1 || "Oreillers ergonomiques & duvet — DreamsFly") + filterLabel,
    description:
      pillar?.metaDescription ||
      "Découvrez notre collection d'oreillers : mémoire de forme, duvet, latex naturel, ergonomique. Housses lavables, anti-acariens, livraison sous 48h.",
    path: "/oreillers",
  });
}

export default async function OreillersPillar({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;

  const [pillar, allProducts, siteSettings] = await Promise.all([
    sanityClient?.fetch<any>(pillarOreillersQuery).catch(() => null) ?? null,
    sanityClient?.fetch<any[]>(allOreillersQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
  ]);

  const selectedFillings = (sp.fillings || "").split(",").filter(Boolean);
  const selectedShapes = (sp.shapes || "").split(",").filter(Boolean);
  const priceMin = sp.priceMin ? parseInt(sp.priceMin, 10) : undefined;
  const priceMax = sp.priceMax ? parseInt(sp.priceMax, 10) : undefined;
  const sort = sp.sort || "featured";

  const allPrices = allProducts.map((p: any) => p.minPrice).filter((n: any) => typeof n === "number" && n > 0);
  const priceMaxBound = Math.ceil(Math.max(...allPrices, 200) / 10) * 10;
  const priceMinBound = Math.floor(Math.min(...allPrices, 20) / 10) * 10;

  let products = allProducts.slice();
  if (selectedFillings.length > 0) {
    products = products.filter((p: any) => p.oreillerFilling && selectedFillings.includes(p.oreillerFilling));
  }
  if (selectedShapes.length > 0) {
    products = products.filter((p: any) => p.oreillerShape && selectedShapes.includes(p.oreillerShape));
  }
  if (typeof priceMin === "number") products = products.filter((p: any) => (p.minPrice || 0) >= priceMin);
  if (typeof priceMax === "number") products = products.filter((p: any) => (p.minPrice || 0) <= priceMax);

  if (sort === "price-asc") products.sort((a: any, b: any) => (a.minPrice || 0) - (b.minPrice || 0));
  else if (sort === "price-desc") products.sort((a: any, b: any) => (b.minPrice || 0) - (a.minPrice || 0));
  else if (sort === "name") products.sort((a: any, b: any) => (a.name || "").localeCompare(b.name || ""));

  const countByFilling: Record<string, number> = {};
  const countByShape: Record<string, number> = {};
  for (const p of allProducts) {
    if (p.oreillerFilling) countByFilling[p.oreillerFilling] = (countByFilling[p.oreillerFilling] || 0) + 1;
    if (p.oreillerShape) countByShape[p.oreillerShape] = (countByShape[p.oreillerShape] || 0) + 1;
  }

  const fillingGroup = {
    key: "fillings",
    label: "Garnissage",
    options: Object.entries(FILLING_LABELS).map(([value, label]) => ({
      value,
      label,
      count: countByFilling[value] || 0,
    })),
  };
  const shapeGroup = {
    key: "shapes",
    label: "Forme",
    options: Object.entries(SHAPE_LABELS).map(([value, label]) => ({
      value,
      label,
      count: countByShape[value] || 0,
    })),
  };
  const priceGroup = {
    label: "Prix",
    min: priceMinBound,
    max: priceMaxBound,
    suggestions: [
      { label: "Tous", min: priceMinBound, max: priceMaxBound },
      { label: "< 50 €", max: 50 },
      { label: "50 – 100 €", min: 50, max: 100 },
      { label: "> 100 €", min: 100 },
    ],
  };

  const h1 = pillar?.h1 || "Oreillers premium DreamsFly";
  const intro =
    pillar?.intro ||
    "L'oreiller est votre partenaire cervical de chaque nuit — ni trop haut, ni trop bas, il aligne votre nuque et évite les tensions matinales. Notre sélection couvre tous les profils : duvet, mémoire de forme, ergonomique, latex.";
  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Oreillers", url: "/oreillers" },
  ];

  return (
    <>
      <Header settings={siteSettings} />
      <EditorialPageHeader
        breadcrumbs={breadcrumbs}
        eyebrow="Collection oreillers"
        title={h1}
        lead={intro}
      />
      <main className="mx-auto max-w-site px-6 py-14 md:px-10 md:py-20">
        <section id="modeles" className="scroll-mt-20">
          <div className="md:grid md:grid-cols-[260px_1fr] md:gap-10 lg:gap-12">
            <FiltersSidebar
              groups={[fillingGroup, shapeGroup]}
              price={priceGroup}
              totalCount={allProducts.length}
              filteredCount={products.length}
            />
            <div>
              <div className="mb-6 flex items-baseline justify-between">
                <h2 className="font-sora text-xl font-semibold tracking-tight text-ink md:text-2xl">
                  {products.length} oreiller{products.length > 1 ? "s" : ""}
                  <span className="ml-2 text-sm font-normal text-pierre">
                    {selectedFillings.length + selectedShapes.length + (priceMin || priceMax ? 1 : 0) > 0
                      ? `sur ${allProducts.length}`
                      : "disponibles"}
                  </span>
                </h2>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                  {products.map((p: any) => (
                    <Link
                      key={p._id}
                      href={`/oreillers/${p.slug}`}
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
                        {p.oreillerFilling && FILLING_LABELS[p.oreillerFilling] && (
                          <span className="absolute left-2 top-2 rounded-pill bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-midnight backdrop-blur-sm">
                            {FILLING_LABELS[p.oreillerFilling]}
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
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-border bg-sable p-8 text-center">
                  <p className="text-pierre">
                    {allProducts.length === 0
                      ? "Aucun oreiller publié pour le moment."
                      : "Aucun oreiller ne correspond à ces filtres."}
                  </p>
                  <Link href="/oreillers#modeles" className="mt-4 inline-block text-sm font-semibold text-midnight underline">
                    Effacer les filtres
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <CategorySeoSections productType="oreiller" categoryLabel="oreiller" overrides={pillar} />

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
          pillar?.categoryFaqOverride?.length ? pillar.categoryFaqOverride : categoryFaq("oreiller")
        )}
      />
    </>
  );
}
