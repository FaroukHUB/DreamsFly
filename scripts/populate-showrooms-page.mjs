#!/usr/bin/env node
/**
 * Migration : crée / met à jour le singleton `showroomsPage`
 * qui pilote le contenu éditorial de la page /magasins
 * (hero, argumentaire, FAQ, SEO meta).
 *
 * IDEMPOTENT — ne touche que les champs vides. Rerun safe.
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj \
 *   SANITY_WRITE_TOKEN=sk... \
 *   node scripts/populate-showrooms-page.mjs [--dry|--publish]
 */

import { createClient } from "@sanity/client";
import { randomBytes } from "node:crypto";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error("SANITY_PROJECT_ID manquant");
if (!token) throw new Error("SANITY_WRITE_TOKEN manquant (rôle Editor minimum)");

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

const DEFAULT_CONTENT = {
  heroEyebrow: "Venez nous voir",
  heroTitle: "Trois showrooms pour tester nos matelas.",
  heroSubtitle:
    "Le matelas est l'achat le plus intime de votre maison. Venez le tester en boutique, échanger avec nos conseillers et faire votre choix en toute sérénité.",
  argumentsTitle: "Pourquoi essayer en showroom",
  argumentsItems: [
    {
      icon: "🛏️",
      title: "Essai libre sur tous les modèles",
      text: "Allongez-vous 10 à 15 minutes sur chaque matelas exposé. C'est le seul vrai test avant achat.",
    },
    {
      icon: "🎓",
      title: "Conseil expert personnalisé",
      text: "Nos conseillers vous orientent selon votre morphologie, votre position de sommeil et vos habitudes.",
    },
    {
      icon: "🚚",
      title: "Livraison et reprise ancien matelas",
      text: "Devis livraison à domicile et reprise de votre ancien couchage directement en magasin.",
    },
    {
      icon: "💳",
      title: "Paiement en 3× ou 4× sans frais",
      text: "Solutions de financement Alma disponibles directement en boutique, sans dossier compliqué.",
    },
    {
      icon: "🛌",
      title: "Essai libre en showroom",
      text: "Prenez le temps d'allonger, comparer, ressentir — sans limite de temps ni pression commerciale.",
    },
    {
      icon: "🇫🇷",
      title: "Fabrication française et européenne",
      text: "La majorité de nos matelas sont fabriqués en France ou en Europe, dans le respect des normes CertiPUR / OEKO-TEX.",
    },
  ],
  faqTitle: "Vos questions sur la visite en magasin",
  faqItems: [
    {
      question: "Faut-il prendre rendez-vous pour venir tester un matelas ?",
      answer:
        "Non, l'accès est libre pendant les horaires d'ouverture. Pour une session personnalisée d'1h avec un conseiller expert, un rendez-vous par téléphone est recommandé, en particulier le week-end.",
    },
    {
      question: "Combien de temps prévoir pour bien tester un matelas ?",
      answer:
        "Comptez 10 à 15 minutes par matelas, dans votre position de sommeil habituelle. Un test rapide de 30 secondes ne permet pas de juger le maintien lombaire ni la thermorégulation. Prévoyez donc au moins 45 minutes pour comparer 3 modèles sereinement.",
    },
    {
      question: "Les prix en magasin sont-ils identiques à ceux du site ?",
      answer:
        "Oui, nous appliquons une politique de prix unique : le prix affiché en boutique est identique au prix web, promotions incluses. Aucune surprise au moment de payer.",
    },
    {
      question: "Puis-je repartir avec mon matelas le jour même ?",
      answer:
        "Pour les modèles en stock roulé, oui — dans la limite de vos capacités de transport. Pour les matelas grandes tailles (160 / 180) ou les modèles fabriqués à la commande, nous organisons une livraison à domicile sous 5 à 10 jours.",
    },
    {
      question: "Reprenez-vous mon ancien matelas ?",
      answer:
        "Oui, nous proposons la reprise de votre ancien matelas lors de la livraison du neuf, moyennant un forfait éco-participation. Le matelas repris est ensuite recyclé via la filière Éco-mobilier.",
    },
    {
      question: "Le paiement en plusieurs fois est-il disponible ?",
      answer:
        "Oui, paiement en 3× ou 4× sans frais via Alma, directement en boutique ou sur le site. Un simple justificatif d'identité suffit.",
    },
  ],
  metaTitle: "Nos showrooms — Venez tester nos matelas",
  metaDescription:
    "Trois magasins physiques DreamsFly à Paris, Lyon et Marseille pour tester nos matelas avant achat. Conseillers experts, essai libre, livraison à domicile.",
};

async function main() {
  console.log(`\n🏬 Populate showroomsPage — mode ${DRY ? "DRY" : PUBLISH ? "PUBLISH" : "DRAFT"}\n`);

  const docId = PUBLISH ? "showroomsPage" : "drafts.showroomsPage";
  const existing = await client.getDocument(docId).catch(() => null);

  const merged = {
    _id: docId,
    _type: "showroomsPage",
    heroEyebrow: existing?.heroEyebrow || DEFAULT_CONTENT.heroEyebrow,
    heroTitle: existing?.heroTitle || DEFAULT_CONTENT.heroTitle,
    heroSubtitle: existing?.heroSubtitle || DEFAULT_CONTENT.heroSubtitle,
    argumentsTitle: existing?.argumentsTitle || DEFAULT_CONTENT.argumentsTitle,
    argumentsItems:
      existing?.argumentsItems && existing.argumentsItems.length > 0
        ? existing.argumentsItems
        : DEFAULT_CONTENT.argumentsItems.map((a) => ({ _key: k(), ...a })),
    faqTitle: existing?.faqTitle || DEFAULT_CONTENT.faqTitle,
    faqItems:
      existing?.faqItems && existing.faqItems.length > 0
        ? existing.faqItems
        : DEFAULT_CONTENT.faqItems.map((f) => ({ _key: k(), ...f })),
    metaTitle: existing?.metaTitle || DEFAULT_CONTENT.metaTitle,
    metaDescription: existing?.metaDescription || DEFAULT_CONTENT.metaDescription,
  };

  if (DRY) {
    console.log(`  🌵 [dry] would upsert ${docId}`);
    console.log(JSON.stringify(merged, null, 2).slice(0, 800) + "...");
    return;
  }

  await client.createOrReplace(merged);
  console.log(`  ✅ ${PUBLISH ? "published" : "draft"} — ${docId}`);
  console.log(`\n➡️  Édite ensuite le contenu dans Studio : /studio/desk/showroomsPage\n`);
}

main().catch((err) => {
  console.error("❌", err.message);
  process.exit(1);
});
