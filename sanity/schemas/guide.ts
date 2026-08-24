import { defineType, defineField } from "sanity";

/**
 * GUIDE — article du magazine du sommeil.
 * URL : /magazine/[slug]
 * E-E-A-T : auteur identifié, dates, sources, schema Article (+ HowTo si applicable).
 */
export const guide = defineType({
  name: "guide",
  title: "Magazine (guides)",
  type: "document",
  groups: [
    { name: "main", title: "Article", default: true },
    { name: "seo", title: "SEO" },
    { name: "publish", title: "Publication" },
  ],
  fields: [
    defineField({ name: "title", title: "Titre H1", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, group: "main" }),
    defineField({
      name: "articleType",
      title: "Type d'article",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "Guide d'achat", value: "buying-guide" },
          { title: "How-to (tutoriel pratique)", value: "how-to" },
          { title: "Comparatif", value: "comparison" },
          { title: "Santé du sommeil", value: "health" },
          { title: "Conseils & astuces", value: "tips" },
          { title: "Banc d'essai", value: "review" },
        ],
      },
    }),
    defineField({
      name: "excerpt",
      title: "Extrait / chapô (60-80 mots — pour AI)",
      type: "text",
      rows: 3,
      group: "main",
      description: "Premier paragraphe affiché. Les LLM en extraient l'essentiel.",
    }),
    defineField({ name: "coverImage", title: "Image de couverture", type: "image", options: { hotspot: true }, group: "main" }),
    defineField({
      name: "body",
      title: "Contenu de l'article",
      type: "array",
      group: "main",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alt SEO", type: "string" }],
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
          name: "howToStep",
          type: "object",
          title: "📋 Étape de tutoriel (HowTo)",
          fields: [
            { name: "name", title: "Nom de l'étape", type: "string" },
            { name: "text", title: "Description", type: "text", rows: 3 },
            { name: "image", title: "Visuel", type: "image", options: { hotspot: true } },
          ],
        },
        {
          name: "htmlBlock",
          type: "object",
          title: "🧩 HTML + CSS libre (bloc avancé)",
          description:
            "Colle du HTML/CSS brut pour un rendu totalement custom (tableaux stylés, encarts colorés, iframe, etc.). ATTENTION : le contenu est injecté tel quel — ne colle que du HTML de confiance.",
          fields: [
            {
              name: "html",
              title: "Code HTML (peut inclure <style> et <script> — attention XSS)",
              type: "text",
              rows: 12,
              description:
                "Exemples : <div class='ma-classe'>…</div> · <style>.ma-classe { color: gold; }</style> · <iframe src='…'></iframe>",
            },
            {
              name: "label",
              title: "Label interne (pour se repérer dans la liste des blocs)",
              type: "string",
            },
          ],
          preview: {
            select: { label: "label", html: "html" },
            prepare: ({ label, html }) => ({
              title: label || "Bloc HTML libre",
              subtitle: html ? html.slice(0, 60).replace(/\n/g, " ") + "…" : "(vide)",
            }),
          },
        },
      ],
    }),
    defineField({
      name: "faq",
      title: "FAQ (FAQPage schema)",
      type: "array",
      group: "main",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", type: "string", title: "Question" },
            { name: "answer", type: "text", rows: 3, title: "Réponse" },
          ],
        },
      ],
    }),
    defineField({
      name: "sources",
      title: "Sources & références (signaux d'autorité)",
      type: "array",
      group: "main",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Titre source", type: "string" },
            { name: "publisher", title: "Publisher", type: "string" },
            { name: "url", title: "URL", type: "url" },
            { name: "year", title: "Année", type: "number" },
          ],
        },
      ],
    }),

    // E-E-A-T
    defineField({ name: "author", title: "Auteur", type: "reference", to: [{ type: "author" }], group: "main" }),
    defineField({ name: "reviewer", title: "Relu par", type: "reference", to: [{ type: "author" }], group: "main" }),

    // Linking
    defineField({
      name: "relatedProducts",
      title: "Produits liés (CTA en bas)",
      type: "array",
      group: "main",
      of: [{ type: "reference", to: [{ type: "product" }] }],
    }),
    defineField({
      name: "relatedGuides",
      title: "Guides liés",
      type: "array",
      group: "main",
      of: [{ type: "reference", to: [{ type: "guide" }] }],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "main",
      of: [{ type: "string" }],
    }),

    // SEO
    defineField({ name: "metaTitle", title: "Meta title", type: "string", group: "seo", validation: (r) => r.max(70) }),
    defineField({ name: "metaDescription", title: "Meta description", type: "text", rows: 3, group: "seo", validation: (r) => r.max(170) }),
    defineField({ name: "focusKeyword", title: "Mot-clé principal", type: "string", group: "seo" }),

    // Publication
    defineField({ name: "publishedAt", title: "Date de publication", type: "datetime", group: "publish" }),
    defineField({ name: "updatedAt", title: "Date de dernière mise à jour", type: "datetime", group: "publish" }),
  ],
  preview: {
    select: { title: "title", subtitle: "articleType", media: "coverImage", pub: "publishedAt" },
    prepare: ({ title, subtitle, media, pub }) => ({
      title: `${pub ? "✅" : "📝 Draft"} ${title}`,
      subtitle,
      media,
    }),
  },
});
