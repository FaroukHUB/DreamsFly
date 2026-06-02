import { defineType, defineField } from "sanity";

/**
 * REVIEW — avis client vérifié affiché sur la home et les fiches produit.
 */
export const review = defineType({
  name: "review",
  title: "Avis clients",
  type: "document",
  fields: [
    defineField({ name: "author", title: "Prénom + initiale (ex. Claire M.)", type: "string" }),
    defineField({ name: "city", title: "Ville", type: "string" }),
    defineField({ name: "rating", title: "Note (1 à 5)", type: "number", validation: (r) => r.min(1).max(5) }),
    defineField({ name: "text", title: "Avis", type: "text", rows: 4 }),
    defineField({ name: "date", title: "Date", type: "date" }),
    defineField({ name: "verified", title: "Achat vérifié", type: "boolean", initialValue: true }),
    defineField({ name: "product", title: "Matelas concerné (optionnel)", type: "reference", to: [{ type: "product" }] }),
    defineField({ name: "highlighted", title: "Mettre en avant sur la home", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "author", rating: "rating", subtitle: "city" },
    prepare: ({ title, rating, subtitle }) => ({
      title: `${title} · ${"★".repeat(rating || 0)}`,
      subtitle,
    }),
  },
});
