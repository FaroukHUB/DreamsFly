import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamsfly.fr";
const SITE_NAME = "DreamsFly";
const DEFAULT_DESCRIPTION =
  "Matelas premium conçus pour votre meilleur sommeil. Mousse mémoire de forme, ressorts ensachés, hybride. Livraison à domicile, paiement en plusieurs fois.";

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
  const finalTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — Matelas premium conçus en France`;
  const finalDescription = description || DEFAULT_DESCRIPTION;
  const ogImage = image || `${SITE_URL}/api/og?title=${encodeURIComponent(title || SITE_NAME)}`;

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: fullUrl },
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
    openGraph: {
      type: type === "product" ? "website" : (type as any),
      locale: "fr_FR",
      siteName: SITE_NAME,
      url: fullUrl,
      title: finalTitle,
      description: finalDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title || SITE_NAME }],
      ...(type === "article" && publishedTime ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [ogImage],
    },
  };
}
