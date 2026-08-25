#!/usr/bin/env node
/**
 * Migration : nettoie les mentions inventées / incorrectes qui traînent
 * en base Sanity — sur les champs :
 *  - product.deliveryOverride.price / .perks[]
 *  - product.warrantyOverride.duration
 *  - landingPage.sections[].* (portable text)
 *  - staticPage.body[].* (portable text)
 *  - guide.body[].*
 *
 * Par défaut : mode DRY (liste seulement). Ajouter --publish pour appliquer.
 *
 * Politiques appliquées :
 *  · "Livraison offerte / gratuite / incluse (dès X €)" → "Livraison à domicile (99 €)"
 *  · "Frais de port offerts / gratuits"       → "Frais de livraison 99 €"
 *  · "15 ans de garantie" / "Garantie 15 ans" → "Garantie fabricant"
 *  · "N nuits d'essai" / "Essai N nuits"      → "Essai en showroom"
 *    (N quelconque : 30, 100, 120… DreamsFly ne propose PAS d'essai à
 *     domicile — l'essai se fait en boutique, cf. public/llms.txt)
 *
 * Cas particulier : product.deliveryOverride.price est un champ affiché tel
 * quel en titre de la section Livraison. On y écrit la formulation canonique
 * (identique à `deliveryInfo.price` dans lib/product-defaults.ts) plutôt que
 * le résultat d'un remplacement regex, pour garder tout le site cohérent.
 *
 * ⚠️  À relancer après CHAQUE rollback Sanity : une restauration par la
 * History API ramène l'état d'avant nettoyage, donc les mentions reviennent.
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj \
 *   SANITY_WRITE_TOKEN=sk... \
 *   node scripts/cleanup-delivery-mentions.mjs [--publish]
 */

import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error("SANITY_PROJECT_ID manquant");
if (!token) throw new Error("SANITY_WRITE_TOKEN manquant (rôle Editor minimum)");

const PUBLISH = process.argv.includes("--publish");
const DRY = !PUBLISH;

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// Formulation canonique des frais de port — doit rester identique à
// `deliveryInfo.price` dans lib/product-defaults.ts.
const CANONICAL_DELIVERY_PRICE = "Frais de port forfaitaires — affichés au panier";

// Regex catch-all pour les formulations à supprimer.
// Apostrophe droite ET typographique (’) : Sanity stocke souvent la seconde.
const AP = "['’]";
const OFFERED_RE = new RegExp(String.raw`livraison\s+(offerte|gratuite|incluse|à\s+0\s*€)(?:\s*(?:,|·|-|—)?\s*d[eè]s\s+\d+\s*(?:€|euros?)?)?`, "gi");
const FRAIS_RE = new RegExp(String.raw`frais\s+de\s+port\s+(offerts?|gratuits?|nuls?|à\s+0\s*€)(?:\s*d[eè]s\s+\d+\s*(?:€|euros?)?)?`, "gi");
const WARRANTY15_RE = /(garantie\s+(?:de\s+)?15\s*ans|15\s*ans\s+de\s+garantie)/gi;
// N nuits d'essai, quel que soit N — aucun essai à domicile chez DreamsFly.
const NUITS_RE = new RegExp(String.raw`(essai\s+(?:de\s+)?\d+\s*nuits?|\d+\s*nuits?\s+d${AP}?\s*essai)`, "gi");

/**
 * Phrases où la mention est VOLONTAIRE : ce sont des contre-messages qui
 * expliquent que DreamsFly ne propose PAS d'essai à domicile, ou qui
 * critiquent la pratique chez les concurrents. Les nettoyer inverserait
 * le sens ("se laisser piéger par le « Essai en showroom »"…).
 */
const KEEP_RE = [
  /pas\s+d${"['’]"}?essai/i,
  /n${"['’]"}est\s+pas\s+propos/i,
  /se\s+laisser\s+pi[ée]g/i,
  /«[^»]*nuits[^»]*»/i,
];

function isDeliberate(s) {
  return KEEP_RE.some((re) => re.test(s));
}

const RULES = [
  [OFFERED_RE, "Livraison à domicile (99 €)", "livraison à domicile (99 €)"],
  [FRAIS_RE, "Frais de livraison 99 €", "frais de livraison 99 €"],
  [WARRANTY15_RE, "Garantie fabricant", "garantie fabricant"],
  [NUITS_RE, "Essai en showroom", "essai en showroom"],
];

/**
 * Nettoie une string en remplaçant les formulations à bannir.
 * `path` sert au cas particulier deliveryOverride.price (champ affiché en
 * titre : on y écrit la formulation canonique complète).
 */
function cleanString(s, path = "") {
  if (!s || typeof s !== "string") return s;
  if (/deliveryOverride\.price$/.test(path)) return CANONICAL_DELIVERY_PRICE;
  let out = s;
  for (const [re, upper, lower] of RULES) {
    re.lastIndex = 0;
    out = out.replace(re, (m) => (m[0] === m[0].toUpperCase() ? upper : lower));
  }
  // Rattrapage : "30 nuits d'essai à domicile" devenait "Essai en showroom
  // à domicile" — contradictoire. On supprime le complément devenu faux.
  out = out.replace(/(essai en showroom)\s+(à domicile|chez vous)/gi, "$1");
  return out;
}

function hasIssue(s) {
  if (typeof s !== "string") return false;
  if (isDeliberate(s)) return false;
  return RULES.some(([re]) => {
    re.lastIndex = 0;
    return re.test(s);
  });
}

/** Parcourt récursivement une valeur pour trouver toutes les strings problématiques. */
function findIssues(node, path = "") {
  const issues = [];
  if (node == null) return issues;
  if (typeof node === "string") {
    if (hasIssue(node)) issues.push({ path, value: node, cleaned: cleanString(node, path) });
    return issues;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => issues.push(...findIssues(v, `${path}[${i}]`)));
    return issues;
  }
  if (typeof node === "object") {
    for (const k of Object.keys(node)) {
      if (k.startsWith("_")) continue;
      issues.push(...findIssues(node[k], path ? `${path}.${k}` : k));
    }
  }
  return issues;
}

async function scan(query, label) {
  const docs = await client.fetch(query);
  const flagged = [];
  for (const doc of docs) {
    const issues = findIssues(doc);
    if (issues.length > 0) flagged.push({ doc, issues });
  }
  console.log(`\n📄 ${label} — ${flagged.length}/${docs.length} document(s) contiennent une mention à nettoyer\n`);
  for (const { doc, issues } of flagged) {
    console.log(`  · ${doc._type} · ${doc._id}${doc.slug?.current ? ` (/${doc.slug.current})` : ""}`);
    for (const issue of issues) {
      console.log(`      ${issue.path}`);
      console.log(`      AVANT : ${issue.value.slice(0, 90)}${issue.value.length > 90 ? "…" : ""}`);
      console.log(`      APRÈS : ${issue.cleaned.slice(0, 90)}${issue.cleaned.length > 90 ? "…" : ""}`);
    }
  }
  return flagged;
}

/** Construit un patch Sanity qui remplace en profondeur les strings flagged. */
function buildPatchOps(doc, issues) {
  // On assemble un objet à envoyer avec .patch().set() sur chaque path
  const ops = {};
  for (const { path, cleaned } of issues) {
    ops[path] = cleaned;
  }
  return ops;
}

async function applyPatches(flagged) {
  if (flagged.length === 0) {
    console.log("\n✅ Rien à patcher.\n");
    return;
  }
  console.log(`\n🩹 Application de ${flagged.length} patch(s) — mode PATCH PARTIEL (sûr, ne touche que les champs modifiés)\n`);
  for (const { doc, issues } of flagged) {
    // ⚠️  Ne PAS utiliser createOrReplace — ça écrase le doc entier
    // avec seulement les champs récupérés par la query GROQ (perte totale
    // des images, variants, description, etc.).
    // On utilise .patch().set() qui ne modifie que les champs listés.
    let patch = client.patch(doc._id);
    for (const { path, cleaned } of issues) {
      patch = patch.set({ [path]: cleaned });
    }
    await patch.commit();
    console.log(`  ✅ ${doc._id}${doc.slug?.current ? ` (/${doc.slug.current})` : ""} — ${issues.length} champ(s) mis à jour (patch partiel)`);
  }
  console.log(`\n💡 Patches partiels appliqués — aucun autre champ des documents n'a été touché.\n`);
}

/** Met à jour une valeur profonde en suivant une path syntaxe 'a.b[0].c'. */
function setDeep(obj, path, value) {
  const tokens = path.match(/[^.[\]]+|\[\d+\]/g) || [];
  let cur = obj;
  for (let i = 0; i < tokens.length - 1; i++) {
    const t = tokens[i];
    if (t.startsWith("[")) {
      const idx = Number(t.slice(1, -1));
      cur = cur[idx];
    } else {
      cur = cur[t];
    }
  }
  const last = tokens[tokens.length - 1];
  if (last.startsWith("[")) {
    cur[Number(last.slice(1, -1))] = value;
  } else {
    cur[last] = value;
  }
}

/**
 * Passe dédiée aux garanties produit.
 *
 * Garantie DreamsFly : 2 ans sur matelas, sommiers et oreillers. Seul le
 * lit coffre garde le barème fabricant (5 ans structure · 8 ans vérins ·
 * 2 ans tissu) — les produits de type "lit" sont donc exclus.
 *
 * Deux champs à corriger, tous deux écrits par d'anciens imports :
 *  · warrantyOverride.duration — c'est LUI qui s'affiche en titre de la
 *    section Garantie de la fiche produit (« Garantie 5 ans »).
 *  · features.garantieAns — repris de la métadonnée du catalogue
 *    fournisseur, qui porte « 5 ans ».
 *
 * Le champ garantieAns n'est plus lu par le site (product-details.tsx et
 * product-defaults.ts affichent une valeur fixe), mais on l'aligne quand
 * même pour que le Studio ne montre pas une donnée contradictoire.
 */
const WARRANTY_BY_TYPE = { matelas: "2 ans", sommier: "2 ans", oreiller: "2 ans" };

async function scanWarranty() {
  const docs = await client.fetch(
    `*[_type == "product" && productType in ["matelas", "sommier", "oreiller"]]{
       _id, _type, slug, productType, warrantyOverride, features
     }`,
  );
  const flagged = [];
  for (const doc of docs) {
    const expected = WARRANTY_BY_TYPE[doc.productType];
    const issues = [];
    const current = doc.warrantyOverride?.duration;
    if (current && current !== expected) {
      issues.push({ path: "warrantyOverride.duration", value: current, cleaned: expected });
    }
    if (doc.features?.garantieAns != null && doc.features.garantieAns !== 2) {
      issues.push({ path: "features.garantieAns", value: String(doc.features.garantieAns), cleaned: 2 });
    }
    if (issues.length > 0) flagged.push({ doc, issues });
  }
  console.log(
    `\n📄 Garanties produit (matelas / sommiers / oreillers → 2 ans ; lits coffre exclus) — ${flagged.length}/${docs.length} document(s) à corriger\n`,
  );
  for (const { doc, issues } of flagged) {
    console.log(`  · ${doc.productType} · ${doc._id}${doc.slug?.current ? ` (/${doc.slug.current})` : ""}`);
    for (const issue of issues) {
      console.log(`      ${issue.path} : ${issue.value} → ${issue.cleaned}`);
    }
  }
  return flagged;
}

async function main() {
  console.log(`\n🧹 Nettoyage livraison / garantie / essai — mode ${DRY ? "DRY (liste seulement)" : "PUBLISH (patch appliqué)"}\n`);
  console.log(`   Projet: ${projectId} · Dataset: ${dataset}\n`);

  const productIssues = await scan(
    // `{...}` : on inspecte TOUS les champs texte du produit (advantages,
    // tips, audiences, careSteps, extraCta, description…) et pas seulement
    // une poignée. Sans risque : le patch reste partiel (.patch().set()).
    `*[_type == "product"]{ ... }`,
    "Produits (tous champs texte : livraison, garantie, FAQ, avantages, conseils…)",
  );

  const landingIssues = await scan(
    `*[_type == "landingPage"]{ _id, _type, _rev, h1, slug, intro, sections }`,
    "Landings SEO",
  );

  const staticIssues = await scan(
    `*[_type == "staticPage"]{ _id, _type, _rev, title, slug, excerpt, body }`,
    "Pages statiques (aide, légal, marque, services)",
  );

  const guideIssues = await scan(
    `*[_type == "guide"]{ _id, _type, _rev, title, slug, excerpt, body }`,
    "Guides magazine",
  );

  const homepageIssues = await scan(
    `*[_type == "homepage"]{ ... }`,
    "Homepage singleton (hero, mosaic, USP, advantages, FAQ, testimonials, quiz CTA…)",
  );

  const showroomsPageIssues = await scan(
    `*[_type == "showroomsPage"]{ ... }`,
    "Page Magasins singleton (hero, argumentaire, FAQ)",
  );

  const quizPageIssues = await scan(
    `*[_type == "quizPage"]{ ... }`,
    "Page Quiz singleton (méthode, critères, pièges, FAQ)",
  );

  const settingsIssues = await scan(
    `*[_type == "siteSettings"]{ ... }`,
    "Paramètres du site (topbar, footer, bandeau éditorial)",
  );

  const warrantyIssues = await scanWarranty();

  const all = [
    ...warrantyIssues,
    ...productIssues,
    ...landingIssues,
    ...staticIssues,
    ...guideIssues,
    ...homepageIssues,
    ...showroomsPageIssues,
    ...quizPageIssues,
    ...settingsIssues,
  ];

  console.log(`\n═══════════════════════════════════════════════`);
  console.log(`Total : ${all.length} document(s) à nettoyer.`);
  console.log(`═══════════════════════════════════════════════\n`);

  if (DRY) {
    console.log(`💡 Mode DRY — aucun changement appliqué.\n   Relance avec --publish pour patcher.\n`);
  } else {
    await applyPatches(all);
  }
}

main().catch((err) => {
  console.error("❌", err.stack || err.message);
  process.exit(1);
});
