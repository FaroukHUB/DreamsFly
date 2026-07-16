import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { sanityClient } from "@/lib/sanity/client";
import { pillarOreillersQuery, allOreillersQuery } from "@/lib/sanity/product-queries";
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

type SearchParams = Promise<{ filling?: string; shape?: string }>;

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
  ergonomique: "Ergonomique",
  traversin: "Traversin",
};

const FILLING_TILES = [
  { slug: "memoire-forme", title: "Mémoire de forme", subtitle: "Soutien enveloppant" },
  { slug: "duvet-oie", title: "Duvet d'oie", subtitle: "Moelleux luxueux" },
  { slug: "latex", title: "Latex naturel", subtitle: "Frais et tonique" },
  { slug: "fibre-recyclee", title: "Fibre recyclée", subtitle: "Doux, éco-responsable" },
];

const SHAPE_TILES = [
  { slug: "rectangulaire", title: "Rectangulaire", subtitle: "Classique 60×40 / 65×65" },
  { slug: "ergonomique", title: "Ergonomique", subtitle: "Vague, cervical" },
  { slug: "carre", title: "Carré", subtitle: "65×65" },
  { slug: "traversin", title: "Traversin", subtitle: "140 / 160 cm" },
];

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { filling, shape } = await searchParams;
  const pillar = sanityClient ? await sanityClient.fetch<any>(pillarOreillersQuery).catch(() => null) : null;
  const filterLabel = filling
    ? ` — ${FILLING_LABELS[filling] || filling}`
    : shape
      ? ` — ${SHAPE_LABELS[shape] || shape}`
      : "";
  return buildMetadata({
    title: (pillar?.metaTitle || pillar?.h1 || "Oreillers ergonomiques & duvet — DreamsFly") + filterLabel,
    description:
      pillar?.metaDescription ||
      "Découvrez notre collection d'oreillers : mémoire de forme, duvet, latex naturel, ergonomique. Housses lavables, anti-acariens, livraison sous 48h.",
    path: "/oreillers",
  });
}

export default async function OreillersPillar({ searchParams }: { searchParams: SearchParams }) {
  const { filling, shape } = await searchParams;

  const [pillar, allProducts, siteSettings] = await Promise.all([
    sanityClient?.fetch<any>(pillarOreillersQuery).catch(() => null) ?? null,
    sanityClient?.fetch<any[]>(allOreillersQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
  ]);

  let products = allProducts;
  if (filling) products = products.filter((p: any) => p.oreillerFilling === filling);
  if (shape) products = products.filter((p: any) => p.oreillerShape === shape);

  const countByFilling: Record<string, number> = {};
  const countByShape: Record<string, number> = {};
  for (const p of allProducts) {
    if (p.oreillerFilling) countByFilling[p.oreillerFilling] = (countByFilling[p.oreillerFilling] || 0) + 1;
    if (p.oreillerShape) countByShape[p.oreillerShape] = (countByShape[p.oreillerShape] || 0) + 1;
  }

  const activeFilter = filling ? FILLING_LABELS[filling] || filling : shape ? SHAPE_LABELS[shape] || shape : null;
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

      <main className="mx-auto max-w-site px-6 py-10 md:px-8 md:py-16">
        <nav aria-label="Fil d'Ariane" className="mb-8 flex items-center gap-1.5 text-sm text-pierre">
          <Link href="/" className="hover:text-midnight">Accueil</Link>
          <span className="text-brume">/</span>
          <span className="font-medium text-ink">Oreillers</span>
        </nav>

        <header className="mb-14 max-w-3xl md:mb-16">
          <div className="eyebrow mb-3">Collection oreillers</div>
          <h1 className="font-sora text-3xl font-semibold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            {h1}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-pierre md:mt-6 md:text-xl">{intro}</p>
        </header>

        {/* Par garnissage */}
        <section className="mb-14 md:mb-16">
          <h2 className="mb-2 font-sora text-xl font-semibold tracking-tight text-ink md:text-3xl">Par garnissage</h2>
          <p className="mb-6 max-w-xl text-pierre md:mb-8">Chaque matière a sa personnalité — filtre la collection.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
            {FILLING_TILES.map((t) => {
              const count = countByFilling[t.slug] || 0;
              const isActive = filling === t.slug;
              return (
                <Link
                  key={t.slug}
                  href={`/oreillers?filling=${t.slug}#modeles`}
                  className={`group flex flex-col justify-between rounded-2xl border p-4 transition-all hover:-translate-y-1 min-h-[100px] md:p-5 md:min-h-[120px] ${
                    isActive ? "border-midnight bg-midnight text-white" : "border-border bg-ivoire text-ink hover:border-midnight"
                  }`}
                >
                  <div>
                    <h3 className="font-sora text-sm font-semibold tracking-tight md:text-base">{t.title}</h3>
                    <p className={`mt-1 text-[11px] md:text-[13px] ${isActive ? "text-white/75" : "text-pierre"}`}>
                      {count > 0 && `${count} · `}{t.subtitle}
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

        {/* Par forme */}
        <section className="mb-14 md:mb-16">
          <h2 className="mb-2 font-sora text-xl font-semibold tracking-tight text-ink md:text-3xl">Par forme</h2>
          <p className="mb-6 max-w-xl text-pierre md:mb-8">Rectangulaire, ergonomique ou traversin.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
            {SHAPE_TILES.map((t) => {
              const count = countByShape[t.slug] || 0;
              const isActive = shape === t.slug;
              return (
                <Link
                  key={t.slug}
                  href={`/oreillers?shape=${t.slug}#modeles`}
                  className={`group flex flex-col justify-between rounded-2xl border p-4 transition-all hover:-translate-y-1 min-h-[100px] md:p-5 md:min-h-[120px] ${
                    isActive ? "border-midnight bg-midnight text-white" : "border-border bg-ivoire text-ink hover:border-midnight"
                  }`}
                >
                  <div>
                    <h3 className="font-sora text-sm font-semibold tracking-tight md:text-base">{t.title}</h3>
                    <p className={`mt-1 text-[11px] md:text-[13px] ${isActive ? "text-white/75" : "text-pierre"}`}>
                      {count > 0 && `${count} · `}{t.subtitle}
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

        {/* Grille produits */}
        <section id="modeles" className="mb-16 scroll-mt-20 md:mb-20">
          <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-sora text-xl font-semibold tracking-tight text-ink md:text-3xl">
                {activeFilter ? `Oreillers — ${activeFilter}` : "La collection complète"}
              </h2>
              <p className="mt-1 text-sm text-pierre md:text-base">
                {products.length} oreiller{products.length > 1 ? "s" : ""}
                {activeFilter && ` (sur ${allProducts.length})`} · Livraison 48h · Paiement en plusieurs fois
              </p>
            </div>
            {activeFilter && (
              <Link
                href="/oreillers#modeles"
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
                  href={`/oreillers/${p.slug}`}
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
                  ? "Aucun oreiller publié pour le moment."
                  : "Aucun oreiller ne correspond à ce filtre."}
              </p>
              {activeFilter && (
                <Link href="/oreillers#modeles" className="mt-4 inline-block text-sm font-semibold text-midnight underline">
                  Voir tous les oreillers
                </Link>
              )}
            </div>
          )}
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
