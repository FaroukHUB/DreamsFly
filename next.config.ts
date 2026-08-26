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

      // Anciennes URL encore présentes dans le contenu Sanity et dans les
      // liens externes. Le rendu des articles réécrit déjà ces href
      // (normalizeLegacyLinks) ; ces redirections couvrent le reste : les
      // liens entrants, les favoris et tout ce qui a pu être indexé.
      // Permanentes : ces adresses n'ont jamais existé sur ce site et ne
      // reviendront pas, autant transmettre le signal à Google.
      // Doit rester synchronisé avec LEGACY_LINKS dans lib/sanitize-html.ts :
      // le rendu réécrit les liens internes, ces redirections rattrapent tout
      // le reste — liens entrants, favoris, pages déjà indexées ailleurs.
      {
        source: "/blog/comment-choisir-son-matelas",
        destination: "/magazine/guide-choisir-matelas",
        permanent: true,
      },
      {
        source: "/blog/comment-choisir-son-sommier",
        destination: "/magazine/guide-choisir-sommier",
        permanent: true,
      },
      {
        source: "/blog/comment-choisir-son-oreiller",
        destination: "/magazine/guide-choisir-oreiller",
        permanent: true,
      },
      {
        source: "/blog/comment-choisir-son-lit",
        destination: "/magazine/guide-choisir-lit",
        permanent: true,
      },
      {
        source: "/blog/quel-matelas-mal-de-dos",
        destination: "/magazine/matelas-mal-de-dos",
        permanent: true,
      },
      {
        source: "/blog/memoire-de-forme-ou-ressorts-ensaches",
        destination: "/magazine/memoire-forme-vs-ressorts",
        permanent: true,
      },
      { source: "/collections/matelas", destination: "/matelas", permanent: true },
      { source: "/collections/sommiers", destination: "/sommiers", permanent: true },
      { source: "/collections/oreillers", destination: "/oreillers", permanent: true },
      { source: "/collections/lits", destination: "/lits", permanent: true },
      { source: "/quiz-oreiller", destination: "/quiz", permanent: true },
      { source: "/showrooms", destination: "/magasins", permanent: true },
    ];
  },
};

export default nextConfig;
