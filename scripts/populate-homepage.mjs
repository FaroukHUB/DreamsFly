#!/usr/bin/env node
/**
 * Migration : pré-remplit le document Page d'accueil avec les textes des sections
 * (Mosaïque de collections + Tuiles catégories) qui aujourd'hui vivent
 * uniquement en fallback dans le code.
 *
 * Après ce script tu n'as plus qu'à uploader une image sur chaque card dans Sanity
 * — tous les titres, liens, promos sont déjà en place.
 *
 * IDEMPOTENT — ne touche que les champs vides. Rerun safe.
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj \
 *   SANITY_WRITE_TOKEN=sk... \
 *   node scripts/populate-homepage.mjs [--dry|--publish]
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
// Défauts — miroir exact des fallbacks dans les composants
// ─────────────────────────────────────────────────────────────

const MOSAIC_CARDS = [
  {
    _key: k(),
    eyebrow: "Gamme Performance",
    title: "Le sommeil, élevé au rang d'art",
    link: "/matelas-memoire-de-forme",
    theme: "midnight",
  },
  {
    _key: k(),
    eyebrow: "Gamme Confort",
    title: "La qualité accessible à tous",
    link: "/matelas",
    theme: "beige",
  },
  {
    _key: k(),
    eyebrow: "Soutien renforcé",
    title: "Conçu pour le mal de dos",
    link: "/matelas-mal-de-dos",
    theme: "dark",
  },
  {
    _key: k(),
    eyebrow: "Boutiques physiques",
    title: "Essayez avant d'acheter",
    link: "/magasins",
    theme: "gold",
  },
];

const CATEGORY_TILES = [
  { _key: k(), name: "Matelas", promo: "Jusqu'à -40%", link: "/matelas", overlay: "dark" },
  { _key: k(), name: "Lits", promo: "Design & confort", link: "/lits", overlay: "dark" },
  { _key: k(), name: "Sommiers", promo: "Jusqu'à -30%", link: "/sommiers", overlay: "dark" },
  { _key: k(), name: "Oreillers", promo: "Confort cervical", link: "/oreillers", overlay: "dark" },
];

// ─── 8 nouvelles sections SEO ─────────────────────────────────

const WHY_US = {
  eyebrow: "Notre différence",
  title: "Pourquoi choisir DreamsFly ?",
  subtitle:
    "Une literie premium fabriquée en Europe, sélectionnée par des passionnés, livrée à domicile avec un service pensé pour durer.",
  pillars: [
    { _key: k(), icon: "🎓", title: "Expertise", text: "6 ans à sélectionner les meilleurs fabricants européens de literie." },
    { _key: k(), icon: "🎯", title: "Sélection", text: "Moins de 3 % des modèles testés arrivent dans notre catalogue." },
    { _key: k(), icon: "🛡️", title: "Qualité", text: "Certifications OEKO-TEX, garanties longues, matériaux traçables." },
    { _key: k(), icon: "🤝", title: "Accompagnement", text: "Conseillers sommeil formés, disponibles par téléphone ou en showroom." },
    { _key: k(), icon: "💬", title: "Service client", text: "Réponse en moins de 4 h, du lundi au samedi. Français, humain, sans script." },
  ],
};

const BUYING_GUIDE = {
  eyebrow: "Guide d'achat",
  title: "Bien choisir sa literie, en 4 lectures",
  subtitle: "Nos guides vulgarisés pour décider en toute confiance.",
  guides: [
    { _key: k(), icon: "🛏️", title: "Comment choisir son matelas ?", text: "Position de sommeil, gabarit, fermeté, technologies — le guide complet pour ne pas se tromper.", ctaLabel: "Lire le guide", ctaLink: "/magazine/guide-choisir-matelas" },
    { _key: k(), icon: "🛋️", title: "Comment choisir son lit ?", text: "Coffre ou classique, taille, tissu, hauteur — nos critères pour un lit qui dure 10 ans.", ctaLabel: "Lire le guide", ctaLink: "/magazine/guide-choisir-lit" },
    { _key: k(), icon: "🪑", title: "Comment choisir son sommier ?", text: "Lattes, tapissier, à ressorts — quelle base pour quel matelas et quel usage.", ctaLabel: "Lire le guide", ctaLink: "/magazine/guide-choisir-sommier" },
    { _key: k(), icon: "🌙", title: "Comment choisir son oreiller ?", text: "Duvet, mémoire de forme, ergonomique — trouver le bon soutien pour votre nuque.", ctaLabel: "Lire le guide", ctaLink: "/magazine/guide-choisir-oreiller" },
  ],
};

const COMMITMENTS = {
  eyebrow: "Nos engagements",
  title: "Ce à quoi nous nous tenons",
  subtitle: "Six promesses concrètes qui guident chaque décision — de la sélection produit au SAV.",
  items: [
    { _key: k(), icon: "✨", title: "Qualité", text: "Matériaux certifiés, ateliers audités, tests longévité 10 ans." },
    { _key: k(), icon: "🌙", title: "Confort", text: "Essai en showroom — vous vous allongez avant de vous décider." },
    { _key: k(), icon: "♾️", title: "Durabilité", text: "Garanties de 2 à 8 ans selon les produits, pièces détachées dispo." },
    { _key: k(), icon: "🚚", title: "Livraison", text: "Rendez-vous programmé, à l'étage, sans surprise de dernière minute." },
    { _key: k(), icon: "👥", title: "Accompagnement", text: "Conseillers sommeil formés — un vrai humain, pas un chatbot." },
    { _key: k(), icon: "❤️", title: "Service client", text: "Réponse < 4 h en semaine. Objectif : résolution au 1er contact." },
  ],
};

const HOMEPAGE_FAQ = {
  eyebrow: "Questions fréquentes",
  title: "Vos questions, nos réponses",
  subtitle: "Tout ce qu'on nous demande le plus souvent — regroupé par thème pour aller vite.",
  questions: [
    { _key: k(), category: "produit", question: "Quelle marque de matelas choisir ?", answer: "Cela dépend de votre position de sommeil, votre gabarit et votre budget. Chez DreamsFly, nous sélectionnons uniquement des fabricants européens certifiés OEKO-TEX. Notre quiz en 1 minute vous oriente vers le modèle qui correspond à votre morphologie." },
    { _key: k(), category: "produit", question: "Quelle est la meilleure taille de matelas pour un couple ?", answer: "Le 160×200 (Queen) est le meilleur compromis pour la plupart des couples. Le 180×200 (King) offre plus d'espace individuel — recommandé si l'un de vous bouge beaucoup ou pour les grandes tailles." },
    { _key: k(), category: "produit", question: "Combien de temps dure un matelas de qualité ?", answer: "Entre 7 et 10 ans en usage quotidien. Au-delà, la mousse perd 30 % de son soutien même s'il « semble » encore bon. Un protège-matelas + retournement tous les 3 mois prolongent la vie du matelas de 30 à 40 %." },
    { _key: k(), category: "produit", question: "Peut-on utiliser un ancien sommier ?", answer: "Techniquement oui, mais un vieux sommier avec lattes cassées ou mou dégrade rapidement un matelas neuf. Nous recommandons de renouveler les deux ensemble tous les 10 ans." },
    { _key: k(), category: "produit", question: "Les matelas DreamsFly sont-ils hypoallergéniques ?", answer: "Oui — traitement anti-acariens en usine, housses certifiées OEKO-TEX Standard 100 (absence de substances nocives). Pour les allergies sévères, ajoutez une alèse imperméable." },
    { _key: k(), category: "livraison", question: "Comment fonctionne la livraison ?", answer: "Livraison en France métropolitaine à un tarif forfaitaire unique, avec montée à l'étage incluse (2 livreurs). Le montant exact des frais de port s'affiche au moment de valider votre panier. Corse et zones difficiles d'accès : supplément indiqué au checkout." },
    { _key: k(), category: "livraison", question: "En combien de temps serai-je livré ?", answer: "5 à 7 jours ouvrés en France métropolitaine. Rendez-vous programmé par SMS 48 h avant, créneaux matin, après-midi ou samedi selon les zones." },
    { _key: k(), category: "livraison", question: "Reprenez-vous mon ancien matelas ?", answer: "Oui, gratuitement à la livraison sur simple demande à la commande. Nous le remettons à un centre de recyclage agréé Éco-mobilier." },
    { _key: k(), category: "livraison", question: "Livrez-vous en Belgique / Suisse / DOM-TOM ?", answer: "Belgique et Luxembourg : oui, sous 8-10 jours ouvrés, tarif dégressif selon poids. Suisse : oui, sous 10-14 jours (formalités douanières). DOM-TOM : nous consulter pour un devis personnalisé." },
    { _key: k(), category: "paiement", question: "Puis-je payer en plusieurs fois ?", answer: "Oui, en 2×, 3× ou 4× sans frais avec Alma (paiement sécurisé par carte bancaire). Sans impact sur votre crédit, réponse immédiate au checkout." },
    { _key: k(), category: "paiement", question: "Quels moyens de paiement acceptez-vous ?", answer: "Carte bancaire (Visa, Mastercard, Amex), Alma (paiement fractionné), Apple Pay, Google Pay, et virement bancaire pour les commandes > 2 000 €." },
    { _key: k(), category: "paiement", question: "Est-ce que le paiement est sécurisé ?", answer: "Oui — Stripe pour la carte bancaire, Alma pour le fractionné. Aucune donnée bancaire n'est stockée sur nos serveurs. Site en HTTPS, certifié PCI DSS niveau 1." },
    { _key: k(), category: "garantie", question: "Combien de temps dure la garantie ?", answer: "2 ans minimum sur tous nos produits. Certains matelas premium : 5 ans. Structure des lits : 5 ans. Vérins hydrauliques des lits coffre : 8 ans. Voir la fiche produit pour la durée exacte." },
    { _key: k(), category: "garantie", question: "Que couvre la garantie ?", answer: "Défauts de fabrication (couture, mousse, coutil), affaissement anormal > 3 cm en usage normal, casse de ressort. Ne couvre pas : usure normale du tissu, taches, brûlures, dégâts causés par animaux." },
    { _key: k(), category: "garantie", question: "Comment activer la garantie ?", answer: "Envoyez-nous une photo + description du problème par email à contact@dreamsfly.fr. Nous vous répondons sous 4 h ouvrées avec la marche à suivre — le plus souvent un simple retour + échange." },
    { _key: k(), category: "entretien", question: "Faut-il retourner un matelas ?", answer: "Oui — tous les 3 mois la 1re année, puis tous les 6 mois. Alternez tête-pied et face A / face B. Cette rotation prolonge la durée de vie de 30 à 40 %." },
    { _key: k(), category: "entretien", question: "Comment nettoyer une tache sur mon matelas ?", answer: "Tamponnez immédiatement avec un chiffon microfibre humide (jamais détrempé). Un peu de savon de Marseille pour les taches organiques. Séchez au sèche-cheveux à distance. Évitez absolument l'eau de Javel." },
    { _key: k(), category: "sav", question: "Puis-je essayer un matelas avant de l'acheter ?", answer: "Oui, en showroom : nos boutiques présentent les modèles et un conseiller vous oriente selon votre morphologie et votre position de sommeil. Pour une commande en ligne, vous disposez du droit de rétractation légal de 14 jours (article L221-18 du Code de la consommation)." },
    { _key: k(), category: "sav", question: "Comment vous contacter en cas de problème ?", answer: "Par email à contact@dreamsfly.fr (réponse < 4 h en semaine), par téléphone au numéro affiché en pied de page, ou directement dans l'un de nos 3 showrooms." },
    { _key: k(), category: "sav", question: "Puis-je annuler ma commande avant livraison ?", answer: "Oui, sans frais, tant que la commande n'a pas été expédiée. Après expédition, retour gratuit sous 14 jours conformément au droit de rétractation. La reprise à domicile est gratuite." },
    { _key: k(), category: "autre", question: "Avez-vous des showrooms physiques ?", answer: "Oui, 3 showrooms en France où vous pouvez tester nos matelas et lits avant achat. Voir la page Magasins pour les adresses et horaires." },
  ],
};

const GUIDES_SECTION = {
  eyebrow: "Nos guides",
  title: "Décidez en connaissance de cause",
  subtitle: "Des guides longs et illustrés pour comprendre avant d'acheter.",
  items: [
    { _key: k(), title: "Le guide complet du sommeil réparateur", summary: "Position, matelas, environnement — tout ce qui influence vos nuits.", ctaLabel: "Lire le guide", ctaLink: "/magazine/guide-sommeil-reparateur" },
    { _key: k(), title: "Matelas 140×190 : lequel choisir en 2026", summary: "Notre comparatif des meilleurs matelas taille couple.", ctaLabel: "Voir le comparatif", ctaLink: "/matelas-140x190" },
    { _key: k(), title: "Lit coffre : le guide 2026", summary: "Capacité, mécanisme, entretien — tout sur le lit coffre.", ctaLabel: "Lire le guide", ctaLink: "/lits-coffre" },
  ],
};

const LATEST_ARTICLES = {
  eyebrow: "Notre magazine",
  title: "Derniers articles publiés",
  subtitle: "Conseils sommeil, guides d'achat et décryptages par nos experts.",
  items: [
    { _key: k(), category: "Conseils sommeil", title: "5 gestes pour mieux dormir dès ce soir", excerpt: "Des rituels simples validés par la recherche pour un endormissement plus rapide.", date: "2026-06-15", link: "/magazine/mieux-dormir-5-gestes" },
    { _key: k(), category: "Guide d'achat", title: "Mémoire de forme ou ressorts ensachés ?", excerpt: "Le comparatif honnête pour choisir la bonne technologie selon votre profil.", date: "2026-05-28", link: "/magazine/memoire-forme-vs-ressorts" },
    { _key: k(), category: "Santé", title: "Mal de dos : quel matelas privilégier ?", excerpt: "Recommandations d'ostéopathes et sélection DreamsFly adaptée.", date: "2026-05-10", link: "/magazine/matelas-mal-de-dos" },
  ],
};

const TESTIMONIALS = {
  eyebrow: "Ils nous font confiance",
  title: "1 167 avis ★ 4,9 / 5 en moyenne",
  subtitle: "Ce que nos clients disent après leur achat — extraits vérifiés Google.",
  averageRating: 4.9,
  totalReviews: 1167,
  moreReviewsUrl:
    "https://www.google.com/search?sca_esv=26fe8ce32570a73a&sxsrf=APpeQnuRcAkp9r5hktDd23vEapZKaK7wrg:1784041005716&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_zzlHRevGzIzhQwhU2OVmYt0tbteQE4Nl1bY8lFwmY0ZnfbeI86Zbebb2s2NtbnzXkWPTgR9aBkwPbNsdNlhUXOjYXgqCOV9hOV_AynW8hbdxIt_PrZsJANOz8ND4vif4jlfHVOBjrEpb455kFf6Xjm9UHAI&q=Magasin+de+meubles+-+Canap%C3%A9+-+Matelas+%7C+TRUST+INDUSTRIE+Avis",
  moreReviewsLabel: "Voir tous les avis Google",
  // Pas de faux avis générés — tu ajouteras les vrais dans Sanity Studio
  items: [],
};

const BRAND_LOGOS = {
  eyebrow: "Ils parlent de nous",
  title: "Reconnus par les médias",
  items: [
    { _key: k(), name: "Le Figaro" },
    { _key: k(), name: "Marie Claire Maison" },
    { _key: k(), name: "Elle Décoration" },
    { _key: k(), name: "AD Magazine" },
    { _key: k(), name: "Ideat" },
    { _key: k(), name: "M6 Turbo Déco" },
  ],
};

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

function isEmpty(v) {
  if (v === undefined || v === null) return true;
  if (Array.isArray(v)) return v.length === 0;
  return false;
}

const SECTIONS = [
  { key: "mosaicCollections", value: MOSAIC_CARDS, label: `${MOSAIC_CARDS.length} cards` },
  { key: "categoryTiles", value: CATEGORY_TILES, label: `${CATEGORY_TILES.length} tuiles` },
  { key: "whyUs", value: WHY_US, label: `${WHY_US.pillars.length} piliers` },
  { key: "buyingGuide", value: BUYING_GUIDE, label: `${BUYING_GUIDE.guides.length} guides` },
  { key: "commitments", value: COMMITMENTS, label: `${COMMITMENTS.items.length} engagements` },
  { key: "homepageFaq", value: HOMEPAGE_FAQ, label: `${HOMEPAGE_FAQ.questions.length} questions` },
  { key: "guidesSection", value: GUIDES_SECTION, label: `${GUIDES_SECTION.items.length} guides` },
  { key: "latestArticles", value: LATEST_ARTICLES, label: `${LATEST_ARTICLES.items.length} articles` },
  { key: "testimonials", value: TESTIMONIALS, label: `${TESTIMONIALS.items.length} avis` },
  { key: "brandLogos", value: BRAND_LOGOS, label: `${BRAND_LOGOS.items.length} marques` },
];

async function main() {
  console.log(`\n▶ Migration Page d'accueil — ${DRY ? "DRY RUN" : PUBLISH ? "PUBLISH direct" : "DRAFT"}\n`);

  const fields = SECTIONS.map((s) => s.key).join(", ");
  const doc = await client.fetch(
    `*[_type == "homepage" && !(_id in path("drafts.**"))][0]{ _id, ${fields} }`
  );

  if (!doc) {
    console.log("⚠️  Aucun document Page d'accueil publié trouvé. Crée-le d'abord dans Sanity Studio.");
    process.exit(1);
  }

  const patch = {};

  for (const section of SECTIONS) {
    const isArray = Array.isArray(section.value);
    const currentValue = doc[section.key];
    // Pour un objet : on considère vide si null/undefined OU objet vide
    // Pour un array : on considère vide si null/undefined/tableau vide
    const empty = isArray
      ? isEmpty(currentValue)
      : !currentValue || (typeof currentValue === "object" && Object.keys(currentValue).length === 0);

    if (empty) {
      patch[section.key] = section.value;
      console.log(`  ✏️  ${section.key} — ${section.label}`);
    } else {
      console.log(`  ⏭️  ${section.key} déjà rempli — non touché`);
    }
  }

  if (Object.keys(patch).length === 0) {
    console.log(`\n✅ Rien à faire — toutes les sections sont déjà remplies.\n`);
    return;
  }

  if (DRY) {
    console.log(`\n[DRY RUN] Aucune écriture effectuée.\n`);
    return;
  }

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
    console.log(`\n✅ Page d'accueil mise à jour (${PUBLISH ? "publié directement" : "en brouillon"}).\n`);
    if (!PUBLISH) {
      console.log(`ℹ️  Va dans Sanity Studio → Page d'accueil → clique Publish pour rendre visible.\n`);
      console.log(`   Ensuite : upload une image sur chaque card et republie.\n`);
    }
  } catch (err) {
    console.error(`❌ Échec : ${err.message}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
