type UspItem = { icon?: string; title?: string; subtitle?: string };

export function UspStrip({ items }: { items?: UspItem[] }) {
  const usps = items?.length === 4 ? items : DEFAULT_USPS;
  return (
    <div className="border-y border-ink/10 bg-creme">
      <div className="mx-auto grid max-w-site divide-y divide-ink/10 md:grid-cols-4 md:divide-x md:divide-y-0 px-0">
        {usps.map((u, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-6 md:px-8 md:py-8">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border border-noir/20 text-noir">
              <Icon name={u.icon || "shield"} />
            </div>
            <div>
              <strong className="display-serif on-cream block text-[15px] font-normal leading-tight md:text-[16px]">{u.title}</strong>
              <span className="mt-1 block font-sans text-[12px] uppercase tracking-[0.14em] text-taupe">{u.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// USPs réelles du groupe (Trust Industrie / DreamsFly)
const DEFAULT_USPS: UspItem[] = [
  { icon: "users", title: "+ 5 000 clients satisfaits", subtitle: "★ 4,9/5 sur Google" },
  { icon: "lock", title: "Paiement 100 % sécurisé", subtitle: "Via Alma · Stripe · CB" },
  { icon: "store", title: "3 magasins physiques", subtitle: "Visitez nos showrooms" },
  { icon: "truck", title: "Livraison à domicile", subtitle: "Partout en France métropolitaine" },
];

function Icon({ name }: { name: string }) {
  switch (name) {
    case "users":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "lock":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case "store":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l2-6h14l2 6" />
          <path d="M3 9v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9" />
          <path d="M3 9h18" />
          <path d="M9 21V13h6v8" />
        </svg>
      );
    case "truck":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="6" width="14" height="11" rx="1" />
          <path d="M15 9h4l3 3v5h-7V9z" />
          <circle cx="5.5" cy="18.5" r="2" />
          <circle cx="18.5" cy="18.5" r="2" />
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
