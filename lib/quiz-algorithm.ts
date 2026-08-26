/**
 * Algorithme de recommandation matelas — quiz DreamsFly.
 * Score chaque matelas selon les réponses, retourne le meilleur match.
 *
 * Pondérations pensées comme un vrai conseiller sommeil :
 * - Fermeté / gabarit / position = les 3 leviers structurants (60 % du score)
 * - Technologie = préférence, pas déterminant (15 %)
 * - Budget = filtre puis nuancer (15 %)
 * - Confort recherché (froid, silence…) = affinement (10 %)
 */

export type QuizAnswers = {
  productType?: "matelas" | "lit" | "oreiller";
  size?: string; // ex. "140x190"
  sleepPosition?: "dos" | "cote" | "ventre" | "variable";
  weight?: "leger" | "moyen" | "fort"; // < 70 / 70-90 / > 90 kg
  priorities?: string[]; // ["thermique", "soutien", "silence", "enveloppant", "eco"]
  firmnessPreference?: "moelleux" | "equilibre" | "ferme" | "sans-preference";
  budget?: [number, number];
  // Oreiller
  pillowFilling?: string;
  allergies?: "oui" | "non";
  // Lit coffre
  bedCoffreType?: string;
  bedMaterial?: string;
  storageNeed?: "beaucoup" | "modere" | "sans-preference";
};

export type ScoredProduct = {
  product: any;
  score: number;
  reasons: string[];
};

const FIRMNESS_FROM_POSITION: Record<string, string[]> = {
  dos: ["mi-ferme", "equilibre"],
  cote: ["moelleux", "equilibre", "mi-ferme"],
  ventre: ["ferme", "tres-ferme"],
  variable: ["mi-ferme", "equilibre"],
};

const FIRMNESS_FROM_WEIGHT: Record<string, string[]> = {
  leger: ["moelleux", "equilibre", "mi-ferme"],
  moyen: ["mi-ferme", "ferme"],
  fort: ["ferme", "tres-ferme"],
};

const PRIORITY_TO_TYPE: Record<string, string[]> = {
  thermique: ["mousse-ressorts", "mousse-hr-ressorts"], // ressorts = respirants
  enveloppant: ["memoire-ressorts", "mousse-hr-ressorts"], // mémoire = enveloppant
  silence: ["memoire-ressorts", "mousse-polyurethane"], // mémoire silencieuse
  soutien: ["mousse-hr-ressorts", "mousse-ressorts"],
  eco: [],
};

export function scoreMattress(product: any, answers: QuizAnswers): ScoredProduct {
  let score = 0;
  const reasons: string[] = [];

  // ─── 1) FERMETÉ (30 pts) ─────────────────────────────
  const productFirmness = product.firmness;
  if (productFirmness) {
    // Match direct avec préférence utilisateur
    if (answers.firmnessPreference && answers.firmnessPreference !== "sans-preference") {
      const target = answers.firmnessPreference === "moelleux" ? ["moelleux", "equilibre"]
        : answers.firmnessPreference === "equilibre" ? ["equilibre", "mi-ferme"]
          : ["ferme", "tres-ferme"];
      if (target.includes(productFirmness)) {
        score += 30;
        reasons.push(`Fermeté ${productFirmness} correspond à votre préférence`);
      } else {
        score += 10;
      }
    } else {
      // Sinon utilise position + gabarit
      const posMatches = answers.sleepPosition ? FIRMNESS_FROM_POSITION[answers.sleepPosition] || [] : [];
      const wgtMatches = answers.weight ? FIRMNESS_FROM_WEIGHT[answers.weight] || [] : [];
      if (posMatches.includes(productFirmness) && wgtMatches.includes(productFirmness)) {
        score += 30;
        reasons.push(`Fermeté ${productFirmness} idéale pour votre position et votre gabarit`);
      } else if (posMatches.includes(productFirmness) || wgtMatches.includes(productFirmness)) {
        score += 18;
        reasons.push(`Fermeté ${productFirmness} adaptée à votre morphologie`);
      } else {
        score += 5;
      }
    }
  }

  // ─── 2) TECHNOLOGIE selon priorités (25 pts) ─────────
  const productType = product.type;
  if (productType && answers.priorities?.length) {
    let techMatch = false;
    for (const priority of answers.priorities) {
      const preferredTypes = PRIORITY_TO_TYPE[priority] || [];
      if (preferredTypes.includes(productType)) {
        score += 8;
        techMatch = true;
        if (priority === "thermique") reasons.push("Technologie respirante pour une nuit fraîche");
        if (priority === "enveloppant") reasons.push("Mémoire de forme qui épouse le corps");
        if (priority === "silence") reasons.push("Indépendance de couchage silencieuse");
        if (priority === "soutien") reasons.push("Soutien tonique adapté aux besoins lombaires");
      }
    }
    if (techMatch) score += 5; // bonus si au moins un match
  }

  // ─── 3) TAILLE disponible (20 pts, éliminatoire) ─────
  if (answers.size) {
    const requested = extractDims(answers.size);
    const hasSize = (product.variants || []).some((v: any) => {
      const dims = extractDims(v.size);
      return dims && requested && dims.w === requested.w && dims.l === requested.l;
    }) || dimsInText(product.title, requested) || dimsInText(product.name, requested);

    if (hasSize) {
      score += 20;
    } else {
      // Pas de match taille = grosse pénalité (mais on n'élimine pas totalement)
      score -= 30;
    }
  }

  // ─── 4) BUDGET (20 pts) ──────────────────────────────
  const price = product.minPrice || 0;
  if (answers.budget && price > 0) {
    const [min, max] = answers.budget;
    if (price >= min && price <= max) {
      score += 20;
      reasons.push(`Prix ${price} € dans votre budget`);
    } else if (price < min * 0.7 || price > max * 1.3) {
      score -= 10;
    } else if (price < min) {
      score += 12; // en dessous = OK, juste moins premium
    } else if (price > max) {
      score -= 5;
    }
  }

  // ─── 5) BONUS featured / rating (5 pts) ──────────────
  if (product.featured) score += 3;
  if (product.rating?.value && product.rating.value >= 4.5) score += 2;

  return { product, score, reasons };
}

export function recommendMatelas(products: any[], answers: QuizAnswers): {
  best?: ScoredProduct;
  alternatives: ScoredProduct[];
} {
  if (!products?.length) return { alternatives: [] };

  const scored = products
    .map((p) => scoreMattress(p, answers))
    .sort((a, b) => b.score - a.score);

  const best = scored[0];
  const alternatives = scored.slice(1, 3).filter((s) => s.score > 0);

  return { best, alternatives };
}

function extractDims(s?: string): { w: number; l: number } | null {
  if (!s) return null;
  const m = String(s).match(/(\d{2,3})\s*[xX×/\-]\s*(\d{2,3})/);
  if (!m) return null;
  return { w: parseInt(m[1], 10), l: parseInt(m[2], 10) };
}

function dimsInText(text: string | undefined, requested: { w: number; l: number } | null): boolean {
  if (!text || !requested) return false;
  return text.includes(String(requested.w)) && text.includes(String(requested.l));
}

// ─────────────────────────────────────────────────────────────
// Oreiller et lit coffre
// ─────────────────────────────────────────────────────────────

/**
 * `scoreMattress` note sur `product.type` — mousse, ressorts ensachés — un
 * champ que ni un oreiller ni un lit ne porte. Appliqué à ces produits, il
 * renvoyait donc un score plat : le classement devenait arbitraire.
 *
 * Les deux fonctions ci-dessous notent sur les champs que ces produits
 * portent RÉELLEMENT en base (cf. sanity/schemas/product.ts).
 */

/** Hauteur d'oreiller adaptée à la position, exprimée en fermeté. */
const PILLOW_FIRMNESS_FROM_POSITION: Record<string, string[]> = {
  // Sur le côté, il faut combler l'espace de l'épaule : maintien plus stable.
  cote: ["ferme", "mi-ferme"],
  dos: ["mi-ferme", "equilibre"],
  // Sur le ventre, un oreiller épais cambre la nuque.
  ventre: ["moelleux"],
  variable: ["mi-ferme", "equilibre"],
};

export function scorePillow(product: any, answers: QuizAnswers): ScoredProduct {
  let score = 0;
  const reasons: string[] = [];

  // ─── Position → hauteur et maintien (30 pts) ─────────
  const wanted = PILLOW_FIRMNESS_FROM_POSITION[answers.sleepPosition || ""] || [];
  if (wanted.length && product.firmness) {
    if (wanted.includes(product.firmness)) {
      score += 30;
      if (answers.sleepPosition === "cote")
        reasons.push("Maintien stable pour combler l'espace de l'épaule");
      if (answers.sleepPosition === "ventre")
        reasons.push("Accueil souple, qui évite de cambrer la nuque");
      if (answers.sleepPosition === "dos") reasons.push("Hauteur adaptée au sommeil sur le dos");
    } else {
      score += 8;
    }
  } else {
    score += 12; // information absente : ni bonus, ni pénalité écrasante
  }

  // ─── Garnissage (25 pts) ─────────────────────────────
  if (answers.pillowFilling && answers.pillowFilling !== "sans-preference") {
    if (product.oreillerFilling === answers.pillowFilling) {
      score += 25;
      reasons.push("Le garnissage que vous préférez");
    }
  } else {
    score += 10;
  }

  // ─── Fermeté déclarée (20 pts) ───────────────────────
  if (answers.firmnessPreference && answers.firmnessPreference !== "sans-preference") {
    if (product.firmness === answers.firmnessPreference) {
      score += 20;
      reasons.push("Le maintien que vous recherchez");
    } else {
      score += 6;
    }
  } else {
    score += 10;
  }

  // ─── Allergies (15 pts) ──────────────────────────────
  if (answers.allergies === "oui") {
    const f = product.features || {};
    if (f.antiAcariens || f.hypoallergenique) {
      score += 15;
      reasons.push("Traitement anti-acariens, adapté aux personnes sensibles");
    }
    // Le duvet et les plumes sont déconseillés aux allergiques.
    if (product.oreillerFilling === "duvet-oie" || product.oreillerFilling === "plumes") {
      score -= 10;
    }
  } else {
    score += 7;
  }

  score += scoreBudget(product, answers, reasons);
  return { product, score, reasons: reasons.slice(0, 4) };
}

export function scoreBed(product: any, answers: QuizAnswers): ScoredProduct {
  let score = 0;
  const reasons: string[] = [];

  // ─── Taille de couchage (30 pts) ─────────────────────
  const requested = extractDims(answers.size);
  if (requested) {
    const sizes = (product.variants || []).map((v: any) => v?.size).filter(Boolean);
    const match = sizes.some((s: string) => {
      const d = extractDims(s);
      return d && d.w === requested.w && d.l === requested.l;
    });
    if (match) {
      score += 30;
      reasons.push(`Disponible en ${requested.w} × ${requested.l} cm`);
    } else {
      // Taille indisponible : le produit ne peut pas être recommandé.
      score -= 25;
    }
  } else {
    score += 12;
  }

  // ─── Type d'ouverture du coffre (25 pts) ─────────────
  if (answers.bedCoffreType && answers.bedCoffreType !== "sans-preference") {
    if (product.litCoffreType === answers.bedCoffreType) {
      score += 25;
      if (answers.bedCoffreType === "frontal") reasons.push("Ouverture frontale, par les pieds du lit");
      if (answers.bedCoffreType === "lateral") reasons.push("Ouverture latérale, pratique contre un mur");
      if (answers.bedCoffreType === "aucun") reasons.push("Lit classique, sans coffre");
    } else {
      score += 5;
    }
  } else {
    score += 10;
  }

  // ─── Matière (20 pts) ────────────────────────────────
  if (answers.bedMaterial && answers.bedMaterial !== "sans-preference") {
    if (product.litMaterial === answers.bedMaterial) {
      score += 20;
      reasons.push("La matière que vous avez choisie");
    }
  } else {
    score += 8;
  }

  // ─── Capacité de rangement (10 pts) ──────────────────
  const capacity = Number(product.litCoffreCapacityL) || 0;
  if (answers.storageNeed === "beaucoup" && capacity >= 400) {
    score += 10;
    reasons.push(`Coffre de ${capacity} L — l'équivalent d'une commode`);
  } else if (answers.storageNeed === "modere" && capacity > 0) {
    score += 6;
  } else if (answers.storageNeed === "sans-preference") {
    score += 5;
  }

  score += scoreBudget(product, answers, reasons);
  return { product, score, reasons: reasons.slice(0, 4) };
}

/** Budget — commun aux trois parcours, 15 points. */
function scoreBudget(product: any, answers: QuizAnswers, reasons: string[]): number {
  const price = Number(product.minPrice);
  if (!answers.budget || !Number.isFinite(price)) return 7;
  const [min, max] = answers.budget;
  if (price >= min && price <= max) {
    reasons.push("Dans votre fourchette de budget");
    return 15;
  }
  // Juste au-dessus : on ne l'écarte pas, on le déclasse.
  if (price <= max * 1.15) return 5;
  return 0;
}

/**
 * Point d'entrée unique du quiz : aiguille vers la notation du type demandé
 * et n'évalue que les produits de ce type.
 *
 * Auparavant `recommendMatelas` notait indistinctement tout ce qu'on lui
 * passait — et la page ne lui passait que des matelas. Un visiteur venu
 * pour un oreiller repartait donc avec un matelas.
 */
export function recommendProduct(
  products: any[],
  answers: QuizAnswers,
): { best?: ScoredProduct; alternatives: ScoredProduct[] } {
  const type = answers.productType || "matelas";

  const pool = (products || []).filter((p) => {
    const pt = p?.productType || "matelas";
    return pt === type;
  });
  if (!pool.length) return { alternatives: [] };

  const scorer = type === "oreiller" ? scorePillow : type === "lit" ? scoreBed : scoreMattress;
  const scored = pool.map((p) => scorer(p, answers)).sort((a, b) => b.score - a.score);

  return { best: scored[0], alternatives: scored.slice(1, 3).filter((s) => s.score > 0) };
}
