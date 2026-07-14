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
import {
  defaultHighlights,
  defaultTips,
  defaultFaq,
  defaultCareGuide,
  defaultExtraCta,
} from "@/lib/product-defaults";

/**
 * Sections enrichies affichées sous la buy box.
 * Chaque bloc : donnée Sanity si remplie, sinon fallback intelligent
 * généré depuis productType — garantit contenu SEO sur toutes les fiches.
 */
export function ProductPageSections({
  product,
  basePath,
}: {
  product: any;
  basePath: string;
}) {
  const productTypeLabel = getProductTypeLabel(product);
  const productType = product?.productType || "matelas";

  // Merge Sanity + défauts
  const highlights = product.highlights?.length > 0 ? product.highlights : defaultHighlights(productType, product);
  const tips = product.tips?.length > 0 ? product.tips : defaultTips(productType);
  const faq = product.productFaq?.length > 0 ? product.productFaq : defaultFaq(productType, product);
  const careGuide = product.careGuide?.length > 0 ? product.careGuide : defaultCareGuide(productType);
  const extraCta = product.extraCta?.title ? product.extraCta : defaultExtraCta(productType);

  return (
    <>
      {/* Points forts (badges) — juste sous la buy box */}
      {highlights?.length > 0 && (
        <div className="mt-10 md:mt-14">
          <ProductHighlights highlights={highlights} />
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

        {tips?.length > 0 && <ProductTips tips={tips} />}

        {product.composition?.length > 0 && productType === "matelas" && (
          <ProductComposition composition={product.composition} />
        )}

        <ProductSpecs product={product} />

        {careGuide && careGuide.length > 0 && <ProductCareGuide careGuide={careGuide} />}

        {faq?.length > 0 && <ProductFaq faq={faq} />}

        {extraCta?.title && <ProductExtraCta cta={extraCta} />}
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
