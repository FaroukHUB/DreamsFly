type UspItem = { icon?: string; title?: string; subtitle?: string };

export function UspStrip({ items }: { items?: UspItem[] }) {
  const usps = items?.length === 4 ? items : DEFAULT_USPS;
  return (
    <div className="mt-6 border-y border-border bg-sable">
      <div className="mx-auto grid max-w-site gap-6 px-8 py-7 sm:grid-cols-2 lg:grid-cols-4">
        {usps.map((u, i) => (
          <div key={i} className="flex items-center gap-3.5 text-sm">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-ivoire text-midnight">
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

const DEFAULT_USPS: UspItem[] = [
  { icon: "clock", title: "Essai 100 nuits", subtitle: "Satisfait ou remboursé" },
  { icon: "truck", title: "Livraison gratuite", subtitle: "Partout en France" },
  { icon: "shield", title: "Garantie 5 ans", subtitle: "Fabrication française" },
  { icon: "card", title: "Paiement 4× sans frais", subtitle: "via Alma" },
];

function Icon({ name }: { name: string }) {
  switch (name) {
    case "clock":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case "truck":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" rx="2" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      );
    case "card":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="4" width="22" height="16" rx="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
    default: // shield
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
  }
}
