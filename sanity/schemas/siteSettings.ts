import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * SITE SETTINGS — document singleton global.
 * Pilote la top bar, le menu, le footer, les infos contact, les paramètres SEO globaux.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Paramètres du site",
  type: "document",
  groups: [
    { name: "header", title: "Header", default: true },
    { name: "footer", title: "Footer" },
    { name: "contact", title: "Contact" },
    { name: "seo", title: "SEO global" },
  ],
  fields: [
    // ─── Top bar promo ───
    defineField({
      name: "topbar",
      title: "📢 Bandeau promo (top bar)",
      type: "object",
      group: "header",
      fields: [
        { name: "enabled", type: "boolean", title: "Activer la top bar", initialValue: true },
        { name: "message", type: "string", title: "Message" },
        { name: "link", type: "string", title: "Lien (optionnel)" },
      ],
    }),

    // ─── Menu principal ───
    defineField({
      name: "mainMenu",
      title: "🧭 Menu principal",
      type: "array",
      group: "header",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Label" },
            { name: "link", type: "string", title: "Lien" },
            { name: "highlight", type: "boolean", title: "Mettre en avant (couleur promo)" },
          ],
          preview: { select: { title: "label", subtitle: "link" } },
        }),
      ],
    }),

    // ─── Footer ───
    defineField({
      name: "footerTagline",
      title: "Phrase d'intro footer",
      type: "text",
      rows: 2,
      group: "footer",
    }),
    defineField({
      name: "footerColumns",
      title: "Colonnes du footer",
      type: "array",
      group: "footer",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "title", title: "Titre colonne", type: "string" },
            {
              name: "links",
              title: "Liens",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    { name: "label", type: "string", title: "Label" },
                    { name: "link", type: "string", title: "Lien" },
                  ],
                }),
              ],
            },
          ],
          preview: { select: { title: "title" } },
        }),
      ],
    }),

    defineField({
      name: "socials",
      title: "Réseaux sociaux",
      type: "object",
      group: "footer",
      fields: [
        { name: "instagram", title: "Instagram", type: "url" },
        { name: "facebook", title: "Facebook", type: "url" },
        { name: "tiktok", title: "TikTok", type: "url" },
        { name: "youtube", title: "YouTube", type: "url" },
      ],
    }),

    defineField({
      name: "paymentMethods",
      title: "Moyens de paiement (footer)",
      type: "array",
      group: "footer",
      of: [defineArrayMember({ type: "string" })],
      initialValue: ["VISA", "MasterCard", "CB", "PayPal", "Alma 4×"],
    }),

    // ─── Contact ───
    defineField({
      name: "contact",
      title: "Coordonnées",
      type: "object",
      group: "contact",
      fields: [
        { name: "phone", title: "Téléphone", type: "string" },
        { name: "email", title: "Email contact", type: "string" },
        { name: "whatsapp", title: "WhatsApp", type: "string" },
        { name: "address", title: "Adresse", type: "text", rows: 3 },
        { name: "siret", title: "SIRET", type: "string" },
        { name: "rcs", title: "RCS", type: "string" },
      ],
    }),

    // ─── SEO global ───
    defineField({
      name: "defaultSeo",
      title: "SEO par défaut",
      type: "object",
      group: "seo",
      fields: [
        { name: "metaTitleTemplate", title: "Template meta title", type: "string", initialValue: "%s · DreamsFly" },
        { name: "defaultMetaDescription", type: "text", rows: 3, title: "Description par défaut" },
        { name: "ogImage", title: "Image Open Graph par défaut", type: "image" },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "⚙️ Paramètres du site" }) },
});
