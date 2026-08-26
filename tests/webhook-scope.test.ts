import { test } from "node:test";
import assert from "node:assert/strict";

/**
 * Cloisonnement d'un compte Stripe partagé.
 *
 * Le compte héberge DreamsFly ET une autre activité. Un compte Stripe émet
 * ses événements pour TOUS les paiements qu'il traite : sans filtre, chaque
 * vente de l'autre marque créerait une fausse commande dans le Sanity de
 * DreamsFly. Une clé API distincte n'y change rien — elle authentifie, elle
 * ne cloisonne pas.
 *
 * Reproduit la logique de belongsToDreamsFly (app/api/stripe-webhook).
 */
const SOURCE_MARKER = "dreamsfly-web";

function belongsToDreamsFly(event: any): boolean {
  return event?.data?.object?.metadata?.source === SOURCE_MARKER;
}

const evt = (type: string, metadata: Record<string, string> | null) => ({
  type,
  data: { object: { metadata } },
});

test("un paiement du tunnel DreamsFly est traité", () => {
  assert.equal(
    belongsToDreamsFly(evt("payment_intent.succeeded", { source: "dreamsfly-web" })),
    true,
  );
});

test("un paiement de l'autre activité est ignoré", () => {
  // Cas réel : deux paiements Mobilier Malin de 40 € et 240 € sont arrivés
  // sur ce webhook. Sans filtre, ils auraient créé deux fausses commandes.
  assert.equal(belongsToDreamsFly(evt("payment_intent.succeeded", null)), false);
  assert.equal(
    belongsToDreamsFly(evt("payment_intent.succeeded", { source: "mobilier-malin" })),
    false,
  );
});

test("un paiement sans métadonnées est ignoré", () => {
  // Paiement créé à la main depuis le dashboard, lien de paiement, facture…
  assert.equal(belongsToDreamsFly(evt("payment_intent.succeeded", {})), false);
  assert.equal(belongsToDreamsFly({ type: "payment_intent.succeeded", data: { object: {} } }), false);
});

test("une session Checkout DreamsFly est traitée", () => {
  assert.equal(
    belongsToDreamsFly(evt("checkout.session.completed", { source: "dreamsfly-web" })),
    true,
  );
});

test("le PaymentIntent né d'une session n'a pas le marqueur — et c'est voulu", () => {
  // Un PaymentIntent créé par une Checkout Session n'hérite pas des
  // métadonnées de la session. Il est donc ignoré, et c'est
  // checkout.session.completed qui fait foi : aucun double traitement.
  assert.equal(belongsToDreamsFly(evt("payment_intent.succeeded", null)), false);
});

test("tolère un événement malformé sans lever d'exception", () => {
  assert.equal(belongsToDreamsFly(null), false);
  assert.equal(belongsToDreamsFly({}), false);
  assert.equal(belongsToDreamsFly({ data: null }), false);
});
