#!/usr/bin/env node
/**
 * Crée ET publie les 10 pages institutionnelles liées depuis le footer.
 *
 *   /aide/faq                     /services/livraison
 *   /services/garantie            /services/retour
 *   /marque/qui-sommes-nous       /marque/engagements
 *   /cgv                          /mentions-legales
 *   /confidentialite              /cookies
 *
 * SÛR — utilise createIfNotExists : si une page existe déjà (avec ton
 * contenu, même en draft), son contenu N'EST PAS écrasé. Le script se
 * contente alors de renseigner publishedAt pour la rendre visible.
 *
 * Les mentions [À COMPLÉTER] signalent les informations légales que
 * seul l'éditeur peut fournir (SIRET, adresse, hébergeur…).
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj SANITY_WRITE_TOKEN=sk... \
 *     node scripts/seed-static-pages.mjs [--dry|--publish]
 */

import { createClient } from "@sanity/client";
import { randomBytes } from "node:crypto";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId) throw new Error("SANITY_PROJECT_ID manquant");
if (!token) throw new Error("SANITY_WRITE_TOKEN manquant");

const DRY = process.argv.includes("--dry");
const PUBLISH = process.argv.includes("--publish");

const client = createClient({
  projectId,
  dataset: process.env.SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const k = () => randomBytes(6).toString("hex");
const p = (text) => ({ _key: k(), _type: "block", style: "normal", markDefs: [], children: [{ _key: k(), _type: "span", text, marks: [] }] });
const h2 = (text) => ({ _key: k(), _type: "block", style: "h2", markDefs: [], children: [{ _key: k(), _type: "span", text, marks: [] }] });
const ul = (items) => items.map((text) => ({ _key: k(), _type: "block", style: "normal", listItem: "bullet", level: 1, markDefs: [], children: [{ _key: k(), _type: "span", text, marks: [] }] }));
const faq = (question, answer) => ({ _key: k(), _type: "faqItem", question, answer });
const callout = (title, text) => ({ _key: k(), _type: "calloutBlock", title, text });

const NOW = new Date().toISOString();

const PAGES = [
  // ─────────────────────────────── AIDE
  {
    section: "aide",
    slug: "faq",
    title: "Questions fréquentes",
    excerpt: "Livraison, garantie, retours, entretien — les réponses aux questions que l'on nous pose le plus souvent.",
    metaTitle: "FAQ — Questions fréquentes | DreamsFly",
    metaDescription: "Livraison, garantie, retour, entretien, showrooms : toutes les réponses sur votre commande DreamsFly.",
    body: [
      p("Vous ne trouvez pas votre réponse ? Nos conseillers répondent sous 4 heures ouvrées via le formulaire de contact."),
      h2("Commande & paiement"),
      faq("Quels moyens de paiement acceptez-vous ?", "Carte bancaire (Visa, Mastercard, CB) via Stripe, et paiement en 3× ou 4× sans frais via Alma. Toutes les transactions sont sécurisées et chiffrées."),
      faq("Puis-je modifier ma commande après validation ?", "Tant que la commande n'a pas été expédiée, oui. Contactez-nous au plus vite avec votre numéro de commande."),
      faq("Comment savoir si ma commande est bien passée ?", "Vous recevez un email de confirmation immédiatement après le paiement. Si vous ne le recevez pas sous 15 minutes, vérifiez vos spams puis contactez-nous."),
      h2("Livraison"),
      faq("Quels sont les frais de livraison ?", "Un forfait unique de 99 € pour toute la France métropolitaine, montée à l'étage incluse avec deux livreurs. Le montant s'affiche au panier avant paiement."),
      faq("En combien de temps suis-je livré ?", "5 à 7 jours ouvrés en France métropolitaine. Vous êtes contacté par SMS 48 heures avant pour convenir d'un créneau."),
      faq("Reprenez-vous mon ancien matelas ?", "Oui, gratuitement, sur simple demande au moment de la commande. Il est confié à un centre de recyclage agréé Éco-mobilier."),
      faq("Livrez-vous en Corse, en Belgique ou en Suisse ?", "Ces destinations font l'objet d'un devis spécifique. Contactez-nous avant de commander."),
      h2("Produits"),
      faq("Comment choisir la bonne fermeté ?", "Elle dépend de votre position de sommeil et de votre gabarit. Notre quiz vous oriente en 6 questions, et nos conseillers en showroom affinent le choix avec vous."),
      faq("Puis-je essayer avant d'acheter ?", "Oui, dans nos showrooms. Nous privilégions l'essai physique : quinze minutes allongé dans votre position habituelle valent mieux que cent avis en ligne."),
      faq("Vos matelas sont-ils fabriqués en France ?", "Nos matelas sont fabriqués en France et en Europe, avec des matériaux certifiés OEKO-TEX Standard 100 et CertiPUR-EU."),
      h2("Après-vente"),
      faq("Quelle est la durée de garantie ?", "2 ans sur les matelas, sommiers et oreillers. Les lits coffre bénéficient du barème fabricant : 5 ans sur la structure, 8 ans sur les vérins, 2 ans sur le tissu. La garantie exacte figure sur chaque fiche produit."),
      faq("Puis-je retourner un produit ?", "Vous disposez de 14 jours après réception pour exercer votre droit de rétractation. Voir notre page Retour & remboursement pour la procédure."),
      faq("Comment entretenir mon matelas ?", "Aérez la chambre chaque matin, tournez le matelas tête-pieds tous les trois mois la première année, aspirez la surface tous les trois mois, et utilisez un protège-matelas lavable."),
    ],
  },

  // ─────────────────────────────── SERVICES
  {
    section: "services",
    slug: "livraison",
    title: "Livraison & installation",
    excerpt: "Forfait unique de 99 € partout en France métropolitaine, montée à l'étage incluse, rendez-vous programmé.",
    metaTitle: "Livraison — 99 € partout en France | DreamsFly",
    metaDescription: "Livraison à domicile 99 € en France métropolitaine, 5 à 7 jours ouvrés, montée à l'étage incluse, reprise gratuite de l'ancien matelas.",
    body: [
      p("Un matelas ou un lit ne se livre pas comme un colis. Nos livraisons sont assurées par deux personnes, sur rendez-vous, avec montée à l'étage systématique."),
      h2("Tarif"),
      p("Un forfait unique de 99 € s'applique à toute commande livrée en France métropolitaine, quel que soit le nombre d'articles. Le montant apparaît au panier avant le paiement — aucune surprise au moment de valider."),
      callout("Corse, DOM-TOM et étranger", "Ces destinations nécessitent un devis personnalisé. Contactez-nous avant de commander, nous vous répondons sous 4 heures ouvrées."),
      h2("Délais"),
      p("Comptez 5 à 7 jours ouvrés après validation de la commande pour la France métropolitaine. Les modèles fabriqués sur mesure ou les grandes dimensions peuvent demander quelques jours supplémentaires — le délai est alors précisé lors de la commande."),
      h2("Déroulement"),
      ...ul([
        "Vous recevez un SMS 48 heures avant la livraison pour convenir d'un créneau.",
        "Créneaux disponibles le matin, l'après-midi, et le samedi selon les zones.",
        "Deux livreurs assurent la montée jusqu'à la pièce de votre choix.",
        "L'emballage est repris et recyclé à l'issue de la livraison.",
      ]),
      h2("Reprise de l'ancien matelas"),
      p("Sur simple demande au moment de la commande, nous reprenons gratuitement votre ancienne literie lors de la livraison du neuf. Elle est remise à un centre de traitement agréé Éco-mobilier, la filière française de recyclage du mobilier."),
      h2("Accès difficile"),
      p("Escalier étroit, absence d'ascenseur, étage élevé : signalez-le lors de la commande. Nos équipes adaptent le matériel et, si nécessaire, nous vous proposons une solution alternative avant l'expédition plutôt que de découvrir le problème le jour J."),
    ],
  },
  {
    section: "services",
    slug: "garantie",
    title: "Garantie",
    excerpt: "2 ans sur la literie, jusqu'à 8 ans sur les vérins des lits coffre. Ce qui est couvert, ce qui ne l'est pas, et comment la faire jouer.",
    metaTitle: "Garantie — 2 à 8 ans selon les produits | DreamsFly",
    metaDescription: "Durées de garantie DreamsFly par catégorie, éléments couverts et exclus, procédure de prise en charge.",
    body: [
      p("Toutes nos literies bénéficient de la garantie légale de conformité et de la garantie contre les vices cachés, auxquelles s'ajoute une garantie commerciale dont la durée dépend du produit."),
      h2("Durées par catégorie"),
      ...ul([
        "Matelas : 2 ans.",
        "Sommiers : 2 ans.",
        "Oreillers : 2 ans.",
        "Lits coffre : 5 ans sur la structure, 8 ans sur les vérins, 2 ans sur le tissu.",
      ]),
      h2("Ce qui est couvert"),
      ...ul([
        "Défaut de fabrication constaté en usage normal.",
        "Affaissement anormal du matelas supérieur à 3 cm hors zone de couchage habituelle.",
        "Rupture de lattes, de vérins ou de piètement en usage domestique.",
        "Défaut de couture ou de coutil non lié à l'usure.",
      ]),
      h2("Ce qui n'est pas couvert"),
      ...ul([
        "L'usure normale liée au temps et à l'usage.",
        "Les taches, brûlures, déchirures et dommages accidentels.",
        "Les dommages dus à un support inadapté (sommier trop ancien, lattes cassées, sol irrégulier).",
        "L'usage professionnel ou intensif si le produit est destiné à un usage domestique.",
        "Le non-respect des consignes d'entretien.",
      ]),
      callout("Le sommier compte", "Un matelas neuf posé sur un sommier de plus de dix ans s'abîme prématurément — et ce type de dommage n'est pas couvert. Vérifiez l'état de votre support avant de commander."),
      h2("Faire jouer la garantie"),
      p("Contactez-nous avec votre numéro de commande, des photos du défaut et une description de la situation. Nous répondons sous 4 heures ouvrées et vous indiquons la marche à suivre : intervention, échange ou remboursement selon le cas."),
    ],
  },
  {
    section: "services",
    slug: "retour",
    title: "Retour & remboursement",
    excerpt: "14 jours pour changer d'avis, conformément au droit de rétractation. La procédure, les conditions et les délais.",
    metaTitle: "Retour & remboursement — 14 jours | DreamsFly",
    metaDescription: "Droit de rétractation de 14 jours, conditions de retour, procédure et délais de remboursement chez DreamsFly.",
    body: [
      p("Conformément aux articles L221-18 et suivants du Code de la consommation, vous disposez de quatorze jours à compter de la réception pour exercer votre droit de rétractation, sans avoir à motiver votre décision."),
      h2("Délai"),
      p("Le délai de quatorze jours court à partir du jour de réception du dernier article de votre commande. Si ce délai expire un samedi, un dimanche ou un jour férié, il est prolongé jusqu'au premier jour ouvrable suivant."),
      h2("Conditions du retour"),
      ...ul([
        "Le produit doit être dans un état permettant sa revente : propre, sans tache, sans odeur ni dommage.",
        "L'emballage d'origine est fortement recommandé pour protéger le produit pendant le transport.",
        "Les protections hygiéniques scellées (oreillers, protège-matelas) ne peuvent être reprises si le scellé a été ouvert, pour des raisons de santé et d'hygiène.",
        "Les produits personnalisés ou fabriqués sur mesure sont exclus du droit de rétractation.",
      ]),
      h2("Procédure"),
      ...ul([
        "Écrivez-nous depuis le formulaire de contact avec votre numéro de commande et les articles concernés.",
        "Nous vous confirmons la prise en compte sous 4 heures ouvrées et organisons l'enlèvement.",
        "L'enlèvement à domicile est planifié avec vous — vous n'avez pas à transporter le produit.",
        "À réception et après contrôle de l'état, le remboursement est déclenché.",
      ]),
      h2("Remboursement"),
      p("Le remboursement intervient dans un délai maximal de quatorze jours après récupération du produit, sur le moyen de paiement utilisé lors de la commande. Il porte sur le prix des articles retournés ainsi que sur les frais de livraison standard initialement facturés."),
      callout("Produit défectueux", "Si le retour fait suite à un défaut de fabrication ou à une erreur de notre part, aucun frais n'est à votre charge et le traitement est prioritaire. Voir aussi notre page Garantie."),
      h2("Échange"),
      p("Vous préférez un autre modèle plutôt qu'un remboursement ? Dites-le nous lors de votre demande : nous organisons l'échange en une seule intervention, reprise et livraison le même jour lorsque c'est possible."),
    ],
  },

  // ─────────────────────────────── MARQUE
  {
    section: "marque",
    slug: "qui-sommes-nous",
    title: "Qui sommes-nous",
    excerpt: "Une maison française de literie, née de la conviction qu'un bon matelas ne devrait pas être un pari.",
    metaTitle: "Qui sommes-nous — Maison française de literie | DreamsFly",
    metaDescription: "DreamsFly conçoit et distribue une literie premium fabriquée en France et en Europe, testable en showroom.",
    body: [
      p("DreamsFly est né d'un constat simple : acheter un matelas est devenu un exercice de confiance aveugle. Des fiches produit qui se ressemblent toutes, des promesses invérifiables, et au bout du compte un choix fait au hasard pour un objet que l'on gardera dix ans."),
      h2("Notre approche"),
      p("Nous avons décidé de faire autrement. Une sélection resserrée plutôt qu'un catalogue pléthorique : moins de trois pour cent des modèles que nous testons entrent dans notre gamme. Des informations techniques réelles — densités, certifications, composition couche par couche — plutôt que du vocabulaire marketing."),
      p("Et surtout, des magasins physiques. Parce qu'on n'achète pas un matelas sans s'être allongé dessus. Nos conseillers ne sont pas commissionnés à la vente : leur travail est de vous orienter vers le modèle qui vous convient, y compris si c'est le moins cher."),
      h2("La fabrication"),
      p("Nos produits sont fabriqués en France et en Europe. Nous travaillons avec des ateliers que nous visitons, sur des matériaux traçables et certifiés — OEKO-TEX Standard 100 pour l'absence de substances nocives, CertiPUR-EU pour les mousses, GOTS pour le coton biologique, PEFC pour le bois."),
      h2("Le nom des modèles"),
      p("Chaque matelas porte le nom d'une ville : Milan, Berlin, Londres, Barcelone, Singapour, Sydney. Une façon de rappeler que le sommeil est un voyage quotidien — et de donner à chaque modèle une identité qu'on retient, plutôt qu'une référence à rallonge."),
      h2("Nous rencontrer"),
      p("Le meilleur moyen de nous connaître reste de pousser la porte d'un de nos showrooms. Essai libre, sans rendez-vous obligatoire, sans pression commerciale."),
    ],
  },
  {
    section: "marque",
    slug: "engagements",
    title: "Nos engagements",
    excerpt: "Matériaux certifiés, fabrication européenne, transparence sur les prix et recyclage de l'ancienne literie.",
    metaTitle: "Nos engagements — Certifications & fabrication | DreamsFly",
    metaDescription: "Certifications OEKO-TEX, CertiPUR-EU, GOTS et PEFC, fabrication française et européenne, recyclage Éco-mobilier.",
    body: [
      p("Un engagement n'a de valeur que s'il est vérifiable. Voici les nôtres, avec les certifications et les preuves qui les accompagnent."),
      h2("Des matériaux certifiés"),
      ...ul([
        "OEKO-TEX Standard 100 — garantit l'absence de substances nocives dans les textiles en contact avec la peau.",
        "CertiPUR-EU — mousses produites sans métaux lourds, sans formaldéhyde et à faible émission de composés organiques volatils.",
        "GOTS — coton biologique certifié pour les coutils qui en sont équipés.",
        "PEFC — bois issu de forêts gérées durablement pour les structures et sommiers.",
      ]),
      h2("Une fabrication européenne"),
      p("Nos produits sont fabriqués en France et en Europe. Ce choix limite l'empreinte carbone du transport, garantit le respect du droit du travail européen, et nous permet de visiter les ateliers avec lesquels nous travaillons."),
      h2("La transparence sur les prix"),
      p("Le prix affiché en ligne est le prix pratiqué en showroom, promotions comprises. Les frais de livraison sont annoncés clairement — un forfait unique de 99 € en France métropolitaine — et apparaissent au panier avant tout paiement."),
      h2("Le recyclage de l'ancienne literie"),
      p("Nous reprenons gratuitement votre ancien matelas lors de la livraison, sur simple demande. Il est confié à la filière Éco-mobilier, qui assure le démantèlement et la valorisation des matériaux plutôt que l'enfouissement."),
      h2("Le conseil avant la vente"),
      p("Nos conseillers ne sont pas rémunérés à la commission. Leur rôle est de vous orienter vers le produit adapté à votre morphologie et à votre budget — y compris quand ce n'est pas le plus cher, et y compris quand la réponse est que votre matelas actuel n'a pas besoin d'être remplacé."),
      callout("Ce que nous ne promettons pas", "Nous ne proposons pas d'essai à domicile de plusieurs semaines. Nous préférons que vous essayiez en magasin avant d'acheter, plutôt que d'organiser des retours coûteux en transport et en ressources."),
    ],
  },

  // ─────────────────────────────── LÉGAL
  {
    section: "legal",
    slug: "mentions-legales",
    title: "Mentions légales",
    excerpt: "Informations légales relatives à l'éditeur et à l'hébergeur du site dreamsfly.fr.",
    metaTitle: "Mentions légales | DreamsFly",
    metaDescription: "Éditeur, hébergeur et informations légales du site dreamsfly.fr.",
    noindex: true,
    body: [
      h2("Éditeur du site"),
      p("Raison sociale : [À COMPLÉTER]"),
      p("Forme juridique et capital social : [À COMPLÉTER]"),
      p("Siège social : [À COMPLÉTER]"),
      p("RCS / SIRET : [À COMPLÉTER]"),
      p("Numéro de TVA intracommunautaire : [À COMPLÉTER]"),
      p("Directeur de la publication : [À COMPLÉTER]"),
      p("Email : contact@dreamsfly.fr"),
      h2("Hébergeur"),
      p("Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com"),
      h2("Propriété intellectuelle"),
      p("L'ensemble des contenus présents sur ce site (textes, photographies, illustrations, logos, éléments graphiques) est protégé par le droit d'auteur. Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable est interdite."),
      h2("Médiation de la consommation"),
      p("Conformément à l'article L612-1 du Code de la consommation, tout consommateur peut recourir gratuitement à un médiateur en vue de la résolution amiable d'un litige. Médiateur désigné : [À COMPLÉTER — nom et coordonnées du médiateur]."),
      h2("Plateforme européenne de règlement des litiges"),
      p("La Commission européenne met à disposition une plateforme de règlement en ligne des litiges accessible à l'adresse ec.europa.eu/consumers/odr."),
    ],
  },
  {
    section: "legal",
    slug: "cgv",
    title: "Conditions générales de vente",
    excerpt: "Conditions applicables à toute commande passée sur dreamsfly.fr.",
    metaTitle: "Conditions générales de vente | DreamsFly",
    metaDescription: "CGV DreamsFly : commande, prix, paiement, livraison, rétractation, garanties et litiges.",
    noindex: true,
    body: [
      p("Les présentes conditions générales régissent les ventes conclues sur le site dreamsfly.fr entre l'éditeur du site et tout client consommateur. Toute commande implique leur acceptation sans réserve."),
      h2("Article 1 — Produits"),
      p("Les produits proposés sont ceux figurant sur le site au jour de la consultation, dans la limite des stocks disponibles. Les photographies et descriptifs sont les plus fidèles possibles mais ne peuvent garantir une similitude parfaite, notamment concernant les couleurs."),
      h2("Article 2 — Prix"),
      p("Les prix sont indiqués en euros toutes taxes comprises, hors frais de livraison. Les frais de livraison, d'un montant forfaitaire de 99 € pour la France métropolitaine, sont indiqués avant validation de la commande. L'éditeur se réserve le droit de modifier ses prix à tout moment, étant entendu que le prix applicable est celui en vigueur au moment de la commande."),
      h2("Article 3 — Commande"),
      p("Le client valide sa commande après avoir vérifié le détail de son panier et le montant total. Cette validation vaut acceptation des présentes conditions. Un email de confirmation récapitulant la commande est adressé au client."),
      h2("Article 4 — Paiement"),
      p("Le paiement s'effectue par carte bancaire via la plateforme sécurisée Stripe, ou en trois ou quatre fois sans frais via Alma. Les données bancaires ne transitent jamais par les serveurs de l'éditeur. La commande est traitée après confirmation du paiement."),
      h2("Article 5 — Livraison"),
      p("Les livraisons sont effectuées en France métropolitaine sous 5 à 7 jours ouvrés, sur rendez-vous convenu avec le client. La montée à l'étage est incluse. Les autres destinations font l'objet d'un devis préalable."),
      h2("Article 6 — Droit de rétractation"),
      p("Conformément aux articles L221-18 et suivants du Code de la consommation, le client dispose de quatorze jours à compter de la réception pour exercer son droit de rétractation, sans motif. Les produits personnalisés ou fabriqués sur mesure, ainsi que les articles descellés ne pouvant être renvoyés pour des raisons d'hygiène, sont exclus de ce droit."),
      h2("Article 7 — Garanties"),
      p("Tous les produits bénéficient de la garantie légale de conformité (articles L217-4 et suivants du Code de la consommation) et de la garantie contre les vices cachés (articles 1641 et suivants du Code civil). Une garantie commerciale de 2 à 8 ans selon les produits s'y ajoute, dans les conditions détaillées sur la page Garantie."),
      h2("Article 8 — Responsabilité"),
      p("L'éditeur ne saurait être tenu responsable des dommages résultant d'une mauvaise utilisation du produit, du non-respect des consignes d'entretien, ou de l'usage d'un support inadapté."),
      h2("Article 9 — Données personnelles"),
      p("Les données collectées sont traitées conformément à notre politique de confidentialité, accessible depuis le pied de page du site."),
      h2("Article 10 — Droit applicable et litiges"),
      p("Les présentes conditions sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité, le cas échéant par recours au médiateur de la consommation indiqué dans les mentions légales."),
    ],
  },
  {
    section: "legal",
    slug: "confidentialite",
    title: "Politique de confidentialité",
    excerpt: "Quelles données nous collectons, pourquoi, combien de temps, et comment exercer vos droits.",
    metaTitle: "Politique de confidentialité | DreamsFly",
    metaDescription: "Traitement des données personnelles, finalités, durées de conservation et droits RGPD sur dreamsfly.fr.",
    noindex: true,
    body: [
      p("Cette politique décrit la manière dont les données personnelles des visiteurs et clients du site dreamsfly.fr sont collectées et traitées, conformément au Règlement général sur la protection des données (RGPD)."),
      h2("Responsable du traitement"),
      p("Le responsable du traitement est l'éditeur du site, dont les coordonnées figurent dans les mentions légales. Pour toute question relative à vos données : contact@dreamsfly.fr"),
      h2("Données collectées et finalités"),
      ...ul([
        "Commande : nom, adresse de livraison et de facturation, email, téléphone — nécessaires à l'exécution du contrat de vente.",
        "Formulaire de contact : nom, email, téléphone facultatif, contenu du message — pour répondre à votre demande.",
        "Newsletter : adresse email — sur la base de votre consentement, révocable à tout moment.",
        "Navigation : données techniques strictement nécessaires au fonctionnement du site (panier, sécurité).",
      ]),
      h2("Base légale"),
      p("Les traitements reposent selon les cas sur l'exécution du contrat (commande, livraison), sur le consentement (newsletter, cookies de mesure d'audience), ou sur l'intérêt légitime (sécurité du site, prévention de la fraude)."),
      h2("Durées de conservation"),
      ...ul([
        "Données de commande : conservées le temps de la relation commerciale puis archivées selon les obligations comptables et fiscales (dix ans).",
        "Messages de contact : trois ans à compter du dernier échange.",
        "Newsletter : jusqu'à votre désinscription, puis suppression sous trente jours.",
        "Préférences de cookies : six mois, puis nouveau recueil du consentement.",
      ]),
      h2("Destinataires"),
      p("Vos données ne sont jamais vendues. Elles peuvent être transmises à nos sous-traitants strictement pour l'exécution du service : Stripe et Alma pour le paiement, Brevo pour l'envoi des emails, Vercel pour l'hébergement, Sanity pour la gestion des contenus, ainsi qu'à nos transporteurs pour la livraison."),
      h2("Vos droits"),
      p("Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données. Pour les exercer, écrivez à contact@dreamsfly.fr. Une réponse vous est apportée dans un délai maximal d'un mois."),
      p("En cas de désaccord persistant, vous pouvez introduire une réclamation auprès de la Commission nationale de l'informatique et des libertés (CNIL), 3 place de Fontenoy, 75007 Paris — cnil.fr"),
    ],
  },
  {
    section: "legal",
    slug: "cookies",
    title: "Gestion des cookies",
    excerpt: "Les cookies utilisés sur le site, leur finalité, et comment modifier vos préférences à tout moment.",
    metaTitle: "Gestion des cookies | DreamsFly",
    metaDescription: "Cookies utilisés sur dreamsfly.fr, finalités, durées et modification de vos préférences.",
    noindex: true,
    body: [
      p("Un cookie est un petit fichier déposé sur votre terminal lors de la visite d'un site. Nous limitons leur usage au strict nécessaire, et aucun cookie de mesure d'audience ou publicitaire n'est déposé sans votre consentement préalable."),
      h2("Cookies strictement nécessaires"),
      p("Ces cookies sont indispensables au fonctionnement du site et ne requièrent pas de consentement. Ils permettent de conserver le contenu de votre panier entre deux pages, de sécuriser la session de paiement, et de mémoriser vos préférences en matière de cookies."),
      h2("Cookies de mesure d'audience"),
      p("Ils permettraient de comprendre comment le site est utilisé afin de l'améliorer. Ils ne sont activés qu'après votre acceptation explicite via le bandeau de consentement, et peuvent être refusés sans conséquence sur votre navigation."),
      h2("Modifier vos préférences"),
      p("Vous pouvez à tout moment revenir sur votre choix en cliquant sur « Gérer les cookies » en pied de page. Votre décision est conservée six mois, puis vous est redemandée."),
      h2("Paramétrer votre navigateur"),
      p("Vous pouvez également configurer votre navigateur pour refuser tout ou partie des cookies. Attention : le blocage des cookies strictement nécessaires peut empêcher le bon fonctionnement du panier et du paiement."),
    ],
  },
];

async function upsert(page) {
  const docId = `staticPage-${page.section}-${page.slug}`;
  const existing = await client.getDocument(docId).catch(() => null);

  if (DRY) {
    console.log(
      existing
        ? `  🌵 [dry] ${docId} — existe déjà${existing.publishedAt ? " (publiée)" : " → serait publiée"}`
        : `  🌵 [dry] ${docId} — serait créée (${page.body.length} blocs)`,
    );
    return;
  }

  // createIfNotExists : ne touche pas au contenu d'une page déjà présente
  await client.createIfNotExists({
    _id: docId,
    _type: "staticPage",
    section: page.section,
    slug: { _type: "slug", current: page.slug },
    title: page.title,
    excerpt: page.excerpt,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    ...(page.noindex ? { noindex: true } : {}),
    body: page.body,
  });

  if (PUBLISH) {
    // setIfMissing : ne réécrit pas une date de publication existante
    await client.patch(docId).setIfMissing({ publishedAt: NOW }).commit();
    console.log(`  ✅ ${docId} — ${existing ? "déjà présente," : "créée,"} publiée`);
  } else {
    console.log(`  ✅ ${docId} — ${existing ? "déjà présente" : "créée"} (draft, ajoute --publish pour publier)`);
  }
}

async function main() {
  console.log(`\n📄 Pages institutionnelles — mode ${DRY ? "DRY" : PUBLISH ? "CRÉATION + PUBLICATION" : "CRÉATION (draft)"}\n`);
  console.log(`   Projet : ${projectId}\n`);
  for (const page of PAGES) {
    await upsert(page);
  }
  console.log(`\n➡️  À compléter ensuite dans Studio → 📄 Pages statiques :`);
  console.log(`   · Mentions légales : raison sociale, SIRET, TVA, siège, médiateur`);
  console.log(`   · Vérifier les CGV avec un juriste avant l'ouverture des ventes\n`);
}

main().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
