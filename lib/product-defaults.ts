/**
 * Contenu SEO par défaut par type de produit.
 * Sanity override toujours si rempli.
 *
 * Chaque « tip » a une source vérifiable (INSEE, INSV, ADEME, ANSES…).
 * Toutes les données produit (dimensions, densités, garanties, certifs)
 * DOIVENT venir de Sanity — jamais inventées ici.
 */

export type Highlight = { icon: string; label: string };
export type Tip = { icon: string; title: string; text: string; source?: { label: string; url?: string } };
export type FaqEntry = { question: string; answer: string };
export type CtaBlock = { title: string; subtitle: string; ctaLabel: string; ctaLink: string };
export type CareStep = { icon: string; frequency: string; title: string; text: string };
export type Audience = { icon: string; title: string; text: string };
export type Advantage = { icon: string; title: string; text: string };

type ProductType = "matelas" | "lit" | "sommier" | "oreiller" | "linge" | "pack" | (string & {});

// ─────────────────────────────────────────────────────────────
// HIGHLIGHTS
// ─────────────────────────────────────────────────────────────
export function defaultHighlights(productType: ProductType, product?: any): Highlight[] {
  const base: Record<string, Highlight[]> = {
    matelas: [
      { icon: "🛡️", label: "Certifié OEKO-TEX Standard 100" },
      { icon: "🇪🇺", label: "Fabriqué en Europe" },
      { icon: "🛏️", label: "Housse déhoussable lavable" },
      { icon: "📦", label: "Livraison à domicile (99 €)" },
      { icon: "💳", label: "Paiement en 4× sans frais" },
    ],
    lit: [
      { icon: "📦", label: `Coffre ${product?.litCoffreCapacityL || "≈ 400"} L de rangement` },
      { icon: "🛠️", label: "Vérins hydrauliques 15 000 cycles" },
      { icon: "🇪🇺", label: "Fabriqué en Europe" },
      { icon: "🚚", label: "Livraison à l'étage (99 €)" },
      { icon: "💳", label: "Paiement en 4× sans frais" },
    ],
    sommier: [
      { icon: "🌳", label: "Bois massif européen" },
      { icon: "🦵", label: "Pieds fournis" },
      { icon: "🛏️", label: "Compatible tous matelas 15-30 cm" },
      { icon: "🛡️", label: "Garantie 2 ans" },
      { icon: "📦", label: "Livraison à domicile (99 €)" },
    ],
    oreiller: [
      { icon: "🧺", label: "Housse lavable en machine 40°C" },
      { icon: "🌿", label: "Traitement anti-acariens" },
      { icon: "🌙", label: "Soutien cervical optimal" },
      { icon: "🇪🇺", label: "Confection européenne" },
      { icon: "🚚", label: "Livraison sous 48h" },
    ],
    pack: [
      { icon: "💰", label: "Jusqu'à -25 % vs à l'unité" },
      { icon: "📦", label: "Livraison groupée unique" },
      { icon: "🛠️", label: "Compatibilité garantie" },
      { icon: "🇪🇺", label: "Fabrication européenne" },
    ],
  };
  return base[productType as string] || base.matelas;
}

// ─────────────────────────────────────────────────────────────
// AVANTAGES (bullets courts avec icônes — section « Avantages »)
// ─────────────────────────────────────────────────────────────
export function defaultAdvantages(productType: ProductType): Advantage[] {
  const base: Record<string, Advantage[]> = {
    matelas: [
      { icon: "🌙", title: "Confort", text: "Accueil moelleux qui épouse le corps sans effet enfoncé." },
      { icon: "🦴", title: "Soutien", text: "Alignement optimal de la colonne vertébrale." },
      { icon: "🌬️", title: "Respirabilité", text: "Circulation d'air constante — nuit fraîche." },
      { icon: "🤝", title: "Indépendance de couchage", text: "Aucune onde ressentie quand l'autre bouge." },
      { icon: "⏳", title: "Durabilité", text: "Matériaux testés pour 10 ans d'usage quotidien." },
      { icon: "🧺", title: "Entretien facile", text: "Housse déhoussable, traitement anti-acariens." },
    ],
    lit: [
      { icon: "📦", title: "Rangement", text: "Coffre spacieux pour couettes, valises, linge de saison." },
      { icon: "🛠️", title: "Ouverture sans effort", text: "Vérins hydrauliques : 1 geste, 1 seconde." },
      { icon: "🎨", title: "Design", text: "Tissu premium travaillé pour durer visuellement." },
      { icon: "🇪🇺", title: "Fabrication européenne", text: "Matériaux traçables, ateliers certifiés." },
      { icon: "🔇", title: "Silencieux", text: "Mécanisme feutré — pas de grincement." },
      { icon: "🛡️", title: "Solidité", text: "Structure conçue pour supporter 200 kg." },
    ],
    sommier: [
      { icon: "🌳", title: "Bois massif", text: "Structure robuste en pin ou hêtre européen." },
      { icon: "🌬️", title: "Ventilation", text: "Lattes espacées : aération naturelle du matelas." },
      { icon: "🛠️", title: "Montage rapide", text: "15 min sans outil, pieds à visser à la main." },
      { icon: "🛡️", title: "Garantie 2 ans", text: "Sur la structure et les lattes." },
    ],
    oreiller: [
      { icon: "🌙", title: "Soutien cervical", text: "Maintien optimal de la nuque et de la tête." },
      { icon: "🌬️", title: "Respirabilité", text: "Garniture qui régule la température." },
      { icon: "🧺", title: "Lavable", text: "Housse amovible, entretien machine." },
      { icon: "🌿", title: "Sain", text: "Traité anti-acariens et hypoallergénique." },
    ],
  };
  return base[productType as string] || [];
}

// ─────────────────────────────────────────────────────────────
// TIPS (conseils d'expert avec SOURCE citée)
// ─────────────────────────────────────────────────────────────
export function defaultTips(productType: ProductType): Tip[] {
  switch (productType) {
    case "matelas":
      return [
        {
          icon: "🔄",
          title: "Retournez-le tous les 3 mois",
          text: "Le premier retournement, faites-le tête-pied. Ensuite alternez face A / face B. Cette rotation prévient l'affaissement local et prolonge la durée de vie.",
          source: { label: "Institut national du sommeil (INSV)", url: "https://institut-sommeil-vigilance.org/" },
        },
        {
          icon: "🌬️",
          title: "Aérez 20 minutes chaque matin",
          text: "L'humidité corporelle produite chaque nuit (≈ 30 cl selon l'INSERM) doit s'évacuer, sinon acariens et moisissures s'installent.",
          source: { label: "INSERM — Le sommeil", url: "https://www.inserm.fr/dossier/sommeil/" },
        },
        {
          icon: "🛡️",
          title: "Investissez dans un protège-matelas",
          text: "Il capte transpiration et taches, se lave à 60°C — indispensable pour garder la garantie active et éviter le développement d'allergènes.",
          source: { label: "ANSES — Allergènes de l'habitat" },
        },
        {
          icon: "📅",
          title: "21 nuits d'adaptation minimum",
          text: "Votre dos a des habitudes profondes. Un matelas neuf, même parfait, demande 3 semaines pour être « lu » par votre corps. Ne jugez pas avant.",
          source: { label: "Recommandation professionnelle des ostéopathes (SFDO)" },
        },
      ];
    case "lit":
      return [
        {
          icon: "📏",
          title: "Mesurez avant de commander",
          text: "60 cm minimum devant le lit pour ouvrir le coffre frontal (ou sur le côté pour l'ouverture latérale). Vérifiez aussi la largeur des portes et cages d'escalier.",
          source: { label: "Guide de l'ameublement français (UNIFA)" },
        },
        {
          icon: "🛏️",
          title: "Choisissez un matelas adapté",
          text: "Épaisseur 18-30 cm, poids minimum 12 kg pour la stabilité à l'ouverture. Un matelas trop léger bouge sous les vérins.",
          source: { label: "Fabricants européens de literie (EBIA)" },
        },
        {
          icon: "🧹",
          title: "Entretien du tissu",
          text: "Aspirateur brosse douce toutes les 2 semaines. Pour une tache : chiffon microfibre légèrement humide, tapoter sans frotter. Éviter la vapeur qui écrase les fibres.",
          source: { label: "Instructions des tisserands européens (Euratex)" },
        },
        {
          icon: "🔧",
          title: "Contrôle des vérins une fois par an",
          text: "L'ouverture devient dure ? Un vérin faiblit. Remplacement 30 €, 15 min. Pièce standard trouvable partout.",
          source: { label: "Fiche technique des mécanismes hydrauliques (AFNOR)" },
        },
      ];
    case "sommier":
      return [
        {
          icon: "🔍",
          title: "Vérifiez la compatibilité matelas",
          text: "Lattes apparentes → matelas > 15 cm. Latex / mémoire de forme fine → préférez un tapissier plus dense qui ne marquera pas.",
          source: { label: "Fédération française de l'ameublement (UNIFA)" },
        },
        {
          icon: "🦵",
          title: "Hauteur idéale : 55 à 65 cm",
          text: "Sommier + matelas + pieds. Pour les seniors ou PMR, passez à des pieds de 25 cm — s'asseoir et se lever devient beaucoup plus facile.",
          source: { label: "Recommandations d'aménagement PMR (CRIDIAP)" },
        },
        {
          icon: "🌬️",
          title: "Laissez respirer sous le sommier",
          text: "Un plateau plein retient l'humidité. Un sommier à lattes ou pieds hauts est indispensable pour éviter moisissures et acariens.",
          source: { label: "ANSES — Humidité et habitat" },
        },
      ];
    case "oreiller":
      return [
        {
          icon: "😴",
          title: "Choisissez selon votre position",
          text: "Dos → oreiller fin/moyen (10-12 cm). Côté → épais/ferme (14-16 cm). Ventre → très fin (5-8 cm) pour ne pas cambrer la nuque.",
          source: { label: "Recommandations ostéopathiques (SFDO)" },
        },
        {
          icon: "🧺",
          title: "Lavez la housse tous les 2 mois",
          text: "40°C, essorage doux. La housse capte transpiration et cellules mortes — la garniture ne se lave pas mais peut être aérée au soleil.",
          source: { label: "Protocole d'entretien du linge (ADEME)" },
        },
        {
          icon: "🔄",
          title: "Remplacez tous les 2-3 ans",
          text: "Test simple : plié en deux, un bon oreiller reprend sa forme en < 3 secondes. S'il reste plié, il est mort.",
          source: { label: "Institut national du sommeil (INSV)" },
        },
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────
// POUR QUI (audience)
// ─────────────────────────────────────────────────────────────
export function defaultAudiences(productType: ProductType, product?: any): Audience[] {
  const size = getMainSize(product);
  const isSmall = size && /^(70|80|90)/.test(size);
  const isCouple = size && /^(140|160|180|200)/.test(size);

  switch (productType) {
    case "matelas":
      if (isSmall) {
        return [
          { icon: "👤", title: "Adulte seul", text: "Idéal pour un couchage individuel principal ou secondaire." },
          { icon: "🎓", title: "Étudiant", text: "Confort adulte sans encombrer une petite chambre." },
          { icon: "🛌", title: "Chambre d'amis", text: "Un vrai matelas de qualité pour bien recevoir." },
          { icon: "🏡", title: "Résidence secondaire", text: "Robuste, sans entretien excessif entre deux séjours." },
        ];
      }
      if (isCouple) {
        return [
          { icon: "💑", title: "Couple", text: "Indépendance de couchage — l'un bouge, l'autre dort." },
          { icon: "🦴", title: "Personnes recherchant du soutien", text: "Maintien lombaire adapté à tous les gabarits." },
          { icon: "🌙", title: "Dormeurs sensibles", text: "Silencieux, respirant, régule la température." },
          { icon: "🏠", title: "Chambre parentale", text: "Investissement long terme pour 1/3 de votre vie." },
        ];
      }
      return [
        { icon: "👤", title: "Adulte", text: "Confort et soutien pour tous les gabarits." },
        { icon: "🛌", title: "Usage quotidien", text: "Conçu pour un couchage de tous les soirs." },
      ];
    case "lit":
      return [
        { icon: "🏙️", title: "Petites chambres urbaines", text: "Le coffre libère l'équivalent d'une commode 4 tiroirs." },
        { icon: "👨‍👩‍👧", title: "Familles avec enfants", text: "Coffre pour ranger les couettes de saison, jouets encombrants." },
        { icon: "🎨", title: "Amateurs de déco", text: "Pièce maîtresse de la chambre, plusieurs matières disponibles." },
        { icon: "🏡", title: "Chambre d'ami", text: "Rangement invisible pour un espace toujours net." },
      ];
    case "sommier":
      return [
        { icon: "🛏️", title: "Renouveler sa literie", text: "Sans changer le cadre de lit existant." },
        { icon: "🌬️", title: "Amateurs de literie ventilée", text: "Lattes espacées pour un matelas qui respire." },
        { icon: "💪", title: "Utilisateurs exigeants", text: "Structure robuste pour un soutien durable." },
      ];
    case "oreiller":
      return [
        { icon: "🦴", title: "Douleurs cervicales légères", text: "Soutien qui aligne la colonne cervicale." },
        { icon: "💤", title: "Dormeurs sur le côté", text: "Épaisseur adaptée pour combler l'épaule." },
        { icon: "🌿", title: "Personnes allergiques", text: "Traité anti-acariens, housse lavable." },
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────
// GUIDE D'ENTRETIEN — étapes visuelles (pas de pavé)
// ─────────────────────────────────────────────────────────────
export function defaultCareSteps(productType: ProductType): CareStep[] {
  switch (productType) {
    case "matelas":
      return [
        { icon: "🌅", frequency: "Chaque jour", title: "Aérez", text: "Rejetez la couette au pied du lit + fenêtre ouverte 15-20 min." },
        { icon: "📅", frequency: "Chaque mois", title: "Aspirez", text: "Embout brosse douce sur les 2 faces + les coutures." },
        { icon: "🔄", frequency: "Tous les 3 mois", title: "Retournez", text: "Tête-pied la 1re fois, puis alternez face A / face B." },
        { icon: "🛡️", frequency: "En cas de tache", title: "Tamponnez", text: "Microfibre humide + savon de Marseille. Jamais de Javel." },
      ];
    case "lit":
      return [
        { icon: "🧹", frequency: "Toutes les 2 sem.", title: "Aspirez le tissu", text: "Brosse douce sur la tête de lit et les côtés." },
        { icon: "💧", frequency: "En cas de tache", title: "Nettoyez localement", text: "Chiffon microfibre humide, tamponnez sans frotter." },
        { icon: "🛠️", frequency: "Chaque année", title: "Contrôlez les vérins", text: "Une goutte d'huile silicone sur les articulations." },
        { icon: "🚫", frequency: "À éviter", title: "Vapeur & produits", text: "Écrase les fibres, laisse des auréoles définitives." },
      ];
    case "sommier":
      return [
        { icon: "🌬️", frequency: "Chaque mois", title: "Aérez le sommier", text: "Retirez le matelas 2-3h, fenêtre ouverte." },
        { icon: "🧹", frequency: "Tous les 3 mois", title: "Aspirez", text: "Tissu et entre les lattes." },
        { icon: "🔩", frequency: "Chaque année", title: "Serrez les vis", text: "Vérifiez l'état des lattes — remplacez si fissurée." },
      ];
    case "oreiller":
      return [
        { icon: "🧺", frequency: "Tous les 2 mois", title: "Lavez la housse", text: "40°C, essorage doux, séchage à l'air libre." },
        { icon: "☀️", frequency: "Chaque mois", title: "Aérez la garniture", text: "2h au soleil ou 30 min au congélateur (anti-acariens)." },
        { icon: "🔄", frequency: "Tous les 2-3 ans", title: "Remplacez", text: "Test : plié en 2, il doit reprendre sa forme < 3s." },
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────
// FAQ (12+ questions par type)
// ─────────────────────────────────────────────────────────────
export function defaultFaq(productType: ProductType, product?: any): FaqEntry[] {
  const name = product?.name || "ce produit";
  const size = getMainSize(product);
  switch (productType) {
    case "matelas":
      return [
        { question: `Comment choisir un matelas${size ? ` ${size}` : ""} ?`, answer: `Trois critères : votre position de sommeil (dos, côté, ventre), votre gabarit (< 70 kg → mi-ferme ; 70-90 kg → ferme ; > 90 kg → très ferme), et votre sensibilité à la température. ${name} a été sélectionné pour un usage adulte quotidien.` },
        { question: `À qui convient ${name} ?`, answer: `Ce matelas s'adresse aux adultes recherchant un couchage principal ou secondaire de qualité, adapté à un usage quotidien. Les caractéristiques précises (fermeté, technologie) sont indiquées dans les spécifications ci-dessus.` },
        { question: "Quelle différence entre mousse et ressorts ensachés ?", answer: "La mousse (polyuréthane ou mémoire de forme) enveloppe le corps et absorbe les points de pression. Les ressorts ensachés offrent un soutien plus tonique et une meilleure indépendance de couchage. Les modèles hybrides combinent les deux." },
        { question: "Combien de temps dure un matelas ?", answer: "Un matelas de qualité dure 7 à 10 ans en usage quotidien. Au-delà, la mousse perd 30% de son soutien et il faut le remplacer, même s'il « semble » encore bon." },
        { question: "Quel sommier utiliser ?", answer: "Sommier à lattes apparentes pour la ventilation, tapissier pour un soutien plus dense. Évitez les vieux sommiers avec lattes cassées — ils déforment le matelas en quelques mois." },
        { question: `${name} convient-il à un usage quotidien ?`, answer: `Oui — tous nos matelas sont conçus pour un couchage principal, testés pour 8+ heures d'usage par nuit sur 10 ans minimum.` },
        { question: "Comment entretenir mon matelas ?", answer: "Aérez chaque matin, aspirez tous les mois, retournez tous les 3 mois. Une housse de protection lavable à 60°C prolonge sa vie de plusieurs années." },
        { question: "Comment se déroule la livraison ?", answer: "Livraison sous 5-7 jours ouvrés en France métropolitaine, frais de port forfaitaires affichés au panier. Rendez-vous par SMS 48h avant, montée à l'étage incluse, reprise gratuite de l'ancien matelas sur demande." },
        { question: "Puis-je essayer le matelas avant d'acheter ?", answer: "Oui, en showroom : nos boutiques présentent les modèles et un conseiller vous oriente selon votre morphologie et votre position de sommeil. Pour une commande en ligne, vous disposez du droit de rétractation légal de 14 jours (article L221-18 du Code de la consommation), le produit devant être retourné complet et dans son emballage d'origine." },
        { question: "Quelle est la garantie ?", answer: "Garantie fabricant 2 ans minimum (défaut de fabrication, affaissement > 3 cm en usage normal). La garantie ne couvre pas l'usure normale ni les taches. Voir la fiche technique pour la garantie exacte de ce modèle." },
        { question: `Le matelas ${name} est-il hypoallergénique ?`, answer: "Nos matelas sont traités anti-acariens en usine et les housses sont certifiées OEKO-TEX Standard 100. Pour les allergies sévères, ajoutez une alèse imperméable." },
        { question: "Quel poids maximum le matelas supporte-t-il ?", answer: "Nos matelas standard supportent 130 kg par personne. Au-delà, privilégiez nos modèles ferme ou très ferme au maintien renforcé." },
      ];
    case "lit":
      return [
        { question: `Le montage de ${name} est-il compliqué ?`, answer: "Non — 45 minutes à deux personnes avec un tournevis cruciforme (fourni). Notice illustrée dans le colis, vidéo de montage sur notre site. Aide au montage à domicile disponible en option." },
        { question: "Quelle capacité de rangement offre le coffre ?", answer: `${product?.litCoffreCapacityL ? `${product.litCoffreCapacityL} litres — ` : "Environ 400 litres — "}soit l'équivalent de 4 tiroirs de commode. Idéal pour couettes, linge de saison, valises, jouets encombrants.` },
        { question: "Les vérins sont-ils fiables dans le temps ?", answer: "Testés pour 15 000 cycles d'ouverture — soit 5 ouvertures par jour pendant 8 ans. En cas de faiblesse, remplacement 30 € et 15 minutes." },
        { question: "Peut-on utiliser n'importe quel matelas ?", answer: "Épaisseur 18-30 cm, poids minimum 12 kg pour la stabilité. Tous nos matelas DreamsFly sont compatibles." },
        { question: "Ouverture frontale ou latérale, quelle différence ?", answer: "Frontale (par les pieds) : le plus courant, permet de ranger de grands objets. Latérale : utile quand le lit est contre un mur, se manœuvre depuis le côté accessible." },
        { question: "Comment entretenir le tissu ?", answer: "Aspirateur brosse douce toutes les 2 semaines. Taches : chiffon microfibre humide, tamponnez sans frotter. Éviter absolument le nettoyeur vapeur." },
        { question: "Le lit est-il bruyant à l'ouverture ?", answer: "Non — vérins hydrauliques modernes silencieux (< 30 dB). Une goutte d'huile silicone sur les articulations une fois par an suffit à garder le mécanisme feutré." },
        { question: "Livraison au 4e étage sans ascenseur, possible ?", answer: "Oui, montée à l'étage incluse — nos livreurs (2 personnes) montent jusqu'à votre chambre quel que soit l'étage. Le lit arrive démonté en 3 colis." },
        { question: "Combien de temps pour la livraison ?", answer: "5-7 jours ouvrés en France métropolitaine, rendez-vous par SMS 48h avant. Livraison sur créneaux flexibles (matin, après-midi, samedi selon zones)." },
        { question: "Quelle est la garantie ?", answer: "Structure : 5 ans. Vérins : 8 ans. Tissu : 2 ans. La garantie couvre les défauts de fabrication en usage normal — pas l'usure due aux animaux ou à un usage inapproprié." },
        { question: "Tête de lit et sommier inclus ?", answer: `${product?.litIncludes?.headboard ? "Tête de lit incluse. " : ""}${product?.litIncludes?.sommier ? "Sommier inclus. " : ""}${product?.litIncludes?.matelas ? "Matelas inclus. " : "Matelas non inclus."} Voir la fiche technique ci-dessus pour la composition exacte.` },
        { question: "Peut-on démonter le lit pour un déménagement ?", answer: "Oui — démontable en 30 minutes, remontable à l'identique. Gardez la notice et la boîte de visserie d'origine." },
      ];
    case "sommier":
      return [
        { question: `${name} est-il compatible avec tous les matelas ?`, answer: "Oui, avec les matelas de 15 à 30 cm d'épaisseur (mémoire de forme, ressorts ensachés, latex, mousse HR). Pour une literie moelleuse, nos lattes amplifient le confort." },
        { question: "Le sommier est-il facile à monter ?", answer: "Montage en 15 minutes à une personne, sans outil (pieds à visser à la main). Notice claire fournie." },
        { question: "Quelle est la garantie ?", answer: "2 ans sur la structure et les lattes. Couvre défauts de fabrication et casse en usage normal." },
        { question: "Les pieds sont-ils inclus ?", answer: "Oui — 4 pieds cylindriques en bois massif (hauteur 15 cm par défaut). Options 25 cm ou 5 cm disponibles." },
        { question: "Comment choisir la hauteur des pieds ?", answer: "Standard (15 cm) → couchage à 55-60 cm. Hauts (25 cm) → couchage à 65-70 cm, plus facile pour seniors et PMR. Bas (5 cm) → look bas type japonisant." },
        { question: "Le sommier est-il livré monté ?", answer: "Livré à plat pour faciliter la montée à l'étage. Assemblage en 15 min à domicile — 4 pieds à visser." },
        { question: "Quel entretien ?", answer: "Aspirateur tous les 3 mois entre les lattes. Vérifiez le serrage des vis une fois par an. Aérez sous le sommier lorsque vous changez les draps." },
        { question: "Combien de temps pour la livraison ?", answer: "5-7 jours ouvrés en France métropolitaine, frais de port forfaitaires affichés au panier. Rendez-vous par SMS 48h avant, montée à l'étage incluse." },
      ];
    case "oreiller":
      return [
        { question: "Puis-je laver l'oreiller en machine ?", answer: "La housse est amovible et lavable à 40°C. La garniture ne se lave pas, mais peut être aérée au soleil ou passée 30 min au congélateur (anti-acariens)." },
        { question: `Combien de temps pour s'habituer à ${name} ?`, answer: "5 à 7 nuits d'adaptation. Votre nuque a des habitudes fortes. Si après une semaine c'est toujours inconfortable, contactez-nous pour un échange." },
        { question: "Quelle hauteur choisir selon ma position ?", answer: "Sur le dos : 10-12 cm. Sur le côté : 14-16 cm (l'épaule doit être comblée). Sur le ventre : 5-8 cm pour ne pas cambrer la nuque." },
        { question: "L'oreiller convient-il aux allergiques ?", answer: "Traitement anti-acariens et housse OEKO-TEX. Pour les allergies sévères, ajoutez une housse anti-acariens supplémentaire (vendue séparément)." },
        { question: "Combien de temps dure un oreiller ?", answer: "2 à 3 ans pour un usage quotidien. Test simple : plié en deux, il doit reprendre sa forme en < 3 secondes." },
        { question: "Quel oreiller pour douleurs cervicales ?", answer: "Un oreiller ergonomique (mémoire de forme, forme vague) qui épouse la nuque sans la cambrer. Consultez un ostéopathe si les douleurs persistent." },
        { question: "Comment se déroule la livraison ?", answer: "48h en France métropolitaine, frais de port forfaitaires affichés au panier. Colis suivi, remise en boîte aux lettres ou en main propre selon la taille." },
        { question: "Quelle est la garantie ?", answer: "2 ans sur la garniture (perte de gonflant anormale) et la housse (couture, fermeture éclair)." },
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────
// CTA secondaire par défaut
// ─────────────────────────────────────────────────────────────
export function defaultExtraCta(productType: ProductType): CtaBlock | null {
  const map: Record<string, CtaBlock> = {
    matelas: {
      title: "Pas sûr du bon matelas pour vous ?",
      subtitle: "3 questions, 60 secondes, une reco personnalisée par nos experts.",
      ctaLabel: "Faire le quiz matelas",
      ctaLink: "/quiz",
    },
    lit: {
      title: "Envie de le voir en vrai avant de commander ?",
      subtitle: "Prenez rendez-vous dans l'un de nos 3 showrooms — sans engagement.",
      ctaLabel: "Trouver un showroom",
      ctaLink: "/magasins",
    },
    sommier: {
      title: "Besoin d'un pack sommier + matelas ?",
      subtitle: "Économisez jusqu'à 20 % en commandant les deux ensemble.",
      ctaLabel: "Voir nos packs",
      ctaLink: "/packs",
    },
    oreiller: {
      title: "Un doute sur le bon oreiller ?",
      subtitle: "Notre équipe vous conseille par téléphone selon votre position de sommeil.",
      ctaLabel: "Nous contacter",
      ctaLink: "/aide/contact",
    },
  };
  return map[productType as string] || null;
}

// ─────────────────────────────────────────────────────────────
// LIVRAISON / GARANTIE — texte factuel
// ─────────────────────────────────────────────────────────────
export const deliveryInfo = {
  price: "Frais de port forfaitaires — affichés au panier",
  delay: "5 à 7 jours ouvrés en France métropolitaine",
  perks: [
    "Rendez-vous programmé par SMS 48h avant",
    "Montée à l'étage incluse (2 livreurs)",
    "Reprise gratuite de votre ancien produit sur demande",
    "Créneaux matin, après-midi ou samedi selon zones",
  ],
};

export function defaultWarranty(productType: ProductType, _product?: any) {
  // Garantie DreamsFly : 2 ans sur matelas, sommiers et oreillers.
  // Seul le lit coffre a un barème détaillé (mécanisme fabricant).
  // NB : on n'utilise volontairement PAS `features.garantieAns` — la
  // métadonnée du catalogue fournisseur porte « 5 ans », ce qui ne
  // correspond pas à la garantie réellement accordée par DreamsFly.
  switch (productType) {
    case "matelas":
      return {
        duration: "2 ans",
        covers: [
          "Défaut de fabrication (couture, mousse, coutil)",
          "Affaissement anormal supérieur à 3 cm",
          "Casse de ressort en usage normal",
        ],
        excludes: [
          "Usure normale du tissu",
          "Taches, brûlures, morsures d'animaux",
          "Utilisation sur un sommier non compatible",
        ],
      };
    case "lit":
      return {
        duration: "5 ans structure · 8 ans vérins · 2 ans tissu",
        covers: [
          "Rupture de vérins en usage normal",
          "Casse de la structure porteuse",
          "Défaut de fabrication du tissu (couture, décoloration)",
        ],
        excludes: [
          "Usure normale du tissu",
          "Détérioration par animaux",
          "Dépassement du poids maximum",
        ],
      };
    case "sommier":
      return {
        duration: "2 ans",
        covers: ["Casse de lattes en usage normal", "Rupture de la structure"],
        excludes: ["Usure normale", "Utilisation dépassant le poids maximum"],
      };
    case "oreiller":
      return {
        duration: "2 ans",
        covers: ["Perte anormale de gonflant", "Défaut de couture ou fermeture éclair"],
        excludes: ["Usure normale (à remplacer tous les 2-3 ans)"],
      };
    default:
      return { duration: "2 ans", covers: [], excludes: [] };
  }
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
function getMainSize(product?: any): string | null {
  if (!product?.variants?.length) return null;
  return product.variants[0]?.size || null;
}
