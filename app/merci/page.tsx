import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Merci pour votre commande",
  description: "Votre commande DreamsFly a bien été confirmée.",
  path: "/merci",
  noindex: true,
});

export default function ThanksPage({
  searchParams,
}: {
  searchParams?: { session_id?: string };
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-8 py-20 text-center">
      <div className="text-7xl">✨</div>
      <h1 className="mt-8 font-sora text-4xl font-semibold tracking-tight text-ink md:text-5xl">
        Merci pour votre commande !
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-pierre">
        Votre paiement a été reçu. Vous recevrez un email de confirmation dans quelques instants,
        avec le détail de votre commande et le suivi de livraison.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/matelas"
          className="inline-flex items-center gap-2 rounded-pill bg-midnight px-7 py-3.5 font-sora text-base font-semibold text-white transition-all hover:bg-midnight-dark"
        >
          Continuer mes achats
        </Link>
        <Link href="/" className="text-sm font-medium text-pierre hover:text-midnight">
          Retour à l'accueil
        </Link>
      </div>
      {searchParams?.session_id && (
        <p className="mt-12 text-xs text-brume">Référence : {searchParams.session_id.slice(-12)}</p>
      )}
    </main>
  );
}
