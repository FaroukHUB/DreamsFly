/**
 * Passerelle guide → catalogue.
 *
 * POURQUOI
 * Le gabarit du Magazine ne contenait AUCUN lien vers les pages catégorie :
 * un lecteur arrivé sur « Comment choisir son sommier » depuis Google
 * pouvait lire l'article en entier sans jamais croiser un chemin vers
 * /sommiers. Le maillage descendant — accueil vers catégories vers produits
 * — était solide ; c'est le maillage transversal, de l'éditorial vers le
 * commercial, qui manquait entièrement.
 *
 * COMMENT LA CIBLE EST CHOISIE
 * Par le slug du guide, et par lui seul. Deviner la catégorie depuis le
 * titre ou les tags donnerait des rapprochements approximatifs — un article
 * sur les oreillers cite forcément le mot « matelas ». Un guide dont le
 * slug n'est pas dans cette table n'affiche simplement pas de bloc : mieux
 * vaut aucun lien qu'un lien vers la mauvaise rubrique.
 */

export type GuideCta = {
  /** Ce que le lecteur vient de comprendre, repris pour amorcer l'action. */
  title: string;
  text: string;
  href: string;
  label: string;
  /** Second lien, quand une page connexe éclaire vraiment le sujet. */
  secondary?: { href: string; label: string };
};

const BY_SLUG: Record<string, GuideCta> = {
  "guide-choisir-matelas": {
    title: "Passez à la pratique",
    text: "Vous savez maintenant quels critères comparer. Nos matelas sont filtrables par fermeté, technologie et dimension — et tous se testent en showroom avant achat.",
    href: "/matelas",
    label: "Voir tous les matelas",
    secondary: { href: "/quiz", label: "Faire le quiz matelas" },
  },
  "guide-choisir-sommier": {
    title: "Passez à la pratique",
    text: "Le sommier se choisit en fonction du matelas qu'il portera. Nos modèles indiquent leur type, leur nombre de lattes et leurs dimensions pour vérifier l'association.",
    href: "/sommiers",
    label: "Voir tous les sommiers",
    secondary: { href: "/matelas", label: "Voir les matelas compatibles" },
  },
  "guide-choisir-oreiller": {
    title: "Passez à la pratique",
    text: "L'épaisseur qui vous convient dépend de votre position de sommeil. Nos oreillers précisent leur garnissage, leur forme et leurs dimensions.",
    href: "/oreillers",
    label: "Voir tous les oreillers",
    secondary: { href: "/quiz", label: "Faire le quiz oreiller" },
  },
  "guide-choisir-lit": {
    title: "Passez à la pratique",
    text: "Dimension, structure, revêtement : chaque fiche précise ce qui est inclus, sommier et tête de lit compris.",
    href: "/lits",
    label: "Voir tous les lits",
    secondary: { href: "/lits-coffre", label: "Découvrir les lits coffre" },
  },
  "matelas-mal-de-dos": {
    title: "Voir les modèles concernés",
    text: "Notre sélection à soutien renforcé regroupe les modèles de fermeté intermédiaire à ferme. À essayer allongé, dans votre position de sommeil habituelle.",
    href: "/matelas-mal-de-dos",
    label: "Voir la sélection",
    secondary: { href: "/magasins", label: "Essayer en showroom" },
  },
  "memoire-forme-vs-ressorts": {
    title: "Comparez sur les fiches",
    text: "Chaque matelas indique sa technologie de suspension et sa fermeté, ce qui permet de retrouver directement les modèles correspondant à votre choix.",
    href: "/matelas",
    label: "Voir tous les matelas",
    secondary: { href: "/matelas-memoire-de-forme", label: "Voir les mémoire de forme" },
  },
  "mieux-dormir-5-gestes": {
    title: "Vérifiez votre literie",
    text: "Les gestes du quotidien ne compensent pas un couchage en fin de vie. Un matelas dont le soutien s'est creusé se remarque au réveil.",
    href: "/matelas",
    label: "Voir tous les matelas",
    secondary: { href: "/quiz", label: "Faire le quiz" },
  },
};

export function guideCtaFor(slug: string | null | undefined): GuideCta | null {
  if (typeof slug !== "string") return null;
  return BY_SLUG[slug] || null;
}
