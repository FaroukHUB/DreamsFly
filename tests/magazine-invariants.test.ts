import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizeEditorialHtml, containsH1 } from "../lib/sanitize-html.ts";

/**
 * Vérifie les critères d'acceptation au niveau du contenu, en simulant
 * l'assemblage réalisé par app/magazine/[slug]/page.tsx :
 *
 *   coquille de page (1 <main>, 1 <article>, <h1> conditionnel)
 *   + blocs éditoriaux nettoyés
 *   = document final
 *
 * Ce test couvre la moitié du problème qu'on peut vérifier sans serveur.
 * Le comptage sur une page réellement servie se fait avec
 * `npm run seo:check <url>` (scripts/check-seo-invariants.mjs).
 */

/** Rejoue la décision de rendu du <h1> prise par la page. */
function renderPage(guideTitle: string, editorialBlocks: string[]): string {
  const sanitized = editorialBlocks.map(sanitizeEditorialHtml);
  const editorialHasH1 = sanitized.some(containsH1);

  return `<main class="mx-auto">
  <nav aria-label="Fil d'Ariane">…</nav>
  <article>
    <header>
      ${editorialHasH1 ? "" : `<h1>${guideTitle}</h1>`}
    </header>
    <div class="prose-content">${sanitized.join("\n")}</div>
  </article>
</main>`;
}

const countOf = (html: string, re: RegExp) => (html.match(re) || []).length;

const H1 = /<h1(?![\w-])/gi;
const MAIN = /<main(?![\w-])/gi;
const ARTICLE = /<article(?![\w-])/gi;

test("contenu SANS h1 : la page rend son propre titre", () => {
  const page = renderPage("Comment choisir son oreiller ?", [
    `<section><h2>La hauteur</h2><p>Texte.</p></section>`,
  ]);
  assert.equal(countOf(page, H1), 1, "exactement un <h1>");
  assert.match(page, /<h1>Comment choisir son oreiller \?<\/h1>/);
});

test("contenu AVEC h1 : la page s'efface, un seul h1 subsiste", () => {
  const page = renderPage("Titre Sanity", [
    `<main><article><h1>Titre editorial</h1><p>Texte.</p></article></main>`,
  ]);
  assert.equal(countOf(page, H1), 1, "exactement un <h1>");
  assert.match(page, /<h1>Titre editorial<\/h1>/, "c'est le h1 éditorial qui reste");
  assert.ok(!/Titre Sanity/.test(page), "le h1 générique ne doit pas être rendu");
});

test("un seul <main> et un seul <article> malgré une enveloppe collée", () => {
  const page = renderPage("Titre", [
    `<!DOCTYPE html><html><body><main><article><h1>T</h1><p>A</p></article></main></body></html>`,
    `<main><article><section>B</section></article></main>`,
  ]);
  assert.equal(countOf(page, MAIN), 1, "un seul <main>, celui de la coquille");
  assert.equal(countOf(page, ARTICLE), 1, "un seul <article>, celui de la coquille");
  assert.match(page, /A/, "contenu du premier bloc préservé");
  assert.match(page, /B/, "contenu du second bloc préservé");
});

test("aucune métadonnée ni donnée structurée injectée par le contenu", () => {
  const page = renderPage("Titre", [
    `<head>
       <title>Titre pirate | DreamsFly</title>
       <link rel="canonical" href="https://exemple.invalid/blog/x">
       <meta property="og:title" content="Pirate">
     </head>
     <script type="application/ld+json">{"@type":"BlogPosting"}</script>
     <script type="application/ld+json">{"@type":"BreadcrumbList"}</script>
     <section>Contenu legitime</section>`,
  ]);

  assert.equal(countOf(page, /<title/gi), 0, "aucun <title> dans le corps");
  assert.equal(countOf(page, /<meta/gi), 0, "aucune <meta> dans le corps");
  assert.equal(countOf(page, /<link/gi), 0, "aucun <link> dans le corps");
  assert.equal(countOf(page, /application\/ld\+json/gi), 0, "aucun JSON-LD issu du contenu");
  assert.equal(countOf(page, /BlogPosting/g), 0, "aucun BlogPosting parasite");
  assert.equal(countOf(page, /BreadcrumbList/g), 0, "aucun BreadcrumbList parasite");
  assert.match(page, /Contenu legitime/, "le contenu réel survit");
});

test("plusieurs blocs, un seul portant un h1", () => {
  const page = renderPage("Titre Sanity", [
    `<section><p>Intro sans titre.</p></section>`,
    `<article><h1>Le vrai titre</h1></article>`,
    `<section><h2>Suite</h2></section>`,
  ]);
  assert.equal(countOf(page, H1), 1);
  assert.ok(!/Titre Sanity/.test(page));
});
