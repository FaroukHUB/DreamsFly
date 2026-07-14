import {
  ProductComposition,
  ProductSpecs,
  ProductDescription,
  ProductHighlights,
  ProductLifestyle,
  ProductAdvantages,
  ProductAudiences,
  ProductTips,
  ProductCareSteps,
  ProductCareGuide,
  ProductFaq,
  ProductExtraCta,
  ProductDelivery,
  ProductWarranty,
  RelatedProducts,
} from "@/components/product/product-details";
import {
  defaultHighlights,
  defaultAdvantages,
  defaultAudiences,
  defaultTips,
  defaultCareSteps,
  defaultFaq,
  defaultExtraCta,
  defaultWarranty,
} from "@/lib/product-defaults";

/**
 * Séquence harmonisée — alterne cartes / listes / images / tableau / accordéon.
 * Chaque section a un fond ou une densité différente pour éviter la monotonie.
 */
export function ProductPageSections({
  product,
  basePath,
}: {
  product: any;
  basePath: string;
}) {
  const productType = product?.productType || "matelas";
  const productTypeLabel = getProductTypeLabel(product);

  const highlights = product.highlights?.length > 0 ? product.highlights : defaultHighlights(productType, product);
  const advantages = defaultAdvantages(productType);
  const audiences = defaultAudiences(productType, product);
  const tips = product.tips?.length > 0 ? product.tips : defaultTips(productType);
  const careSteps = defaultCareSteps(productType);
  const faq = product.productFaq?.length > 0 ? product.productFaq : defaultFaq(productType, product);
  const extraCta = product.extraCta?.title ? product.extraCta : defaultExtraCta(productType);
  const warranty = defaultWarranty(productType, product);

  return (
    <>
      {/* 1. Points forts en badges — juste sous la buy box, aéré */}
      {highlights?.length > 0 && (
        <div className="mt-10 md:mt-14">
          <ProductHighlights highlights={highlights} />
        </div>
      )}

      {/* 2. Image lifestyle plein cadre */}
      {product.lifestyleImage?.asset && (
        <div className="mt-12 md:mt-16">
          <ProductLifestyle image={product.lifestyleImage} name={product.name} />
        </div>
      )}

      {/* 3. Description Sanity (si remplie) — fond blanc, texte */}
      {product.description && (
        <div className="mt-14 md:mt-20">
          <ProductDescription
            description={product.description}
            title={`Pourquoi choisir ${product.name || `ce ${productTypeLabel}`} ?`}
          />
        </div>
      )}

      {/* 4. AVANTAGES — grille 6 tuiles icône + texte court, fond blanc */}
      {advantages.length > 0 && (
        <div className="mt-16 md:mt-20">
          <ProductAdvantages advantages={advantages} />
        </div>
      )}

      {/* 5. POUR QUI — cartes horizontales, fond sable */}
      {audiences.length > 0 && (
        <div className="mt-16 md:mt-20">
          <ProductAudiences audiences={audiences} />
        </div>
      )}

      {/* 6. COMPOSITION — placeholder image/video + liste couches (matelas seulement) */}
      {product.composition?.length > 0 && productType === "matelas" && (
        <div className="mt-16 md:mt-20">
          <ProductComposition
            composition={product.composition}
            compositionImage={product.compositionImage}
            compositionVideo={product.compositionVideo}
            name={product.name}
          />
        </div>
      )}

      {/* 7. FICHE TECHNIQUE — tableau, fond alterné */}
      <div className="mt-16 md:mt-20">
        <ProductSpecs product={product} />
      </div>

      {/* 8. CONSEILS EXPERTS avec sources */}
      {tips?.length > 0 && (
        <div className="mt-16 md:mt-20">
          <ProductTips tips={tips} />
        </div>
      )}

      {/* 9. ENTRETIEN en 4 étapes visuelles */}
      {careSteps.length > 0 && (
        <div className="mt-16 md:mt-20">
          <ProductCareSteps steps={careSteps} />
        </div>
      )}
      {product.careGuide?.length > 0 && (
        <div className="mt-10">
          <ProductCareGuide careGuide={product.careGuide} />
        </div>
      )}

      {/* 10. LIVRAISON — encart horizontal */}
      <div className="mt-16 md:mt-20">
        <ProductDelivery />
      </div>

      {/* 11. GARANTIE — 2 colonnes couvert/exclu */}
      <div className="mt-14 md:mt-16">
        <ProductWarranty warranty={warranty} />
      </div>

      {/* 12. FAQ 12+ questions */}
      {faq?.length > 0 && (
        <div className="mt-16 md:mt-20">
          <ProductFaq faq={faq} />
        </div>
      )}

      {/* 13. CTA secondaire final */}
      {extraCta?.title && (
        <div className="mt-14 md:mt-16">
          <ProductExtraCta cta={extraCta} />
        </div>
      )}

      {/* 14. Produits complémentaires */}
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
