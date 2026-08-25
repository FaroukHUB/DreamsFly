/**
 * Page de test sans dépendances externes — sert à vérifier que Vercel
 * peut servir au moins une page. À supprimer après diagnostic.
 */

import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-static";

export default function TestPage() {
  return (
    <main style={{ padding: "60px 32px", maxWidth: 800, margin: "0 auto", fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 48, marginBottom: 16 }}>✅ DreamsFly — Test page</h1>
      <p style={{ fontSize: 18, color: "#57534E", marginBottom: 24 }}>
        Si tu vois cette page, Vercel sert correctement les routes Next.js.
        Le problème de 404 sur <code>/</code> et <code>/studio</code> vient
        d'une autre source (env vars manquantes, erreur runtime, etc.).
      </p>
      <ul style={{ fontSize: 16, lineHeight: 1.8 }}>
        <li>✓ Build Next.js OK</li>
        <li>✓ Déploiement Vercel OK</li>
        <li>✓ Routing OK</li>
      </ul>
      <p style={{ marginTop: 32, fontSize: 14, color: "#A8A29E" }}>
        Diagnostic page — supprime <code>app/test/page.tsx</code> après usage.
      </p>
    </main>
  );
}
