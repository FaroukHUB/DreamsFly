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
    { name: "content", title: "📖 Conseils & FAQ" },
    { name: "composition", title: "Composition" },
    { name: "variants", title: "Tailles & prix" },
    { name: "media", title: "Photos & médias" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "productType",
      title: "Catégorie",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "🛏️ Matelas", value: "matelas" },
          { title: "🛋️ Lit", value: "lit" },
          { title: "🪑 Sommier", value: "sommier" },
          { title: "🌙 Oreiller", value: "oreiller" },
          { title: "🧣 Linge de lit", value: "linge" },
          { title: "📦 Pack (matelas + …)", value: "pack" },
        ],
        layout: "dropdown",
      },
      initialValue: "matelas",
      validation: (r) => r.required(),
    }),
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
      name: "featured",
      title: "⭐ Mettre en avant sur la home",
      type: "boolean",
      group: "main",
      initialValue: false,
      description: "Coche pour afficher ce produit dans la section Best-sellers de la page d'accueil.",
    }),
    defineField({
      name: "description",
      title: "Description (texte riche)",
      type: "array",
      group: "main",
      of: [{ type: "block" }],
      description: "Réécrite pour DreamsFly (pas reprise telle quelle du fournisseur).",
    }),

    // ─── Caractéristiques MATELAS (visibles uniquement pour productType=matelas) ───
    defineField({
      name: "type",
      title: "Type de matelas",
      type: "string",
      group: "main",
      hidden: ({ document }) => document?.productType !== "matelas" && !!document?.productType,
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
      hidden: ({ document }) => document?.productType !== "matelas" && document?.productType !== "oreiller" && !!document?.productType,
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
      title: "Accueil (matelas)",
      type: "string",
      group: "main",
      hidden: ({ document }) => document?.productType !== "matelas" && !!document?.productType,
      options: {
        list: ["Moelleux", "Équilibré", "Enveloppant", "Tonique"].map((v) => ({ title: v, value: v })),
      },
    }),
    defineField({
      name: "thicknessCm",
      title: "Épaisseur (cm)",
      type: "number",
      group: "main",
      hidden: ({ document }) => document?.productType !== "matelas" && document?.productType !== "sommier" && document?.productType !== "oreiller" && !!document?.productType,
    }),
    defineField({
      name: "features",
      title: "Caractéristiques matelas (chips)",
      type: "object",
      group: "main",
      hidden: ({ document }) => document?.productType !== "matelas" && !!document?.productType,
      fields: [
        { name: "memoireDeForme", type: "boolean", title: "Mémoire de forme" },
        { name: "antiAcariens", type: "boolean", title: "Anti-acariens" },
        { name: "hypoallergenique", type: "boolean", title: "Hypoallergénique" },
        { name: "oekoTex", type: "boolean", title: "Certifié OEKO-TEX" },
        { name: "fabriqueEurope", type: "boolean", title: "Fabriqué en Europe", initialValue: true },
        { name: "garantieAns", type: "number", title: "Garantie (années)", initialValue: 2 },
        { name: "independanceCouchage", type: "string", title: "Indépendance de couchage" },
      ],
    }),

    // ─── Caractéristiques LIT (visibles uniquement pour productType=lit) ───
    defineField({
      name: "litMaterial",
      title: "🛋️ Matière du lit",
      type: "string",
      group: "main",
      hidden: ({ document }) => document?.productType !== "lit",
      options: {
        list: [
          { title: "Velours", value: "velours" },
          { title: "Tissu tramé", value: "tissu-trame" },
          { title: "Lin", value: "lin" },
          { title: "Capitonné", value: "capitonne" },
          { title: "Simili cuir", value: "simili-cuir" },
        ],
      },
    }),
    defineField({
      name: "litColor",
      title: "🎨 Couleur",
      type: "string",
      group: "main",
      description: "Ex : « Beige sable », « Blanc cassé », « Bleu nuit »",
      hidden: ({ document }) => document?.productType !== "lit",
    }),
    defineField({
      name: "litCoffreType",
      title: "📦 Type de coffre",
      type: "string",
      group: "main",
      hidden: ({ document }) => document?.productType !== "lit",
      options: {
        list: [
          { title: "Ouverture frontale (pieds du lit)", value: "frontal" },
          { title: "Ouverture latérale", value: "lateral" },
          { title: "Pas de coffre (lit classique)", value: "aucun" },
        ],
      },
      initialValue: "frontal",
    }),
    defineField({
      name: "litCoffreCapacityL",
      title: "📏 Capacité du coffre (litres)",
      type: "number",
      group: "main",
      hidden: ({ document }) => document?.productType !== "lit",
    }),
    defineField({
      name: "litVerinsForceKg",
      title: "🛠️ Force des vérins (kg par vérin)",
      type: "number",
      group: "main",
      description: "Force de soulèvement de chaque vérin hydraulique",
      hidden: ({ document }) => document?.productType !== "lit",
    }),
    defineField({
      name: "litIncludes",
      title: "✅ Inclus dans le prix",
      type: "object",
      group: "main",
      hidden: ({ document }) => document?.productType !== "lit",
      fields: [
        { name: "headboard", type: "boolean", title: "Tête de lit incluse", initialValue: true },
        { name: "sommier", type: "boolean", title: "Sommier inclus", initialValue: true },
        { name: "matelas", type: "boolean", title: "Matelas inclus", initialValue: false },
        { name: "feet", type: "boolean", title: "Pieds inclus" },
      ],
    }),
    defineField({
      name: "litAssembly",
      title: "🔧 Montage",
      type: "object",
      group: "main",
      hidden: ({ document }) => document?.productType !== "lit",
      fields: [
        { name: "required", type: "boolean", title: "Montage à réaliser", initialValue: true },
        { name: "timeMin", type: "number", title: "Temps estimé (minutes)", initialValue: 45 },
        { name: "peopleNeeded", type: "number", title: "Personnes nécessaires", initialValue: 2 },
        { name: "toolsIncluded", type: "boolean", title: "Outils fournis", initialValue: true },
      ],
    }),

    // ─── Caractéristiques SOMMIER ───
    defineField({
      name: "sommierType",
      title: "🪑 Type de sommier",
      type: "string",
      group: "main",
      hidden: ({ document }) => document?.productType !== "sommier",
      options: {
        list: [
          { title: "À lattes apparentes", value: "lattes-apparentes" },
          { title: "À lattes recouvertes", value: "lattes-recouvertes" },
          { title: "Tapissier (semi-rigide)", value: "tapissier" },
          { title: "À ressorts", value: "ressorts" },
          { title: "Coffre (avec rangement)", value: "coffre" },
        ],
      },
    }),
    defineField({
      name: "sommierLattes",
      title: "Nombre de lattes",
      type: "number",
      group: "main",
      hidden: ({ document }) => document?.productType !== "sommier",
    }),
    defineField({
      name: "sommierFeet",
      title: "🦵 Pieds",
      type: "object",
      group: "main",
      hidden: ({ document }) => document?.productType !== "sommier",
      fields: [
        { name: "included", type: "boolean", title: "Pieds inclus" },
        { name: "heightCm", type: "number", title: "Hauteur des pieds (cm)" },
        { name: "material", type: "string", title: "Matériau (bois, métal…)" },
      ],
    }),

    // ─── Caractéristiques OREILLER ───
    defineField({
      name: "oreillerFilling",
      title: "🪶 Garnissage",
      type: "string",
      group: "main",
      hidden: ({ document }) => document?.productType !== "oreiller",
      options: {
        list: [
          { title: "Duvet d'oie", value: "duvet-oie" },
          { title: "Plumes", value: "plumes" },
          { title: "Mousse à mémoire de forme", value: "memoire-forme" },
          { title: "Latex naturel", value: "latex" },
          { title: "Fibre polyester recyclée", value: "fibre-recyclee" },
          { title: "Microfibre", value: "microfibre" },
        ],
      },
    }),
    defineField({
      name: "oreillerShape",
      title: "Forme",
      type: "string",
      group: "main",
      hidden: ({ document }) => document?.productType !== "oreiller",
      options: {
        list: [
          { title: "Rectangulaire classique", value: "rectangulaire" },
          { title: "Carré", value: "carre" },
          { title: "Ergonomique (vague / cervical)", value: "ergonomique" },
          { title: "Traversin", value: "traversin" },
        ],
      },
    }),
    defineField({
      name: "oreillerDimensions",
      title: "Dimensions (cm)",
      type: "string",
      group: "main",
      description: "Ex : « 60 x 40 cm »",
      hidden: ({ document }) => document?.productType !== "oreiller",
    }),
    defineField({
      name: "oreillerCare",
      title: "🧺 Entretien",
      type: "object",
      group: "main",
      hidden: ({ document }) => document?.productType !== "oreiller",
      fields: [
        { name: "washable", type: "boolean", title: "Lavable en machine" },
        { name: "washTemperatureC", type: "number", title: "Température max (°C)", initialValue: 40 },
        { name: "removableCover", type: "boolean", title: "Housse amovible" },
      ],
    }),

    // ─── Composition (matelas — de haut en bas) ───
    defineField({
      name: "composition",
      title: "Composition (de haut en bas)",
      type: "array",
      group: "composition",
      hidden: ({ document }) => document?.productType !== "matelas" && !!document?.productType,
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
    defineField({
      name: "compositionImage",
      title: "Photo de coupe transversale",
      type: "image",
      group: "composition",
      hidden: ({ document }) => document?.productType !== "matelas" && !!document?.productType,
      description: "Photo qui montre les couches du matelas coupé. Affichée à côté de la liste des couches. Sinon un schéma illustratif s'affiche par défaut.",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt SEO", type: "string" }],
    }),
    defineField({
      name: "compositionVideo",
      title: "Vidéo de démonstration composition",
      type: "file",
      group: "composition",
      hidden: ({ document }) => document?.productType !== "matelas" && !!document?.productType,
      description: "Vidéo courte (10-30 s) qui montre les couches. Prioritaire sur la photo si les deux sont remplis.",
      options: { accept: "video/mp4,video/webm" },
    }),

    // ─── COULEURS disponibles (optionnel) ───
    defineField({
      name: "colors",
      title: "🎨 Couleurs disponibles",
      type: "array",
      group: "variants",
      description:
        "Liste des couleurs. Chacune peut avoir sa propre photo. Sur la fiche produit, l'utilisateur clique sur une couleur → la galerie change + les tailles disponibles s'affichent. Laisse vide si le produit n'existe qu'en une seule couleur.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "name", title: "Nom (ex. « Beige sable »)", type: "string", validation: (r) => r.required() },
            { name: "hex", title: "Code hexadécimal (pastille — ex. #D4B896)", type: "string" },
            {
              name: "image",
              title: "Photo de cette couleur",
              type: "image",
              options: { hotspot: true },
              fields: [{ name: "alt", title: "Alt SEO", type: "string" }],
            },
            { name: "isDefault", title: "Couleur affichée par défaut", type: "boolean", initialValue: false },
          ],
          preview: {
            select: { title: "name", subtitle: "hex", media: "image" },
            prepare: ({ title, subtitle, media }) => ({
              title,
              subtitle: subtitle ? `Code ${subtitle}` : undefined,
              media,
            }),
          },
        }),
      ],
    }),

    // ─── Variantes (tailles + prix) — chaque variante peut être liée à une couleur ───
    defineField({
      name: "variants",
      title: "Tailles & prix",
      type: "array",
      group: "variants",
      description:
        "Une ligne = une combinaison Taille + (Couleur). Si tu as plusieurs couleurs, crée une ligne par taille × couleur. Sinon laisse le champ Couleur vide.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "size", title: "Taille (ex. 140 x 190 cm)", type: "string", validation: (r) => r.required() },
            {
              name: "colorName",
              title: "🎨 Couleur (doit correspondre à un nom de la liste Couleurs ci-dessus)",
              type: "string",
              description: "Ex : « Beige sable ». Laisse vide si le produit n'a qu'une seule couleur.",
            },
            { name: "sku", title: "SKU variante", type: "string" },
            { name: "price", title: "Prix (€)", type: "number", validation: (r) => r.required().positive() },
            { name: "compareAtPrice", title: "Prix barré (€)", type: "number" },
            { name: "weightKg", title: "Poids (kg)", type: "number" },
            {
              name: "stockStatus",
              title: "Statut stock",
              type: "string",
              options: { list: ["en-stock", "rupture", "precommande"] },
              initialValue: "en-stock",
            },
            { name: "stripePriceId", title: "Stripe Price ID (checkout)", type: "string" },
          ],
          preview: {
            select: { size: "size", color: "colorName", price: "price", stock: "stockStatus" },
            prepare: ({ size, color, price, stock }) => ({
              title: [size, color].filter(Boolean).join(" · "),
              subtitle: [price ? `${price} €` : null, stock === "rupture" ? "🚫 Rupture" : null].filter(Boolean).join(" · "),
            }),
          },
        }),
      ],
    }),

    // ─── Contenu éditorial (SEO + confiance client) ───
    defineField({
      name: "highlights",
      title: "⚡ Points forts (badges)",
      type: "array",
      group: "content",
      description: "Chips affichés sous la buy box — 3 à 5 arguments courts et percutants.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "icon", type: "string", title: "Emoji (ex. 🌙, ✨, 🛡️)" },
            { name: "label", type: "string", title: "Texte court (ex. « 7 zones de confort »)" },
          ],
          preview: { select: { title: "label", subtitle: "icon" } },
        }),
      ],
      validation: (r) => r.max(6),
    }),
    defineField({
      name: "advantages",
      title: "🌟 Avantages produit (grille 6 tuiles)",
      type: "array",
      group: "content",
      description: "6 avantages courts avec icône — affichés en grille (confort, soutien, respirabilité…).",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "icon", type: "string", title: "Emoji" },
            { name: "title", type: "string", title: "Titre court" },
            { name: "text", type: "text", rows: 2, title: "Phrase d'explication (1 ligne)" },
          ],
          preview: { select: { title: "title", subtitle: "text", media: "icon" } },
        }),
      ],
    }),
    defineField({
      name: "audiences",
      title: "👥 Pour qui ? (cartes)",
      type: "array",
      group: "content",
      description: "Profils d'utilisateurs cibles — adulte, couple, étudiant, senior, chambre d'ami…",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "icon", type: "string", title: "Emoji" },
            { name: "title", type: "string", title: "Type d'utilisateur" },
            { name: "text", type: "text", rows: 2, title: "Pourquoi ça leur convient" },
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "lifestyleImage",
      title: "🖼️ Image en situation (lifestyle)",
      type: "image",
      group: "content",
      description: "Photo du produit dans une chambre réelle. Affichée entre la buy box et les conseils.",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt SEO" }],
    }),
    defineField({
      name: "tips",
      title: "💡 Conseils d'expert (avec source)",
      type: "array",
      group: "content",
      description: "3 à 6 conseils. Chacun peut citer sa source (INSV, INSERM, ANSES…) pour le score EEAT Google.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "icon", type: "string", title: "Emoji" },
            { name: "title", type: "string", title: "Titre du conseil" },
            { name: "text", type: "text", rows: 3, title: "Explication (1-3 phrases)" },
            {
              name: "source",
              type: "object",
              title: "Source citée (optionnel)",
              fields: [
                { name: "label", type: "string", title: "Nom de la source (ex. « INSV »)" },
                { name: "url", type: "url", title: "URL (optionnel)" },
              ],
            },
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "careSteps",
      title: "🧺 Entretien en étapes (cartes)",
      type: "array",
      group: "content",
      description: "3 à 4 gestes courts avec fréquence. Ex : Chaque jour → Aérez → 1 phrase.",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "icon", type: "string", title: "Emoji" },
            { name: "frequency", type: "string", title: "Fréquence (ex. « Chaque mois »)" },
            { name: "title", type: "string", title: "Action" },
            { name: "text", type: "text", rows: 2, title: "Comment faire (1 phrase)" },
          ],
          preview: { select: { title: "title", subtitle: "frequency" } },
        }),
      ],
    }),
    defineField({
      name: "careGuide",
      title: "🧺 Guide d'entretien détaillé (portable text — optionnel)",
      type: "array",
      group: "content",
      description: "Texte long si tu veux compléter les étapes ci-dessus avec plus de détails.",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "deliveryOverride",
      title: "🚚 Livraison — spécifique à ce produit (optionnel)",
      type: "object",
      group: "content",
      description: "Laisse vide pour utiliser les infos livraison standard DreamsFly.",
      fields: [
        { name: "price", type: "string", title: "Ex. « Livraison offerte dès 39 € »" },
        { name: "delay", type: "string", title: "Ex. « 5 à 7 jours ouvrés »" },
        { name: "perks", type: "array", of: [{ type: "string" }], title: "Perks (liste ✓)" },
      ],
    }),
    defineField({
      name: "warrantyOverride",
      title: "🛡️ Garantie — spécifique à ce produit (optionnel)",
      type: "object",
      group: "content",
      description: "Laisse vide pour utiliser la garantie standard selon le type de produit.",
      fields: [
        { name: "duration", type: "string", title: "Durée (ex. « 5 ans structure · 8 ans vérins »)" },
        { name: "covers", type: "array", of: [{ type: "string" }], title: "Ce qui est couvert" },
        { name: "excludes", type: "array", of: [{ type: "string" }], title: "Ce qui est exclu" },
      ],
    }),
    defineField({
      name: "productFaq",
      title: "❓ FAQ spécifique à ce produit",
      type: "array",
      group: "content",
      description: "Les questions clients récurrentes SUR CE MODÈLE. Injecté en JSON-LD FAQPage.",
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
      name: "extraCta",
      title: "🎯 CTA secondaire (bandeau ou bloc)",
      type: "object",
      group: "content",
      description: "Ex : « Prenez rendez-vous en showroom pour tester ce lit »",
      fields: [
        { name: "title", type: "string", title: "Titre" },
        { name: "subtitle", type: "string", title: "Sous-titre" },
        { name: "ctaLabel", type: "string", title: "Texte du bouton" },
        { name: "ctaLink", type: "string", title: "Lien" },
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
    { title: "Catégorie", name: "productTypeAsc", by: [{ field: "productType", direction: "asc" }, { field: "name", direction: "asc" }] },
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "tagline",
      media: "images.0",
      price: "variants.0.price",
      compareAt: "variants.0.compareAtPrice",
      pType: "productType",
      featured: "featured",
      stock: "variants.0.stockStatus",
    },
    prepare: ({ title, subtitle, media, price, compareAt, pType, featured, stock }) => {
      const typeEmoji: Record<string, string> = {
        matelas: "🛏️",
        lit: "🛋️",
        sommier: "🪑",
        oreiller: "🌙",
        linge: "🧣",
        pack: "📦",
      };
      const emoji = typeEmoji[pType] || "🏷️";
      const star = featured ? "⭐ " : "";
      const stockLabel = stock === "rupture" ? " · Rupture" : stock === "precommande" ? " · Précommande" : "";
      const priceLabel = price ? `${price} €${compareAt && compareAt > price ? ` (au lieu de ${compareAt} €)` : ""}` : "";
      return {
        title: `${star}${emoji} ${title || "(sans nom)"}`,
        subtitle: [subtitle, priceLabel, stockLabel].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
