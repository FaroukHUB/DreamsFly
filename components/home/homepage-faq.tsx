import { defaultHomepageFaq } from "@/lib/homepage-defaults";

type Q = { category?: string; question: string; answer: string };
type Data = { eyebrow?: string; title?: string; subtitle?: string; questions?: Q[] };

const CATEGORY_LABELS: Record<string, string> = {
  produit: "Produit",
  livraison: "Livraison",
  paiement: "Paiement",
  garantie: "Garantie",
  entretien: "Entretien",
  sav: "SAV & Retour",
  autre: "Autres",
};
const CATEGORY_ORDER = ["produit", "livraison", "paiement", "garantie", "entretien", "sav", "autre"];

export function HomepageFaq({ data }: { data?: Data }) {
  const d = {
    eyebrow: data?.eyebrow || defaultHomepageFaq.eyebrow,
    title: data?.title || defaultHomepageFaq.title,
    subtitle: data?.subtitle || defaultHomepageFaq.subtitle,
    questions: data?.questions?.length ? data.questions : defaultHomepageFaq.questions,
  };

  const grouped: Record<string, Q[]> = {};
  for (const q of d.questions) {
    const cat = q.category || "autre";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(q);
  }

  return (
    <section className="section-cream section-editorial">
      <div className="mx-auto max-w-site">
        <div className="mx-auto mb-14 max-w-2xl text-center md:mb-20 reveal">
          <span className="eyebrow-editorial on-cream mb-3 mx-auto">{d.eyebrow}</span>
          <h2 className="display-serif on-cream mt-5 text-[2.4rem] font-normal md:text-[4rem]">{d.title}</h2>
          <p className="mt-6 font-sans text-[15px] leading-relaxed text-taupe md:text-[17px]">{d.subtitle}</p>
        </div>
        <div className="mx-auto max-w-3xl space-y-10">
          {CATEGORY_ORDER.filter((cat) => grouped[cat]?.length).map((cat) => (
            <div key={cat}>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-10 bg-or" aria-hidden="true" />
                <div className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-taupe">{CATEGORY_LABELS[cat]}</div>
                <div className="h-px flex-1 bg-ink/10" />
                <div className="font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">{grouped[cat].length} question{grouped[cat].length > 1 ? "s" : ""}</div>
              </div>
              <div className="divide-y divide-ink/10 border-y border-ink/10">
                {grouped[cat].map((q, i) => (
                  <details key={i} className="group py-6">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                      <h3 className="display-serif on-cream text-[19px] font-normal leading-tight md:text-[21px]">{q.question}</h3>
                      <span aria-hidden className="mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full text-or transition-transform group-open:rotate-45">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M12 5v14M5 12h14"/></svg>
                      </span>
                    </summary>
                    <p className="mt-4 max-w-[64ch] font-sans text-[15px] leading-relaxed text-taupe">{q.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
