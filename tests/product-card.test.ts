import { test } from "node:test";
import assert from "node:assert/strict";
import { productSpecs, productSpecLine, productPathFor } from "../lib/product-card.ts";

/**
 * Les cartes produit n'affichaient que le nom de collection, une accroche et
 * un prix. Fermeté, technologie et dimensions existaient pourtant en base et
 * étaient chargées par les requêtes — elles n'étaient simplement pas rendues.
 */

test("matelas : fermeté, technologie, taille — dans cet ordre", () => {
  const specs = productSpecs({
    productType: "matelas",
    firmness: "mi-ferme",
    type: "mousse-ressorts",
    variants: [{ size: "140 x 190 cm" }, { size: "160 x 200 cm" }],
  });
  assert.deepEqual(specs, ["Mi-ferme", "Ressorts ensachés", "140 x 190 cm"]);
});

test("lit : matière, coffre, taille", () => {
  const line = productSpecLine({
    productType: "lit",
    litMaterial: "velours",
    litCoffreType: "frontal",
    variants: [{ size: "160 x 200 cm" }],
  });
  assert.equal(line, "Velours · Coffre frontal · 160 x 200 cm");
});

test("sommier : type et nombre de lattes", () => {
  const line = productSpecLine({
    productType: "sommier",
    sommierType: "lattes-apparentes",
    sommierLattes: 28,
    variants: [{ size: "140 x 190 cm" }],
  });
  assert.equal(line, "Lattes apparentes · 28 lattes · 140 x 190 cm");
});

test("oreiller : la dimension vient du champ texte, pas des variantes", () => {
  const line = productSpecLine({
    productType: "oreiller",
    oreillerFilling: "duvet-oie",
    oreillerShape: "rectangulaire",
    oreillerDimensions: "60 x 40 cm",
    variants: [{ size: "Taille unique" }],
  });
  assert.equal(line, "Duvet d'oie · Rectangulaire · 60 x 40 cm");
});

test("jamais plus de trois éléments", () => {
  const specs = productSpecs({
    productType: "matelas",
    firmness: "ferme",
    type: "memoire-ressorts",
    thicknessCm: 25,
    variants: [{ size: "90 x 190 cm" }],
  });
  assert.equal(specs.length, 3);
});

test("produit sans type : traité comme un matelas", () => {
  const line = productSpecLine({ firmness: "moelleux", variants: [{ size: "140 x 190 cm" }] });
  assert.equal(line, "Moelleux · 140 x 190 cm");
});

test("valeurs inconnues ignorées plutôt qu'affichées brutes", () => {
  // Une valeur ajoutée au schéma Sanity sans libellé correspondant ne doit
  // jamais ressortir telle quelle : « mousse-nouvelle-techno » sur une carte
  // serait pire que rien.
  const line = productSpecLine({
    productType: "matelas",
    firmness: "inconnue",
    type: "techno-jamais-vue",
    variants: [{ size: "140 x 190 cm" }],
  });
  assert.equal(line, "140 x 190 cm");
});

test("aucune donnée exploitable : repli sur l'épaisseur", () => {
  assert.deepEqual(productSpecs({ productType: "matelas", thicknessCm: 24 }), ["24 cm d'épaisseur"]);
});

test("produit totalement vide : aucune ligne, pas de séparateur orphelin", () => {
  assert.deepEqual(productSpecs({}), []);
  assert.equal(productSpecLine({}), null);
  assert.equal(productSpecLine(null), null);
  assert.equal(productSpecLine(undefined), null);
});

test("variantes sans taille exploitable : ignorées", () => {
  const line = productSpecLine({
    productType: "matelas",
    firmness: "ferme",
    variants: [{ size: "  " }, { size: null }, { size: "90 x 190 cm" }],
  });
  assert.equal(line, "Ferme · 90 x 190 cm");
});

test("l'URL d'une fiche respecte la rubrique de son type", () => {
  assert.equal(productPathFor({ productType: "lit", slug: "coco" }), "/lits/coco");
  assert.equal(productPathFor({ productType: "sommier", slug: "lattes" }), "/sommiers/lattes");
  assert.equal(productPathFor({ productType: "oreiller", slug: "ritz" }), "/oreillers/ritz");
  assert.equal(productPathFor({ productType: "matelas", slug: "milan" }), "/matelas/milan");
  // Fiches importées avant l'introduction de productType.
  assert.equal(productPathFor({ slug: "berlin" }), "/matelas/berlin");
});
