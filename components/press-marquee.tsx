/**
 * Bandeau éditorial défilant — sous le hero.
 * Contenu piloté depuis Sanity (siteSettings.editorialStrip.items).
 * Fallback : matériaux + certifications + engagements — tous factuellement
 * vrais, RIEN d'inventé sur la presse.
 */
type Props = {
  items?: string[];
  tone?: "noir" | "cream";
};

const DEFAULT_ITEMS = [
  "COTON BIO CERTIFIÉ GOTS",
  "MOUSSE CERTIPUR-EU",
  "LABEL OEKO-TEX STANDARD 100",
  "BOIS PEFC",
  "MÉMOIRE DE FORME 75 KG/M³",
  "RESSORTS ENSACHÉS",
  "100 NUITS D'ESSAI",
  "15 ANS DE GARANTIE",
  "3 SHOWROOMS · PARIS · LYON · MARSEILLE",
  "PAIEMENT 3× SANS FRAIS",
];

export function PressMarquee({ items, tone = "noir" }: Props) {
  const list = items && items.length > 0 ? items : DEFAULT_ITEMS;
  const isCream = tone === "cream";
  return (
    <section
      className={`press-marquee py-10 ${isCream ? "bg-creme text-creme" : "bg-noir text-noir"}`}
      aria-label="Nos matériaux, certifications et engagements"
    >
      <div className={`press-marquee-track ${isCream ? "text-ink" : "text-ivoire"}`}>
        {[...list, ...list].map((item, i) => (
          <span key={i} className="flex items-center gap-6">
            <span className="text-or" aria-hidden="true">
              ◆
            </span>
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
