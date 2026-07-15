import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Bypass /_next/image (quota Vercel Hobby = 1000 transfos/mois).
    // Sanity CDN gère déjà WebP + resize via ?w=&q=&auto=format — gratuit et illimité.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [];
  },
};

export default nextConfig;
