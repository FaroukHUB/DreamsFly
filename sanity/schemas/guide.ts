import { defineType, defineField } from "sanity";

/**
 * GUIDE — article du magazine du sommeil.
 * Pilier de la stratégie E-E-A-T : auteur identifié, contenu long, schema Article.
 */
export const guide = defineType({
  name: "guide",
  title: "Magazine (guides)",
  type: "document",
  groups: [
    { name: "main", title: "Article", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "title", title: "Titre", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, group: "main" }),
    defineField({
      name: "category",
      title: "Catégorie",
      type: "string",
      group: "main",
      options: {
        list: ["Guide d'achat", "Santé du sommeil", "Banc d'essai", "Conseils", "Comparatif"],
      },
    }),
    defineField({ name: "excerpt", title: "Extrait", type: "text", rows: 3, group: "main" }),
    defineField({ name: "coverImage", title: "Image de couverture", type: "image", options: { hotspot: true }, group: "main" }),
    defineField({ name: "author", title: "Auteur", type: "reference", to: [{ type: "author" }], group: "main" }),
    defineField({ name: "reviewer", title: "Relu et validé par", type: "reference", to: [{ type: "author" }], group: "main" }),
    defineField({ name: "publishedAt", title: "Date de publication", type: "datetime", group: "main" }),
    defineField({ name: "updatedAt", title: "Date de dernière mise à jour", type: "datetime", group: "main" }),
    defineField({
      name: "body",
      title: "Contenu",
      type: "array",
      group: "main",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ (FAQPage schema)",
      type: "array",
      group: "main",
      of: [{ type: "object", fields: [{ name: "question", type: "string" }, { name: "answer", type: "text", rows: 4 }] }],
    }),
    defineField({
      name: "relatedProducts",
      title: "Produits liés (CTA en bas d'article)",
      type: "array",
      group: "main",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        { name: "metaTitle", type: "string", title: "Meta title" },
        { name: "metaDescription", type: "text", rows: 3, title: "Meta description" },
        { name: "focusKeyword", type: "string", title: "Mot-clé principal" },
      ],
    }),
  ],
  preview: { select: { title: "title", subtitle: "category", media: "coverImage" } },
});
