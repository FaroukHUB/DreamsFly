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

test("retire les wrappers de document sans toucher à leur contenu", () => {
  assert.ok(!/<html/i.test(out), "pas de <html>");
  assert.ok(!/<head/i.test(out), "pas de <head>");
  assert.ok(!/<body/i.test(out), "pas de <body>");
  assert.ok(!/<main(?![\w-])/i.test(out), "pas de <main>");
  assert.ok(!/<article(?![\w-])/i.test(out), "pas de <article>");
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
