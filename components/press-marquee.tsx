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

// Ces valeurs par défaut annonçaient cinq certifications — GOTS, CertiPUR-EU,
// OEKO-TEX, PEFC, densité 75 kg/m³ — qu'aucune donnée du projet n'étaye, et
// trois showrooms à Paris, Lyon et Marseille alors que les magasins réels sont
// ailleurs. Le composant n'est importé nulle part, mais une liste fausse prête
// à l'emploi finit toujours par être branchée un jour.
const DEFAULT_ITEMS = [
  "CONFECTION EUROPÉENNE",
  "RESSORTS ENSACHÉS",
  "MÉMOIRE DE FORME",
  "ESSAI EN SHOWROOM",
  "GARANTIE 2 ANS",
  "LIVRAISON 99 € EN FRANCE MÉTROPOLITAINE",
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
