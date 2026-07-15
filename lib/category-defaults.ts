/**
 * Contenu SEO par défaut pour les pages catégorie (/matelas, /lits, /sommiers, /oreillers).
 * Chaque catégorie a ses propres avantages, conseils, FAQ, entretien, comparatif.
 */

import type { Tip, FaqEntry, CareStep, Advantage } from "@/lib/product-defaults";

type ProductType = "matelas" | "lit" | "sommier" | "oreiller" | (string & {});

type BuyingCriterion = { icon: string; label: string; text: string };
type ComparisonRow = { criterion: string; values: (string | null)[] };
type Comparison = { columns: string[]; recommendedIndex?: number; rows: ComparisonRow[] };

// ─────────────────────────────────────────────────────────────
// AVANTAGES catégorie (grille 6 tuiles)
// ─────────────────────────────────────────────────────────────
export function categoryAdvantages(pt: ProductType): Advantage[] {
  switch (pt) {
    case "matelas":
      return [
        { icon: "🌙", title: "Confort premium", text: "Accueils moelleux à fermes — un modèle pour chaque profil de sommeil." },
        { icon: "🦴", title: "Soutien lombaire", text: "7 zones de confort différenciées pour aligner la colonne." },
        { icon: "🤝", title: "Indépendance de couchage", text: "L'autre bouge, vous dormez. Silence absolu." },
        { icon: "🌬️", title: "Régulation thermique", text: "Mousses aérées et housses respirantes — nuit fraîche." },
        { icon: "🛡️", title: "Certifiés OEKO-TEX", text: "Absence de substances nocives, sûr pour toute la famille." },
        { icon: "♾️", title: "Garantie 2 à 5 ans", text: "Défauts couverts + reprise gratuite en cas d'affaissement." },
      ];
    case "lit":
      return [
        { icon: "📦", title: "Rangement optimisé", text: "Coffres 300 à 500 L — l'équivalent d'une commode entière." },
        { icon: "🛠️", title: "Vérins fiables", text: "Testés 15 000 cycles, ouverture d'une main." },
        { icon: "🎨", title: "Matières premium", text: "Velours, tissu tramé, capitonné — pour chaque style." },
        { icon: "🇪🇺", title: "Fabriqués en Europe", text: "Ateliers certifiés, matériaux traçables, bois FSC." },
        { icon: "🚚", title: "Livraison à l'étage", text: "Deux livreurs incluent le portage jusqu'à votre chambre." },
        { icon: "🔧", title: "Montage rapide", text: "45 min à deux, tournevis fourni, notice claire." },
      ];
    case "sommier":
      return [
        { icon: "🌳", title: "Bois massif", text: "Structure en pin ou hêtre européen, solide et durable." },
        { icon: "🌬️", title: "Ventilation optimale", text: "Lattes espacées : aération naturelle du matelas." },
        { icon: "🦵", title: "Pieds inclus", text: "4 pieds cylindriques 15 cm — ajustables sur demande." },
        { icon: "🛠️", title: "Montage 15 min", text: "Sans outil, tous les éléments emboîtables." },
        { icon: "🛡️", title: "Garantie 5 ans", text: "Structure + lattes couvertes en usage normal." },
        { icon: "📦", title: "Livraison à plat", text: "Facile à monter, adapté à toutes les cages d'escalier." },
      ];
    case "oreiller":
      return [
        { icon: "🌙", title: "Soutien cervical", text: "Alignement optimal de la nuque, quelle que soit votre position." },
        { icon: "🧺", title: "Housse lavable", text: "Amovible, machine 40°C — hygiène impeccable." },
        { icon: "🌿", title: "Anti-acariens", text: "Traitement en usine, idéal pour les allergiques." },
        { icon: "🌬️", title: "Régulation thermique", text: "Fibres respirantes qui régulent la température." },
        { icon: "🇪🇺", title: "Confection européenne", text: "Ateliers audités, garnitures certifiées." },
        { icon: "🚚", title: "Livraison 48h", text: "Colis suivi, gratuit dès 39 €." },
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────
// GUIDE D'ACHAT — critères à considérer
// ─────────────────────────────────────────────────────────────
export function buyingCriteria(pt: ProductType): BuyingCriterion[] {
  switch (pt) {
    case "matelas":
      return [
        { icon: "😴", label: "Votre position de sommeil", text: "Dos → mi-ferme. Côté → moelleux à mi-ferme. Ventre → ferme." },
        { icon: "⚖️", label: "Votre gabarit", text: "< 70 kg → mi-ferme. 70-90 kg → ferme. > 90 kg → très ferme." },
        { icon: "🌡️", label: "Votre sensibilité thermique", text: "Chaud la nuit → ressorts ensachés. Frileux → mousse mémoire." },
        { icon: "💑", label: "Vous dormez à deux ?", text: "Privilégier l'indépendance de couchage : ressorts ensachés." },
      ];
    case "lit":
      return [
        { icon: "📏", label: "L'espace disponible", text: "Prévoyez 60 cm devant pour l'ouverture du coffre frontal." },
        { icon: "🎨", label: "Le style de la chambre", text: "Velours → cocooning. Tissu tramé → sobre. Capitonné → classique." },
        { icon: "🛏️", label: "La taille du couchage", text: "140×190 couple standard, 160×200 confort, 180×200 king." },
        { icon: "📦", label: "Le besoin de rangement", text: "Coffre 300 L suffit pour 90×190, 500 L pour 160×200+." },
      ];
    case "sommier":
      return [
        { icon: "🛏️", label: "Compatibilité matelas", text: "Latex/mémoire fine → tapissier. Mousse HR → lattes espacées." },
        { icon: "🦵", label: "Hauteur de couchage", text: "Pieds 15 cm standard, 25 cm pour seniors et PMR." },
        { icon: "📐", label: "La taille", text: "Toujours identique au matelas — pas de sur/sous-dimension." },
      ];
    case "oreiller":
      return [
        { icon: "😴", label: "Position de sommeil", text: "Dos : 10-12 cm. Côté : 14-16 cm. Ventre : 5-8 cm." },
        { icon: "🌿", label: "Allergies", text: "Anti-acariens obligatoire, éviter le duvet naturel." },
        { icon: "🌡️", label: "Sensibilité thermique", text: "Chaud → mousse gel ou fibre. Frileux → duvet ou mémoire." },
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────
// CONSEILS D'EXPERT avec source
// ─────────────────────────────────────────────────────────────
export function categoryTips(pt: ProductType): Tip[] {
  switch (pt) {
    case "matelas":
      return [
        { icon: "🕐", title: "Remplacez tous les 10 ans max", text: "Au-delà, votre matelas perd 30 % de son soutien même s'il paraît intact. Un vieux matelas cause 2 fois plus de douleurs dorsales.", source: { label: "Institut national du sommeil (INSV)", url: "https://institut-sommeil-vigilance.org/" } },
        { icon: "🔄", title: "Retournez-le tous les 3 mois la 1re année", text: "Puis tous les 6 mois. Alternez tête-pied et face A / face B pour prolonger la durée de vie de 30 à 40 %.", source: { label: "Fédération française du sommeil" } },
        { icon: "🛡️", title: "Un protège-matelas est obligatoire", text: "40 € qui préservent 500 € de matelas. Lavable 60°C, il évite les taches (qui annulent la garantie) et bloque les acariens.", source: { label: "ANSES — Allergènes de l'habitat" } },
        { icon: "📅", title: "Comptez 21 nuits d'adaptation", text: "Votre dos a des habitudes. Un matelas neuf, même parfait, demande 3 semaines pour être « lu » par votre corps.", source: { label: "Recommandation des ostéopathes (SFDO)" } },
      ];
    case "lit":
      return [
        { icon: "📏", title: "Mesurez avant de commander", text: "60 cm minimum devant le lit pour ouvrir le coffre frontal. Vérifiez portes et escaliers pour l'accessibilité de la livraison.", source: { label: "Guide de l'ameublement français (UNIFA)" } },
        { icon: "🛏️", title: "Choisissez un matelas adapté", text: "Épaisseur 18-30 cm, poids minimum 12 kg pour la stabilité à l'ouverture. Un matelas trop léger glisse sous les vérins.", source: { label: "Fabricants européens de literie (EBIA)" } },
        { icon: "🧹", title: "Aspirez le tissu toutes les 2 semaines", text: "Brosse douce. Pour une tache : chiffon microfibre humide, tamponnez sans frotter. Jamais de vapeur qui écrase les fibres.", source: { label: "Instructions Euratex" } },
        { icon: "🔧", title: "Contrôlez les vérins une fois par an", text: "L'ouverture devient dure ? Un vérin faiblit. Pièce standard à 30 €, remplacement en 15 min avec un tournevis.", source: { label: "AFNOR — mécanismes hydrauliques" } },
      ];
    case "sommier":
      return [
        { icon: "🔍", title: "Vérifiez la compatibilité matelas", text: "Lattes apparentes → matelas > 15 cm. Latex ou mémoire de forme fine → tapissier plus dense pour ne pas marquer.", source: { label: "Fédération française de l'ameublement (UNIFA)" } },
        { icon: "🦵", title: "Hauteur idéale : 55-65 cm", text: "Sommier + matelas + pieds. Pour les seniors ou PMR, passez à des pieds de 25 cm — s'asseoir devient plus facile.", source: { label: "Recommandations d'aménagement PMR" } },
        { icon: "🌬️", title: "Laissez respirer sous le sommier", text: "Un plateau plein retient l'humidité. Un sommier à lattes ou pieds hauts prévient moisissures et acariens.", source: { label: "ANSES — Humidité et habitat" } },
      ];
    case "oreiller":
      return [
        { icon: "😴", title: "Choisissez selon votre position", text: "Dos → fin/moyen (10-12 cm). Côté → épais/ferme (14-16 cm). Ventre → très fin (5-8 cm) pour ne pas cambrer la nuque.", source: { label: "Recommandations ostéopathiques (SFDO)" } },
        { icon: "🧺", title: "Lavez la housse tous les 2 mois", text: "40°C, essorage doux. La garniture ne se lave pas mais s'aère au soleil ou au congélateur (anti-acariens).", source: { label: "Protocole d'entretien ADEME" } },
        { icon: "🔄", title: "Remplacez tous les 2-3 ans", text: "Test : plié en deux, un bon oreiller reprend sa forme en < 3 s. S'il reste plié, il est mort.", source: { label: "Institut national du sommeil (INSV)" } },
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────
// ENTRETIEN en 4 étapes
// ─────────────────────────────────────────────────────────────
export function categoryCareSteps(pt: ProductType): CareStep[] {
  switch (pt) {
    case "matelas":
      return [
        { icon: "🌅", frequency: "Chaque jour", title: "Aérez", text: "Rejetez la couette au pied + fenêtre ouverte 15-20 min." },
        { icon: "📅", frequency: "Chaque mois", title: "Aspirez", text: "Brosse douce sur les 2 faces et les coutures." },
        { icon: "🔄", frequency: "Tous les 3 mois", title: "Retournez", text: "Tête-pied la 1re fois, puis alternez face A / face B." },
        { icon: "🛡️", frequency: "En cas de tache", title: "Tamponnez", text: "Microfibre humide + savon de Marseille. Jamais de Javel." },
      ];
    case "lit":
      return [
        { icon: "🧹", frequency: "Toutes les 2 sem.", title: "Aspirez", text: "Brosse douce sur tête de lit et côtés." },
        { icon: "💧", frequency: "En cas de tache", title: "Nettoyez", text: "Chiffon microfibre humide, tamponnez sans frotter." },
        { icon: "🛠️", frequency: "Chaque année", title: "Contrôlez vérins", text: "Une goutte d'huile silicone sur les articulations." },
        { icon: "🚫", frequency: "À éviter", title: "Vapeur & Javel", text: "Écrase les fibres, laisse des auréoles définitives." },
      ];
    case "sommier":
      return [
        { icon: "🌬️", frequency: "Chaque mois", title: "Aérez", text: "Retirez le matelas 2-3h, fenêtre ouverte." },
        { icon: "🧹", frequency: "Tous les 3 mois", title: "Aspirez", text: "Entre les lattes et sur le tissu." },
        { icon: "🔩", frequency: "Chaque année", title: "Serrez les vis", text: "Vérifiez l'état des lattes — remplacez si fissurée." },
      ];
    case "oreiller":
      return [
        { icon: "🧺", frequency: "Tous les 2 mois", title: "Lavez la housse", text: "40°C, essorage doux, séchage air libre." },
        { icon: "☀️", frequency: "Chaque mois", title: "Aérez la garniture", text: "2h au soleil ou 30 min au congélateur." },
        { icon: "🔄", frequency: "Tous les 2-3 ans", title: "Remplacez", text: "Test : plié en 2, reprise de forme < 3 s." },
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────
// FAQ 10+ questions par catégorie
// ─────────────────────────────────────────────────────────────
export function categoryFaq(pt: ProductType): FaqEntry[] {
  switch (pt) {
    case "matelas":
      return [
        { question: "Comment choisir son matelas ?", answer: "Trois critères : position de sommeil (dos = mi-ferme, côté = moelleux, ventre = ferme), gabarit (< 70 kg mi-ferme, 70-90 kg ferme, > 90 kg très ferme), et sensibilité thermique (chaud → ressorts, frileux → mousse mémoire)." },
        { question: "Quelle taille de matelas choisir ?", answer: "90×190 pour une personne. 140×190 pour un couple qui privilégie l'espace vertical (chambres < 12 m²). 160×200 est le meilleur compromis couple. 180×200 pour l'espace king size ou les grandes tailles." },
        { question: "Quelle différence entre mousse et ressorts ?", answer: "La mousse (polyuréthane ou mémoire) enveloppe le corps et absorbe les points de pression. Les ressorts ensachés offrent un soutien plus tonique + une meilleure indépendance de couchage. Les hybrides combinent les deux." },
        { question: "Combien de temps dure un matelas ?", answer: "7 à 10 ans en usage quotidien. Au-delà, la mousse perd 30 % de son soutien même s'il semble intact. Un vieux matelas double le risque de douleurs dorsales." },
        { question: "Quel sommier utiliser avec un matelas neuf ?", answer: "Toujours neuf, adapté. Un vieux sommier avec lattes cassées ruine un matelas neuf en quelques mois — et annule la garantie. Lattes espacées pour la ventilation, tapissier pour un soutien dense." },
        { question: "Combien de temps pour être livré ?", answer: "5 à 7 jours ouvrés en France métropolitaine, gratuit dès 39 €. Rendez-vous par SMS 48 h avant, montée à l'étage incluse, reprise gratuite de l'ancien matelas sur demande." },
        { question: "Puis-je essayer et renvoyer si ça ne convient pas ?", answer: "30 nuits d'essai à domicile. Après 21 jours d'adaptation, si le matelas ne vous convient pas, reprise gratuite et remboursement intégral — sans conditions." },
        { question: "Quelle est la garantie ?", answer: "2 ans minimum sur tous nos matelas (défaut de fabrication, affaissement > 3 cm). Certains modèles premium : 5 ans. Ne couvre pas l'usure normale ni les taches." },
        { question: "Les matelas sont-ils hypoallergéniques ?", answer: "Traitement anti-acariens en usine, housses certifiées OEKO-TEX Standard 100. Pour les allergies sévères, ajoutez une alèse imperméable." },
        { question: "Comment entretenir mon matelas ?", answer: "Aérez chaque matin, aspirez tous les mois, retournez tous les 3 mois. Une housse de protection lavable à 60°C prolonge sa vie de plusieurs années." },
        { question: "Quel poids maximum le matelas supporte-t-il ?", answer: "Nos matelas standard supportent 130 kg par personne. Au-delà, privilégiez nos modèles ferme ou très ferme (mousse HR + ressorts) au maintien renforcé." },
        { question: "Peut-on plier un matelas pour le déplacer ?", answer: "Un matelas mousse peut être plié en 3 sur 24 h max. Les ressorts ensachés ne se plient jamais — ils se déforment définitivement. Préférez un déménagement à plat." },
      ];
    case "lit":
      return [
        { question: "Coffre frontal ou latéral, quelle différence ?", answer: "Frontal (par les pieds) est le plus courant, permet de ranger de grands objets. Latéral (par le côté) est utile quand le lit est contre un mur — se manœuvre depuis le côté accessible." },
        { question: "Quelle capacité de rangement offre un lit coffre ?", answer: "300 L pour 90×190, 400 L pour 140×190, 500 L pour 160×200 et plus. Soit l'équivalent d'une commode 4 tiroirs. Idéal pour couettes, linge de saison, valises." },
        { question: "Les vérins sont-ils fiables dans le temps ?", answer: "Nos vérins hydrauliques sont testés pour 15 000 cycles d'ouverture — soit 5 ouvertures par jour pendant 8 ans. Remplacement 30 € et 15 min si un jour ils faiblissent." },
        { question: "Peut-on utiliser n'importe quel matelas ?", answer: "Épaisseur 18-30 cm, poids minimum 12 kg pour la stabilité à l'ouverture. Un matelas trop léger glisse sous les vérins. Nos matelas DreamsFly sont tous compatibles." },
        { question: "Le montage est-il compliqué ?", answer: "45 minutes à deux personnes avec un tournevis cruciforme (fourni). Notice illustrée + vidéo de montage. Aide au montage à domicile en option (39 €)." },
        { question: "Comment entretenir le tissu ?", answer: "Aspirateur brosse douce toutes les 2 semaines. Taches : chiffon microfibre humide, tamponnez sans frotter. Éviter absolument le nettoyeur vapeur qui écrase les fibres." },
        { question: "Livraison à l'étage possible ?", answer: "Oui — 2 livreurs montent jusqu'à votre chambre quel que soit l'étage. Le lit arrive démonté en 3 colis pour faciliter les passages étroits (portes, escaliers)." },
        { question: "Quelle est la garantie ?", answer: "Structure : 5 ans. Vérins hydrauliques : 8 ans. Tissu : 2 ans. La garantie couvre les défauts de fabrication en usage normal." },
        { question: "Le lit est-il bruyant ?", answer: "Non — vérins hydrauliques modernes silencieux (< 30 dB). Une goutte d'huile silicone sur les articulations une fois par an suffit à garder le mécanisme feutré." },
        { question: "Puis-je démonter le lit pour un déménagement ?", answer: "Oui — démontable en 30 minutes, remontable à l'identique. Gardez la notice et la boîte de visserie d'origine." },
      ];
    case "sommier":
      return [
        { question: "Le sommier est-il compatible avec tous les matelas ?", answer: "Oui, avec les matelas de 15 à 30 cm d'épaisseur (mémoire de forme, ressorts ensachés, latex, mousse HR). Pour une literie moelleuse, nos lattes amplifient le confort." },
        { question: "Le sommier est-il facile à monter ?", answer: "15 minutes à une personne, sans outil (pieds à visser à la main). Notice claire fournie." },
        { question: "Les pieds sont-ils inclus ?", answer: "Oui — 4 pieds cylindriques en bois massif (15 cm par défaut). Options 25 cm ou 5 cm disponibles." },
        { question: "Comment choisir la hauteur des pieds ?", answer: "Standard (15 cm) → couchage à 55-60 cm. Hauts (25 cm) → 65-70 cm, plus facile pour seniors et PMR. Bas (5 cm) → look japonisant." },
        { question: "Quel entretien ?", answer: "Aspirateur tous les 3 mois entre les lattes. Vérifiez le serrage des vis une fois par an. Aérez sous le sommier lorsque vous changez les draps." },
        { question: "Combien de temps pour la livraison ?", answer: "5-7 jours ouvrés en France métropolitaine, gratuite dès 39 €. Livré à plat, monté en 15 min à domicile." },
      ];
    case "oreiller":
      return [
        { question: "Quelle hauteur choisir selon ma position ?", answer: "Sur le dos : 10-12 cm. Sur le côté : 14-16 cm (l'épaule doit être comblée). Sur le ventre : 5-8 cm pour ne pas cambrer la nuque." },
        { question: "Puis-je laver l'oreiller en machine ?", answer: "La housse est amovible et lavable à 40°C. La garniture ne se lave pas mais peut être aérée au soleil ou passée 30 min au congélateur (anti-acariens)." },
        { question: "Combien de temps dure un oreiller ?", answer: "2 à 3 ans pour un usage quotidien. Test simple : plié en deux, il doit reprendre sa forme en < 3 secondes." },
        { question: "L'oreiller convient-il aux allergiques ?", answer: "Traitement anti-acariens et housse OEKO-TEX. Pour les allergies sévères, ajoutez une housse anti-acariens supplémentaire." },
        { question: "Quel oreiller pour douleurs cervicales ?", answer: "Un oreiller ergonomique (mémoire de forme, forme vague) qui épouse la nuque sans la cambrer. Consultez un ostéopathe si les douleurs persistent." },
        { question: "Comment se déroule la livraison ?", answer: "48h en France métropolitaine, gratuite dès 39 €. Colis suivi, remise en boîte aux lettres ou en main propre selon la taille." },
      ];
    default:
      return [];
  }
}

// ─────────────────────────────────────────────────────────────
// COMPARATIF TECHNOLOGIES / MATIERES
// ─────────────────────────────────────────────────────────────
export function categoryComparison(pt: ProductType): Comparison | null {
  switch (pt) {
    case "matelas":
      return {
        columns: ["Mousse polyuréthane", "Mémoire de forme", "Ressorts ensachés", "Hybride"],
        recommendedIndex: 3,
        rows: [
          { criterion: "Confort général", values: ["Basique", "Enveloppant", "Tonique", "Équilibré"] },
          { criterion: "Soutien lombaire", values: ["Standard", "Excellent", "Très bon", "Excellent"] },
          { criterion: "Indépendance de couchage", values: ["Faible", "Bonne", "Excellente", "Excellente"] },
          { criterion: "Régulation thermique", values: ["Moyenne", "Chaude", "Fraîche", "Fraîche"] },
          { criterion: "Durée de vie", values: ["5-7 ans", "8-10 ans", "8-10 ans", "10 ans+"] },
          { criterion: "Prix moyen", values: ["dès 199 €", "dès 399 €", "dès 499 €", "dès 599 €"] },
          { criterion: "Idéal pour", values: ["Petit budget", "Douleurs dorsales", "Couples, chaleur", "Tous profils"] },
        ],
      };
    case "lit":
      return {
        columns: ["Velours", "Tissu tramé", "Lin", "Capitonné"],
        recommendedIndex: 0,
        rows: [
          { criterion: "Toucher", values: ["Doux, chaleureux", "Ferme, sobre", "Frais, naturel", "Structuré"] },
          { criterion: "Rendu visuel", values: ["Profond, cocooning", "Contemporain", "Scandinave", "Classique"] },
          { criterion: "Entretien", values: ["Aspirateur + brosse", "Facile", "Facile", "Aspirateur en creux"] },
          { criterion: "Tenue dans le temps", values: ["Excellent", "Excellent", "Bon", "Excellent"] },
          { criterion: "Prix moyen", values: ["dès 699 €", "dès 599 €", "dès 799 €", "dès 899 €"] },
          { criterion: "Style idéal", values: ["Boudoir, cosy", "Épuré", "Nature", "Hôtel, prestige"] },
        ],
      };
    default:
      return null;
  }
}
