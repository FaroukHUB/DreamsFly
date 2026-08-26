#!/usr/bin/env node
/**
 * Signe les guides du Magazine et leur rattache des sources vérifiées.
 *
 * PAR DÉFAUT : n'écrit RIEN. Ajouter --publish pour appliquer.
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj SANITY_DATASET=production \
 *   SANITY_WRITE_TOKEN=sk... node scripts/seed-author-and-sources.mjs [--publish]
 *
 * POURQUOI UN SEUL AUTEUR, ET UN AUTEUR RÉEL
 * L'audit relevait sept guides sans signature, sans image et sans source :
 * la faiblesse principale du site sur des requêtes liées au sommeil, que
 * Google classe en « Your Money or Your Life » et évalue sur des critères
 * d'expertise renforcés.
 *
 * L'auteur créé ici est une personne réelle, avec sa fonction réelle. Un
 * fondateur qui sélectionne des fabricants et tient des showrooms est une
 * source légitime pour un GUIDE D'ACHAT — ce n'est pas un avis médical.
 *
 * Le champ `reviewer` reste volontairement VIDE : il est prévu pour un
 * professionnel de santé sous contrat. Tant qu'il n'y en a pas, inventer
 * une relecture serait exactement le genre de revendication que ce projet
 * passe son temps à retirer.
 */

import { createClient } from "@sanity/client";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error("SANITY_PROJECT_ID manquant");
if (!token) throw new Error("SANITY_WRITE_TOKEN manquant (rôle Editor minimum)");

const PUBLISH = process.argv.includes("--publish");
const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

const AUTHOR_ID = "author-djamel-d";

/**
 * Informations fournies par l'intéressé. Les six années d'expérience
 * reprennent la mention déjà présente sur la page d'accueil — aucune donnée
 * n'est ajoutée ici qui ne figure déjà sur le site.
 *
 * Photo et LinkedIn restent à ajouter dans le Studio : un script ne peut
 * pas les inventer.
 */
const AUTHOR = {
  _id: AUTHOR_ID,
  _type: "author",
  name: "Djamel D.",
  slug: { _type: "slug", current: "djamel-d" },
  // false : la signature s'affiche. C'est ce champ qui masquait le nom.
  isPlaceholder: false,
  role: "Fondateur de DreamsFly",
  bioShort:
    "Fondateur de DreamsFly. Six ans à sélectionner des fabricants européens de literie et à conseiller en showroom.",
  publishedAt: new Date().toISOString(),
};

/**
 * Sources vérifiées — chaque URL a répondu lors du contrôle réseau.
 *
 * Les intitulés portent leurs réserves méthodologiques : un guide d'achat
 * ne doit pas transformer une étude sur seize volontaires en recommandation
 * générale, ni présenter un essai négatif comme une preuve d'efficacité.
 */
const SOURCES = {
  radwan: {
    title:
      "Effect of different pillow designs on promoting sleep comfort, quality & spinal alignment — revue systématique",
    publisher: "European Journal of Integrative Medicine",
    url: "https://doi.org/10.1016/j.eujim.2020.101269",
    year: 2021,
  },
  pillowHeight: {
    title:
      "The Effect of Different Pillow Heights on the Parameters of Cervicothoracic Spine Segments — 16 adultes jeunes asymptomatiques, décubitus dorsal",
    publisher: "PMC / National Library of Medicine",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4623167/",
    year: 2015,
  },
  pillowRct: {
    title:
      "Pillow preferences of people with neck pain and known spinal degeneration — essai pilote, sans amélioration globale significative",
    publisher: "PubMed",
    url: "https://pubmed.ncbi.nlm.nih.gov/31489809/",
    year: 2019,
  },
  inserm: {
    title: "Dossier Sommeil",
    publisher: "INSERM",
    url: "https://www.inserm.fr/dossier/sommeil/",
    year: 2024,
  },
  oekotex: {
    title: "OEKO-TEX® STANDARD 100 — référentiel officiel",
    publisher: "OEKO-TEX®",
    url: "https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100/",
    year: 2024,
  },
  gots: {
    title: "Global Organic Textile Standard — référentiel officiel",
    publisher: "GOTS",
    url: "https://global-standards.org/our-standards/gots",
    year: 2024,
  },
  downpass: {
    title: "DOWNPASS — bien-être animal et traçabilité du duvet",
    publisher: "DOWNPASS e.V.",
    url: "https://www.downpass.com/en/animal-welfare-quality/",
    year: 2024,
  },
};

/**
 * Sources par article — rattachées uniquement là où le sujet le justifie.
 *
 * Accrocher les sept références à chaque guide serait de l'habillage :
 * une source ne vaut que si l'article avance réellement l'affirmation
 * qu'elle étaie.
 */
const SOURCES_BY_SLUG = {
  "guide-choisir-oreiller": ["pillowHeight", "pillowRct", "radwan", "downpass", "oekotex"],
  "guide-choisir-matelas": ["radwan", "inserm", "oekotex"],
  "matelas-mal-de-dos": ["radwan", "inserm"],
  "memoire-forme-vs-ressorts": ["radwan", "oekotex"],
  "guide-choisir-sommier": ["oekotex"],
  "guide-choisir-lit": ["oekotex", "gots"],
  "mieux-dormir-5-gestes": ["inserm"],
};

const key = (s) => s.replace(/[^a-z0-9]/gi, "").slice(0, 20);

// ─────────────────────────────────────────────────────────────

console.log(`\n✍️  Auteur et sources — mode ${PUBLISH ? "PUBLISH" : "DRY (lecture seule)"}`);
console.log(`   Projet ${projectId} · dataset ${dataset}\n`);

const existingAuthor = await client.fetch(`*[_id == $id][0]{ _id, name, role, isPlaceholder }`, {
  id: AUTHOR_ID,
});

console.log("── AUTEUR ──────────────────────────────────────────────");
if (existingAuthor) {
  console.log(`  Déjà présent : ${existingAuthor.name} — ${existingAuthor.role}`);
  console.log(`  (createIfNotExists : son contenu ne sera pas écrasé)`);
} else {
  console.log(`  À créer : ${AUTHOR.name} — ${AUTHOR.role}`);
  console.log(`  ${AUTHOR.bioShort}`);
}
console.log(`  Photo et LinkedIn : à ajouter dans le Studio, un script ne les invente pas.`);

const guides = await client.fetch(
  `*[_type == "guide"] | order(slug.current asc){
     _id, title, "slug": slug.current,
     "hasAuthor": defined(author), "sourceCount": count(sources)
   }`,
);

console.log("\n── GUIDES ──────────────────────────────────────────────");
const ops = [];
for (const g of guides) {
  const wanted = SOURCES_BY_SLUG[g.slug];
  const actions = [];

  if (!g.hasAuthor) actions.push("signature");
  else actions.push("auteur déjà défini — inchangé");

  if (!g.sourceCount && wanted) actions.push(`${wanted.length} source(s)`);
  else if (g.sourceCount) actions.push(`${g.sourceCount} source(s) déjà présente(s) — inchangées`);
  else actions.push("aucune source prévue pour ce slug");

  console.log(`\n  /${g.slug}`);
  console.log(`    ${g.title}`);
  for (const a of actions) console.log(`    · ${a}`);

  const patch = {};
  if (!g.hasAuthor) {
    patch.author = { _type: "reference", _ref: AUTHOR_ID };
  }
  if (!g.sourceCount && wanted) {
    patch.sources = wanted.map((k) => ({ _key: key(k), ...SOURCES[k] }));
    for (const k of wanted) console.log(`      → ${SOURCES[k].publisher} : ${SOURCES[k].url}`);
  }
  if (Object.keys(patch).length) ops.push({ id: g._id, patch });
}

console.log(`\n═══════════════════════════════════════════════════════`);
console.log(`${ops.length} guide(s) à modifier · reviewer laissé vide partout.`);
console.log(`═══════════════════════════════════════════════════════\n`);

if (!PUBLISH) {
  console.log("💡 Mode DRY — rien n'a été écrit.\n   Relance avec --publish après validation.\n");
  process.exit(0);
}

// createIfNotExists : si tu as déjà retouché l'auteur dans le Studio, ton
// contenu prime et n'est pas écrasé.
await client.createIfNotExists(AUTHOR);
console.log(`✅ Auteur ${AUTHOR_ID} en place.`);

for (const { id, patch } of ops) {
  // Patch partiel, jamais createOrReplace.
  await client.patch(id).set(patch).commit();
  console.log(`✅ ${id} — ${Object.keys(patch).join(", ")}`);
}
console.log(`\n✅ Terminé. Ajoute la photo de l'auteur dans Studio → Auteurs & experts.\n`);
