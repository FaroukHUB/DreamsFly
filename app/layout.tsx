import type { Metadata, Viewport } from "next";
import { Sora, Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchDialog } from "@/components/search-dialog";
import { ChatWidget } from "@/components/chat-widget";
import { CookieConsent } from "@/components/cookie-consent";
import { INDEXING_ENABLED } from "@/lib/seo/metadata";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamsfly.fr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // SEUL endroit du site où le nom de marque est ajouté à un titre.
  // `buildMetadata` renvoie volontairement des titres sans marque : c'est
  // ce template qui la suffixe, une fois et une seule.
  title: {
    default: "DreamsFly",
    template: "%s | DreamsFly",
  },
  description:
    "Découvrez nos matelas conçus en France. Mémoire de forme, ressorts ensachés, mousse polyuréthane. Essai en showroom · Garantie fabricant · Paiement 3× sans frais.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "DreamsFly",
    url: siteUrl,
  },
  // Pas de canonical globale : héritée par toute page qui n'en déclare pas,
  // elle désignait l'accueil comme canonical de pages sans rapport.
  // Chaque route publie la sienne via buildMetadata.
  robots: INDEXING_ENABLED
    ? { index: true, follow: true }
    : { index: false, follow: false },
  // Vérification Google Search Console — définir GOOGLE_SITE_VERIFICATION sur Vercel
  // (Search Console → Paramètres → Validation de la propriété → balise HTML → copier le content)
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: "#FBF9F4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sora.variable} ${jakarta.variable} ${cormorant.variable}`}>
      <body>
        {children}
        <CartDrawer />
        <SearchDialog />
        <ChatWidget />
        <CookieConsent />
      </body>
    </html>
  );
}
