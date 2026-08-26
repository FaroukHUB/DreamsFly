import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizeEditorialHtml } from "../lib/sanitize-html.ts";

/**
 * Tests du nettoyage des fragments HTML éditoriaux.
 *
 * NOTE IMPORTANTE — chemin exercé.
 * Sous `node --test`, le `require("isomorphic-dompurify")` de
 * lib/sanitize-html.ts échoue (contexte ESM), le module bascule donc sur son
 * repli regex. C'est précisément le chemin qu'il faut couvrir : c'est celui
 * qui tourne sur Vercel quand jsdom ne se charge pas, et c'était le plus
 * permissif — il laissait passer <title>, <meta> et <link>.
 *
 * Le pré-nettoyage (stripDocumentChrome) est de toute façon indépendant de
 * DOMPurify : son résultat est identique quel que soit le chemin.
 */

/** Document complet tel qu'un rédacteur peut le coller depuis un éditeur externe. */
const FULL_DOCUMENT = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Comment choisir son oreiller ? — DreamsFly</title>
  <meta name="description" content="Guide complet oreiller">
  <meta property="og:title" content="Comment choisir son oreiller ?">
  <meta property="og:url" content="https://exemple.invalid/blog/oreiller">
  <link rel="canonical" href="https://exemple.invalid/blog/oreiller">
  <base href="https://exemple.invalid/">
  <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"BlogPosting","headline":"Oreiller"}
  </script>
  <style>.df-guide { color: #0B0B0F; }</style>
</head>
<body>
  <!-- commentaire de l'éditeur -->
  <main>
    <article>
      <h1>Comment choisir son oreiller ?</h1>
      <section class="df-guide">
        <h2>La hauteur</h2>
        <p>Texte editorial a preserver absolument.</p>
        <img src="/img/oreiller.jpg" srcset="/img/o-2x.jpg 2x" sizes="100vw"
             alt="Oreiller ergonomique" width="800" height="600" loading="lazy">
        <table><tbody><tr><td>Dos</td><td>10-12 cm</td></tr></tbody></table>
        <ul><li>Element de liste</li></ul>
        <a href="/oreillers" target="_blank" rel="noopener">Voir les oreillers</a>
      </section>
    </article>
  </main>
</body>
</html>`;

const out = sanitizeEditorialHtml(FULL_DOCUMENT);

test("retire la déclaration de type et les commentaires", () => {
  assert.ok(!/<!DOCTYPE/i.test(out), "le DOCTYPE doit disparaître");
  assert.ok(!/<!--/.test(out), "les commentaires doivent disparaître");
});

test("retire les éléments de head qui dupliqueraient les métadonnées", () => {
  assert.ok(!/<title/i.test(out), "aucun <title> ne doit subsister");
  assert.ok(!/<meta/i.test(out), "aucune <meta> ne doit subsister");
  assert.ok(!/<link/i.test(out), "aucun <link> ne doit subsister");
  assert.ok(!/<base/i.test(out), "aucune <base> ne doit subsister");
  assert.ok(!/og:title|og:url/i.test(out), "aucun Open Graph ne doit subsister");
  assert.ok(!/canonical/i.test(out), "aucune canonical ne doit subsister");
});

test("retire tout script, JSON-LD compris", () => {
  assert.ok(!/<script/i.test(out), "aucun <script> ne doit subsister");
  assert.ok(!/BlogPosting/.test(out), "le JSON-LD collé doit disparaître");
  assert.ok(!/schema\.org/.test(out), "aucune donnée structurée ne doit subsister");
});

test("retire html, head et body sans toucher à leur contenu", () => {
  assert.ok(!/<html/i.test(out), "pas de <html>");
  assert.ok(!/<head/i.test(out), "pas de <head>");
  assert.ok(!/<body/i.test(out), "pas de <body>");
});

test("CONSERVE main et article — leur suppression cassait le CSS", () => {
  // Une version précédente les transformait en <div>. Tout sélecteur CSS
  // nommant l'élément — main.df-guide, .df-guide article — cessait alors de
  // matcher : les fonds sombres disparaissaient, le texte clair restait, et
  // l'article devenait illisible. L'unicité est gérée au rendu, pas ici.
  assert.match(out, /<main(?![\w-])/i, "le <main> du contenu doit survivre");
  assert.match(out, /<article(?![\w-])/i, "le <article> du contenu doit survivre");
});

test("conserve le H1 éditorial", () => {
  assert.match(out, /<h1[^>]*>\s*Comment choisir son oreiller \?\s*<\/h1>/i);
});

test("conserve le style, les sections et la structure de contenu", () => {
  assert.match(out, /<style[^>]*>[\s\S]*\.df-guide[\s\S]*<\/style>/i, "le CSS .df- doit rester");
  assert.match(out, /<section[^>]*class="df-guide"/i, "la section éditoriale doit rester");
  assert.match(out, /<h2[^>]*>\s*La hauteur\s*<\/h2>/i);
  assert.match(out, /<table/i, "les tableaux doivent rester");
  assert.match(out, /<ul/i, "les listes doivent rester");
  assert.match(out, /<a [^>]*href="\/oreillers"/i, "les liens doivent rester");
});

test("ne perd aucun texte éditorial", () => {
  assert.match(out, /Texte editorial a preserver absolument\./);
  assert.match(out, /Element de liste/);
  assert.match(out, /10-12 cm/);
});

test("conserve les attributs d'image responsive et de performance", () => {
  assert.match(out, /srcset="\/img\/o-2x\.jpg 2x"/i);
  assert.match(out, /sizes="100vw"/i);
  assert.match(out, /loading="lazy"/i);
  assert.match(out, /alt="Oreiller ergonomique"/i);
  assert.match(out, /width="800"/i);
});

test("bloque toujours les vecteurs XSS", () => {
  const dirty = `
    <div onclick="steal()">clic</div>
    <a href="javascript:alert(1)">lien</a>
    <form action="/x"><input name="a"></form>
    <object data="evil.swf"></object>
    <iframe src="https://evil.invalid/x"></iframe>
    <script>fetch('/steal')</script>
  `;
  const safe = sanitizeEditorialHtml(dirty);
  assert.ok(!/onclick/i.test(safe), "les handlers on* doivent partir");
  assert.ok(!/javascript:/i.test(safe), "les URL javascript: doivent partir");
  assert.ok(!/<form|<input/i.test(safe), "les formulaires doivent partir");
  assert.ok(!/<object/i.test(safe), "les objets doivent partir");
  assert.ok(!/evil\.invalid/i.test(safe), "les iframes hors allowlist doivent partir");
  assert.ok(!/<script|fetch\('\/steal'\)/i.test(safe), "les scripts doivent partir");
});

test("conserve les iframes de la liste autorisée", () => {
  const embed = `<iframe src="https://www.youtube.com/embed/abc" allowfullscreen></iframe>`;
  assert.match(sanitizeEditorialHtml(embed), /youtube\.com\/embed\/abc/);
});

test("ne casse pas les éléments personnalisés au nom proche", () => {
  const custom = `<article-card data-x="1">Carte</article-card><main-nav>Nav</main-nav>`;
  const safe = sanitizeEditorialHtml(custom);
  assert.match(safe, /Carte/, "le contenu doit survivre");
  assert.match(safe, /Nav/, "le contenu doit survivre");
});

test("est idempotent — un second passage ne change rien", () => {
  assert.equal(sanitizeEditorialHtml(out), out);
});

test("tolère les entrées vides", () => {
  assert.equal(sanitizeEditorialHtml(""), "");
});

// ─────────────────────────────────────────────────────────────
// Non-régression : préservation du design éditorial
// ─────────────────────────────────────────────────────────────

/**
 * Régression constatée sur la preview : le design disparaissait.
 *
 * Deux causes cumulées. D'une part <main class="df-guide"> était supprimé
 * avec sa classe racine, ce qui invalidait toutes les règles `.df-guide …`.
 * D'autre part la feuille de style embarquée ne survivait pas au passage
 * dans le sanitizer.
 */
const STYLED_DOCUMENT = `<!DOCTYPE html>
<html lang="fr">
<head>
  <title>Titre pirate | DreamsFly</title>
  <meta property="og:title" content="Pirate">
  <link rel="canonical" href="https://exemple.invalid/blog/x">
  <script type="application/ld+json">{"@type":"BlogPosting"}</script>
  <style>
    .df-guide { background: #F4EFE7; }
    .df-hero h1 { font-size: 72px; }
    @media (max-width: 640px) { .df-hero h1 { font-size: 40px; } }
    @keyframes df-fade { from { opacity: 0; } to { opacity: 1; } }
    :root { --df-or: #C8A876; }
  </style>
</head>
<body>
  <main class="df-guide" id="guide" data-df-variant="oreiller" aria-label="Guide">
    <article class="df-content">
      <header class="df-hero">
        <h1>Titre</h1>
      </header>
    </article>
  </main>
</body>
</html>`;

const styled = sanitizeEditorialHtml(STYLED_DOCUMENT);

test("la feuille de style éditoriale survit intégralement", () => {
  assert.match(styled, /<style[^>]*>/i, "la balise <style> doit être présente");
  assert.match(styled, /\.df-guide\s*\{\s*background:\s*#F4EFE7/i);
  assert.match(styled, /\.df-hero h1\s*\{\s*font-size:\s*72px/i);
  assert.match(styled, /@media \(max-width: 640px\)/i, "les media queries doivent rester");
  assert.match(styled, /@keyframes df-fade/i, "les keyframes doivent rester");
  assert.match(styled, /--df-or:\s*#C8A876/i, "les variables CSS doivent rester");
});

test("main et article gardent leur nom d'élément ET leurs attributs", () => {
  // Le nom de l'élément fait partie du contrat CSS au même titre que la
  // classe : `main.df-guide .df-hero::before` porte le voile sombre du hero.
  assert.match(styled, /<main[^>]*class="df-guide"/i, "le <main> et sa classe");
  assert.match(styled, /<article[^>]*class="df-content"/i, "le <article> et sa classe");
  assert.match(styled, /id="guide"/i, "l'id doit survivre");
  assert.match(styled, /data-df-variant="oreiller"/i, "les data-* doivent survivre");
  assert.match(styled, /aria-label="Guide"/i, "les aria-* doivent survivre");
});

test("le header éditorial et son unique h1 sont conservés", () => {
  assert.match(styled, /<header[^>]*class="df-hero"/i);
  assert.equal((styled.match(/<h1(?![\w-])/gi) || []).length, 1, "un seul <h1>");
});

test("les métadonnées et données structurées restent supprimées", () => {
  assert.ok(!/<title/i.test(styled));
  assert.ok(!/<meta/i.test(styled));
  assert.ok(!/canonical/i.test(styled));
  assert.ok(!/<script/i.test(styled));
  assert.ok(!/BlogPosting/.test(styled));
});

test("le CSS dangereux est neutralisé sans casser la feuille", () => {
  const risky = `<style>
    .a { background: url(javascript:alert(1)); }
    .b { width: expression(alert(1)); }
    @import url("https://evil.invalid/x.css");
    .df-ok { color: red; }
  </style>`;
  const safe = sanitizeEditorialHtml(risky);
  assert.ok(!/javascript\s*:/i.test(safe), "les URL javascript: doivent partir");
  assert.ok(!/expression\s*\(/i.test(safe), "expression() doit partir");
  assert.ok(!/@import/i.test(safe), "@import doit partir");
  assert.match(safe, /\.df-ok\s*\{\s*color:\s*red/i, "le CSS légitime doit rester");
});

// ─────────────────────────────────────────────────────────────
// Normalisation des liens hérités
// ─────────────────────────────────────────────────────────────

test("les cinq anciennes URL sont réécrites vers les routes réelles", () => {
  const links = `
    <a href="/blog/comment-choisir-son-matelas">A</a>
    <a href="/blog/quel-matelas-mal-de-dos">B</a>
    <a href="/quiz-oreiller">C</a>
    <a href="/showrooms">D</a>
    <a href="/collections/oreillers">E</a>
  `;
  const out = sanitizeEditorialHtml(links);
  assert.match(out, /href="\/magazine\/guide-choisir-matelas"/);
  assert.match(out, /href="\/magazine\/matelas-mal-de-dos"/);
  assert.match(out, /href="\/quiz"/);
  assert.match(out, /href="\/magasins"/);
  assert.match(out, /href="\/oreillers"/);
  assert.ok(!/\/blog\//.test(out), "plus aucun lien /blog/");
  assert.ok(!/\/collections\//.test(out), "plus aucun lien /collections/");
});

test("ancres et paramètres sont préservés lors de la réécriture", () => {
  const out = sanitizeEditorialHtml(`<a href="/showrooms#paris">Paris</a>`);
  assert.match(out, /href="\/magasins#paris"/);
});

test("la barre oblique finale est tolérée", () => {
  const out = sanitizeEditorialHtml(`<a href="/quiz-oreiller/">Quiz</a>`);
  assert.match(out, /href="\/quiz"/);
});

test("les liens légitimes ne sont pas touchés", () => {
  const out = sanitizeEditorialHtml(
    `<a href="/matelas">M</a><a href="https://institut-sommeil-vigilance.org/">S</a>`,
  );
  assert.match(out, /href="\/matelas"/);
  assert.match(out, /href="https:\/\/institut-sommeil-vigilance\.org\/"/);
});

// ─────────────────────────────────────────────────────────────
// Table complète des liens hérités
// ─────────────────────────────────────────────────────────────

/**
 * Relevé par l'audit des sept guides. La première version de la table n'en
 * couvrait que cinq sur douze : les liens vers les guides sommier, oreiller
 * et lit, ainsi que trois anciennes collections, restaient morts.
 */
const LEGACY_EXPECTED: [string, string][] = [
  ["/blog/comment-choisir-son-matelas", "/magazine/guide-choisir-matelas"],
  ["/blog/comment-choisir-son-sommier", "/magazine/guide-choisir-sommier"],
  ["/blog/comment-choisir-son-oreiller", "/magazine/guide-choisir-oreiller"],
  ["/blog/comment-choisir-son-lit", "/magazine/guide-choisir-lit"],
  ["/blog/quel-matelas-mal-de-dos", "/magazine/matelas-mal-de-dos"],
  ["/blog/memoire-de-forme-ou-ressorts-ensaches", "/magazine/memoire-forme-vs-ressorts"],
  ["/collections/matelas", "/matelas"],
  ["/collections/sommiers", "/sommiers"],
  ["/collections/oreillers", "/oreillers"],
  ["/collections/lits", "/lits"],
  ["/quiz-oreiller", "/quiz"],
  ["/showrooms", "/magasins"],
];

for (const [from, to] of LEGACY_EXPECTED) {
  test(`réécrit ${from} → ${to}`, () => {
    const out = sanitizeEditorialHtml(`<a href="${from}">Lien</a>`);
    assert.match(out, new RegExp(`href="${to.replace(/\//g, "\\/")}"`));
  });
}

test("plus aucun lien hérité après nettoyage d'un article complet", () => {
  const links = LEGACY_EXPECTED.map(([from]) => `<a href="${from}">x</a>`).join("");
  const out = sanitizeEditorialHtml(links);
  assert.ok(!/href="[^"]*\/blog\//.test(out), "aucun /blog/ restant");
  assert.ok(!/href="[^"]*\/collections\//.test(out), "aucun /collections/ restant");
  assert.ok(!/href="\/showrooms"/.test(out), "aucun /showrooms restant");
  assert.ok(!/href="\/quiz-oreiller"/.test(out), "aucun /quiz-oreiller restant");
});
