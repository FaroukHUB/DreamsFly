import { defineType, defineField } from "sanity";

/**
 * GLOSSARY — entrée de glossaire literie.
 * Optimisé pour les citations IA : définition courte + Schema.org DefinedTerm.
 * URL : /glossaire/[slug]
 */
export const glossary = defineType({
  name: "glossary",
  title: "Glossaire",
  type: "document",
  fields: [
    defineField({ name: "term", title: "Terme", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "term", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "shortDefinition",
      title: "Définition courte (40-60 mots — pour AI)",
      type: "text",
      rows: 3,
      validation: (r) => r.required().min(80).max(400),
    }),
    defineField({
      name: "longDefinition",
      title: "Définition longue (article)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      options: {
        list: [
          "Matériau",
          "Technologie",
          "Mesure",
          "Confort",
          "Santé du sommeil",
          "Entretien",
          "Réglementation",
        ],
      },
    }),
    defineField({ name: "synonyms", title: "Synonymes", type: "array", of: [{ type: "string" }] }),
    defineField({
      name: "relatedTerms",
      title: "Termes liés",
      type: "array",
      of: [{ type: "reference", to: [{ type: "glossary" }] }],
    }),
    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
      description: "Vide = draft",
    }),
  ],
  preview: { select: { title: "term", subtitle: "category" } },
});
