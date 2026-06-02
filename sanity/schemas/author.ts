import { defineType, defineField } from "sanity";

/**
 * AUTHOR — expert du comité (kiné, ostéo, ingénieur literie, médecin du sommeil).
 * Pilier E-E-A-T : signature des articles + schema Person.
 */
export const author = defineType({
  name: "author",
  title: "Auteurs & experts",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom complet", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
    defineField({
      name: "role",
      title: "Profession",
      type: "string",
      options: {
        list: ["Kinésithérapeute", "Ostéopathe", "Médecin du sommeil", "Ingénieur literie", "Designer", "Rédacteur"],
      },
    }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "bioShort", title: "Bio courte (1 ligne)", type: "string" }),
    defineField({ name: "bioLong", title: "Bio détaillée", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
    defineField({ name: "website", title: "Site personnel", type: "url" }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});
