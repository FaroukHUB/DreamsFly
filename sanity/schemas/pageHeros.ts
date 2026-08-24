import { defineType, defineField } from "sanity";

/**
 * PAGE HEROS — singleton unique pour piloter toutes les images de hero
 * des pages hardcodées (celles qui ne sont pas des singletons Sanity).
 *
 * L'admin uploade ici une image par page — le site l'utilise
 * automatiquement en fallback si pas d'override dans le code.
 */
export const pageHeros = defineType({
  name: "pageHeros",
  title: "🖼️ Images des Héros",
  type: "document",
  groups: [
    { name: "landings", title: "Landings SEO", default: true },
    { name: "categories", title: "Pages catégories" },
    { name: "utility", title: "Pages utilitaires" },
  ],
  fields: [
    // ─── LANDINGS SEO ─────────────────
    defineField({
      name: "memoireDeForme",
      title: "Matelas mémoire de forme (/matelas-memoire-de-forme)",
      type: "image",
      group: "landings",
      options: { hotspot: true },
      description: "Image du hero — chambre lumineuse, ambiance premium.",
      fields: [{ name: "alt", title: "Alt SEO", type: "string" }],
    }),
    defineField({
      name: "malDeDos",
      title: "Matelas mal de dos (/matelas-mal-de-dos)",
      type: "image",
      group: "landings",
      options: { hotspot: true },
      description: "Image du hero — préférer une ambiance santé/bien-être.",
      fields: [{ name: "alt", title: "Alt SEO", type: "string" }],
    }),
    defineField({
      name: "litsCoffre",
      title: "Guide lits coffre (/lits-coffre)",
      type: "image",
      group: "landings",
      options: { hotspot: true },
      description: "Image du hero — chambre moderne, coffre visible si possible.",
      fields: [{ name: "alt", title: "Alt SEO", type: "string" }],
    }),

    // ─── CATÉGORIES ─────────────────
    defineField({
      name: "matelas",
      title: "Collection matelas (/matelas)",
      type: "image",
      group: "categories",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt SEO", type: "string" }],
    }),
    defineField({
      name: "lits",
      title: "Collection lits (/lits)",
      type: "image",
      group: "categories",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt SEO", type: "string" }],
    }),
    defineField({
      name: "sommiers",
      title: "Collection sommiers (/sommiers)",
      type: "image",
      group: "categories",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt SEO", type: "string" }],
    }),
    defineField({
      name: "oreillers",
      title: "Collection oreillers (/oreillers)",
      type: "image",
      group: "categories",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt SEO", type: "string" }],
    }),

    // ─── UTILITAIRES ─────────────────
    defineField({
      name: "aideContact",
      title: "Nous contacter (/aide/contact)",
      type: "image",
      group: "utility",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt SEO", type: "string" }],
    }),
  ],
  preview: {
    prepare: () => ({ title: "🖼️ Images des Héros" }),
  },
});
