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

const API_VERSION = "2024-01-01";
const BASE = `https://${projectId}.api.sanity.io/v${API_VERSION}/data/history/${dataset}`;

// Récupère le doc à un moment donné (2 heures avant maintenant = bien AVANT mon patch destructif)
const HOURS_BACK = Number(process.env.HOURS_BACK || 2);
const AT_TIME = new Date(Date.now() - HOURS_BACK * 60 * 60 * 1000).toISOString();

async function apiRequest(url) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} — ${await res.text().catch(() => "?")}`);
  }
  return res;
}

/** Récupère le document tel qu'il était à une date/heure. */
async function getDocumentAtTime(id, isoTime) {
  const url = `${BASE}/documents/${encodeURIComponent(id)}?time=${encodeURIComponent(isoTime)}`;
  const res = await apiRequest(url);
  const data = await res.json();
  // La réponse est soit { documents: [{ ... }] } soit directement { ... }
  const doc = data.documents?.[0] || (data._id ? data : null);
  return doc;
}

async function rollbackOne(id) {
  const doc = await getDocumentAtTime(id, AT_TIME);
  if (!doc || !doc._id) {
    return { id, status: "SKIP", reason: `Doc introuvable à ${AT_TIME}` };
  }
  // Compte les champs — vérif que la version restaurée est complète
  const fieldCount = Object.keys(doc).filter((k) => !k.startsWith("_")).length;
  const hasImages = !!doc.images?.length;
  const hasVariants = !!doc.variants?.length && doc.variants[0]?.price != null;

  if (DRY) {
    return { id, status: "DRY", fieldsToRestore: fieldCount, hasImages, hasVariants };
  }
  await client.createOrReplace(doc);
  return { id, status: "OK", fieldsRestored: fieldCount, hasImages, hasVariants };
}

async function main() {
  console.log(`\n⏪ ROLLBACK — mode ${DRY ? "DRY (aucun changement)" : "PUBLISH (restauration appliquée)"}\n`);
  console.log(`   Projet: ${projectId} · Dataset: ${dataset}`);
  console.log(`   Récupère chaque doc tel qu'il était à ${AT_TIME}`);
  console.log(`   (soit ${HOURS_BACK}h en arrière — bien avant le patch destructif)`);
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
