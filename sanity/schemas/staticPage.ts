import { defineType, defineField } from "sanity";

/**
 * STATIC PAGE — pages institutionnelles éditables depuis Sanity.
 * Couvre : aide (FAQ, contact), services (livraison, garantie, essai),
 * marque (qui sommes-nous, engagements), légal (CGV, mentions, etc.).
 */
export const staticPage = defineType({
  name: "staticPage",
  title: "Pages statiques (aide, services, marque, légal)",
  type: "document",
  fields: [
    defineField({
      name: "section",
      title: "Section",
      type: "string",
      options: {
        list: [
          { title: "Aide (FAQ, Contact…)", value: "aide" },
          { title: "Services (Livraison, Garantie, Essai…)", value: "services" },
          { title: "Marque (Qui sommes-nous, Engagements…)", value: "marque" },
          { title: "Légal (CGV, Mentions, Cookies…)", value: "legal" },
          { title: "Catégorie produit (Lits, Sommiers, Oreillers…)", value: "category" },
        ],
        layout: "dropdown",
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Titre H1", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug URL",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "excerpt", title: "Chapô / accroche", type: "text", rows: 3 }),
    defineField({
      name: "body",
      title: "Contenu",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alt SEO" },
            { name: "caption", type: "string", title: "Légende" },
          ],
        },
        {
          name: "calloutBlock",
          type: "object",
          title: "💡 Encadré conseil",
          fields: [
            { name: "title", title: "Titre", type: "string" },
            { name: "text", title: "Texte", type: "text", rows: 3 },
          ],
        },
        {
          name: "faqItem",
          type: "object",
          title: "❓ Question / Réponse",
          fields: [
            { name: "question", type: "string", title: "Question" },
            { name: "answer", type: "text", rows: 4, title: "Réponse" },
          ],
        },
      ],
    }),
    defineField({ name: "metaTitle", title: "Meta title", type: "string", validation: (r) => r.max(70) }),
    defineField({ name: "metaDescription", title: "Meta description", type: "text", rows: 3, validation: (r) => r.max(170) }),
    defineField({ name: "publishedAt", title: "Date de publication", type: "datetime", description: "Vide = page non publiée (draft)" }),
    defineField({ name: "noindex", title: "Cacher de Google (noindex)", type: "boolean", initialValue: false }),
  ],
  preview: {
    select: { title: "title", section: "section", pub: "publishedAt" },
    prepare: ({ title, section, pub }) => ({
      title: `${pub ? "✅" : "📝 Draft"} ${title}`,
      subtitle: section,
    }),
  },
});
