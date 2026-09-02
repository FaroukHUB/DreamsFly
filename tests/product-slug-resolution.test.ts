import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveProductBySlug, productUrlFor } from "../lib/product-slug.ts";

/**
 * Renommer le slug d'un produit dans Sanity effaçait l'ancienne URL : la
 * route est dynamique, l'ancien slug disparaissait de generateStaticParams,
 * et Google tombait sur une 404 — y compris sur une fiche déjà classée.
 *
 * Le champ « Anciens slugs », saisi à la main dans le Studio, permet à la
 * requête d'accepter l'ancienne valeur. Ces tests couvrent la règle de
 * départage, qui décide quelle fiche servir et s'il faut rediriger.
 */

// ─── Slug actuel ────────────────────────────────────────────

test("slug actuel : la page répond, aucune redirection", () => {
  const produits = [{ slug: "lit-coffre-coco-velours-beige", previousSlugs: [] }];
  const r = resolveProductBySlug(produits, "lit-coffre-coco-velours-beige");

  assert.ok(r);
  assert.equal(r.shouldRedirect, false);
  assert.equal(r.canonicalSlug, "lit-coffre-coco-velours-beige");
  assert.equal(r.product, produits[0]);
});

test("canonical : toujours construite depuis le slug actuel, jamais depuis celui demandé", () => {
  const produits = [{ slug: "nouveau-slug", previousSlugs: ["ancien-slug"] }];

  const viaAncien = resolveProductBySlug(produits, "ancien-slug");
  const viaActuel = resolveProductBySlug(produits, "nouveau-slug");

  assert.equal(viaAncien?.canonicalSlug, "nouveau-slug");
  assert.equal(viaActuel?.canonicalSlug, "nouveau-slug");
});

// ─── Ancien slug ────────────────────────────────────────────

test("ancien slug : redirection vers le slug actuel", () => {
  const produits = [{ slug: "lit-coffre-coco-velours-beige", previousSlugs: ["lit-coffre-coco-copie"] }];
  const r = resolveProductBySlug(produits, "lit-coffre-coco-copie");

  assert.ok(r);
  assert.equal(r.shouldRedirect, true);
  assert.equal(r.canonicalSlug, "lit-coffre-coco-velours-beige");
});

test("plusieurs anciens slugs pour un même produit : chacun redirige directement, sans chaîne", () => {
  const produit = { slug: "final", previousSlugs: ["v1", "v2", "v3"] };

  for (const ancien of ["v1", "v2", "v3"]) {
    const r = resolveProductBySlug([produit], ancien);
    assert.ok(r, `« ${ancien} » devrait se résoudre`);
    assert.equal(r.shouldRedirect, true);
    // Le point décisif : la destination est TOUJOURS le slug final, jamais
    // une valeur intermédiaire. Aucune chaîne de redirections ne peut se
    // former, même après plusieurs renommages successifs.
    assert.equal(r.canonicalSlug, "final");
  }
});

test("espace de fin laissé par un copier-coller depuis le Studio : l'ancien slug reste reconnu", () => {
  const produits = [{ slug: "nouveau", previousSlugs: ["ancien "] }];
  const r = resolveProductBySlug(produits, "ancien");

  assert.ok(r);
  assert.equal(r.shouldRedirect, true);
  assert.equal(r.canonicalSlug, "nouveau");
});

// ─── Absence de boucle ──────────────────────────────────────

test("ancien slug identique au slug actuel : servi directement, aucune boucle", () => {
  // Saisie que la validation du Studio refuse, mais qui pourrait exister sur
  // une fiche modifiée avant sa mise en place. Le code ne doit pas produire
  // une redirection d'une URL vers elle-même.
  const produits = [{ slug: "meme-slug", previousSlugs: ["meme-slug"] }];
  const r = resolveProductBySlug(produits, "meme-slug");

  assert.ok(r);
  assert.equal(r.shouldRedirect, false);
  assert.equal(r.canonicalSlug, "meme-slug");
});

test("le slug actuel d'une fiche prime sur l'ancien slug d'une autre", () => {
  // Deux documents répondent à la même requête. Servir le mauvais reviendrait
  // à afficher une fiche périmée et à rediriger une URL vivante.
  const vivante = { slug: "matelas-milan", previousSlugs: [] };
  const perimee = { slug: "matelas-milan-ancien-modele", previousSlugs: ["matelas-milan"] };

  for (const ordre of [[vivante, perimee], [perimee, vivante]]) {
    const r = resolveProductBySlug(ordre, "matelas-milan");
    assert.ok(r);
    assert.equal(r.shouldRedirect, false, "la fiche vivante ne doit jamais rediriger");
    assert.equal(r.product, vivante);
  }
});

test("deux fiches revendiquant le même ancien slug : résultat stable quel que soit l'ordre", () => {
  const a = { slug: "aaa-produit", previousSlugs: ["partage"] };
  const b = { slug: "bbb-produit", previousSlugs: ["partage"] };

  const r1 = resolveProductBySlug([a, b], "partage");
  const r2 = resolveProductBySlug([b, a], "partage");

  assert.equal(r1?.canonicalSlug, r2?.canonicalSlug);
});

// ─── Slug inconnu : le 404 existant est préservé ─────────────

test("slug inconnu : aucune résolution, le 404 de la page est conservé", () => {
  const produits = [{ slug: "un-produit", previousSlugs: ["son-ancien-slug"] }];

  assert.equal(resolveProductBySlug(produits, "slug-qui-n-existe-pas"), null);
  assert.equal(resolveProductBySlug([], "un-produit"), null);
  assert.equal(resolveProductBySlug(null, "un-produit"), null);
  assert.equal(resolveProductBySlug(undefined, "un-produit"), null);
  assert.equal(resolveProductBySlug(produits, ""), null);
});

test("produit sans slug actuel : écarté, car aucune destination de redirection", () => {
  const produits = [{ slug: null, previousSlugs: ["ancien"] }];
  assert.equal(resolveProductBySlug(produits, "ancien"), null);
});

// ─── Rétrocompatibilité du catalogue existant ───────────────

test("previousSlugs absent, null ou vide : la fiche se résout normalement", () => {
  const cas = [
    { slug: "produit-a" }, // champ jamais créé — cas de tout le catalogue actuel
    { slug: "produit-a", previousSlugs: null },
    { slug: "produit-a", previousSlugs: [] },
  ];

  for (const produit of cas) {
    const r = resolveProductBySlug([produit], "produit-a");
    assert.ok(r, `${JSON.stringify(produit)} devrait se résoudre`);
    assert.equal(r.shouldRedirect, false);
    assert.equal(r.canonicalSlug, "produit-a");
  }
});

test("previousSlugs mal formé : ignoré sans lever d'exception", () => {
  const produits = [
    // Valeurs qu'aucune saisie normale ne produit, mais qu'une donnée
    // importée pourrait contenir.
    { slug: "produit-b", previousSlugs: ["valide", null, 42, ""] as unknown as string[] },
  ];

  assert.equal(resolveProductBySlug(produits, "valide")?.canonicalSlug, "produit-b");
  assert.equal(resolveProductBySlug(produits, "produit-b")?.shouldRedirect, false);
});

test("un document seul au lieu d'un tableau reste résolu", () => {
  // Filet si une requête conservait un `[0]` en GROQ.
  const r = resolveProductBySlug({ slug: "solo", previousSlugs: ["ancien-solo"] }, "ancien-solo");
  assert.equal(r?.canonicalSlug, "solo");
  assert.equal(r?.shouldRedirect, true);
});

// ─── La redirection reste dans sa catégorie ─────────────────

test("ancienne URL : la redirection conserve la catégorie des quatre rubriques", () => {
  const cas = [
    { base: "/lits", ancien: "lit-coffre-cloute-copie", actuel: "lit-coffre-cloute-velours-tete-capitonnee" },
    { base: "/matelas", ancien: "matelas-barcelone-copie", actuel: "matelas-barcelone-140x190" },
    { base: "/sommiers", ancien: "sommier-lattes-copie", actuel: "sommier-lattes-140x190" },
    { base: "/oreillers", ancien: "oreiller-ritz-copie", actuel: "oreiller-ritz-duvet-oie" },
  ];

  for (const { base, ancien, actuel } of cas) {
    const r = resolveProductBySlug([{ slug: actuel, previousSlugs: [ancien] }], ancien);
    assert.ok(r);
    assert.equal(r.shouldRedirect, true);

    const cible = productUrlFor(base, r.canonicalSlug);
    assert.equal(cible, `${base}/${actuel}`);
    // Une redirection qui changerait de rubrique enverrait le visiteur — et
    // Google — sur une URL d'une autre catégorie.
    assert.ok(cible.startsWith(`${base}/`), `${cible} doit rester sous ${base}/`);
  }
});
