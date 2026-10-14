import { test } from "node:test";
import assert from "node:assert/strict";
import { joinFr, sommiersHeading } from "../lib/category-h1.ts";

/**
 * Le H1 de /sommiers énumère les types présents au catalogue. Ces tests
 * vérifient surtout ce qu'il ne doit PAS faire : annoncer un type qui n'est
 * pas vendu, ou changer d'un déploiement à l'autre sans que le catalogue ait
 * bougé.
 */

test("énumération française", () => {
  assert.equal(joinFr([]), "");
  assert.equal(joinFr(["à lattes"]), "à lattes");
  assert.equal(joinFr(["à lattes", "tapissiers"]), "à lattes et tapissiers");
  assert.equal(
    joinFr(["à lattes", "tapissiers", "coffres de rangement"]),
    "à lattes, tapissiers et coffres de rangement",
  );
});

test("un seul type publié : le H1 ne nomme que celui-là", () => {
  assert.equal(
    sommiersHeading([{ sommierType: "lattes-apparentes" }, { sommierType: "lattes-apparentes" }]),
    "Sommiers à lattes",
  );
});

test("plusieurs types : énumérés sans doublon", () => {
  assert.equal(
    sommiersHeading([
      { sommierType: "tapissier" },
      { sommierType: "lattes-apparentes" },
      { sommierType: "tapissier" },
    ]),
    "Sommiers à lattes et tapissiers",
  );
});

test("l'ordre suit la table, pas le catalogue", () => {
  // Les mêmes produits dans un ordre différent doivent donner le même H1 :
  // sinon le titre changerait à chaque republication dans Sanity.
  const a = sommiersHeading([{ sommierType: "coffre" }, { sommierType: "lattes-apparentes" }]);
  const b = sommiersHeading([{ sommierType: "lattes-apparentes" }, { sommierType: "coffre" }]);
  assert.equal(a, b);
  assert.equal(a, "Sommiers à lattes et coffres de rangement");
});

test("type inconnu du référentiel : ignoré plutôt qu'affiché brut", () => {
  // Une valeur ajoutée au schéma Sanity sans libellé correspondant ne doit
  // pas ressortir telle quelle dans le H1.
  assert.equal(
    sommiersHeading([{ sommierType: "lattes-apparentes" }, { sommierType: "type-jamais-vu" }]),
    "Sommiers à lattes",
  );
});

test("catalogue vide ou illisible : repli court, jamais une énumération inventée", () => {
  assert.equal(sommiersHeading([]), "Sommiers");
  assert.equal(sommiersHeading(null), "Sommiers");
  assert.equal(sommiersHeading(undefined), "Sommiers");
  assert.equal(sommiersHeading([{ sommierType: null }, {}]), "Sommiers");
});
