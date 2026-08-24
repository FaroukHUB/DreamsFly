import { groq } from "next-sanity";
import { sanityClient } from "./client";
import { urlFor } from "./image";

/**
 * Récupère les images de hero configurées dans le singleton pageHeros
 * (Sanity Studio → 🖼️ Images des Héros).
 *
 * Retourne un objet { pageKey: url } ou {} si rien de configuré.
 * Chaque page passe sa clé + son URL Pexels par défaut à
 * `pickHeroImageUrl` pour choisir entre Sanity (prioritaire) et fallback.
 */
export const pageHerosQuery = groq`*[_type == "pageHeros"][0]{
  memoireDeForme, malDeDos, litsCoffre,
  matelas, lits, sommiers, oreillers,
  aideContact
}`;

export type PageHeroKey =
  | "memoireDeForme"
  | "malDeDos"
  | "litsCoffre"
  | "matelas"
  | "lits"
  | "sommiers"
  | "oreillers"
  | "aideContact";

export async function fetchPageHeros(): Promise<Partial<Record<PageHeroKey, any>>> {
  if (!sanityClient) return {};
  try {
    const data = (await sanityClient.fetch(pageHerosQuery)) || {};
    return data;
  } catch {
    return {};
  }
}

/**
 * Renvoie l'URL de l'image à utiliser pour un hero.
 * Priorité :
 *   1. Image Sanity du singleton (si le user en a uploadé une)
 *   2. URL par défaut (fallback Pexels codé en dur)
 */
export function pickHeroImageUrl(
  sanityImage: any | undefined,
  fallbackUrl: string,
): string {
  if (sanityImage?.asset) {
    try {
      return urlFor(sanityImage).width(1400).quality(88).url();
    } catch {
      return fallbackUrl;
    }
  }
  return fallbackUrl;
}
