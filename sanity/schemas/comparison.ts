import { defineType, defineField } from "sanity";

/**
 * COMPARISON — page comparatif (« DreamsFly vs Emma »).
 * URL : /comparatifs/[slug]
 */
export const comparison = defineType({
  name: "comparison",
  title: "Comparatifs",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Titre (ex. DreamsFly vs Emma)", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
    }),
    defineField({ name: "intro", title: "Intro (60-100 mots)", type: "text", rows: 4 }),
    defineField({
      name: "criteria",
      title: "Critères de comparaison",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Critère" },
            { name: "us", type: "string", title: "DreamsFly" },
            { name: "them", type: "string", title: "Concurrent" },
            { name: "winner", type: "string", title: "Avantage", options: { list: ["us", "them", "tie"] } },
          ],
        },
      ],
    }),
    defineField({
      name: "verdict",
      title: "Verdict (rich text)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "publishedAt", title: "Publication", type: "datetime" }),
  ],
  preview: { select: { title: "title" } },
});
