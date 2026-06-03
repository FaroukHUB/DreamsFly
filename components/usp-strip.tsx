type UspItem = { icon?: string; title?: string; subtitle?: string };

export function UspStrip({ items }: { items?: UspItem[] }) {
  const usps = items?.length === 4 ? items : DEFAULT_USPS;
  return (
    <div className="mt-6 border-y border-border bg-sable">
      <div className="mx-auto grid max-w-site gap-6 px-8 py-7 sm:grid-cols-2 lg:grid-cols-4">
        {usps.map((u, i) => (
          <div key={i} className="flex items-center gap-3.5 text-sm">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-ivoire text-midnight border border-border">
              <Icon name={u.icon || "shield"} />
            </div>
            <div>
              <strong className="block text-sm font-semibold text-ink">{u.title}</strong>
              <span className="text-[13px] text-pierre">{u.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// USPs propres à DreamsFly (pas d'emprunts aux concurrents)
const DEFAULT_USPS: UspItem[] = [
  { icon: "flag", title: "Confection française", subtitle: "Fabriqués dans nos ateliers" },
  { icon: "leaf", title: "Tissus certifiés OEKO-TEX", subtitle: "Matériaux nobles, hypoallergéniques" },
  { icon: "shield", title: "Garantie 5 ans", subtitle: "Sur l'intégralité de nos matelas" },
  { icon: "card", title: "Paiement en plusieurs fois", subtitle: "2×, 3× ou 4× via Alma" },
];

function Icon({ name }: { name: string }) {
  switch (name) {
    case "flag":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      );
    case "leaf":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.2 2.96c1.4 9.3 -1.7 18.04 -8.2 17.04Z" />
          <path d="M2 21c0 -3 1.85 -5.36 5.08 -6" />
        </svg>
      );
    case "card":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
        </svg>
      );
    default: // shield
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
  }
}
