/**
 * Contenus SEO par défaut pour la homepage.
 * Sanity override toujours si rempli. Chaque section peut être personnalisée
 * indépendamment via le doc Page d'accueil.
 */

type IconTitleText = { icon?: string; title?: string; text?: string };
type GuideItem = { icon?: string; title?: string; text?: string; ctaLabel?: string; ctaLink?: string; image?: any };
type CommitmentItem = { icon?: string; title?: string; text?: string; image?: any };
type FaqQuestion = { category?: string; question: string; answer: string };
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
    "Une literie premium en confection européenne, sélectionnée modèle par modèle, livrée à domicile avec un service pensé pour durer.",
  pillars: [
    { icon: "🎓", title: "Expertise", text: "6 ans à sélectionner les meilleurs fabricants européens de literie." },
    { icon: "🎯", title: "Sélection", text: "Un catalogue volontairement resserré, modèle par modèle." },
    { icon: "🛡️", title: "Garantie", text: "2 ans sur nos matelas, sommiers et oreillers." },
    { icon: "🤝", title: "Accompagnement", text: "Conseillers sommeil formés, disponibles par téléphone ou en showroom." },
    { icon: "💬", title: "Service client", text: "Joignable par téléphone et en showroom. Français, humain, sans script." },
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
    "Cinq promesses concrètes qui guident chaque décision — de la sélection produit au SAV.",
  items: [
    { icon: "✨", title: "Qualité", text: "Matériaux certifiés, ateliers audités, tests longévité 10 ans." },
    { icon: "🌙", title: "Confort", text: "Essai libre en showroom — vous choisissez en connaissance de cause." },
    { icon: "♾️", title: "Durabilité", text: "Garantie 2 ans sur la literie, jusqu'à 8 ans sur les vérins des lits coffre." },
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
    { category: "produit", question: "Quelle marque de matelas choisir ?", answer: "Cela dépend de votre position de sommeil, de votre gabarit et de votre budget. Nos modèles sont en confection européenne ; les certifications éventuelles sont indiquées sur chaque fiche. Notre quiz en une minute vous oriente selon votre morphologie." },
    { category: "produit", question: "Quelle est la meilleure taille de matelas pour un couple ?", answer: "Le 160×200 (Queen) est le meilleur compromis pour la plupart des couples. Le 180×200 (King) offre plus d'espace individuel — recommandé si l'un de vous bouge beaucoup ou pour les grandes tailles." },
    { category: "produit", question: "Combien de temps dure un matelas de qualité ?", answer: "Comptez une dizaine d'années en usage quotidien. Le repère fiable n'est pas l'âge mais l'état : un creux qui ne se reprend plus, des points d'appui marqués. Un protège-matelas et une rotation régulière aident à retarder cette usure." },
    { category: "produit", question: "Peut-on utiliser un ancien sommier ?", answer: "Techniquement oui, mais un vieux sommier avec lattes cassées ou mou dégrade rapidement un matelas neuf. Nous recommandons de renouveler les deux ensemble tous les 10 ans." },
    { category: "produit", question: "Les matelas DreamsFly sont-ils hypoallergéniques ?", answer: "Les traitements et certifications sont indiqués sur la fiche de chaque modèle — nous ne les généralisons pas. En cas d'allergie, une alèse anti-acariens reste la protection la plus efficace." },

    // ─── Livraison ─────────────────────────────────
    { category: "livraison", question: "Comment fonctionne la livraison ?", answer: "La livraison est payante : un forfait unique de 99 € en France métropolitaine, affiché au panier avant validation. Les livreurs interviennent à deux et un rendez-vous est convenu avant leur passage." },
    { category: "livraison", question: "En combien de temps serai-je livré ?", answer: "5 à 7 jours ouvrés en France métropolitaine. Un rendez-vous est convenu avant le passage des livreurs, sur un créneau matin, après-midi ou samedi selon les zones." },
    { category: "livraison", question: "Reprenez-vous mon ancien matelas ?", answer: "Demandez-le-nous au moment de la commande : nous vous confirmerons si la reprise est possible sur votre zone de livraison et à quelles conditions." },
    { category: "livraison", question: "Livrez-vous en Belgique / Suisse / DOM-TOM ?", answer: "Notre tarif de livraison en ligne couvre la France métropolitaine. Pour toute autre destination, contactez-nous : nous établirons un devis au cas par cas." },

    // ─── Paiement ──────────────────────────────────
    { category: "paiement", question: "Puis-je payer en plusieurs fois ?", answer: "Oui, en 2×, 3× ou 4× sans frais avec Alma (paiement sécurisé par carte bancaire). Sans impact sur votre crédit, réponse immédiate au checkout." },
    { category: "paiement", question: "Quels moyens de paiement acceptez-vous ?", answer: "Carte bancaire (Visa, Mastercard, Amex), Alma (paiement fractionné), Apple Pay, Google Pay, et virement bancaire pour les commandes > 2 000 €." },
    { category: "paiement", question: "Est-ce que le paiement est sécurisé ?", answer: "Oui — Stripe pour la carte bancaire, Alma pour le fractionné. Aucune donnée bancaire n'est stockée sur nos serveurs. Site en HTTPS, certifié PCI DSS niveau 1." },

    // ─── Garantie ──────────────────────────────────
    { category: "garantie", question: "Combien de temps dure la garantie ?", answer: "2 ans minimum sur tous nos produits. Certains matelas premium : 5 ans. Structure des lits : 5 ans. Vérins hydrauliques des lits coffre : 8 ans. Voir la fiche produit pour la durée exacte." },
    { category: "garantie", question: "Que couvre la garantie ?", answer: "Défauts de fabrication (couture, mousse, coutil), affaissement anormal > 3 cm en usage normal, casse de ressort. Ne couvre pas : usure normale du tissu, taches, brûlures, dégâts causés par animaux." },
    { category: "garantie", question: "Comment activer la garantie ?", answer: "Envoyez-nous une photo + description du problème par email à contact@dreamsfly.fr. Nous vous répondons sous 4 h ouvrées avec la marche à suivre — le plus souvent un simple retour + échange." },

    // ─── Entretien ─────────────────────────────────
    { category: "entretien", question: "Faut-il retourner un matelas ?", answer: "Cela dépend du modèle. Beaucoup de matelas se tournent tête-pied, mais tous ne se retournent pas sur l'autre face : un modèle à faces différenciées se dégrade si on l'inverse. Suivez l'étiquette du vôtre." },
    { category: "entretien", question: "Comment nettoyer une tache sur mon matelas ?", answer: "Tamponnez immédiatement avec un chiffon microfibre humide (jamais détrempé). Un peu de savon de Marseille pour les taches organiques. Séchez au sèche-cheveux à distance. Évitez absolument l'eau de Javel." },

    // ─── SAV & Retour ──────────────────────────────
    { category: "sav", question: "Puis-je essayer un matelas avant de l'acheter ?", answer: "Oui, en showroom : nos boutiques présentent les modèles et un conseiller vous oriente selon votre morphologie et votre position de sommeil. Pour une commande en ligne, vous disposez du droit de rétractation légal de 14 jours (article L221-18 du Code de la consommation)." },
    { category: "sav", question: "Comment vous contacter en cas de problème ?", answer: "Par email à contact@dreamsfly.fr (réponse < 4 h en semaine), par téléphone au numéro affiché en pied de page, ou directement dans l'un de nos 3 showrooms." },
    { category: "sav", question: "Puis-je annuler ma commande avant livraison ?", answer: "Oui, sans frais, tant que la commande n'a pas été expédiée. Après expédition, retour gratuit sous 14 jours conformément au droit de rétractation. La reprise à domicile est gratuite." },
    { category: "autre", question: "Avez-vous des showrooms physiques ?", answer: "Oui, 3 showrooms en France où vous pouvez tester nos matelas et lits avant achat. Voir la page Magasins pour les adresses et horaires." },
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
  title: "Ce que disent nos clients",
  subtitle: "Les retours recueillis après achat et en showroom.",
  // Note et nombre d'avis à zéro : le bloc de note globale ne s'affiche plus.
  //
  // La valeur précédente — 4,9/5 sur 1 167 avis — et le lien « Voir tous les
  // avis Google » renvoyaient vers la fiche Google de TRUST INDUSTRIE.
  // DreamsFly en est une marque, mais ces avis portent sur l'enseigne de
  // meubles, pas sur la literie DreamsFly : les afficher ici revenait à
  // s'attribuer la réputation d'une autre entité.
  //
  // À rétablir le jour où DreamsFly aura sa propre fiche : il suffira de
  // renseigner ces trois champs dans le Studio.
  averageRating: 0,
  totalReviews: 0,
  moreReviewsUrl: "",
  moreReviewsLabel: "Voir tous les avis",
  // Aucun avis par défaut — à remplir depuis Sanity avec de vrais avis
  items: [],
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
