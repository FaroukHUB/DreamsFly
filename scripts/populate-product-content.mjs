#!/usr/bin/env node
/**
 * Migration : peuple les champs éditoriaux vides de chaque produit
 * (highlights, advantages, audiences, tips, careSteps, productFaq,
 * extraCta, deliveryOverride, warrantyOverride) avec les défauts par type.
 *
 * IDEMPOTENT — ne touche que les champs vides. Rerun safe.
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj \
 *   SANITY_DATASET=production \
 *   SANITY_WRITE_TOKEN=skKxz... \
 *   node scripts/populate-product-content.mjs
 *
 * Ajoute --publish pour publier directement (sinon écrit en draft).
 * Ajoute --dry pour simuler sans écrire.
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

// ─────────────────────────────────────────────────────────────
// Défauts par productType (miroir de lib/product-defaults.ts)
// ─────────────────────────────────────────────────────────────

function defaultHighlights(pt, product) {
  const base = {
    matelas: [
      { icon: "🛡️", label: "Certifié OEKO-TEX Standard 100" },
      { icon: "🇪🇺", label: "Fabriqué en Europe" },
      { icon: "🛏️", label: "Housse déhoussable lavable" },
      { icon: "📦", label: "Livraison à domicile (99 €)" },
      { icon: "💳", label: "Paiement en 4× sans frais" },
    ],
    lit: [
      { icon: "📦", label: `Coffre ${product?.litCoffreCapacityL || "≈ 400"} L de rangement` },
      { icon: "🛠️", label: "Vérins hydrauliques 15 000 cycles" },
      { icon: "🇪🇺", label: "Fabriqué en Europe" },
      { icon: "🚚", label: "Livraison à l'étage (99 €)" },
      { icon: "💳", label: "Paiement en 4× sans frais" },
    ],
    sommier: [
      { icon: "🌳", label: "Bois massif européen" },
      { icon: "🦵", label: "Pieds fournis" },
      { icon: "🛏️", label: "Compatible tous matelas 15-30 cm" },
      { icon: "🛡️", label: "Garantie 2 ans" },
      { icon: "📦", label: "Livraison à domicile (99 €)" },
    ],
    oreiller: [
      { icon: "🧺", label: "Housse lavable en machine 40°C" },
      { icon: "🌿", label: "Traitement anti-acariens" },
      { icon: "🌙", label: "Soutien cervical optimal" },
      { icon: "🇪🇺", label: "Confection européenne" },
      { icon: "🚚", label: "Livraison sous 48h" },
    ],
    pack: [
      { icon: "💰", label: "Jusqu'à -25 % vs à l'unité" },
      { icon: "📦", label: "Livraison groupée unique" },
      { icon: "🛠️", label: "Compatibilité garantie" },
      { icon: "🇪🇺", label: "Fabrication européenne" },
    ],
  };
  return base[pt] || base.matelas;
}

function defaultAdvantages(pt) {
  const base = {
    matelas: [
      { icon: "🌙", title: "Confort", text: "Accueil moelleux qui épouse le corps sans effet enfoncé." },
      { icon: "🦴", title: "Soutien", text: "Alignement optimal de la colonne vertébrale." },
      { icon: "🌬️", title: "Respirabilité", text: "Circulation d'air constante — nuit fraîche." },
      { icon: "🤝", title: "Indépendance de couchage", text: "Aucune onde ressentie quand l'autre bouge." },
      { icon: "⏳", title: "Durabilité", text: "Matériaux testés pour 10 ans d'usage quotidien." },
      { icon: "🧺", title: "Entretien facile", text: "Housse déhoussable, traitement anti-acariens." },
    ],
    lit: [
      { icon: "📦", title: "Rangement", text: "Coffre spacieux pour couettes, valises, linge de saison." },
      { icon: "🛠️", title: "Ouverture sans effort", text: "Vérins hydrauliques : 1 geste, 1 seconde." },
      { icon: "🎨", title: "Design", text: "Tissu premium travaillé pour durer visuellement." },
      { icon: "🇪🇺", title: "Fabrication européenne", text: "Matériaux traçables, ateliers certifiés." },
      { icon: "🔇", title: "Silencieux", text: "Mécanisme feutré — pas de grincement." },
      { icon: "🛡️", title: "Solidité", text: "Structure conçue pour supporter 200 kg." },
    ],
    sommier: [
      { icon: "🌳", title: "Bois massif", text: "Structure robuste en pin ou hêtre européen." },
      { icon: "🌬️", title: "Ventilation", text: "Lattes espacées : aération naturelle du matelas." },
      { icon: "🛠️", title: "Montage rapide", text: "15 min sans outil, pieds à visser à la main." },
      { icon: "🛡️", title: "Garantie 2 ans", text: "Sur la structure et les lattes." },
    ],
    oreiller: [
      { icon: "🌙", title: "Soutien cervical", text: "Maintien optimal de la nuque et de la tête." },
      { icon: "🌬️", title: "Respirabilité", text: "Garniture qui régule la température." },
      { icon: "🧺", title: "Lavable", text: "Housse amovible, entretien machine." },
      { icon: "🌿", title: "Sain", text: "Traité anti-acariens et hypoallergénique." },
    ],
  };
  return base[pt] || [];
}

function defaultAudiences(pt, product) {
  const size = product?.variants?.[0]?.size || "";
  const isSmall = /^(70|80|90)/.test(size);
  const isCouple = /^(140|160|180|200)/.test(size);

  if (pt === "matelas") {
    if (isSmall) {
      return [
        { icon: "👤", title: "Adulte seul", text: "Idéal pour un couchage individuel principal ou secondaire." },
        { icon: "🎓", title: "Étudiant", text: "Confort adulte sans encombrer une petite chambre." },
        { icon: "🛌", title: "Chambre d'amis", text: "Un vrai matelas de qualité pour bien recevoir." },
        { icon: "🏡", title: "Résidence secondaire", text: "Robuste, sans entretien excessif entre deux séjours." },
      ];
    }
    if (isCouple) {
      return [
        { icon: "💑", title: "Couple", text: "Indépendance de couchage — l'un bouge, l'autre dort." },
        { icon: "🦴", title: "Personnes recherchant du soutien", text: "Maintien lombaire adapté à tous les gabarits." },
        { icon: "🌙", title: "Dormeurs sensibles", text: "Silencieux, respirant, régule la température." },
        { icon: "🏠", title: "Chambre parentale", text: "Investissement long terme pour 1/3 de votre vie." },
      ];
    }
    return [
      { icon: "👤", title: "Adulte", text: "Confort et soutien pour tous les gabarits." },
      { icon: "🛌", title: "Usage quotidien", text: "Conçu pour un couchage de tous les soirs." },
    ];
  }
  if (pt === "lit") {
    return [
      { icon: "🏙️", title: "Petites chambres urbaines", text: "Le coffre libère l'équivalent d'une commode 4 tiroirs." },
      { icon: "👨‍👩‍👧", title: "Familles avec enfants", text: "Coffre pour ranger les couettes de saison, jouets encombrants." },
      { icon: "🎨", title: "Amateurs de déco", text: "Pièce maîtresse de la chambre, plusieurs matières disponibles." },
      { icon: "🏡", title: "Chambre d'ami", text: "Rangement invisible pour un espace toujours net." },
    ];
  }
  if (pt === "sommier") {
    return [
      { icon: "🛏️", title: "Renouveler sa literie", text: "Sans changer le cadre de lit existant." },
      { icon: "🌬️", title: "Amateurs de literie ventilée", text: "Lattes espacées pour un matelas qui respire." },
      { icon: "💪", title: "Utilisateurs exigeants", text: "Structure robuste pour un soutien durable." },
    ];
  }
  if (pt === "oreiller") {
    return [
      { icon: "🦴", title: "Douleurs cervicales légères", text: "Soutien qui aligne la colonne cervicale." },
      { icon: "💤", title: "Dormeurs sur le côté", text: "Épaisseur adaptée pour combler l'épaule." },
      { icon: "🌿", title: "Personnes allergiques", text: "Traité anti-acariens, housse lavable." },
    ];
  }
  return [];
}

function defaultTips(pt) {
  if (pt === "matelas") return [
    { icon: "🔄", title: "Retournez-le tous les 3 mois", text: "Le premier retournement, faites-le tête-pied. Ensuite alternez face A / face B. Cette rotation prévient l'affaissement local et prolonge la durée de vie.", source: { label: "Institut national du sommeil (INSV)", url: "https://institut-sommeil-vigilance.org/" } },
    { icon: "🌬️", title: "Aérez 20 minutes chaque matin", text: "L'humidité corporelle produite chaque nuit (≈ 30 cl selon l'INSERM) doit s'évacuer, sinon acariens et moisissures s'installent.", source: { label: "INSERM — Le sommeil", url: "https://www.inserm.fr/dossier/sommeil/" } },
    { icon: "🛡️", title: "Investissez dans un protège-matelas", text: "Il capte transpiration et taches, se lave à 60°C — indispensable pour garder la garantie active.", source: { label: "ANSES — Allergènes de l'habitat" } },
    { icon: "📅", title: "21 nuits d'adaptation minimum", text: "Votre dos a des habitudes profondes. Un matelas neuf, même parfait, demande 3 semaines pour être « lu » par votre corps.", source: { label: "Recommandation professionnelle des ostéopathes (SFDO)" } },
  ];
  if (pt === "lit") return [
    { icon: "📏", title: "Mesurez avant de commander", text: "60 cm minimum devant le lit pour ouvrir le coffre frontal. Vérifiez aussi la largeur des portes et cages d'escalier.", source: { label: "Guide de l'ameublement français (UNIFA)" } },
    { icon: "🛏️", title: "Choisissez un matelas adapté", text: "Épaisseur 18-30 cm, poids minimum 12 kg pour la stabilité à l'ouverture.", source: { label: "Fabricants européens de literie (EBIA)" } },
    { icon: "🧹", title: "Entretien du tissu", text: "Aspirateur brosse douce toutes les 2 semaines. Pour une tache : chiffon microfibre légèrement humide, tapoter sans frotter.", source: { label: "Instructions des tisserands européens (Euratex)" } },
    { icon: "🔧", title: "Contrôle des vérins une fois par an", text: "L'ouverture devient dure ? Un vérin faiblit. Remplacement 30 €, 15 min.", source: { label: "Fiche technique des mécanismes hydrauliques (AFNOR)" } },
  ];
  if (pt === "sommier") return [
    { icon: "🔍", title: "Vérifiez la compatibilité matelas", text: "Lattes apparentes → matelas > 15 cm. Latex / mémoire de forme fine → préférez un tapissier plus dense.", source: { label: "Fédération française de l'ameublement (UNIFA)" } },
    { icon: "🦵", title: "Hauteur idéale : 55 à 65 cm", text: "Pour les seniors ou PMR, passez à des pieds de 25 cm.", source: { label: "Recommandations d'aménagement PMR (CRIDIAP)" } },
    { icon: "🌬️", title: "Laissez respirer sous le sommier", text: "Un plateau plein retient l'humidité. Un sommier à lattes ou pieds hauts est indispensable.", source: { label: "ANSES — Humidité et habitat" } },
  ];
  if (pt === "oreiller") return [
    { icon: "😴", title: "Choisissez selon votre position", text: "Dos → oreiller fin/moyen (10-12 cm). Côté → épais/ferme (14-16 cm). Ventre → très fin (5-8 cm).", source: { label: "Recommandations ostéopathiques (SFDO)" } },
    { icon: "🧺", title: "Lavez la housse tous les 2 mois", text: "40°C, essorage doux. La garniture ne se lave pas mais peut être aérée au soleil.", source: { label: "Protocole d'entretien du linge (ADEME)" } },
    { icon: "🔄", title: "Remplacez tous les 2-3 ans", text: "Test simple : plié en deux, un bon oreiller reprend sa forme en < 3 secondes.", source: { label: "Institut national du sommeil (INSV)" } },
  ];
  return [];
}

function defaultCareSteps(pt) {
  if (pt === "matelas") return [
    { icon: "🌅", frequency: "Chaque jour", title: "Aérez", text: "Rejetez la couette au pied du lit + fenêtre ouverte 15-20 min." },
    { icon: "📅", frequency: "Chaque mois", title: "Aspirez", text: "Embout brosse douce sur les 2 faces + les coutures." },
    { icon: "🔄", frequency: "Tous les 3 mois", title: "Retournez", text: "Tête-pied la 1re fois, puis alternez face A / face B." },
    { icon: "🛡️", frequency: "En cas de tache", title: "Tamponnez", text: "Microfibre humide + savon de Marseille. Jamais de Javel." },
  ];
  if (pt === "lit") return [
    { icon: "🧹", frequency: "Toutes les 2 sem.", title: "Aspirez le tissu", text: "Brosse douce sur la tête de lit et les côtés." },
    { icon: "💧", frequency: "En cas de tache", title: "Nettoyez localement", text: "Chiffon microfibre humide, tamponnez sans frotter." },
    { icon: "🛠️", frequency: "Chaque année", title: "Contrôlez les vérins", text: "Une goutte d'huile silicone sur les articulations." },
    { icon: "🚫", frequency: "À éviter", title: "Vapeur & produits", text: "Écrase les fibres, laisse des auréoles définitives." },
  ];
  if (pt === "sommier") return [
    { icon: "🌬️", frequency: "Chaque mois", title: "Aérez le sommier", text: "Retirez le matelas 2-3h, fenêtre ouverte." },
    { icon: "🧹", frequency: "Tous les 3 mois", title: "Aspirez", text: "Tissu et entre les lattes." },
    { icon: "🔩", frequency: "Chaque année", title: "Serrez les vis", text: "Vérifiez l'état des lattes — remplacez si fissurée." },
  ];
  if (pt === "oreiller") return [
    { icon: "🧺", frequency: "Tous les 2 mois", title: "Lavez la housse", text: "40°C, essorage doux, séchage à l'air libre." },
    { icon: "☀️", frequency: "Chaque mois", title: "Aérez la garniture", text: "2h au soleil ou 30 min au congélateur (anti-acariens)." },
    { icon: "🔄", frequency: "Tous les 2-3 ans", title: "Remplacez", text: "Test : plié en 2, il doit reprendre sa forme < 3s." },
  ];
  return [];
}

function defaultFaq(pt, product) {
  const name = product?.name || "ce produit";
  const size = product?.variants?.[0]?.size || "";
  if (pt === "matelas") return [
    { question: `Comment choisir un matelas${size ? ` ${size}` : ""} ?`, answer: `Trois critères : votre position de sommeil (dos, côté, ventre), votre gabarit (< 70 kg → mi-ferme ; 70-90 kg → ferme ; > 90 kg → très ferme), et votre sensibilité à la température. ${name} a été sélectionné pour un usage adulte quotidien.` },
    { question: `À qui convient ${name} ?`, answer: `Ce matelas s'adresse aux adultes recherchant un couchage principal ou secondaire de qualité, adapté à un usage quotidien.` },
    { question: "Quelle différence entre mousse et ressorts ensachés ?", answer: "La mousse enveloppe le corps et absorbe les points de pression. Les ressorts ensachés offrent un soutien plus tonique et une meilleure indépendance de couchage." },
    { question: "Combien de temps dure un matelas ?", answer: "Un matelas de qualité dure 7 à 10 ans en usage quotidien. Au-delà, la mousse perd 30% de son soutien." },
    { question: "Quel sommier utiliser ?", answer: "Sommier à lattes apparentes pour la ventilation, tapissier pour un soutien plus dense. Évitez les vieux sommiers avec lattes cassées." },
    { question: `${name} convient-il à un usage quotidien ?`, answer: `Oui — tous nos matelas sont conçus pour un couchage principal, testés pour 8+ heures d'usage par nuit sur 10 ans minimum.` },
    { question: "Comment entretenir mon matelas ?", answer: "Aérez chaque matin, aspirez tous les mois, retournez tous les 3 mois. Une housse de protection lavable à 60°C prolonge sa vie de plusieurs années." },
    { question: "Comment se déroule la livraison ?", answer: "Livraison sous 5-7 jours ouvrés en France métropolitaine, frais de port forfaitaires affichés au panier. Rendez-vous par SMS 48h avant, montée à l'étage incluse, reprise gratuite sur demande." },
    { question: "Puis-je essayer le matelas avant d'acheter ?", answer: "Oui, en showroom : nos boutiques présentent les modèles et un conseiller vous oriente selon votre morphologie et votre position de sommeil. Pour une commande en ligne, vous disposez du droit de rétractation légal de 14 jours (article L221-18 du Code de la consommation), le produit devant être retourné complet et dans son emballage d'origine." },
    { question: "Quelle est la garantie ?", answer: "Garantie DreamsFly 2 ans, couvrant les défauts de fabrication. Elle ne couvre pas l'usure normale ni les taches, et s'ajoute aux garanties légales de conformité et des vices cachés." },
    { question: `Le matelas ${name} est-il hypoallergénique ?`, answer: "Nos matelas sont traités anti-acariens en usine et les housses sont certifiées OEKO-TEX Standard 100." },
    { question: "Quel poids maximum le matelas supporte-t-il ?", answer: "Nos matelas standard supportent 130 kg par personne. Au-delà, privilégiez nos modèles ferme ou très ferme." },
  ];
  if (pt === "lit") return [
    { question: `Le montage de ${name} est-il compliqué ?`, answer: "Non — 45 minutes à deux personnes avec un tournevis cruciforme (fourni). Notice illustrée, vidéo de montage sur notre site." },
    { question: "Quelle capacité de rangement offre le coffre ?", answer: `${product?.litCoffreCapacityL ? `${product.litCoffreCapacityL} litres — ` : "Environ 400 litres — "}soit l'équivalent de 4 tiroirs de commode.` },
    { question: "Les vérins sont-ils fiables dans le temps ?", answer: "Testés pour 15 000 cycles d'ouverture. En cas de faiblesse, remplacement 30 € et 15 minutes." },
    { question: "Peut-on utiliser n'importe quel matelas ?", answer: "Épaisseur 18-30 cm, poids minimum 12 kg pour la stabilité. Tous nos matelas DreamsFly sont compatibles." },
    { question: "Ouverture frontale ou latérale, quelle différence ?", answer: "Frontale : le plus courant, permet de ranger de grands objets. Latérale : utile quand le lit est contre un mur." },
    { question: "Comment entretenir le tissu ?", answer: "Aspirateur brosse douce toutes les 2 semaines. Taches : chiffon microfibre humide. Éviter le nettoyeur vapeur." },
    { question: "Le lit est-il bruyant à l'ouverture ?", answer: "Non — vérins hydrauliques silencieux (< 30 dB). Une goutte d'huile silicone une fois par an." },
    { question: "Livraison au 4e étage sans ascenseur, possible ?", answer: "Oui, montée à l'étage incluse. Le lit arrive démonté en 3 colis." },
    { question: "Combien de temps pour la livraison ?", answer: "5-7 jours ouvrés en France métropolitaine, rendez-vous par SMS 48h avant." },
    { question: "Quelle est la garantie ?", answer: "Structure : 5 ans. Vérins : 8 ans. Tissu : 2 ans." },
    { question: "Tête de lit et sommier inclus ?", answer: `${product?.litIncludes?.headboard ? "Tête de lit incluse. " : ""}${product?.litIncludes?.sommier ? "Sommier inclus. " : ""}Voir la fiche technique pour la composition exacte.` },
    { question: "Peut-on démonter le lit pour un déménagement ?", answer: "Oui — démontable en 30 minutes, remontable à l'identique." },
  ];
  if (pt === "sommier") return [
    { question: `${name} est-il compatible avec tous les matelas ?`, answer: "Oui, avec les matelas de 15 à 30 cm d'épaisseur." },
    { question: "Le sommier est-il facile à monter ?", answer: "Montage en 15 minutes à une personne, sans outil." },
    { question: "Quelle est la garantie ?", answer: "2 ans sur la structure et les lattes." },
    { question: "Les pieds sont-ils inclus ?", answer: "Oui — 4 pieds cylindriques en bois massif (15 cm par défaut)." },
    { question: "Comment choisir la hauteur des pieds ?", answer: "Standard (15 cm) → 55-60 cm. Hauts (25 cm) → 65-70 cm, plus facile pour seniors et PMR." },
    { question: "Le sommier est-il livré monté ?", answer: "Livré à plat pour faciliter la montée à l'étage. Assemblage en 15 min à domicile." },
    { question: "Quel entretien ?", answer: "Aspirateur tous les 3 mois entre les lattes. Vérifiez le serrage des vis une fois par an." },
    { question: "Combien de temps pour la livraison ?", answer: "5-7 jours ouvrés en France métropolitaine." },
  ];
  if (pt === "oreiller") return [
    { question: "Puis-je laver l'oreiller en machine ?", answer: "La housse est amovible et lavable à 40°C. La garniture peut être aérée au soleil." },
    { question: `Combien de temps pour s'habituer à ${name} ?`, answer: "5 à 7 nuits d'adaptation." },
    { question: "Quelle hauteur choisir selon ma position ?", answer: "Dos : 10-12 cm. Côté : 14-16 cm. Ventre : 5-8 cm." },
    { question: "L'oreiller convient-il aux allergiques ?", answer: "Traitement anti-acariens et housse OEKO-TEX." },
    { question: "Combien de temps dure un oreiller ?", answer: "2 à 3 ans pour un usage quotidien." },
    { question: "Quel oreiller pour douleurs cervicales ?", answer: "Un oreiller ergonomique qui épouse la nuque sans la cambrer." },
    { question: "Comment se déroule la livraison ?", answer: "48h en France métropolitaine, frais de port forfaitaires affichés au panier." },
    { question: "Quelle est la garantie ?", answer: "2 ans sur la garniture et la housse." },
  ];
  return [];
}

function defaultExtraCta(pt) {
  const map = {
    matelas: { title: "Pas sûr du bon matelas pour vous ?", subtitle: "3 questions, 60 secondes, une reco personnalisée par nos experts.", ctaLabel: "Faire le quiz matelas", ctaLink: "/quiz" },
    lit: { title: "Envie de le voir en vrai avant de commander ?", subtitle: "Prenez rendez-vous dans l'un de nos 3 showrooms — sans engagement.", ctaLabel: "Trouver un showroom", ctaLink: "/magasins" },
    sommier: { title: "Besoin d'un pack sommier + matelas ?", subtitle: "Économisez jusqu'à 20 % en commandant les deux ensemble.", ctaLabel: "Voir nos packs", ctaLink: "/packs" },
    oreiller: { title: "Un doute sur le bon oreiller ?", subtitle: "Notre équipe vous conseille par téléphone selon votre position de sommeil.", ctaLabel: "Nous contacter", ctaLink: "/aide/contact" },
  };
  return map[pt] || null;
}

function defaultDelivery() {
  return {
    price: "Frais de port forfaitaires — affichés au panier",
    delay: "5 à 7 jours ouvrés en France métropolitaine",
    perks: [
      "Rendez-vous programmé par SMS 48h avant",
      "Montée à l'étage incluse (2 livreurs)",
      "Reprise gratuite de votre ancien produit sur demande",
      "Créneaux matin, après-midi ou samedi selon zones",
    ],
  };
}

function defaultWarranty(pt, product) {
  const years = product?.features?.garantieAns;
  if (pt === "matelas") return {
    duration: years ? `${years} ans` : "2 ans",
    covers: ["Défaut de fabrication (couture, mousse, coutil)", "Affaissement anormal supérieur à 3 cm", "Casse de ressort en usage normal"],
    excludes: ["Usure normale du tissu", "Taches, brûlures, morsures d'animaux", "Utilisation sur un sommier non compatible"],
  };
  if (pt === "lit") return {
    duration: "5 ans structure · 8 ans vérins · 2 ans tissu",
    covers: ["Rupture de vérins en usage normal", "Casse de la structure porteuse", "Défaut de fabrication du tissu"],
    excludes: ["Usure normale du tissu", "Détérioration par animaux", "Dépassement du poids maximum"],
  };
  if (pt === "sommier") return {
    duration: "2 ans",
    covers: ["Casse de lattes en usage normal", "Rupture de la structure"],
    excludes: ["Usure normale", "Utilisation dépassant le poids maximum"],
  };
  if (pt === "oreiller") return {
    duration: "2 ans",
    covers: ["Perte anormale de gonflant", "Défaut de couture ou fermeture éclair"],
    excludes: ["Usure normale (à remplacer tous les 2-3 ans)"],
  };
  return { duration: "2 ans", covers: [], excludes: [] };
}

// ─────────────────────────────────────────────────────────────
// Utilitaires
// ─────────────────────────────────────────────────────────────
const withKey = (arr) => arr.map((item) => ({ _key: k(), ...item }));

function isEmpty(v) {
  if (v === undefined || v === null) return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === "object") return Object.keys(v).length === 0;
  if (typeof v === "string") return v.trim() === "";
  return false;
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n▶ Migration contenu produit — ${DRY ? "DRY RUN (aucune écriture)" : PUBLISH ? "PUBLISH direct" : "DRAFT"}\n`);

  const products = await client.fetch(
    `*[_type == "product" && !(_id in path("drafts.**"))]{
      _id, name, title, productType,
      highlights, advantages, audiences, tips, careSteps, productFaq, extraCta,
      deliveryOverride, warrantyOverride,
      variants[]{size},
      litCoffreCapacityL, litIncludes,
      features
    }`
  );

  console.log(`${products.length} produits trouvés.\n`);

  let touched = 0;
  let skipped = 0;

  for (const p of products) {
    const pt = p.productType || "matelas";
    const patch = {};

    if (isEmpty(p.highlights)) patch.highlights = withKey(defaultHighlights(pt, p));
    if (isEmpty(p.advantages)) patch.advantages = withKey(defaultAdvantages(pt));
    if (isEmpty(p.audiences)) patch.audiences = withKey(defaultAudiences(pt, p));
    if (isEmpty(p.tips)) patch.tips = withKey(defaultTips(pt));
    if (isEmpty(p.careSteps)) patch.careSteps = withKey(defaultCareSteps(pt));
    if (isEmpty(p.productFaq)) patch.productFaq = withKey(defaultFaq(pt, p));
    if (isEmpty(p.extraCta)) {
      const cta = defaultExtraCta(pt);
      if (cta) patch.extraCta = cta;
    }
    if (isEmpty(p.deliveryOverride)) patch.deliveryOverride = defaultDelivery();
    if (isEmpty(p.warrantyOverride)) patch.warrantyOverride = defaultWarranty(pt, p);

    const nbFields = Object.keys(patch).length;
    if (nbFields === 0) {
      skipped++;
      console.log(`  ⏭️  ${p.name || p._id} — tout est déjà rempli`);
      continue;
    }

    console.log(`  ✏️  ${p.name || p._id} (${pt}) — ${nbFields} champ(s) : ${Object.keys(patch).join(", ")}`);

    if (!DRY) {
      const targetId = PUBLISH ? p._id : `drafts.${p._id.replace(/^drafts\./, "")}`;
      try {
        // Vérifie si un doc existe à cette cible ; sinon crée-le à partir du publié
        if (!PUBLISH) {
          const existing = await client.getDocument(targetId);
          if (!existing) {
            const published = await client.getDocument(p._id);
            await client.createIfNotExists({ ...published, _id: targetId });
          }
        }
        await client.patch(targetId).set(patch).commit({ autoGenerateArrayKeys: true });
        touched++;
      } catch (err) {
        console.error(`     ❌ échec :`, err.message);
      }
    } else {
      touched++;
    }
  }

  console.log(`\n✅ Terminé. ${touched} produit(s) mis à jour · ${skipped} déjà complet(s)\n`);
  if (!DRY && !PUBLISH) {
    console.log(`ℹ️  Les modifications sont en DRAFT. Ouvre Sanity Studio pour les publier une par une.`);
    console.log(`   Ou relance avec --publish pour publier directement.\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
