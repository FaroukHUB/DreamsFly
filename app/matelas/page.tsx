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
import {
  JsonLd,
  breadcrumbSchema,
  organizationSchema,
} from "@/lib/seo/jsonld";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const pillar = sanityClient
    ? await sanityClient.fetch<any>(pillarPageQuery).catch(() => null)
    : null;

  return buildMetadata({
    title: pillar?.metaTitle || pillar?.h1 || "Tous nos matelas",
    description:
      pillar?.metaDescription ||
      "Découvrez l'intégralité des matelas DreamsFly : mémoire de forme, hybride, ressorts ensachés, mousse polyuréthane. Confection française.",
    path: "/matelas",
  });
}

export default async function MatelasPillar() {
  const [pillar, products, siteSettings] = await Promise.all([
    sanityClient?.fetch<any>(pillarPageQuery).catch(() => null) ?? null,
    sanityClient?.fetch<any[]>(allProductsForPillarQuery).catch(() => []) ?? [],
    sanityClient?.fetch<any>(siteSettingsQuery).catch(() => null) ?? null,
  ]);

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

      <main className="mx-auto max-w-site px-8 py-12 md:py-16">
        {/* Breadcrumbs */}
        <nav aria-label="Fil d'Ariane" className="mb-8 flex items-center gap-1.5 text-sm text-pierre">
          <Link href="/" className="hover:text-midnight">Accueil</Link>
          <span className="text-brume">/</span>
          <span className="font-medium text-ink">Matelas</span>
        </nav>

        {/* H1 + intro */}
        <header className="mb-16 max-w-3xl">
          <div className="eyebrow mb-3">Collection complète</div>
          <h1 className="font-sora text-4xl font-semibold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
            {h1}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-pierre md:text-xl">{intro}</p>
        </header>

        {/* Explorer par technologie */}
        <section className="mb-20">
          <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            Par technologie
          </h2>
          <p className="mb-8 max-w-xl text-pierre">
            Chaque technologie a ses atouts. Découvrez celle qui correspond à votre profil de sommeil.
          </p>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <ExploreTile
              title="Mémoire de forme"
              subtitle="Enveloppant · Soulagement points de pression"
              href="/matelas-memoire-de-forme"
            />
            <ExploreTile
              title="Hybride"
              subtitle="Mémoire de forme + ressorts ensachés"
              href="/matelas-hybride"
            />
            <ExploreTile
              title="Ressorts ensachés"
              subtitle="Indépendance de couchage maximale"
              href="/matelas-ressorts-ensaches"
            />
            <ExploreTile
              title="Mousse polyuréthane"
              subtitle="Excellent rapport qualité-prix"
              href="/matelas-mousse"
            />
          </div>
        </section>

        {/* Explorer par taille */}
        <section className="mb-20">
          <h2 className="mb-2 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
            Par taille
          </h2>
          <p className="mb-8 max-w-xl text-pierre">
            Du studio compact au lit king size, retrouvez le format adapté à votre chambre.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            <ExploreTile compact title="90 × 190" href="/matelas-90x190" />
            <ExploreTile compact title="140 × 190" href="/matelas-140x190" highlighted />
            <ExploreTile compact title="160 × 200" href="/matelas-160x200" />
            <ExploreTile compact title="180 × 200" href="/matelas-180x200" />
            <ExploreTile compact title="140 × 200" href="/matelas-140x200" />
          </div>
        </section>

        {/* Tous les produits */}
        {products.length > 0 && (
          <section className="mb-20">
            <h2 className="mb-8 font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              La collection complète
            </h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
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
          </section>
        )}

        {/* Sections éditoriales depuis Sanity */}
        {pillar?.sections && <Sections sections={pillar.sections} />}
      </main>

      <Footer settings={siteSettings} />

      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
    </>
  );
}

function ExploreTile({
  title,
  subtitle,
  href,
  compact,
  highlighted,
}: {
  title: string;
  subtitle?: string;
  href: string;
  compact?: boolean;
  highlighted?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex flex-col justify-between rounded-2xl border p-5 transition-all hover:-translate-y-1 ${
        highlighted
          ? "border-midnight bg-midnight text-white hover:bg-midnight-dark"
          : "border-border bg-ivoire text-ink hover:border-midnight"
      } ${compact ? "min-h-[90px]" : "min-h-[140px]"}`}
    >
      <div>
        <h3 className={`font-sora ${compact ? "text-base" : "text-lg"} font-semibold tracking-tight`}>
          {title}
        </h3>
        {subtitle && <p className={`mt-1.5 text-[13px] ${highlighted ? "text-white/75" : "text-pierre"}`}>{subtitle}</p>}
      </div>
      <span className={`mt-3 text-xs font-semibold uppercase tracking-wide ${highlighted ? "text-aurora" : "text-midnight"}`}>
        Explorer →
      </span>
    </Link>
  );
}
