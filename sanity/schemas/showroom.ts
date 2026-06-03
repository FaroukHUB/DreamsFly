import { defineType, defineField } from "sanity";

/**
 * SHOWROOM — magasin physique.
 * URL : /magasins/[slug]
 * Schema.org LocalBusiness automatique.
 */
export const showroom = defineType({
  name: "showroom",
  title: "Showrooms",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom du showroom", type: "string" }),
    defineField({ name: "slug", title: "Slug (ex. paris)", type: "slug", options: { source: "name" } }),
    defineField({
      name: "address",
      title: "Adresse postale",
      type: "object",
      fields: [
        { name: "street", type: "string", title: "Rue" },
        { name: "postalCode", type: "string", title: "Code postal" },
        { name: "city", type: "string", title: "Ville" },
        { name: "country", type: "string", title: "Pays", initialValue: "France" },
      ],
    }),
    defineField({
      name: "coordinates",
      title: "Coordonnées GPS",
      type: "object",
      fields: [
        { name: "lat", type: "number", title: "Latitude" },
        { name: "lng", type: "number", title: "Longitude" },
      ],
    }),
    defineField({ name: "phone", title: "Téléphone", type: "string" }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({
      name: "openingHours",
      title: "Horaires d'ouverture",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "day",
              type: "string",
              title: "Jour",
              options: { list: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] },
            },
            { name: "open", type: "string", title: "Ouverture (HH:MM)" },
            { name: "close", type: "string", title: "Fermeture (HH:MM)" },
            { name: "closed", type: "boolean", title: "Fermé", initialValue: false },
          ],
        },
      ],
    }),
    defineField({
      name: "images",
      title: "Photos du showroom",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({ name: "googlePlaceId", title: "Google Place ID (pour link Maps)", type: "string" }),
    defineField({ name: "publishedAt", title: "Publication", type: "datetime" }),
  ],
  preview: {
    select: { title: "name", city: "address.city" },
    prepare: ({ title, city }) => ({ title, subtitle: city }),
  },
});
