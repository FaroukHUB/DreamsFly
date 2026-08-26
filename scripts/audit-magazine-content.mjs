#!/usr/bin/env node
/**
 * Audit de TOUS les articles du Magazine — LECTURE SEULE, sans exception.
 *
 * Ce script n'écrit jamais : il n'y a aucun `--publish`, aucun appel de
 * mutation. Il dresse l'état des lieux avant de décider quoi corriger.
 *
 * Cherche, sur chaque guide, les défauts trouvés sur « guide-choisir-oreiller » :
 *  · enveloppe de document collée (title, meta, link, script, main, article)
 *  · canonical ou og:url pointant vers une ancienne adresse
 *  · liens hérités /blog/, /collections/, /showrooms, /quiz-oreiller
 *  · suffixe de marque dans metaTitle
 *  · revendications d'expertise invérifiables
 *  · dates, auteur, image et sources manquants
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj SANITY_DATASET=production \
 *   SANITY_WRITE_TOKEN=sk... node scripts/audit-magazine-content.mjs
 */

import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error("SANITY_PROJECT_ID manquant");

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token, // facultatif : un dataset public se lit sans jeton
  useCdn: false,
});

const LEGACY_PATHS = ["/blog/", "/collections/", "/showrooms", "/quiz-oreiller"];

const EXPERTISE_CLAIMS = [
  /validés?\s+par\s+(?:des|les)\s+ostéopathes?/gi,
  /approuvés?\s+par\s+(?:des|les)\s+(?:ostéopathes?|kinés?|médecins?)/gi,
  /recommandés?\s+par\s+(?:des|les)\s+(?:ostéopathes?|kinés?|médecins?)/gi,
  /\bSFDO\b/g,
];

/** Défauts détectables dans un bloc HTML éditorial. */
function inspectHtml(html) {
  const found = [];
  if (/<!DOCTYPE/i.test(html)) found.push("DOCTYPE");
  if (/<html\b/i.test(html)) found.push("<html>");
  if (/<head\b/i.test(html)) found.push("<head>");
  if (/<body\b/i.test(html)) found.push("<body>");
  if (/<title\b/i.test(html)) found.push("<title>");
  if (/<meta\b/i.test(html)) found.push("<meta>");
  if (/<link\b/i.test(html)) found.push("<link>");
  if (/<script\b/i.test(html)) found.push("<script>");
  if (/<main(?![\w-])/i.test(html)) found.push("<main>");
  if (/<article(?![\w-])/i.test(html)) found.push("<article>");
  if (/<h1(?![\w-])/i.test(html)) found.push("<h1>");
  return found;
}

/** Liens hérités portés par un <a> — les seuls réellement cliquables. */
function navigableLegacy(html) {
  return [...html.matchAll(/<a\b[^>]*\shref=(["'])([^"']*)\1/gi)]
    .map(([, , href]) => href)
    .filter((href) => LEGACY_PATHS.some((p) => href.includes(p)));
}

const guides = await client.fetch(`*[_type == "guide"] | order(slug.current asc){
  "slug": slug.current, title, metaTitle, metaDescription, excerpt,
  publishedAt, updatedAt,
  "hasAuthor": defined(author), "hasCover": defined(coverImage),
  "sourceCount": count(sources),
  "blocks": body[_type == "htmlBlock"]{_key, html}
}`);

console.log(`\n📚 Audit du Magazine — ${guides.length} article(s)\n`);
console.log("   LECTURE SEULE : ce script n'écrit rien, il n'a pas de mode --publish.\n");

const summary = [];

for (const g of guides) {
  const problems = [];

  // Métadonnées
  if (g.metaTitle && /[|·—–-]\s*DreamsFly\s*$/i.test(g.metaTitle)) {
    problems.push("metaTitle suffixé « DreamsFly » (doublon au rendu)");
  }
  if (!g.metaTitle) problems.push("metaTitle absent");
  if (!g.metaDescription) problems.push("metaDescription absente");
  if (!g.updatedAt) problems.push("updatedAt vide (dateModified = datePublished)");
  if (!g.hasAuthor) problems.push("aucun auteur");
  if (!g.hasCover) problems.push("aucune image de couverture");
  if (!g.sourceCount) problems.push("aucune source enregistrée");

  // Revendications, tous champs texte confondus
  const texts = [g.title, g.metaTitle, g.metaDescription, g.excerpt, ...(g.blocks || []).map((b) => b.html)];
  const claims = new Set();
  for (const t of texts) {
    if (typeof t !== "string") continue;
    for (const re of EXPERTISE_CLAIMS) for (const m of t.matchAll(re)) claims.add(m[0].trim());
  }
  if (claims.size) problems.push(`revendication(s) : ${[...claims].join(", ")}`);

  // Contenu HTML
  const chrome = new Set();
  const links = new Set();
  const staleUrls = new Set();
  for (const b of g.blocks || []) {
    const html = b.html || "";
    for (const c of inspectHtml(html)) chrome.add(c);
    for (const l of navigableLegacy(html)) links.add(l);
    for (const m of html.matchAll(/(?:canonical[^>]*href|og:url[^>]*content)=(["'])([^"']*)\1/gi)) {
      staleUrls.add(m[2]);
    }
  }
  if (chrome.size) problems.push(`enveloppe de document : ${[...chrome].join(" ")}`);
  if (links.size) problems.push(`lien(s) <a> hérité(s) : ${[...links].join(", ")}`);
  if (staleUrls.size) problems.push(`URL périmée en métadonnée : ${[...staleUrls].join(", ")}`);

  summary.push({ slug: g.slug, count: problems.length });

  console.log(`${"─".repeat(72)}`);
  console.log(`${problems.length === 0 ? "✅" : "⚠️ "} /magazine/${g.slug}`);
  console.log(`   ${g.title}`);
  if (problems.length === 0) {
    console.log("   Rien à signaler.");
  } else {
    for (const p of problems) console.log(`   · ${p}`);
  }
}

console.log(`${"═".repeat(72)}`);
const clean = summary.filter((s) => s.count === 0).length;
console.log(`BILAN : ${clean}/${guides.length} article(s) sans défaut.`);
for (const s of [...summary].sort((a, b) => b.count - a.count)) {
  if (s.count > 0) console.log(`  ${String(s.count).padStart(2)} défaut(s) — ${s.slug}`);
}
console.log(`${"═".repeat(72)}`);
console.log(
  "\nRappel : l'enveloppe de document et les URL périmées en <meta>/<link> sont",
);
console.log("retirées au rendu par sanitizeEditorialHtml. Elles ne nuisent pas au");
console.log("référencement — elles encombrent seulement la base. Les liens <a>");
console.log("hérités, eux, sont de vrais liens morts pour le visiteur.\n");
