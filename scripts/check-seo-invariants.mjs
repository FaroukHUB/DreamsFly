#!/usr/bin/env node
/**
 * Vérifie les invariants SEO d'une page rendue.
 *
 * Compte dans le HTML SERVI (pas dans le DOM hydraté) les éléments qui ne
 * doivent apparaître qu'une fois, et signale ceux qui n'ont rien à faire là.
 *
 * Usage :
 *   node scripts/check-seo-invariants.mjs http://localhost:3000/magazine/guide-choisir-oreiller
 *   node scripts/check-seo-invariants.mjs https://dreamsfly.fr/magazine/guide-choisir-oreiller
 *
 * Sans argument, teste la page oreiller sur le serveur local.
 *
 * Sort en code 1 si un critère d'acceptation échoue — utilisable en CI.
 */

const url = process.argv[2] || "http://localhost:3000/magazine/guide-choisir-oreiller";

/** Compte les occurrences d'une expression régulière globale. */
const count = (html, re) => (html.match(re) || []).length;

/** Extrait le contenu de chaque bloc JSON-LD et renvoie les @type trouvés. */
function jsonLdTypes(html) {
  const blocks = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) || [];
  const types = [];
  for (const block of blocks) {
    const body = block.replace(/^<script[^>]*>/i, "").replace(/<\/script>$/i, "");
    try {
      const data = JSON.parse(body);
      for (const node of Array.isArray(data) ? data : [data]) {
        if (node?.["@type"]) types.push(node["@type"]);
      }
    } catch {
      types.push("(JSON invalide)");
    }
  }
  return types;
}

/** Sépare le <head> du <body> pour repérer les balises égarées dans le corps. */
function splitDocument(html) {
  const headEnd = html.search(/<\/head\s*>/i);
  return headEnd === -1
    ? { head: "", body: html }
    : { head: html.slice(0, headEnd), body: html.slice(headEnd) };
}

const results = [];
function check(label, actual, expected, { exact = true } = {}) {
  const ok = exact ? actual === expected : actual <= expected;
  results.push({ label, actual, expected, ok });
}

const res = await fetch(url, { headers: { "user-agent": "dreamsfly-seo-check" } });
if (!res.ok) {
  console.error(`❌ HTTP ${res.status} sur ${url}`);
  process.exit(1);
}
const html = await res.text();
const { body } = splitDocument(html);
const types = jsonLdTypes(html);
const tally = (t) => types.filter((x) => x === t).length;

console.log(`\n🔎 ${url}\n`);

// ─── Titre ────────────────────────────────────────────────────────────
const titles = html.match(/<title[^>]*>([\s\S]*?)<\/title>/gi) || [];
const titleText = titles[0]?.replace(/<\/?title[^>]*>/gi, "").trim() || "";
check("<title> dans le document", titles.length, 1);
check("occurrences de « DreamsFly » dans le title", count(titleText, /DreamsFly/gi), 1);
check("<title> injecté dans le body", count(body, /<title[^>]*>/gi), 0);
console.log(`   title = « ${titleText} »\n`);

// ─── Canonical et métadonnées ─────────────────────────────────────────
check("<link rel=canonical>", count(html, /<link[^>]+rel=["']canonical["']/gi), 1, { exact: false });
check("<meta> injectée dans le body", count(body, /<meta[^>]*>/gi), 0);
check("<link> injecté dans le body", count(body, /<link[^>]*>/gi), 0);

// ─── Structure du document ────────────────────────────────────────────
check("<h1>", count(html, /<h1(?![\w-])/gi), 1);
check("<main>", count(html, /<main(?![\w-])/gi), 1);
check("<article> principal", count(html, /<article(?![\w-])/gi), 1);

// ─── Données structurées ──────────────────────────────────────────────
check("BlogPosting", tally("BlogPosting"), 1);
check("Article supplémentaire", tally("Article"), 0);
check("BreadcrumbList", tally("BreadcrumbList"), 1);
check("Organization", tally("Organization"), 1);
check("FAQPage", tally("FAQPage"), 1, { exact: false });
check("HowTo", tally("HowTo"), 1, { exact: false });

// ─── Liens hérités ────────────────────────────────────────────────────
check("liens /blog/", count(html, /href=["'][^"']*\/blog\//gi), 0);
check("liens /collections/", count(html, /href=["'][^"']*\/collections\//gi), 0);

// ─── Rapport ──────────────────────────────────────────────────────────
let failed = 0;
for (const r of results) {
  const icon = r.ok ? "✅" : "❌";
  if (!r.ok) failed++;
  console.log(`   ${icon} ${r.label.padEnd(42)} ${r.actual} (attendu ${r.expected})`);
}

console.log(`\n   Types JSON-LD trouvés : ${types.length ? types.join(", ") : "aucun"}`);

const noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html);
console.log(`   robots noindex : ${noindex ? "oui" : "non"}`);
if (noindex && count(html, /<link[^>]+rel=["']canonical["']/gi) > 0) {
  console.log("   ⚠️  noindex actif alors qu'une canonical est publiée — vérifier SEO_INDEXING_ENABLED");
}

console.log(
  failed === 0
    ? "\n✅ Tous les critères d'acceptation sont respectés.\n"
    : `\n❌ ${failed} critère(s) en échec.\n`,
);
process.exit(failed === 0 ? 0 : 1);
