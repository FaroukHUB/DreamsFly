import {
  ProductAdvantages,
  ProductTips,
  ProductCareSteps,
  ProductFaq,
  ProductDelivery,
} from "@/components/product/product-details";
import { LineIcon, iconNameForEmoji } from "@/components/line-icon";
import {
  categoryAdvantages,
  categoryTips,
  categoryCareSteps,
  categoryFaq,
  categoryComparison,
  buyingCriteria,
} from "@/lib/category-defaults";

type Overrides = {
  categoryAdvantagesOverride?: any[];
  buyingCriteriaOverride?: any[];
  categoryTipsOverride?: any[];
  categoryCareStepsOverride?: any[];
  categoryFaqOverride?: any[];
  categoryComparisonOverride?: {
    columns?: string[];
    recommendedIndex?: number;
    rows?: { criterion?: string; values?: string[] }[];
  };
  categorySeoHidden?: boolean;
};

type Props = {
  productType: "matelas" | "lit" | "sommier" | "oreiller" | string;
  categoryLabel: string; // « matelas », « lits », etc.
  overrides?: Overrides;
};

export function CategorySeoSections({ productType, categoryLabel, overrides }: Props) {
  if (overrides?.categorySeoHidden) return null;

  const advantages = overrides?.categoryAdvantagesOverride?.length
    ? overrides.categoryAdvantagesOverride
    : categoryAdvantages(productType);
  const tips = overrides?.categoryTipsOverride?.length
    ? overrides.categoryTipsOverride
    : categoryTips(productType);
  const careSteps = overrides?.categoryCareStepsOverride?.length
    ? overrides.categoryCareStepsOverride
    : categoryCareSteps(productType);
  const faq = overrides?.categoryFaqOverride?.length
    ? overrides.categoryFaqOverride
    : categoryFaq(productType);
  const criteria = overrides?.buyingCriteriaOverride?.length
    ? overrides.buyingCriteriaOverride
    : buyingCriteria(productType);
  const comparison = overrides?.categoryComparisonOverride?.columns?.length
    ? {
        columns: overrides.categoryComparisonOverride.columns,
        recommendedIndex: overrides.categoryComparisonOverride.recommendedIndex,
        rows: (overrides.categoryComparisonOverride.rows || []).map((r) => ({
          criterion: r.criterion || "",
          values: r.values || [],
        })),
      }
    : categoryComparison(productType);

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
        <section className="mt-20 rounded-[28px] bg-creme p-8 md:mt-28 md:p-14">
          <div className="mb-10 max-w-2xl md:mb-14">
            <span className="eyebrow-editorial on-cream mb-2">Guide d'achat</span>
            <h2 className="display-serif on-cream mt-3 text-[1.9rem] font-normal md:text-[2.8rem]">
              Comment choisir votre <em>{categoryLabel}</em> ?
            </h2>
            <p className="mt-4 font-serif text-[17px] italic leading-relaxed text-taupe md:text-[19px]">
              Les critères clés à considérer avant de vous décider.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            {criteria.map((c, i) => (
              <div key={i} className="flex items-start gap-5 rounded-[20px] bg-ivoire p-7">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-ink/15 text-noir">
                  <LineIcon name={iconNameForEmoji(c.icon)} size={20} strokeWidth={1.3} />
                </span>
                <div>
                  <h3 className="display-serif on-cream text-[1.15rem] font-normal md:text-[1.3rem]">{c.label}</h3>
                  <p className="mt-2 font-sans text-[14.5px] leading-relaxed text-taupe md:text-[15px]">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* COMPARATIF */}
      {comparison && (
        <section className="mt-20 md:mt-28">
          <div className="mb-10 max-w-2xl md:mb-14">
            <span className="eyebrow-editorial on-cream mb-2">Comparatif</span>
            <h2 className="display-serif on-cream mt-3 text-[1.9rem] font-normal md:text-[2.8rem]">
              {productType === "lit"
                ? "Quelle matière choisir ?"
                : "Quelle technologie choisir ?"}
            </h2>
          </div>
          <div className="-mx-6 overflow-x-auto md:mx-0">
            <div className="rounded-[24px] border border-ink/10 bg-ivoire overflow-hidden">
              <table className="w-full min-w-[720px] border-separate border-spacing-0 text-sm md:text-base">
                <thead>
                  <tr className="bg-noir text-ivoire">
                    <th className="sticky left-0 z-10 border-b border-white/10 bg-noir px-5 py-5 text-left font-sans text-[12px] font-medium uppercase tracking-[0.14em] md:px-6">
                      Critère
                    </th>
                    {comparison.columns.map((col, i) => {
                      const isRecommended = i === comparison.recommendedIndex;
                      return (
                        <th
                          key={i}
                          className={`border-b border-white/10 px-5 py-5 text-left font-sans text-[12px] font-medium uppercase tracking-[0.14em] md:px-6 ${
                            isRecommended ? "text-or" : "text-ivoire/80"
                          }`}
                        >
                          {col}{isRecommended && <span className="ml-2 text-or">◆</span>}
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {comparison.rows.map((row, ri) => (
                    <tr key={ri} className={ri % 2 === 0 ? "bg-ivoire" : "bg-creme/40"}>
                      <td className="sticky left-0 z-10 border-b border-ink/8 bg-inherit px-5 py-4 font-serif text-[15px] font-normal text-noir md:px-6 md:py-5">
                        {row.criterion}
                      </td>
                      {row.values.map((v, ci) => {
                        const isRecommended = ci === comparison.recommendedIndex;
                        return (
                          <td
                            key={ci}
                            className={`border-b border-ink/8 px-5 py-4 font-sans text-[14px] text-taupe md:px-6 md:py-5 ${
                              isRecommended ? "bg-or/8" : ""
                            }`}
                          >
                            {isRecommended ? <strong className="font-medium text-noir">{v}</strong> : v}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {typeof comparison.recommendedIndex === "number" && (
            <p className="mt-5 flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">
              <span className="text-or">◆</span>
              Notre recommandation pour la plupart des profils. Voir les critères ci-dessus pour affiner.
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
