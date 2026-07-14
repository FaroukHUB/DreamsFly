/**
 * Contenus SEO par défaut pour la homepage.
 * Sanity override toujours si rempli. Chaque section peut être personnalisée
 * indépendamment via le doc Page d'accueil.
 */

type IconTitleText = { icon?: string; title?: string; text?: string };
type GuideItem = { icon?: string; title?: string; text?: string; ctaLabel?: string; ctaLink?: string; image?: any };
type CommitmentItem = { icon?: string; title?: string; text?: string; image?: any };
type FaqQuestion = { category?: string; question: string; answer: string };
type GuideCardItem = { image?: any; title?: string; summary?: string; ctaLabel?: string; ctaLink?: string };
type ArticleItem = { image?: any; category?: string; title?: string; excerpt?: string; date?: string; link?: string };
type TestimonialItem = { photo?: any; name?: string; location?: string; rating?: number; text?: string; productBought?: string; date?: string };

export const defaultWhyUs: {
  eyebrow: string;
  title: string;
  subtitle: string;
  pillars: IconTitleText[];
} = {
  eyebrow: "Notre différence",
  title: "Pourquoi choisir DreamsFly ?",
  subtitle:
    "Une literie premium fabriquée en Europe, sélectionnée par des passionnés, livrée à domicile avec un service pensé pour durer.",
  pillars: [
    { icon: "🎓", title: "Expertise", text: "6 ans à sélectionner les meilleurs fabricants européens de literie." },
    { icon: "🎯", title: "Sélection", text: "Moins de 3 % des modèles testés arrivent dans notre catalogue." },
    { icon: "🛡️", title: "Qualité", text: "Certifications OEKO-TEX, garanties longues, matériaux traçables." },
    { icon: "🤝", title: "Accompagnement", text: "Conseillers sommeil formés, disponibles par téléphone ou en showroom." },
    { icon: "💬", title: "Service client", text: "Réponse en moins de 4 h, du lundi au samedi. Français, humain, sans script." },
    { icon: "🚚", title: "Livraison", text: "Offerte dès 39 €, montée à l'étage incluse, reprise de l'ancien matelas gratuite." },
  ],
};

export const defaultBuyingGuide: {
  eyebrow: string;
  title: string;
  subtitle: string;
  guides: GuideItem[];
} = {
  eyebrow: "Guide d'achat",
  title: "Bien choisir sa literie, en 4 lectures",
  subtitle: "Nos guides vulgarisés pour décider en toute confiance.",
  guides: [
    {
      icon: "🛏️",
      title: "Comment choisir son matelas ?",
      text: "Position de sommeil, gabarit, fermeté, technologies — le guide complet pour ne pas se tromper.",
      ctaLabel: "Lire le guide",
      ctaLink: "/magazine/guide-choisir-matelas",
    },
    {
      icon: "🛋️",
      title: "Comment choisir son lit ?",
      text: "Coffre ou classique, taille, tissu, hauteur — nos critères pour un lit qui dure 10 ans.",
      ctaLabel: "Lire le guide",
      ctaLink: "/magazine/guide-choisir-lit",
    },
    {
      icon: "🪑",
      title: "Comment choisir son sommier ?",
      text: "Lattes, tapissier, à ressorts — quelle base pour quel matelas et quel usage.",
      ctaLabel: "Lire le guide",
      ctaLink: "/magazine/guide-choisir-sommier",
    },
    {
      icon: "🌙",
      title: "Comment choisir son oreiller ?",
      text: "Duvet, mémoire de forme, ergonomique — trouver le bon soutien pour votre nuque.",
      ctaLabel: "Lire le guide",
      ctaLink: "/magazine/guide-choisir-oreiller",
    },
  ],
};

export const defaultCommitments: {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: CommitmentItem[];
} = {
  eyebrow: "Nos engagements",
  title: "Ce à quoi nous nous tenons",
  subtitle:
    "Six promesses concrètes qui guident chaque décision — de la sélection produit au SAV.",
  items: [
    { icon: "✨", title: "Qualité", text: "Matériaux certifiés, ateliers audités, tests longévité 10 ans." },
    { icon: "🌙", title: "Confort", text: "30 nuits d'essai — vous ne gardez que ce qui vous convient." },
    { icon: "♾️", title: "Durabilité", text: "Garanties de 2 à 8 ans selon les produits, pièces détachées dispo." },
    { icon: "🚚", title: "Livraison", text: "Rendez-vous programmé, à l'étage, sans surprise de dernière minute." },
    { icon: "👥", title: "Accompagnement", text: "Conseillers sommeil formés — un vrai humain, pas un chatbot." },
    { icon: "❤️", title: "Service client", text: "Réponse < 4 h en semaine. Objectif : résolution au 1er contact." },
  ],
};

export const defaultHomepageFaq: {
  eyebrow: string;
  title: string;
  subtitle: string;
  questions: FaqQuestion[];
} = {
  eyebrow: "Questions fréquentes",
  title: "Vos questions, nos réponses",
  subtitle: "Tout ce qu'on nous demande le plus souvent — regroupé par thème pour aller vite.",
  questions: [
    // ─── Produit ───────────────────────────────────
    { category: "produit", question: "Quelle marque de matelas choisir ?", answer: "Cela dépend de votre position de sommeil, votre gabarit et votre budget. Chez DreamsFly, nous sélectionnons uniquement des fabricants européens certifiés OEKO-TEX. Notre quiz en 1 minute vous oriente vers le modèle qui correspond à votre morphologie." },
    { category: "produit", question: "Quelle est la meilleure taille de matelas pour un couple ?", answer: "Le 160×200 (Queen) est le meilleur compromis pour la plupart des couples. Le 180×200 (King) offre plus d'espace individuel — recommandé si l'un de vous bouge beaucoup ou pour les grandes tailles." },
    { category: "produit", question: "Combien de temps dure un matelas de qualité ?", answer: "Entre 7 et 10 ans en usage quotidien. Au-delà, la mousse perd 30 % de son soutien même s'il « semble » encore bon. Un protège-matelas + retournement tous les 3 mois prolongent la vie du matelas de 30 à 40 %." },
    { category: "produit", question: "Peut-on utiliser un ancien sommier ?", answer: "Techniquement oui, mais un vieux sommier avec lattes cassées ou mou dégrade rapidement un matelas neuf. Nous recommandons de renouveler les deux ensemble tous les 10 ans." },
    { category: "produit", question: "Les matelas DreamsFly sont-ils hypoallergéniques ?", answer: "Oui — traitement anti-acariens en usine, housses certifiées OEKO-TEX Standard 100 (absence de substances nocives). Pour les allergies sévères, ajoutez une alèse imperméable." },

    // ─── Livraison ─────────────────────────────────
    { category: "livraison", question: "La livraison est-elle vraiment gratuite ?", answer: "Oui, gratuite dès 39 € en France métropolitaine, avec montée à l'étage incluse (2 livreurs). Corse et zones difficiles d'accès : supplément indiqué au checkout." },
    { category: "livraison", question: "En combien de temps serai-je livré ?", answer: "5 à 7 jours ouvrés en France métropolitaine. Rendez-vous programmé par SMS 48 h avant, créneaux matin, après-midi ou samedi selon les zones." },
    { category: "livraison", question: "Reprenez-vous mon ancien matelas ?", answer: "Oui, gratuitement à la livraison sur simple demande à la commande. Nous le remettons à un centre de recyclage agréé Éco-mobilier." },
    { category: "livraison", question: "Livrez-vous en Belgique / Suisse / DOM-TOM ?", answer: "Belgique et Luxembourg : oui, sous 8-10 jours ouvrés, tarif dégressif selon poids. Suisse : oui, sous 10-14 jours (formalités douanières). DOM-TOM : nous consulter pour un devis personnalisé." },

    // ─── Paiement ──────────────────────────────────
    { category: "paiement", question: "Puis-je payer en plusieurs fois ?", answer: "Oui, en 2×, 3× ou 4× sans frais avec Alma (paiement sécurisé par carte bancaire). Sans impact sur votre crédit, réponse immédiate au checkout." },
    { category: "paiement", question: "Quels moyens de paiement acceptez-vous ?", answer: "Carte bancaire (Visa, Mastercard, Amex), Alma (paiement fractionné), Apple Pay, Google Pay, et virement bancaire pour les commandes > 2 000 €." },
    { category: "paiement", question: "Est-ce que le paiement est sécurisé ?", answer: "Oui — Stripe pour la carte bancaire, Alma pour le fractionné. Aucune donnée bancaire n'est stockée sur nos serveurs. Site en HTTPS, certifié PCI DSS niveau 1." },

    // ─── Garantie ──────────────────────────────────
    { category: "garantie", question: "Combien de temps dure la garantie ?", answer: "2 ans minimum sur tous nos produits. Certains matelas premium : 5 ans. Structure des lits : 5 ans. Vérins hydrauliques des lits coffre : 8 ans. Voir la fiche produit pour la durée exacte." },
    { category: "garantie", question: "Que couvre la garantie ?", answer: "Défauts de fabrication (couture, mousse, coutil), affaissement anormal > 3 cm en usage normal, casse de ressort. Ne couvre pas : usure normale du tissu, taches, brûlures, dégâts causés par animaux." },
    { category: "garantie", question: "Comment activer la garantie ?", answer: "Envoyez-nous une photo + description du problème par email à contact@dreamsfly.fr. Nous vous répondons sous 4 h ouvrées avec la marche à suivre — le plus souvent un simple retour + échange." },

    // ─── Entretien ─────────────────────────────────
    { category: "entretien", question: "Faut-il retourner un matelas ?", answer: "Oui — tous les 3 mois la 1re année, puis tous les 6 mois. Alternez tête-pied et face A / face B. Cette rotation prolonge la durée de vie de 30 à 40 %." },
    { category: "entretien", question: "Comment nettoyer une tache sur mon matelas ?", answer: "Tamponnez immédiatement avec un chiffon microfibre humide (jamais détrempé). Un peu de savon de Marseille pour les taches organiques. Séchez au sèche-cheveux à distance. Évitez absolument l'eau de Javel." },

    // ─── SAV & Retour ──────────────────────────────
    { category: "sav", question: "Puis-je essayer un matelas et le renvoyer ?", answer: "Oui — 30 nuits d'essai à domicile. Après 21 jours d'adaptation minimum, si le matelas ne vous convient pas, nous organisons la reprise gratuite et vous êtes intégralement remboursé, sans conditions et sans discussion." },
    { category: "sav", question: "Comment vous contacter en cas de problème ?", answer: "Par email à contact@dreamsfly.fr (réponse < 4 h en semaine), par téléphone au numéro affiché en pied de page, ou directement dans l'un de nos 3 showrooms." },
    { category: "sav", question: "Puis-je annuler ma commande avant livraison ?", answer: "Oui, sans frais, tant que la commande n'a pas été expédiée. Après expédition, retour gratuit sous 14 jours conformément au droit de rétractation. La reprise à domicile est gratuite." },
    { category: "autre", question: "Avez-vous des showrooms physiques ?", answer: "Oui, 3 showrooms en France où vous pouvez tester nos matelas et lits avant achat. Voir la page Magasins pour les adresses et horaires." },
  ],
};

export const defaultGuidesSection: {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: GuideCardItem[];
} = {
  eyebrow: "Nos guides",
  title: "Décidez en connaissance de cause",
  subtitle: "Des guides longs et illustrés pour comprendre avant d'acheter.",
  items: [
    { title: "Le guide complet du sommeil réparateur", summary: "Position, matelas, environnement — tout ce qui influence vos nuits.", ctaLabel: "Lire le guide", ctaLink: "/magazine/guide-sommeil-reparateur" },
    { title: "Matelas 140×190 : lequel choisir en 2026", summary: "Notre comparatif des meilleurs matelas taille couple.", ctaLabel: "Voir le comparatif", ctaLink: "/matelas-140x190" },
    { title: "Lit coffre : le guide 2026", summary: "Capacité, mécanisme, entretien — tout sur le lit coffre.", ctaLabel: "Lire le guide", ctaLink: "/lits-coffre" },
  ],
};

export const defaultLatestArticles: {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: ArticleItem[];
} = {
  eyebrow: "Notre magazine",
  title: "Derniers articles publiés",
  subtitle: "Conseils sommeil, guides d'achat et décryptages par nos experts.",
  items: [
    { category: "Conseils sommeil", title: "5 gestes pour mieux dormir dès ce soir", excerpt: "Des rituels simples validés par la recherche pour un endormissement plus rapide.", date: "2026-06-15", link: "/magazine/mieux-dormir-5-gestes" },
    { category: "Guide d'achat", title: "Mémoire de forme ou ressorts ensachés ?", excerpt: "Le comparatif honnête pour choisir la bonne technologie selon votre profil.", date: "2026-05-28", link: "/magazine/memoire-forme-vs-ressorts" },
    { category: "Santé", title: "Mal de dos : quel matelas privilégier ?", excerpt: "Recommandations d'ostéopathes et sélection DreamsFly adaptée.", date: "2026-05-10", link: "/magazine/matelas-mal-de-dos" },
  ],
};

export const defaultTestimonials: {
  eyebrow: string;
  title: string;
  subtitle: string;
  averageRating: number;
  totalReviews: number;
  moreReviewsUrl: string;
  moreReviewsLabel: string;
  items: TestimonialItem[];
} = {
  eyebrow: "Ils nous font confiance",
  title: "1 167 avis ★ 4,9 / 5 en moyenne",
  subtitle: "Ce que nos clients disent après leur achat — extraits vérifiés Google.",
  averageRating: 4.9,
  totalReviews: 1167,
  moreReviewsUrl:
    "https://www.google.com/search?q=Magasin+de+meubles+-+Canap%C3%A9+-+Matelas+%7C+TRUST+INDUSTRIE+Avis",
  moreReviewsLabel: "Voir tous les avis Google",
  items: [
    { name: "Sophie L.", location: "Lyon", rating: 5, text: "Livraison rapide, matelas parfait, essai 30 nuits qui a rassuré. Je recommande vraiment.", productBought: "Matelas MILAN 160×200", date: "2026-05-22" },
    { name: "Marc T.", location: "Bordeaux", rating: 5, text: "Le service client a répondu à mes questions en 30 min. Rare de nos jours. Bravo.", productBought: "Lit ATHÈNE 140×190", date: "2026-04-18" },
    { name: "Claire P.", location: "Paris", rating: 5, text: "J'avais peur d'acheter un matelas en ligne. Résultat : meilleur sommeil depuis 5 ans.", productBought: "Matelas BERLIN 140×190", date: "2026-05-30" },
    { name: "Julien R.", location: "Nantes", rating: 5, text: "Le lit coffre nous change la vie dans notre 45m². Vérins impeccables même après 6 mois.", productBought: "Lit COCO 160×200", date: "2026-03-12" },
    { name: "Amélie D.", location: "Toulouse", rating: 4, text: "Excellent produit, seul bémol : livraison à 8 jours au lieu de 5 annoncés. Mais parfaitement emballé et livreurs très pros.", productBought: "Sommier DreamsFly", date: "2026-06-02" },
    { name: "Nicolas B.", location: "Marseille", rating: 5, text: "Testé en showroom avant commande, décision facile. Le conseiller connaissait vraiment son sujet.", productBought: "Matelas LONDRES 180×200", date: "2026-04-05" },
  ],
};

type BrandLogoItem = { name?: string; logo?: any; url?: string };

export const defaultBrandLogos: {
  eyebrow: string;
  title: string;
  items: BrandLogoItem[];
} = {
  eyebrow: "Ils parlent de nous",
  title: "Reconnus par les médias",
  items: [
    { name: "Le Figaro" },
    { name: "Marie Claire Maison" },
    { name: "Elle Décoration" },
    { name: "AD Magazine" },
    { name: "Ideat" },
    { name: "M6 Turbo Déco" },
  ],
};
