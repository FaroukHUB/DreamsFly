#!/usr/bin/env node
/**
 * Migration : nettoie les mentions "Livraison offerte / gratuite / dès X €"
 * saisies en base Sanity — sur les champs :
 *  - product.deliveryOverride.price
 *  - product.deliveryOverride.perks[]
 *  - landingPage.sections[].* (portable text callouts, si présents)
 *  - staticPage.body[].* (portable text)
 *
 * Par défaut : mode DRY (liste seulement). Ajouter --publish pour appliquer.
 *
 * Politique cible :
 *  - "Livraison offerte dès 39 €"  → "Livraison — 99 € forfait national"
 *  - "Livraison offerte"           → "Livraison à domicile (99 €)"
 *  - "Livraison gratuite"          → "Livraison à domicile (99 €)"
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

/** Nettoie une string en remplaçant les formulations à bannir. */
function cleanString(s) {
  if (!s || typeof s !== "string") return s;
  let out = s;
  out = out.replace(OFFERED_RE, "Livraison à domicile (99 €)");
  out = out.replace(FRAIS_RE, "Frais de livraison 99 €");
  return out;
}

function hasIssue(s) {
  return typeof s === "string" && (OFFERED_RE.test(s) || FRAIS_RE.test(s));
}
// note : les regex ont le flag /g → il faut reset lastIndex à chaque test
OFFERED_RE.lastIndex = 0;
FRAIS_RE.lastIndex = 0;

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
    `*[_type == "product"]{ _id, _type, _rev, name, slug, deliveryOverride }`,
    "Produits (deliveryOverride)",
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

  const all = [...productIssues, ...landingIssues, ...staticIssues, ...guideIssues];

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
