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
        // ─── Fonds chauds (cocooning) ───
        ivoire: "#FBF9F4",
        sable: "#F4EFE6",
        lin: "#EBE3D3",
        "beige-profond": "#D4C9B5",
        // ─── Textes ───
        ink: "#1C1B1F",
        pierre: "#57534E",
        brume: "#A8A29E",
        // ─── Accents (issus du logo) ───
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
        border: "#E8E1D0",
        success: "#6B9B5E",
        warning: "#D4A574",
        error: "#C45D4A",
        discount: "#C45D4A",
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
