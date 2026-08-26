#!/usr/bin/env node
/**
 * Remplit la fiche de l'oreiller RITZ (duvet d'oie) à partir du brief éditorial.
 *
 * PAR DÉFAUT : n'écrit RIEN. Ajouter --publish pour appliquer.
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj SANITY_DATASET=production \
 *   SANITY_WRITE_TOKEN=sk... node scripts/seed-oreiller-ritz.mjs [--publish]
 *
 * ─── RÈGLE D'ÉCRITURE ─────────────────────────────────────────────────
 * Le script ne remplit QUE les champs vides. Tout ce qui a déjà été saisi
 * dans le Studio est laissé intact et signalé comme « déjà rempli ».
 * Aucun createOrReplace, aucun écrasement de tableau non vide.
 *
 * ─── CE QUE LE SCRIPT REFUSE D'ÉCRIRE ─────────────────────────────────
 * Le brief marque plusieurs caractéristiques comme non vérifiées :
 * fermeté, forme, dimensions, lavabilité, housse amovible, pourcentage
 * duvet/plumettes, hypoallergénique, anti-acariens. Elles ne sont PAS
 * écrites — elles sont listées en fin d'exécution pour saisie manuelle
 * après lecture de l'étiquette fournisseur.
 *
 * Ce n'est pas de la prudence décorative : sans ces champs, la fiche
 * retombe sur les valeurs par défaut du type « oreiller »
 * (lib/product-defaults.ts), qui affichent « Traitement anti-acariens »
 * et « Housse lavable en machine 40°C ». Remplir highlights et productFaq
 * avec le contenu ci-dessous fait donc DISPARAÎTRE ces deux mentions
 * fausses de la fiche RITZ — c'est l'effet principal de ce seed.
 */

import { createClient } from "@sanity/client";
import { randomBytes } from "node:crypto";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error("SANITY_PROJECT_ID manquant");
if (!token) throw new Error("SANITY_WRITE_TOKEN manquant (rôle Editor minimum)");

const PUBLISH = process.argv.includes("--publish");
const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const k = () => randomBytes(6).toString("hex");

const SLUG = "oreiller-ritz-duvet-oie-haut-de-gamme";

// ─────────────────────────────────────────────────────────────
// Portable Text — construction des blocs avec liens
// ─────────────────────────────────────────────────────────────

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

/**
 * Convertit une ligne en bloc Portable Text, en transformant la syntaxe
 * `[libellé](url)` en véritable annotation `link`. Écrire l'URL en clair
 * dans le texte donnerait une chaîne morte, non cliquable et illisible.
 */
function block(text, style = "normal") {
  const children = [];
  const markDefs = [];
  let cursor = 0;

  for (const m of text.matchAll(LINK_RE)) {
    if (m.index > cursor) {
      children.push({ _type: "span", _key: k(), text: text.slice(cursor, m.index), marks: [] });
    }
    const defKey = k();
    markDefs.push({ _type: "link", _key: defKey, href: m[2] });
    children.push({ _type: "span", _key: k(), text: m[1], marks: [defKey] });
    cursor = m.index + m[0].length;
  }
  if (cursor < text.length) {
    children.push({ _type: "span", _key: k(), text: text.slice(cursor), marks: [] });
  }

  return { _type: "block", _key: k(), style, markDefs, children };
}

const h3 = (t) => block(t, "h3");

// ─────────────────────────────────────────────────────────────
// CONTENU — repris mot pour mot du brief validé
// ─────────────────────────────────────────────────────────────

const DESCRIPTION = [
  h3("La douceur aérienne d'un oreiller en duvet d'oie"),
  block(
    "Offrez-vous une sensation de confort digne d'une chambre haut de gamme avec l'oreiller RITZ. Son garnissage annoncé en duvet d'oie procure un accueil doux, léger et enveloppant, idéal pour les dormeurs qui préfèrent un oreiller souple plutôt qu'un soutien rigide.",
  ),
  block(
    "Les fins flocons de duvet emprisonnent naturellement l'air, ce qui leur confère un gonflant aérien et une grande légèreté. Le duvet d'oie est notamment recherché dans la literie premium pour sa finesse, sa douceur et sa capacité à reprendre du volume lorsqu'il est régulièrement secoué. Ces caractéristiques générales sont également présentées par les fabricants spécialisés [Dumas Paris](https://dumas-paris.fr/collections/oreillers-duvet-doie) et [Drouault](https://www.drouault.net/oreiller-arosa-70-duvet-oie-moelleux.html).",
  ),
  h3("Un confort souple et facilement modelable"),
  block(
    "Contrairement à un oreiller compact, l'oreiller RITZ peut être délicatement modelé afin d'adapter son gonflant à vos préférences. Il accompagne la tête avec douceur et permet de répartir le garnissage selon la position recherchée.",
  ),
  block(
    "Son accueil moelleux crée une agréable sensation de cocon, tandis que la structure aérée du duvet contribue à éviter une impression de couchage trop dense.",
  ),
  h3("Une expérience de sommeil premium"),
  block(
    "Avec son nom évocateur et son garnissage naturel, le RITZ apporte une touche raffinée à votre literie. Il convient aussi bien à une chambre principale qu'à une chambre d'amis ou à un hébergement souhaitant proposer une expérience plus élégante.",
  ),
  block(
    "L'intitulé officiel « Oreiller RITZ en duvet d'oie haut de gamme » est référencé dans la [collection d'oreillers Trust Industrie](https://trust-industrie.com/collections/oreillers).",
  ),
];

const TAGLINE =
  "L'oreiller RITZ associe la douceur du duvet d'oie à un gonflant léger et enveloppant. Un confort souple et modelable, pensé pour apporter une véritable sensation de literie haut de gamme.";

const HIGHLIGHTS = [
  { icon: "🪶", label: "Duvet d'oie haut de gamme" },
  { icon: "☁️", label: "Accueil doux et aérien" },
  { icon: "✨", label: "Gonflant naturel" },
  { icon: "🤲", label: "Confort facilement modelable" },
  { icon: "🏨", label: "Sensation hôtelière premium" },
];

const ADVANTAGES = [
  {
    icon: "🪶",
    title: "Garnissage naturel",
    text: "Le duvet d'oie offre un confort léger et une agréable sensation de douceur.",
  },
  {
    icon: "☁️",
    title: "Accueil moelleux",
    text: "L'oreiller procure un accueil souple et enveloppant, sans sensation de rigidité.",
  },
  {
    icon: "🌬️",
    title: "Légèreté aérienne",
    text: "La structure fine du duvet emprisonne l'air et favorise un gonflant léger.",
  },
  {
    icon: "🤲",
    title: "Confort modulable",
    text: "Le garnissage peut être réparti et modelé afin d'ajuster la forme de l'oreiller.",
  },
  {
    icon: "🛏️",
    title: "Sensation enveloppante",
    text: "L'oreiller accompagne délicatement la tête pour créer un véritable effet cocon.",
  },
  {
    icon: "✨",
    title: "Expérience premium",
    text: "Un oreiller élégant destiné aux amateurs de literie naturelle et de confort haut de gamme.",
  },
];

const AUDIENCES = [
  {
    icon: "😴",
    title: "Amateurs de confort moelleux",
    text: "Pour les dormeurs qui recherchent un accueil doux, souple et peu rigide.",
  },
  {
    icon: "🤲",
    title: "Dormeurs aimant modeler leur oreiller",
    text: "Le duvet peut être réparti à la main pour adapter le gonflant à ses préférences.",
  },
  {
    icon: "🌙",
    title: "Personnes recherchant de la légèreté",
    text: "Une alternative aérienne aux oreillers composés de mousse compacte.",
  },
  {
    icon: "🏨",
    title: "Chambres premium et chambres d'amis",
    text: "Un choix élégant pour créer une atmosphère confortable inspirée de l'hôtellerie haut de gamme.",
  },
];

const TIPS = [
  {
    icon: "🧍",
    title: "Préserver l'alignement de la tête",
    text: "Choisissez et modelez l'épaisseur de l'oreiller afin que la tête reste dans le prolongement de la colonne vertébrale. Les recommandations du Cambridge University Hospitals NHS Trust insistent sur le maintien de la tête et du cou dans une position neutre pendant le sommeil.",
    source: {
      label: "Cambridge University Hospitals NHS Trust",
      url: "https://www.cuh.nhs.uk/patient-information/neck-exercises-and-advice/",
    },
  },
  {
    icon: "🤲",
    title: "Adapter le gonflant",
    text: "Répartissez le duvet avec les mains pour combler naturellement l'espace entre la tête, la nuque et les épaules. Cette capacité de modelage permet d'ajuster plus facilement l'oreiller à votre morphologie.",
  },
  {
    icon: "🌬️",
    title: "Aérer régulièrement",
    text: "Aérez la chambre et secouez délicatement l'oreiller afin de décompacter le garnissage et de lui redonner son gonflant.",
  },
  {
    icon: "🧺",
    title: "Toujours vérifier l'étiquette",
    text: "Les températures de lavage et les méthodes de séchage diffèrent selon l'enveloppe et le traitement du duvet. Le guide d'entretien de Dumas Paris recommande de toujours respecter les instructions propres à chaque modèle.",
    source: {
      label: "Dumas Paris — guide d'entretien",
      url: "https://dumas-paris.fr/pages/entretien-oreiller-guide-complet-de-la-maison-dumas-paris",
    },
  },
];

const CARE_STEPS = [
  {
    icon: "☀️",
    frequency: "Chaque matin",
    title: "Redonner du gonflant",
    text: "Secouez délicatement l'oreiller et répartissez le duvet avec les mains.",
  },
  {
    icon: "🌬️",
    frequency: "Chaque semaine",
    title: "Aérer",
    text: "Laissez respirer l'oreiller dans une pièce sèche et bien ventilée, sans l'exposer durablement à une forte humidité.",
  },
  {
    icon: "🛡️",
    frequency: "Au quotidien",
    title: "Le protéger",
    text: "Utilisez une taie propre et, si possible, un protège-oreiller respirant afin de limiter les taches et l'humidité.",
  },
  {
    icon: "🧼",
    frequency: "Selon l'étiquette",
    title: "Nettoyer",
    text: "Ne lavez l'oreiller en machine que si l'étiquette fabricant l'autorise. Respectez scrupuleusement la température, l'essorage et le mode de séchage indiqués.",
  },
];

const CARE_GUIDE = [
  block(
    "Pour préserver la douceur et le gonflant de votre oreiller RITZ, secouez-le régulièrement en maintenant deux côtés opposés. Répartissez ensuite le duvet avec les mains afin d'éviter la formation de zones compactes.",
  ),
  block(
    "Aérez fréquemment la chambre et évitez de recouvrir immédiatement l'oreiller après le réveil. Cette période d'aération aide à évacuer l'humidité accumulée pendant la nuit.",
  ),
  block(
    "Utilisez toujours une taie d'oreiller et, idéalement, un protège-oreiller respirant. Lavez régulièrement ces protections conformément à leurs propres instructions d'entretien.",
  ),
  block(
    "Avant tout lavage de l'oreiller, consultez son étiquette. N'utilisez pas de cycle chaud, de produit blanchissant ou de sèche-linge sans autorisation explicite du fabricant.",
  ),
  block(
    "Si le lavage est autorisé, assurez-vous que le garnissage soit entièrement sec jusqu'au cœur avant de remettre l'oreiller sur le lit. Un duvet encore humide peut se compacter et développer une odeur désagréable.",
  ),
];

const FAQ = [
  {
    question: "Le RITZ est-il composé à 100 % de duvet d'oie ?",
    answer:
      "Le produit est présenté comme un oreiller en duvet d'oie, mais le pourcentage exact de duvet et de plumettes n'est pas indiqué par le fournisseur. Cette information sera précisée dès réception de la fiche technique.",
  },
  {
    question: "L'oreiller RITZ est-il ferme ?",
    answer:
      "Le duvet offre généralement un accueil souple et moelleux. Le niveau de soutien réel dépend toutefois de la quantité de garnissage et de la proportion éventuelle de plumettes.",
  },
  {
    question: "Peut-on modifier son gonflant ?",
    answer:
      "Oui. Le garnissage naturel peut être délicatement réparti et modelé avec les mains afin d'obtenir une forme plus basse ou plus bombée.",
  },
  {
    question: "Convient-il à toutes les positions de sommeil ?",
    answer:
      "Cela dépend de son épaisseur et de la morphologie du dormeur. L'objectif est de conserver la tête dans le prolongement de la colonne vertébrale, sans inclinaison excessive.",
  },
  {
    question: "Peut-on laver le RITZ en machine ?",
    answer:
      "Uniquement si l'étiquette d'entretien l'autorise. En l'absence d'indication du fabricant, privilégiez l'aération et un protège-oreiller lavable plutôt qu'un passage en machine.",
  },
  {
    question: "Comment lui redonner son gonflant ?",
    answer:
      "Secouez-le délicatement, répartissez le duvet avec les mains puis laissez-le s'aérer dans une pièce sèche.",
  },
  {
    question: "Est-il hypoallergénique ou anti-acariens ?",
    answer:
      "Aucune certification ni aucun traitement anti-acariens n'est revendiqué pour ce modèle. Si vous êtes allergique, orientez-vous vers un garnissage synthétique ou ajoutez une housse anti-acariens.",
  },
];

const SEO = {
  // Sans le suffixe « | DreamsFly » : le template de app/layout.tsx
  // l'ajoute déjà. Le stocker ici le ferait apparaître deux fois.
  metaTitle: "Oreiller RITZ en duvet d'oie haut de gamme",
  metaDescription:
    "Découvrez l'oreiller RITZ en duvet d'oie : accueil moelleux, gonflant aérien et confort premium pour une agréable sensation hôtelière.",
  focusKeyword: "oreiller en duvet d'oie haut de gamme",
};

const IMAGE_ALT = "Oreiller RITZ en duvet d'oie haut de gamme au confort moelleux DreamsFly";

/**
 * Champs que le brief marque explicitement comme non vérifiés. Le script
 * ne les écrit pas — il les rappelle. Une valeur inventée ici deviendrait
 * une allégation commerciale sur une fiche produit.
 */
const A_VERIFIER = [
  ["firmness", "Fermeté", "« moelleux » à confirmer sur la fiche technique fournisseur"],
  ["oreillerShape", "Forme", "rectangulaire / carré / ergonomique — à vérifier"],
  ["oreillerDimensions", "Dimensions", "à relever sur l'étiquette (ex. « 60 x 40 cm »)"],
  ["oreillerCare.washable", "Lavable en machine", "laisser décoché tant que l'étiquette ne l'autorise pas"],
  ["oreillerCare.removableCover", "Housse amovible", "laisser décoché jusqu'à vérification"],
  ["variants[]", "Tailles & prix", "aucun prix dans le brief — à saisir dans l'onglet « Tailles & prix »"],
  ["images[]", "Photos produit", "à téléverser ; le texte alt est proposé ci-dessous"],
];

// ─────────────────────────────────────────────────────────────

const withKeys = (arr) => arr.map((o) => ({ _key: k(), ...o }));

/** Un tableau vide compte comme vide ; un objet SEO partiel est complété champ par champ. */
const isEmpty = (v) =>
  v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);

console.log(`\n🪶 Oreiller RITZ — mode ${PUBLISH ? "PUBLISH" : "DRY (lecture seule)"}`);
console.log(`   Projet ${projectId} · dataset ${dataset}\n`);

// Recherche large : par slug OU par nom, publié ET brouillon. Créer un
// doublon parce qu'on n'a cherché que le slug serait pire que ne rien faire.
const found = await client.fetch(
  `*[_type == "product" && (
      slug.current == $slug ||
      (productType == "oreiller" && name match "*RITZ*") ||
      title match "*RITZ*"
    )]{
      _id, _type, name, title, "slug": slug.current, productType, tagline,
      firmness, oreillerFilling, oreillerShape, oreillerDimensions, oreillerCare,
      description, highlights, advantages, audiences, tips, careSteps, careGuide,
      productFaq, seo, variants,
      "images": images[]{ _key, "hasAlt": defined(alt) }
    }`,
  { slug: SLUG },
);

if (!found.length) {
  console.log("❌ Aucune fiche RITZ trouvée (ni publiée, ni en brouillon).");
  console.log(`   Recherche : slug == « ${SLUG} » ou nom/titre contenant « RITZ ».`);
  console.log(
    "\n   Ce script ne crée pas de produit : il complète une fiche existante.\n" +
      "   Crée d'abord le produit dans le Studio (Catégorie « 🌙 Oreiller »,\n" +
      `   Nom « RITZ », Slug « ${SLUG} »), puis relance.\n`,
  );
  process.exit(1);
}

console.log(`${found.length} document(s) trouvé(s) :`);
for (const d of found) {
  const kind = d._id.startsWith("drafts.") ? "brouillon" : "publié";
  console.log(`  · ${d._id}  (${kind})  ${d.title || d.name || "—"}`);
}

// ─────────────────────────────────────────────────────────────

const plan = [];

for (const doc of found) {
  const set = {};
  const kept = [];

  const fill = (field, value, label) => {
    if (isEmpty(doc[field])) set[field] = value;
    else kept.push(label || field);
  };

  fill("productType", "oreiller", "productType");
  fill("name", "RITZ", "name");
  fill("title", "Oreiller RITZ en duvet d'oie haut de gamme", "title");
  fill("tagline", TAGLINE, "tagline");
  fill("oreillerFilling", "duvet-oie", "oreillerFilling");
  fill("description", DESCRIPTION, "description");
  fill("careGuide", CARE_GUIDE, "careGuide");

  if (isEmpty(doc.slug)) set.slug = { _type: "slug", current: SLUG };
  else if (doc.slug !== SLUG) kept.push(`slug (« ${doc.slug} » conservé — ⚠️ diffère du brief)`);
  else kept.push("slug");

  const arrays = [
    ["highlights", HIGHLIGHTS],
    ["advantages", ADVANTAGES],
    ["audiences", AUDIENCES],
    ["tips", TIPS],
    ["careSteps", CARE_STEPS],
    ["productFaq", FAQ],
  ];
  for (const [field, value] of arrays) {
    if (isEmpty(doc[field])) set[field] = withKeys(value);
    else kept.push(`${field} (${doc[field].length} entrée·s)`);
  }

  // SEO : objet imbriqué. Si l'objet n'existe pas du tout on l'écrit d'un
  // bloc — un patch sur `seo.metaTitle` dont le parent est absent ne crée
  // pas le parent et passerait silencieusement à la trappe.
  if (!doc.seo) {
    set.seo = { ...SEO };
  } else {
    for (const [sub, value] of Object.entries(SEO)) {
      if (isEmpty(doc.seo[sub])) set[`seo.${sub}`] = value;
      else kept.push(`seo.${sub}`);
    }
  }

  // Alt des photos déjà téléversées, uniquement si vide.
  for (const img of doc.images || []) {
    if (!img.hasAlt && img._key) set[`images[_key=="${img._key}"].alt`] = IMAGE_ALT;
  }

  plan.push({ doc, set, kept });
}

// ─────────────────────────────────────────────────────────────

console.log("\n── PLAN D'ÉCRITURE ─────────────────────────────────────");
let totalWrites = 0;
for (const { doc, set, kept } of plan) {
  const keys = Object.keys(set);
  totalWrites += keys.length;
  console.log(`\n  ${doc._id}`);
  if (keys.length) {
    console.log(`    ✍️  À remplir (${keys.length}) :`);
    for (const key of keys) {
      const v = set[key];
      const size = Array.isArray(v) ? `${v.length} entrée·s` : typeof v === "string" ? `« ${v.slice(0, 58)}${v.length > 58 ? "…" : ""} »` : "objet";
      console.log(`       · ${key} → ${size}`);
    }
  } else {
    console.log("    ✅ Rien à faire — tous les champs du brief sont déjà remplis.");
  }
  if (kept.length) {
    console.log(`    🔒 Déjà rempli, laissé intact (${kept.length}) :`);
    console.log(`       ${kept.join(" · ")}`);
  }
}

console.log("\n── À SAISIR À LA MAIN (non vérifié → non écrit) ─────────");
for (const [field, label, why] of A_VERIFIER) {
  console.log(`  · ${label.padEnd(22)} ${why}`);
  console.log(`    ${" ".repeat(22)} champ : ${field}`);
}
console.log(`\n  Texte alt proposé pour les photos :`);
console.log(`    « ${IMAGE_ALT} »`);

console.log("\n── EFFET DE BORD UTILE ─────────────────────────────────");
console.log("  Sans highlights ni productFaq, la fiche affiche les valeurs par");
console.log("  défaut du type « oreiller » : « Traitement anti-acariens » et");
console.log("  « Housse lavable en machine 40°C ». Aucune des deux n'est justifiée");
console.log("  pour le RITZ. Ce seed les remplace par le contenu réel.");

console.log(`\n═══════════════════════════════════════════════════════`);
console.log(`${totalWrites} champ(s) à écrire sur ${plan.length} document(s).`);
console.log(`═══════════════════════════════════════════════════════\n`);

if (!PUBLISH) {
  console.log("💡 Mode DRY — rien n'a été écrit.\n   Relance avec --publish après relecture du plan ci-dessus.\n");
  process.exit(0);
}

if (!totalWrites) {
  console.log("Rien à écrire. Aucune requête envoyée.\n");
  process.exit(0);
}

for (const { doc, set } of plan) {
  if (!Object.keys(set).length) continue;
  // Patch partiel : setIfMissing en plus de la vérification côté lecture,
  // au cas où le Studio aurait été modifié entre le fetch et le commit.
  await client.patch(doc._id).setIfMissing(set).commit();
  console.log(`✅ ${doc._id} — ${Object.keys(set).length} champ(s)`);
}

const hasDraft = found.some((d) => d._id.startsWith("drafts."));
console.log(`\n✅ Terminé.`);
if (hasDraft) {
  console.log("   ⚠️  Un brouillon existe : ouvre la fiche dans le Studio et clique");
  console.log("       « Publish » pour que les changements soient visibles en ligne.");
}
console.log("   Complète ensuite les champs de la section « À SAISIR À LA MAIN ».\n");
