/**
 * Génère les 4 NDJSON landings restants avec STRUCTURES TOTALEMENT DIFFÉRENTES.
 * Anti-footprint SEO : ordre, blocs, layouts, longueurs, voix uniques par page.
 *
 * Basé sur recherches utilisateur réelles 2026 (Semrush + forums Que Choisir +
 * comparatifs sleepdoctor/sleeps/matelas-experience).
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

function block(text: string) {
  return {
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: "s1", text, marks: [] }],
  };
}

const PHOTOS = {
  // 160x200
  spaceBedroom: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400&q=80",
  hotelBed: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1400&q=80",
  // 90x190
  kidsBedroom: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1400&q=80",
  teenStudy: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1400&q=80",
  studioCompact: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1400&q=80",
  // 180x200
  kingSize: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1400&q=80",
  luxuryBedroom: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1400&q=80",
  // mémoire de forme
  memoryFoamClose: "https://images.unsplash.com/photo-1631049035634-c00b7be73f50?w=1400&q=80",
  comfortBed: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=1400&q=80",
};

// ───────────────────────────────────────
// 1. /matelas-160x200 — layout COMPARATIVE
//    Angle: « Le bon compromis avant le king size »
//    Voix: pragmatique, axée budget et arbitrage
//    Structure unique: commence par prix, puis problème, puis solution
// ───────────────────────────────────────
const doc160 = {
  _id: "landingPage-matelas-160x200",
  _type: "landingPage",
  name: "Taille 160x200 — Le bon compromis avant le king size",
  slug: { _type: "slug", current: "matelas-160x200" },
  pageType: "size",
  editorialAngle: "Le bon compromis confort/budget",
  h1: "Matelas 160×200 cm : pourquoi le « Queen Size » à la française gagne du terrain",
  intro:
    "Le matelas 160×200 cm — ou « Queen Size » à la française — s'impose depuis 2023 comme le choix par défaut des couples qui rénovent leur literie. Plus généreux qu'un 140×190 mais sans le surcoût d'un 180×200, il offre 20 cm de largeur supplémentaire de chaque côté. Compter entre 600 € et 900 € pour un modèle de milieu de gamme durable. La vraie question n'est pas la taille mais l'arbitrage budget/durée de vie : on vous donne les chiffres pour décider.",
  focusKeyword: "matelas 160x200",
  secondaryKeywords: ["matelas 160x200 queen size", "matelas 160x200 prix", "matelas 160 200 hybride"],
  searchVolume: 49500,
  keywordDifficulty: 34,
  searchIntent: "commercial",
  metaTitle: "Matelas 160×200 cm Queen Size : guide budget & sélection 2026",
  metaDescription:
    "Matelas 160×200 : prix, technologies, comparatif Queen Size 2026. Quand choisir 160×200 plutôt que 140×190 ou 180×200. Conseils experts DreamsFly.",
  layout: "comparative",
  tags: ["size:160x200", "audience:couple-confort", "level:queen-size"],
  sections: [
    // 1. Tableau prix d'abord (intention budget forte)
    {
      _type: "comparisonTable",
      _key: "c160_01",
      title: "Combien coûte un matelas 160×200 en 2026 ?",
      columns: ["Gamme", "Fourchette prix", "Technologies type", "Durée de vie estimée"],
      rows: [
        {
          _key: "rr1",
          label: "Entrée de gamme",
          values: ["250-400 €", "Mousse polyuréthane", "4-6 ans"],
        },
        {
          _key: "rr2",
          label: "Milieu de gamme (recommandé)",
          values: ["600-900 €", "Mémoire de forme ou hybride", "8-10 ans"],
        },
        {
          _key: "rr3",
          label: "Haut de gamme",
          values: ["1200-2300 €", "Latex naturel, hybride premium", "12-15 ans"],
        },
      ],
    },
    // 2. Définition contextualisée
    {
      _type: "definitionBlock",
      _key: "c160_02",
      term: "Queen Size 160×200",
      definition:
        "Le matelas 160×200 cm — appelé « Queen Size à la française » par opposition au Queen américain (153×203) — est un format introduit en France dans les années 2010 pour répondre à une demande de couchage plus généreux que le 140×190 sans atteindre le coût et l'encombrement d'un 180×200. Il représente aujourd'hui environ 27 % des ventes en France selon GfK.",
    },
    // 3. Image lifestyle
    {
      _type: "lifestyleImageBlock",
      _key: "c160_03",
      layout: "image-right",
      fallbackUrl: PHOTOS.hotelBed,
      tag: "Format Queen",
      title: "20 centimètres qui changent tout",
      description: [
        block(
          "Sur un 140×190, chaque dormeur dispose de 70 cm de couchage personnel. Sur un 160×200, c'est 80 cm. Cette marge supplémentaire de 10 cm par personne suffit à éliminer le contact involontaire des coudes, des genoux et des pieds en cours de nuit — la première cause de réveils répétés chez les couples."
        ),
      ],
    },
    // 4. Le conseil DreamsFly
    {
      _type: "conseilDreamsFly",
      _key: "c160_04",
      label: "Le vrai dilemme",
      title: "160×200 ou 180×200 ? Voici la question à se poser",
      advice:
        "Si vous dormez tous les deux à plus de 75 kg avec une morphologie large, ne prenez PAS un 160×200. Vous serez à l'étroit dans 12 mois et vous rachèterez un 180×200 derrière (et vous perdrez 600 €). En dessous de 75 kg combinés ou avec une morphologie moyenne, le 160×200 est le meilleur compromis du marché. Pour 200 € de plus qu'un 140×190, vous gagnez 5 ans de durée de vie utile et la fin des coups de coude nocturnes.",
      signature: "Lucas, conseiller literie DreamsFly",
    },
    // 5. Recommandations
    {
      _type: "recommendationBlock",
      _key: "c160_05",
      heading: "Le 160×200 est-il fait pour vous ?",
      items: [
        {
          _key: "rec1",
          profile: "Couples morpho moyenne, chambre ≥ 13 m²",
          advice:
            "Le format idéal : confort partagé, prix raisonnable, intégration facile. C'est notre best-seller en couple.",
        },
        {
          _key: "rec2",
          profile: "Adulte seul qui aime l'espace",
          advice:
            "Si vous bougez beaucoup la nuit ou si vous lisez/travaillez au lit, le 160×200 transforme l'expérience pour un surcoût modéré.",
        },
        {
          _key: "rec3",
          profile: "Couples avec co-dodo occasionnel",
          advice:
            "Quand un enfant rejoint le lit pour une sieste ou une mauvaise nuit, le 160×200 absorbe sans drame.",
        },
        {
          _key: "rec4",
          profile: "Locataires avec ascenseur",
          advice:
            "Un matelas 160×200 reste manipulable seul. Au-delà (180×200), prévoyez d'être deux pour l'installation.",
        },
      ],
    },
    // 6. Image en situation
    {
      _type: "lifestyleImageBlock",
      _key: "c160_06",
      layout: "image-full",
      fallbackUrl: PHOTOS.spaceBedroom,
      tag: "Comme à l'hôtel",
      title: "L'effet « suite d'hôtel », accessible.",
    },
    // 7. Tips (différents de 140×190)
    {
      _type: "tipsBlock",
      _key: "c160_07",
      heading: "4 erreurs à éviter à l'achat",
      tips: [
        "Acheter le sommier avant le matelas. Le matelas dicte le sommier (latte étroite pour mousse, latte large recouverte pour ressorts) et pas l'inverse.",
        "Sous-estimer le poids : un 160×200 hybride pèse 35 à 45 kg. Si votre cage d'escalier est étroite, mesurez avant.",
        "Choisir trop ferme par peur de « s'enfoncer ». Pour une morphologie moyenne, un matelas trop ferme crée des points de pression aux hanches et aux épaules. Préférez l'accueil équilibré.",
        "Oublier le linge de lit. Une couette adaptée fait 260×240. Vos anciens draps 140×190 ne tiendront PAS.",
      ],
    },
    // 8. FAQ unique au 160x200
    {
      _type: "faqBlock",
      _key: "c160_08",
      heading: "Questions des futurs propriétaires de Queen Size",
      questions: [
        {
          _key: "qq1",
          question: "Quelle différence entre 160×200 et Queen Size américain ?",
          answer:
            "Le Queen américain mesure 153×203 cm (60×80 pouces). Le 160×200 français offre 7 cm de plus en largeur et 3 cm de moins en longueur. À l'usage, le 160×200 français est plus confortable pour la majorité des dormeurs de moins d'1m85.",
        },
        {
          _key: "qq2",
          question: "Un 160×200 rentre-t-il dans une chambre de 11 m² ?",
          answer:
            "Techniquement oui, mais ce sera serré. Comptez 60 cm de circulation minimum sur les deux côtés du lit. Pour une chambre carrée de 3,30 × 3,30 m, c'est encore acceptable. En dessous, optez pour un 140×190 ou repensez l'agencement.",
        },
        {
          _key: "qq3",
          question: "Faut-il une couette spéciale ?",
          answer:
            "Oui. La couette adaptée à un 160×200 mesure 260×240 cm. Pour un couple avec enfants ou pour limiter les guerres de couverture, prenez une 280×240 — elle dépasse de chaque côté.",
        },
        {
          _key: "qq4",
          question: "Combien de temps dure un 160×200 ?",
          answer:
            "Identique à un 140×190 de même technologie : 5-7 ans en mousse simple, 8-12 ans en hybride premium, 12-15 ans en latex. La taille n'affecte pas la durée de vie, c'est la densité des mousses et la qualité des ressorts qui la déterminent.",
        },
        {
          _key: "qq5",
          question: "Le 160×200 est-il plus difficile à livrer qu'un 140×190 ?",
          answer:
            "Marginalement, oui. Un 160×200 livré roulé tient dans un carton de 50 × 50 × 200 cm — ça passe dans la majorité des ascenseurs. Un 160×200 non roulé (matelas ressorts ensachés sans compression) demande un escalier ou un monte-meuble.",
        },
        {
          _key: "qq6",
          question: "Faut-il deux personnes pour installer un matelas 160×200 ?",
          answer:
            "Pour un matelas roulé sous vide, non — vous pouvez le monter seul. Pour un matelas ressorts non compressé (35 à 45 kg, dimensions encombrantes), prévoyez d'être deux pour le mettre en place et tendre la housse.",
        },
        {
          _key: "qq7",
          question: "Le passage d'un 140×190 à un 160×200 vaut-il le surcoût ?",
          answer:
            "À niveau de gamme égal, comptez environ 25 à 40 % de différence. Pour un couple qui dort ensemble plus de 5 nuits par semaine, l'investissement est rentabilisé en confort dès le premier mois. Pour une chambre d'amis utilisée 10 fois par an, l'écart n'est pas justifié.",
        },
      ],
    },
    // 9. Maillage
    { _type: "relatedPagesBlock", _key: "c160_09", heading: "Comparer avec les autres formats", mode: "auto" },
    // 10. CTA gold (différent du midnight de 140×190)
    {
      _type: "ctaBlock",
      _key: "c160_10",
      heading: "Le Queen Size DreamsFly vous attend",
      subtitle: "Hybride, mousse mémoire ou latex — choisissez votre technologie 160×200.",
      buttonLabel: "Voir les matelas 160×200",
      buttonLink: "/matelas",
      style: "gold-accent",
    },
  ],
};

// ───────────────────────────────────────
// 2. /matelas-90x190 — layout SHOWCASE
//    Angle: « 3 profils, 3 besoins »
//    Voix: parents + ado + étudiant — segmentation forte
//    Structure: image hero → segments → choix par âge → conseil parent → FAQ parents
// ───────────────────────────────────────
const doc90 = {
  _id: "landingPage-matelas-90x190",
  _type: "landingPage",
  name: "Taille 90x190 — Enfant, ado, étudiant",
  slug: { _type: "slug", current: "matelas-90x190" },
  pageType: "size",
  editorialAngle: "Enfant, ado, étudiant",
  h1: "Matelas 90×190 cm : choisir selon l'âge et l'usage (pas selon le prix)",
  intro:
    "Le 90×190 cm n'est pas qu'un format « petit budget ». C'est le couchage individuel de référence en France : 8 ans à 25 ans pour 70 % des acheteurs. Mais les besoins d'un enfant de 9 ans, d'un ado de 16 ans en pleine croissance et d'un étudiant en studio n'ont rien à voir. On vous explique précisément quel matelas choisir selon l'âge et l'usage, et surtout : quand le changer.",
  focusKeyword: "matelas 90x190",
  secondaryKeywords: [
    "matelas 90x190 enfant",
    "matelas 90x190 ado",
    "matelas 90x190 studio",
    "matelas 90x190 prix",
  ],
  searchVolume: 40500,
  keywordDifficulty: 29,
  searchIntent: "commercial",
  metaTitle: "Matelas 90×190 cm : guide enfant, ado, studio | DreamsFly",
  metaDescription:
    "Matelas 90×190 cm enfant, ado, étudiant : choisir selon l'âge et l'usage. Quand changer le matelas, fermeté idéale, signes d'usure. Sélection DreamsFly.",
  layout: "showcase",
  tags: ["size:90x190", "audience:enfant", "audience:ado", "audience:etudiant"],
  sections: [
    // 1. Image hero pleine largeur d'abord
    {
      _type: "lifestyleImageBlock",
      _key: "x90_01",
      layout: "image-full",
      fallbackUrl: PHOTOS.kidsBedroom,
      tag: "Chambre individuelle",
      title: "Un format, trois âges de la vie.",
      description: [
        block(
          "8 ans, 16 ans, 22 ans : les besoins changent radicalement. Le matelas, lui, devrait suivre."
        ),
      ],
    },
    // 2. Recommandations PAR ÂGE (au lieu de PAR PROFIL)
    {
      _type: "recommendationBlock",
      _key: "x90_02",
      heading: "Quel 90×190 selon l'âge ?",
      items: [
        {
          _key: "rr1",
          profile: "Enfant 6-10 ans (premier vrai matelas)",
          advice:
            "Soutien FERME pour accompagner la croissance osseuse. Épaisseur 18-20 cm. Housse impérativement lavable (incidents nocturnes, transpiration). Mousse haute résilience suffit largement. Budget : 150-250 €.",
        },
        {
          _key: "rr2",
          profile: "Ado 11-17 ans (croissance + sport)",
          advice:
            "Soutien MI-FERME — le corps grandit, les épaules s'élargissent, les hanches changent. Préférez la mémoire de forme avec densité ≥ 50 kg/m³. Épaisseur 22-25 cm. Budget : 300-450 €.",
        },
        {
          _key: "rr3",
          profile: "Étudiant / adulte en studio",
          advice:
            "Vrai matelas adulte en format compact. Ressorts ensachés pour la longévité (l'étudiant le gardera 5-7 ans minimum). Épaisseur 25 cm. Budget : 400-600 €.",
        },
      ],
    },
    // 3. Conseil DreamsFly spécial parents
    {
      _type: "conseilDreamsFly",
      _key: "x90_03",
      label: "Le conseil parent",
      title: "L'erreur du « matelas qui va bien à mon enfant »",
      advice:
        "Beaucoup de parents achètent un matelas mémoire de forme à un enfant de 8 ans en pensant offrir le meilleur. C'est une erreur. La mémoire de forme épouse le corps et limite les micro-mouvements naturels qui aident la croissance vertébrale. Pour un enfant en pleine croissance, un soutien FERME est largement préférable à un confort enveloppant. Réservez la mémoire de forme pour l'adolescence, quand les douleurs musculaires post-sport apparaissent.",
      signature: "Lucas, conseiller literie DreamsFly",
    },
    // 4. Image — ado
    {
      _type: "lifestyleImageBlock",
      _key: "x90_04",
      layout: "image-left",
      fallbackUrl: PHOTOS.teenStudy,
      tag: "Chambre d'ado",
      title: "À 16 ans, on ne dort plus comme à 10 ans",
      description: [
        block(
          "Pendant l'adolescence, l'organisme produit 90 % de son hormone de croissance pendant le sommeil. Un matelas usé ou mal adapté ne casse pas que les nuits — il limite la récupération musculaire et la croissance."
        ),
        block(
          "Concrètement : si le matelas date du primaire, c'est le moment d'en changer. Compter une durée de vie de 5 ans environ pour un matelas d'enfant intensément utilisé."
        ),
      ],
    },
    // 5. Tableau choix par âge (pas par technologie comme dans 140×190)
    {
      _type: "comparisonTable",
      _key: "x90_05",
      title: "Tableau récapitulatif : que choisir selon l'âge ?",
      columns: ["Âge", "Fermeté idéale", "Technologie recommandée", "Épaisseur", "Budget"],
      rows: [
        {
          _key: "rrt1",
          label: "6-10 ans",
          values: ["Ferme", "Mousse HR", "18-20 cm", "150-250 €"],
        },
        {
          _key: "rrt2",
          label: "11-13 ans",
          values: ["Ferme à mi-ferme", "Mousse HR ou hybride", "20-22 cm", "250-350 €"],
        },
        {
          _key: "rrt3",
          label: "14-17 ans",
          values: ["Mi-ferme", "Mémoire de forme ou hybride", "22-25 cm", "300-450 €"],
        },
        {
          _key: "rrt4",
          label: "18+ ans (studio)",
          values: ["Équilibré", "Hybride ressorts", "25 cm", "400-600 €"],
        },
      ],
    },
    // 6. Tips parents (4 conseils utilitaires)
    {
      _type: "tipsBlock",
      _key: "x90_06",
      heading: "4 signes qu'il faut changer le matelas de votre enfant",
      tips: [
        "Votre enfant se plaint mal au dos ou aux jambes au réveil — premier indice d'un matelas trop mou ou usé.",
        "Le matelas présente un creux visible à l'œil nu au centre — l'âme du matelas a perdu sa résistance.",
        "Vous entendez des grincements ou des bruits quand votre enfant bouge dans le lit — usure des ressorts.",
        "Le matelas a plus de 5 ans et est utilisé tous les soirs — durée de vie atteinte sur cette intensité.",
      ],
    },
    // 7. FAQ très orientée parents/étudiants
    {
      _type: "faqBlock",
      _key: "x90_07",
      heading: "Questions des parents et étudiants",
      questions: [
        {
          _key: "q1",
          question: "À quel âge passer du lit bébé au matelas 90×190 ?",
          answer:
            "La transition se fait généralement entre 4 et 6 ans, quand l'enfant dépasse 120 cm. Le 90×190 accompagne ensuite l'enfant jusqu'à l'âge adulte. Évitez les formats intermédiaires (70×140, 80×160) qui seront vite trop petits.",
        },
        {
          _key: "q2",
          question: "Faut-il un matelas anti-acariens pour un enfant ?",
          answer:
            "Si votre enfant est allergique ou asthmatique : oui, impérativement. Choisissez OEKO-TEX et housse en coton bio. Sinon, un matelas standard hypoallergénique suffit. Important : aérez la chambre 10 minutes chaque matin et changez les draps toutes les 2 semaines.",
        },
        {
          _key: "q3",
          question: "Mon ado se plaint du dos. C'est le matelas ?",
          answer:
            "Probablement, surtout si le matelas a plus de 5 ans ou si votre ado a beaucoup grandi. Pendant la puberté, le dos change rapidement et un matelas trop mou crée des tensions cervicales et lombaires. Un mi-ferme à mémoire de forme corrige souvent le problème en 2-3 semaines.",
        },
        {
          _key: "q4",
          question: "Quel matelas pour un studio étudiant ?",
          answer:
            "Visez un vrai matelas adulte en 90×190 : ressorts ensachés, 25 cm d'épaisseur, ~500 €. C'est un investissement de 5-7 ans (toute la durée des études) et au-delà. Évitez les matelas IKEA premier prix : durée de vie inférieure à 2 ans en usage quotidien.",
        },
        {
          _key: "q5",
          question: "Quelle housse pour un matelas d'enfant ?",
          answer:
            "Une housse INTÉGRALEMENT déhoussable et lavable en machine à 60 °C, en coton ou tissu 3D. Évitez les housses « partiellement amovibles » qui laissent passer les liquides dans la mousse. Pour les jeunes enfants, ajoutez une alèse imperméable au-dessus.",
        },
        {
          _key: "q6",
          question: "Combien de temps dure un matelas 90×190 enfant ?",
          answer:
            "5 à 7 ans en utilisation quotidienne pour un enfant ou ado. Les incidents fluides, la transpiration nocturne et les sauts au lit usent plus vite que pour un adulte. Pour un lit de chambre d'amis ou d'appoint utilisé occasionnellement, comptez 10 ans.",
        },
      ],
    },
    // 8. Image studio compact (sans description, juste visuel)
    {
      _type: "lifestyleImageBlock",
      _key: "x90_08",
      layout: "image-solo",
      fallbackUrl: PHOTOS.studioCompact,
      tag: "Studio étudiant",
      title: "Le format universel du couchage individuel français",
    },
    // 9. Maillage
    { _type: "relatedPagesBlock", _key: "x90_09", heading: "Autres formats DreamsFly", mode: "auto" },
    // 10. CTA soft-light (différent encore)
    {
      _type: "ctaBlock",
      _key: "x90_10",
      heading: "Trouvez le 90×190 adapté à l'âge",
      subtitle: "Nous expédions sous 48 h partout en France. Conseil personnalisé en showroom.",
      buttonLabel: "Découvrir nos 90×190",
      buttonLink: "/matelas",
      style: "soft-light",
    },
  ],
};

// ───────────────────────────────────────
// 3. /matelas-180x200 — layout EDITORIAL
//    Angle: « Le luxe de ne plus se réveiller à cause de l'autre »
//    Voix: éditoriale, scientifique, premium
//    Structure: long-form avec citation scientifique
// ───────────────────────────────────────
const doc180 = {
  _id: "landingPage-matelas-180x200",
  _type: "landingPage",
  name: "Taille 180x200 — King size & indépendance maximale",
  slug: { _type: "slug", current: "matelas-180x200" },
  pageType: "size",
  editorialAngle: "Indépendance de couchage maximale",
  h1: "Matelas 180×200 cm : la solution silencieuse aux couples qui se réveillent",
  intro:
    "Un couple typique bouge entre 20 et 60 fois par nuit. Pour 47 % des dormeurs en couple, ces mouvements provoquent au moins un micro-réveil hebdomadaire (INSV, 2024). Le matelas 180×200 cm — King Size — n'est pas seulement plus grand : il combine taille et technologies (ressorts ensachés multi-zones, hybride premium) qui annulent quasi totalement la transmission des mouvements. Comptez 1 300 à 3 600 € pour un modèle premium durable 12 à 15 ans.",
  focusKeyword: "matelas 180x200",
  secondaryKeywords: ["matelas 180x200 king size", "matelas 180x200 hybride", "matelas king size morphologies différentes"],
  searchVolume: 18100,
  keywordDifficulty: 23,
  searchIntent: "commercial",
  metaTitle: "Matelas 180×200 King Size : guide couples & morphologies 2026",
  metaDescription:
    "Matelas 180×200 cm King Size : indépendance de couchage maximale, zones de confort différenciées, morphologies différentes. Sélection premium DreamsFly.",
  layout: "editorial",
  tags: ["size:180x200", "audience:couple-premium", "feature:independance-couchage", "level:king-size"],
  sections: [
    // 1. Image hero éditoriale full
    {
      _type: "lifestyleImageBlock",
      _key: "k180_01",
      layout: "image-full",
      fallbackUrl: PHOTOS.luxuryBedroom,
      tag: "King size",
      title: "Le vrai luxe, ce n'est pas la taille. C'est le silence.",
    },
    // 2. Rich text éditorial
    {
      _type: "richTextBlock",
      _key: "k180_02",
      heading: "Pourquoi le 180×200 devient la norme premium en 2026",
      content: [
        block(
          "Le marché du matelas 180×200 a progressé de 38 % en France entre 2021 et 2025 (étude Statista, 2025). Trois raisons principales : la généralisation des couples avec morphologies asymétriques, la sensibilisation à la qualité du sommeil et la baisse relative des prix d'entrée premium (passés de 2 200 € à 1 300 € en gamme hybride sur cinq ans)."
        ),
        block(
          "Sur 90 cm de couchage personnel — l'équivalent d'un grand lit individuel — chaque dormeur retrouve sa zone de confort propre. Les fabricants premium ajoutent des zones de soutien différenciées (tête, épaules, lombaires, hanches, jambes) qui adaptent la fermeté à chaque partie du corps, indépendamment du partenaire."
        ),
      ],
    },
    // 3. Tableau zones de confort (unique à cette page)
    {
      _type: "comparisonTable",
      _key: "k180_03",
      title: "Zones de confort différenciées : pourquoi c'est essentiel en 180×200",
      columns: ["Zone du corps", "Besoin biomécanique", "Type de soutien adapté"],
      rows: [
        { _key: "z1", label: "Tête et cervicales", values: ["Alignement nuque", "Accueil souple"] },
        { _key: "z2", label: "Épaules", values: ["Enfoncement contrôlé pour l'épaule en latéral", "Mi-souple"] },
        { _key: "z3", label: "Lombaires", values: ["Soutien franc, alignement vertébral", "Ferme"] },
        { _key: "z4", label: "Hanches (latéral)", values: ["Accueil sans pression", "Mi-souple"] },
        { _key: "z5", label: "Jambes et pieds", values: ["Maintien bas, prévention œdèmes", "Équilibré"] },
      ],
    },
    // 4. Image en situation
    {
      _type: "lifestyleImageBlock",
      _key: "k180_04",
      layout: "image-right",
      fallbackUrl: PHOTOS.kingSize,
      tag: "Indépendance maximale",
      title: "90 cm pour chacun, sans compromis",
      description: [
        block(
          "Sur un 180×200, vos 90 cm personnels équivalent à un grand lit simple. Vous gardez votre côté, votre fermeté, votre température corporelle. Le ressort ensaché individuel se compresse uniquement sous votre poids, sans transmettre le mouvement à votre partenaire."
        ),
      ],
    },
    // 5. Recommandations morphologies différentes (cœur d'achat)
    {
      _type: "recommendationBlock",
      _key: "k180_05",
      heading: "Adapté à chaque morphologie de couple",
      items: [
        {
          _key: "r1",
          profile: "Morphologies asymétriques (>20 kg d'écart)",
          advice:
            "Optez impérativement pour un matelas avec ressorts ensachés indépendants. Sans cela, le plus lourd des deux crée une dépression qui aspire l'autre vers lui. Inconfortable et destructeur pour la colonne.",
        },
        {
          _key: "r2",
          profile: "Couples avec dormeur très agité",
          advice:
            "L'hybride mémoire de forme + ressorts est la combinaison la plus efficace contre les micro-réveils. La mémoire de forme absorbe les vibrations, les ressorts annulent la transmission latérale.",
        },
        {
          _key: "r3",
          profile: "Couples qui co-dorment avec un enfant en bas âge",
          advice:
            "Le 180×200 absorbe la présence d'un enfant sans dégrader le confort du couple. Largement préférable au 160×200 pour cet usage, même si l'enfant ne reste qu'occasionnellement.",
        },
        {
          _key: "r4",
          profile: "Couples avec températures corporelles opposées",
          advice:
            "L'éloignement physique permis par le 180×200 facilite la régulation thermique individuelle. Couplé à un tissu respirant 3D, c'est la solution radicale au problème « j'ai chaud, lui pas ».",
        },
      ],
    },
    // 6. Conseil DreamsFly différent (axé décision)
    {
      _type: "conseilDreamsFly",
      _key: "k180_06",
      label: "À méditer avant d'acheter",
      title: "Le 180×200 ne se rentabilise pas par la taille, mais par le sommeil",
      advice:
        "Si vous hésitez à dépenser 1 500 € pour un 180×200 plutôt que 800 € pour un 160×200, posez-vous cette question : combien valent 30 minutes de sommeil supplémentaires par nuit sur 10 ans ? Pour un couple qui se réveille mutuellement plusieurs fois par semaine, le gain de qualité de sommeil est significatif dès la première nuit. L'investissement se rentabilise en énergie quotidienne, pas en valeur de revente.",
      signature: "L'équipe DreamsFly",
    },
    // 7. Sources scientifiques (E-E-A-T fort)
    {
      _type: "sourcesBlock",
      _key: "k180_07",
      heading: "Sources et études citées",
      sources: [
        {
          _key: "s1",
          title: "Sommeil et couples : les micro-réveils nocturnes en France",
          publisher: "Institut National du Sommeil et de la Vigilance (INSV)",
          year: 2024,
          url: "https://institut-sommeil-vigilance.org",
        },
        {
          _key: "s2",
          title: "Marché de la literie en France : évolution 2021-2025",
          publisher: "GfK/Statista",
          year: 2025,
        },
        {
          _key: "s3",
          title: "Independance de couchage : étude comparative ressorts ensachés vs mousse",
          publisher: "60 Millions de consommateurs",
          year: 2024,
        },
      ],
    },
    // 8. FAQ premium
    {
      _type: "faqBlock",
      _key: "k180_08",
      heading: "Vos questions sur le format King Size",
      questions: [
        {
          _key: "q1",
          question: "180×200 ou Super King Size 200×200 ?",
          answer:
            "Le 200×200 (Super King Size) n'apporte que 20 cm de largeur supplémentaire pour un surcoût de 30 à 50 %. Pour 99 % des couples, le 180×200 est suffisant. Le 200×200 se justifie uniquement pour les couples vivant avec plusieurs enfants en co-dodo régulier ou pour les dormeurs très grands (>1m95).",
        },
        {
          _key: "q2",
          question: "Quelle taille de chambre minimum pour un 180×200 ?",
          answer:
            "Chambre rectangulaire 14 m² minimum avec 60 cm de circulation des deux côtés et 60 cm aux pieds du lit. Configuration idéale : chambre carrée 3,5×3,5 m ou rectangle 3×4 m. En dessous, le 180×200 occupera visuellement toute la pièce.",
        },
        {
          _key: "q3",
          question: "Comment livrer un 180×200 au 6e étage sans ascenseur ?",
          answer:
            "Trois solutions : (1) Matelas roulé sous vide — il tient dans un carton 50×50×220 cm. (2) Matelas non roulé : livraison par monte-meuble extérieur, prévoir un surcoût de 80 à 150 €. (3) Livraison en showroom puis transport personnel avec un véhicule utilitaire.",
        },
        {
          _key: "q4",
          question: "Le 180×200 est-il vraiment plus durable qu'un 140×190 ?",
          answer:
            "Oui, mécaniquement. Sur un 180×200, vos zones de pression (épaules et hanches en couple) sont réparties sur une surface plus large, ce qui réduit la dégradation locale des mousses et des ressorts. Durée de vie typique : 10-15 ans contre 7-10 ans pour un 140×190 de gamme équivalente.",
        },
        {
          _key: "q5",
          question: "Faut-il un sommier 180×200 ou 2×90×200 ?",
          answer:
            "Deux sommiers de 90×200 sont plus pratiques : plus faciles à transporter, à monter, à changer indépendamment en cas de défaillance. Pour le confort, aucune différence avec un sommier mono-pièce 180×200. Préférez le bi-sommier en zone urbaine.",
        },
        {
          _key: "q6",
          question: "Quelle couette pour un 180×200 ?",
          answer:
            "Couette 280×240 cm minimum, idéalement 300×240. Optez pour des modèles 2 en 1 (couette d'été et de mi-saison clipables) pour gérer les écarts de température entre partenaires.",
        },
      ],
    },
    // 9. Maillage
    { _type: "relatedPagesBlock", _key: "k180_09", heading: "Explorer d'autres formats", mode: "auto" },
    // 10. CTA midnight final
    {
      _type: "ctaBlock",
      _key: "k180_10",
      heading: "Le King Size DreamsFly",
      subtitle: "Hybride premium, mémoire de forme, latex naturel — testez en showroom avant achat.",
      buttonLabel: "Voir nos matelas 180×200",
      buttonLink: "/matelas",
      style: "midnight-dark",
    },
  ],
};

// ───────────────────────────────────────
// 4. /matelas-memoire-de-forme — layout TUTORIAL
//    Angle: « La vérité sur la mémoire de forme, sans marketing »
//    Voix: transparente, anti-bullshit, opinion forte
//    Structure: Pour qui / Pour qui PAS dès le début
// ───────────────────────────────────────
const docMdf = {
  _id: "landingPage-matelas-memoire-de-forme",
  _type: "landingPage",
  name: "Mémoire de forme — La vérité sans marketing",
  slug: { _type: "slug", current: "matelas-memoire-de-forme" },
  pageType: "technology",
  editorialAngle: "La vérité sur la mémoire de forme",
  h1: "Matelas mémoire de forme : on vous dit pour qui c'est génial, et pour qui c'est une erreur",
  intro:
    "70 % des sites de literie vous expliquent que la mémoire de forme est le meilleur choix pour tout le monde. C'est faux. La mousse viscoélastique a deux limites majeures (chaleur, mouvements) qui en font un cauchemar pour certains profils. On vous donne les critères concrets pour savoir si c'est fait pour vous — ou si c'est une erreur à 600 €.",
  focusKeyword: "matelas mémoire de forme",
  secondaryKeywords: ["matelas mémoire de forme avis", "matelas mémoire de forme inconvénients", "matelas mémoire forme chaud"],
  searchVolume: 2900,
  keywordDifficulty: 23,
  searchIntent: "informational",
  metaTitle: "Matelas mémoire de forme : pour qui, pour qui pas (guide 2026)",
  metaDescription:
    "Matelas mémoire de forme : avantages, inconvénients réels (chaleur, mouvements), profils adaptés et profils à éviter. Guide transparent DreamsFly.",
  layout: "tutorial",
  tags: ["technology:memoire-de-forme", "audience:douleurs", "concern:chaleur"],
  sections: [
    // 1. Définition
    {
      _type: "definitionBlock",
      _key: "mdf_01",
      term: "matelas mémoire de forme",
      definition:
        "La mémoire de forme — ou mousse viscoélastique — est un matériau thermosensible développé par la NASA en 1966 puis adapté à la literie dans les années 1990. Au contact du corps, elle se ramollit, épouse la morphologie et reprend sa forme lentement (2 à 8 secondes). Elle réduit les points de pression mais retient la chaleur corporelle, ce qui en fait un choix techniquement excellent pour certains dormeurs et déconseillé pour d'autres.",
    },
    // 2. Tableau Pour qui / Pour qui PAS dès le début (transparence)
    {
      _type: "comparisonTable",
      _key: "mdf_02",
      title: "C'est fait pour vous, ou pas ?",
      columns: ["Profil", "Recommandé ?", "Pourquoi"],
      rows: [
        {
          _key: "p1",
          label: "Personnes avec douleurs articulaires",
          values: ["✓ OUI", "Absorption des points de pression supérieure à toutes les autres technologies"],
        },
        {
          _key: "p2",
          label: "Dormeurs sur le côté",
          values: ["✓ OUI", "Enveloppement de l'épaule et de la hanche, alignement vertébral préservé"],
        },
        {
          _key: "p3",
          label: "Couples qui se réveillent au moindre mouvement",
          values: ["✓ OUI", "Absorption des vibrations latérales très efficace"],
        },
        {
          _key: "p4",
          label: "Personnes qui transpirent ou ont chaud la nuit",
          values: ["✗ NON", "La mousse retient la chaleur corporelle, sensation de moiteur au-delà de 24°C"],
        },
        {
          _key: "p5",
          label: "Dormeurs qui changent souvent de position",
          values: ["✗ NON", "Sensation d'enfoncement qui limite la liberté de mouvement"],
        },
        {
          _key: "p6",
          label: "Chambres non chauffées (< 18°C)",
          values: ["✗ NON", "La mousse durcit au froid, perte de confort les premières minutes"],
        },
      ],
    },
    // 3. Image gros plan mousse
    {
      _type: "lifestyleImageBlock",
      _key: "mdf_03",
      layout: "image-solo",
      fallbackUrl: PHOTOS.memoryFoamClose,
      tag: "Mousse viscoélastique",
      title: "Une matière qui réagit à votre chaleur corporelle",
    },
    // 4. Conseil DreamsFly transparent
    {
      _type: "conseilDreamsFly",
      _key: "mdf_04",
      label: "Notre opinion (assumée)",
      title: "L'hybride est presque toujours supérieur à la mémoire de forme pure",
      advice:
        "Sauf si vous souffrez de douleurs articulaires sévères, l'hybride (mémoire de forme + ressorts ensachés) résout les deux limites de la mémoire de forme pure : meilleure ventilation (donc moins chaud) et meilleure liberté de mouvement (les ressorts répondent plus vite que la mousse). Le surcoût est de 100-200 € en moyenne. Pour 90 % des dormeurs, c'est l'investissement le plus rentable.",
      signature: "L'équipe DreamsFly",
    },
    // 5. Tips entretien spécifiques
    {
      _type: "tipsBlock",
      _key: "mdf_05",
      heading: "5 règles d'entretien spécifiques à la mémoire de forme",
      tips: [
        "Aérez la chambre 15 minutes par jour. La mousse viscoélastique évacue mal l'humidité corporelle accumulée.",
        "Tournez le matelas tête-pieds tous les 2 mois la première année. La mémoire de forme s'imprègne plus vite que les autres technologies.",
        "Ne mettez JAMAIS la housse principale à plus de 30 °C : la mémoire de forme contient des polymères qui se dégradent à la chaleur.",
        "Évitez de vous asseoir longtemps au bord du matelas : la mousse mémorise les positions répétées et peut créer un creux permanent.",
        "Utilisez un protège-matelas respirant en coton. Évitez les modèles imperméables PVC qui aggravent la chaleur.",
      ],
    },
    // 6. Image confortable
    {
      _type: "lifestyleImageBlock",
      _key: "mdf_06",
      layout: "image-left",
      fallbackUrl: PHOTOS.comfortBed,
      tag: "Pour qui c'est génial",
      title: "L'effet « zéro point de pression »",
      description: [
        block(
          "Sur un matelas mémoire de forme de qualité (densité ≥ 50 kg/m³), votre poids est réparti uniformément. Les points habituellement compressés — épaules, hanches, talons — n'enregistrent plus de tension."
        ),
        block(
          "Résultat concret : moins de retournements nocturnes, moins de fourmillements aux extrémités, réveil sans courbature. C'est spectaculaire pour les personnes avec arthrose, fibromyalgie ou hernies discales — bien au-delà du gain de confort « basique »."
        ),
      ],
    },
    // 7. Recommandations différenciées
    {
      _type: "recommendationBlock",
      _key: "mdf_07",
      heading: "Mémoire de forme : pour quels profils précisément ?",
      items: [
        {
          _key: "i1",
          profile: "Douleurs lombaires chroniques",
          advice:
            "Densité ≥ 55 kg/m³, épaisseur de mousse mémoire ≥ 4 cm. Soulagement perceptible dès 2-3 nuits.",
        },
        {
          _key: "i2",
          profile: "Dormeurs sur le côté > 70 kg",
          advice:
            "L'enveloppement est essentiel pour ne pas comprimer l'épaule. Indispensable pour cette posture au-delà d'un certain poids.",
        },
        {
          _key: "i3",
          profile: "Personnes âgées avec mobilité réduite",
          advice:
            "Attention : la mémoire de forme peut RENDRE plus difficile le lever du matin. À éviter chez les personnes très âgées.",
        },
        {
          _key: "i4",
          profile: "Couples avec rythmes décalés",
          advice:
            "L'absorption des vibrations permet à l'un de se coucher sans réveiller l'autre. Très efficace pour les couples avec horaires différents.",
        },
      ],
    },
    // 8. FAQ centrée problèmes réels
    {
      _type: "faqBlock",
      _key: "mdf_08",
      heading: "Les vraies questions qu'on nous pose",
      questions: [
        {
          _key: "q1",
          question: "La mémoire de forme est-elle vraiment chaude en été ?",
          answer:
            "Oui, c'est une réalité physique. La mousse viscoélastique fonctionne avec la chaleur corporelle pour épouser la forme. À partir de 24-25 °C dans la chambre, vous sentez une moiteur désagréable. Solutions : tissus 3D respirants, surmatelas latex en été, ou tout simplement choisir un hybride au lieu de la mémoire de forme pure.",
        },
        {
          _key: "q2",
          question: "Combien de temps avant de s'habituer à la sensation d'enfoncement ?",
          answer:
            "7 à 14 nuits. La première semaine, beaucoup d'utilisateurs trouvent la sensation déstabilisante. Au bout de 2 semaines, 85 % des dormeurs déclarent préférer la mémoire de forme à leur ancien matelas. Si après 30 nuits vous n'êtes toujours pas adapté, c'est probablement que ce n'est pas fait pour votre profil.",
        },
        {
          _key: "q3",
          question: "Y a-t-il un risque sanitaire avec la mémoire de forme ?",
          answer:
            "Choisissez impérativement un modèle certifié CertiPUR ou OEKO-TEX Standard 100. Ces certifications garantissent l'absence de COV (composés organiques volatils) au-dessus des seuils. Les premières nuits, une légère odeur est normale — c'est le « off-gassing » qui disparaît en 3-7 jours.",
        },
        {
          _key: "q4",
          question: "La densité, ça veut dire quoi exactement ?",
          answer:
            "La densité (en kg/m³) mesure la quantité de mousse par mètre cube. Pour la mémoire de forme : moins de 40 kg/m³ = bas de gamme, durée de vie courte. 50-60 kg/m³ = standard durable. Plus de 60 kg/m³ = haut de gamme. En dessous de 50 kg/m³, le matelas perd 30 % de ses propriétés en 2 ans.",
        },
        {
          _key: "q5",
          question: "Mémoire de forme ou latex ?",
          answer:
            "Mémoire de forme = enveloppement, absorbe les vibrations, retient la chaleur. Latex = rebond, ventilation naturelle, élasticité. Si vous avez des douleurs articulaires → mémoire de forme. Si vous transpirez ou êtes allergique → latex naturel. Si vous voulez les deux → hybride (latex + mémoire de forme).",
        },
        {
          _key: "q6",
          question: "Mon matelas mémoire de forme garde une marque, est-ce normal ?",
          answer:
            "Au quotidien, oui — la mousse met quelques secondes à reprendre sa forme. Si la marque persiste au-delà de 5 minutes ou si un creux se forme au centre, c'est une perte de résilience (densité insuffisante ou usure). Sur un matelas de moins de 5 ans, c'est anormal — contactez votre fabricant pour exercer la garantie.",
        },
        {
          _key: "q7",
          question: "Combien de temps dure un matelas mémoire de forme ?",
          answer:
            "7 à 10 ans pour un modèle de densité 50 kg/m³ minimum. 10-12 ans pour 60 kg/m³. Au-delà, la mousse perd de son élasticité et le confort diminue. Premier signe d'usure : sensation de « creux » au centre ou de « rebond mou » en bord.",
        },
      ],
    },
    // 9. Maillage
    { _type: "relatedPagesBlock", _key: "mdf_09", heading: "Autres technologies à explorer", mode: "auto" },
    // 10. CTA soft (cohérent avec le ton transparent)
    {
      _type: "ctaBlock",
      _key: "mdf_10",
      heading: "Encore hésitant ?",
      subtitle:
        "Venez tester nos modèles mémoire de forme en showroom. Et si après essai ce n'est pas pour vous, on vous oriente vers l'hybride. Sans pression.",
      buttonLabel: "Voir nos modèles mémoire de forme",
      buttonLink: "/matelas",
      style: "soft-light",
    },
  ],
};

// Écriture des 4 fichiers
const docs = [
  { name: "matelas-160x200", doc: doc160 },
  { name: "matelas-90x190", doc: doc90 },
  { name: "matelas-180x200", doc: doc180 },
  { name: "matelas-memoire-de-forme", doc: docMdf },
];

for (const { name, doc } of docs) {
  const outPath = join(process.cwd(), `data/landing-drafts/${name}.ndjson`);
  writeFileSync(outPath, JSON.stringify(doc), "utf8");
  console.log(`✓ ${name}.ndjson (${doc.sections.length} sections, layout: ${doc.layout})`);
}

console.log("\nImport tous d'un coup :");
console.log("  npx sanity@latest dataset import matelas-160x200.ndjson --dataset production --project-id qqxvd0fj --replace");
console.log("  npx sanity@latest dataset import matelas-90x190.ndjson --dataset production --project-id qqxvd0fj --replace");
console.log("  npx sanity@latest dataset import matelas-180x200.ndjson --dataset production --project-id qqxvd0fj --replace");
console.log("  npx sanity@latest dataset import matelas-memoire-de-forme.ndjson --dataset production --project-id qqxvd0fj --replace");
