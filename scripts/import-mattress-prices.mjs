#!/usr/bin/env node
/**
 * Import des prix matelas depuis le fichier tarifaire DreamsFly.
 *
 * Pour chaque matelas (par nom) et chaque taille, met à jour dans Sanity :
 *   - variants[].price          = NEW PRIX (baseline affiché sur le site)
 *   - variants[].compareAtPrice = PRIX BARRE (prix barré)
 *   - variants[].costPrice      = PA (invisible public, affiche marge en Studio)
 *
 * Modèles importés (nettoyés — doublons NEw NY / NEW LAS VEGAS retirés,
 * SIDNEY renommé SYDNEY, typos corrigées) :
 *   Entrée/Confort (-30%) : MILAN, BERLIN, LONDRES, BARCELONE
 *   Premium (-20%)        : SINGAPOUR, SYDNEY, LAS VEGAS, DUBAI
 *   Nouveaux (-20%)       : MONACO, NEW YORK
 *   Complémentaires (-30%): SURMAT 5CM, ECO 21CM
 *   Haut de gamme partiels (160/180 uniquement) : SAINT GERMAIN, AUTEUIL, ST CLOUD
 *
 * Matching :
 *   - Nom du produit : match FUZZY sur product.name (case-insensitive, sans accents)
 *   - Taille : match FUZZY par extraction des 2 nombres (140x190 = 140 × 190 cm = 140/190)
 *
 * IDEMPOTENT — rerun safe. Met à jour uniquement les variants qui matchent.
 * Ne crée pas de nouveaux produits : si un modèle n'existe pas dans Sanity,
 * il est loggé mais ignoré (à créer manuellement).
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj \
 *   SANITY_WRITE_TOKEN=sk... \
 *   node scripts/import-mattress-prices.mjs [--dry|--publish]
 */

import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error("SANITY_PROJECT_ID manquant");
if (!token) throw new Error("SANITY_WRITE_TOKEN manquant (rôle Editor minimum)");

const DRY = process.argv.includes("--dry");
const PUBLISH = process.argv.includes("--publish");

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

// ─────────────────────────────────────────────────────────────
// DATA — prix nettoyés
// Format par ligne : [size, PA, prixBarre, prixAffiche]
// ─────────────────────────────────────────────────────────────

const PRICES = {
  MILAN: [
    ["90x190", 74, 356, 249],
    ["90x200", 76, 356, 249],
    ["100x200", 79, 427, 299],
    ["140x190", 98, 427, 299],
    ["140x200", 103, 427, 299],
    ["160x200", 118, 499, 349],
    ["180x200", 137, 570, 399],
    ["200x200", 156, 713, 499],
  ],
  BERLIN: [
    ["90x190", 91, 641, 449],
    ["90x200", 94, 641, 449],
    ["100x200", 99, 684, 479],
    ["140x190", 131, 713, 499],
    ["140x200", 140, 713, 499],
    ["160x200", 157, 784, 549],
    ["180x200", 179, 856, 599],
    ["200x200", 205, 999, 699],
  ],
  LONDRES: [
    ["90x190", 112, 427, 299],
    ["90x200", 117, 499, 349],
    ["100x200", 125, 570, 399],
    ["140x190", 153, 784, 549],
    ["140x200", 163, 784, 549],
    ["160x200", 177, 856, 599],
    ["180x200", 206, 927, 649],
    ["200x200", 229, 1070, 749],
  ],
  BARCELONE: [
    ["90x190", 125, 570, 399],
    ["90x200", 130, 570, 399],
    ["100x200", 138, 641, 449],
    ["140x190", 169, 856, 599],
    ["140x200", 178, 856, 599],
    ["160x200", 202, 929, 650],
    ["180x200", 225, 999, 699],
    ["200x200", 248, 1141, 799],
  ],
  SINGAPOUR: [
    ["90x190", 155, 686, 549],
    ["90x200", 159, 686, 549],
    ["100x200", 167, 724, 579],
    ["140x190", 204, 874, 699],
    ["140x200", 216, 874, 699],
    ["160x200", 234, 936, 749],
    ["180x200", 258, 999, 799],
    ["200x200", 289, 1124, 899],
  ],
  SYDNEY: [
    ["90x190", 175, 724, 579],
    ["90x200", 179, 724, 579],
    ["100x200", 186, 749, 599],
    ["140x190", 237, 999, 799],
    ["140x200", 249, 999, 799],
    ["160x200", 273, 1124, 899],
    ["180x200", 307, 1186, 949],
    ["200x200", 341, 1311, 1049],
  ],
  "LAS VEGAS": [
    ["90x190", 196, 811, 649],
    ["90x200", 203, 811, 649],
    ["100x200", 209, 874, 699],
    ["140x190", 268, 1124, 899],
    ["140x200", 280, 1124, 899],
    ["160x200", 300, 1186, 949],
    ["180x200", 331, 1311, 1049],
    ["200x200", 359, 1436, 1149],
  ],
  DUBAI: [
    ["90x190", 247, 1249, 999],
    ["90x200", 252, 1249, 999],
    ["100x200", 263, 1249, 999],
    ["140x190", 313, 1624, 1299],
    ["140x200", 328, 1749, 1399],
    ["160x200", 353, 1874, 1499],
    ["180x200", 383, 2124, 1699],
    ["200x200", 409, 2499, 1999],
  ],
  MONACO: [
    ["90x190", 250, 1150, 649],
    ["90x200", 260, 1150, 649],
    ["100x200", 270, 1174, 699],
    ["140x190", 310, 1324, 899],
    ["140x200", 310, 1324, 899],
    ["160x200", 330, 1386, 949],
    ["180x200", 350, 1511, 1049],
    ["200x200", 400, 1675, 1149],
  ],
  "NEW YORK": [
    ["90x190", 247, 1210, 999],
    ["90x200", 252, 1210, 999],
    ["100x200", 263, 1249, 999],
    ["140x190", 313, 1324, 1299],
    ["140x200", 328, 1324, 1399],
    ["160x200", 315, 1574, 1499],
    ["180x200", 344, 1824, 1699],
    ["200x200", 380, 2099, 1999],
  ],
  "SURMAT 5CM": [
    ["90x190", 42, 141, 99],
    ["90x200", 42, 141, 99],
    ["100x200", 44, 157, 110],
    ["140x190", 52, 184, 129],
    ["140x200", 56, 199, 139],
    ["160x200", 62, 213, 149],
    ["180x200", 69, 256, 179],
    ["200x200", 73, 284, 199],
  ],
  "ECO 21CM": [
    ["90x190", 68, 570, 399],
    ["90x200", 70, 570, 399],
    ["100x200", 74, 641, 449],
    ["140x190", 90, 856, 599],
    ["140x200", 96, 856, 599],
    ["160x200", 108, 929, 650],
    ["180x200", 123, 999, 699],
    ["200x200", 140, 1141, 799],
  ],
  "SAINT GERMAIN": [
    ["160x200", 154, 799, 559],
    ["180x200", 170, 899, 629],
  ],
  AUTEUIL: [
    ["160x200", 157, 899, 629],
    ["180x200", 179, 999, 699],
  ],
  "ST CLOUD": [
    ["160x200", 118, 699, 489],
    ["180x200", 137, 799, 559],
  ],
};

// ─────────────────────────────────────────────────────────────
// Utils
// ─────────────────────────────────────────────────────────────

function normalizeName(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // retire accents
    .replace(/[^a-z0-9]+/g, "") // retire tout sauf lettres/chiffres
    .trim();
}

function extractDims(s) {
  if (!s) return null;
  const m = String(s).match(/(\d{2,3})\s*[xX×/\-]\s*(\d{2,3})/);
  if (!m) return null;
  return [parseInt(m[1], 10), parseInt(m[2], 10)].sort((a, b) => a - b);
}

function dimsEqual(a, b) {
  if (!a || !b || a.length !== 2 || b.length !== 2) return false;
  return a[0] === b[0] && a[1] === b[1];
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n▶ Import prix matelas — ${DRY ? "DRY RUN" : PUBLISH ? "PUBLISH direct" : "DRAFT"}\n`);

  const products = await client.fetch(
    `*[_type == "product" && (productType == "matelas" || !defined(productType)) && !(_id in path("drafts.**"))]{
      _id, name, title, variants[]{_key, size, price, compareAtPrice, costPrice}
    }`
  );

  console.log(`${products.length} matelas trouvés dans Sanity.\n`);

  // Index par nom normalisé
  const productsByName = new Map();
  for (const p of products) {
    const key = normalizeName(p.name);
    if (!productsByName.has(key)) productsByName.set(key, []);
    productsByName.get(key).push(p);
  }

  let totalUpdates = 0;
  let totalNotFound = 0;

  for (const [modelName, rows] of Object.entries(PRICES)) {
    const key = normalizeName(modelName);
    const matches = productsByName.get(key) || [];

    if (matches.length === 0) {
      console.log(`⚠️  ${modelName} — aucun produit correspondant dans Sanity (à créer manuellement)`);
      totalNotFound++;
      continue;
    }

    console.log(`\n📦 ${modelName} — ${matches.length} fiche(s) trouvée(s), ${rows.length} taille(s) à patcher`);

    for (const product of matches) {
      const variants = product.variants || [];
      const updatedVariants = variants.map((v) => {
        const vDims = extractDims(v.size);
        if (!vDims) return v;
        const row = rows.find(([sz]) => dimsEqual(extractDims(sz), vDims));
        if (!row) return v;
        const [, pa, prixBarre, prixAffiche] = row;
        return {
          ...v,
          price: prixAffiche,
          compareAtPrice: prixBarre,
          costPrice: pa,
        };
      });

      // Compte réels changements
      const changes = updatedVariants.filter((v, i) => {
        const orig = variants[i];
        return (
          orig.price !== v.price ||
          orig.compareAtPrice !== v.compareAtPrice ||
          orig.costPrice !== v.costPrice
        );
      });

      if (changes.length === 0) {
        console.log(`   ⏭️  "${product.title || product.name}" — déjà à jour`);
        continue;
      }

      console.log(`   ✏️  "${product.title || product.name}" — ${changes.length} variante(s) à patcher`);
      for (const v of changes) {
        console.log(`      → ${v.size} : ${v.price} € (barré ${v.compareAtPrice}, PA ${v.costPrice})`);
      }

      if (DRY) {
        totalUpdates += changes.length;
        continue;
      }

      const targetId = PUBLISH ? product._id : `drafts.${product._id.replace(/^drafts\./, "")}`;
      try {
        if (!PUBLISH) {
          const existing = await client.getDocument(targetId);
          if (!existing) {
            const published = await client.getDocument(product._id);
            await client.createIfNotExists({ ...published, _id: targetId });
          }
        }
        await client.patch(targetId).set({ variants: updatedVariants }).commit({ autoGenerateArrayKeys: true });
        totalUpdates += changes.length;
      } catch (err) {
        console.error(`      ❌ Échec patch : ${err.message}`);
      }
    }
  }

  console.log(
    `\n✅ Terminé. ${totalUpdates} variante(s) mise(s) à jour · ${totalNotFound} modèle(s) manquant(s) dans Sanity`
  );
  if (!DRY && !PUBLISH) {
    console.log(`ℹ️  Modifications en DRAFT — publie chaque fiche dans Studio ou relance avec --publish.\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
