import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { sanityClient } from "@/lib/sanity/client";
import { productBySlugFullQuery, allProductSlugsQuery } from "@/lib/sanity/product-queries";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductBuyBox } from "@/components/product/buy-box";
import { StickyMobileCTA } from "@/components/product/sticky-mobile-cta";
import {
  ProductComposition,
  ProductSpecs,
  ProductDescription,
  RelatedProducts,
} from "@/components/product/product-details";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  JsonLd,
  productSchema,
  breadcrumbSchema,
  organizationSchema,
} from "@/lib/seo/jsonld";
import { urlFor } from "@/lib/sanity/image";

export const revalidate = 60;

type Params = { slug: string };

export async function generateStaticParams() {
  if (!sanityClient) return [];
  try {
    const slugs = await sanityClient.fetch<{ slug: string }[]>(allProductSlugsQuery);
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  if (!sanityClient) return buildMetadata({ path: `/matelas/${slug}` });
  const product = await sanityClient.fetch<any>(productBySlugFullQuery, { slug }).catch(() => null);
  if (!product) return buildMetadata({ path: `/matelas/${slug}`, noindex: true });

  const image = product.images?.[0] ? urlFor(product.images[0]).width(1200).height(630).url() : undefined;

  return buildMetadata({
    title: product.seo?.metaTitle || `${product.title}`,
    description:
      product.seo?.metaDescription ||
      `${product.title}. ${product.tagline || ""} Livraison à domicile · Paiement en plusieurs fois.`,
    path: `/matelas/${slug}`,
    image,
    type: "product",
  });
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!sanityClient) notFound();

  const [product, siteSettings] = await Promise.all([
    sanityClient.fetch<any>(productBySlugFullQuery, { slug }).catch(() => null),
    sanityClient.fetch<any>(siteSettingsQuery).catch(() => null),
  ]);

  if (!product) notFound();

  const breadcrumbs = [
    { name: "Accueil", url: "/" },
    { name: "Matelas", url: "/matelas" },
    { name: product.name, url: `/matelas/${slug}` },
  ];

  const minPrice = Math.min(...(product.variants?.map((v: any) => v.price).filter(Boolean) || [0]));
  const maxComparePrice = Math.max(
    ...(product.variants?.map((v: any) => v.compareAtPrice).filter(Boolean) || [0])
  );

  return (
    <>
      <Header settings={siteSettings} />

      <main className="mx-auto max-w-site px-8 py-12">
        {/* Breadcrumbs */}
        <nav aria-label="Fil d'Ariane" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-pierre">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-brume">/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className="font-medium text-ink">{b.name}</span>
              ) : (
                <Link href={b.url} className="hover:text-midnight">
                  {b.name}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Titre */}
        <div className="mb-8">
          <h1 className="font-sora text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            {product.title}
          </h1>
          {product.tagline && (
            <p className="mt-2 text-lg text-pierre">{product.tagline}</p>
          )}
          {product.rating?.value && (
            <p className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-or">★★★★★</span>
              <strong className="text-ink">{product.rating.value} / 5</strong>
              <span className="text-pierre">— {product.rating.count} avis</span>
            </p>
          )}
        </div>

        {/* Buy box (client) */}
        <div id="buy-box">
          <ProductBuyBox images={product.images} variants={product.variants} name={product.name} />
        </div>

        {/* Contenu détaillé */}
        <div className="mt-20 space-y-20 max-w-5xl">
          <ProductDescription description={product.description} />
          <ProductComposition composition={product.composition} />
          <ProductSpecs product={product} />
        </div>

        {/* Produits associés */}
        {product.relatedProducts?.length > 0 && (
          <div className="mt-20 border-t border-border pt-16">
            <RelatedProducts products={product.relatedProducts} />
          </div>
        )}
      </main>

      <Footer settings={siteSettings} />

      {/* Sticky CTA mobile */}
      <StickyMobileCTA
        productName={product.name}
        price={minPrice}
        compareAtPrice={maxComparePrice > minPrice ? maxComparePrice : undefined}
      />

      {/* JSON-LD */}
      <JsonLd data={organizationSchema({ name: "DreamsFly" })} />
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd
        data={productSchema({
          name: product.title,
          description: product.tagline,
          image: product.images?.map((img: any) => urlFor(img).width(1200).url()).slice(0, 5),
          sku: product.sku,
          brand: "DreamsFly",
          url: `/matelas/${slug}`,
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
