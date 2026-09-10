import Link from "next/link";
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
  deliveryInfo as defaultDelivery,
} from "@/lib/product-defaults";

/**
 * Séquence harmonisée — alterne cartes / listes / images / tableau / accordéon.
 * Chaque section a un fond ou une densité différente pour éviter la monotonie.
 */
/**
 * Guide du Magazine correspondant à chaque type de produit. Table explicite
 * plutôt que déduction : un rapprochement approximatif enverrait le lecteur
 * d'une fiche d'oreiller vers le guide du matelas.
 */
const GUIDE_BY_TYPE: Record<string, { href: string; label: string }> = {
  matelas: { href: "/magazine/guide-choisir-matelas", label: "lisez notre guide du matelas" },
  lit: { href: "/magazine/guide-choisir-lit", label: "lisez notre guide du lit" },
  sommier: { href: "/magazine/guide-choisir-sommier", label: "lisez notre guide du sommier" },
  oreiller: { href: "/magazine/guide-choisir-oreiller", label: "lisez notre guide de l'oreiller" },
};

export function ProductPageSections({
  product,
  basePath,
}: {
  product: any;
  basePath: string;
}) {
  const productType = product?.productType || "matelas";
  const productTypeLabel = getProductTypeLabel(product);

  // Sanity toujours prioritaire, fallback intelligent sinon
  const highlights = product.highlights?.length > 0 ? product.highlights : defaultHighlights(productType, product);
  const advantages = product.advantages?.length > 0 ? product.advantages : defaultAdvantages(productType);
  const audiences = product.audiences?.length > 0 ? product.audiences : defaultAudiences(productType, product);
  const tips = product.tips?.length > 0 ? product.tips : defaultTips(productType);
  const careSteps = product.careSteps?.length > 0 ? product.careSteps : defaultCareSteps(productType);
  const faq = product.productFaq?.length > 0 ? product.productFaq : defaultFaq(productType, product);
  const extraCta = product.extraCta?.title ? product.extraCta : defaultExtraCta(productType);
  const warranty = product.warrantyOverride?.duration
    ? product.warrantyOverride
    : defaultWarranty(productType, product);
  const delivery = product.deliveryOverride?.price ? product.deliveryOverride : defaultDelivery;
  const guideLink = GUIDE_BY_TYPE[productType] || null;

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
        <ProductDelivery delivery={delivery} />
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
      {/*
        Retour vers l'éditorial. Les fiches produit ne renvoyaient vers aucun
        guide : un visiteur qui hésite devait revenir en arrière et retrouver
        le Magazine par le menu. Le lien est déduit du type de produit, donc
        toujours pertinent, et la ligne reste discrète — c'est une porte de
        sortie utile, pas un appel à l'action concurrent du bouton d'achat.
      */}
      {guideLink && (
        <div className="mt-14 border-t border-border pt-8 md:mt-16">
          <p className="font-sans text-[14.5px] text-pierre">
            Vous hésitez encore ?{" "}
            <Link
              href={guideLink.href}
              className="border-b border-ink/30 font-medium text-ink transition-colors hover:border-or hover:text-or"
            >
              {guideLink.label}
            </Link>{" "}
            ou{" "}
            <Link
              href="/magasins"
              className="border-b border-ink/30 font-medium text-ink transition-colors hover:border-or hover:text-or"
            >
              venez l'essayer en showroom
            </Link>
            .
          </p>
        </div>
      )}

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
