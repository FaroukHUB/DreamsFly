/**
 * Constantes panier partagées entre le client et le serveur.
 *
 * Ce module ne contient AUCUNE dépendance React ou zustand : il peut donc
 * être importé aussi bien depuis un composant client que depuis une route
 * API. `lib/cart/store.ts` est marqué "use client" et ne peut pas servir
 * de source à du code serveur.
 */

/** Frais de port forfaitaires appliqués à toute commande France métropolitaine. */
export const SHIPPING_FEE_EUR = 99;

/** Statuts de stock qui interdisent l'achat (cf. schéma produit Sanity). */
export const UNAVAILABLE_STOCK_STATUSES = ["rupture"] as const;
