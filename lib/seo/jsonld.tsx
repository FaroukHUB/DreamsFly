/**
 * JSON-LD helpers — Schema.org type-safe pour DreamsFly.
 * Inclus uniquement quand les données existent (pas de placeholder vide qui fait fuir Google).
 */

type Thing = Record<string, unknown>;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamsfly.fr";

/** Composant React qui injecte un JSON-LD type-safe. */
export function JsonLd({ data }: { data: Thing | Thing[] | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: schema.org JSON-LD requires it
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─────────────────────────────────────────
// Generators
// ─────────────────────────────────────────

export function organizationSchema(opts: {
  name?: string;
  logo?: string;
  email?: string;
  phone?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: opts.name || "DreamsFly",
    url: SITE_URL,
    logo: opts.logo ? { "@type": "ImageObject", url: opts.logo } : undefined,
    email: opts.email,
    telephone: opts.phone,
    sameAs: opts.sameAs?.filter(Boolean),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "DreamsFly",
    inLanguage: "fr-FR",
    publisher: { "@id": `${SITE_URL}/#organization` },
    // NOTE : pas de SearchAction — la recherche du site est une modale (⌘K),
    // il n'existe pas de page /recherche?q=. Déclarer une URL 404 à Google
    // ferait plus de mal que de bien. À réactiver si une page dédiée est créée.
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${SITE_URL}${it.url}`,
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  if (!items?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

export function definedTermSchema(term: string, definition: string, inDefinedTermSet?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term,
    description: definition,
    inDefinedTermSet: inDefinedTermSet || `${SITE_URL}/glossaire`,
  };
}

export function productSchema(opts: {
  name: string;
  description?: string;
  image?: string[];
  sku?: string;
  brand?: string;
  url: string;
  price: number;
  priceCurrency?: string;
  compareAtPrice?: number;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  ratingValue?: number;
  ratingCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: opts.name,
    description: opts.description,
    image: opts.image,
    sku: opts.sku,
    brand: opts.brand ? { "@type": "Brand", name: opts.brand } : { "@type": "Brand", name: "DreamsFly" },
    offers: {
      "@type": "Offer",
      url: opts.url.startsWith("http") ? opts.url : `${SITE_URL}${opts.url}`,
      priceCurrency: opts.priceCurrency || "EUR",
      price: opts.price,
      // Requis par Google Merchant pour l'éligibilité rich results —
      // renouvelé automatiquement : fin de l'année en cours
      priceValidUntil: `${new Date().getFullYear()}-12-31`,
      availability: `https://schema.org/${opts.availability || "InStock"}`,
      ...(opts.compareAtPrice && { highPrice: opts.compareAtPrice, lowPrice: opts.price }),
      itemCondition: "https://schema.org/NewCondition",
      // Livraison forfaitaire 99 € France métropolitaine (politique réelle du site)
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", value: 99, currency: "EUR" },
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "FR" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 5, maxValue: 7, unitCode: "DAY" },
        },
      },
      // Droit de rétractation légal français : 14 jours
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "FR",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 14,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    ...(opts.ratingValue && opts.ratingCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: opts.ratingValue,
            reviewCount: opts.ratingCount,
          },
        }
      : {}),
  };
}

export function articleSchema(opts: {
  title: string;
  description?: string;
  image?: string;
  url: string;
  publishedAt?: string;
  updatedAt?: string;
  author?: { name: string; url?: string };
  reviewedBy?: { name: string };
  articleType?: "Article" | "TechArticle" | "NewsArticle";
}) {
  const author = opts.author && opts.author.name
    ? { "@type": "Person", name: opts.author.name, url: opts.author.url }
    : { "@type": "Organization", name: "DreamsFly", url: SITE_URL };
  return {
    "@context": "https://schema.org",
    "@type": opts.articleType || "Article",
    headline: opts.title,
    description: opts.description,
    image: opts.image,
    mainEntityOfPage: opts.url.startsWith("http") ? opts.url : `${SITE_URL}${opts.url}`,
    datePublished: opts.publishedAt,
    dateModified: opts.updatedAt || opts.publishedAt,
    author,
    reviewedBy: opts.reviewedBy ? { "@type": "Person", name: opts.reviewedBy.name } : undefined,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function howToSchema(opts: {
  name: string;
  description?: string;
  totalTime?: string; // ISO 8601 duration
  steps: { name: string; text: string; image?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.name,
    description: opts.description,
    totalTime: opts.totalTime,
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      image: s.image,
    })),
  };
}

export function localBusinessSchema(opts: {
  name: string;
  url: string;
  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
  openingHours?: { day: string; open?: string; close?: string; closed?: boolean }[];
  images?: string[];
}) {
  const dayMap: Record<string, string> = {
    Lundi: "Mo",
    Mardi: "Tu",
    Mercredi: "We",
    Jeudi: "Th",
    Vendredi: "Fr",
    Samedi: "Sa",
    Dimanche: "Su",
  };
  return {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    name: opts.name,
    image: opts.images,
    url: opts.url,
    telephone: opts.phone,
    email: opts.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: opts.street,
      postalCode: opts.postalCode,
      addressLocality: opts.city,
      addressCountry: opts.country || "FR",
    },
    geo:
      opts.lat && opts.lng
        ? { "@type": "GeoCoordinates", latitude: opts.lat, longitude: opts.lng }
        : undefined,
    openingHoursSpecification: opts.openingHours
      ?.filter((h) => !h.closed && h.open && h.close)
      .map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${{ Mo: "Monday", Tu: "Tuesday", We: "Wednesday", Th: "Thursday", Fr: "Friday", Sa: "Saturday", Su: "Sunday" }[dayMap[h.day]]}`,
        opens: h.open,
        closes: h.close,
      })),
  };
}

export function personSchema(opts: {
  name: string;
  url?: string;
  jobTitle?: string;
  description?: string;
  image?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: opts.name,
    jobTitle: opts.jobTitle,
    description: opts.description,
    image: opts.image,
    url: opts.url,
    sameAs: opts.sameAs?.filter(Boolean),
  };
}
