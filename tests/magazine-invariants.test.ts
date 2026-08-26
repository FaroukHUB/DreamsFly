import { test } from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeEditorialHtml,
  containsH1,
  containsMain,
  containsArticle,
} from "../lib/sanitize-html.ts";

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

/**
 * Rejoue les décisions de rendu de la page : <h1>, <main> et <article> ne
 * sont produits que si le contenu n'en apporte pas déjà.
 *
 * Les conteneurs du contenu ne sont JAMAIS transformés — leur nom d'élément
 * fait partie du contrat CSS de l'article.
 */
function renderPage(guideTitle: string, editorialBlocks: string[]): string {
  const sanitized = editorialBlocks.map(sanitizeEditorialHtml);
  const editorialHasH1 = sanitized.some(containsH1);
  const Main = sanitized.some(containsMain) ? "div" : "main";
  const Article = sanitized.some(containsArticle) ? "div" : "article";

  return `<${Main} class="mx-auto">
  <nav aria-label="Fil d'Ariane">…</nav>
  <${Article}>
    <header>
      ${editorialHasH1 ? "" : `<h1>${guideTitle}</h1>`}
    </header>
    <div class="prose-content">${sanitized.join("\n")}</div>
  </${Article}>
</${Main}>`;
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
  assert.equal(countOf(page, MAIN), 1, "toujours un seul <main>");
  assert.equal(countOf(page, H1), 1, "exactement un <h1>");
  assert.match(page, /<h1>Titre editorial<\/h1>/, "c'est le h1 éditorial qui reste");
  assert.ok(!/Titre Sanity/.test(page), "le h1 générique ne doit pas être rendu");
});

test("un seul <main> et un seul <article> malgré une enveloppe collée", () => {
  // Deux blocs apportent chacun leur enveloppe. La page renonce aux siens,
  // mais le PREMIER bloc garde les siens : c'est lui qui porte le CSS.
  const page = renderPage("Titre", [
    `<!DOCTYPE html><html><body><main class="df-guide"><article><h1>T</h1><p>A</p></article></main></body></html>`,
    `<section>B</section>`,
  ]);
  assert.equal(countOf(page, MAIN), 1, "un seul <main> dans le document");
  assert.equal(countOf(page, ARTICLE), 1, "un seul <article> dans le document");
  assert.match(page, /<main class="df-guide"/, "la classe racine du contenu survit");
  assert.match(page, /A/, "contenu du premier bloc préservé");
  assert.match(page, /B/, "contenu du second bloc préservé");
});

test("sans enveloppe dans le contenu, la page fournit la sienne", () => {
  const page = renderPage("Titre", [`<section><p>Texte.</p></section>`]);
  assert.equal(countOf(page, MAIN), 1);
  assert.equal(countOf(page, ARTICLE), 1);
  assert.match(page, /<main class="mx-auto">/, "le <main> vient de la coquille");
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
  assert.equal(countOf(page, ARTICLE), 1, "toujours un seul <article>");
  assert.equal(countOf(page, H1), 1);
  assert.ok(!/Titre Sanity/.test(page));
});
