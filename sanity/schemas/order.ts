import { defineType, defineField } from "sanity";

/**
 * ORDER — commande payée enregistrée via webhook Stripe.
 * Visible dans Sanity Studio pour suivi des ventes.
 */
export const order = defineType({
  name: "order",
  title: "Commandes",
  type: "document",
  fields: [
    defineField({ name: "stripeSessionId", title: "Stripe Session ID", type: "string", readOnly: true }),
    defineField({ name: "stripePaymentIntent", title: "Stripe Payment Intent", type: "string", readOnly: true }),
    defineField({ name: "customerEmail", title: "Email client", type: "string" }),
    defineField({ name: "customerName", title: "Nom client", type: "string" }),
    defineField({ name: "phone", title: "Téléphone", type: "string" }),
    defineField({
      name: "totalAmount",
      title: "Montant total (€)",
      type: "number",
    }),
    defineField({
      name: "shippingAmount",
      title: "Frais de port (€)",
      type: "number",
      description: "Inclus dans le montant total.",
    }),
    defineField({ name: "currency", title: "Devise", type: "string" }),
    defineField({
      name: "status",
      title: "Statut",
      type: "string",
      options: {
        list: [
          // « En attente » : le tunnel de paiement a été ouvert mais la carte
          // n'a pas encore été débitée. Le webhook bascule en « Payée ».
          // Une commande qui reste en attente est un panier abandonné.
          { title: "En attente de paiement", value: "pending" },
          { title: "Payée", value: "paid" },
          { title: "En préparation", value: "preparing" },
          { title: "Expédiée", value: "shipped" },
          { title: "Livrée", value: "delivered" },
          { title: "Remboursée", value: "refunded" },
          { title: "Annulée", value: "cancelled" },
        ],
      },
    }),
    defineField({
      name: "shippingAddress",
      title: "Adresse de livraison",
      type: "object",
      fields: [
        { name: "line1", type: "string", title: "Rue" },
        { name: "line2", type: "string", title: "Complément" },
        { name: "postalCode", type: "string", title: "Code postal" },
        { name: "city", type: "string", title: "Ville" },
        { name: "country", type: "string", title: "Pays" },
      ],
    }),
    defineField({
      name: "items",
      title: "Articles commandés",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", type: "string", title: "Article" },
            { name: "quantity", type: "number", title: "Qté" },
            { name: "unitAmount", type: "number", title: "Prix unitaire (€)" },
            { name: "totalAmount", type: "number", title: "Total ligne (€)" },
          ],
        },
      ],
    }),
    defineField({
      name: "createdAt",
      title: "Tunnel ouvert le",
      type: "datetime",
      readOnly: true,
      description: "Moment où le client a atteint la page de paiement.",
    }),
    defineField({ name: "paidAt", title: "Date paiement", type: "datetime", readOnly: true }),
    defineField({ name: "shippedAt", title: "Date expédition", type: "datetime" }),
    defineField({ name: "deliveredAt", title: "Date livraison", type: "datetime" }),
    defineField({ name: "internalNotes", title: "Notes internes", type: "text", rows: 4 }),
  ],
  orderings: [{ title: "Plus récente", name: "paidDesc", by: [{ field: "paidAt", direction: "desc" }] }],
  preview: {
    select: { customer: "customerName", email: "customerEmail", amount: "totalAmount", status: "status" },
    prepare: ({ customer, email, amount, status }) => ({
      title: `${customer || email || "Client"} — ${amount?.toFixed(2)} €`,
      subtitle: status,
    }),
  },
});
