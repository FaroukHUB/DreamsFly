import { LineIcon } from "@/components/line-icon";

type Advantage = { icon?: string; title?: string; subtitle?: string };

const DEFAULT_ADVANTAGES: Advantage[] = [
  { icon: "truck", title: "Livraison France", subtitle: "Partout en France métropolitaine" },
  { icon: "shield", title: "Garantie 2 ans", subtitle: "Confection française" },
  { icon: "lock", title: "Paiement sécurisé", subtitle: "Alma · Stripe · CB" },
  { icon: "store", title: "3 showrooms", subtitle: "Testez avant d'acheter" },
  { icon: "star", title: "+ 5 000 clients", subtitle: "★ 4,9/5 sur Google" },
  { icon: "leaf", title: "Tissus OEKO-TEX", subtitle: "Hypoallergéniques" },
];

/**
 * Section avantages en icônes — bandeau final récapitulatif.
 * Mobile : grid 2 cols. Tablet : 3 cols. Desktop : 6 cols.
 */
export function Advantages({ items }: { items?: Advantage[] }) {
  const data = items?.length ? items : DEFAULT_ADVANTAGES;

  return (
    <section className="section-cream section-editorial border-t border-ink/10">
      <div className="mx-auto max-w-site">
        <div className="mb-14 grid gap-6 md:mb-20 md:grid-cols-[1fr_auto] md:items-end reveal">
          <div>
            <span className="eyebrow-editorial on-cream mb-3">Nos engagements</span>
            <h2 className="display-serif on-cream mt-4 text-[2rem] font-normal md:text-[3.4rem]">
              Tout ce qui rend DreamsFly <em>différent</em>.
            </h2>
          </div>
          <p className="max-w-[38ch] font-sans text-[15px] leading-relaxed text-taupe md:text-base md:text-right">
            Six principes qui guident chaque produit et chaque interaction avec vous.
          </p>
        </div>

        <div className="rule-cream mb-12" />

        <ul className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-6">
          {data.map((a, i) => (
            <li key={i} className="reveal group flex flex-col items-start" style={{ transitionDelay: `${i * 60}ms` }}>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-ink/15 text-noir transition-all group-hover:border-noir group-hover:bg-noir group-hover:text-or">
                <LineIcon name={a.icon || "shield"} size={24} strokeWidth={1.3} />
              </div>
              <strong className="display-serif on-cream text-[1.05rem] font-normal leading-tight md:text-[1.15rem]">
                {a.title}
              </strong>
              <span className="mt-1.5 font-sans text-[12px] leading-relaxed text-taupe md:text-[13px]">
                {a.subtitle}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

