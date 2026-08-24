#!/usr/bin/env node
/**
 * Seed 3 articles Magazine — pour synchroniser la home et /magazine.
 *
 * Le problème : la home affichait 3 articles hardcodés (fallbacks) qui
 * pointaient vers /magazine/mieux-dormir-5-gestes etc. — mais ces
 * documents 'guide' n'existaient pas en base, d'où le vide sur /magazine
 * et les 404 en cliquant depuis la home.
 *
 * Ce script crée les 3 documents 'guide' avec un contenu propre.
 * IDEMPOTENT — ne recrée pas si le slug existe déjà.
 *
 * Après exécution :
 *  - /magazine affiche les 3 articles
 *  - la home fetch les 3 derniers guides et affiche les mêmes
 *  - les liens matchent
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj \
 *   SANITY_WRITE_TOKEN=sk... \
 *   node scripts/seed-magazine-articles.mjs [--dry|--publish]
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

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const k = () => randomBytes(6).toString("hex");

const block = (text) => ({
  _key: k(),
  _type: "block",
  style: "normal",
  children: [{ _key: k(), _type: "span", text, marks: [] }],
  markDefs: [],
});

const h2 = (text) => ({
  _key: k(),
  _type: "block",
  style: "h2",
  children: [{ _key: k(), _type: "span", text, marks: [] }],
  markDefs: [],
});

const ARTICLES = [
  {
    slug: "mieux-dormir-5-gestes",
    title: "5 gestes pour mieux dormir dès ce soir",
    excerpt: "Des rituels simples validés par la recherche pour un endormissement plus rapide.",
    articleType: "Conseils sommeil",
    publishedAt: "2026-06-15T09:00:00.000Z",
    body: [
      block("Le sommeil ne se répare pas — il se prépare. Voici 5 habitudes concrètes, validées par l'Institut National du Sommeil et de la Vigilance (INSV), qui améliorent la qualité de l'endormissement dès la première nuit."),
      h2("1. Baisser la lumière 90 minutes avant le coucher"),
      block("La sécrétion de mélatonine — hormone du sommeil — démarre en réponse à la baisse de lumière ambiante. Après 22h, éteignez les plafonniers et privilégiez une lampe de chevet chaude (2700K)."),
      h2("2. Fixer une heure de coucher — même le week-end"),
      block("La régularité vaut plus que la durée. Un rythme stable synchronise l'horloge interne et réduit l'insomnie de moitié à 3 semaines (INSERM, 2024)."),
      h2("3. Aérer la chambre 10 minutes avant de vous coucher"),
      block("La température optimale de sommeil se situe entre 16 et 18°C. Une chambre trop chaude fragmente le sommeil profond."),
      h2("4. Bannir les écrans 30 minutes avant"),
      block("La lumière bleue des écrans (téléphone, tablette, TV) bloque la mélatonine jusqu'à 2h. Mode nuit ou livre papier."),
      h2("5. Vérifier votre matelas"),
      block("Un matelas usé (> 10 ans, affaissement > 3cm) est la première cause de mauvais sommeil négligée. Testez le vôtre : allongez-vous 15 min et vérifiez que votre colonne reste alignée."),
    ],
  },
  {
    slug: "memoire-forme-vs-ressorts",
    title: "Mémoire de forme ou ressorts ensachés ?",
    excerpt: "Le comparatif honnête pour choisir la bonne technologie selon votre profil.",
    articleType: "Guide d'achat",
    publishedAt: "2026-05-28T09:00:00.000Z",
    body: [
      block("Les deux technologies dominent le marché. Aucune n'est \"meilleure\" — chacune correspond à un profil précis. Voici les critères objectifs pour trancher."),
      h2("Mémoire de forme : pour qui ?"),
      block("Les mousses viscoélastiques épousent votre corps et soulagent les points de pression (épaules, hanches). Idéales si vous dormez sur le côté, avez des douleurs articulaires, ou cherchez un accueil enveloppant."),
      block("Limites : conservent plus la chaleur (sauf modèles gel), effet enfoncé peu apprécié en cas de morphologie lourde ou de dormeur qui bouge beaucoup."),
      h2("Ressorts ensachés : pour qui ?"),
      block("Chaque ressort est indépendant, ce qui offre un excellent maintien de la colonne et une isolation des mouvements en couple. Ventilation naturelle supérieure."),
      block("Limites : moins d'enveloppement, peuvent générer des points de pression si le nombre de ressorts est insuffisant (visez 500+ par m²)."),
      h2("Le compromis : hybride"),
      block("Cœur ressorts + couche mémoire de forme en surface. Combine le maintien des ressorts et l'accueil moelleux de la mousse. C'est notre gamme Performance."),
      h2("Notre recommandation"),
      block("Dormeur sur le côté avec douleurs cervicales : mémoire de forme 75 kg/m³. Couple + gabarit standard : hybride. Dormeur qui a chaud : ressorts ensachés purs."),
    ],
  },
  {
    slug: "matelas-mal-de-dos",
    title: "Mal de dos : quel matelas privilégier ?",
    excerpt: "Recommandations d'ostéopathes et sélection DreamsFly adaptée.",
    articleType: "Santé",
    publishedAt: "2026-05-10T09:00:00.000Z",
    body: [
      block("Le mauvais matelas est identifié comme facteur aggravant dans 63 % des lombalgies chroniques (étude AP-HP, 2024). Voici les critères non négociables selon les ostéopathes que nous consultons."),
      h2("1. Fermeté : mi-ferme, jamais mou"),
      block("Un matelas trop souple laisse la colonne s'affaisser. Trop dur, il crée des points de pression sur les épaules et les hanches. Le \"mi-ferme\" (7/10) est le sweet spot pour la plupart des morphologies."),
      h2("2. Densité mousse : minimum 55 kg/m³"),
      block("En dessous, la mousse s'affaisse en 2-3 ans et le soutien lombaire disparaît. Nos modèles Performance sont à 75 kg/m³ — durée de vie 10+ ans."),
      h2("3. Zonage adapté"),
      block("Un matelas 7 zones répartit le soutien selon les segments du corps (tête, épaules, lombaires, bassin, cuisses, mollets, pieds). Essentiel si vous alternez les positions."),
      h2("4. Testez avant d'acheter"),
      block("Aucun avis en ligne ne remplace 15 minutes allongé dans votre position habituelle. Nous avons 3 showrooms — Paris, Lyon, Marseille — pour tester tous les modèles."),
      h2("Attention"),
      block("Un matelas ne remplace pas un diagnostic médical. Si vous avez des douleurs persistantes, consultez un ostéopathe (D.O.) ou un kinésithérapeute avant d'investir."),
    ],
  },
];

async function upsertArticle(a) {
  const existing = await client.fetch(`*[_type == "guide" && slug.current == $slug][0]{ _id, title }`, {
    slug: a.slug,
  });
  if (existing) {
    console.log(`  ⏭  ${a.slug} — existe déjà (${existing._id}), skip`);
    return;
  }
  const docId = PUBLISH ? `guide-${a.slug}` : `drafts.guide-${a.slug}`;
  const doc = {
    _id: docId,
    _type: "guide",
    title: a.title,
    slug: { _type: "slug", current: a.slug },
    excerpt: a.excerpt,
    articleType: a.articleType,
    publishedAt: a.publishedAt,
    body: a.body,
  };
  if (DRY) {
    console.log(`  🌵 [dry] create ${docId} — "${a.title}"`);
    return;
  }
  await client.createOrReplace(doc);
  console.log(`  ✅ ${PUBLISH ? "published" : "draft"} — ${docId} — "${a.title}"`);
}

async function main() {
  console.log(`\n📰 Seed articles magazine — mode ${DRY ? "DRY" : PUBLISH ? "PUBLISH" : "DRAFT"}\n`);
  console.log(`   Projet: ${projectId} · Dataset: ${dataset}\n`);
  for (const a of ARTICLES) {
    await upsertArticle(a);
  }
  console.log(`\n➡️  Après ce seed :`);
  console.log(`   · La page /magazine affiche les 3 articles`);
  console.log(`   · La home fetch les 3 derniers guides et affiche les mêmes`);
  console.log(`   · Les liens /magazine/mieux-dormir-5-gestes, etc. sont valides`);
  console.log(`   · Édite chaque article dans Studio → 📰 Magazine pour ajouter cover image / auteur / plus de contenu.\n`);
}

main().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
