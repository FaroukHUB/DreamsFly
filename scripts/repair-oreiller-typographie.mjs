#!/usr/bin/env node
/**
 * Répare la typographie française de l'article « guide-choisir-oreiller ».
 *
 * CONTEXTE — ce qui a été cassé.
 * Le patch précédent embarquait un nettoyage cosmétique global
 * `replace(/\s+([.,;:!?])/g, "$1")` destiné à rattraper la ponctuation
 * autour de la mention de date supprimée. Il s'est appliqué à TOUT le
 * texte et a supprimé l'espace avant ? ! : ; dans l'article entier, alors
 * que cet espace est obligatoire en français :
 *
 *     « Comment laver un oreiller ? »  →  « Comment laver un oreiller? »
 *     « écartées : les études »        →  « écartées: les études »
 *
 * L'indentation a également été aplatie par `replace(/[ \t]{2,}/g, " ")`.
 *
 * MÉTHODE.
 * L'information perdue ne peut pas être reconstruite depuis l'état actuel :
 * on ne devine pas où se trouvaient les espaces. On repart donc de la
 * version enregistrée AVANT le patch, via l'API History de Sanity, puis on
 * réapplique uniquement les transformations voulues — suppression du span
 * de date et réécriture des cinq liens — sans aucun nettoyage cosmétique.
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj SANITY_DATASET=production \
 *   SANITY_WRITE_TOKEN=sk... node scripts/repair-oreiller-typographie.mjs [--publish]
 *
 * HOURS_BACK permet de choisir le point de restauration (défaut : 2 h).
 */

import { createClient } from "@sanity/client";

const DOC_ID = "guide-guide-choisir-oreiller";
const API_VERSION = "2024-01-01";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;
const HOURS_BACK = Number(process.env.HOURS_BACK || 2);

if (!projectId) throw new Error("SANITY_PROJECT_ID manquant");
if (!token) throw new Error("SANITY_WRITE_TOKEN manquant");

const PUBLISH = process.argv.includes("--publish");

const client = createClient({ projectId, dataset, apiVersion: API_VERSION, token, useCdn: false });

const LEGACY_LINKS = {
  "/blog/comment-choisir-son-matelas": "/magazine/guide-choisir-matelas",
  "/blog/quel-matelas-mal-de-dos": "/magazine/matelas-mal-de-dos",
  "/quiz-oreiller": "/quiz",
  "/showrooms": "/magasins",
  "/collections/oreillers": "/oreillers",
};

/**
 * Transformation CHIRURGICALE : retire le seul élément porteur de la
 * mention de date, réécrit les liens hérités, et ne touche à rien d'autre.
 * Aucun nettoyage d'espaces, aucune reprise d'indentation, aucune
 * normalisation de ponctuation.
 */
function transform(html) {
  const notes = [];

  const BLOCK = /<(span|li|em|strong|small|b|i)\b[^>]*>((?:(?!<\/?\1\b)[\s\S])*)<\/\1\s*>/gi;
  let out = html.replace(BLOCK, (match, _tag, inner) => {
    if (/<(svg|img|picture|video)\b/i.test(inner)) return match;
    const textOnly = inner
      .replace(/<[^>]*>/g, "")
      .replace(/[◆•·|—–\-\s]/g, " ")
      .trim();
    if (/^mise\s+à\s+jour\s+ao[uû]t\s+2026$/i.test(textOnly)) {
      notes.push(`span de date retiré : ${match.trim()}`);
      return "";
    }
    return match;
  });

  for (const [from, to] of Object.entries(LEGACY_LINKS)) {
    const re = new RegExp(`(["'])${from.replace(/\//g, "\\/")}(\\/?)(["'#?])`, "g");
    const hits = [...out.matchAll(re)];
    if (hits.length) {
      out = out.replace(re, `$1${to}$3`);
      notes.push(`${hits.length} lien(s) ${from} → ${to}`);
    }
  }

  return { html: out, notes };
}

/** Compte les espaces typographiques français avant ? ! : ; */
const countFrenchSpaces = (s) => (s.match(/\s[?!:;]/g) || []).length;

// ─────────────────────────────────────────────────────────────

const at = new Date(Date.now() - HOURS_BACK * 3600_000).toISOString();
console.log(`\n🔧 Réparation typographique — ${DOC_ID}`);
console.log(`   Restauration depuis l'état du ${at} (HOURS_BACK=${HOURS_BACK})`);
console.log(`   Mode ${PUBLISH ? "PUBLISH" : "DRY (lecture seule)"}\n`);

const res = await fetch(
  `https://${projectId}.api.sanity.io/v${API_VERSION}/data/history/${dataset}/documents/${encodeURIComponent(DOC_ID)}?time=${encodeURIComponent(at)}`,
  { headers: { Authorization: `Bearer ${token}` } },
);
if (!res.ok) {
  console.error(`❌ API History : HTTP ${res.status} — ${(await res.text()).slice(0, 200)}`);
  process.exit(1);
}
const { documents } = await res.json();
const historic = documents?.[0];
if (!historic) {
  console.error("❌ Aucun état historique trouvé. Essayez une autre valeur de HOURS_BACK.");
  process.exit(1);
}

const originalBlock = (historic.body || []).find((b) => b._type === "htmlBlock");
if (!originalBlock?.html) {
  console.error("❌ Aucun bloc HTML dans l'état restauré.");
  process.exit(1);
}

const current = await client.fetch(
  `*[_id == $id][0]{ "html": body[_type=="htmlBlock"][0].html }`,
  { id: DOC_ID },
);

const { html: repaired, notes } = transform(originalBlock.html);

console.log("── ÉTAT TYPOGRAPHIQUE ──────────────────────────────────");
console.log(`  Version d'origine  : ${countFrenchSpaces(originalBlock.html)} espaces avant ? ! : ;`);
console.log(`  Version en ligne   : ${countFrenchSpaces(current?.html || "")} espaces  ← abîmée`);
console.log(`  Version réparée    : ${countFrenchSpaces(repaired)} espaces`);

console.log("\n── TRANSFORMATIONS RÉAPPLIQUÉES ────────────────────────");
for (const n of notes) console.log(`  · ${n}`);

console.log("\n── CONTRÔLES ───────────────────────────────────────────");
const checks = [
  ["espaces français restaurés", countFrenchSpaces(repaired) === countFrenchSpaces(originalBlock.html)],
  ["date supprimée", !/mise\s+à\s+jour\s+ao[uû]t/i.test(repaired)],
  ["aucun lien /blog/", !/href=["'][^"']*\/blog\//.test(repaired)],
  ["aucun lien /collections/", !/href=["'][^"']*\/collections\//.test(repaired)],
  ["icônes conservées", (repaired.match(/df-icon-ring/g) || []).length === (originalBlock.html.match(/df-icon-ring/g) || []).length],
  ["longueur cohérente", Math.abs(repaired.length - originalBlock.html.length) < 400],
];
let failed = 0;
for (const [label, ok] of checks) {
  if (!ok) failed++;
  console.log(`  ${ok ? "✅" : "❌"} ${label}`);
}

if (failed > 0) {
  // Diagnostic : lister les liens hérités qui subsistent. Un contrôle qui
  // échoue sans dire QUOI oblige à deviner, et deviner sur du contenu est
  // précisément ce qu'on cherche à éviter.
  const remaining = [...repaired.matchAll(/href=(["'])([^"']*(?:\/blog\/|\/collections\/)[^"']*)\1/gi)];
  if (remaining.length) {
    console.log("\n── LIENS HÉRITÉS NON RÉÉCRITS ──────────────────────────");
    for (const m of remaining) {
      console.log(`  · ${m[2]}`);
      const known = Object.keys(LEGACY_LINKS).some((k) => m[2].startsWith(k));
      console.log(`    ${known ? "⚠️  forme inattendue d'une URL connue" : "❓ URL inconnue — destination à décider"}`);
    }
    console.log("\n  Ces URL ne figurent pas dans la table de correspondance.");
    console.log("  Il faut décider vers quoi elles doivent pointer avant de réparer.");
  }
  console.error(`\n❌ ${failed} contrôle(s) en échec — rien n'a été écrit.\n`);
  process.exit(1);
}

if (!PUBLISH) {
  console.log("\n💡 Mode DRY — rien n'a été écrit.\n   Relance avec --publish pour réparer.\n");
  process.exit(0);
}

await client
  .patch(DOC_ID)
  .set({ [`body[_key=="${originalBlock._key}"].html`]: repaired })
  .commit();
console.log(`\n✅ Typographie réparée sur ${DOC_ID} (patch partiel).\n`);
