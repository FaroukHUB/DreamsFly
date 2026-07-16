import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * QUIZ PAGE — singleton pour la page /quiz.
 * Questions du quiz éditables + contenu SEO autour.
 */
export const quizPage = defineType({
  name: "quizPage",
  title: "🧭 Page Quiz",
  type: "document",
  groups: [
    { name: "hero", title: "Intro / Hero", default: true },
    { name: "questions", title: "Questions du quiz" },
    { name: "content", title: "Contenu SEO éditorial" },
    { name: "seo", title: "SEO / Meta" },
  ],
  fields: [
    // ─── Hero ──────────────────────────
    defineField({
      name: "heroEyebrow",
      title: "Sur-titre (hero)",
      type: "string",
      group: "hero",
      initialValue: "Aide au choix personnalisée",
    }),
    defineField({
      name: "heroTitle",
      title: "Titre H1",
      type: "string",
      group: "hero",
      initialValue: "Quel matelas choisir ? Le quiz DreamsFly",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Sous-titre / intro",
      type: "text",
      rows: 3,
      group: "hero",
    }),

    // ─── Questions du quiz ─────────────
    defineField({
      name: "questions",
      title: "Étapes du quiz (dans l'ordre)",
      type: "array",
      group: "questions",
      description:
        "Chaque étape = 1 question. Type single = 1 seule réponse. Type multi = plusieurs réponses. Type slider = fourchette de prix.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            {
              name: "key",
              type: "string",
              title: "Clé de la réponse (technique)",
              description: "Ne pas modifier si tu ne sais pas ce que tu fais. Valeurs valides : productType, size, sleepPosition, weight, priorities, firmnessPreference, budget",
              options: {
                list: [
                  { title: "Type de produit", value: "productType" },
                  { title: "Taille", value: "size" },
                  { title: "Position de sommeil", value: "sleepPosition" },
                  { title: "Gabarit", value: "weight" },
                  { title: "Priorités (multi)", value: "priorities" },
                  { title: "Fermeté préférée", value: "firmnessPreference" },
                  { title: "Budget (slider)", value: "budget" },
                ],
              },
              validation: (r) => r.required(),
            },
            {
              name: "type",
              type: "string",
              title: "Type de question",
              options: {
                list: [
                  { title: "Choix unique (single)", value: "single" },
                  { title: "Choix multiple (multi)", value: "multi" },
                  { title: "Slider budget", value: "slider" },
                ],
              },
              initialValue: "single",
              validation: (r) => r.required(),
            },
            { name: "question", type: "string", title: "Question", validation: (r) => r.required() },
            { name: "subtitle", type: "string", title: "Sous-titre / aide (optionnel)" },

            // Options pour single/multi
            {
              name: "options",
              type: "array",
              title: "Options (single / multi uniquement)",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    { name: "value", type: "string", title: "Valeur technique (ex. 'dos', 'moelleux', '140x190')" },
                    { name: "label", type: "string", title: "Label affiché" },
                    { name: "subtitle", type: "string", title: "Description courte (optionnel)" },
                  ],
                  preview: { select: { title: "label", subtitle: "subtitle" } },
                }),
              ],
              hidden: ({ parent }) => parent?.type === "slider",
            },

            // Params pour slider
            { name: "min", type: "number", title: "Minimum (slider)", hidden: ({ parent }) => parent?.type !== "slider" },
            { name: "max", type: "number", title: "Maximum (slider)", hidden: ({ parent }) => parent?.type !== "slider" },
            { name: "step", type: "number", title: "Pas (slider)", hidden: ({ parent }) => parent?.type !== "slider" },
          ],
          preview: {
            select: { title: "question", subtitle: "type" },
            prepare: ({ title, subtitle }) => ({
              title: title || "(sans question)",
              subtitle: subtitle === "multi" ? "Choix multiple" : subtitle === "slider" ? "Slider" : "Choix unique",
            }),
          },
        }),
      ],
    }),

    // ─── Contenu SEO éditorial ────────
    defineField({
      name: "methodTitle",
      title: "🎯 Section Méthode — Titre",
      type: "string",
      group: "content",
      initialValue: "Comment ce quiz vous oriente",
    }),
    defineField({
      name: "methodSteps",
      title: "🎯 Étapes de la méthode",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "icon", type: "string", title: "Emoji" },
            { name: "title", type: "string", title: "Titre" },
            { name: "text", type: "text", rows: 3, title: "Description" },
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),

    defineField({
      name: "criteriaTitle",
      title: "📚 Section Critères — Titre",
      type: "string",
      group: "content",
      initialValue: "Les critères qui comptent vraiment",
    }),
    defineField({
      name: "criteriaItems",
      title: "📚 Critères détaillés (avec sources optionnelles)",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "icon", type: "string", title: "Emoji" },
            { name: "title", type: "string", title: "Titre du critère" },
            { name: "text", type: "text", rows: 4, title: "Explication" },
            { name: "source", type: "string", title: "Source (optionnel — ex. INSV, INSERM)" },
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),

    defineField({
      name: "pitfallsTitle",
      title: "⚠️ Section Pièges — Titre",
      type: "string",
      group: "content",
      initialValue: "Erreurs qui coûtent cher",
    }),
    defineField({
      name: "pitfallsItems",
      title: "⚠️ Pièges à éviter",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "title", type: "string", title: "Titre du piège" },
            { name: "text", type: "text", rows: 3, title: "Explication" },
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),

    defineField({
      name: "faqTitle",
      title: "❓ FAQ — Titre",
      type: "string",
      group: "content",
      initialValue: "Vos questions sur le choix d'un matelas",
    }),
    defineField({
      name: "faqItems",
      title: "❓ FAQ — Questions/Réponses",
      type: "array",
      group: "content",
      description: "Injecté en JSON-LD FAQPage pour rich snippet Google.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "question", type: "string", title: "Question", validation: (r) => r.required() },
            { name: "answer", type: "text", rows: 4, title: "Réponse", validation: (r) => r.required() },
          ],
          preview: { select: { title: "question", subtitle: "answer" } },
        }),
      ],
    }),

    // ─── SEO ──────────────────────────
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      group: "seo",
      validation: (r) => r.max(60),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (r) => r.max(160),
    }),
  ],
  preview: {
    prepare: () => ({ title: "🧭 Page Quiz" }),
  },
});
