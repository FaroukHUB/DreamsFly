/**
 * Ligne de caractéristiques affichée sur les cartes produit.
 *
 * POURQUOI CE MODULE
 * Les cartes montraient le nom de collection, une accroche et un prix. Un
 * visiteur qui compare quatre matelas n'avait donc aucun moyen de les
 * distinguer sans ouvrir chaque fiche : ni fermeté, ni technologie, ni
 * dimension. Toutes ces données existaient déjà dans Sanity et étaient
 * même chargées par les requêtes — elles n'étaient simplement pas rendues.
 *
 * POURQUOI DES LIBELLÉS COURTS, DISTINCTS DE CEUX DE LA FICHE PRODUIT
 * `components/product/product-details.tsx` possède ses propres tables,
 * volontairement explicites : « Mousse HR + ressorts ensachés ». Sur une
 * carte de 300 px, cette chaîne pousse le prix hors de la vue. Les libellés
 * ci-dessous disent la même chose en deux mots. Ce n'est pas une
 * duplication par négligence : les deux contextes ont des contraintes
 * opposées, et les fusionner obligerait l'un des deux à céder.
 *
 * Trois éléments au maximum. Au-delà, la ligne passe sur deux lignes en
 * mobile et la carte perd la lisibilité qu'on cherche à lui donner.
 */

/**
 * Rubrique d'un produit selon son type. Même correspondance que
 * `app/sitemap.ts` : un lit vit sous /lits, un oreiller sous /oreillers.
 * Les fiches importées avant l'introduction de `productType` sont des
 * matelas, d'où le repli.
 */
const BASE_PATH_BY_TYPE: Record<string, string> = {
  matelas: "/matelas",
  lit: "/lits",
  sommier: "/sommiers",
  oreiller: "/oreillers",
};

/**
 * URL d'une fiche produit, déduite de son type.
 *
 * Le chemin est composé ici plutôt que via `productUrlFor` de
 * lib/product-slug.ts : ce module est couvert par des tests exécutés avec
 * le mode natif de Node, qui ne résout pas l'alias `@/`. Une dépendance
 * entre les deux modules rendrait ces tests inexécutables pour l'unique
 * bénéfice de partager une concaténation d'une ligne.
 */
export function productPathFor(
  product: { productType?: string | null; slug?: string | null } | null | undefined,
): string {
  const base = BASE_PATH_BY_TYPE[product?.productType || "matelas"] || "/matelas";
  return `${base}/${product?.slug || ""}`;
}

/**
 * Texte alternatif d'une photo produit.
 *
 * Les cartes affichaient `alt={p.name}` — soit « BARCELONE », un nom de
 * ville qui ne décrit rien pour un lecteur d'écran ni pour la recherche
 * d'images. L'ordre de préférence : l'alt saisi dans Sanity, sinon le titre
 * complet du produit, qui est descriptif par construction.
 */
export function productImageAlt(
  product: { image?: { alt?: string | null } | null; title?: string | null; name?: string | null } | null | undefined,
): string {
  const explicit = product?.image?.alt;
  if (typeof explicit === "string" && explicit.trim()) return explicit.trim();
  const title = product?.title;
  if (typeof title === "string" && title.trim()) return title.trim();
  const name = product?.name;
  return typeof name === "string" && name.trim() ? name.trim() : "Produit DreamsFly";
}

export type ProductCardInput = {
  productType?: string | null;
  // Matelas
  type?: string | null;
  firmness?: string | null;
  thicknessCm?: number | null;
  // Lit
  litMaterial?: string | null;
  litCoffreType?: string | null;
  // Sommier
  sommierType?: string | null;
  sommierLattes?: number | null;
  // Oreiller
  oreillerFilling?: string | null;
  oreillerShape?: string | null;
  oreillerDimensions?: string | null;
  // Tailles
  variants?: { size?: string | null }[] | null;
};

const TYPE_SHORT: Record<string, string> = {
  "mousse-polyurethane": "Mousse polyuréthane",
  "mousse-hr-ressorts": "Mousse HR + ressorts",
  "memoire-ressorts": "Mémoire de forme",
  "mousse-ressorts": "Ressorts ensachés",
};

const FIRMNESS_SHORT: Record<string, string> = {
  moelleux: "Moelleux",
  equilibre: "Équilibré",
  "mi-ferme": "Mi-ferme",
  ferme: "Ferme",
  "tres-ferme": "Très ferme",
};

const LIT_MATERIAL_SHORT: Record<string, string> = {
  velours: "Velours",
  "tissu-trame": "Tissu tramé",
  lin: "Lin",
  capitonne: "Capitonné",
  "simili-cuir": "Simili cuir",
};

const LIT_COFFRE_SHORT: Record<string, string> = {
  frontal: "Coffre frontal",
  lateral: "Coffre latéral",
  aucun: "Sans coffre",
};

const SOMMIER_TYPE_SHORT: Record<string, string> = {
  "lattes-apparentes": "Lattes apparentes",
  "lattes-recouvertes": "Lattes recouvertes",
  tapissier: "Tapissier",
  ressorts: "À ressorts",
  coffre: "Coffre de rangement",
};

const OREILLER_FILL_SHORT: Record<string, string> = {
  "duvet-oie": "Duvet d'oie",
  plumes: "Plumes",
  "memoire-forme": "Mémoire de forme",
  latex: "Latex naturel",
  "fibre-recyclee": "Fibre recyclée",
  microfibre: "Microfibre",
};

const OREILLER_SHAPE_SHORT: Record<string, string> = {
  rectangulaire: "Rectangulaire",
  carre: "Carré",
  ergonomique: "Ergonomique",
  traversin: "Traversin",
};

/**
 * Première taille proposée. Sert de repère concret — « 140 x 190 cm » parle
 * immédiatement, là où « plusieurs tailles » n'apprend rien.
 */
function mainSize(product: ProductCardInput): string | null {
  const variants = product?.variants;
  if (!Array.isArray(variants)) return null;
  for (const variant of variants) {
    const size = typeof variant?.size === "string" ? variant.size.trim() : "";
    if (size) return size;
  }
  return null;
}

/** Traduit une valeur de liste Sanity, en ignorant silencieusement l'inconnu. */
function label(map: Record<string, string>, value: unknown): string | null {
  if (typeof value !== "string") return null;
  return map[value] || null;
}

/**
 * Construit la ligne de caractéristiques d'une carte, selon le type de
 * produit. Renvoie `null` quand aucune donnée n'est exploitable : la carte
 * n'affiche alors rien plutôt qu'une ligne vide ou un séparateur orphelin.
 */
export function productSpecs(product: ProductCardInput | null | undefined): string[] {
  if (!product) return [];
  const type = product.productType || "matelas";
  const specs: (string | null)[] = [];

  if (type === "lit") {
    specs.push(label(LIT_MATERIAL_SHORT, product.litMaterial));
    specs.push(label(LIT_COFFRE_SHORT, product.litCoffreType));
  } else if (type === "sommier") {
    specs.push(label(SOMMIER_TYPE_SHORT, product.sommierType));
    specs.push(
      typeof product.sommierLattes === "number" && product.sommierLattes > 0
        ? `${product.sommierLattes} lattes`
        : null,
    );
  } else if (type === "oreiller") {
    specs.push(label(OREILLER_FILL_SHORT, product.oreillerFilling));
    specs.push(label(OREILLER_SHAPE_SHORT, product.oreillerShape));
  } else {
    // Matelas — la fermeté d'abord : c'est le critère de choix numéro un,
    // et celui que le quiz interroge en premier.
    specs.push(label(FIRMNESS_SHORT, product.firmness));
    specs.push(label(TYPE_SHORT, product.type));
  }

  // La dimension ferme la ligne pour tous les types. Les oreillers portent
  // la leur dans un champ texte libre plutôt que dans les variantes.
  const size =
    type === "oreiller"
      ? (typeof product.oreillerDimensions === "string" && product.oreillerDimensions.trim()) ||
        mainSize(product)
      : mainSize(product);
  specs.push(size || null);

  const filtered = specs.filter((s): s is string => typeof s === "string" && s.length > 0);

  // Repli quand rien n'est renseigné : l'épaisseur reste une information
  // concrète, et vaut mieux qu'une carte muette.
  if (!filtered.length && typeof product.thicknessCm === "number" && product.thicknessCm > 0) {
    return [`${product.thicknessCm} cm d'épaisseur`];
  }

  return filtered.slice(0, 3);
}

/** Version prête à afficher, séparée par des points médians. */
export function productSpecLine(product: ProductCardInput | null | undefined): string | null {
  const specs = productSpecs(product);
  return specs.length ? specs.join(" · ") : null;
}
