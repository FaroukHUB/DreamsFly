import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-01-01";

if (!projectId && process.env.NODE_ENV === "production") {
  console.warn(
    "[Sanity] NEXT_PUBLIC_SANITY_PROJECT_ID est manquant — le site va fonctionner en mode dégradé sans CMS."
  );
}

/**
 * Client de lecture publique. Renvoie null si projectId manquant pour
 * éviter de crasher au build.
 */
export const sanityClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  : null;

/**
 * Client d'écriture authentifié (côté serveur uniquement).
 */
export const sanityWriteClient = projectId
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: process.env.SANITY_API_WRITE_TOKEN,
    })
  : null;
