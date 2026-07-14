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
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-site px-6 md:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center md:mb-14">
          <div className="eyebrow mb-3">{d.eyebrow}</div>
          <h2 className="mb-4 font-sora text-3xl font-semibold tracking-tight text-ink md:text-5xl">{d.title}</h2>
          <p className="text-base text-pierre md:text-lg">{d.subtitle}</p>
        </div>
        <div className="mx-auto max-w-3xl space-y-8">
          {CATEGORY_ORDER.filter((cat) => grouped[cat]?.length).map((cat) => (
            <div key={cat}>
              <div className="mb-3 flex items-center gap-3">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-or">{CATEGORY_LABELS[cat]}</div>
                <div className="h-px flex-1 bg-border" />
                <div className="text-xs text-brume">{grouped[cat].length} question{grouped[cat].length > 1 ? "s" : ""}</div>
              </div>
              <div className="space-y-2">
                {grouped[cat].map((q, i) => (
                  <details key={i} className="group rounded-2xl border border-border bg-white p-5 open:border-midnight md:p-6">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                      <h3 className="font-sora text-base font-semibold text-ink md:text-lg">{q.question}</h3>
                      <span aria-hidden className="mt-1 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-border text-midnight transition-transform group-open:rotate-45">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-4 text-sm leading-relaxed text-pierre md:text-base">{q.answer}</p>
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
