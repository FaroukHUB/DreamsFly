import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { litBySlugQuery, allLitSlugsQuery } from "@/lib/sanity/product-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductBuyBox } from "@/components/product/buy-box";
import { StickyMobileCTA } from "@/components/product/sticky-mobile-cta";
import { ProductPageSections } from "@/components/product/product-page-sections";
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
  const product = await sanityClient.fetch<any>(litBySlugQuery, { slug }).catch(() => null);
  if (!product) return buildMetadata({ path: `/lits/${slug}`, noindex: true });

  const image = product.images?.[0] ? urlFor(product.images[0]).width(1200).height(630).url() : undefined;

  return buildMetadata({
    title: product.seo?.metaTitle || product.title,
    description:
      product.seo?.metaDescription ||
      `${product.title}. ${product.tagline || ""} Livraison à domicile · Paiement en plusieurs fois.`,
    path: `/lits/${slug}`,
    image,
    type: "product",
  });
}

export default async function LitPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!sanityClient) notFound();

  const [product, siteSettings] = await Promise.all([
    sanityClient.fetch<any>(litBySlugQuery, { slug }).catch(() => null),
    sanityClient.fetch<any>(siteSettingsQuery).catch(() => null),
  ]);

  if (!product) notFound();

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Lits", url: "/lits" },
    { name: product.name, url: `/lits/${slug}` },
  ];

  const validPrices = (product.variants?.map((v: any) => v.price).filter(Boolean) || []);
  const minPrice = validPrices.length ? Math.min(...validPrices) : 0;
  const validCompares = product.variants?.map((v: any) => v.compareAtPrice).filter(Boolean) || [];
  const maxComparePrice = validCompares.length ? Math.max(...validCompares) : 0;

  return (
    <>
      <Header settings={siteSettings} />

      <main className="mx-auto max-w-site px-6 py-8 md:px-8 md:py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Fil d'Ariane" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-pierre">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-brume">/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className="font-medium text-ink">{b.name}</span>
              ) : (
                <Link href={b.url} className="hover:text-midnight">{b.name}</Link>
              )}
            </span>
          ))}
        </nav>

        {/* Titre */}
        <div className="mb-8">
          <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-pierre">Lit coffre</div>
          <h1 className="font-sora text-2xl font-semibold tracking-tight text-ink md:text-4xl">
            {product.title}
          </h1>
          {product.tagline && <p className="mt-2 text-base text-pierre md:text-lg">{product.tagline}</p>}
          {product.rating?.value && (
            <p className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-or">★★★★★</span>
              <strong className="text-ink">{product.rating.value} / 5</strong>
              <span className="text-pierre">— {product.rating.count} avis</span>
            </p>
          )}
        </div>

        {/* BuyBox */}
        <div id="buy-box">
          <ProductBuyBox
            productId={product._id}
            productSlug={product.slug}
            images={product.images}
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
          url: `/lits/${slug}`,
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
