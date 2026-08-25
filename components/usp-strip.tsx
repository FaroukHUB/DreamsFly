import { LineIcon } from "./line-icon";

type UspItem = { icon?: string; title?: string; subtitle?: string };

/**
 * Bande USP — 4 arguments clés.
 * tone="cream" : grille 4-col crème/noir, icônes noires (statique)
 * tone="noir"  : bandeau défilant noir sur toute largeur, icônes or,
 *                items dupliqués pour boucle CSS infinie (mobile ok).
 */
export function UspStrip({
  items,
  tone = "cream",
}: {
  items?: UspItem[];
  tone?: "cream" | "noir";
}) {
  const usps = items?.length === 4 ? items : DEFAULT_USPS;

  if (tone === "noir") {
    // Version défilante — style bandeau presse
    return (
      <section
        className="press-marquee border-y border-white/10 bg-noir py-5 md:py-6"
        aria-label="Nos engagements clés"
        style={{ color: "#0B0B0F" }}
      >
        <div className="press-marquee-track">
          {[...usps, ...usps, ...usps].map((u, i) => (
            <span
              key={i}
              className="flex flex-shrink-0 items-center gap-4 pr-6 text-ivoire"
            >
              <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-or/40 text-or">
                <IconInline name={u.icon || "shield"} />
              </span>
              <span className="flex flex-col leading-tight">
                <strong className="whitespace-nowrap font-serif text-[15px] font-normal text-ivoire md:text-[16px]">
                  {u.title}
                </strong>
                <span className="whitespace-nowrap font-sans text-[10.5px] uppercase tracking-[0.16em] text-or/80">
                  {u.subtitle}
                </span>
              </span>
              <span aria-hidden className="ml-3 text-or">◆</span>
            </span>
          ))}
        </div>
      </section>
    );
  }

  // Version crème statique (par défaut, pour sections intérieures)
  return (
    <div className="border-y border-ink/10 bg-creme">
      <div className="mx-auto grid max-w-site divide-y divide-ink/10 md:grid-cols-4 md:divide-x md:divide-y-0 px-0">
        {usps.map((u, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-6 md:px-8 md:py-8">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-noir/20 text-noir">
              <IconInline name={u.icon || "shield"} />
            </div>
            <div>
              <strong className="block font-serif text-[15px] font-normal leading-tight text-noir md:text-[16px]">
                {u.title}
              </strong>
              <span className="mt-1 block font-sans text-[11px] uppercase tracking-[0.16em] text-taupe">
                {u.subtitle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// USPs réelles du groupe
const DEFAULT_USPS: UspItem[] = [
  { icon: "users", title: "+ 5 000 clients satisfaits", subtitle: "★ 4,9/5 sur Google" },
  { icon: "lock", title: "Paiement 100 % sécurisé", subtitle: "Via Alma · Stripe · CB" },
  { icon: "store", title: "3 magasins physiques", subtitle: "Visitez nos showrooms" },
  { icon: "truck", title: "Livraison à domicile", subtitle: "Partout en France métropolitaine" },
];

function IconInline({ name }: { name: string }) {
  const map: Record<string, string> = {
    users: "users",
    lock: "lock",
    store: "store",
    truck: "truck",
    shield: "shield",
  };
  return <LineIcon name={map[name] || "shield"} size={20} strokeWidth={1.5} />;
}
