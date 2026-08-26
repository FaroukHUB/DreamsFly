import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamsfly.fr";
const SITE_NAME = "DreamsFly";

/**
 * Titre de repli, SANS nom de marque : le suffixe « | DreamsFly » est
 * ajouté une seule fois, par le `title.template` de app/layout.tsx.
 */
const DEFAULT_TITLE = "Matelas premium conçus en France";

const DEFAULT_DESCRIPTION =
  "Matelas premium conçus pour votre meilleur sommeil. Mousse mémoire de forme, ressorts ensachés, hybride. Livraison à domicile, paiement en plusieurs fois.";

/**
 * Hôtes autorisés à être indexés.
 *
 * Toute autre valeur — prévisualisation Vercel, domaine parqué Hostinger,
 * localhost — désactive l'indexation, même si les autres conditions sont
 * réunies. C'est ce qui empêche une canonical de désigner un domaine qui
 * n'est pas le site.
 */
const PRODUCTION_HOSTS = ["dreamsfly.fr", "www.dreamsfly.fr"];

/**
 * Détermine si la page courante a le droit d'être indexée.
 *
 * TROIS conditions cumulatives, chacune indispensable :
 *
 *  1. `VERCEL_ENV === "production"` — une prévisualisation n'est jamais
 *     indexable. Vercel définit cette variable lui-même, elle ne peut pas
 *     être contournée depuis les réglages du projet : c'est le garde-fou
 *     qui tient même si `SEO_INDEXING_ENABLED` est mis à `true` par erreur
 *     dans les variables d'environnement Preview.
 *  2. `SEO_INDEXING_ENABLED === "true"` — l'interrupteur volontaire, à
 *     n'activer qu'à la mise en ligne définitive.
 *  3. L'URL du site pointe vers un hôte DreamsFly de production.
 *
 * Prend `env` en paramètre pour être testable sans manipuler process.env.
 */
export function computeIndexingEnabled(
  env: Record<string, string | undefined> = process.env,
): boolean {
  if (env.VERCEL_ENV !== "production") return false;
  if (env.SEO_INDEXING_ENABLED !== "true") return false;

  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return false;
  try {
    return PRODUCTION_HOSTS.includes(new URL(siteUrl).hostname.toLowerCase());
  } catch {
    // URL malformée : dans le doute, on n'indexe pas.
    return false;
  }
}

/**
 * Interrupteur d'indexation, évalué une fois au chargement du module.
 *
 * Quand il vaut `false` : robots `noindex, nofollow` et AUCUNE canonical
 * publiée. Mieux vaut ne rien déclarer que de désigner le mauvais domaine —
 * une canonical erronée est bien plus longue à corriger auprès de Google
 * qu'une absence temporaire d'indexation.
 */
export const INDEXING_ENABLED = computeIndexingEnabled();

/**
 * Suffixe de marque en fin de titre, répété autant de fois qu'il apparaît.
 *
 * Reconnaît les séparateurs rencontrés dans les champs Sanity : barre
 * verticale, point médian, tiret cadratin, demi-cadratin et trait d'union.
 *
 *   « Guide oreiller 2026 — DreamsFly · DreamsFly » → « Guide oreiller 2026 »
 */
const BRAND_SUFFIX_RE = /(?:\s*[|·—–-]\s*DreamsFly\s*)+$/i;

/**
 * Retire le nom de marque déjà présent dans un titre saisi en base.
 *
 * Sans ce nettoyage, un `metaTitle` Sanity terminé par « | DreamsFly »
 * ressortirait en « … | DreamsFly | DreamsFly » une fois le template du
 * layout appliqué.
 *
 * Exporté pour être testable isolément.
 */
export function stripBrandSuffix(title: string): string {
  const cleaned = title.replace(BRAND_SUFFIX_RE, "").trim();
  // Un titre qui n'était QUE le nom de marque deviendrait vide : on préfère
  // alors garder l'original, que le template complétera normalement.
  return cleaned || title.trim();
}

type BuildMetadataInput = {
  title?: string;
  description?: string;
  path: string; // ex: "/matelas-140x190"
  image?: string;
  noindex?: boolean;
  type?: "website" | "article" | "product";
  publishedTime?: string;
  modifiedTime?: string;
};

/**
 * Helper centralisé pour générer Metadata Next.js avec OG, Twitter, canonical.
 * À utiliser dans chaque `generateMetadata()` de route.
 *
 * Le titre renvoyé ne contient JAMAIS le nom de marque : app/layout.tsx est
 * seul responsable de l'ajouter, via `title.template`. C'est ce qui garantit
 * qu'il n'apparaît qu'une fois dans la balise <title> finale.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  noindex,
  type = "website",
  publishedTime,
  modifiedTime,
}: BuildMetadataInput): Metadata {
  const fullUrl = `${SITE_URL}${path}`;
  const bareTitle = title ? stripBrandSuffix(title) : DEFAULT_TITLE;

  // Les métadonnées Open Graph et Twitter ne passent pas par le template du
  // layout : on y compose donc le titre complet à la main, une seule fois.
  const socialTitle = `${bareTitle} | ${SITE_NAME}`;

  const finalDescription = description || DEFAULT_DESCRIPTION;
  const ogImage = image || `${SITE_URL}/api/og?title=${encodeURIComponent(bareTitle)}`;

  return {
    title: bareTitle,
    description: finalDescription,
    // Aucune canonical tant que l'indexation est désactivée : mieux vaut
    // ne rien déclarer que de désigner un domaine qui n'est pas le bon.
    ...(INDEXING_ENABLED ? { alternates: { canonical: fullUrl } } : {}),
    robots: !INDEXING_ENABLED
      ? { index: false, follow: false }
      : noindex
        ? { index: false, follow: true }
        : {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
    openGraph: {
      type: type === "product" ? "website" : (type as any),
      locale: "fr_FR",
      siteName: SITE_NAME,
      url: fullUrl,
      title: socialTitle,
      description: finalDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: bareTitle }],
      ...(type === "article" && publishedTime ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: finalDescription,
      images: [ogImage],
    },
  };
}
