import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * SHOWROOMS PAGE — singleton pour la page /magasins.
 * Le contenu éditorial (hero, intro, argumentaire, FAQ, SEO) est éditable ici.
 * Les 3 fiches magasins restent des documents `showroom` séparés.
 */
export const showroomsPage = defineType({
  name: "showroomsPage",
  title: "🏬 Page Magasins",
  type: "document",
  groups: [
    { name: "hero", title: "Hero", default: true },
    { name: "content", title: "Argumentaire & FAQ" },
    { name: "seo", title: "SEO / Meta" },
  ],
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Sur-titre (eyebrow)",
      type: "string",
      group: "hero",
      initialValue: "Venez nous voir",
    }),
    defineField({
      name: "heroTitle",
      title: "Titre H1",
      type: "string",
      group: "hero",
      initialValue: "Trois showrooms pour tester nos matelas.",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Sous-titre / intro",
      type: "text",
      rows: 4,
      group: "hero",
      initialValue:
        "Le matelas est l'achat le plus intime de votre maison. Venez le tester en boutique, échanger avec nos conseillers et faire votre choix en toute sérénité.",
    }),
    defineField({
      name: "heroImage",
      title: "🖼️ Image du hero (optionnel)",
      type: "image",
      group: "hero",
      options: { hotspot: true },
      description:
        "Si tu uploads une image, elle apparaît à droite du texte du hero (layout split). Sinon, le hero reste sur toute la largeur.",
      fields: [{ name: "alt", title: "Alt SEO", type: "string" }],
    }),

    defineField({
      name: "argumentsTitle",
      title: "🎯 Argumentaire — Titre de section",
      type: "string",
      group: "content",
      initialValue: "Pourquoi essayer en showroom",
    }),
    defineField({
      name: "argumentsItems",
      title: "🎯 Arguments (3 à 6)",
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
      initialValue: [
        {
          _key: "arg1",
          icon: "🛏️",
          title: "Essai libre sur tous les modèles",
          text: "Allongez-vous 10 à 15 minutes sur chaque matelas exposé. C'est le seul vrai test avant achat.",
        },
        {
          _key: "arg2",
          icon: "🎓",
          title: "Conseil expert personnalisé",
          text: "Nos conseillers vous orientent selon votre morphologie, votre position de sommeil et vos habitudes.",
        },
        {
          _key: "arg3",
          icon: "🚚",
          title: "Livraison et reprise ancien matelas",
          text: "Devis livraison à domicile et reprise de votre ancien couchage directement en magasin.",
        },
      ],
    }),

    defineField({
      name: "faqTitle",
      title: "❓ FAQ — Titre",
      type: "string",
      group: "content",
      initialValue: "Vos questions sur la visite en magasin",
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

    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      group: "seo",
      validation: (r) => r.max(60),
      initialValue: "Nos showrooms — Venez tester nos matelas",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (r) => r.max(160),
      initialValue:
        "Trois magasins physiques DreamsFly pour tester nos matelas avant achat. Nos conseillers experts vous accompagnent en boutique.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "🏬 Page Magasins" }),
  },
});
