#!/usr/bin/env node
/**
 * Dry-run des corrections SEO sur l'article « guide-choisir-oreiller ».
 *
 * PAR DÉFAUT : n'écrit RIEN. Affiche les valeurs actuelles, les valeurs
 * proposées, et signale ce qui demande une décision humaine.
 * Ajouter --publish pour appliquer (patch partiel, jamais createOrReplace).
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj \
 *   SANITY_DATASET=production \
 *   SANITY_WRITE_TOKEN=sk... \
 *   node scripts/seo-oreiller-dryrun.mjs [--publish]
 *
 * Le script vérifie aussi les URL de sources par requête HEAD depuis TA
 * machine : aucune référence n'est proposée sans avoir répondu.
 */

import { createClient } from "@sanity/client";

const SLUG = "guide-choisir-oreiller";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error("SANITY_PROJECT_ID manquant");
if (!token) throw new Error("SANITY_WRITE_TOKEN manquant (rôle Editor minimum)");

const PUBLISH = process.argv.includes("--publish");

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

// ─────────────────────────────────────────────────────────────
// Valeurs cibles
// ─────────────────────────────────────────────────────────────

const TARGET = {
  // Sans « DreamsFly » : le title.template du layout l'ajoute déjà.
  metaTitle: "Comment choisir son oreiller ? Le guide complet",
  metaDescription:
    "Position, hauteur, fermeté, duvet ou mémoire de forme : découvrez comment choisir un oreiller adapté à votre morphologie et à votre matelas.",
  // datePublished reste au 5 juillet 2026, seule dateModified bouge.
  updatedAt: "2026-08-25T00:00:00.000Z",
};

/** Anciennes routes présentes dans le contenu → routes réelles. */
const LEGACY_LINKS = {
  "/blog/comment-choisir-son-matelas": "/magazine/guide-choisir-matelas",
  "/blog/quel-matelas-mal-de-dos": "/magazine/matelas-mal-de-dos",
  "/quiz-oreiller": "/quiz",
  "/showrooms": "/magasins",
  "/collections/oreillers": "/oreillers",
};

/** Mention de date vague à remplacer par une date exacte. */
const VAGUE_DATE_RE = /MISE\s+À\s+JOUR\s+AOÛT\s+2026/gi;
const EXACT_DATE = "Mis à jour le 25 août 2026";

/**
 * Formulations d'expertise à retirer : aucun ostéopathe n'a relu ces
 * contenus. Le script les SIGNALE avec leur contexte plutôt que de les
 * réécrire — supprimer un membre de phrase au hasard casse la grammaire,
 * c'est une décision de rédaction, pas de script.
 */
const EXPERTISE_CLAIMS = [
  /validés?\s+par\s+(?:des|les)\s+ostéopathes?/gi,
  /validés?\s+par\s+(?:un|notre|nos)\s+(?:expert|kiné|médecin|professionnel)[^.,;]*/gi,
  /approuvés?\s+par\s+(?:des|les)\s+(?:ostéopathes?|kinés?|médecins?)/gi,
  /recommandés?\s+par\s+(?:des|les)\s+(?:ostéopathes?|kinés?|médecins?)/gi,
  /\bSFDO\b/g,
];

/**
 * Sources candidates. Chacune est vérifiée par requête HEAD avant d'être
 * proposée : rien n'est inséré sur la foi d'une URL mémorisée.
 */
const SOURCE_CANDIDATES = [
  {
    label: "OEKO-TEX® STANDARD 100 — référentiel officiel",
    url: "https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100",
  },
  {
    label: "GOTS — Global Organic Textile Standard",
    url: "https://global-standard.org/the-standard",
  },
  {
    label:
      "The Effect of Different Pillow Heights on the Parameters of Cervicothoracic Spine Segments (PMC4623167)",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4623167/",
  },
  {
    label:
      "Pillow preferences of people with neck pain and known spinal degeneration — pilot RCT (PubMed 31489809)",
    url: "https://pubmed.ncbi.nlm.nih.gov/31489809/",
  },
  {
    label: "INSERM — dossier Sommeil",
    url: "https://www.inserm.fr/dossier/sommeil/",
  },
];

// ─────────────────────────────────────────────────────────────
// Utilitaires d'affichage
// ─────────────────────────────────────────────────────────────

const line = (c = "─") => console.log(c.repeat(72));
const show = (label, value) =>
  console.log(`  ${label.padEnd(20)} ${value === undefined || value === null ? "(vide)" : value}`);

function diff(label, before, after) {
  const changed = before !== after;
  console.log(`\n  ${changed ? "✏️ " : "✓ "} ${label}`);
  console.log(`     AVANT : ${before ?? "(vide)"}`);
  console.log(`     APRÈS : ${after}`);
  return changed;
}

/** Contexte autour d'une correspondance, pour juger sur pièces. */
function context(text, index, length, pad = 90) {
  const start = Math.max(0, index - pad);
  const end = Math.min(text.length, index + length + pad);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).replace(/\s+/g, " ")}${end < text.length ? "…" : ""}`;
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: "HEAD", redirect: "follow" });
    // Certains sites refusent HEAD : on retente en GET partiel.
    if (res.status === 405 || res.status === 403) {
      const get = await fetch(url, { method: "GET", redirect: "follow" });
      return { ok: get.ok, status: get.status, final: get.url };
    }
    return { ok: res.ok, status: res.status, final: res.url };
  } catch (err) {
    return { ok: false, status: 0, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────
// Programme
// ─────────────────────────────────────────────────────────────

console.log(`\n🔎 Dry-run SEO — /magazine/${SLUG}`);
console.log(`   Projet ${projectId} · dataset ${dataset} · mode ${PUBLISH ? "PUBLISH" : "DRY (lecture seule)"}\n`);

const doc = await client.fetch(
  `*[_type == "guide" && slug.current == $slug][0]{
     _id, _rev, title, metaTitle, metaDescription, publishedAt, updatedAt,
     "authorName": author->name, "authorPlaceholder": author->isPlaceholder,
     "reviewerName": reviewer->name,
     coverImage,
     "coverDims": coverImage.asset->metadata.dimensions,
     "coverUrl": coverImage.asset->url,
     sources,
     "htmlBlocks": body[_type == "htmlBlock"]{_key, html}
   }`,
  { slug: SLUG },
);

if (!doc) {
  console.error(`❌ Aucun document guide avec le slug « ${SLUG} ».`);
  process.exit(1);
}

// ─── 1. Valeurs actuelles ────────────────────────────────────
line("═");
console.log("1. VALEURS ACTUELLES");
line("═");
show("_id", doc._id);
show("title", doc.title);
show("metaTitle", doc.metaTitle);
show("metaDescription", doc.metaDescription);
show("publishedAt", doc.publishedAt);
show("updatedAt", doc.updatedAt);
show("auteur", `${doc.authorName ?? "(aucun)"}${doc.authorPlaceholder ? " [placeholder]" : ""}`);
show("relecteur", doc.reviewerName ?? "(aucun)");
show("image", doc.coverDims ? `${doc.coverDims.width} × ${doc.coverDims.height}` : "(aucune)");
show("sources", Array.isArray(doc.sources) ? `${doc.sources.length} entrée(s)` : "(aucune)");
show("blocs HTML", `${doc.htmlBlocks?.length ?? 0}`);

// ─── 2. Champs simples ───────────────────────────────────────
line("═");
console.log("2. CHAMPS PROPOSÉS");
line("═");

const patch = {};
if (diff("metaTitle", doc.metaTitle, TARGET.metaTitle)) patch.metaTitle = TARGET.metaTitle;
if (diff("metaDescription", doc.metaDescription, TARGET.metaDescription))
  patch.metaDescription = TARGET.metaDescription;
if (diff("updatedAt (dateModified)", doc.updatedAt, TARGET.updatedAt))
  patch.updatedAt = TARGET.updatedAt;
console.log(`\n  ✓  publishedAt conservé : ${doc.publishedAt}`);

// ─── 3. Transformations du contenu HTML ──────────────────────
line("═");
console.log("3. CONTENU HTML — transformations automatiques");
line("═");

const htmlPatch = {};
let autoChanges = 0;

for (const block of doc.htmlBlocks || []) {
  const original = block.html || "";
  let updated = original;
  const notes = [];

  // Date vague → date exacte
  const dateHits = [...original.matchAll(VAGUE_DATE_RE)];
  if (dateHits.length) {
    updated = updated.replace(VAGUE_DATE_RE, EXACT_DATE);
    notes.push(`${dateHits.length} mention(s) de date vague → « ${EXACT_DATE} »`);
  }

  // Liens hérités
  for (const [from, to] of Object.entries(LEGACY_LINKS)) {
    const re = new RegExp(`(["'])${from.replace(/\//g, "\\/")}(\\/?)(["'#?])`, "g");
    const hits = [...updated.matchAll(re)];
    if (hits.length) {
      updated = updated.replace(re, `$1${to}$3`);
      notes.push(`${hits.length} lien(s) ${from} → ${to}`);
    }
  }

  if (updated !== original) {
    htmlPatch[`body[_key=="${block._key}"].html`] = updated;
    autoChanges++;
    console.log(`\n  ✏️  bloc ${block._key}`);
    for (const n of notes) console.log(`     · ${n}`);
  }
}

if (autoChanges === 0) console.log("\n  ✓  Aucune transformation automatique nécessaire.");

// ─── 4. À arbitrer à la main ─────────────────────────────────
line("═");
console.log("4. À ARBITRER — le script ne touche PAS à ces passages");
line("═");

let manual = 0;
for (const block of doc.htmlBlocks || []) {
  const html = block.html || "";
  for (const re of EXPERTISE_CLAIMS) {
    for (const m of html.matchAll(re)) {
      manual++;
      console.log(`\n  ⚠️  bloc ${block._key} — « ${m[0]} »`);
      console.log(`     ${context(html, m.index, m[0].length)}`);
    }
  }
}
console.log(
  manual === 0
    ? "\n  ✓  Aucune revendication d'expertise détectée."
    : `\n  ${manual} passage(s) à réécrire : retirer un membre de phrase casse la grammaire,\n     c'est une décision de rédaction. Colle-moi ces extraits.`,
);

// ─── 5. Vérification des sources ─────────────────────────────
line("═");
console.log("5. SOURCES — vérification réseau depuis cette machine");
line("═");

for (const src of SOURCE_CANDIDATES) {
  const r = await checkUrl(src.url);
  const icon = r.ok ? "✅" : "❌";
  console.log(`\n  ${icon} ${r.status || "erreur"}  ${src.url}`);
  console.log(`     ${src.label}`);
  if (r.final && r.final !== src.url) console.log(`     → redirige vers ${r.final}`);
  if (r.error) console.log(`     ${r.error}`);
}

console.log("\n  Sources actuellement enregistrées :");
for (const s of doc.sources || []) {
  console.log(`     · ${s.title ?? "(sans titre)"} — ${s.url ? s.url : "AUCUNE URL (non cliquable)"}`);
}

// ─── 6. Image ────────────────────────────────────────────────
line("═");
console.log("6. IMAGE PRINCIPALE");
line("═");
if (doc.coverDims) {
  const { width, height } = doc.coverDims;
  const ratio = (width / height).toFixed(2);
  console.log(`  Source Sanity : ${width} × ${height} (ratio ${ratio})`);
  console.log(`  Rendu demandé : 1400 × 800 (ratio 1.75) dans app/magazine/[slug]/page.tsx`);
  console.log(
    width >= 1920 && height >= 1280
      ? "  ✅ Assez grande pour un recadrage paysage 1920 × 1280."
      : `  ⚠️  Trop petite pour 1920 × 1280 — un agrandissement dégraderait le rendu.`,
  );
  console.log(`  URL source : ${doc.coverUrl}`);
} else {
  console.log("  (aucune image de couverture)");
}

// ─── 7. Application ──────────────────────────────────────────
line("═");
const total = Object.keys(patch).length + Object.keys(htmlPatch).length;
console.log(`RÉCAPITULATIF : ${total} champ(s) modifiable(s) automatiquement, ${manual} à arbitrer.`);
line("═");

if (!PUBLISH) {
  console.log("\n💡 Mode DRY — rien n'a été écrit.\n   Relance avec --publish après validation.\n");
  process.exit(0);
}

if (total === 0) {
  console.log("\n✓ Rien à écrire.\n");
  process.exit(0);
}

// Patch PARTIEL uniquement : jamais createOrReplace, qui écraserait le
// document entier avec les seuls champs récupérés par la requête.
await client
  .patch(doc._id)
  .set({ ...patch, ...htmlPatch })
  .commit();
console.log(`\n✅ ${total} champ(s) mis à jour sur ${doc._id} (patch partiel).\n`);
