#!/usr/bin/env node
/**
 * Migration : crée / remplit le document quizPage singleton avec toutes les
 * questions et options par défaut. Après ça tu peux ouvrir Sanity Studio →
 * 🧭 Page Quiz et uploader une image sur chaque option (fermeté, position, etc.).
 *
 * IDEMPOTENT — si le doc existe et qu'un champ est déjà rempli, non touché.
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj \
 *   SANITY_WRITE_TOKEN=sk... \
 *   node scripts/populate-quiz.mjs [--dry|--publish]
 */

import { createClient } from "@sanity/client";
import { randomBytes } from "node:crypto";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error("SANITY_PROJECT_ID manquant");
if (!token) throw new Error("SANITY_WRITE_TOKEN manquant (rôle Editor minimum)");

const DRY = process.argv.includes("--dry");
const PUBLISH = process.argv.includes("--publish");

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });
const k = () => randomBytes(6).toString("hex");
const withKey = (arr) => arr.map((item) => ({ _key: k(), ...item }));

// ─────────────────────────────────────────────────────────────
// Questions du quiz — miroir de lib/quiz-defaults.ts
// ─────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    key: "productType",
    type: "single",
    question: "Quel produit recherchez-vous aujourd'hui ?",
    subtitle: "Choisissez pour démarrer votre parcours",
    options: [
      { value: "matelas", label: "Matelas", subtitle: "Le cœur de votre sommeil" },
      { value: "lit", label: "Lit", subtitle: "Cadre + coffre de rangement" },
      { value: "oreiller", label: "Oreiller", subtitle: "Soutien cervical" },
    ],
  },
  {
    key: "size",
    type: "single",
    question: "Quelle taille recherchez-vous ?",
    subtitle: "Choisissez le format adapté à votre chambre",
    options: [
      { value: "90x190", label: "90 × 190 cm", subtitle: "Une place" },
      { value: "90x200", label: "90 × 200 cm", subtitle: "Une place XL" },
      { value: "140x190", label: "140 × 190 cm", subtitle: "Deux places" },
      { value: "140x200", label: "140 × 200 cm", subtitle: "Deux places XL" },
      { value: "160x200", label: "160 × 200 cm", subtitle: "Queen size" },
      { value: "180x200", label: "180 × 200 cm", subtitle: "King size" },
    ],
  },
  {
    key: "sleepPosition",
    type: "single",
    question: "Dans quelle position dormez-vous principalement ?",
    subtitle: "Cela détermine 50 % du choix de fermeté",
    options: [
      { value: "dos", label: "Sur le dos", subtitle: "Mi-ferme recommandé" },
      { value: "cote", label: "Sur le côté", subtitle: "Moelleux à équilibré" },
      { value: "ventre", label: "Sur le ventre", subtitle: "Ferme conseillé" },
      { value: "variable", label: "Ça change chaque nuit", subtitle: "Équilibré convient" },
    ],
  },
  {
    key: "weight",
    type: "single",
    question: "Quel est votre gabarit ?",
    subtitle: "Plus vous êtes lourd·e, plus le soutien doit être ferme",
    options: [
      { value: "leger", label: "Léger", subtitle: "Moins de 70 kg" },
      { value: "moyen", label: "Moyen", subtitle: "70 – 90 kg" },
      { value: "fort", label: "Fort", subtitle: "Plus de 90 kg" },
    ],
  },
  {
    key: "priorities",
    type: "multi",
    question: "Qu'est-ce qui compte le plus pour vous ?",
    subtitle: "Cochez tout ce qui s'applique (1 à 4 réponses)",
    options: [
      { value: "thermique", label: "Régulation température", subtitle: "Nuits fraîches" },
      { value: "soutien", label: "Soutien lombaire", subtitle: "Dos préservé" },
      { value: "enveloppant", label: "Accueil enveloppant", subtitle: "Cocooning" },
      { value: "silence", label: "Indépendance de couchage", subtitle: "L'autre bouge, vous dormez" },
      { value: "eco", label: "Matières éco-responsables", subtitle: "OEKO-TEX, Europe" },
    ],
  },
  {
    key: "firmnessPreference",
    type: "single",
    question: "Quel niveau de fermeté préférez-vous ?",
    subtitle: "Si vous n'êtes pas sûr·e, laissez-nous choisir",
    options: [
      { value: "moelleux", label: "Moelleux", subtitle: "On s'enfonce dedans" },
      { value: "equilibre", label: "Équilibré", subtitle: "Ni trop mou, ni trop ferme" },
      { value: "ferme", label: "Ferme", subtitle: "Soutien tonique" },
      { value: "sans-preference", label: "Sans préférence", subtitle: "À vous de me guider" },
    ],
  },
  {
    key: "budget",
    type: "slider",
    question: "Quel est votre budget ?",
    subtitle: "Faites glisser pour ajuster votre fourchette",
    min: 200,
    max: 2500,
    step: 50,
  },
];

// ─────────────────────────────────────────────────────────────
// Contenu SEO éditorial
// ─────────────────────────────────────────────────────────────

const METHOD_STEPS = [
  { icon: "🎯", title: "Position + gabarit", text: "Ce sont les 2 leviers qui déterminent la fermeté idéale. Un dormeur sur le côté a besoin d'un accueil plus moelleux qu'un dormeur sur le ventre — la colonne vertébrale l'exige." },
  { icon: "🌡️", title: "Vos priorités", text: "Régulation thermique, silence, soutien : chaque priorité oriente vers une technologie précise (ressorts ensachés pour la fraîcheur, mémoire pour l'enveloppement)." },
  { icon: "💰", title: "Budget honnête", text: "On ne vous poussera pas au modèle le plus cher. L'algorithme reste dans votre fourchette et privilégie le meilleur rapport confort/prix." },
  { icon: "🧪", title: "Croisement algorithmique", text: "Chaque matelas du catalogue est noté sur 100 points contre vos réponses. Le mieux placé vous est proposé, avec 2 alternatives si vous voulez comparer." },
];

const CRITERIA_ITEMS = [
  { icon: "🧍", title: "Position de sommeil", text: "80 % des Français dorment principalement sur le côté (INSV 2024). Cette position demande un accueil moelleux à équilibré pour combler la courbure épaule-hanche. À l'opposé, le sommeil sur le ventre exige une fermeté tonique pour éviter la cambrure lombaire.", source: "Institut National du Sommeil et de la Vigilance" },
  { icon: "⚖️", title: "Gabarit et morphologie", text: "Un dormeur de moins de 70 kg s'enfoncera trop dans un matelas ferme et perdra le bénéfice du soutien. Au-delà de 90 kg, un accueil mi-ferme s'affaisse en 6 mois. Le bon matelas doit compenser votre densité corporelle." },
  { icon: "🌡️", title: "Régulation thermique", text: "La température idéale de la chambre pour dormir est de 16-18 °C (INSERM). Un matelas mousse à haute densité peut retenir la chaleur. Les technologies à ressorts ensachés ou à cellules ouvertes évacuent l'humidité corporelle (30 cl par nuit) et gardent une surface fraîche.", source: "INSERM — Le sommeil et sa thermorégulation" },
  { icon: "🤝", title: "Indépendance de couchage", text: "Pour un couple, l'indépendance de couchage détermine si vous serez réveillé·e à chaque changement de position de l'autre. Les ressorts ensachés (chaque ressort dans sa poche indépendante) sont imbattables sur ce critère." },
  { icon: "⏳", title: "Durée de vie réelle", text: "Un matelas dure 7 à 10 ans en usage quotidien. La mousse polyuréthane basique tient 5 ans max avant de s'affaisser. Un modèle hybride (mousse + ressorts) atteint 12-15 ans avec un entretien correct. C'est un investissement à amortir sur le long terme." },
];

const PITFALLS_ITEMS = [
  { title: "Se baser sur le prix seul", text: "Un matelas à 199 € semble une affaire — jusqu'au 6ᵉ mois où il s'affaisse. Le rapport qualité/prix se calcule sur 10 ans : un modèle à 700 € qui dure 10 ans coûte 70 €/an, contre 40 €/an pour le prétendu bon plan qui dure 5 ans. Mais avec 2× plus de douleurs dorsales." },
  { title: "Suivre les avis en ligne aveuglément", text: "Un matelas qui a 4,8/5 sur 3 000 avis peut être terrible pour VOUS s'il est ferme et que vous êtes léger·e. Les avis reflètent la moyenne — votre corps est unique. Fiez-vous à l'essai (30 nuits obligatoires chez DreamsFly)." },
  { title: "Négliger le sommier", text: "Un vieux sommier avec lattes cassées ruine un matelas neuf en 3 mois — et annule la garantie. Si votre sommier a plus de 10 ans, changez les deux ensemble. Nos packs matelas+sommier reviennent moins chers que l'achat séparé." },
];

const FAQ_ITEMS = [
  { question: "Combien de temps prend le quiz ?", answer: "60 à 90 secondes en moyenne. Les 6 questions sont pensées pour être répondues rapidement, sans se casser la tête." },
  { question: "Le résultat est-il vraiment personnalisé ?", answer: "Oui. L'algorithme note chaque matelas sur 100 points contre vos 6 réponses (fermeté, position, gabarit, priorités, préférence, budget). Le mieux noté vous est proposé, avec 2 alternatives." },
  { question: "Puis-je refaire le quiz ?", answer: "Autant de fois que vous voulez. Vous pouvez aussi modifier une réponse en cours de route grâce au bouton Retour." },
  { question: "Que se passe-t-il si je n'aime pas la recommandation ?", answer: "Deux options : (1) essayer une des 2 alternatives proposées, (2) commander avec les 30 nuits d'essai — si le matelas ne vous convient pas, reprise gratuite et remboursement intégral." },
  { question: "Pourquoi demander mon budget ?", answer: "Pour éviter de vous frustrer avec un matelas hors de votre portée. L'algorithme reste dans votre fourchette et propose le meilleur produit à ce niveau de prix." },
  { question: "Un matelas moelleux ou ferme, lequel est meilleur pour le dos ?", answer: "Aucun n'est intrinsèquement meilleur — dépend de votre position et poids. Recherches récentes (Journal of Chiropractic Medicine) : un matelas mi-ferme réduit les douleurs lombaires chroniques dans 74 % des cas. Le très mou et le très ferme sont les 2 extrêmes à éviter." },
  { question: "Comment savoir si j'ai un mauvais matelas ?", answer: "3 signes : (1) vous vous réveillez avec des douleurs qui disparaissent en journée, (2) vous voyez une empreinte visible en vous levant, (3) vous dormez mieux à l'hôtel ou chez des amis. Deux sur trois = temps de changer." },
  { question: "Mémoire de forme ou ressorts ensachés ?", answer: "Mémoire de forme = enveloppant, absorbe les points de pression, idéal pour douleurs articulaires. Ressorts ensachés = tonique, respirant, meilleure indépendance de couchage. Hybride = combine les deux pour la plupart des profils." },
  { question: "Quelle taille pour un couple ?", answer: "160×200 est le meilleur compromis (chacun 80 cm, matelas de qualité, chambre 12 m² minimum). 180×200 si l'un de vous bouge beaucoup ou si vous avez la chambre. 140×190 est court pour deux adultes de + 1,75 m." },
  { question: "Faut-il changer de matelas tous les 10 ans ?", answer: "C'est la moyenne. Certains matelas premium tiennent 15 ans, d'autres modèles bas de gamme s'affaissent à 5 ans. Test : si votre matelas a plus de 10 ans ET que vous avez des douleurs matinales, c'est le moment." },
  { question: "Le quiz gère-t-il aussi les lits et oreillers ?", answer: "Oui — la 1re question vous demande le produit (matelas, lit ou oreiller). Le parcours s'adapte ensuite aux critères pertinents pour ce type de produit." },
  { question: "Puis-je acheter directement après le quiz ?", answer: "Oui — bouton Acheter directement sur la page résultat. Livraison offerte dès 999 € d'achat, paiement en 4× sans frais avec Alma, 30 nuits d'essai." },
];

// ─────────────────────────────────────────────────────────────
// Prépare le doc complet
// ─────────────────────────────────────────────────────────────

function prepareQuestions() {
  return QUESTIONS.map((q) => {
    const base = { _key: k(), key: q.key, type: q.type, question: q.question, subtitle: q.subtitle };
    if (q.type === "slider") return { ...base, min: q.min, max: q.max, step: q.step };
    return { ...base, options: withKey(q.options) };
  });
}

function isEmpty(v) {
  if (v === undefined || v === null) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.keys(v).length === 0;
  if (typeof v === "string") return v.trim() === "";
  return false;
}

async function main() {
  console.log(`\n▶ Populate quizPage — ${DRY ? "DRY RUN" : PUBLISH ? "PUBLISH direct" : "DRAFT"}\n`);

  const docId = "quizPage";
  const targetId = PUBLISH ? docId : `drafts.${docId}`;

  // On récupère les 2 versions (publiée + draft) pour connaître l'état actuel
  const [published, draft] = await Promise.all([
    client.getDocument(docId).catch(() => null),
    client.getDocument(`drafts.${docId}`).catch(() => null),
  ]);
  const existing = draft || published;

  const desired = {
    _type: "quizPage",
    heroEyebrow: "Aide au choix personnalisée",
    heroTitle: "Quel matelas choisir ? Le quiz DreamsFly",
    heroSubtitle:
      "6 années à conseiller des dormeurs nous ont appris une chose : le bon matelas dépend de votre corps, pas d'un top 10. Ce quiz vous guide en 60 secondes vers le modèle qui correspond vraiment à votre profil de sommeil.",
    questions: prepareQuestions(),
    methodTitle: "Comment ce quiz vous oriente",
    methodSteps: withKey(METHOD_STEPS),
    criteriaTitle: "Les critères qui comptent vraiment",
    criteriaItems: withKey(CRITERIA_ITEMS),
    pitfallsTitle: "Erreurs qui coûtent cher",
    pitfallsItems: withKey(PITFALLS_ITEMS),
    faqTitle: "Vos questions sur le choix d'un matelas",
    faqItems: withKey(FAQ_ITEMS),
    metaTitle: "Quel matelas choisir ? Quiz personnalisé — DreamsFly",
    metaDescription:
      "Notre quiz en 60 secondes vous guide vers le matelas idéal selon votre position, gabarit, budget et priorités. Recommandation personnalisée, algorithme d'expert.",
  };

  const patch = {};

  if (!existing) {
    console.log("📄 Aucun doc existant → création complète.");
    if (DRY) {
      console.log("[DRY] Serait créé :", JSON.stringify(desired, null, 2).slice(0, 400), "...");
      return;
    }
    try {
      await client.createIfNotExists({ ...desired, _id: targetId });
      console.log(`\n✅ Doc quizPage créé (${PUBLISH ? "publié" : "brouillon"}).\n`);
      if (!PUBLISH) {
        console.log(`ℹ️  Va dans Sanity Studio → 🧭 Page Quiz → Publish.\n`);
      }
    } catch (err) {
      console.error("❌ Échec création :", err.message);
    }
    return;
  }

  console.log(`📄 Doc existant trouvé (${draft ? "draft" : "publié"}). Vérifie ce qui manque...`);

  for (const [field, value] of Object.entries(desired)) {
    if (field.startsWith("_")) continue;
    if (isEmpty(existing[field])) {
      patch[field] = value;
      const label = Array.isArray(value) ? `${value.length} items` : typeof value === "string" ? `${value.length} car.` : "objet";
      console.log(`  ✏️  ${field} — ${label}`);
    } else {
      console.log(`  ⏭️  ${field} déjà rempli — non touché`);
    }
  }

  if (Object.keys(patch).length === 0) {
    console.log(`\n✅ Rien à faire — tous les champs sont déjà remplis.\n`);
    return;
  }

  if (DRY) {
    console.log(`\n[DRY RUN] Aucune écriture effectuée.\n`);
    return;
  }

  try {
    if (!PUBLISH && !draft) {
      // Créer le draft à partir du published
      await client.createIfNotExists({ ...published, _id: `drafts.${docId}` });
    }
    await client.patch(targetId).set(patch).commit({ autoGenerateArrayKeys: true });
    console.log(`\n✅ Doc quizPage mis à jour (${PUBLISH ? "publié" : "brouillon"}).\n`);
    if (!PUBLISH) {
      console.log(`ℹ️  Va dans Sanity Studio → 🧭 Page Quiz → Publish.\n`);
    }
  } catch (err) {
    console.error("❌ Échec patch :", err.message);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
