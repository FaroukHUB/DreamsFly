#!/usr/bin/env node
/**
 * Migration : set productType="matelas" sur tous les produits qui n'ont pas
 * de productType défini (typiquement les anciens matelas importés avant
 * l'ajout du champ productType).
 *
 * Après cette migration, tu peux filtrer strictement partout par productType
 * sans avoir besoin du fallback !defined(productType).
 *
 * IDEMPOTENT — ne touche que les docs sans productType. Rerun safe.
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj \
 *   SANITY_WRITE_TOKEN=sk... \
 *   node scripts/fix-product-types.mjs [--dry|--publish]
 */

import { createClient } from "@sanity/client";

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

async function main() {
  console.log(`\n▶ Fix productType — ${DRY ? "DRY RUN" : PUBLISH ? "PUBLISH direct" : "DRAFT"}\n`);

  const docs = await client.fetch(
    `*[_type == "product" && !defined(productType) && !(_id in path("drafts.**"))]{ _id, name, title }`
  );

  console.log(`${docs.length} produit(s) sans productType.\n`);

  if (docs.length === 0) {
    console.log(`✅ Tout est bon — chaque produit a déjà un productType.\n`);
    return;
  }

  for (const d of docs) {
    console.log(`  ✏️  ${d.name || d.title || d._id} → productType = "matelas"`);
    if (DRY) continue;

    const targetId = PUBLISH ? d._id : `drafts.${d._id}`;

    try {
      if (!PUBLISH) {
        const existing = await client.getDocument(targetId);
        if (!existing) {
          const published = await client.getDocument(d._id);
          await client.createIfNotExists({ ...published, _id: targetId });
        }
      }
      await client.patch(targetId).set({ productType: "matelas" }).commit();
    } catch (err) {
      console.error(`     ❌ échec : ${err.message}`);
    }
  }

  console.log(`\n✅ Terminé. ${docs.length} produit(s) mis à jour.\n`);
  if (!PUBLISH && !DRY) {
    console.log(`ℹ️  Modifications en DRAFT. Publie-les dans Sanity Studio, ou relance avec --publish.\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
