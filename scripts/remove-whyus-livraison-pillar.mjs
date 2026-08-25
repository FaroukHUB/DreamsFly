#!/usr/bin/env node
/**
 * One-shot : retire le 6e pilier (Livraison) de la section 'Notre différence'
 * dans le doc homepage Sanity. Utilise .patch().unset() ciblé — safe, ne
 * touche à aucun autre champ.
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj SANITY_WRITE_TOKEN=sk... \
 *     node scripts/remove-whyus-livraison-pillar.mjs [--publish]
 */

import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId) throw new Error("SANITY_PROJECT_ID manquant");
if (!token) throw new Error("SANITY_WRITE_TOKEN manquant");

const PUBLISH = process.argv.includes("--publish");
const client = createClient({
  projectId,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

async function main() {
  console.log(`\n🧹 Retrait du pilier "Livraison" — mode ${PUBLISH ? "PUBLISH" : "DRY"}\n`);

  const doc = await client.getDocument("homepage");
  if (!doc?.whyUs?.pillars) {
    console.log("Doc homepage introuvable ou pas de pillars.");
    return;
  }
  const before = doc.whyUs.pillars.length;
  const filtered = doc.whyUs.pillars.filter(
    (p) => !/livraison/i.test(p.title || "") && !/livraison/i.test(p.text || ""),
  );
  const removed = before - filtered.length;
  console.log(`  · Avant : ${before} piliers`);
  console.log(`  · Après : ${filtered.length} piliers (${removed} retiré${removed > 1 ? "s" : ""})`);

  if (removed === 0) {
    console.log("\n✅ Aucun pilier 'Livraison' trouvé — rien à faire.\n");
    return;
  }

  if (!PUBLISH) {
    console.log(`\n🌵 Mode DRY — relance avec --publish pour appliquer.\n`);
    return;
  }

  // Patch partiel — ne touche QUE ce champ
  await client.patch("homepage").set({ "whyUs.pillars": filtered }).commit();
  console.log(`\n✅ Doc homepage patché — pilier "Livraison" retiré.\n`);
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
