import { test } from "node:test";
import assert from "node:assert/strict";
import { recommendProduct } from "../lib/quiz-algorithm.ts";
import { quizStepsFor, BUDGET_RANGE } from "../lib/quiz-defaults.ts";

/**
 * Le quiz posait les six mêmes questions matelas à tout le monde, et son
 * algorithme notait un ensemble qui ne contenait que des matelas : un
 * visiteur venu pour un oreiller repartait avec un matelas.
 */

const CATALOG = [
  { _id: "m1", name: "MILAN", productType: "matelas", type: "mousse-ressorts", firmness: "ferme",
    minPrice: 690, variants: [{ size: "140 x 190 cm" }] },
  { _id: "m2", name: "NEW YORK", productType: "matelas", type: "memoire-ressorts", firmness: "mi-ferme",
    minPrice: 890, variants: [{ size: "140 x 190 cm" }] },
  { _id: "o1", name: "ERGONOMIC", productType: "oreiller", oreillerFilling: "memoire-forme",
    firmness: "ferme", features: { antiAcariens: true }, minPrice: 89, variants: [{ size: "60 x 60 cm" }] },
  { _id: "o2", name: "COOLING", productType: "oreiller", oreillerFilling: "duvet-oie",
    firmness: "moelleux", features: {}, minPrice: 69, variants: [{ size: "60 x 60 cm" }] },
  { _id: "l1", name: "ALMA", productType: "lit", litMaterial: "velours", litCoffreType: "frontal",
    litCoffreCapacityL: 450, minPrice: 790, variants: [{ size: "140 x 190 cm" }] },
  { _id: "l2", name: "JADE", productType: "lit", litMaterial: "tissu-trame", litCoffreType: "lateral",
    litCoffreCapacityL: 300, minPrice: 690, variants: [{ size: "160 x 200 cm" }] },
];

test("oreiller : la recommandation est un oreiller, jamais un matelas", () => {
  const { best, alternatives } = recommendProduct(CATALOG, {
    productType: "oreiller",
    sleepPosition: "cote",
    pillowFilling: "memoire-forme",
    firmnessPreference: "ferme",
    allergies: "oui",
    budget: [59, 99],
  });
  assert.equal(best?.product.productType, "oreiller");
  assert.equal(best?.product.name, "ERGONOMIC", "mémoire de forme, ferme, anti-acariens");
  for (const a of alternatives) assert.equal(a.product.productType, "oreiller");
});

test("lit : la recommandation est un lit, et la taille demandée est disponible", () => {
  const { best, alternatives } = recommendProduct(CATALOG, {
    productType: "lit",
    size: "160x200",
    bedCoffreType: "lateral",
    bedMaterial: "tissu-trame",
    storageNeed: "modere",
    budget: [300, 2500],
  });
  assert.equal(best?.product.productType, "lit");
  assert.equal(best?.product.name, "JADE", "seul lit disponible en 160×200");
  for (const a of alternatives) assert.equal(a.product.productType, "lit");
});

test("matelas : le parcours historique fonctionne toujours", () => {
  const { best } = recommendProduct(CATALOG, {
    productType: "matelas",
    size: "140x190",
    sleepPosition: "cote",
    weight: "leger",
    firmnessPreference: "moelleux",
    budget: [200, 2500],
  });
  assert.equal(best?.product.productType, "matelas");
});

test("un allergique n'est pas orienté vers du duvet", () => {
  const { best } = recommendProduct(CATALOG, {
    productType: "oreiller",
    sleepPosition: "dos",
    allergies: "oui",
    budget: [59, 99],
  });
  assert.notEqual(best?.product.oreillerFilling, "duvet-oie");
});

test("les questions posées correspondent au produit choisi", () => {
  const keys = (t: string) => quizStepsFor(t).map((s) => s.key);

  const oreiller = keys("oreiller");
  assert.ok(oreiller.includes("pillowFilling"), "le garnissage est demandé");
  assert.ok(oreiller.includes("allergies"), "les allergies sont demandées");
  assert.ok(!oreiller.includes("weight"), "le gabarit n'a pas de sens pour un oreiller");
  assert.ok(!oreiller.includes("priorities"), "l'indépendance de couchage non plus");

  const lit = keys("lit");
  assert.ok(lit.includes("bedCoffreType"), "le type de coffre est demandé");
  assert.ok(lit.includes("bedMaterial"), "la matière est demandée");
  assert.ok(!lit.includes("sleepPosition"), "la position de sommeil ne départage aucun lit");

  const matelas = keys("matelas");
  assert.ok(matelas.includes("weight") && matelas.includes("priorities"));
});

test("le budget oreiller couvre la gamme réelle, pas celle des matelas", () => {
  const o = BUDGET_RANGE.oreiller;
  assert.ok(o.max <= 150, `le maximum doit rester réaliste (${o.max} €)`);
  assert.ok(o.min <= 59 && o.max >= 99, "la fourchette 59–99 € du catalogue doit tenir dedans");
  assert.ok(BUDGET_RANGE.matelas.max > o.max * 5, "sans commune mesure avec les matelas");
});

test("un catalogue sans le type demandé ne recommande rien plutôt qu'autre chose", () => {
  const onlyMattresses = CATALOG.filter((p) => p.productType === "matelas");
  const { best } = recommendProduct(onlyMattresses, { productType: "oreiller" });
  assert.equal(best, undefined, "mieux vaut aucune reco qu'une reco hors sujet");
});
