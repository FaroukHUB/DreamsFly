/**
 * Titre H1 de la page catégorie /sommiers.
 *
 * POURQUOI CE MODULE
 * Le H1 était « Sommiers premium DreamsFly » : un titre de marque, répétant
 * un nom que le `title.template` du layout ajoute déjà, et ne reprenant
 * aucun des mots qu'un visiteur tape — « sommier à lattes », « sommier
 * tapissier ». Il énumère désormais les types présents au catalogue.
 *
 * POURQUOI LA LISTE EST DÉDUITE, ET NON ÉCRITE EN DUR
 * Annoncer « sommiers à lattes, tapissiers et coffres » quand seuls des
 * modèles à lattes sont publiés promet au visiteur un choix qui n'existe
 * pas. La fonction ne nomme que ce qui est réellement vendu, et le titre
 * suit le catalogue sans intervention.
 *
 * L'ordre d'affichage est celui de TYPE_WORDS, pas celui du catalogue : il
 * reste donc stable quand un modèle entre ou sort du stock, alors qu'un
 * ordre calculé ferait varier le H1 à chaque publication.
 */

/** Formes courtes employées dans le H1, dans leur ordre d'affichage. */
const TYPE_WORDS: Record<string, string> = {
  "lattes-apparentes": "à lattes",
  "lattes-recouvertes": "à lattes recouvertes",
  tapissier: "tapissiers",
  ressorts: "à ressorts",
  coffre: "coffres de rangement",
};

/** Énumération française : « a », « a et b », « a, b et c ». */
export function joinFr(parts: string[]): string {
  if (parts.length <= 1) return parts[0] || "";
  return `${parts.slice(0, -1).join(", ")} et ${parts[parts.length - 1]}`;
}

/**
 * H1 de /sommiers d'après les types réellement présents au catalogue.
 *
 * Repli sur « Sommiers » quand aucun produit n'expose de `sommierType` :
 * mieux vaut un titre court et vrai qu'une énumération inventée.
 */
export function sommiersHeading(
  products: { sommierType?: string | null }[] | null | undefined,
): string {
  const present = new Set(
    (Array.isArray(products) ? products : [])
      .map((p) => p?.sommierType)
      .filter((t): t is string => typeof t === "string" && t in TYPE_WORDS),
  );

  const words = Object.keys(TYPE_WORDS)
    .filter((key) => present.has(key))
    .map((key) => TYPE_WORDS[key]);

  return words.length ? `Sommiers ${joinFr(words)}` : "Sommiers";
}
