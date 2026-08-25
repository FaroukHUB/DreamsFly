import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DreamsFly — Matelas & literie premium",
    short_name: "DreamsFly",
    description:
      "Matelas, lits coffre, sommiers et oreillers premium fabriqués en Europe. Essai en showroom, paiement en 3× ou 4× sans frais.",
    start_url: "/",
    display: "standalone",
    background_color: "#F4EFE7",
    theme_color: "#0B0B0F",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
