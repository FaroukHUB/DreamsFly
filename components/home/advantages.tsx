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
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 text-noir transition-all group-hover:border-noir group-hover:bg-noir group-hover:text-or">
                <Icon name={a.icon || "shield"} />
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

function Icon({ name }: { name: string }) {
  const common = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "truck":
      return (
        <svg {...common}>
          <rect x="1" y="6" width="14" height="11" rx="1" />
          <path d="M15 9h4l3 3v5h-7V9z" />
          <circle cx="5.5" cy="18.5" r="2" />
          <circle cx="18.5" cy="18.5" r="2" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case "store":
      return (
        <svg {...common}>
          <path d="M3 9l2-6h14l2 6" />
          <path d="M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9" />
          <path d="M9 21V13h6v8" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96c1.4 9.3 -1.7 18.04 -8.2 17.04Z" />
          <path d="M2 21c0 -3 1.85 -5.36 5.08 -6" />
        </svg>
      );
    default: // shield
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
  }
}
