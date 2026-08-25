import type { Metadata, Viewport } from "next";
import { Sora, Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchDialog } from "@/components/search-dialog";
import { ChatWidget } from "@/components/chat-widget";
import { CookieConsent } from "@/components/cookie-consent";

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
  title: {
    default: "DreamsFly — Le matelas pensé pour votre meilleur sommeil",
    template: "%s · DreamsFly",
  },
  description:
    "Découvrez nos matelas conçus en France. Mémoire de forme, ressorts ensachés, mousse polyuréthane. Essai en showroom · Garantie fabricant · Paiement 3× sans frais.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "DreamsFly",
    url: siteUrl,
  },
  alternates: { canonical: siteUrl },
  robots: { index: true, follow: true },
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
