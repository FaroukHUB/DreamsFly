#!/usr/bin/env node
/**
 * Migration : crée 3 skeleton de showrooms (Paris, Lyon, Marseille par défaut).
 * Après le run, il te reste à :
 *   1. Ouvrir chaque showroom dans Studio → /studio/desk/showroom
 *   2. Coller l'adresse exacte, tel, horaires depuis tes fiches Google Maps
 *   3. Uploader 2-3 photos de la vitrine
 *
 * Les slugs sont fixés pour ne pas casser les URLs /magasins/[slug] si tu relies
 * plus tard des CTA. Change ADRESSES ci-dessous si besoin.
 *
 * IDEMPOTENT — ne recrée pas un showroom si son slug existe déjà.
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj \
 *   SANITY_WRITE_TOKEN=sk... \
 *   node scripts/populate-showrooms.mjs [--dry|--publish]
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
// 3 SKELETONS — remplis les adresses réelles dans Studio après
// ─────────────────────────────────────────────────────────────
const SHOWROOMS = [
  {
    slug: "paris",
    name: "DreamsFly Paris",
    address: {
      street: "À compléter dans Sanity Studio",
      postalCode: "75000",
      city: "Paris",
      country: "France",
    },
    phone: "+33 1 00 00 00 00",
  },
  {
    slug: "lyon",
    name: "DreamsFly Lyon",
    address: {
      street: "À compléter dans Sanity Studio",
      postalCode: "69000",
      city: "Lyon",
      country: "France",
    },
    phone: "+33 4 00 00 00 00",
  },
  {
    slug: "marseille",
    name: "DreamsFly Marseille",
    address: {
      street: "À compléter dans Sanity Studio",
      postalCode: "13000",
      city: "Marseille",
      country: "France",
    },
    phone: "+33 4 00 00 00 01",
  },
];

const DEFAULT_HOURS = [
  { _key: k(), _type: "object", day: "Lundi", open: "10:00", close: "19:00", closed: false },
  { _key: k(), _type: "object", day: "Mardi", open: "10:00", close: "19:00", closed: false },
  { _key: k(), _type: "object", day: "Mercredi", open: "10:00", close: "19:00", closed: false },
  { _key: k(), _type: "object", day: "Jeudi", open: "10:00", close: "19:00", closed: false },
  { _key: k(), _type: "object", day: "Vendredi", open: "10:00", close: "19:00", closed: false },
  { _key: k(), _type: "object", day: "Samedi", open: "10:00", close: "19:00", closed: false },
  { _key: k(), _type: "object", day: "Dimanche", open: "", close: "", closed: true },
];

const DEFAULT_DESC = [
  {
    _key: k(),
    _type: "block",
    style: "normal",
    children: [
      {
        _key: k(),
        _type: "span",
        text: "Venez tester nos matelas dans notre showroom. Nos conseillers experts vous accompagnent pour trouver le couchage adapté à votre morphologie et à vos habitudes de sommeil. Prise en charge personnalisée, essai libre sur les modèles exposés.",
        marks: [],
      },
    ],
    markDefs: [],
  },
];

async function upsertShowroom(s) {
  const existing = await client.fetch(`*[_type == "showroom" && slug.current == $slug][0]{_id, name}`, {
    slug: s.slug,
  });

  if (existing) {
    console.log(`  ⏭  ${s.slug} — existe déjà (${existing._id}), skip`);
    return;
  }

  const docId = PUBLISH ? `showroom-${s.slug}` : `drafts.showroom-${s.slug}`;

  const doc = {
    _id: docId,
    _type: "showroom",
    name: s.name,
    slug: { _type: "slug", current: s.slug },
    address: s.address,
    phone: s.phone,
    openingHours: DEFAULT_HOURS.map((h) => ({ ...h, _key: k() })),
    description: DEFAULT_DESC.map((b) => ({ ...b, _key: k() })),
    publishedAt: "2026-01-01T00:00:00.000Z",
  };

  if (DRY) {
    console.log(`  🌵 [dry] create ${docId} (${s.name})`);
    return;
  }

  await client.createOrReplace(doc);
  console.log(`  ✅ ${PUBLISH ? "published" : "draft"} — ${docId} (${s.name})`);
}

async function main() {
  console.log(`\n🏬 Populate showrooms — mode ${DRY ? "DRY" : PUBLISH ? "PUBLISH" : "DRAFT"}\n`);
  for (const s of SHOWROOMS) {
    await upsertShowroom(s);
  }
  console.log(`\n➡️  Ouvre chaque showroom dans Studio pour renseigner l'adresse réelle, les coordonnées GPS et uploader les photos.`);
  console.log(`   URL Studio : /studio/desk/showroom\n`);
}

main().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
