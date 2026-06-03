import type { Metadata, Viewport } from "next";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartDrawer } from "@/components/cart/cart-drawer";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamsfly.fr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DreamsFly — Le matelas pensé pour votre meilleur sommeil",
    template: "%s · DreamsFly",
  },
  description:
    "Découvrez nos matelas conçus en France. Mémoire de forme, ressorts ensachés, mousse polyuréthane. Livraison offerte · Essai 100 nuits · Garantie 5 ans.",
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
    <html lang="fr" className={`${sora.variable} ${jakarta.variable}`}>
      <body>
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}
