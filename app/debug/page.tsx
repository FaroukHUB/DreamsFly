/**
 * Page de debug — affiche l'état des variables d'environnement et de Sanity.
 * À visiter pour diagnostiquer le déploiement.
 */

export const dynamic = "force-dynamic";

export default async function DebugPage() {
  const env = {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
      ? `✅ "${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}"`
      : "❌ MANQUANT",
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET
      ? `✅ "${process.env.NEXT_PUBLIC_SANITY_DATASET}"`
      : "❌ MANQUANT",
    NEXT_PUBLIC_SANITY_API_VERSION: process.env.NEXT_PUBLIC_SANITY_API_VERSION
      ? `✅ "${process.env.NEXT_PUBLIC_SANITY_API_VERSION}"`
      : "❌ MANQUANT",
    SANITY_API_WRITE_TOKEN: process.env.SANITY_API_WRITE_TOKEN
      ? `✅ Présent (${process.env.SANITY_API_WRITE_TOKEN.slice(0, 6)}...)`
      : "❌ MANQUANT",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
      ? `✅ "${process.env.NEXT_PUBLIC_SITE_URL}"`
      : "❌ MANQUANT",
    NODE_ENV: process.env.NODE_ENV || "?",
  };

  // Tester la connexion à Sanity
  let sanityStatus = "Non testé";
  let productsCount = 0;
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const { createClient } = await import("next-sanity");
      const client = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
        apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-01-01",
        useCdn: false,
      });
      const result = await client.fetch(`count(*[_type == "product"])`);
      productsCount = result;
      sanityStatus = `✅ Connexion OK — ${result} produits trouvés`;
    } catch (err: any) {
      sanityStatus = `❌ Erreur : ${err.message}`;
    }
  } else {
    sanityStatus = "⚠️  Skip — pas de Project ID";
  }

  return (
    <main style={{ padding: 40, fontFamily: "monospace", maxWidth: 900, margin: "0 auto", lineHeight: 1.7 }}>
      <h1 style={{ fontFamily: "sans-serif" }}>🔧 Debug DreamsFly</h1>
      <p style={{ fontFamily: "sans-serif", color: "#666" }}>
        Si tu vois cette page, Vercel sert correctement les routes Next.js.
      </p>

      <h2 style={{ marginTop: 32, fontFamily: "sans-serif" }}>Variables d'environnement</h2>
      <pre style={{ background: "#f5f5f5", padding: 20, borderRadius: 8 }}>
{Object.entries(env).map(([k, v]) => `${k.padEnd(35)} ${v}`).join("\n")}
      </pre>

      <h2 style={{ marginTop: 32, fontFamily: "sans-serif" }}>Connexion Sanity</h2>
      <pre style={{ background: "#f5f5f5", padding: 20, borderRadius: 8 }}>
{sanityStatus}
      </pre>

      <p style={{ marginTop: 40, fontSize: 12, color: "#999", fontFamily: "sans-serif" }}>
        À supprimer (app/debug/page.tsx) après diagnostic.
      </p>
    </main>
  );
}
