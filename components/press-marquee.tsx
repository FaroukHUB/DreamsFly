/**
 * Bande presse éditoriale — style Trust Industrie.
 * Défilement infini de noms de presse en Fraunces serif.
 * Peut être posé sur fond noir (default) ou crème (`tone="cream"`).
 * Les items sont dupliqués côté serveur pour éviter tout flash au montage.
 */
type Props = {
  items?: string[];
  tone?: "noir" | "cream";
};

const DEFAULT_ITEMS = [
  "LE MONDE",
  "MADAME FIGARO",
  "L'EXPRESS",
  "60 MILLIONS DE CONSOMMATEURS",
  "CHALLENGES",
  "ELLE DÉCORATION",
  "AD MAGAZINE",
  "CÔTÉ MAISON",
];

export function PressMarquee({ items, tone = "noir" }: Props) {
  const list = items && items.length > 0 ? items : DEFAULT_ITEMS;
  const isCream = tone === "cream";
  return (
    <section
      className={`press-marquee py-10 ${isCream ? "bg-creme text-creme" : "bg-noir text-noir"}`}
      aria-label="Ils parlent de nous"
    >
      <div className={`press-marquee-track ${isCream ? "text-ink" : "text-ivoire"}`}>
        {[...list, ...list].map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </div>
    </section>
  );
}
