import { defineType, defineField, defineArrayMember } from "sanity";

/**
 * LANDING PAGE — schéma central pour TOUTES les pages SEO non-produit :
 *   /matelas-140x190 (taille)
 *   /matelas-memoire-de-forme (technologie)
 *   /matelas-mal-de-dos (profil)
 *   /matelas-ferme (fermeté)
 *
 * Pensé pour éviter le footprint :
 * - sections composables (drag-drop dans Sanity)
 * - layout enum + angle éditorial = variations naturelles entre pages
 * - publishedAt = release progressive (authority growth)
 */
export const landingPage = defineType({
  name: "landingPage",
  title: "Pages SEO (silos)",
  type: "document",
  groups: [
    { name: "main", title: "Page", default: true },
    { name: "seo", title: "SEO & schema.org" },
    { name: "sections", title: "Sections" },
    { name: "linking", title: "Maillage" },
    { name: "publish", title: "Publication" },
  ],
  fields: [
    // ─── Identité ───
    defineField({
      name: "name",
      title: "Nom interne (pour Sanity)",
      type: "string",
      group: "main",
      description: "Ex : « Taille 140x190 — Petits espaces »",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "URL (slug flat, sans slash)",
      type: "slug",
      group: "main",
      options: {
        source: "name",
        slugify: (input) =>
          input
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
            .slice(0, 96),
      },
      description: "Sera utilisé dans l'URL : /matelas-140x190",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "pageType",
      title: "Type de page (silo)",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "📏 Par taille (140x190, 160x200…)", value: "size" },
          { title: "🛠️ Par technologie (mousse, ressorts, hybride)", value: "technology" },
          { title: "💪 Par fermeté (ferme, moelleux…)", value: "firmness" },
          { title: "👤 Par profil (mal de dos, couple, bébé…)", value: "profile" },
          { title: "🎯 Par usage (clic-clac, camping-car…)", value: "use" },
          { title: "🏛️ Pilier (page chapeau)", value: "pillar" },
        ],
        layout: "dropdown",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "editorialAngle",
      title: "Angle éditorial unique",
      type: "string",
      group: "main",
      description:
        "Pour casser le footprint SEO. Ex : « Petits espaces / couple », « Confort premium », « Chambre d'enfant », « Indépendance de couchage king size »",
    }),

    // ─── SEO ───
    defineField({
      name: "h1",
      title: "Titre H1 affiché",
      type: "string",
      group: "main",
      description: "Le titre H1 visible sur la page. Doit contenir le mot-clé naturellement.",
      validation: (r) => r.required().min(20).max(70),
    }),
    defineField({
      name: "intro",
      title: "Intro (60-100 mots — RÉPONSE DIRECTE pour AI)",
      type: "text",
      rows: 4,
      group: "main",
      description:
        "Premier paragraphe affiché sous le H1. Doit répondre directement à la requête. Les LLM (ChatGPT, Gemini, Perplexity) extraient principalement ce passage.",
      validation: (r) => r.required().min(200).max(800),
    }),

    // ─── Cible Semrush ───
    defineField({
      name: "focusKeyword",
      title: "Mot-clé principal (Semrush)",
      type: "string",
      group: "seo",
      description: "Le mot-clé exact qu'on cible. Ex : « matelas 140x190 »",
    }),
    defineField({
      name: "secondaryKeywords",
      title: "Mots-clés secondaires",
      type: "array",
      group: "seo",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "searchVolume",
      title: "Volume mensuel (Semrush)",
      type: "number",
      group: "seo",
    }),
    defineField({
      name: "keywordDifficulty",
      title: "KD Semrush (0-100)",
      type: "number",
      group: "seo",
    }),
    defineField({
      name: "searchIntent",
      title: "Intention",
      type: "string",
      group: "seo",
      options: {
        list: ["commercial", "informational", "transactional", "mixed", "navigational"],
      },
    }),

    // ─── Meta ───
    defineField({
      name: "metaTitle",
      title: "Meta Title (60 caractères max)",
      type: "string",
      group: "seo",
      validation: (r) => r.max(70),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description (155 caractères)",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (r) => r.max(170),
    }),
    defineField({
      name: "ogImage",
      title: "Image Open Graph (sinon générée auto)",
      type: "image",
      group: "seo",
    }),

    // ─── Layout (variation visuelle anti-footprint) ───
    defineField({
      name: "layout",
      title: "Layout visuel",
      type: "string",
      group: "sections",
      description:
        "Casse le footprint SEO en variant les rendus entre pages similaires.",
      options: {
        list: [
          { title: "Editorial (article-like, lecture longue)", value: "editorial" },
          { title: "Comparatif (tableaux + grilles)", value: "comparative" },
          { title: "Showcase (visuels + grilles produits)", value: "showcase" },
          { title: "Tutoriel (étapes + visuels)", value: "tutorial" },
          { title: "Compact (CTA fort + sections courtes)", value: "compact" },
        ],
      },
      initialValue: "editorial",
    }),

    // ─── Sections composables ───
    defineField({
      name: "sections",
      title: "Sections (glisse-dépose dans l'ordre voulu)",
      type: "array",
      group: "sections",
      description:
        "Compose ta page bloc par bloc. Évite les ordres répétitifs entre pages similaires.",
      of: [
        // Bloc définition (pour AI Overviews)
        defineArrayMember({
          name: "definitionBlock",
          type: "object",
          title: "📖 Définition (« Qu'est-ce que… »)",
          fields: [
            { name: "term", title: "Terme à définir", type: "string" },
            { name: "definition", title: "Définition (60 mots max)", type: "text", rows: 3 },
          ],
          preview: { select: { title: "term", subtitle: "definition" } },
        }),

        // Tableau comparatif
        defineArrayMember({
          name: "comparisonTable",
          type: "object",
          title: "📊 Tableau comparatif",
          fields: [
            { name: "title", title: "Titre du tableau", type: "string" },
            {
              name: "columns",
              title: "Colonnes (en-têtes)",
              type: "array",
              of: [{ type: "string" }],
            },
            {
              name: "rows",
              title: "Lignes",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "label", title: "Critère", type: "string" },
                    {
                      name: "values",
                      title: "Valeurs (1 par colonne)",
                      type: "array",
                      of: [{ type: "string" }],
                    },
                  ],
                },
              ],
            },
          ],
          preview: { select: { title: "title" } },
        }),

        // Recommandations
        defineArrayMember({
          name: "recommendationBlock",
          type: "object",
          title: "🎯 Recommandations (« Pour qui ? Quelle densité ? »)",
          fields: [
            { name: "heading", title: "Titre H2", type: "string" },
            {
              name: "items",
              title: "Recommandations",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "profile", title: "Profil / situation", type: "string" },
                    { name: "advice", title: "Conseil", type: "text", rows: 2 },
                  ],
                  preview: { select: { title: "profile", subtitle: "advice" } },
                },
              ],
            },
          ],
          preview: {
            select: { title: "heading", items: "items" },
            prepare: ({ title, items }: any) => ({
              title: title || "Recommandations",
              subtitle: `🎯 ${items?.length || 0} recommandation${items?.length > 1 ? "s" : ""}`,
            }),
          },
        }),

        // Grille produits
        defineArrayMember({
          name: "productsGrid",
          type: "object",
          title: "🛏️ Grille produits",
          fields: [
            { name: "heading", title: "Titre H2", type: "string" },
            {
              name: "filter",
              title: "Filtre",
              type: "string",
              options: {
                list: [
                  { title: "Tous les matelas", value: "all" },
                  { title: "Mémoire de forme", value: "memoire" },
                  { title: "Mousse polyuréthane", value: "mousse" },
                  { title: "Ressorts ensachés", value: "ressorts" },
                  { title: "Hybride", value: "hybride" },
                  { title: "Sélection manuelle (cf. champ ci-dessous)", value: "manual" },
                ],
              },
            },
            {
              name: "manualProducts",
              title: "Sélection manuelle (si filter = manual)",
              type: "array",
              of: [{ type: "reference", to: [{ type: "product" }] }],
              hidden: ({ parent }) => parent?.filter !== "manual",
            },
            { name: "maxItems", title: "Nombre max de produits", type: "number", initialValue: 4 },
          ],
          preview: {
            select: { title: "heading", filter: "filter" },
            prepare: ({ title, filter }: any) => ({
              title: title || "Grille produits",
              subtitle: `🛏️ Filtre : ${filter || "all"}`,
            }),
          },
        }),

        // Cas d'usage
        defineArrayMember({
          name: "useCaseBlock",
          type: "object",
          title: "💡 Cas d'usage (« Dans quelle chambre ? »)",
          fields: [
            { name: "heading", title: "Titre H2", type: "string" },
            {
              name: "content",
              title: "Contenu (texte + images)",
              type: "array",
              of: [
                { type: "block" },
                {
                  type: "image",
                  options: { hotspot: true },
                  fields: [{ name: "alt", title: "Texte alternatif (SEO)", type: "string" }],
                },
              ],
            },
          ],
          preview: {
            select: { title: "heading" },
            prepare: ({ title }: any) => ({
              title: title || "Cas d'usage",
              subtitle: "💡 Texte + images contextuels",
            }),
          },
        }),

        // FAQ
        defineArrayMember({
          name: "faqBlock",
          type: "object",
          title: "❓ FAQ (FAQPage schema)",
          fields: [
            { name: "heading", title: "Titre H2", type: "string", initialValue: "Questions fréquentes" },
            {
              name: "questions",
              title: "Questions / Réponses",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "question", type: "string", title: "Question" },
                    { name: "answer", type: "text", rows: 4, title: "Réponse" },
                  ],
                  preview: { select: { title: "question" } },
                },
              ],
            },
          ],
          preview: {
            select: { title: "heading", questions: "questions" },
            prepare: ({ title, questions }: any) => ({
              title: title || "FAQ",
              subtitle: `❓ ${questions?.length || 0} question${questions?.length > 1 ? "s" : ""}`,
            }),
          },
        }),

        // Conseils numérotés
        defineArrayMember({
          name: "tipsBlock",
          type: "object",
          title: "✅ Liste de conseils numérotés",
          fields: [
            { name: "heading", title: "Titre H2", type: "string" },
            {
              name: "tips",
              title: "Conseils (1 par ligne)",
              type: "array",
              of: [{ type: "string" }],
            },
          ],
          preview: {
            select: { title: "heading", tips: "tips" },
            prepare: ({ title, tips }: any) => ({
              title: title || "Liste de conseils",
              subtitle: `✅ ${tips?.length || 0} conseil${tips?.length > 1 ? "s" : ""}`,
            }),
          },
        }),

        // Citation d'expert (E-E-A-T)
        defineArrayMember({
          name: "expertQuoteBlock",
          type: "object",
          title: "💬 Citation d'expert (E-E-A-T)",
          fields: [
            { name: "quote", title: "Citation", type: "text", rows: 3 },
            { name: "expert", title: "Expert", type: "reference", to: [{ type: "author" }] },
          ],
          preview: {
            select: { quote: "quote", name: "expert.name" },
            prepare: ({ quote, name }: any) => ({
              title: name ? `💬 ${name}` : "Citation d'expert",
              subtitle: quote?.slice(0, 80),
            }),
          },
        }),

        // Sources (autorité)
        defineArrayMember({
          name: "sourcesBlock",
          type: "object",
          title: "📚 Sources & références",
          fields: [
            { name: "heading", title: "Titre", type: "string", initialValue: "Sources et références" },
            {
              name: "sources",
              title: "Sources",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "title", type: "string", title: "Titre" },
                    { name: "publisher", type: "string", title: "Publication" },
                    { name: "url", type: "url", title: "URL" },
                    { name: "year", type: "number", title: "Année" },
                  ],
                  preview: { select: { title: "title", subtitle: "publisher" } },
                },
              ],
            },
          ],
          preview: {
            select: { sources: "sources" },
            prepare: ({ sources }: any) => ({
              title: "Sources & références",
              subtitle: `📚 ${sources?.length || 0} source${sources?.length > 1 ? "s" : ""}`,
            }),
          },
        }),

        // Maillage interne (auto + manuel)
        defineArrayMember({
          name: "relatedPagesBlock",
          type: "object",
          title: "🔗 Maillage interne",
          fields: [
            { name: "heading", title: "Titre H2", type: "string", initialValue: "Vous aimerez aussi" },
            {
              name: "mode",
              title: "Mode",
              type: "string",
              options: {
                list: [
                  { title: "Auto (selon tags)", value: "auto" },
                  { title: "Manuel", value: "manual" },
                ],
              },
              initialValue: "auto",
            },
            {
              name: "manualLinks",
              title: "Liens manuels",
              type: "array",
              of: [{ type: "reference", to: [{ type: "landingPage" }, { type: "guide" }] }],
              hidden: ({ parent }) => parent?.mode !== "manual",
            },
          ],
          preview: {
            select: { title: "heading", mode: "mode", links: "manualLinks" },
            prepare: ({ title, mode, links }: any) => ({
              title: title || "Maillage interne",
              subtitle: mode === "manual" ? `🔗 ${links?.length || 0} liens manuels` : "🔗 Auto (par tags)",
            }),
          },
        }),

        // Contenu libre (portable text)
        defineArrayMember({
          name: "richTextBlock",
          type: "object",
          title: "📝 Contenu libre (texte + images)",
          fields: [
            { name: "heading", title: "Titre H2 (optionnel)", type: "string" },
            {
              name: "content",
              title: "Contenu",
              type: "array",
              of: [
                { type: "block" },
                {
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    { name: "alt", title: "Texte alternatif (SEO)", type: "string" },
                    { name: "caption", title: "Légende (optionnelle)", type: "string" },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: { title: "heading", content: "content" },
            prepare: ({ title, content }: any) => {
              const firstText = content?.find((c: any) => c._type === "block")?.children?.[0]?.text;
              return {
                title: title || "Contenu libre",
                subtitle: firstText ? `📝 ${firstText.slice(0, 80)}` : "📝 Texte + images",
              };
            },
          },
        }),

        // CTA
        defineArrayMember({
          name: "ctaBlock",
          type: "object",
          title: "🎯 CTA (appel à l'action)",
          fields: [
            { name: "heading", title: "Titre", type: "string" },
            { name: "subtitle", title: "Sous-titre", type: "string" },
            { name: "buttonLabel", title: "Texte bouton", type: "string" },
            { name: "buttonLink", title: "Lien bouton", type: "string" },
            {
              name: "style",
              title: "Style",
              type: "string",
              options: {
                list: ["midnight-dark", "soft-light", "gold-accent"],
              },
              initialValue: "midnight-dark",
            },
          ],
          preview: {
            select: { title: "heading", style: "style" },
            prepare: ({ title, style }: any) => ({
              title: title || "CTA",
              subtitle: `🎯 Style : ${style || "midnight-dark"}`,
            }),
          },
        }),
      ],
      options: { sortable: true },
    }),

    // ─── Maillage (tags) ───
    defineField({
      name: "tags",
      title: "Tags pour maillage automatique",
      type: "array",
      group: "linking",
      description:
        "Permet au système de maillage de proposer cette page à d'autres pages similaires. Ex : « size:140x190 », « firmness:ferme », « profile:mal-de-dos »",
      of: [defineArrayMember({ type: "string" })],
    }),

    // ─── E-E-A-T ───
    defineField({
      name: "author",
      title: "Auteur signataire",
      type: "reference",
      group: "linking",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "reviewer",
      title: "Relu et validé par",
      type: "reference",
      group: "linking",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "lastReviewedAt",
      title: "Date de dernière revue",
      type: "date",
      group: "linking",
    }),

    // ─── Publication progressive ───
    defineField({
      name: "publishedAt",
      title: "Date de publication (release progressive)",
      type: "datetime",
      group: "publish",
      description:
        "Si vide → page non publiée (draft). Renseigne une date passée pour publier maintenant, future pour planifier.",
    }),
    defineField({
      name: "noindex",
      title: "Noindex (cacher de Google)",
      type: "boolean",
      group: "publish",
      initialValue: false,
    }),
  ],

  orderings: [
    { title: "Volume Semrush (desc)", name: "volumeDesc", by: [{ field: "searchVolume", direction: "desc" }] },
    { title: "Nom A → Z", name: "nameAsc", by: [{ field: "name", direction: "asc" }] },
  ],

  preview: {
    select: {
      title: "name",
      subtitle: "focusKeyword",
      pageType: "pageType",
      pub: "publishedAt",
    },
    prepare: ({ title, subtitle, pageType, pub }) => ({
      title: `${pub ? "✅" : "📝 Draft"} ${title}`,
      subtitle: [pageType, subtitle].filter(Boolean).join(" · "),
    }),
  },
});
