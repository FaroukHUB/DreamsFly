import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * PRODUCT — un matelas DreamsFly.
 * Importé en bulk depuis le CSV Trust Industrie via scripts/import-trust-catalog.ts.
 * Modifiable ensuite individuellement depuis Sanity Studio.
 */
export const product = defineType({
  name: "product",
  title: "Matelas",
  type: "document",
  groups: [
    { name: "main", title: "Principal", default: true },
    { name: "composition", title: "Composition" },
    { name: "variants", title: "Tailles & prix" },
    { name: "media", title: "Photos & médias" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Nom court (ex. « MILAN »)",
      type: "string",
      group: "main",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Titre complet",
      type: "string",
      group: "main",
      description: "Ex : « Matelas ferme 2 places MILAN en mousse polyuréthane »",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug URL",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      group: "main",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sku",
      title: "Référence interne (SKU)",
      type: "string",
      group: "main",
    }),
    defineField({
      name: "tagline",
      title: "Phrase d'accroche courte",
      type: "string",
      group: "main",
      description: "Affichée sous le nom sur les cartes produit. Ex : « Mémoire de forme + ressorts · 7 zones »",
    }),
    defineField({
      name: "description",
      title: "Description (texte riche)",
      type: "array",
      group: "main",
      of: [{ type: "block" }],
      description: "Réécrite pour DreamsFly (pas reprise telle quelle du fournisseur).",
    }),

    // ─── Type & caractéristiques ───
    defineField({
      name: "type",
      title: "Type de matelas",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "Mousse polyuréthane", value: "mousse-polyurethane" },
          { title: "Mousse HR + ressorts", value: "mousse-hr-ressorts" },
          { title: "Mémoire de forme + ressorts", value: "memoire-ressorts" },
          { title: "Mousse + ressorts ensachés", value: "mousse-ressorts" },
        ],
      },
    }),
    defineField({
      name: "firmness",
      title: "Fermeté",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "Moelleux", value: "moelleux" },
          { title: "Équilibré", value: "equilibre" },
          { title: "Mi-ferme", value: "mi-ferme" },
          { title: "Ferme", value: "ferme" },
          { title: "Très ferme", value: "tres-ferme" },
        ],
      },
    }),
    defineField({
      name: "welcome",
      title: "Accueil",
      type: "string",
      group: "main",
      options: {
        list: ["Moelleux", "Équilibré", "Enveloppant", "Tonique"].map((v) => ({ title: v, value: v })),
      },
    }),
    defineField({
      name: "thicknessCm",
      title: "Épaisseur (cm)",
      type: "number",
      group: "main",
    }),

    defineField({
      name: "features",
      title: "Caractéristiques (chips)",
      type: "object",
      group: "main",
      fields: [
        { name: "memoireDeForme", type: "boolean", title: "Mémoire de forme" },
        { name: "antiAcariens", type: "boolean", title: "Anti-acariens" },
        { name: "hypoallergenique", type: "boolean", title: "Hypoallergénique" },
        { name: "oekoTex", type: "boolean", title: "Certifié OEKO-TEX" },
        { name: "fabriqueEurope", type: "boolean", title: "Fabriqué en Europe", initialValue: true },
        { name: "garantieAns", type: "number", title: "Garantie (années)", initialValue: 5 },
        { name: "independanceCouchage", type: "string", title: "Indépendance de couchage" },
      ],
    }),

    // ─── Composition (8 couches max) ───
    defineField({
      name: "composition",
      title: "Composition (de haut en bas)",
      type: "array",
      group: "composition",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "label", title: "Description de la couche", type: "string" },
          ],
          preview: { select: { title: "label" } },
        }),
      ],
      description: "Chaque ligne décrit une couche du matelas. Ordre du haut (housse) vers le bas (base).",
    }),

    // ─── Variantes (tailles + prix) ───
    defineField({
      name: "variants",
      title: "Tailles disponibles",
      type: "array",
      group: "variants",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "size", title: "Taille (ex. 140 x 190 cm)", type: "string" },
            { name: "sku", title: "SKU variante", type: "string" },
            { name: "price", title: "Prix (€)", type: "number" },
            { name: "compareAtPrice", title: "Prix barré (€)", type: "number" },
            { name: "weightKg", title: "Poids (kg)", type: "number" },
            { name: "stockStatus", title: "Statut stock", type: "string", options: { list: ["en-stock", "rupture", "precommande"] } },
            { name: "stripePriceId", title: "Stripe Price ID (pour le checkout)", type: "string" },
          ],
          preview: {
            select: { title: "size", price: "price" },
            prepare: ({ title, price }) => ({ title, subtitle: price ? `${price} €` : "" }),
          },
        }),
      ],
    }),

    // ─── Médias ───
    defineField({
      name: "images",
      title: "Photos produit",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alt SEO", type: "string" }],
        }),
      ],
      validation: (r) => r.min(1).max(10),
    }),

    // ─── Avis ───
    defineField({
      name: "rating",
      title: "Note moyenne",
      type: "object",
      group: "main",
      fields: [
        { name: "value", title: "Note (sur 5)", type: "number", validation: (r) => r.min(0).max(5) },
        { name: "count", title: "Nombre d'avis", type: "number" },
      ],
    }),

    // ─── Mise en avant ───
    defineField({
      name: "badges",
      title: "Badges (sur la carte)",
      type: "array",
      group: "main",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          { title: "★ Best-seller", value: "best" },
          { title: "Nouveau", value: "new" },
          { title: "Éco", value: "eco" },
          { title: "Premium", value: "premium" },
          { title: "Meilleur choix", value: "best-choice" },
        ],
      },
    }),

    defineField({
      name: "relatedProducts",
      title: "Produits associés",
      type: "array",
      group: "main",
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })],
    }),

    // ─── SEO ───
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      group: "seo",
      fields: [
        { name: "metaTitle", title: "Meta title", type: "string", validation: (r) => r.max(60) },
        { name: "metaDescription", title: "Meta description", type: "text", rows: 3, validation: (r) => r.max(160) },
        { name: "focusKeyword", title: "Mot-clé principal", type: "string" },
      ],
    }),
  ],
  orderings: [
    { title: "Nom A → Z", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
    { title: "Prix croissant", name: "priceAsc", by: [{ field: "variants[0].price", direction: "asc" }] },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "tagline",
      media: "images.0",
      price: "variants.0.price",
    },
    prepare: ({ title, subtitle, media, price }) => ({
      title,
      subtitle: [subtitle, price ? `${price} €` : null].filter(Boolean).join(" · "),
      media,
    }),
  },
});
