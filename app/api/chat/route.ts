import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { sanityClient } from "@/lib/sanity/client";
import { groq } from "next-sanity";

/**
 * Chatbot conseiller sommeil DreamsFly — API stream.
 * POST /api/chat  body : { messages: [{role, content}, ...] }
 *
 * Utilise l'API Claude (Anthropic) avec streaming. Le contexte
 * (catalogue produits + showrooms + engagements) est injecté dans le
 * system prompt à chaque requête pour que le bot ne parle QUE de vraies
 * infos DreamsFly (pas d'hallucination, pas de matelas fictif).
 *
 * Requiert env var ANTHROPIC_API_KEY (à ajouter dans Vercel → Settings).
 */

export const runtime = "nodejs";
export const maxDuration = 60;

type ClientMessage = { role: "user" | "assistant"; content: string };

const CATALOGUE_QUERY = groq`{
  "products": *[_type == "product"] | order(name asc) [0...40] {
    name, title, tagline, "slug": slug.current, productType, firmness,
    "minPrice": variants[0].price
  },
  "showrooms": *[_type == "showroom" && defined(publishedAt) && publishedAt <= now()] | order(address.city asc) {
    name, "slug": slug.current, address, phone, openingHours
  }
}`;

async function loadContext() {
  if (!sanityClient) return { products: [], showrooms: [] };
  try {
    return await sanityClient.fetch<{ products: any[]; showrooms: any[] }>(CATALOGUE_QUERY);
  } catch {
    return { products: [], showrooms: [] };
  }
}

function buildSystemPrompt(ctx: { products: any[]; showrooms: any[] }) {
  const productsList = ctx.products
    .filter((p) => p.name)
    .map((p) => {
      const path =
        p.productType === "lit"
          ? `/lits/${p.slug}`
          : p.productType === "sommier"
            ? `/sommiers/${p.slug}`
            : p.productType === "oreiller"
              ? `/oreillers/${p.slug}`
              : `/matelas/${p.slug}`;
      const price = p.minPrice ? ` — dès ${p.minPrice}€` : "";
      const firmness = p.firmness ? ` (${p.firmness})` : "";
      const tagline = p.tagline ? ` : ${p.tagline}` : "";
      return `- ${p.name}${firmness}${tagline}${price} — ${path}`;
    })
    .join("\n");

  const showroomsList = ctx.showrooms
    .map((s) => {
      const addr = s.address
        ? `${s.address.street}, ${s.address.postalCode} ${s.address.city}`
        : "";
      return `- ${s.name} — ${addr}${s.phone ? ` — tél ${s.phone}` : ""} — /magasins/${s.slug}`;
    })
    .join("\n");

  return `Tu es le conseiller sommeil de DreamsFly, une manufacture de literie française premium fondée en 2013.

## Ton rôle
Aider les visiteurs à trouver le matelas / lit / sommier / oreiller adapté à leur morphologie, position de sommeil, budget, et éventuels problèmes (mal de dos, transpiration, couple, etc.).

## Ton style
- Réponses concises (2-4 phrases max, sauf demande explicite).
- Ton chaleureux mais expert. Pas de jargon inutile.
- Aucun emoji dans tes réponses.
- Français. Vouvoiement.
- Format : phrases simples. Utilise des tirets (-) pour les listes courtes.
- Si tu recommandes des produits, cite MAX 2 modèles avec leur nom exact + lien.
- Termine par une question ouverte ou une invitation à passer en showroom / faire le quiz.

## Ce que tu peux dire
- Recommander des produits UNIQUEMENT depuis le catalogue ci-dessous.
- Expliquer les technologies (mémoire de forme, ressorts ensachés, latex naturel).
- Orienter vers /quiz pour une reco personnalisée en 6 questions.
- Orienter vers /magasins pour un essai physique.
- Rappeler les engagements : livraison à domicile, 100 nuits d'essai, 15 ans de garantie, fabrication européenne, paiement en 3× sans frais.

## Ce que tu ne dois JAMAIS faire
- Inventer un nom de matelas qui n'existe pas.
- Inventer un prix.
- Inventer une garantie, une certification ou un chiffre.
- Prétendre être humain — si on te demande, tu réponds "je suis l'assistant IA de DreamsFly".
- Donner des conseils médicaux. Si mal de dos, oriente vers /matelas-mal-de-dos et suggère de consulter un ostéopathe.
- Parler d'autres marques (Emma, Tediber, Hypnia…) — reste focalisé sur DreamsFly.

## Catalogue actuel (${ctx.products.length} produits)
${productsList || "(Catalogue en cours de mise à jour — oriente vers /matelas ou le quiz.)"}

## Showrooms
${showroomsList || "(3 showrooms en cours d'inauguration.)"}

## Liens utiles à proposer
- /quiz — quiz de recommandation matelas en 6 questions
- /matelas — collection complète matelas
- /matelas-mal-de-dos — guide médical mal de dos
- /matelas-memoire-de-forme — guide mémoire de forme
- /magasins — nos 3 showrooms
- /aide/contact — service client

Si tu manques d'info catalogue pour répondre, oriente vers /quiz ou /aide/contact.`;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          "Le conseiller IA n'est pas encore actif. Ajoutez ANTHROPIC_API_KEY dans les variables d'environnement Vercel.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: { messages?: ClientMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Body JSON invalide" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = (body.messages || []).filter(
    (m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim(),
  );
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return new Response(JSON.stringify({ error: "Aucun message utilisateur" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = new Anthropic({ apiKey });
  const context = await loadContext();
  const system = buildSystemPrompt(context);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: "claude-opus-5",
          max_tokens: 1024,
          system,
          messages: messages.slice(-12),
        });

        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta" &&
            event.delta.text
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (err: any) {
        const msg = err?.message || "Erreur inconnue côté IA.";
        controller.enqueue(encoder.encode(`\n\n[Erreur : ${msg}]`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
