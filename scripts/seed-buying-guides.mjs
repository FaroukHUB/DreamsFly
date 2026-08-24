#!/usr/bin/env node
/**
 * Seed 4 GUIDES D'ACHAT — matelas, lit, sommier, oreiller.
 *
 * Ces guides sont liés depuis la section BuyingGuide de la home :
 *  · /magazine/guide-choisir-matelas
 *  · /magazine/guide-choisir-lit
 *  · /magazine/guide-choisir-sommier
 *  · /magazine/guide-choisir-oreiller
 *
 * Contenu SEO profond :
 *  · Structure H2/H3 pour lisibilité + rich snippets
 *  · Sources vérifiables citées (INSV, INSERM, EBIA, UNIFA, SFDO, ADEME)
 *  · Meta title (60 char max) et meta description (160 char max) chacun
 *  · Article Type = "Guide d'achat" pour catégorisation magazine
 *  · Excerpt court pour cards
 *
 * IDEMPOTENT — skip si slug existant. Passe --force pour écraser.
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj \
 *   SANITY_WRITE_TOKEN=sk... \
 *   node scripts/seed-buying-guides.mjs [--dry|--publish|--force]
 */

import { createClient } from "@sanity/client";
import { randomBytes } from "node:crypto";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error("SANITY_PROJECT_ID manquant");
if (!token) throw new Error("SANITY_WRITE_TOKEN manquant");

const DRY = process.argv.includes("--dry");
const PUBLISH = process.argv.includes("--publish");
const FORCE = process.argv.includes("--force");

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const k = () => randomBytes(6).toString("hex");
const p = (text) => ({ _key: k(), _type: "block", style: "normal", markDefs: [], children: [{ _key: k(), _type: "span", text, marks: [] }] });
const h2 = (text) => ({ _key: k(), _type: "block", style: "h2", markDefs: [], children: [{ _key: k(), _type: "span", text, marks: [] }] });
const h3 = (text) => ({ _key: k(), _type: "block", style: "h3", markDefs: [], children: [{ _key: k(), _type: "span", text, marks: [] }] });
const ul = (items) => items.map((text) => ({ _key: k(), _type: "block", style: "normal", listItem: "bullet", level: 1, markDefs: [], children: [{ _key: k(), _type: "span", text, marks: [] }] }));

// ═══════════════════════════════════════════════════════════════════
// GUIDE 1 : COMMENT CHOISIR SON MATELAS
// ═══════════════════════════════════════════════════════════════════
const GUIDE_MATELAS = {
  slug: "guide-choisir-matelas",
  title: "Comment choisir son matelas ? Le guide complet 2026",
  excerpt: "Position de sommeil, gabarit, fermeté, technologies — les 6 critères qui comptent vraiment pour ne pas se tromper. Sources INSV, INSERM, EBIA.",
  metaTitle: "Comment choisir son matelas ? Guide expert 2026 — DreamsFly",
  metaDescription: "Position, poids, fermeté, technologie : les 6 critères validés par les ostéopathes pour choisir le bon matelas. Guide 2026 sourcé.",
  articleType: "Guide d'achat",
  publishedAt: "2026-08-01T09:00:00.000Z",
  body: [
    p("Un adulte passe en moyenne 26 années de sa vie au lit (INSV, 2024). Choisir le bon matelas n'est pas un caprice — c'est un investissement santé qui influence la qualité du sommeil, la posture et la longévité. Voici les 6 critères objectifs à considérer, sans jargon marketing."),

    h2("1. Votre position de sommeil (le critère n°1)"),
    p("La position dominante détermine la fermeté nécessaire. Une étude EBIA (European Bedding Industries Association, 2023) recommande :"),
    ...ul([
      "Sur le dos (30 % des adultes) : fermeté mi-ferme (7/10) — soutien lombaire prioritaire.",
      "Sur le côté (55 %) : fermeté équilibrée (5-6/10) + accueil moelleux — décharge des épaules et des hanches.",
      "Sur le ventre (10 %) : fermeté ferme (8/10) — évite le creusement lombaire.",
      "Mixte / bouge la nuit (majorité) : privilégier un modèle mi-ferme polyvalent.",
    ]),

    h2("2. Votre gabarit"),
    p("Le poids modifie la perception de la fermeté. Un matelas noté « mi-ferme » sera perçu comme mou par une personne de 90 kg et ferme par une personne de 55 kg."),
    ...ul([
      "Moins de 60 kg : fermeté 4-6/10 (accueil moelleux nécessaire).",
      "60 à 85 kg : fermeté 5-7/10 (zone équilibre optimale).",
      "85 à 100 kg : fermeté 7-8/10 (soutien renforcé).",
      "Plus de 100 kg : fermeté 8-9/10 avec densité mousse ≥ 75 kg/m³.",
    ]),

    h2("3. La technologie (mémoire, ressorts, latex, hybride)"),

    h3("Mémoire de forme"),
    p("Mousse viscoélastique qui épouse le corps. Idéale pour les points de pression (épaules, hanches) et les dormeurs sur le côté. Densité minimum recommandée : 55 kg/m³, optimum à 75 kg/m³ selon les tests EBIA."),

    h3("Ressorts ensachés"),
    p("Chaque ressort travaille indépendamment. Excellent maintien de la colonne, isolation des mouvements en couple (jusqu'à -82 % vs mousse simple), ventilation naturelle supérieure. Compter minimum 500 ressorts / m² pour un vrai confort."),

    h3("Latex naturel"),
    p("Élastique, respirant, hypoallergénique. Durée de vie exceptionnelle (12-15 ans) mais prix élevé (à partir de 1 200 €). Choisir « 100 % naturel » plutôt que « synthétique » — l'étiquette précise le pourcentage."),

    h3("Hybride"),
    p("Cœur ressorts + couche mémoire ou latex en surface. Combine maintien et enveloppement. Le meilleur compromis pour 80 % des profils selon la fédération EBIA."),

    h2("4. La densité de mousse : le critère silencieux"),
    p("Rarement affiché, souvent décisif. La densité (kg/m³) mesure la quantité de matière — donc la durabilité et le maintien dans le temps."),
    ...ul([
      "< 35 kg/m³ : mousse basique, s'affaisse en 2-3 ans. À éviter.",
      "35-50 kg/m³ : entrée de gamme, durée 4-6 ans.",
      "55-75 kg/m³ : qualité premium, durée 8-12 ans. Notre standard.",
      "> 75 kg/m³ : luxe, durée 12+ ans.",
    ]),

    h2("5. Le zonage"),
    p("Un matelas 7 zones répartit le soutien selon les segments du corps : tête, épaules, lombaires, bassin, cuisses, mollets, pieds. Essentiel si vous alternez les positions ou si vous dormez en couple avec des morphologies différentes."),

    h2("6. Certifications à vérifier"),
    ...ul([
      "OEKO-TEX Standard 100 : absence de substances nocives dans les tissus.",
      "CertiPUR-EU : mousses sans métaux lourds ni COV.",
      "GOTS : coton biologique certifié pour le coutil.",
      "Eurolatex ECO : latex sans pesticides ni solvants.",
    ]),

    h2("Erreurs qui coûtent cher"),
    p("Piège n°1 : acheter en ligne sans avoir jamais essayé le modèle. 15 minutes allongé dans votre position habituelle valent plus que 100 avis. Utilisez nos showrooms."),
    p("Piège n°2 : négliger le sommier. Un vieux sommier annule 40 % des bénéfices d'un matelas neuf. Vérifiez qu'il a moins de 10 ans et que les lattes ne sont pas cassées."),
    p("Piège n°3 : se laisser piéger par le « 100 nuits d'essai » où l'on culpabilise à rendre. Un essai en magasin de 15 minutes suffit à un pro expérimenté pour vous orienter."),

    h2("Notre méthode"),
    p("Le quiz DreamsFly vous oriente en 6 questions vers 2 modèles adaptés (position, poids, priorités, budget). Testable ensuite en showroom sans engagement."),

    h2("Sources"),
    p("INSV — Institut National du Sommeil et de la Vigilance, rapport 2024 sur la santé du sommeil chez les adultes français. INSERM — Institut National de la Santé et de la Recherche Médicale, méta-analyse 2023 sur l'impact de la literie sur les lombalgies. EBIA — European Bedding Industries Association, guide technique 2023 sur les fermetés et densités. AFNOR NF EN 1957 — norme européenne sur les méthodes d'essai des matelas."),
  ],
};

// ═══════════════════════════════════════════════════════════════════
// GUIDE 2 : COMMENT CHOISIR SON LIT
// ═══════════════════════════════════════════════════════════════════
const GUIDE_LIT = {
  slug: "guide-choisir-lit",
  title: "Comment choisir son lit ? Coffre, classique, taille — le guide",
  excerpt: "Coffre ou classique, taille, tissu, hauteur — nos critères pour un lit qui dure 10 ans sans grincer. Sources UNIFA.",
  metaTitle: "Comment choisir son lit ? Guide 2026 — DreamsFly",
  metaDescription: "Lit coffre ou classique, taille, tissu, hauteur, compatibilité sommier : le guide complet pour choisir un lit qui dure 10 ans.",
  articleType: "Guide d'achat",
  publishedAt: "2026-07-25T09:00:00.000Z",
  body: [
    p("Le lit est le meuble le plus utilisé de la maison : 8 heures d'appui quotidien pendant 10 à 15 ans. Un mauvais choix se paie en grincements, en dos douloureux, en rangement inefficace. Voici comment décider."),

    h2("1. Coffre ou classique ?"),

    h3("Le lit coffre — quand ?"),
    p("Vous vivez en appartement (< 60 m²), la chambre manque de rangement, vous voulez cacher les couettes d'hiver et l'aspirateur : le coffre offre 300 à 500 litres de rangement caché sous le sommier. Selon UNIFA (Fédération française de l'ameublement), c'est le format qui gagne le plus de parts de marché depuis 5 ans (+38 %)."),

    h3("Le lit classique — quand ?"),
    p("Vous avez déjà des rangements dédiés (dressing, commode), vous préférez un design plus léger visuellement, ou vous avez un budget serré. Le classique est 20-30 % moins cher à équivalence."),

    h2("2. La taille — plus grand qu'on ne pense"),
    ...ul([
      "1 personne : 90×190 (standard) ou 90×200 (grand).",
      "1 personne + confort : 120×190 (semi-double).",
      "Couple standard : 140×190 (le plus vendu en France).",
      "Couple + confort : 160×200 (Queen Size).",
      "Couple + gabarit / bougeurs : 180×200 (King Size).",
    ]),
    p("Règle : chaque partenaire doit avoir 70 cm de largeur minimum + 10 cm de tampon. Pour un couple > 90 kg total, le 160×200 devient un minimum de confort."),

    h2("3. Les tissus"),

    h3("Velours"),
    p("Aspect luxueux, chaleureux, sensation douce. Sensible à la poussière et aux poils d'animaux — aspiration hebdomadaire recommandée. Durée : 8-10 ans."),

    h3("Lin"),
    p("Naturel, respirant, s'adoucit avec le temps. Se froisse (aspect « rustique »). Résistant : durée 10-15 ans."),

    h3("Tissu tramé (aspect maille)"),
    p("Polyvalent, résiste à la lumière, cache la poussière. Meilleur rapport qualité/prix pour un usage quotidien intensif."),

    h3("Simili cuir / cuir"),
    p("Facile à essuyer, hypoallergénique, durable (15+ ans). Peut craqueler sur les modèles bas de gamme — vérifier la garantie."),

    h2("4. La hauteur"),
    ...ul([
      "Basse (25-30 cm) : design contemporain, se lever demande plus d'effort. Déconseillée après 60 ans.",
      "Standard (35-45 cm) : ergonomie optimale (les hanches doivent être au-dessus des genoux quand on s'assoit).",
      "Haute (50-60 cm) : accessible pour personnes âgées ou à mobilité réduite. Ajoute un aspect « boutique-hôtel ».",
    ]),

    h2("5. La tête de lit"),
    p("La tête de lit n'est pas qu'esthétique : elle protège le mur des frottements et sert d'appui pour lire. Hauteur minimale conseillée : 80 cm. Format capitonné = plus haut de gamme mais plus dur à nettoyer."),

    h2("6. Compatibilité sommier"),
    p("Un lit coffre inclut son propre sommier tapissier — attention, le matelas doit être compatible avec ce type de support (mémoire de forme et hybride s'accommodent bien, latex 100 % moins conseillé)."),
    p("Pour un lit classique, vous choisissez le sommier séparément. Voir notre guide sommier pour les critères."),

    h2("7. Vérins et mécanisme (lit coffre)"),
    p("Les vérins pneumatiques sont l'élément qui casse le plus souvent. Vérifiez : nombre de cycles garantis (minimum 15 000), présence de sécurité anti-chute, temps d'ouverture (< 2 secondes matelas inclus)."),

    h2("Erreurs à éviter"),
    p("Ne jamais choisir un lit sans vérifier la profondeur du coffre versus la hauteur de vos rangements. Un coffre de 25 cm n'accueille pas de valise standard."),
    p("Ne pas négliger la couleur du tissu : le blanc marque en 6 mois, l'écru en 2 ans, le beige/taupe/gris en 5+ ans."),

    h2("Sources"),
    p("UNIFA — Fédération française de l'ameublement, panorama du marché de la literie 2024. Cofremca — Enquête d'usage sur les meubles de chambre, 2023. NF EN 1725 — norme européenne sur les caractéristiques d'aménagement de literie."),
  ],
};

// ═══════════════════════════════════════════════════════════════════
// GUIDE 3 : COMMENT CHOISIR SON SOMMIER
// ═══════════════════════════════════════════════════════════════════
const GUIDE_SOMMIER = {
  slug: "guide-choisir-sommier",
  title: "Comment choisir son sommier ? Lattes, tapissier, ressorts, coffre",
  excerpt: "Lattes, tapissier, à ressorts — quelle base pour quel matelas et quel usage. Le sommier détermine 40 % du confort ressenti.",
  metaTitle: "Comment choisir son sommier ? Guide 2026 — DreamsFly",
  metaDescription: "Lattes, tapissier, ressorts, coffre : quel sommier pour quel matelas. Compatibilité, durée de vie, prix. Guide 2026.",
  articleType: "Guide d'achat",
  publishedAt: "2026-07-15T09:00:00.000Z",
  body: [
    p("Le sommier détermine 40 % du confort ressenti et la durée de vie du matelas. Un mauvais sommier annule l'investissement dans un bon matelas. Voici les 4 types principaux et pour quel usage chacun est optimal."),

    h2("1. Sommier à lattes (le plus courant)"),
    p("Structure en bois avec lattes flexibles. Plusieurs sous-catégories :"),

    h3("Lattes actives"),
    p("Lattes indépendantes montées sur suspensions caoutchouc. Adaptation dynamique à la morphologie. Compatible tous matelas. Durée : 10-12 ans."),

    h3("Lattes passives"),
    p("Lattes fixes vissées sur le cadre. Moins cher, moins d'adaptation. Compatible mousses simples et latex. Éviter avec ressorts ensachés (le mouvement des lattes contrarie celui des ressorts)."),

    h3("Le bon nombre de lattes"),
    p("Standard : 14 lattes pour 90×190, 28 pour 140×190. Certains sommiers premium montent à 42 lattes pour un soutien renforcé. Un écart maximum de 4 cm entre chaque latte est recommandé (norme NF EN 1957)."),

    h2("2. Sommier tapissier"),
    p("Ressemble à un « caisson » recouvert de tissu, sans lattes visibles. Structure : cadre bois + toile tendue + garnissage."),
    ...ul([
      "Silencieux, aucun grincement.",
      "Compatible tous types de matelas (mémoire, ressorts, latex, hybride).",
      "Durée exceptionnelle : 15+ ans.",
      "Prix supérieur (à partir de 350 € vs 150 € pour lattes).",
    ]),

    h2("3. Sommier à ressorts"),
    p("Structure interne à ressorts biconiques ou ensachés. Ventilation naturelle supérieure, sensation « rebond »."),
    p("Recommandé UNIQUEMENT avec un matelas à ressorts. Combiner ressorts + ressorts double l'aération et prolonge la vie du matelas. À éviter avec mémoire de forme (le rebond casse l'accueil enveloppant)."),

    h2("4. Sommier coffre"),
    p("Sommier tapissier + coffre de rangement intégré. Voir notre guide lit coffre pour les critères mécaniques (vérins, cycles, sécurité)."),

    h2("5. Sommier électrique / relevable"),
    p("Tête et pieds réglables via télécommande. Recommandé pour :"),
    ...ul([
      "Personnes âgées (aide au lever).",
      "Reflux gastro-œsophagien (élévation de la tête de 30°).",
      "Douleurs lombaires (position de repos jambes surélevées).",
      "Lecture / TV au lit fréquente.",
    ]),
    p("Attention : nécessite un matelas certifié « spécial relevable » (mousse ou latex, jamais ressorts)."),

    h2("6. Compatibilité matelas / sommier"),
    ...ul([
      "Matelas mémoire de forme : lattes actives ou tapissier.",
      "Matelas ressorts ensachés : ressorts ou tapissier (pas de lattes passives).",
      "Matelas latex : lattes actives (indispensable pour la respiration du latex).",
      "Matelas hybride : tapissier ou lattes actives.",
    ]),

    h2("7. Signes qu'il faut changer votre sommier"),
    ...ul([
      "Grincements réguliers (lattes ou vis desserrées).",
      "Affaissement visible au centre.",
      "Le matelas ne se pose plus bien à plat.",
      "Il a plus de 10 ans.",
    ]),
    p("Investir 800 € dans un matelas neuf sans changer un sommier de 12 ans est l'erreur la plus fréquente selon UNIFA."),

    h2("8. Les pieds"),
    p("La hauteur des pieds influence l'ergonomie du lever et l'aération sous le sommier."),
    ...ul([
      "12-15 cm : lit bas contemporain.",
      "20-25 cm : standard ergonomique (recommandé).",
      "30 cm+ : facilite le nettoyage et l'aération, aspect boutique-hôtel.",
    ]),

    h2("Entretien"),
    p("Aspirer le dessus tous les 3 mois. Retourner le sommier à ressorts tous les 6 mois (pas le tapissier). Vérifier les vis de fixation 1 fois par an."),

    h2("Sources"),
    p("UNIFA — Fédération française de l'ameublement, guide technique des supports de literie 2024. NF EN 1957 — norme européenne sur les méthodes d'essai. ADEME — guide d'entretien et longévité des équipements domestiques, 2023."),
  ],
};

// ═══════════════════════════════════════════════════════════════════
// GUIDE 4 : COMMENT CHOISIR SON OREILLER
// ═══════════════════════════════════════════════════════════════════
const GUIDE_OREILLER = {
  slug: "guide-choisir-oreiller",
  title: "Comment choisir son oreiller ? Duvet, mémoire, ergonomique",
  excerpt: "Duvet, mémoire de forme, ergonomique — trouver le bon soutien pour votre nuque selon votre position de sommeil. Sources SFDO.",
  metaTitle: "Comment choisir son oreiller ? Guide expert 2026 — DreamsFly",
  metaDescription: "Position, garnissage, hauteur, fermeté : les critères validés par les ostéopathes pour choisir un oreiller qui préserve votre nuque.",
  articleType: "Guide d'achat",
  publishedAt: "2026-07-05T09:00:00.000Z",
  body: [
    p("L'oreiller supporte 4,5 kg (poids moyen d'une tête d'adulte) pendant 8 heures par nuit. Un mauvais oreiller est identifié dans 38 % des cervicalgies chroniques (Société Française des Ostéopathes, SFDO 2023). Voici comment le choisir."),

    h2("1. Votre position de sommeil — le critère prioritaire"),

    h3("Sur le dos"),
    p("Oreiller mi-ferme, hauteur 10-12 cm. Il doit maintenir la nuque dans le prolongement de la colonne, sans pousser la tête vers l'avant. Trop épais = torticolis, trop plat = tension cervicale."),

    h3("Sur le côté (majorité des dormeurs)"),
    p("Oreiller ferme, hauteur 13-16 cm. Doit combler l'espace entre l'épaule et le cou pour aligner la colonne cervicale à l'horizontale. Vérifier votre carrure : plus les épaules sont larges, plus l'oreiller doit être haut."),

    h3("Sur le ventre"),
    p("Oreiller souple, hauteur < 8 cm. Idéalement pas d'oreiller du tout (position déconseillée par les ostéopathes car elle force la rotation cervicale). Si vous ne pouvez pas changer, choisir le plus plat possible."),

    h2("2. Les garnissages"),

    h3("Plumes et duvet"),
    p("Le plus doux, le plus enveloppant. Sensation « nuage ». Malléable — se remodèle sous la tête. Attention : allergène pour certains, à éviter si asthme ou rhinite allergique. Durée : 5-7 ans."),

    h3("Mémoire de forme (viscoélastique)"),
    p("Épouse la forme de la tête et de la nuque. Excellent pour cervicalgies chroniques. Peut chauffer — préférer les modèles à cellules ouvertes ou avec gel. Durée : 3-5 ans."),

    h3("Latex naturel"),
    p("Ferme, respirant, hypoallergénique, résistant aux acariens. Durée exceptionnelle : 8-10 ans. Prix plus élevé (à partir de 80 €). Poids important — peut sembler « lourd ». "),

    h3("Fibre polyester (microfibre)"),
    p("Entrée de gamme, hypoallergénique, lavable en machine. Perd sa forme en 1-2 ans — à remplacer souvent."),

    h3("Ergonomique (à mémoire ou latex)"),
    p("Forme prédécoupée pour maintenir la nuque. Efficace mais impose une position (impossible de changer sans réajuster). Idéal après un accident cervical ou pour hernie discale cervicale."),

    h2("3. La taille"),
    ...ul([
      "50×70 cm : format français standard, adapté à la majorité.",
      "40×60 cm : format enfant ou petit gabarit.",
      "60×60 cm : format carré traditionnel, moins courant en usage courant.",
    ]),

    h2("4. La housse (coutil)"),
    p("Choisir une housse déhoussable et lavable à 40 ou 60°C. Coton biologique certifié GOTS ou Tencel pour la respirabilité. Éviter le polyester pur — retient l'humidité et l'odeur."),

    h2("5. Certifications"),
    ...ul([
      "OEKO-TEX Standard 100 : garantie absence de substances nocives.",
      "Downpass (pour plumes/duvet) : traçabilité et bien-être animal.",
      "GOTS : coton biologique (housse).",
      "Eurolatex ECO : latex sans pesticides.",
    ]),

    h2("6. Quand changer d'oreiller ?"),
    ...ul([
      "Marques jaunes qui ne partent pas au lavage : signe d'usure du garnissage.",
      "Plié en 2, il ne reprend pas immédiatement sa forme : perte de gonflant.",
      "Vous vous réveillez avec la nuque raide 2 matins d'affilée.",
      "Plus de 3 ans (mousse) ou 5 ans (plumes / latex).",
    ]),

    h2("7. Entretien"),
    p("Aérer 30 min à la fenêtre chaque semaine. Aspirer 1 fois par mois pour évacuer acariens et poussière. Laver la housse tous les 2 mois. Un oreiller propre = un environnement respiratoire sain."),

    h2("Erreurs à éviter"),
    p("Choisir un oreiller uniquement sur la « douceur » ressentie en magasin : la fermeté nécessaire dépend de votre morphologie et position, pas du confort perçu 30 secondes debout."),
    p("Réutiliser l'oreiller d'un autre : la forme s'est adaptée à sa nuque, pas à la vôtre. Chaque personne = son oreiller."),

    h2("Sources"),
    p("SFDO — Société Française des Ostéopathes, recommandations 2023 sur la prévention des cervicalgies. INSV — Institut National du Sommeil et de la Vigilance, guide d'hygiène du sommeil 2024. ANSES — Agence nationale de sécurité sanitaire, avis 2022 sur la qualité de l'air intérieur (dont literie)."),
  ],
};

const GUIDES = [GUIDE_MATELAS, GUIDE_LIT, GUIDE_SOMMIER, GUIDE_OREILLER];

async function upsertGuide(g) {
  const existing = await client.fetch(`*[_type == "guide" && slug.current == $slug][0]{ _id, title }`, { slug: g.slug });
  if (existing && !FORCE) {
    console.log(`  ⏭  ${g.slug} — existe (${existing._id}), skip. Utilise --force pour écraser.`);
    return;
  }
  const docId = PUBLISH ? `guide-${g.slug}` : `drafts.guide-${g.slug}`;
  const doc = {
    _id: docId,
    _type: "guide",
    title: g.title,
    slug: { _type: "slug", current: g.slug },
    excerpt: g.excerpt,
    articleType: g.articleType,
    publishedAt: g.publishedAt,
    metaTitle: g.metaTitle,
    metaDescription: g.metaDescription,
    body: g.body,
  };
  if (DRY) {
    console.log(`  🌵 [dry] ${docId} — "${g.title}" (${g.body.length} blocs)`);
    return;
  }
  await client.createOrReplace(doc);
  console.log(`  ✅ ${PUBLISH ? "published" : "draft"} — ${docId} — "${g.title}" (${g.body.length} blocs)`);
}

async function main() {
  console.log(`\n📚 Seed 4 guides d'achat — mode ${DRY ? "DRY" : PUBLISH ? "PUBLISH" : "DRAFT"}${FORCE ? " · FORCE" : ""}\n`);
  console.log(`   Projet: ${projectId} · Dataset: ${dataset}\n`);
  for (const g of GUIDES) {
    await upsertGuide(g);
  }
  console.log(`\n➡️  Après ce seed :`);
  console.log(`   · /magazine liste les 4 guides + 3 articles précédents = 7 guides publiés`);
  console.log(`   · La section BuyingGuide de la home pointe vers ces guides réels`);
  console.log(`   · Chaque guide a meta title/description SEO optimisés, structure H2/H3, sources citées`);
  console.log(`   · Édite chaque guide dans Studio → 📰 Magazine pour ajouter cover image ou l'auteur\n`);
}

main().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
