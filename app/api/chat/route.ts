import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { sanityClient } from "@/lib/sanity/client";
import { groq } from "next-sanity";

/**
 * Chatbot conseiller sommeil DreamsFly — API stream, provider-agnostique.
 *
 * Ordre de priorité :
 *   1. Google Gemini 2.0 Flash   (env GOOGLE_API_KEY)  — GRATUIT (15 req/min, 1M tokens/jour)
 *   2. Claude Haiku 4.5          (env ANTHROPIC_API_KEY) — payant mais peu cher (~1€/100 conv)
 *   3. 503 si aucun des deux configuré
 *
 * Où récupérer les clés :
 *   • Gemini : https://aistudio.google.com/apikey  (compte Google, gratuit)
 *   • Claude : https://console.anthropic.com/settings/keys
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
- Rappeler les engagements : livraison à domicile (99 €), essai en showroom, garantie fabricant, fabrication européenne, paiement en 3× sans frais.

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

// ─────────────────────────────────────────────────────────────
// Google Gemini — REST streaming (gratuit)
// ─────────────────────────────────────────────────────────────
async function* streamGemini(system: string, messages: ClientMessage[], apiKey: string) {
  const model = "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini ${res.status} : ${errText.slice(0, 200)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const jsonStr = trimmed.slice(5).trim();
      if (!jsonStr) continue;
      try {
        const payload = JSON.parse(jsonStr);
        const parts = payload?.candidates?.[0]?.content?.parts;
        if (Array.isArray(parts)) {
          for (const p of parts) {
            if (p?.text) yield p.text as string;
          }
        }
      } catch {
        // ligne partielle, on ignore
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────
// Anthropic Claude Haiku 4.5 — SDK streaming (payant, peu cher)
// ─────────────────────────────────────────────────────────────
async function* streamClaude(system: string, messages: ClientMessage[], apiKey: string) {
  const client = new Anthropic({ apiKey });
  const anthropicStream = client.messages.stream({
    model: "claude-haiku-4-5",
    max_tokens: 1024,
    system,
    messages,
  });
  for await (const event of anthropicStream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta" &&
      event.delta.text
    ) {
      yield event.delta.text;
    }
  }
}

export async function POST(req: NextRequest) {
  const googleKey = process.env.GOOGLE_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!googleKey && !anthropicKey) {
    return new Response(
      JSON.stringify({
        error:
          "Le conseiller IA n'est pas encore actif. Ajoutez GOOGLE_API_KEY (gratuit — aistudio.google.com/apikey) OU ANTHROPIC_API_KEY dans les variables d'environnement Vercel.",
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

  const context = await loadContext();
  const system = buildSystemPrompt(context);
  const trimmedMessages = messages.slice(-12);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const generator = googleKey
          ? streamGemini(system, trimmedMessages, googleKey)
          : streamClaude(system, trimmedMessages, anthropicKey!);
        for await (const chunk of generator) {
          controller.enqueue(encoder.encode(chunk));
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
