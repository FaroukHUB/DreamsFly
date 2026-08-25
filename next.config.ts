import type { NextConfig } from "next";

/**
 * Content-Security-Policy
 *
 * Deux politiques :
 *  - SITE (par défaut) : stricte — scripts uniquement self + inline
 *    (requis par l'hydratation Next.js) + Turnstile + Stripe.js.
 *  - STUDIO (/studio) : ajoute 'unsafe-eval' + connexions Sanity,
 *    nécessaires au fonctionnement de Sanity Studio embarqué.
 *
 * Les appels LLM (Gemini / Claude) partent du serveur — rien à ouvrir
 * côté navigateur pour eux.
 */
const CSP_SITE = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://js.stripe.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://images.pexels.com https://images.unsplash.com https://cdn.shopify.com",
  "font-src 'self' data:",
  "media-src 'self' blob: https://cdn.sanity.io",
  "connect-src 'self' https://*.sanity.io https://*.api.sanity.io https://challenges.cloudflare.com",
  "frame-src https://challenges.cloudflare.com https://js.stripe.com https://www.youtube.com https://www.youtube-nocookie.com https://player.vimeo.com https://www.google.com https://open.spotify.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://checkout.stripe.com",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const CSP_STUDIO = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://core.sanity-cdn.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://lh3.googleusercontent.com https://avatars.githubusercontent.com",
  "font-src 'self' data:",
  "media-src 'self' blob: https://cdn.sanity.io",
  "connect-src 'self' https://*.sanity.io https://*.api.sanity.io wss://*.api.sanity.io",
  "frame-src 'self' https://*.sanity.io",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(self)" },
];

const nextConfig: NextConfig = {
  // jsdom (dépendance d'isomorphic-dompurify) ne supporte pas le bundling
  // serveur de Next — on le laisse chargé par Node directement au runtime.
  serverExternalPackages: ["isomorphic-dompurify", "jsdom"],
  images: {
    // Bypass /_next/image (quota Vercel Hobby = 1000 transfos/mois).
    // Sanity CDN gère déjà WebP + resize via ?w=&q=&auto=format — gratuit et illimité.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  async headers() {
    return [
      {
        // Sanity Studio — CSP assouplie (eval + websockets Sanity)
        source: "/studio/:path*",
        headers: [
          ...SECURITY_HEADERS,
          { key: "Content-Security-Policy", value: CSP_STUDIO },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        // API — jamais indexée
        source: "/api/:path*",
        headers: [
          ...SECURITY_HEADERS,
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        // Tout le reste du site — CSP stricte
        source: "/((?!studio|api).*)",
        headers: [
          ...SECURITY_HEADERS,
          { key: "Content-Security-Policy", value: CSP_SITE },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/promos", destination: "/", permanent: false },
      { source: "/promotions", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
