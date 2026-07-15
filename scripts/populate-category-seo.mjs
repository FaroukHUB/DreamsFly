#!/usr/bin/env node
/**
 * Migration : pré-remplit les champs override SEO catégorie sur les
 * documents landingPage 'matelas' et 'lits' avec les défauts du code.
 *
 * Après ce script, tu peux modifier n'importe quel titre / phrase / chiffre
 * directement dans Sanity Studio sans avoir besoin de tout recopier.
 *
 * IDEMPOTENT — ne touche que les champs vides. Rerun safe.
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj \
 *   SANITY_WRITE_TOKEN=sk... \
 *   node scripts/populate-category-seo.mjs [--dry|--publish]
 *
 * Sans option → écrit en brouillon (draft). Publish à faire à la main
 * dans Sanity Studio ou relance avec --publish.
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

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const k = () => randomBytes(6).toString("hex");
const withKeys = (arr) => arr.map((item) => ({ _key: k(), ...item }));

// ─────────────────────────────────────────────────────────────
// Contenu par catégorie (miroir de lib/category-defaults.ts)
// ─────────────────────────────────────────────────────────────

const CATEGORY_DATA = {
  matelas: {
    categoryAdvantagesOverride: [
      { icon: "🌙", title: "Confort premium", text: "Accueils moelleux à fermes — un modèle pour chaque profil de sommeil." },
      { icon: "🦴", title: "Soutien lombaire", text: "7 zones de confort différenciées pour aligner la colonne." },
      { icon: "🤝", title: "Indépendance de couchage", text: "L'autre bouge, vous dormez. Silence absolu." },
      { icon: "🌬️", title: "Régulation thermique", text: "Mousses aérées et housses respirantes — nuit fraîche." },
      { icon: "🛡️", title: "Certifiés OEKO-TEX", text: "Absence de substances nocives, sûr pour toute la famille." },
      { icon: "♾️", title: "Garantie 2 à 5 ans", text: "Défauts couverts + reprise gratuite en cas d'affaissement." },
    ],
    buyingCriteriaOverride: [
      { icon: "😴", label: "Votre position de sommeil", text: "Dos → mi-ferme. Côté → moelleux à mi-ferme. Ventre → ferme." },
      { icon: "⚖️", label: "Votre gabarit", text: "< 70 kg → mi-ferme. 70-90 kg → ferme. > 90 kg → très ferme." },
      { icon: "🌡️", label: "Votre sensibilité thermique", text: "Chaud la nuit → ressorts ensachés. Frileux → mousse mémoire." },
      { icon: "💑", label: "Vous dormez à deux ?", text: "Privilégier l'indépendance de couchage : ressorts ensachés." },
    ],
    categoryTipsOverride: [
      { icon: "🕐", title: "Remplacez tous les 10 ans max", text: "Au-delà, votre matelas perd 30 % de son soutien même s'il paraît intact. Un vieux matelas cause 2 fois plus de douleurs dorsales.", source: { label: "Institut national du sommeil (INSV)", url: "https://institut-sommeil-vigilance.org/" } },
      { icon: "🔄", title: "Retournez-le tous les 3 mois la 1re année", text: "Puis tous les 6 mois. Alternez tête-pied et face A / face B pour prolonger la durée de vie de 30 à 40 %.", source: { label: "Fédération française du sommeil" } },
      { icon: "🛡️", title: "Un protège-matelas est obligatoire", text: "40 € qui préservent 500 € de matelas. Lavable 60°C, il évite les taches (qui annulent la garantie) et bloque les acariens.", source: { label: "ANSES — Allergènes de l'habitat" } },
      { icon: "📅", title: "Comptez 21 nuits d'adaptation", text: "Votre dos a des habitudes. Un matelas neuf, même parfait, demande 3 semaines pour être « lu » par votre corps.", source: { label: "Recommandation des ostéopathes (SFDO)" } },
    ],
    categoryCareStepsOverride: [
      { icon: "🌅", frequency: "Chaque jour", title: "Aérez", text: "Rejetez la couette au pied + fenêtre ouverte 15-20 min." },
      { icon: "📅", frequency: "Chaque mois", title: "Aspirez", text: "Brosse douce sur les 2 faces et les coutures." },
      { icon: "🔄", frequency: "Tous les 3 mois", title: "Retournez", text: "Tête-pied la 1re fois, puis alternez face A / face B." },
      { icon: "🛡️", frequency: "En cas de tache", title: "Tamponnez", text: "Microfibre humide + savon de Marseille. Jamais de Javel." },
    ],
    categoryFaqOverride: [
      { question: "Comment choisir son matelas ?", answer: "Trois critères : position de sommeil (dos = mi-ferme, côté = moelleux, ventre = ferme), gabarit (< 70 kg mi-ferme, 70-90 kg ferme, > 90 kg très ferme), et sensibilité thermique (chaud → ressorts, frileux → mousse mémoire)." },
      { question: "Quelle taille de matelas choisir ?", answer: "90×190 pour une personne. 140×190 pour un couple qui privilégie l'espace vertical (chambres < 12 m²). 160×200 est le meilleur compromis couple. 180×200 pour l'espace king size ou les grandes tailles." },
      { question: "Quelle différence entre mousse et ressorts ?", answer: "La mousse (polyuréthane ou mémoire) enveloppe le corps et absorbe les points de pression. Les ressorts ensachés offrent un soutien plus tonique + une meilleure indépendance de couchage. Les hybrides combinent les deux." },
      { question: "Combien de temps dure un matelas ?", answer: "7 à 10 ans en usage quotidien. Au-delà, la mousse perd 30 % de son soutien même s'il semble intact. Un vieux matelas double le risque de douleurs dorsales." },
      { question: "Quel sommier utiliser avec un matelas neuf ?", answer: "Toujours neuf, adapté. Un vieux sommier avec lattes cassées ruine un matelas neuf en quelques mois — et annule la garantie. Lattes espacées pour la ventilation, tapissier pour un soutien dense." },
      { question: "Combien de temps pour être livré ?", answer: "5 à 7 jours ouvrés en France métropolitaine, gratuit dès 39 €. Rendez-vous par SMS 48 h avant, montée à l'étage incluse, reprise gratuite de l'ancien matelas sur demande." },
      { question: "Puis-je essayer et renvoyer si ça ne convient pas ?", answer: "30 nuits d'essai à domicile. Après 21 jours d'adaptation, si le matelas ne vous convient pas, reprise gratuite et remboursement intégral — sans conditions." },
      { question: "Quelle est la garantie ?", answer: "2 ans minimum sur tous nos matelas (défaut de fabrication, affaissement > 3 cm). Certains modèles premium : 5 ans. Ne couvre pas l'usure normale ni les taches." },
      { question: "Les matelas sont-ils hypoallergéniques ?", answer: "Traitement anti-acariens en usine, housses certifiées OEKO-TEX Standard 100. Pour les allergies sévères, ajoutez une alèse imperméable." },
      { question: "Comment entretenir mon matelas ?", answer: "Aérez chaque matin, aspirez tous les mois, retournez tous les 3 mois. Une housse de protection lavable à 60°C prolonge sa vie de plusieurs années." },
      { question: "Quel poids maximum le matelas supporte-t-il ?", answer: "Nos matelas standard supportent 130 kg par personne. Au-delà, privilégiez nos modèles ferme ou très ferme (mousse HR + ressorts) au maintien renforcé." },
      { question: "Peut-on plier un matelas pour le déplacer ?", answer: "Un matelas mousse peut être plié en 3 sur 24 h max. Les ressorts ensachés ne se plient jamais — ils se déforment définitivement. Préférez un déménagement à plat." },
    ],
    categoryComparisonOverride: {
      columns: ["Mousse polyuréthane", "Mémoire de forme", "Ressorts ensachés", "Hybride"],
      recommendedIndex: 3,
      rows: [
        { criterion: "Confort général", values: ["Basique", "Enveloppant", "Tonique", "Équilibré"] },
        { criterion: "Soutien lombaire", values: ["Standard", "Excellent", "Très bon", "Excellent"] },
        { criterion: "Indépendance de couchage", values: ["Faible", "Bonne", "Excellente", "Excellente"] },
        { criterion: "Régulation thermique", values: ["Moyenne", "Chaude", "Fraîche", "Fraîche"] },
        { criterion: "Durée de vie", values: ["5-7 ans", "8-10 ans", "8-10 ans", "10 ans+"] },
        { criterion: "Prix moyen", values: ["dès 199 €", "dès 399 €", "dès 499 €", "dès 599 €"] },
        { criterion: "Idéal pour", values: ["Petit budget", "Douleurs dorsales", "Couples, chaleur", "Tous profils"] },
      ],
    },
  },
  lit: {
    categoryAdvantagesOverride: [
      { icon: "📦", title: "Rangement optimisé", text: "Coffres 300 à 500 L — l'équivalent d'une commode entière." },
      { icon: "🛠️", title: "Vérins fiables", text: "Testés 15 000 cycles, ouverture d'une main." },
      { icon: "🎨", title: "Matières premium", text: "Velours, tissu tramé, capitonné — pour chaque style." },
      { icon: "🇪🇺", title: "Fabriqués en Europe", text: "Ateliers certifiés, matériaux traçables, bois FSC." },
      { icon: "🚚", title: "Livraison à l'étage", text: "Deux livreurs incluent le portage jusqu'à votre chambre." },
      { icon: "🔧", title: "Montage rapide", text: "45 min à deux, tournevis fourni, notice claire." },
    ],
    buyingCriteriaOverride: [
      { icon: "📏", label: "L'espace disponible", text: "Prévoyez 60 cm devant pour l'ouverture du coffre frontal." },
      { icon: "🎨", label: "Le style de la chambre", text: "Velours → cocooning. Tissu tramé → sobre. Capitonné → classique." },
      { icon: "🛏️", label: "La taille du couchage", text: "140×190 couple standard, 160×200 confort, 180×200 king." },
      { icon: "📦", label: "Le besoin de rangement", text: "Coffre 300 L suffit pour 90×190, 500 L pour 160×200+." },
    ],
    categoryTipsOverride: [
      { icon: "📏", title: "Mesurez avant de commander", text: "60 cm minimum devant le lit pour ouvrir le coffre frontal. Vérifiez portes et escaliers pour l'accessibilité de la livraison.", source: { label: "Guide de l'ameublement français (UNIFA)" } },
      { icon: "🛏️", title: "Choisissez un matelas adapté", text: "Épaisseur 18-30 cm, poids minimum 12 kg pour la stabilité à l'ouverture. Un matelas trop léger glisse sous les vérins.", source: { label: "Fabricants européens de literie (EBIA)" } },
      { icon: "🧹", title: "Aspirez le tissu toutes les 2 semaines", text: "Brosse douce. Pour une tache : chiffon microfibre humide, tamponnez sans frotter. Jamais de vapeur qui écrase les fibres.", source: { label: "Instructions Euratex" } },
      { icon: "🔧", title: "Contrôlez les vérins une fois par an", text: "L'ouverture devient dure ? Un vérin faiblit. Pièce standard à 30 €, remplacement en 15 min avec un tournevis.", source: { label: "AFNOR — mécanismes hydrauliques" } },
    ],
    categoryCareStepsOverride: [
      { icon: "🧹", frequency: "Toutes les 2 sem.", title: "Aspirez", text: "Brosse douce sur tête de lit et côtés." },
      { icon: "💧", frequency: "En cas de tache", title: "Nettoyez", text: "Chiffon microfibre humide, tamponnez sans frotter." },
      { icon: "🛠️", frequency: "Chaque année", title: "Contrôlez vérins", text: "Une goutte d'huile silicone sur les articulations." },
      { icon: "🚫", frequency: "À éviter", title: "Vapeur & Javel", text: "Écrase les fibres, laisse des auréoles définitives." },
    ],
    categoryFaqOverride: [
      { question: "Coffre frontal ou latéral, quelle différence ?", answer: "Frontal (par les pieds) est le plus courant, permet de ranger de grands objets. Latéral (par le côté) est utile quand le lit est contre un mur — se manœuvre depuis le côté accessible." },
      { question: "Quelle capacité de rangement offre un lit coffre ?", answer: "300 L pour 90×190, 400 L pour 140×190, 500 L pour 160×200 et plus. Soit l'équivalent d'une commode 4 tiroirs. Idéal pour couettes, linge de saison, valises." },
      { question: "Les vérins sont-ils fiables dans le temps ?", answer: "Nos vérins hydrauliques sont testés pour 15 000 cycles d'ouverture — soit 5 ouvertures par jour pendant 8 ans. Remplacement 30 € et 15 min si un jour ils faiblissent." },
      { question: "Peut-on utiliser n'importe quel matelas ?", answer: "Épaisseur 18-30 cm, poids minimum 12 kg pour la stabilité à l'ouverture. Un matelas trop léger glisse sous les vérins. Nos matelas DreamsFly sont tous compatibles." },
      { question: "Le montage est-il compliqué ?", answer: "45 minutes à deux personnes avec un tournevis cruciforme (fourni). Notice illustrée + vidéo de montage. Aide au montage à domicile en option (39 €)." },
      { question: "Comment entretenir le tissu ?", answer: "Aspirateur brosse douce toutes les 2 semaines. Taches : chiffon microfibre humide, tamponnez sans frotter. Éviter absolument le nettoyeur vapeur qui écrase les fibres." },
      { question: "Livraison à l'étage possible ?", answer: "Oui — 2 livreurs montent jusqu'à votre chambre quel que soit l'étage. Le lit arrive démonté en 3 colis pour faciliter les passages étroits (portes, escaliers)." },
      { question: "Quelle est la garantie ?", answer: "Structure : 5 ans. Vérins hydrauliques : 8 ans. Tissu : 2 ans. La garantie couvre les défauts de fabrication en usage normal." },
      { question: "Le lit est-il bruyant ?", answer: "Non — vérins hydrauliques modernes silencieux (< 30 dB). Une goutte d'huile silicone sur les articulations une fois par an suffit à garder le mécanisme feutré." },
      { question: "Puis-je démonter le lit pour un déménagement ?", answer: "Oui — démontable en 30 minutes, remontable à l'identique. Gardez la notice et la boîte de visserie d'origine." },
    ],
    categoryComparisonOverride: {
      columns: ["Velours", "Tissu tramé", "Lin", "Capitonné"],
      recommendedIndex: 0,
      rows: [
        { criterion: "Toucher", values: ["Doux, chaleureux", "Ferme, sobre", "Frais, naturel", "Structuré"] },
        { criterion: "Rendu visuel", values: ["Profond, cocooning", "Contemporain", "Scandinave", "Classique"] },
        { criterion: "Entretien", values: ["Aspirateur + brosse", "Facile", "Facile", "Aspirateur en creux"] },
        { criterion: "Tenue dans le temps", values: ["Excellent", "Excellent", "Bon", "Excellent"] },
        { criterion: "Prix moyen", values: ["dès 699 €", "dès 599 €", "dès 799 €", "dès 899 €"] },
        { criterion: "Style idéal", values: ["Boudoir, cosy", "Épuré", "Nature", "Hôtel, prestige"] },
      ],
    },
  },
};

// ─────────────────────────────────────────────────────────────
// Ajoute _key sur chaque item de chaque array
// ─────────────────────────────────────────────────────────────
function prepareData(data) {
  const prepared = {};
  for (const [field, value] of Object.entries(data)) {
    if (field === "categoryComparisonOverride") {
      prepared[field] = {
        columns: value.columns,
        recommendedIndex: value.recommendedIndex,
        rows: withKeys(value.rows.map((r) => ({ criterion: r.criterion, values: r.values }))),
      };
    } else if (Array.isArray(value)) {
      prepared[field] = withKeys(value);
    } else {
      prepared[field] = value;
    }
  }
  return prepared;
}

function isEmpty(v) {
  if (v === undefined || v === null) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.keys(v).length === 0;
  return false;
}

async function main() {
  console.log(`\n▶ Migration SEO catégorie — ${DRY ? "DRY RUN" : PUBLISH ? "PUBLISH direct" : "DRAFT"}\n`);

  for (const [slug, data] of Object.entries(CATEGORY_DATA)) {
    console.log(`\n📄 Page landingPage "${slug}"`);

    const doc = await client.fetch(
      `*[_type == "landingPage" && slug.current == $slug && !(_id in path("drafts.**"))][0]{
        _id,
        categoryAdvantagesOverride,
        buyingCriteriaOverride,
        categoryTipsOverride,
        categoryCareStepsOverride,
        categoryFaqOverride,
        categoryComparisonOverride
      }`,
      { slug }
    );

    if (!doc) {
      console.log(`  ⚠️  Aucun document landingPage avec slug="${slug}" — ignoré.`);
      continue;
    }

    const prepared = prepareData(data);
    const patch = {};

    for (const [field, value] of Object.entries(prepared)) {
      if (isEmpty(doc[field])) {
        patch[field] = value;
        const label = Array.isArray(value) ? `${value.length} items` : "objet";
        console.log(`    ✏️  ${field} → ${label}`);
      } else {
        console.log(`    ⏭️  ${field} déjà rempli — non touché`);
      }
    }

    if (Object.keys(patch).length === 0) {
      console.log(`  ✅ Rien à faire pour "${slug}".`);
      continue;
    }

    if (DRY) continue;

    const targetId = PUBLISH ? doc._id : `drafts.${doc._id}`;
    try {
      if (!PUBLISH) {
        const existing = await client.getDocument(targetId);
        if (!existing) {
          const published = await client.getDocument(doc._id);
          await client.createIfNotExists({ ...published, _id: targetId });
        }
      }
      await client.patch(targetId).set(patch).commit({ autoGenerateArrayKeys: true });
      console.log(`  ✅ Patché (${PUBLISH ? "publié" : "brouillon"}).`);
    } catch (err) {
      console.error(`  ❌ Échec : ${err.message}`);
    }
  }

  console.log(`\n✅ Terminé.\n`);
  if (!DRY && !PUBLISH) {
    console.log(`ℹ️  Modifications en DRAFT. Va dans Sanity Studio → Pages SEO → matelas/lits → Publish.\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
