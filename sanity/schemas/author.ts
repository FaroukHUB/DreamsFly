import { defineType, defineField } from "sanity";

/**
 * AUTHOR — expert signataire des contenus E-E-A-T.
 * IMPORTANT : champ "credentials" libre, pas de promesse médicale.
 * Si DreamsFly n'a pas encore d'expert sous contrat, on coche "placeholder"
 * et l'affichage se neutralise (pas de schema Person diffusé, pas de signature).
 */
export const author = defineType({
  name: "author",
  title: "Auteurs & experts",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nom complet", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" } }),
    defineField({
      name: "isPlaceholder",
      title: "Placeholder (pas d'expert sous contrat — masquer la signature)",
      type: "boolean",
      initialValue: true,
      description:
        "Quand activé, l'auteur n'apparaît PAS sur le site et n'est PAS injecté dans le schema.org. À désactiver quand l'expert est réellement engagé.",
    }),
    defineField({
      name: "role",
      title: "Profession (libre)",
      type: "string",
      description: "Ex : « Kinésithérapeute », « Ingénieur literie », « Conseiller en confort ». Pas de fausse promesse médicale.",
    }),
    defineField({
      name: "credentials",
      title: "Diplômes / certifications (libre, à remplir réellement)",
      type: "array",
      of: [{ type: "string" }],
      description: "Ex : « Diplôme d'État de Masseur-Kinésithérapeute, 2014 ». Vide tant qu'on n'a rien à mettre.",
    }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "bioShort", title: "Bio courte", type: "string" }),
    defineField({ name: "bioLong", title: "Bio détaillée", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
    defineField({ name: "website", title: "Site personnel", type: "url" }),
    defineField({ name: "publishedAt", title: "Date de mise en ligne profil", type: "datetime" }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo", isPlaceholder: "isPlaceholder" },
    prepare: ({ title, subtitle, media, isPlaceholder }) => ({
      title: `${isPlaceholder ? "📝 " : "✅ "}${title || "(sans nom)"}`,
      subtitle: isPlaceholder ? `Placeholder · ${subtitle || ""}` : subtitle,
      media,
    }),
  },
});
