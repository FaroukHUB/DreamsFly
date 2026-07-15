import {
  ProductAdvantages,
  ProductTips,
  ProductCareSteps,
  ProductFaq,
  ProductDelivery,
} from "@/components/product/product-details";
import {
  categoryAdvantages,
  categoryTips,
  categoryCareSteps,
  categoryFaq,
  categoryComparison,
  buyingCriteria,
} from "@/lib/category-defaults";

type Props = {
  productType: "matelas" | "lit" | "sommier" | "oreiller" | string;
  categoryLabel: string; // « matelas », « lits », etc.
};

export function CategorySeoSections({ productType, categoryLabel }: Props) {
  const advantages = categoryAdvantages(productType);
  const tips = categoryTips(productType);
  const careSteps = categoryCareSteps(productType);
  const faq = categoryFaq(productType);
  const comparison = categoryComparison(productType);
  const criteria = buyingCriteria(productType);

  return (
    <>
      {/* AVANTAGES */}
      {advantages.length > 0 && (
        <div className="mt-16 md:mt-20">
          <ProductAdvantages advantages={advantages} />
        </div>
      )}

      {/* GUIDE D'ACHAT — critères */}
      {criteria.length > 0 && (
        <section className="mt-16 rounded-3xl bg-sable p-6 md:mt-20 md:p-10">
          <div className="mb-6 max-w-2xl md:mb-8">
            <div className="eyebrow mb-2">Guide d'achat</div>
            <h2 className="font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              Comment choisir votre {categoryLabel} ?
            </h2>
            <p className="mt-2 text-pierre">
              Les critères clés à considérer avant de vous décider.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {criteria.map((c, i) => (
              <div key={i} className="flex items-start gap-4 rounded-2xl bg-white p-5 md:p-6">
                <span aria-hidden className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-aurora text-xl md:h-12 md:w-12">
                  {c.icon}
                </span>
                <div>
                  <h3 className="font-sora text-base font-semibold text-ink md:text-lg">{c.label}</h3>
                  <p className="mt-1 text-sm text-pierre md:text-base">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* COMPARATIF */}
      {comparison && (
        <section className="mt-16 md:mt-20">
          <div className="mb-6 max-w-2xl md:mb-8">
            <div className="eyebrow mb-2">Comparatif</div>
            <h2 className="font-sora text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              {productType === "lit"
                ? "Quelle matière choisir ?"
                : "Quelle technologie choisir ?"}
            </h2>
          </div>
          <div className="-mx-6 overflow-x-auto md:mx-0">
            <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm md:text-base">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 border-b border-border bg-white px-4 py-4 text-left font-sora font-semibold text-ink md:px-6">
                    Critère
                  </th>
                  {comparison.columns.map((col, i) => {
                    const isRecommended = i === comparison.recommendedIndex;
                    return (
                      <th
                        key={i}
                        className={`border-b-2 px-4 py-4 text-left font-sora font-semibold md:px-6 ${
                          isRecommended
                            ? "border-midnight bg-midnight text-white"
                            : "border-border bg-ivoire text-ink"
                        }`}
                      >
                        {col} {isRecommended && " ★"}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row, ri) => (
                  <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-ivoire/50"}>
                    <td className="sticky left-0 z-10 border-b border-border bg-inherit px-4 py-3 font-medium text-ink md:px-6 md:py-4">
                      {row.criterion}
                    </td>
                    {row.values.map((v, ci) => {
                      const isRecommended = ci === comparison.recommendedIndex;
                      return (
                        <td
                          key={ci}
                          className={`border-b border-border px-4 py-3 text-pierre md:px-6 md:py-4 ${
                            isRecommended ? "bg-midnight/[0.03]" : ""
                          }`}
                        >
                          {isRecommended ? <strong className="text-ink">{v}</strong> : v}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {typeof comparison.recommendedIndex === "number" && (
            <p className="mt-4 text-xs text-brume">
              ★ Notre recommandation pour la plupart des profils. Voir les critères ci-dessus pour affiner.
            </p>
          )}
        </section>
      )}

      {/* CONSEILS D'EXPERT */}
      {tips.length > 0 && (
        <div className="mt-16 md:mt-20">
          <ProductTips tips={tips} />
        </div>
      )}

      {/* ENTRETIEN */}
      {careSteps.length > 0 && (
        <div className="mt-16 md:mt-20">
          <ProductCareSteps steps={careSteps} />
        </div>
      )}

      {/* LIVRAISON */}
      <div className="mt-16 md:mt-20">
        <ProductDelivery />
      </div>

      {/* FAQ */}
      {faq.length > 0 && (
        <div className="mt-16 md:mt-20">
          <ProductFaq faq={faq} />
        </div>
      )}
    </>
  );
}
