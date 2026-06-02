import { defineType, defineField } from "sanity";

/**
 * CATEGORY — page catégorie SEO (ex. /matelas/memoire-de-forme/).
 * Génère une page avec contenu éditorial + grille produits.
 */
export const category = defineType({
  name: "category",
  title: "Catégories",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      title: "Type de catégorie",
      type: "string",
      options: {
        list: [
          { title: "Par technologie (mousse, ressorts, hybride)", value: "technology" },
          { title: "Par taille (140x190, 160x200...)", value: "size" },
          { title: "Par fermeté (ferme, équilibré...)", value: "firmness" },
          { title: "Par profil (mal de dos, couple...)", value: "profile" },
        ],
      },
    }),
    defineField({ name: "title", title: "Titre H1", type: "string" }),
    defineField({ name: "intro", title: "Intro (200 mots)", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "longContent", title: "Contenu long SEO (sous la grille)", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "faq",
      title: "FAQ (FAQPage schema)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", type: "string", title: "Question" },
            { name: "answer", type: "text", rows: 4, title: "Réponse" },
          ],
        },
      ],
    }),
    defineField({
      name: "products",
      title: "Produits affichés",
      type: "array",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", type: "string", title: "Meta title" },
        { name: "metaDescription", type: "text", rows: 3, title: "Meta description" },
      ],
    }),
  ],
  preview: { select: { title: "name", subtitle: "kind" } },
});
