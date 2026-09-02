import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { litBySlugQuery, allLitSlugsQuery } from "@/lib/sanity/product-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { UspStrip } from "@/components/usp-strip";
import { Footer } from "@/components/footer";
import { ProductBuyBox } from "@/components/product/buy-box";
import { StickyMobileCTA } from "@/components/product/sticky-mobile-cta";
import { ProductPageSections } from "@/components/product/product-page-sections";
import { productUrlFor, resolveProductBySlug } from "@/lib/product-slug";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  JsonLd,
  productSchema,
  breadcrumbSchema,
  organizationSchema,
  faqSchema,
} from "@/lib/seo/jsonld";
import { defaultFaq } from "@/lib/product-defaults";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 60;

type Params = { slug: string };

export async function generateStaticParams() {
  if (!sanityClient) return [];
  try {
    const slugs = await sanityClient.fetch<{ slug: string }[]>(allLitSlugsQuery);
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  if (!sanityClient) return buildMetadata({ path: `/lits/${slug}` });
  const matches = await sanityClient.fetch<any[]>(litBySlugQuery, { slug }).catch(() => null);
  const resolved = resolveProductBySlug(matches, slug);
  if (!resolved) return buildMetadata({ path: `/lits/${slug}`, noindex: true });
  const product = resolved.product;

  const image = product.images?.[0] ? urlFor(product.images[0]).width(1200).height(630).url() : undefined;

  return buildMetadata({
    title: product.seo?.metaTitle || product.title,
    description:
      product.seo?.metaDescription ||
      `${product.title}. ${product.tagline || ""} Livraison à domicile · Paiement en plusieurs fois.`,
    path: `/lits/${resolved.canonicalSlug}`,
    image,
    type: "product",
  });
}

export default async function LitPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!sanityClient) notFound();

  const [matches, siteSettings] = await Promise.all([
    sanityClient.fetch<any[]>(litBySlugQuery, { slug }).catch(() => null),
    sanityClient.fetch<any>(siteSettingsQuery).catch(() => null),
  ]);

  const resolved = resolveProductBySlug(matches, slug);
  if (!resolved) notFound();

  // Ancien slug : 308 vers le slug actuel, dans la même catégorie.
  // Une seule redirection, jamais de chaîne — la destination est
  // toujours le slug canonique, jamais un intermédiaire.
  if (resolved.shouldRedirect) permanentRedirect(productUrlFor("/lits", resolved.canonicalSlug));

  const product = resolved.product;

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Lits", url: "/lits" },
    { name: product.name, url: `/lits/${resolved.canonicalSlug}` },
  ];

  const validPrices = (product.variants?.map((v: any) => v.price).filter(Boolean) || []);
  const minPrice = validPrices.length ? Math.min(...validPrices) : 0;
  const validCompares = product.variants?.map((v: any) => v.compareAtPrice).filter(Boolean) || [];
  const maxComparePrice = validCompares.length ? Math.max(...validCompares) : 0;

  return (
    <>
      <Header settings={siteSettings} />
      <UspStrip tone="noir" />

      <main className="mx-auto max-w-site px-6 py-10 md:px-10 md:py-14">
        <nav aria-label="Fil d'Ariane" className="mb-8 flex flex-wrap items-center gap-2 font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span className="opacity-40">/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-ink">{b.name}</span>
              ) : (
                <Link href={b.url} className="transition-colors hover:text-or">{b.name}</Link>
              )}
            </span>
          ))}
        </nav>

        <div className="mb-10 max-w-2xl md:mb-14">
          <span className="eyebrow-editorial on-cream mb-3">Lit coffre</span>
          <h1 className="display-serif on-cream mt-4 text-[2rem] font-normal md:text-[3.4rem]">
            {product.title}
          </h1>
          {product.tagline && (
            <p className="mt-4 max-w-xl font-serif text-[18px] italic leading-relaxed text-taupe md:text-[22px]">
              {product.tagline}
            </p>
          )}
          {product.rating?.value && (
            <p className="mt-5 flex items-center gap-3 font-sans text-[13px]">
              <span className="text-or tracking-[0.2em]">★★★★★</span>
              <strong className="font-medium text-ink">{product.rating.value} / 5</strong>
              <span className="text-taupe">— {product.rating.count} avis vérifiés</span>
            </p>
          )}
        </div>

        {/* BuyBox */}
        <div id="buy-box">
          <ProductBuyBox
            productId={product._id}
            productSlug={product.slug}
            images={product.images}
            videos={product.videos}
            variants={product.variants}
            colors={product.colors}
            name={product.name}
          />
        </div>

        <ProductPageSections product={product} basePath="/lits" />
      </main>

      <Footer settings={siteSettings} />

      <StickyMobileCTA
        productName={product.name}
        price={minPrice}
        compareAtPrice={maxComparePrice > minPrice ? maxComparePrice : undefined}
      />

      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={faqSchema(
          product.productFaq?.length > 0
            ? product.productFaq
            : defaultFaq(product.productType || "lit", product)
        )}
      />
      <JsonLd
        data={productSchema({
          name: product.title,
          description: product.tagline,
          image: product.images?.map((img: any) => urlFor(img).width(1200).url()).slice(0, 5),
          sku: product.sku,
          brand: "DreamsFly",
          url: `/lits/${resolved.canonicalSlug}`,
          price: minPrice || 0,
          priceCurrency: "EUR",
          compareAtPrice: maxComparePrice > minPrice ? maxComparePrice : undefined,
          availability: product.variants?.some((v: any) => v.stockStatus === "rupture")
            ? "OutOfStock"
            : "InStock",
          ratingValue: product.rating?.value,
          ratingCount: product.rating?.count,
        })}
      />
    </>
  );
}
