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
        // ─── Fonds (warm neutral + gris clairs cool) ───
        page: "#F4EFE7",          // beige chaud — fond global du site
        ivoire: "#FFFFFF",        // blanc pur (cards, buy box)
        sable: "#F6F7F9",         // gris très très clair (sections alternées)
        lin: "#EEF0F4",           // gris clair (cards, hover)
        "beige-profond": "#D9DDE4", // gris medium (séparateurs forts)
        // ─── Fonds éditoriaux (direction A — luxe) ───
        noir: "#0B0B0F",          // section noire éditoriale
        "noir-doux": "#17130F",   // dégradé chaud du noir vers l'or
        creme: "#F0E9DC",         // crème plus chaud que page, pour sections signature
        taupe: "#8B7355",         // gris chaud, texte secondaire sur crème
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
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 8.5vw, 8rem)", { lineHeight: "0.94", letterSpacing: "-0.045em" }],
        "display-lg": ["clamp(2.4rem, 5.4vw, 5rem)", { lineHeight: "1", letterSpacing: "-0.035em" }],
        "display-md": ["clamp(1.8rem, 3.6vw, 3.2rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
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
        marquee: "marquee 40s linear infinite",
        "marquee-slow": "marquee 70s linear infinite",
        "scroll-hint": "scrollHint 2.4s ease-in-out infinite",
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
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        scrollHint: {
          "0%,100%": { transform: "scaleY(1)", transformOrigin: "top", opacity: "0.4" },
          "50%": { transform: "scaleY(1.6)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
