/**
 * Contenu SEO par défaut par type de produit.
 * Injecté automatiquement dans les fiches produit quand les champs Sanity
 * correspondants sont vides. Sanity override toujours si rempli.
 *
 * Contenu 100 % original DreamsFly — ton humain, orienté conseil,
 * conçu pour maximiser le score EEAT (expertise / trust) sur Google.
 */

export type Highlight = { icon: string; label: string };
export type Tip = { icon: string; title: string; text: string };
export type FaqEntry = { question: string; answer: string };
export type CtaBlock = { title: string; subtitle: string; ctaLabel: string; ctaLink: string };

type ProductType = "matelas" | "lit" | "sommier" | "oreiller" | "linge" | "pack" | (string & {});

// ─────────────────────────────────────────────────────────────
// HIGHLIGHTS (badges points forts)
// ─────────────────────────────────────────────────────────────
export function defaultHighlights(productType: ProductType, product?: any): Highlight[] {
  switch (productType) {
    case "matelas":
      return [
        { icon: "🛡️", label: "Certifié OEKO-TEX Standard 100" },
        { icon: "🇪🇺", label: "Fabriqué en Europe" },
        { icon: "🛏️", label: "Housse déhoussable lavable" },
        { icon: "📦", label: "Livraison à domicile offerte" },
        { icon: "💳", label: "Paiement en 4× sans frais" },
      ];
    case "lit":
      return [
        { icon: "📦", label: `Coffre ${product?.litCoffreCapacityL || "400"} L de rangement` },
        { icon: "🛠️", label: "Vérins hydrauliques 15 000 cycles" },
        { icon: "🇪🇺", label: "Fabriqué en Europe" },
        { icon: "🚚", label: "Livraison à l'étage incluse" },
        { icon: "💳", label: "Paiement en 4× sans frais" },
      ];
    case "sommier":
      return [
        { icon: "🌳", label: "Bois massif européen" },
        { icon: "🦵", label: "Pieds fournis" },
        { icon: "🛏️", label: "Compatible tous matelas" },
        { icon: "🛡️", label: "Garantie 5 ans" },
        { icon: "📦", label: "Livraison à domicile offerte" },
      ];
    case "oreiller":
      return [
        { icon: "🧺", label: "Housse lavable en machine" },
        { icon: "🌿", label: "Traitement anti-acariens" },
        { icon: "🌙", label: "Soutien cervical optimal" },
        { icon: "🇪🇺", label: "Confection européenne" },
        { icon: "🚚", label: "Livraison sous 48h" },
      ];
    case "pack":
      return [
        { icon: "💰", label: "Économisez jusqu'à -25% vs à l'unité" },
        { icon: "📦", label: "Livraison unique — tout en une fois" },
        { icon: "🛠️", label: "Compatibilité garantie entre éléments" },
        { icon: "🇪🇺", label: "Fabrication européenne" },
      ];
    default:
      return [
        { icon: "🇪🇺", label: "Fabriqué en Europe" },
        { icon: "🚚", label: "Livraison à domicile offerte" },
        { icon: "💳", label: "Paiement en 4× sans frais" },
      ];
  }
}

// ─────────────────────────────────────────────────────────────
// TIPS (conseils d'expert)
// ─────────────────────────────────────────────────────────────
export function defaultTips(productType: ProductType): Tip[] {
  switch (productType) {
    case "matelas":
      return [
        {
          icon: "🔄",
          title: "Retournez-le tous les 3 mois",
          text: "Le premier retournement, faites-le tête-pied. Ensuite alternez face A / face B. Cette rotation prolonge la durée de vie de 40% et évite la déformation à long terme.",
        },
        {
          icon: "🌬️",
          title: "Aérez 20 minutes chaque matin",
          text: "Rejetez la couette au pied du lit et ouvrez la fenêtre en grand. L'humidité corporelle (0,5 L par nuit) s'évacue et empêche le développement d'acariens.",
        },
        {
          icon: "🛡️",
          title: "Investissez dans un protège-matelas",
          text: "40 € qui préservent 500 € de matelas. Lavable à 60°C, il capte transpiration et taches — indispensable pour garder la garantie active.",
        },
        {
          icon: "📅",
          title: "Comptez 21 nuits d'adaptation",
          text: "Votre dos a des habitudes tenaces. Un matelas neuf, même parfait, demande 3 semaines pour être « lu » par votre corps. Ne jugez pas avant.",
        },
      ];
    case "lit":
      return [
        {
          icon: "📏",
          title: "Mesurez avant de commander",
          text: "Prévoyez 60 cm devant le lit pour ouvrir le coffre (ou sur le côté pour l'ouverture latérale). Vérifiez aussi la largeur des portes et cages d'escalier — le cadre arrive en 3 colis.",
        },
        {
          icon: "🛏️",
          title: "Choisissez le bon matelas",
          text: "Épaisseur idéale entre 18 et 30 cm, poids minimum 12 kg. Un matelas trop léger bouge à l'ouverture du coffre. Trop épais, il déborde du cadre.",
        },
        {
          icon: "🧹",
          title: "Entretien du tissu",
          text: "Aspirateur brosse douce toutes les 2 semaines. Pour une tache : chiffon microfibre légèrement humide, tapoter sans frotter. Jamais de vapeur qui écrase les fibres.",
        },
        {
          icon: "🔧",
          title: "Vérifiez les vérins une fois par an",
          text: "L'ouverture devient laborieuse ? Un des vérins faiblit. Le remplacement coûte 30 € et prend 15 min — pas besoin d'appeler un pro.",
        },
      ];
    case "sommier":
      return [
        {
          icon: "🔍",
          title: "Vérifiez la compatibilité matelas",
          text: "Un sommier à lattes apparentes accepte tous les matelas > 15 cm d'épaisseur. Pour un latex ou une mémoire de forme fine, préférez un sommier tapissier plus dense.",
        },
        {
          icon: "🦵",
          title: "Hauteur totale idéale : 55 à 65 cm",
          text: "Additionnez sommier (15 cm) + matelas (25 cm) + pieds (15 cm) = 55 cm. Pour un couchage plus haut (personnes âgées, PMR), passez à des pieds de 25 cm.",
        },
        {
          icon: "🌬️",
          title: "Laissez respirer sous le sommier",
          text: "Un plateau plein sous le matelas retient l'humidité et favorise moisissures et acariens. Un sommier à lattes ou pieds hauts est indispensable.",
        },
      ];
    case "oreiller":
      return [
        {
          icon: "😴",
          title: "Choisissez selon votre position",
          text: "Sur le dos → oreiller fin/moyen (10-12 cm). Sur le côté → oreiller épais/ferme (14-16 cm). Sur le ventre → oreiller très fin (5-8 cm) pour ne pas cambrer la nuque.",
        },
        {
          icon: "🧺",
          title: "Lavez la housse tous les 2 mois",
          text: "40°C max, essorage doux. La garniture (mousse, duvet) ne se lave pas — c'est la housse qui capte transpiration et cellules mortes.",
        },
        {
          icon: "🔄",
          title: "Remplacez tous les 2-3 ans",
          text: "Test rapide : plié en deux, un bon oreiller reprend sa forme en < 3 secondes. S'il reste plié ou revient mollement, il est mort — même s'il « a l'air » propre.",
        },
      ];
    case "pack":
      return [
        {
          icon: "📦",
          title: "Livraison groupée pour simplifier",
          text: "Tous les éléments arrivent en une seule livraison — pas besoin de coordonner plusieurs créneaux. Nos livreurs montent le tout à l'étage.",
        },
        {
          icon: "💰",
          title: "Économies vs achat séparé",
          text: "Un pack complet représente 15 à 25% d'économie par rapport à l'achat individuel de chaque élément. La cohérence esthétique est aussi garantie.",
        },
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────
// FAQ (Q&R spécifiques → JSON-LD FAQPage)
// ─────────────────────────────────────────────────────────────
export function defaultFaq(productType: ProductType, product?: any): FaqEntry[] {
  const name = product?.name || "ce produit";
  switch (productType) {
    case "matelas":
      return [
        {
          question: `Combien de temps pour recevoir ${name} ?`,
          answer:
            "Livraison sous 5 à 7 jours ouvrés en France métropolitaine, gratuite dès 39 €. Nos livreurs prennent rendez-vous par SMS 48h avant. Montée à l'étage incluse et reprise gratuite de votre ancien matelas si vous en avez besoin.",
        },
        {
          question: "Puis-je essayer le matelas et le renvoyer si ça ne convient pas ?",
          answer:
            "Oui, vous disposez de 30 nuits d'essai à domicile. Si après 21 jours d'adaptation le matelas ne vous convient toujours pas, nous organisons la reprise gratuite et vous êtes intégralement remboursé — sans conditions et sans discussion.",
        },
        {
          question: "Quelle est la garantie ?",
          answer:
            "Garantie fabricant de 2 ans sur tous nos matelas (défaut de fabrication, affaissement anormal supérieur à 3 cm). Certains modèles premium bénéficient d'une extension à 5 ans. La garantie ne couvre pas l'usure normale ni les taches.",
        },
        {
          question: "Faut-il retourner le matelas régulièrement ?",
          answer:
            "Oui — tous les 3 mois la première année, puis tous les 6 mois. Alternez tête-pied et face A / face B. Cette rotation prévient l'affaissement local et prolonge la durée de vie de 30 à 40%.",
        },
        {
          question: `${name} est-il hypoallergénique ?`,
          answer:
            "Nos matelas sont traités anti-acariens et antibactériens en usine. Les housses sont certifiées OEKO-TEX Standard 100 (absence de substances nocives). Pour les allergies sévères, ajoutez une alèse imperméable en complément.",
        },
        {
          question: "Quel poids maximum le matelas supporte-t-il ?",
          answer:
            "Nos matelas standard sont conçus pour un poids jusqu'à 130 kg par personne. Au-delà, nous recommandons nos modèles ferme ou très ferme (mousse HR + ressorts ensachés) qui offrent un maintien renforcé.",
        },
      ];
    case "lit":
      return [
        {
          question: `Le montage de ${name} est-il compliqué ?`,
          answer:
            "Non — comptez 45 minutes à deux personnes avec un tournevis cruciforme (fourni). Notice illustrée détaillée dans le colis. Vidéo de montage disponible sur notre site. Une aide au montage à domicile est proposée en option (39 €).",
        },
        {
          question: "Quelle capacité de rangement offre le coffre ?",
          answer: `${name} propose un coffre de ${product?.litCoffreCapacityL || "environ 400"} litres — l'équivalent de 4 tiroirs de commode. Idéal pour ranger couettes, oreillers, linge de saison, valises. Ouverture d'une seule main même avec le matelas dessus.`,
        },
        {
          question: "Les vérins sont-ils fiables dans le temps ?",
          answer:
            "Nos vérins hydrauliques sont testés pour 15 000 cycles d'ouverture — soit 5 ouvertures par jour pendant 8 ans. Si un jour un vérin faiblit, le remplacement coûte 30 € et prend 15 minutes. Garantie 8 ans sur ce composant.",
        },
        {
          question: "Peut-on utiliser n'importe quel matelas ?",
          answer:
            "Épaisseur idéale entre 18 et 30 cm, poids minimum 12 kg pour garantir la stabilité à l'ouverture. Nos matelas DreamsFly sont tous compatibles. Attention aux matelas ultra-légers en mousse fine qui peuvent glisser.",
        },
        {
          question: "Comment entretenir le tissu ?",
          answer:
            "Aspirateur avec brosse douce toutes les 2 semaines. Taches ponctuelles : chiffon microfibre légèrement humide, tapoter sans frotter. Éviter le nettoyeur vapeur qui écrase les fibres. Le tissu est traité déperlant en usine.",
        },
        {
          question: "Livraison au 4e étage sans ascenseur, c'est possible ?",
          answer:
            "Oui — nos livreurs (2 personnes) montent jusqu'à votre chambre quel que soit l'étage. Le lit arrive démonté en 3 colis (cadre / sommier / tête de lit) pour faciliter les passages étroits.",
        },
      ];
    case "sommier":
      return [
        {
          question: `${name} est-il compatible avec tous les matelas ?`,
          answer:
            "Oui, notre sommier accepte tous les matelas de 15 à 30 cm d'épaisseur. Compatible avec la mémoire de forme, les ressorts ensachés, le latex et la mousse HR. Pour une literie moelleuse, nos lattes actives amplifient le confort.",
        },
        {
          question: "Le sommier est-il facile à monter ?",
          answer:
            "Montage en 15 minutes à une personne, sans outil (pieds à visser à la main). Le sommier arrive plié ou en un seul bloc selon la taille. Notice claire fournie.",
        },
        {
          question: "Quelle est la garantie ?",
          answer:
            "5 ans de garantie fabricant sur la structure et les lattes. La garantie couvre défauts de fabrication, casse de lattes en usage normal. Elle ne couvre pas les dégradations dues à un poids excessif ou à un mauvais usage.",
        },
        {
          question: "Les pieds sont-ils inclus ?",
          answer:
            "Oui, 4 pieds cylindriques en bois massif (hauteur 15 cm par défaut) sont inclus. Des pieds de 25 cm ou 5 cm sont disponibles en option pour ajuster la hauteur du couchage.",
        },
      ];
    case "oreiller":
      return [
        {
          question: "Puis-je laver l'oreiller en machine ?",
          answer:
            "La housse est amovible et lavable en machine à 40°C. La garniture (mousse mémoire de forme, duvet) ne se lave pas mais peut être aérée au soleil ou à la vapeur froide. Pour rafraîchir : passer 30 min au congélateur dans un sac hermétique.",
        },
        {
          question: `Combien de temps pour s'habituer à ${name} ?`,
          answer:
            "Comptez 5 à 7 nuits d'adaptation. Votre nuque a des habitudes fortes — un nouvel oreiller peut sembler « trop haut » ou « trop ferme » les 2-3 premières nuits. Si après une semaine c'est toujours inconfortable, contactez-nous pour un échange.",
        },
        {
          question: "Quelle hauteur choisir selon ma position de sommeil ?",
          answer:
            "Sur le dos → 10-12 cm (fin/moyen). Sur le côté → 14-16 cm (épais/ferme). Sur le ventre → 5-8 cm (très fin) pour ne pas cambrer la nuque. En cas de doute, notre modèle standard (12 cm) convient à 80% des dormeurs.",
        },
        {
          question: "L'oreiller convient-il aux allergiques ?",
          answer:
            "Oui — traitement anti-acariens et antibactérien en usine. Housse certifiée OEKO-TEX. Pour les allergies sévères, une housse de protection anti-acariens supplémentaire (vendue séparément) est recommandée.",
        },
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────
// GUIDE D'ENTRETIEN (portable text simple)
// ─────────────────────────────────────────────────────────────
export function defaultCareGuide(productType: ProductType): any[] | null {
  const paragraphs = careGuideParagraphs(productType);
  if (!paragraphs.length) return null;
  return paragraphs.map((text, i) => ({
    _type: "block",
    _key: `care-${i}`,
    style: text.startsWith("## ") ? "h3" : "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `care-s-${i}`,
        text: text.startsWith("## ") ? text.slice(3) : text,
        marks: [],
      },
    ],
  }));
}

function careGuideParagraphs(productType: ProductType): string[] {
  switch (productType) {
    case "matelas":
      return [
        "## Au quotidien",
        "Rejetez la couette au pied du lit chaque matin et aérez 15-20 minutes fenêtre ouverte. Cette habitude évacue les 0,5 litre d'humidité corporelle produite chaque nuit et prévient le développement d'acariens.",
        "## Chaque mois",
        "Passez l'aspirateur sur les deux faces avec l'embout adapté. Cela retire poussière, cellules mortes et acariens de surface.",
        "## Tous les 3 mois (1re année) puis 6 mois",
        "Retournez le matelas tête-pied et alternez face A / face B. Cette rotation prévient l'affaissement local aux zones de pression (épaules, bassin) et prolonge la durée de vie de 30 à 40%.",
        "## En cas de tache",
        "Tamponnez immédiatement avec un chiffon microfibre humide (jamais détrempé). Pour les taches organiques, utilisez de l'eau tiède + un peu de savon de Marseille. Séchez au sèche-cheveux à distance. Évitez absolument l'eau de Javel et les détachants industriels.",
      ];
    case "lit":
      return [
        "## Nettoyage courant du tissu",
        "Passez l'aspirateur avec un embout brosse douce toutes les 2 semaines. Insistez sur la tête de lit et les zones de contact.",
        "## Taches localisées",
        "Chiffon microfibre légèrement humide, tapoter sans frotter. Un peu de savon de Marseille pour les taches organiques. Séchez avec un sèche-cheveux à distance pour éviter les auréoles.",
        "## Mécanisme à vérins",
        "Une fois par an, appliquez une goutte d'huile silicone sur les points d'articulation. N'utilisez jamais de graisse épaisse (WD-40, huile moteur) qui salit le tissu.",
        "## En cas de vérin défaillant",
        "L'ouverture devient dure ou le sommier ne tient plus en position ouverte ? Un vérin doit être remplacé. Pièce standard à 30 €, échange en 15 minutes avec un tournevis. Contactez-nous, on vous envoie la référence exacte.",
      ];
    case "sommier":
      return [
        "## Aération",
        "Une fois par mois, retirez le matelas et laissez respirer le sommier pendant 2-3 heures fenêtre ouverte. Cela évacue l'humidité accumulée.",
        "## Nettoyage",
        "Aspirateur régulier sur le tissu et entre les lattes. Pour les taches, chiffon humide et savon doux — ne détrempez jamais le bois.",
        "## Vérification annuelle",
        "Contrôlez le serrage des vis et l'état des lattes. Une latte fissurée doit être remplacée pour éviter que le matelas ne se déforme.",
      ];
    case "oreiller":
      return [
        "## Housse",
        "Lavable en machine à 40°C, essorage doux, séchage à l'air libre (le sèche-linge peut abîmer les fibres). Un lavage tous les 2 mois environ.",
        "## Garniture",
        "Ne pas laver. Pour rafraîchir : aérer 2h au soleil ou passer 30 min au congélateur dans un sac hermétique (élimine acariens).",
        "## Durée de vie",
        "Un oreiller perd son soutien après 2 à 3 ans. Test simple : plié en deux, il doit reprendre sa forme en moins de 3 secondes. Sinon, il est temps de le remplacer.",
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────
// CTA secondaire par défaut
// ─────────────────────────────────────────────────────────────
export function defaultExtraCta(productType: ProductType): CtaBlock | null {
  switch (productType) {
    case "matelas":
      return {
        title: "Pas sûr du bon matelas pour vous ?",
        subtitle: "3 questions, 60 secondes, une reco personnalisée par nos experts sommeil.",
        ctaLabel: "Faire le quiz matelas",
        ctaLink: "/quiz",
      };
    case "lit":
      return {
        title: "Envie de le voir en vrai avant de commander ?",
        subtitle: "Prenez rendez-vous dans l'un de nos 3 showrooms — sans engagement, sans pression commerciale.",
        ctaLabel: "Trouver un showroom",
        ctaLink: "/magasins",
      };
    case "sommier":
      return {
        title: "Besoin d'un pack sommier + matelas ?",
        subtitle: "Économisez jusqu'à 20% en commandant les deux ensemble.",
        ctaLabel: "Voir nos packs",
        ctaLink: "/packs",
      };
    case "oreiller":
      return {
        title: "Un doute sur le bon oreiller ?",
        subtitle: "Notre équipe vous conseille par téléphone en fonction de votre position de sommeil.",
        ctaLabel: "Nous contacter",
        ctaLink: "/aide/contact",
      };
    default:
      return null;
  }
}
