/**
 * Résolution d'un produit par son slug actuel OU par un ancien slug.
 *
 * POURQUOI CE MODULE EXISTE
 * Renommer le slug d'un produit dans Sanity supprimait purement et
 * simplement l'ancienne URL : la route est dynamique, l'ancien slug
 * disparaissait de `generateStaticParams`, et Google se retrouvait devant
 * une 404 sur une page qu'il avait déjà classée.
 *
 * Le champ « Anciens slugs » (`previousSlugs`) de la fiche produit répond à
 * ce problème sans table de redirections à maintenir dans le code : la
 * requête accepte l'ancien slug, et la page redirige en 308 vers le slug
 * canonique.
 *
 * POURQUOI LE TRI SE FAIT ICI ET NON EN GROQ
 * La requête peut légitimement renvoyer DEUX documents : celui dont
 * `slug.current` vaut le slug demandé, et un autre qui porte cette même
 * valeur dans ses anciens slugs. Un `[0]` GROQ sur un résultat non
 * ordonné choisirait l'un ou l'autre au hasard — et servirait donc parfois
 * une fiche périmée à la place de la fiche vivante.
 *
 * Départager en TypeScript rend la règle explicite, déterministe et
 * testable unitairement, ce qu'une expression d'ordonnancement GROQ ne
 * permet pas.
 *
 * CE MODULE N'ÉCRIT RIEN. Il ne connaît pas de client Sanity, il reçoit des
 * documents déjà lus. Le champ `previousSlugs` est saisi à la main dans le
 * Studio et n'est jamais alimenté ni vidé par du code.
 */

export type ProductSlugCandidate = {
  slug?: string | null;
  previousSlugs?: string[] | null;
};

/**
 * Compose l'URL d'une fiche produit.
 *
 * Trois lignes qui existent pour une raison précise : les quatre routes
 * produit doivent construire leur cible de redirection à l'identique, et
 * surtout conserver LEUR base de catégorie. Une redirection depuis
 * `/sommiers/<ancien>` doit rester sous `/sommiers/`, jamais glisser vers
 * une autre rubrique. Passer par une fonction commune rend cette garantie
 * testable, ce qu'une interpolation recopiée quatre fois n'est pas.
 */
export function productUrlFor(basePath: string, slug: string): string {
  return `${basePath}/${slug}`;
}

export type ResolvedProduct<T> = {
  /** Le document à servir. */
  product: T;
  /** Le slug actuel du produit — celui qui doit figurer dans l'URL et la canonical. */
  canonicalSlug: string;
  /** Vrai lorsque l'URL demandée utilise un ancien slug. */
  shouldRedirect: boolean;
};

/**
 * Tolère un document seul autant qu'un tableau : si une requête conservait
 * un `[0]` en GROQ, la résolution continue de fonctionner au lieu de casser
 * silencieusement.
 */
function toList<T>(input: T[] | T | null | undefined): T[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.filter(Boolean);
  return [input];
}

/** Slug exploitable : une chaîne non vide, espaces de bord ignorés. */
function readSlug(candidate: ProductSlugCandidate | null | undefined): string | null {
  const value = candidate?.slug;
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

/**
 * Le champ peut être absent (fiches créées avant son introduction), null, ou
 * contenir des valeurs saisies à la main. Chaque cas doit être traité sans
 * lever d'exception : c'est ce qui rend le mécanisme rétrocompatible avec
 * l'intégralité du catalogue existant, dont aucune fiche ne porte encore
 * d'ancien slug.
 *
 * Le `trim()` rattrape l'espace de fin qu'un copier-coller depuis le Studio
 * laisse fréquemment traîner.
 */
function hasPreviousSlug(candidate: ProductSlugCandidate, requested: string): boolean {
  const list = candidate?.previousSlugs;
  if (!Array.isArray(list)) return false;
  return list.some((entry) => typeof entry === "string" && entry.trim() === requested);
}

/**
 * Choisit le produit à servir pour le slug demandé et indique s'il faut
 * rediriger.
 *
 * L'ordre des règles porte toute la sécurité du mécanisme :
 *
 *  1. Une correspondance EXACTE sur `slug.current` gagne toujours. C'est ce
 *     qui garantit qu'une fiche vivante n'est jamais éclipsée par une autre
 *     qui aurait conservé la même valeur dans ses anciens slugs — et c'est
 *     aussi ce qui rend toute boucle de redirection impossible : un produit
 *     dont les anciens slugs contiennent son slug actuel est servi
 *     directement, sans redirection.
 *  2. À défaut, une correspondance sur un ancien slug déclenche la
 *     redirection vers le slug actuel.
 *
 * Renvoie `null` quand rien ne correspond : l'appelant conserve alors son
 * comportement 404 habituel.
 */
export function resolveProductBySlug<T extends ProductSlugCandidate>(
  candidates: T[] | T | null | undefined,
  requestedSlug: string,
): ResolvedProduct<T> | null {
  const requested = typeof requestedSlug === "string" ? requestedSlug.trim() : "";
  if (!requested) return null;

  const list = toList(candidates);
  if (!list.length) return null;

  // 1. Slug actuel — priorité absolue, aucune redirection.
  for (const candidate of list) {
    const slug = readSlug(candidate);
    if (slug && slug === requested) {
      return { product: candidate, canonicalSlug: slug, shouldRedirect: false };
    }
  }

  // 2. Ancien slug. Un produit sans slug actuel est écarté : on n'aurait
  //    aucune destination vers laquelle rediriger.
  const legacy = list
    .filter((candidate) => readSlug(candidate) && hasPreviousSlug(candidate, requested))
    // Tri par slug pour que deux fiches revendiquant le même ancien slug
    // donnent toujours le même résultat. Cette situation ne devrait pas
    // exister — la validation du Studio et le contrôle préalable à chaque
    // renommage sont là pour l'empêcher — mais un comportement stable vaut
    // mieux qu'un tirage au sort silencieux.
    .sort((a, b) => (readSlug(a) as string).localeCompare(readSlug(b) as string));

  if (!legacy.length) return null;

  const product = legacy[0];
  return {
    product,
    canonicalSlug: readSlug(product) as string,
    shouldRedirect: true,
  };
}
