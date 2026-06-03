import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sanity/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── Fonds (blanc + gris clairs cool) ───
        ivoire: "#FFFFFF",        // blanc pur
        sable: "#F6F7F9",         // gris très très clair (sections alternées)
        lin: "#EEF0F4",           // gris clair (cards, hover)
        "beige-profond": "#D9DDE4", // gris medium (séparateurs forts)
        // ─── Textes ───
        ink: "#0F172A",           // texte principal — slate 900
        pierre: "#475569",        // sous-titres — slate 600
        brume: "#94A3B8",         // métadonnées — slate 400
        // ─── Accents (issus du logo, conservés) ───
        midnight: {
          DEFAULT: "#172554",
          dark: "#0F1B47",
        },
        sky: "#38BDF8",
        aurora: "#BFE4F2",
        or: {
          DEFAULT: "#C8A876",
          dark: "#A8884E",
        },
        // ─── Système ───
        border: "#E2E8F0",        // slate 200
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        discount: "#DC2626",
      },
      fontFamily: {
        sora: ["var(--font-sora)", "system-ui", "sans-serif"],
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "1360px",
      },
      borderRadius: {
        pill: "999px",
      },
      animation: {
        "fade-in": "fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "layer-in": "layerIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        layerIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
