import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * HOMEPAGE — document singleton.
 * C'est ICI que l'utilisateur pilote le contenu de la home, notamment :
 *  - Le HERO modulaire (vidéo / image / promo) — choix du type via radio
 *  - La bannière secondaire à droite (idem modulaire)
 *  - Les sections (USPs, best-sellers à mettre en avant, mosaïque collections...)
 */
export const homepage = defineType({
  name: "homepage",
  title: "Page d'accueil",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre interne (non affiché)",
      type: "string",
      initialValue: "Page d'accueil DreamsFly",
      readOnly: true,
    }),

    // ─────────────────────────────────────────────────
    // HERO MODULAIRE — TYPE 1 : Vidéo / Image / Promo
    // ─────────────────────────────────────────────────
    defineField({
      name: "hero",
      title: "🎬 Hero principal",
      type: "object",
      description:
        "Choisis le type d'affichage du hero : vidéo cinématique, image fixe, ou bannière promo. Les champs correspondants apparaîtront.",
      options: { collapsible: false },
      fields: [
        defineField({
          name: "type",
          title: "Type de hero",
          type: "string",
          options: {
            list: [
              { title: "🎥 Vidéo (recommandé)", value: "video" },
              { title: "🖼️ Image fixe", value: "image" },
              { title: "🏷️ Bannière promo", value: "promo" },
            ],
            layout: "radio",
          },
          initialValue: "video",
          validation: (r) => r.required(),
        }),

        // ── Champs vidéo ──
        defineField({
          name: "videoFile",
          title: "Fichier vidéo (.mp4)",
          type: "file",
          options: { accept: "video/mp4,video/webm" },
          description: "Format MP4 (H.264) recommandé. Compressé à moins de 2 Mo idéalement.",
          hidden: ({ parent }) => parent?.type !== "video",
        }),
        defineField({
          name: "videoPoster",
          title: "Image poster (1er frame)",
          type: "image",
          description: "Affichée pendant le chargement de la vidéo. Compte pour le LCP (Core Web Vitals).",
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.type !== "video",
        }),

        // ── Champs image ──
        defineField({
          name: "image",
          title: "Image hero",
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", title: "Texte alternatif (SEO)", type: "string" },
          ],
          hidden: ({ parent }) => parent?.type !== "image",
        }),

        // ── Champs promo ──
        defineField({
          name: "promoBadge",
          title: "Badge promo (ex. « -40% Offre des Beaux Jours »)",
          type: "string",
          hidden: ({ parent }) => parent?.type !== "promo",
        }),
        defineField({
          name: "promoImage",
          title: "Image produit (promo)",
          type: "image",
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.type !== "promo",
        }),
        defineField({
          name: "promoPrice",
          title: "Prix « dès » (ex. « dès 449 € »)",
          type: "string",
          hidden: ({ parent }) => parent?.type !== "promo",
        }),

        // ── Champs communs (titre, sous-titre, CTAs) ──
        defineField({
          name: "title",
          title: "Titre principal superposé",
          type: "string",
          description: "Utilise un saut de ligne pour mettre un mot en accent. Ex : « Dormez. » ⏎ « Envolez-vous. »",
          initialValue: "Dormez.\nEnvolez-vous.",
        }),
        defineField({
          name: "subtitle",
          title: "Sous-titre / accroche",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "ctaPrimary",
          title: "Bouton principal",
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Texte du bouton" },
            { name: "link", type: "string", title: "Lien (ex. /matelas)" },
          ],
        }),
        defineField({
          name: "ctaSecondary",
          title: "Bouton secondaire (lien texte)",
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Texte" },
            { name: "link", type: "string", title: "Lien" },
          ],
        }),
        defineField({
          name: "trustNote",
          title: "Ligne de réassurance (sous les CTAs)",
          type: "string",
          description: "Ex : « ★ 4,9/5 sur 1 167 avis Google »",
        }),
      ],
    }),

    // ─────────────────────────────────────────────────
    // HERO SLIDER — plusieurs slides qui défilent (prioritaire sur `hero`)
    // ─────────────────────────────────────────────────
    defineField({
      name: "heroSlides",
      title: "🎞️ Slides du hero (carrousel)",
      type: "array",
      description:
        "Si tu ajoutes 2 slides ou plus, le hero devient un carrousel qui défile toutes les 6 secondes. Sinon le champ « Hero principal » ci-dessus est utilisé.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "type",
              title: "Type de slide",
              type: "string",
              options: {
                list: [
                  { title: "🎥 Vidéo", value: "video" },
                  { title: "🖼️ Image fixe", value: "image" },
                  { title: "🏷️ Bannière promo", value: "promo" },
                ],
                layout: "radio",
              },
              initialValue: "image",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "videoFile",
              title: "Vidéo (.mp4)",
              type: "file",
              options: { accept: "video/mp4,video/webm" },
              hidden: ({ parent }) => parent?.type !== "video",
            }),
            defineField({
              name: "videoPoster",
              title: "Poster vidéo",
              type: "image",
              options: { hotspot: true },
              hidden: ({ parent }) => parent?.type !== "video",
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              fields: [{ name: "alt", title: "Alt SEO", type: "string" }],
              hidden: ({ parent }) => parent?.type !== "image",
            }),
            defineField({
              name: "promoBadge",
              title: "Badge (ex. « -40% »)",
              type: "string",
              hidden: ({ parent }) => parent?.type !== "promo",
            }),
            defineField({
              name: "promoImage",
              title: "Image produit (promo)",
              type: "image",
              options: { hotspot: true },
              hidden: ({ parent }) => parent?.type !== "promo",
            }),
            defineField({
              name: "promoPrice",
              title: "Prix « dès »",
              type: "string",
              hidden: ({ parent }) => parent?.type !== "promo",
            }),
            defineField({
              name: "title",
              title: "Titre principal",
              type: "string",
              description: "Retour à la ligne pour accentuer un mot en italique aurora.",
            }),
            defineField({ name: "subtitle", title: "Sous-titre", type: "text", rows: 2 }),
            defineField({
              name: "ctaPrimary",
              title: "Bouton principal",
              type: "object",
              fields: [
                { name: "label", type: "string", title: "Texte" },
                { name: "link", type: "string", title: "Lien" },
              ],
            }),
            defineField({
              name: "ctaSecondary",
              title: "Bouton secondaire",
              type: "object",
              fields: [
                { name: "label", type: "string", title: "Texte" },
                { name: "link", type: "string", title: "Lien" },
              ],
            }),
            defineField({ name: "trustNote", title: "Note de réassurance", type: "string" }),
          ],
          preview: {
            select: { title: "title", subtitle: "subtitle", media: "image", type: "type" },
            prepare: ({ title, subtitle, media, type }) => ({
              title: title ? title.split("\n")[0] : "(sans titre)",
              subtitle: `${type === "video" ? "🎥" : type === "image" ? "🖼️" : "🏷️"} ${subtitle || ""}`.trim(),
              media,
            }),
          },
        }),
      ],
    }),

    // ─────────────────────────────────────────────────
    // HERO SECONDAIRE — bannière de droite (dual hero Emma)
    // ─────────────────────────────────────────────────
    defineField({
      name: "heroSecondary",
      title: "🏷️ Bannière secondaire (à droite du hero)",
      type: "object",
      description: "Affichée à droite du hero principal sur grand écran. Souvent une offre complémentaire.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "enabled",
          title: "Activer la bannière secondaire",
          type: "boolean",
          initialValue: true,
        }),
        defineField({ name: "badge", title: "Badge", type: "string" }),
        defineField({ name: "title", title: "Titre", type: "string" }),
        defineField({ name: "subtitle", title: "Sous-titre", type: "text", rows: 2 }),
        defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
        defineField({
          name: "cta",
          title: "Bouton",
          type: "object",
          fields: [
            { name: "label", type: "string", title: "Texte" },
            { name: "link", type: "string", title: "Lien" },
          ],
        }),
      ],
    }),

    // ─────────────────────────────────────────────────
    // SECTIONS DE LA HOME (configurables)
    // ─────────────────────────────────────────────────
    defineField({
      name: "uspStrip",
      title: "🛡️ Strip réassurance (4 USPs)",
      type: "array",
      description: "Les 4 garanties affichées en bandeau sous le hero.",
      validation: (r) => r.length(4),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "icon", title: "Icône (truck, clock, shield, card)", type: "string" },
            { name: "title", title: "Titre", type: "string" },
            { name: "subtitle", title: "Sous-titre", type: "string" },
          ],
          preview: {
            select: { title: "title", subtitle: "subtitle" },
          },
        }),
      ],
    }),

    defineField({
      name: "trustCounter",
      title: "✨ Compteur de confiance",
      type: "object",
      fields: [
        { name: "number", title: "Nombre (ex. « + 12 000 »)", type: "string" },
        { name: "label", title: "Texte après (ex. « dormeurs ont déjà choisi DreamsFly »)", type: "string" },
        { name: "subline", title: "Ligne de note (avis, étoiles, etc.)", type: "string" },
      ],
    }),

    defineField({
      name: "bestSellers",
      title: "🏆 Best-sellers à mettre en avant",
      type: "array",
      description: "Sélectionne 4 produits à afficher en haut de la home.",
      validation: (r) => r.min(3).max(4),
      of: [defineArrayMember({ type: "reference", to: [{ type: "product" }] })],
    }),

    defineField({
      name: "mosaicCollections",
      title: "🎨 Mosaïque de collections (4 cards)",
      type: "array",
      validation: (r) => r.length(4),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "eyebrow", title: "Sur-titre", type: "string" },
            { name: "title", title: "Titre", type: "string" },
            { name: "link", title: "Lien", type: "string" },
            { name: "image", title: "Image de fond", type: "image", options: { hotspot: true } },
            {
              name: "theme",
              title: "Thème couleur",
              type: "string",
              options: {
                list: ["dark", "beige", "midnight", "gold"],
              },
            },
          ],
          preview: { select: { title: "title", subtitle: "eyebrow", media: "image" } },
        }),
      ],
    }),

    defineField({
      name: "quizCta",
      title: "🧭 Section quiz (« Trouvez le matelas idéal »)",
      type: "object",
      fields: [
        { name: "eyebrow", title: "Sur-titre", type: "string", initialValue: "Quiz en 1 minute" },
        { name: "title", title: "Titre", type: "string" },
        { name: "subtitle", title: "Sous-titre", type: "text", rows: 2 },
        { name: "ctaLabel", title: "Texte du bouton", type: "string", initialValue: "Faire le test" },
        { name: "ctaLink", title: "Lien", type: "string", initialValue: "/quiz" },
        {
          name: "backgroundImage",
          title: "Image d'arrière-plan (recommandé 1920×1080)",
          type: "image",
          options: { hotspot: true },
          description: "L'image s'affichera avec un overlay sombre pour la lisibilité du texte.",
        },
      ],
    }),

    defineField({
      name: "categoryTiles",
      title: "📦 Tuiles catégories (4)",
      type: "array",
      validation: (r) => r.length(4),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "name", title: "Nom catégorie", type: "string" },
            { name: "promo", title: "Promo affichée (ex. « Jusqu'à -40% »)", type: "string" },
            { name: "link", title: "Lien", type: "string" },
            { name: "image", title: "Image", type: "image", options: { hotspot: true } },
            {
              name: "overlay",
              title: "🎨 Overlay pour lisibilité du texte",
              type: "string",
              description:
                "L'overlay est un voile de couleur qui recouvre l'image pour que le texte blanc reste lisible. Choisis selon la luminosité de ton image : image claire → overlay foncé, image sombre → overlay léger.",
              options: {
                list: [
                  { title: "🌑 Foncé — dégradé noir (par défaut, image claire)", value: "dark" },
                  { title: "🌒 Extra foncé — pour images très lumineuses", value: "extra-dark" },
                  { title: "🌌 Midnight — bleu nuit DreamsFly", value: "midnight" },
                  { title: "🌇 Or — chaud, doré", value: "gold" },
                  { title: "🌊 Aurora — bleu clair", value: "aurora" },
                  { title: "🪶 Léger — voile transparent (pour images déjà sombres)", value: "light" },
                  { title: "⬛ Aucun — pas d'overlay (image très sombre)", value: "none" },
                ],
                layout: "dropdown",
              },
              initialValue: "dark",
            },
          ],
          preview: { select: { title: "name", subtitle: "promo", media: "image" } },
        }),
      ],
    }),

    defineField({
      name: "awards",
      title: "🏅 Labels et reconnaissances",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "name", title: "Nom (ex. UFC-Que Choisir)", type: "string" },
            { name: "label", title: "Sous-titre", type: "string" },
          ],
        }),
      ],
    }),

    defineField({
      name: "brandStatement",
      title: "💬 Phrase de marque (avec wave aurora)",
      type: "object",
      fields: [
        { name: "before", title: "Début de phrase", type: "string" },
        { name: "highlight", title: "Mot accentué (gradient)", type: "string" },
        { name: "after", title: "Fin de phrase", type: "string" },
      ],
    }),

    // ─────────────────────────────────────────────────
    // SEO
    // ─────────────────────────────────────────────────
    defineField({
      name: "seo",
      title: "🔎 SEO",
      type: "object",
      options: { collapsible: true, collapsed: true },
      fields: [
        { name: "metaTitle", type: "string", title: "Meta title" },
        { name: "metaDescription", type: "text", rows: 3, title: "Meta description" },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "📄 Page d'accueil" }),
  },
});
