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
 *  · "Livraison offerte / gratuite / incluse" → "Livraison à domicile (99 €)"
 *  · "Frais de port offerts / gratuits"      → "Frais de livraison 99 €"
 *  · "15 ans de garantie" / "Garantie 15 ans" → "Garantie fabricant"
 *  · "100 nuits d'essai" / "Essai 100 nuits"  → "Essai en showroom"
 *  · "essai 100 nuits" (minuscule)            → "essai en showroom"
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

// Regex catch-all pour les formulations à supprimer
const OFFERED_RE = /livraison\s+(offerte|gratuite|incluse)(?:\s+d[eè]s\s+\d+\s*€?)?/gi;
const FRAIS_RE = /frais\s+de\s+port\s+(offerts?|gratuits?|nuls?)/gi;
const WARRANTY15_RE = /(garantie\s+(?:de\s+)?15\s*ans|15\s*ans\s+de\s+garantie)/gi;
const NUITS100_RE = /(essai\s+100\s*nuits|100\s*nuits\s+d['e]?\s*essai|nuit\s+d['e]?\s*essai\s+100\s*nuits)/gi;

/** Nettoie une string en remplaçant les formulations à bannir. */
function cleanString(s) {
  if (!s || typeof s !== "string") return s;
  let out = s;
  out = out.replace(OFFERED_RE, "Livraison à domicile (99 €)");
  out = out.replace(FRAIS_RE, "Frais de livraison 99 €");
  out = out.replace(WARRANTY15_RE, (m) => (m[0] === m[0].toUpperCase() ? "Garantie fabricant" : "garantie fabricant"));
  out = out.replace(NUITS100_RE, (m) => (m[0] === m[0].toUpperCase() ? "Essai en showroom" : "essai en showroom"));
  return out;
}

function hasIssue(s) {
  if (typeof s !== "string") return false;
  OFFERED_RE.lastIndex = FRAIS_RE.lastIndex = WARRANTY15_RE.lastIndex = NUITS100_RE.lastIndex = 0;
  return OFFERED_RE.test(s) || FRAIS_RE.test(s) || WARRANTY15_RE.test(s) || NUITS100_RE.test(s);
}
// reset lastIndex après la déclaration
OFFERED_RE.lastIndex = FRAIS_RE.lastIndex = WARRANTY15_RE.lastIndex = NUITS100_RE.lastIndex = 0;

/** Parcourt récursivement une valeur pour trouver toutes les strings problématiques. */
function findIssues(node, path = "") {
  const issues = [];
  if (node == null) return issues;
  if (typeof node === "string") {
    if (hasIssue(node)) issues.push({ path, value: node, cleaned: cleanString(node) });
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
  console.log(`\n🩹 Application de ${flagged.length} patch(s)…\n`);
  for (const { doc, issues } of flagged) {
    // On patche le DRAFT si un draft existe, sinon la version publiée + on republie via createOrReplace après avoir manipulé.
    // Le plus simple et sûr : muter directement le doc récupéré (déjà en mémoire), puis createOrReplace.
    let mutated = JSON.parse(JSON.stringify(doc));
    for (const { path, cleaned } of issues) {
      setDeep(mutated, path, cleaned);
    }
    await client.createOrReplace(mutated);
    console.log(`  ✅ ${doc._id}${doc.slug?.current ? ` (/${doc.slug.current})` : ""} — ${issues.length} champ(s) mis à jour`);
  }
  console.log(`\n💡 Republication effectuée sur les documents PUBLIÉS ci-dessus.\n`);
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

async function main() {
  console.log(`\n🧹 Nettoyage mentions livraison offerte / gratuite — mode ${DRY ? "DRY (liste seulement)" : "PUBLISH (patch appliqué)"}\n`);
  console.log(`   Projet: ${projectId} · Dataset: ${dataset}\n`);

  const productIssues = await scan(
    `*[_type == "product"]{ _id, _type, _rev, name, slug, deliveryOverride, warrantyOverride, tagline, productFaq, highlights }`,
    "Produits (deliveryOverride, warrantyOverride, tagline, FAQ, highlights)",
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

  const all = [
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
