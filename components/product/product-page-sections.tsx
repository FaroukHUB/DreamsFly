import {
  ProductComposition,
  ProductSpecs,
  ProductDescription,
  ProductHighlights,
  ProductLifestyle,
  ProductTips,
  ProductCareGuide,
  ProductFaq,
  ProductExtraCta,
  RelatedProducts,
} from "@/components/product/product-details";

/**
 * Sections enrichies affichées sous la buy box.
 * Chaque bloc ne s'affiche que si les données Sanity sont remplies —
 * pas de placeholder vide qui plombe le SEO.
 */
export function ProductPageSections({
  product,
  basePath,
}: {
  product: any;
  basePath: string;
}) {
  const productTypeLabel = getProductTypeLabel(product);

  return (
    <>
      {/* Points forts (badges) — juste sous la buy box */}
      {product.highlights?.length > 0 && (
        <div className="mt-10 md:mt-14">
          <ProductHighlights highlights={product.highlights} />
        </div>
      )}

      {/* Image lifestyle plein cadre */}
      {product.lifestyleImage?.asset && (
        <div className="mt-12 md:mt-16">
          <ProductLifestyle image={product.lifestyleImage} name={product.name} />
        </div>
      )}

      {/* Contenu détaillé */}
      <div className="mt-12 space-y-14 md:mt-16 md:space-y-16">
        {product.description && (
          <ProductDescription
            description={product.description}
            title={`Pourquoi choisir ${product.name || `ce ${productTypeLabel}`} ?`}
          />
        )}

        {product.tips?.length > 0 && <ProductTips tips={product.tips} />}

        {product.composition?.length > 0 && product.productType === "matelas" && (
          <ProductComposition composition={product.composition} />
        )}

        <ProductSpecs product={product} />

        {product.careGuide && <ProductCareGuide careGuide={product.careGuide} />}

        {product.productFaq?.length > 0 && <ProductFaq faq={product.productFaq} />}

        {product.extraCta?.title && <ProductExtraCta cta={product.extraCta} />}
      </div>

      {/* Produits associés */}
      {product.relatedProducts?.length > 0 && (
        <div className="mt-16 border-t border-border pt-12 md:mt-20 md:pt-16">
          <RelatedProducts products={product.relatedProducts} basePath={basePath} />
        </div>
      )}
    </>
  );
}

function getProductTypeLabel(product: any) {
  const map: Record<string, string> = {
    matelas: "matelas",
    lit: "lit",
    sommier: "sommier",
    oreiller: "oreiller",
    linge: "linge",
    pack: "pack",
  };
  return map[product?.productType] || "produit";
}
