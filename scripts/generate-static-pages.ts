/**
 * Génère 8 pages institutionnelles DreamsFly en draft.
 * - CGV, Mentions légales, Confidentialité, Cookies (légal)
 * - Qui sommes-nous (marque)
 * - Livraison, Garantie (services)
 * - FAQ (aide)
 *
 * Champs à remplir signalés par [À REMPLIR] dans le contenu.
 * publishedAt vide → reste en draft jusqu'à validation manuelle.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

function block(text: string, style: string = "normal") {
  return {
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: "s1", text, marks: [] }],
  };
}

function h2(text: string) { return block(text, "h2"); }
function h3(text: string) { return block(text, "h3"); }
function p(text: string) { return block(text, "normal"); }

function faq(question: string, answer: string) {
  return {
    _type: "faqItem",
    _key: Math.random().toString(36).slice(2, 10),
    question,
    answer,
  };
}

function callout(title: string, text: string) {
  return {
    _type: "calloutBlock",
    _key: Math.random().toString(36).slice(2, 10),
    title,
    text,
  };
}

// ───────────────────────────────────────
// 1. CGV
// ───────────────────────────────────────
const cgv = {
  _id: "staticPage-cgv",
  _type: "staticPage",
  section: "legal",
  title: "Conditions générales de vente",
  slug: { _type: "slug", current: "cgv" },
  excerpt: "Les conditions générales régissant l'achat de produits DreamsFly. Dernière mise à jour : [À REMPLIR].",
  metaTitle: "CGV — Conditions générales de vente | DreamsFly",
  metaDescription: "Conditions générales de vente DreamsFly : commande, paiement, livraison, droit de rétractation, garanties. Lecture obligatoire avant achat.",
  body: [
    p("Les présentes conditions générales de vente (CGV) régissent l'ensemble des relations contractuelles entre la société DreamsFly et toute personne physique ou morale effectuant un achat sur le site dreamsfly.fr. Toute commande implique l'adhésion sans réserve aux présentes CGV."),

    h2("Article 1 — Identité du vendeur"),
    p("[À REMPLIR : Raison sociale complète], société [À REMPLIR : SARL/SAS/etc.] au capital de [À REMPLIR] €, immatriculée au RCS de [À REMPLIR : ville] sous le numéro [À REMPLIR : SIRET], dont le siège social est situé [À REMPLIR : adresse complète]."),
    p("Numéro de TVA intracommunautaire : [À REMPLIR]"),
    p("Téléphone : 07 85 88 92 60 — Email : contact@dreamsfly.fr"),

    h2("Article 2 — Produits"),
    p("Les produits proposés à la vente sont décrits avec la plus grande exactitude possible sur le site. Les photographies n'ont pas de valeur contractuelle et peuvent présenter des variations mineures avec les produits livrés (couleur, texture). La disponibilité des produits est indiquée sur chaque fiche produit."),

    h2("Article 3 — Prix"),
    p("Les prix sont affichés en euros, toutes taxes comprises (TVA française 20 %), hors frais de livraison. DreamsFly se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix figurant au catalogue le jour de la commande sera le seul applicable à l'acheteur."),

    h2("Article 4 — Commande"),
    p("Toute commande passée sur le site implique l'acceptation pleine et entière des présentes CGV. La validation finale de la commande vaut acceptation du prix, des produits commandés, ainsi que des présentes CGV. Un email de confirmation récapitule la commande passée."),

    h2("Article 5 — Paiement"),
    p("Le règlement des achats s'effectue par carte bancaire (Visa, Mastercard, CB) via Stripe, par PayPal ou en plusieurs fois sans frais via Alma (2x, 3x ou 4x). Les transactions sont sécurisées par cryptage SSL et 3D Secure."),

    h2("Article 6 — Livraison"),
    p("La livraison s'effectue à l'adresse indiquée lors de la commande, en France métropolitaine. Frais de livraison : à partir de 39 € selon le poids et la destination. Délais indicatifs : 3 à 5 jours ouvrés. Les délais ne constituent pas un engagement ferme et ne peuvent ouvrir droit à indemnités."),

    h2("Article 7 — Droit de rétractation"),
    p("Conformément à l'article L.221-18 du Code de la consommation, l'acheteur dispose d'un délai de 14 jours à compter de la réception du produit pour exercer son droit de rétractation, sans avoir à justifier de motif. Le retour s'effectue aux frais de l'acheteur. Les produits doivent être retournés dans leur emballage d'origine, non utilisés et accompagnés d'une preuve d'achat."),
    callout("Exception légale matelas", "Les matelas déballés et utilisés ne peuvent être retournés pour raisons d'hygiène (article L.221-28 du Code de la consommation). Avant ouverture de l'emballage scellé, le droit de rétractation s'applique normalement."),

    h2("Article 8 — Garanties"),
    p("Tous les produits bénéficient de la garantie légale de conformité (article L.217-3 et suivants du Code de la consommation) et de la garantie contre les vices cachés (articles 1641 à 1648 du Code civil)."),
    p("Garantie commerciale DreamsFly : 2 ans à compter de la date de livraison, couvrant tout défaut de fabrication."),

    h2("Article 9 — Service client"),
    p("Pour toute question, réclamation ou demande de SAV : contact@dreamsfly.fr ou 07 85 88 92 60 (lundi au samedi de 9h à 19h)."),

    h2("Article 10 — Protection des données personnelles"),
    p("Les informations personnelles collectées font l'objet d'un traitement informatique. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition. Voir notre politique de confidentialité pour plus de détails."),

    h2("Article 11 — Droit applicable et litiges"),
    p("Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité. À défaut, l'acheteur peut recourir au médiateur de la consommation [À REMPLIR : nom du médiateur agréé] ou saisir les juridictions françaises compétentes."),

    h3("Dernière mise à jour"),
    p("[À REMPLIR : date]"),
  ],
};

// ───────────────────────────────────────
// 2. Mentions légales
// ───────────────────────────────────────
const mentionsLegales = {
  _id: "staticPage-mentions-legales",
  _type: "staticPage",
  section: "legal",
  title: "Mentions légales",
  slug: { _type: "slug", current: "mentions-legales" },
  excerpt: "Informations légales relatives au site dreamsfly.fr et à son éditeur.",
  metaTitle: "Mentions légales | DreamsFly",
  metaDescription: "Identité de l'éditeur, hébergeur et responsable de publication du site dreamsfly.fr.",
  body: [
    h2("Éditeur du site"),
    p("Le site dreamsfly.fr est édité par :"),
    p("[À REMPLIR : Raison sociale]"),
    p("Forme juridique : [À REMPLIR : SARL/SAS/etc.]"),
    p("Capital social : [À REMPLIR] €"),
    p("Siège social : [À REMPLIR : adresse complète]"),
    p("RCS [À REMPLIR : ville] : [À REMPLIR : numéro RCS]"),
    p("SIRET : [À REMPLIR]"),
    p("Numéro TVA intracommunautaire : [À REMPLIR]"),
    p("Téléphone : 07 85 88 92 60"),
    p("Email : contact@dreamsfly.fr"),

    h2("Directeur de la publication"),
    p("[À REMPLIR : Nom Prénom]"),

    h2("Hébergeur"),
    p("Vercel Inc."),
    p("440 N Barranca Avenue #4133, Covina, CA 91723, USA"),
    p("https://vercel.com"),

    h2("Propriété intellectuelle"),
    p("L'ensemble des éléments présents sur le site dreamsfly.fr (textes, images, photographies, logos, vidéos, illustrations, marques) est protégé par le droit d'auteur, le droit des marques et le droit à l'image. Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans autorisation expresse écrite préalable de l'éditeur, est strictement interdite."),

    h2("Crédits photo"),
    p("Photographies produits : © DreamsFly. Photographies d'ambiance et illustrations : © DreamsFly ou sous licence (Unsplash, partenaires)."),

    h2("Cookies et données personnelles"),
    p("Pour en savoir plus sur l'utilisation des cookies et le traitement de vos données personnelles, consultez notre politique de cookies et notre politique de confidentialité."),

    h3("Dernière mise à jour"),
    p("[À REMPLIR : date]"),
  ],
};

// ───────────────────────────────────────
// 3. Confidentialité
// ───────────────────────────────────────
const confidentialite = {
  _id: "staticPage-confidentialite",
  _type: "staticPage",
  section: "legal",
  title: "Politique de confidentialité",
  slug: { _type: "slug", current: "confidentialite" },
  excerpt: "Comment DreamsFly collecte, utilise et protège vos données personnelles conformément au RGPD.",
  metaTitle: "Politique de confidentialité — Protection des données | DreamsFly",
  metaDescription: "Politique RGPD DreamsFly : données collectées, finalités, durée de conservation, vos droits, contact DPO.",
  body: [
    p("La protection de vos données personnelles est une priorité pour DreamsFly. La présente politique de confidentialité décrit les modalités de collecte, d'utilisation et de protection de vos données conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi française Informatique et Libertés."),

    h2("1. Responsable du traitement"),
    p("[À REMPLIR : Raison sociale], dont le siège social est situé [À REMPLIR : adresse], est responsable du traitement des données personnelles collectées sur dreamsfly.fr."),
    p("Contact : contact@dreamsfly.fr"),

    h2("2. Données collectées"),
    p("Nous collectons les données suivantes :"),
    p("• Données d'identification : nom, prénom, adresse postale, téléphone, email"),
    p("• Données de commande : produits achetés, montant, mode de paiement"),
    p("• Données de navigation : adresse IP, pages visitées, durée des visites (via cookies)"),
    p("• Données marketing : préférences, ouvertures d'emails (avec votre consentement)"),

    h2("3. Finalités du traitement"),
    p("Vos données sont utilisées pour :"),
    p("• Traiter votre commande (livraison, facturation, SAV)"),
    p("• Vous informer sur l'évolution de votre commande"),
    p("• Vous proposer des contenus et offres personnalisés (avec consentement)"),
    p("• Améliorer notre site et nos services (statistiques anonymisées)"),
    p("• Respecter nos obligations légales (comptabilité, fiscalité)"),

    h2("4. Base légale"),
    p("Selon les finalités, le traitement de vos données repose sur :"),
    p("• L'exécution du contrat (commandes, livraisons)"),
    p("• Votre consentement (newsletter, cookies marketing)"),
    p("• Notre intérêt légitime (amélioration du service)"),
    p("• Le respect d'obligations légales (conservation des factures)"),

    h2("5. Destinataires des données"),
    p("Vos données sont accessibles uniquement aux personnels DreamsFly habilités et à nos sous-traitants techniques :"),
    p("• Stripe (paiement)"),
    p("• Alma (paiement échelonné)"),
    p("• Sanity (hébergement contenu)"),
    p("• Vercel (hébergement web)"),
    p("• Transporteurs (livraison)"),
    p("Aucune donnée n'est vendue à des tiers."),

    h2("6. Durée de conservation"),
    p("• Données de compte : durée de la relation commerciale + 3 ans"),
    p("• Factures : 10 ans (obligation légale comptable)"),
    p("• Données marketing : jusqu'à votre désabonnement"),
    p("• Cookies : 13 mois maximum"),

    h2("7. Vos droits"),
    p("Conformément au RGPD, vous disposez à tout moment des droits suivants :"),
    p("• Droit d'accès : obtenir une copie de vos données"),
    p("• Droit de rectification : corriger des données inexactes"),
    p("• Droit à l'effacement : demander la suppression de vos données"),
    p("• Droit à la limitation : restreindre l'utilisation de vos données"),
    p("• Droit à la portabilité : récupérer vos données dans un format réutilisable"),
    p("• Droit d'opposition : refuser le traitement à des fins marketing"),
    p("Pour exercer ces droits, contactez-nous à : contact@dreamsfly.fr"),
    p("Vous disposez également du droit d'introduire une réclamation auprès de la CNIL (www.cnil.fr)."),

    h2("8. Sécurité"),
    p("Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées pour assurer la sécurité de vos données : connexion HTTPS, chiffrement SSL, accès restreints, sauvegardes régulières."),

    h3("Dernière mise à jour"),
    p("[À REMPLIR : date]"),
  ],
};

// ───────────────────────────────────────
// 4. Cookies
// ───────────────────────────────────────
const cookies = {
  _id: "staticPage-cookies",
  _type: "staticPage",
  section: "legal",
  title: "Politique de cookies",
  slug: { _type: "slug", current: "cookies" },
  excerpt: "Quels cookies utilise dreamsfly.fr et comment gérer vos préférences.",
  metaTitle: "Politique de cookies | DreamsFly",
  metaDescription: "Comprendre et gérer les cookies utilisés sur dreamsfly.fr : essentiels, analytics, marketing.",
  body: [
    h2("Qu'est-ce qu'un cookie ?"),
    p("Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, tablette, mobile) lors de votre visite sur un site web. Il permet au site de mémoriser des informations sur vous (préférences, panier, identifiant…) pour faciliter vos visites suivantes."),

    h2("Quels cookies utilisons-nous ?"),

    h3("Cookies essentiels (obligatoires)"),
    p("Nécessaires au fonctionnement du site : panier, authentification, sécurité. Sans eux, le site ne fonctionne pas correctement. Ces cookies ne nécessitent pas de consentement."),

    h3("Cookies de mesure d'audience (avec consentement)"),
    p("Nous utilisons des outils de statistiques pour comprendre comment les visiteurs utilisent le site et l'améliorer. Données anonymisées dans la mesure du possible."),
    p("• Vercel Analytics : statistiques de fréquentation"),
    p("• [À REMPLIR : Google Analytics 4 ou Plausible si utilisé]"),

    h3("Cookies marketing (avec consentement)"),
    p("Pour vous proposer des publicités pertinentes sur d'autres sites :"),
    p("• [À REMPLIR : Meta Pixel si utilisé]"),
    p("• [À REMPLIR : Google Ads si utilisé]"),

    h2("Comment gérer vos cookies ?"),
    p("Lors de votre première visite, un bandeau vous permet de :"),
    p("• Accepter tous les cookies"),
    p("• Refuser tous les cookies non essentiels"),
    p("• Personnaliser vos préférences par catégorie"),
    p("Vous pouvez modifier votre choix à tout moment via le lien « Gérer mes cookies » en bas de page."),

    h3("Désactiver les cookies depuis votre navigateur"),
    p("Vous pouvez également désactiver les cookies directement depuis les paramètres de votre navigateur. Attention : cela peut altérer certaines fonctionnalités du site."),

    h2("Durée de conservation"),
    p("Cookies essentiels : durée de la session. Cookies analytics et marketing : 13 mois maximum, conformément aux recommandations CNIL."),

    h3("Dernière mise à jour"),
    p("[À REMPLIR : date]"),
  ],
};

// ───────────────────────────────────────
// 5. Qui sommes-nous (marque)
// ───────────────────────────────────────
const quiSommesNous = {
  _id: "staticPage-qui-sommes-nous",
  _type: "staticPage",
  section: "marque",
  title: "Qui sommes-nous",
  slug: { _type: "slug", current: "qui-sommes-nous" },
  excerpt: "DreamsFly : une nouvelle marque française de matelas, née d'une conviction simple — le sommeil mérite plus que des promesses marketing.",
  metaTitle: "Qui sommes-nous — L'histoire DreamsFly",
  metaDescription: "Découvrez DreamsFly : une marque française de literie premium, conçue pour offrir un sommeil profond à prix juste, sans bullshit marketing.",
  body: [
    p("[À REMPLIR : Personnalisez cette page avec votre vraie histoire — c'est la page qui crédibilise votre marque auprès des clients ET de Google.]"),

    h2("Notre histoire"),
    p("DreamsFly est née d'une frustration simple : trouver un matelas premium à un prix juste relevait souvent du parcours du combattant. Soit on payait le marketing massif des marques internationales, soit on se rabattait sur de l'entrée de gamme déguisée en haut de gamme."),
    p("Nous avons décidé de faire autrement. Confection française, matériaux nobles, prix transparent. Pas de bullshit, pas d'essai 100 nuits sur lequel on vous fait sentir coupable de retourner — juste un matelas conçu pour bien dormir, et des conseillers humains qui répondent à vos questions."),

    h2("Notre vision du sommeil"),
    p("Le sommeil n'est pas un luxe, c'est un droit. C'est sur lui que repose votre énergie, votre santé physique, votre humeur, votre productivité, votre vie de couple. Un matelas adapté change le quotidien — c'est ce que nous voulons rendre accessible."),

    callout("Nos engagements concrets", "Confection française dans nos ateliers européens · Tissus certifiés OEKO-TEX Standard 100 · Conseillers literie humains 7j/7 · 3 showrooms physiques · Garantie 2 ans"),

    h2("Une marque, un groupe"),
    p("DreamsFly fait partie du groupe [À REMPLIR : Trust Industrie], spécialiste de l'ameublement et de la literie en France depuis [À REMPLIR : année de création]. Cette appartenance nous offre une connaissance produit de plusieurs décennies, des prix maîtrisés et un service client éprouvé."),

    h2("Nos showrooms"),
    p("Nous croyons qu'on n'achète pas un matelas sans l'avoir touché. Venez tester nos modèles dans nos 3 boutiques physiques. Conseillers experts à votre écoute, sans pression de vente."),
    p("[Voir nos showrooms : /magasins]"),

    h2("Nous contacter"),
    p("Une question, un conseil, un retour ? Notre équipe répond rapidement :"),
    p("• Téléphone : 07 85 88 92 60"),
    p("• Email : contact@dreamsfly.fr"),
    p("• En boutique : 3 showrooms physiques"),
  ],
};

// ───────────────────────────────────────
// 6. Livraison (services)
// ───────────────────────────────────────
const livraison = {
  _id: "staticPage-livraison",
  _type: "staticPage",
  section: "services",
  title: "Livraison",
  slug: { _type: "slug", current: "livraison" },
  excerpt: "Tout ce qu'il faut savoir sur la livraison DreamsFly : zones, tarifs, délais, suivi de commande.",
  metaTitle: "Livraison — Tarifs et délais | DreamsFly",
  metaDescription: "Livraison DreamsFly partout en France dès 39 €. Délais 3-5 jours ouvrés. Suivi en temps réel et options spéciales (étage, déballage).",
  body: [
    h2("Où livrons-nous ?"),
    p("DreamsFly livre dans toute la France métropolitaine. Pour la Corse, les DOM-TOM ou l'international (Belgique, Luxembourg, Suisse), contactez-nous au préalable pour un devis personnalisé."),

    h2("Tarifs"),
    p("• France métropolitaine : à partir de 39 €"),
    p("• Livraison express (24-48h sur stock disponible) : +29 €"),
    p("• Livraison à l'étage ou en chambre : +49 € (sur demande)"),
    p("• Reprise de l'ancien matelas : +29 € (sur demande)"),

    h2("Délais"),
    p("• Stock disponible : expédition sous 48h ouvrées, livraison sous 3-5 jours ouvrés"),
    p("• Fabrication à la commande (modèles personnalisés) : 2 à 4 semaines"),
    p("• Express : livraison sous 24-48h ouvrées"),

    h2("Comment ça se passe ?"),
    h3("1. Confirmation de commande"),
    p("Dès validation de votre paiement, vous recevez un email récapitulatif. Notre équipe valide la commande sous 24h."),
    h3("2. Préparation"),
    p("Votre matelas est préparé et emballé dans nos ateliers ou récupéré chez nos fournisseurs partenaires."),
    h3("3. Expédition et suivi"),
    p("Un email avec votre numéro de suivi vous est envoyé. Vous pouvez suivre votre colis en temps réel."),
    h3("4. Livraison"),
    p("Le transporteur vous contacte 24h avant pour convenir d'un créneau de livraison. Comptez 1 à 2h de battement."),

    callout("Bon à savoir", "Vérifiez votre commande à la livraison ! En cas de souci visible (carton très endommagé, manquant), refusez la livraison ou émettez des réserves écrites sur le bordereau."),

    h2("Questions fréquentes sur la livraison"),
    faq(
      "Peut-on choisir l'heure de livraison ?",
      "Vous pouvez préciser une plage horaire au moment de la commande. Le transporteur vous contactera la veille pour confirmer un créneau de 2h. Pas d'horaire ferme garanti — c'est une contrainte logistique."
    ),
    faq(
      "Que se passe-t-il si je suis absent à la livraison ?",
      "Le transporteur laisse un avis de passage. Vous disposez généralement de 7 à 15 jours pour récupérer votre commande au dépôt ou organiser une nouvelle livraison. Renseignez-vous selon votre transporteur."
    ),
    faq(
      "La livraison à l'étage est-elle automatique ?",
      "Non. Par défaut, la livraison se fait au pas de votre porte (ou au pied de l'immeuble). Si vous habitez en étage et avez besoin que le matelas soit monté en chambre, prenez l'option « Livraison à l'étage » au moment de la commande."
    ),
    faq(
      "Reprenez-vous mon ancien matelas ?",
      "Oui, sur demande au moment de la commande. Service à 29 €. Votre ancien matelas doit être propre, démonté du sommier, et accessible. Il sera ensuite recyclé via la filière éco-organisme."
    ),
  ],
};

// ───────────────────────────────────────
// 7. Garantie
// ───────────────────────────────────────
const garantie = {
  _id: "staticPage-garantie",
  _type: "staticPage",
  section: "services",
  title: "Garantie",
  slug: { _type: "slug", current: "garantie" },
  excerpt: "Tous les matelas DreamsFly bénéficient d'une garantie de 2 ans contre tout défaut de fabrication.",
  metaTitle: "Garantie 2 ans — Que couvre-t-elle ? | DreamsFly",
  metaDescription: "Garantie matelas DreamsFly : 2 ans contre les défauts de fabrication. Conditions, ce qui est couvert, ce qui ne l'est pas, comment faire valoir la garantie.",
  body: [
    p("Tous les matelas DreamsFly bénéficient d'une garantie commerciale de 2 ans à compter de la date de livraison, couvrant tout défaut de fabrication. Cette garantie s'ajoute aux garanties légales obligatoires (conformité, vices cachés)."),

    h2("Ce qui est couvert"),
    p("• Affaissement anormal supérieur à 3 cm dans des conditions d'usage normales"),
    p("• Défaut de couture ou de housse (déchirure, désolidarisation)"),
    p("• Perte de soutien rapide non liée à l'usure normale"),
    p("• Défaut de fabrication des ressorts, mousses ou matériaux internes"),

    h2("Ce qui n'est PAS couvert"),
    p("• Usure normale et tassement progressif du matelas"),
    p("• Taches, salissures ou dégâts liquides"),
    p("• Dégâts liés à un mauvais entretien ou à une utilisation inappropriée"),
    p("• Modification de la fermeté ressentie (subjective)"),
    p("• Préférence personnelle après réception (motif de rétractation, pas garantie)"),

    callout("Conditions d'usage normal", "Utilisation domestique d'un adulte ou de deux adultes, sur un sommier adapté, retournement régulier la première année, housse principale propre, pas de saut au lit ni de poids exceptionnel."),

    h2("Comment faire valoir la garantie ?"),
    h3("1. Nous contacter"),
    p("Envoyez un email à contact@dreamsfly.fr avec :"),
    p("• Numéro de commande"),
    p("• Description du défaut"),
    p("• Photos (matelas entier + zoom sur le défaut)"),
    h3("2. Diagnostic"),
    p("Notre équipe technique étudie votre demande sous 5 jours ouvrés. Si le défaut est constaté, nous décidons ensemble de la suite."),
    h3("3. Réparation, remplacement ou remboursement"),
    p("Selon la nature du défaut, nous procédons à une réparation, un échange standard ou un remboursement (au prorata si la garantie n'est pas pleinement applicable)."),

    h2("Garanties légales (rappel)"),
    p("Conformément à la loi française, vous bénéficiez aussi de :"),
    p("• La garantie légale de conformité (articles L.217-3 et suivants du Code de la consommation) — 2 ans à compter de la délivrance du bien"),
    p("• La garantie des vices cachés (articles 1641 à 1648 du Code civil) — 2 ans à compter de la découverte du vice"),
    p("Ces garanties s'appliquent indépendamment de la garantie commerciale DreamsFly."),
  ],
};

// ───────────────────────────────────────
// 8. FAQ
// ───────────────────────────────────────
const faqPage = {
  _id: "staticPage-faq",
  _type: "staticPage",
  section: "aide",
  title: "Questions fréquentes",
  slug: { _type: "slug", current: "faq" },
  excerpt: "Les réponses aux questions que vous nous posez le plus souvent.",
  metaTitle: "FAQ — Questions fréquentes | DreamsFly",
  metaDescription: "Toutes les réponses aux questions sur les matelas DreamsFly : choix, livraison, garantie, retours, paiement, showrooms.",
  body: [
    h2("Avant l'achat"),
    faq("Comment choisir le bon matelas ?", "Trois critères : votre morphologie, votre position de sommeil et votre budget. Notre algorithme de recommandation vous guide en 1 minute via le quiz. Vous pouvez aussi tester nos modèles dans nos 3 showrooms ou appeler nos conseillers au 07 85 88 92 60."),
    faq("Puis-je tester un matelas avant l'achat ?", "Oui, en showroom. Nous avons 3 boutiques physiques où vous pouvez essayer tous nos modèles. Le test sur le site (essai 100 nuits) n'est pas proposé chez DreamsFly — nous préférons que vous soyez sûr avant l'achat."),
    faq("Quel matelas pour le mal de dos ?", "Privilégiez un soutien ferme avec un accueil mémoire de forme pour épouser la cambrure lombaire. Nos modèles MONACO et LAS VEGAS sont particulièrement recommandés pour ce profil. Voir notre guide /matelas-mal-de-dos."),

    h2("Commande et paiement"),
    faq("Quels modes de paiement acceptez-vous ?", "Carte bancaire (Visa, Mastercard, CB), PayPal, paiement en plusieurs fois sans frais via Alma (2x, 3x, 4x). Toutes les transactions sont sécurisées (SSL + 3D Secure)."),
    faq("Puis-je modifier ou annuler ma commande ?", "Oui, dans les 24h suivant la commande, contactez-nous au 07 85 88 92 60. Au-delà, votre commande peut déjà être expédiée."),
    faq("Quand reçois-je ma facture ?", "Automatiquement par email après confirmation du paiement. Vous pouvez aussi la retrouver dans votre espace client."),

    h2("Livraison"),
    faq("Combien coûte la livraison ?", "À partir de 39 € en France métropolitaine. Options express (+29 €), étage (+49 €), reprise ancien matelas (+29 €) disponibles."),
    faq("Quel délai pour la livraison ?", "3 à 5 jours ouvrés pour les modèles en stock. 2 à 4 semaines pour les modèles fabriqués à la commande. Express possible en 24-48h."),
    faq("Livrez-vous à l'étage ?", "Sur demande au moment de la commande (option +49 €). Sinon livraison au pas de porte ou pied d'immeuble par défaut."),

    h2("Après-vente"),
    faq("Quelle est la garantie ?", "2 ans contre tout défaut de fabrication, en plus des garanties légales (conformité, vices cachés)."),
    faq("Puis-je retourner mon matelas ?", "Le droit de rétractation de 14 jours s'applique sur les matelas dans leur emballage scellé d'origine. Une fois ouvert et utilisé, le retour n'est plus possible pour raisons d'hygiène (article L.221-28 du Code de la consommation)."),
    faq("Que faire si mon matelas a un défaut ?", "Contactez-nous à contact@dreamsfly.fr avec photos. Réponse sous 5 jours ouvrés, et selon le diagnostic : réparation, échange ou remboursement."),

    h2("Showrooms"),
    faq("Où sont vos showrooms ?", "Nous avons 3 boutiques physiques en France. Voir leurs adresses et horaires : /magasins."),
    faq("Faut-il prendre rendez-vous ?", "Non, vous pouvez venir aux horaires d'ouverture. Pour un essai approfondi avec un conseiller, le rendez-vous est recommandé."),
  ],
};

// ───────────────────────────────────────
// Écriture
// ───────────────────────────────────────
const docs = [cgv, mentionsLegales, confidentialite, cookies, quiSommesNous, livraison, garantie, faqPage];

const ndjson = docs.map((d) => JSON.stringify(d)).join("\n");
const outPath = join(process.cwd(), "data/landing-drafts/static-pages.ndjson");
writeFileSync(outPath, ndjson, "utf8");

console.log(`✓ NDJSON généré : ${outPath}`);
console.log(`  ${docs.length} pages institutionnelles en draft`);
docs.forEach((d) => console.log(`  · ${d.section.padEnd(10)} ${d.title}`));
console.log("\nImport :");
console.log("  npx sanity@latest dataset import static-pages.ndjson --dataset production --project-id qqxvd0fj --replace");
