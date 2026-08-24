#!/usr/bin/env node
/**
 * ROLLBACK URGENT — restaure les 40 produits détruits par
 * cleanup-delivery-mentions.mjs (version buggée qui a utilisé
 * createOrReplace au lieu de patch partiel).
 *
 * Utilise l'API History de Sanity pour :
 *  1. Récupérer la liste des transactions sur chaque doc
 *  2. Identifier la transaction JUSTE AVANT ma mutation destructrice
 *  3. Fetch le document tel qu'il était à cette révision
 *  4. Le rebalance en base via createOrReplace (safe car doc COMPLET)
 *
 * Mode DRY par défaut — n'écrit rien, montre ce qui va être restauré.
 * Ajouter --publish pour appliquer.
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj SANITY_WRITE_TOKEN=sk... \
 *     node scripts/rollback-destroyed-products.mjs [--publish]
 */

import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error("SANITY_PROJECT_ID manquant");
if (!token) throw new Error("SANITY_WRITE_TOKEN manquant");

const PUBLISH = process.argv.includes("--publish");
const DRY = !PUBLISH;

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

// Les 40 IDs affectés — extraits du log d'exécution du script buggé
const AFFECTED_IDS = [
  "drafts.product-lit-coffre-murcia-en-velours-beige-avec-sommier-et-tete-de-lit-inclus",
  "product-lit-coffre-90x190-cm-alma-en-velours-blanc-avec-sommier-et-tete-de-lit-inclus",
  "product-lit-coffre-90x190-cm-cloute-en-velours-beige-avec-sommier-et-tete-de-lit-capitonnee-inclus",
  "product-lit-coffre-90x190-cm-jade-en-tissu-blanc-avec-sommier-et-tete-de-lit-inclus",
  "product-lit-coffre-90x190-cm-rio-en-velours-beige-avec-sommier-et-tete-de-lit-inclus",
  "product-lit-coffre-alma-en-velours-beige-avec-sommier-et-tete-de-lit-inclus-copie",
  "product-lit-coffre-athene-en-velours-blanc-casse-avec-sommier-et-tete-de-lit-inclus-copie",
  "product-lit-coffre-bianca-en-velours-blanc-ecru-avec-sommier-et-tete-de-lit-inclus-copie",
  "product-lit-coffre-celia-blanc-casse-en-velours-copie",
  "product-lit-coffre-cloute-en-velours-avec-sommier-et-avec-sommier-et-tete-de-lit-capitonnee-inclus-copie",
  "product-lit-coffre-coco-en-velours-beige-avec-sommier-et-tete-de-lit-inclus-copie",
  "product-lit-coffre-jade-en-tissu-blanc-casse-avec-sommier-et-tete-de-lit-inclus-copie",
  "product-lit-coffre-lunea-en-tissu-blanc-ecru-avec-sommier-et-tete-de-lit-inclus-copie",
  "product-lit-coffre-maya-en-tissu-blanc-casse-avec-sommier-et-tete-de-lit-inclus-copie",
  "product-lit-coffre-ratuna-en-velours-avec-sommier-et-tete-de-lit-inclus-copie",
  "product-lit-coffre-rio-en-velours-beige-avec-sommier-et-tete-de-lit-inclus-copie",
  "product-lit-coffre-salvador-en-tissu-blanc-casse-avec-sommier-et-tete-de-lit-inclus-copie",
  "product-lit-coffre-stellia-en-tissu-beige-avec-sommier-et-tete-de-lit-inclus-copie",
  "product-lit-coffre-sydney-beige-en-velours-copie",
  "product-lit-coffre-tokyo-en-velours-beige-avec-sommier-et-tete-de-lit-inclus-copie",
  "product-matelas-ferme-1-place-90x190-cm-berlin-en-mousse-polyurethane",
  "product-matelas-ferme-1-place-90x190-cm-las-vegas-mousse-a-memoire-de-forme-et-ressorts-ensaches",
  "product-matelas-ferme-1-place-90x190-cm-milan-en-mousse-polyurethane",
  "product-matelas-ferme-2-places-140x190-cm-berlin-en-mousse-polyurethane",
  "product-matelas-ferme-2-places-140x190-cm-las-vegas-mousse-a-memoire-de-forme-et-ressorts-ensaches",
  "product-matelas-ferme-2-places-140x190-cm-milan-en-mousse-polyurethane",
  "product-matelas-ferme-2-places-140x190-cm-monaco-en-mousse-a-memoire-de-forme-et-ressorts-ensaches",
  "product-matelas-mi-ferme-1-place-90x190-cm-barcelone-en-mousse-et-ressorts-ensaches",
  "product-matelas-mi-ferme-1-place-90x190-cm-londres-en-mousse-polyurethane",
  "product-matelas-mi-ferme-1-place-90x190-cm-new-york-en-mousse-a-memoire-de-forme-et-ressorts-ensaches",
  "product-matelas-mi-ferme-1-place-90x190-cm-sydney-en-mousse-polyurethane-et-ressorts-ensaches",
  "product-matelas-mi-ferme-2-places-140x190-cm-barcelone-en-mousse-et-ressorts-ensaches",
  "product-matelas-mi-ferme-2-places-140x190-cm-dubai-en-mousse-et-ressorts-ensaches",
  "product-matelas-mi-ferme-2-places-140x190-cm-londres-en-mousse-polyurethane",
  "product-matelas-mi-ferme-2-places-140x190-cm-new-york-en-mousse-a-memoire-de-forme-et-ressorts-ensaches",
  "product-matelas-mi-ferme-2-places-140x190-cm-sydney-en-mousse-polyurethane-et-ressorts-ensaches",
  "product-matelas-moelleux-1-place-90x190-cm-singapour-en-mousse-polyurethane-et-ressorts-ensaches",
  "product-matelas-moelleux-2-places-140x190-cm-singapour-en-mousse-polyurethane-et-ressorts-ensaches",
  "product-matelas-st-germain-ressorts-ensaches-30-cm-mi-ferme",
  "product-sydney-180-200",
];

const API_VERSION = "2021-06-07";
const BASE = `https://${projectId}.api.sanity.io/v${API_VERSION}/data/history/${dataset}`;

async function apiRequest(url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} — ${await res.text().catch(() => "?")}`);
  }
  return res;
}

/** Récupère la liste des transactions sur un doc, du plus récent au plus ancien. */
async function getTransactions(id) {
  const url = `${BASE}/transactions?documentIds=${encodeURIComponent(id)}&excludeContent=true`;
  const res = await apiRequest(url);
  const text = await res.text();
  const lines = text.trim().split("\n").filter((l) => l);
  const txs = lines.map((l) => JSON.parse(l));
  // sort du plus récent au plus ancien
  txs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return txs;
}

/** Récupère le document tel qu'il était à une révision spécifique. */
async function getDocumentAtRevision(id, revision) {
  const url = `${BASE}/documents/${encodeURIComponent(id)}?revision=${revision}`;
  const res = await apiRequest(url);
  const data = await res.json();
  // La réponse est { documents: [ { ... } ] }
  const doc = data.documents?.[0] || data;
  return doc;
}

async function rollbackOne(id) {
  const txs = await getTransactions(id);
  if (txs.length < 2) {
    return { id, status: "SKIP", reason: `Une seule transaction ou moins (${txs.length})` };
  }
  // txs[0] = ma mutation destructrice (la plus récente)
  // txs[1] = la version PRÉCÉDENTE, à restaurer
  const destructiveTx = txs[0];
  const priorTx = txs[1];
  const doc = await getDocumentAtRevision(id, priorTx.id);
  if (!doc || !doc._id) {
    return { id, status: "SKIP", reason: `Doc introuvable à la révision ${priorTx.id.slice(0, 10)}` };
  }
  // Compte le nombre de champs récupérés pour vérifier qu'on restaure bien un doc complet
  const fieldCount = Object.keys(doc).filter((k) => !k.startsWith("_")).length;
  if (DRY) {
    return {
      id,
      status: "DRY",
      priorTx: priorTx.id.slice(0, 10),
      destructiveTx: destructiveTx.id.slice(0, 10),
      fieldsToRestore: fieldCount,
      timestamp: priorTx.timestamp,
      hasImages: !!doc.images?.length,
      hasVariants: !!doc.variants?.length,
    };
  }
  // Restaure — createOrReplace SAFE car doc COMPLET
  await client.createOrReplace(doc);
  return {
    id,
    status: "OK",
    priorTx: priorTx.id.slice(0, 10),
    fieldsRestored: fieldCount,
    hasImages: !!doc.images?.length,
    hasVariants: !!doc.variants?.length,
  };
}

async function main() {
  console.log(`\n⏪ ROLLBACK — mode ${DRY ? "DRY (aucun changement)" : "PUBLISH (restauration appliquée)"}\n`);
  console.log(`   Projet: ${projectId} · Dataset: ${dataset}`);
  console.log(`   ${AFFECTED_IDS.length} produits à restaurer\n`);

  const results = [];
  let ok = 0;
  let ko = 0;
  let skip = 0;

  for (const id of AFFECTED_IDS) {
    process.stdout.write(`  · ${id.slice(0, 70).padEnd(72)}`);
    try {
      const r = await rollbackOne(id);
      results.push(r);
      if (r.status === "OK" || r.status === "DRY") {
        ok++;
        const imgFlag = r.hasImages ? "img✓" : "img✗";
        const varFlag = r.hasVariants ? "prix✓" : "prix✗";
        console.log(`  ${r.status}  ${r.fieldsToRestore || r.fieldsRestored} champs  ${imgFlag} ${varFlag}`);
      } else {
        skip++;
        console.log(`  ${r.status}  ${r.reason}`);
      }
    } catch (err) {
      ko++;
      console.log(`  ❌  ${err.message}`);
      results.push({ id, status: "ERROR", error: err.message });
    }
  }

  console.log(`\n═══════════════════════════════════════════════`);
  console.log(`  ✅ OK/DRY : ${ok}`);
  console.log(`  ⏭  SKIP  : ${skip}`);
  console.log(`  ❌ ERROR : ${ko}`);
  console.log(`═══════════════════════════════════════════════\n`);

  if (DRY) {
    console.log(`💡 Mode DRY — aucun changement appliqué.\n   Vérifie que "img✓ prix✓" apparaît pour chaque ligne (preuve que la version restaurée contient bien les images et variantes).\n   Puis relance avec --publish pour restaurer réellement.\n`);
  }
}

main().catch((err) => {
  console.error("\n❌ ERREUR FATALE:", err.stack || err.message);
  process.exit(1);
});
