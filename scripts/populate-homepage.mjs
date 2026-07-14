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
  { _key: k(), name: "Matelas", promo: "Jusqu'à -40%", link: "/matelas" },
  { _key: k(), name: "Lits", promo: "Design & confort", link: "/lits" },
  { _key: k(), name: "Sommiers", promo: "Jusqu'à -30%", link: "/sommiers" },
  { _key: k(), name: "Oreillers", promo: "Confort cervical", link: "/oreillers" },
];

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

function isEmpty(v) {
  if (v === undefined || v === null) return true;
  if (Array.isArray(v)) return v.length === 0;
  return false;
}

async function main() {
  console.log(`\n▶ Migration Page d'accueil — ${DRY ? "DRY RUN" : PUBLISH ? "PUBLISH direct" : "DRAFT"}\n`);

  const doc = await client.fetch(
    `*[_type == "homepage" && !(_id in path("drafts.**"))][0]{ _id, mosaicCollections, categoryTiles }`
  );

  if (!doc) {
    console.log("⚠️  Aucun document Page d'accueil publié trouvé. Crée-le d'abord dans Sanity Studio.");
    process.exit(1);
  }

  const patch = {};

  if (isEmpty(doc.mosaicCollections)) {
    patch.mosaicCollections = MOSAIC_CARDS;
    console.log(`  ✏️  mosaicCollections : ${MOSAIC_CARDS.length} cards à ajouter`);
  } else {
    console.log(`  ⏭️  mosaicCollections déjà rempli (${doc.mosaicCollections.length} cards) — non touché`);
  }

  if (isEmpty(doc.categoryTiles)) {
    patch.categoryTiles = CATEGORY_TILES;
    console.log(`  ✏️  categoryTiles : ${CATEGORY_TILES.length} tuiles à ajouter`);
  } else {
    console.log(`  ⏭️  categoryTiles déjà rempli (${doc.categoryTiles.length} tuiles) — non touché`);
  }

  if (Object.keys(patch).length === 0) {
    console.log(`\n✅ Rien à faire — les 2 sections sont déjà remplies.\n`);
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
