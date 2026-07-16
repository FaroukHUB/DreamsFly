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
