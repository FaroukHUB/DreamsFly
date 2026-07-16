/**
 * Régénère le NDJSON Sanity pour /matelas-140x190 avec :
 * - 9 sections riches dont images en situation Unsplash
 * - 1 conseil DreamsFly humain
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

// Photos Unsplash libres pour usage commercial (à remplacer par vos photos)
const PHOTOS = {
  coupleBedroom: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1400&q=80",
  cozyBed: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1400&q=80",
  modernBedroom: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1400&q=80",
  sleepingPerson: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=1400&q=80",
  mattressClose: "https://images.unsplash.com/photo-1631049035634-c00b7be73f50?w=1400&q=80",
};

const doc: any = {
  _id: "landingPage-matelas-140x190",
  _type: "landingPage",
  name: "Taille 140x190 — Couple et petits espaces",
  slug: { _type: "slug", current: "matelas-140x190" },
  pageType: "size",
  editorialAngle: "Couple et petits espaces",
  h1: "Matelas 140×190 cm : le format idéal des couples français",
  intro:
    "Le matelas 140×190 cm est le format standard pour deux personnes en France. Idéal pour les couples vivant en appartement ou en petit espace, il offre un couchage confortable sans encombrer votre chambre. Chez DreamsFly, nos modèles 140×190 cm sont déclinés en mousse polyuréthane, mémoire de forme et hybride ressorts ensachés. Comptez entre 250 € et 700 € selon la technologie. Découvrez nos best-sellers, nos conseils d'experts et les réponses aux questions les plus posées pour faire le bon choix.",
  focusKeyword: "matelas 140x190",
  secondaryKeywords: [
    "matelas 140x190 prix",
    "matelas 140x190 pas cher",
    "matelas 140x190 mémoire de forme",
    "matelas 140 190",
  ],
  searchVolume: 74000,
  keywordDifficulty: 34,
  searchIntent: "commercial",
  metaTitle: "Matelas 140×190 cm : guide d'achat & sélection DreamsFly",
  metaDescription:
    "Tous nos matelas 140×190 cm — mémoire de forme, hybride, ressorts. Le format idéal des couples. Conseils experts, comparatif, FAQ. Livraison France.",
  layout: "editorial",
  tags: ["size:140x190", "audience:couple", "audience:small-space", "firmness:mixed"],
  sections: [
    // 1. Définition
    {
      _type: "definitionBlock",
      _key: "k01",
      term: "matelas 140×190",
      definition:
        "Le matelas 140×190 cm, aussi appelé « deux places standard » en France, mesure 140 centimètres de largeur sur 190 centimètres de longueur. C'est le format de couchage le plus vendu en France pour deux personnes, particulièrement adapté aux chambres de taille moyenne (10 à 15 m²) et aux couples souhaitant un confort partagé sans monopoliser l'espace.",
    },

    // 2. Image en situation — couple en chambre
    {
      _type: "lifestyleImageBlock",
      _key: "k02img",
      layout: "image-left",
      fallbackUrl: PHOTOS.coupleBedroom,
      tag: "En appartement",
      title: "Le format pensé pour la vie à deux",
      description: [
        block(
          "Avec 140 cm de largeur, chacun dispose d'environ 70 cm de couchage personnel — l'équivalent d'un lit simple. C'est suffisant pour la majorité des couples qui partagent une chambre standard en appartement, sans empiéter sur l'espace de circulation autour du lit."
        ),
        block(
          "Si vous êtes très souvent en co-dodo avec un enfant ou si vous êtes deux personnes très grandes (> 1,85 m), pensez plutôt au 160×200."
        ),
      ],
    },

    // 3. Recommandations
    {
      _type: "recommendationBlock",
      _key: "k03",
      heading: "À qui s'adresse le matelas 140×190 cm ?",
      items: [
        {
          _key: "r1",
          profile: "Couples en appartement",
          advice:
            "Le 140×190 est le standard couple le plus pratique. Il laisse de l'espace pour les meubles annexes (table de chevet, commode) dans une chambre de 11-14 m².",
        },
        {
          _key: "r2",
          profile: "Adultes en studio",
          advice:
            "Suffisamment grand pour un sommeil confortable, suffisamment compact pour préserver l'espace. Préférez un sommier coffre pour gagner du rangement.",
        },
        {
          _key: "r3",
          profile: "Chambre d'amis",
          advice:
            "Format polyvalent : confortable pour un couple invité, accueillant aussi pour un adulte seul.",
        },
        {
          _key: "r4",
          profile: "Étudiants en colocation",
          advice:
            "Plus économique qu'un 160×200, et compatible avec les meubles standards du marché.",
        },
      ],
    },

    // 4. Grille produits
    {
      _type: "productsGrid",
      _key: "k04",
      heading: "Nos matelas 140×190 recommandés",
      filter: "all",
      maxItems: 4,
    },

    // 5. CONSEIL DREAMSFLY (humain)
    {
      _type: "conseilDreamsFly",
      _key: "k05",
      label: "Le conseil DreamsFly",
      title: "Mesurez votre chambre AVANT de choisir la taille",
      advice:
        "L'erreur que font 8 clients sur 10 : choisir la taille d'abord, mesurer la chambre ensuite. Faites l'inverse. Règle simple : il vous faut au minimum 60 cm de circulation de chaque côté du lit pour faire le lit sans rage, brancher une lampe sans contorsion et passer l'aspirateur. En dessous, vous regretterez votre achat dans les 6 mois.",
      signature: "Lucas, conseiller literie DreamsFly",
    },

    // 6. Tableau comparatif
    {
      _type: "comparisonTable",
      _key: "k06",
      title: "Quelle technologie de matelas 140×190 choisir ?",
      columns: ["Critère", "Mousse polyuréthane", "Mémoire de forme", "Hybride (mousse + ressorts)", "Latex"],
      rows: [
        {
          _key: "row1",
          label: "Prix moyen",
          values: ["250-400 €", "400-600 €", "500-800 €", "700-1200 €"],
        },
        {
          _key: "row2",
          label: "Indépendance de couchage",
          values: ["Moyenne", "Bonne", "Excellente", "Bonne"],
        },
        {
          _key: "row3",
          label: "Soulagement points de pression",
          values: ["Standard", "Excellent", "Très bon", "Bon"],
        },
        {
          _key: "row4",
          label: "Thermorégulation",
          values: ["Standard", "Sensible à la chaleur", "Très bonne", "Excellente"],
        },
        {
          _key: "row5",
          label: "Durée de vie",
          values: ["5-7 ans", "7-10 ans", "8-12 ans", "10-15 ans"],
        },
        {
          _key: "row6",
          label: "Idéal pour",
          values: [
            "Petit budget",
            "Mal de dos, points de pression",
            "Couples, indépendance maximale",
            "Allergiques, durabilité",
          ],
        },
      ],
    },

    // 7. Image pleine largeur — chambre moderne
    {
      _type: "lifestyleImageBlock",
      _key: "k07img",
      layout: "image-full",
      fallbackUrl: PHOTOS.modernBedroom,
      tag: "Inspiration chambre",
      title: "Une chambre, un sanctuaire.",
      description: [
        block(
          "Le matelas 140×190 trouve sa place naturelle au cœur de votre chambre. Privilégiez une tête de lit douce, des chevets simples et une couette claire pour ouvrir l'espace visuellement."
        ),
      ],
    },

    // 8. Cas d'usage
    {
      _type: "useCaseBlock",
      _key: "k08",
      heading: "Comment intégrer un 140×190 dans votre chambre",
      content: [
        block(
          "Pour qu'un matelas 140×190 cm s'intègre confortablement dans une chambre, prévoyez au minimum 60 cm de circulation sur les deux côtés du lit (soit une chambre de 260 cm de large minimum). En dessous, l'accès devient malaisé pour faire le lit et changer les draps."
        ),
        block(
          "Sommier compatible : tous les sommiers 140×190 standard du marché conviennent. Privilégiez un sommier à lattes pour la ventilation des matelas mousse et mémoire de forme, ou un sommier tapissier pour un look plus traditionnel."
        ),
        block(
          "Couette adaptée : pour un lit 140×190, choisissez une couette 240×220 cm (« couette deux places »). Elle dépasse suffisamment de chaque côté pour éviter la guerre nocturne avec votre partenaire."
        ),
        block(
          "Drap-housse : taille standard 140×190 avec bonnet de 25 à 30 cm selon l'épaisseur de votre matelas."
        ),
      ],
    },

    // 9. Conseils numérotés
    {
      _type: "tipsBlock",
      _key: "k09",
      heading: "5 conseils pour bien choisir votre matelas 140×190",
      tips: [
        "Mesurez votre chambre avant l'achat. Vérifiez qu'il vous reste au moins 60 cm de circulation sur les côtés.",
        "Si vous dormez en couple avec des morphologies différentes, privilégiez un matelas hybride (mémoire de forme + ressorts ensachés) pour une indépendance de couchage maximale.",
        "Pour un budget serré, la mousse polyuréthane offre un excellent rapport qualité/prix sur ce format. Comptez 250-400 €.",
        "Si l'un de vous dort chaud, évitez la mémoire de forme pure et préférez l'hybride ou le latex, plus respirants.",
        "Vérifiez la garantie. Un bon matelas 140×190 doit durer au minimum 7 ans. Chez DreamsFly, garantie 2 ans incluse + essai en showroom.",
      ],
    },

    // 10. Image en situation — gros plan sommeil
    {
      _type: "lifestyleImageBlock",
      _key: "k10img",
      layout: "image-right",
      fallbackUrl: PHOTOS.sleepingPerson,
      tag: "Le bon sommeil",
      title: "Le vrai luxe, c'est de dormir profondément.",
      description: [
        block(
          "Un matelas adapté à votre morphologie maintient votre colonne dans son alignement naturel, sans creux ni cambrure forcée. C'est ce qui fait la différence entre se lever en pleine forme et se traîner à 7h du matin."
        ),
        block(
          "Pour un essai sans pression, venez tester nos modèles en showroom. Vous repartez avec celui qui vous correspond, pas celui qu'on essaie de vous vendre."
        ),
      ],
    },

    // 11. FAQ
    {
      _type: "faqBlock",
      _key: "k11",
      heading: "Questions fréquentes sur le matelas 140×190",
      questions: [
        {
          _key: "f1",
          question: "Quelle est la différence entre un matelas 140×190 et un 160×200 ?",
          answer:
            "Le 140×190 (largeur 140 cm × longueur 190 cm) est le standard couple en France pour les morphologies moyennes et les chambres de 11-14 m². Le 160×200 offre 20 cm de plus en largeur et 10 cm en longueur, recommandé pour les personnes grandes (> 1m80), les couples avec co-dodo enfant ou les chambres > 15 m². Le 160×200 coûte en moyenne 25 à 40 % plus cher.",
        },
        {
          _key: "f2",
          question: "Quelle épaisseur idéale pour un matelas 140×190 ?",
          answer:
            "Pour un adulte moyen, comptez entre 20 et 25 cm d'épaisseur. En dessous de 18 cm, le confort se dégrade rapidement. Au-dessus de 28 cm, vous payez surtout du superflu sauf si vous êtes en surpoids ou si vous voulez un effet « lit d'hôtel ».",
        },
        {
          _key: "f3",
          question: "Faut-il un sommier dédié pour un matelas 140×190 ?",
          answer:
            "Oui. Un matelas mal soutenu perd 50 % de sa durée de vie. Choisissez un sommier strictement de la même taille (140×190) avec lattes apparentes pour les matelas mousse et mémoire de forme, ou lattes recouvertes (tapissier) pour les ressorts ensachés.",
        },
        {
          _key: "f4",
          question: "Combien coûte un matelas 140×190 de qualité ?",
          answer:
            "Le prix juste pour un matelas durable et confortable en 140×190 se situe entre 350 € et 700 € selon la technologie. En dessous de 250 €, méfiez-vous : densité faible, durée de vie raccourcie. Au-dessus de 1000 €, vous payez surtout le marketing et la marque.",
        },
        {
          _key: "f5",
          question: "Comment savoir si un matelas 140×190 est trop ferme ou trop moelleux pour moi ?",
          answer:
            "Allongez-vous sur le matelas pendant au moins 10 minutes en position habituelle de sommeil. Un matelas adapté maintient votre colonne dans son alignement naturel, sans creux ni cambrure forcée. Si possible, testez en showroom — c'est pour ça qu'on a 3 boutiques physiques.",
        },
        {
          _key: "f6",
          question: "Mon matelas 140×190 est-il livré à domicile ?",
          answer:
            "Oui. DreamsFly livre dans toute la France métropolitaine. Livraison offerte dès 999 € d'achat, participation forfaitaire en dessous selon la zone. Délai : 3 à 5 jours ouvrés. Pour un retrait gratuit en entrepôt, contactez-nous.",
        },
        {
          _key: "f7",
          question: "Puis-je dormir en couple avec un matelas 140×190 si on a des morphologies très différentes ?",
          answer:
            "Oui, à condition de choisir un matelas hybride avec ressorts ensachés. Cette technologie offre une indépendance de couchage très supérieure aux matelas en mousse seule : vous ne sentez pas les mouvements de votre partenaire et chacun garde son confort propre.",
        },
        {
          _key: "f8",
          question: "Combien de temps dure un matelas 140×190 ?",
          answer:
            "Comptez 7 à 10 ans pour un matelas mémoire de forme ou hybride de qualité, 5 à 7 ans pour une mousse polyuréthane standard, 10 à 15 ans pour le latex naturel. Tournez votre matelas tête-pieds tous les 3 mois la première année pour prolonger sa durée de vie.",
        },
      ],
    },

    // 12. Maillage interne
    {
      _type: "relatedPagesBlock",
      _key: "k12",
      heading: "Découvrez les autres formats DreamsFly",
      mode: "auto",
    },

    // 13. CTA final
    {
      _type: "ctaBlock",
      _key: "k13",
      heading: "Convaincu par le format 140×190 ?",
      subtitle:
        "Découvrez les modèles disponibles dans cette taille et bénéficiez de la livraison à domicile partout en France.",
      buttonLabel: "Voir nos matelas 140×190",
      buttonLink: "/matelas",
      style: "midnight-dark",
    },
  ],
};

const outPath = join(process.cwd(), "data/landing-drafts/matelas-140x190.ndjson");
writeFileSync(outPath, JSON.stringify(doc), "utf8");
console.log("✓ NDJSON régénéré : " + outPath);
console.log("  Sections : " + doc.sections.length);
console.log("\nÀ importer :");
console.log("  npx sanity@latest dataset import matelas140x190.ndjson --dataset production --project-id qqxvd0fj --replace");
