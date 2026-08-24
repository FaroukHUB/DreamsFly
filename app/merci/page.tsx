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
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-24 text-center md:px-10">
      <span className="eyebrow-editorial mb-4 mx-auto text-taupe">Confirmation de commande</span>
      <div className="my-6 h-px w-16 bg-or" aria-hidden="true" />
      <h1 className="display-serif on-cream text-[2.4rem] font-normal md:text-[4rem]">
        Merci pour votre <em>commande</em>.
      </h1>
      <p className="mt-8 max-w-md font-serif text-[18px] italic leading-relaxed text-taupe md:text-[22px]">
        Votre paiement a été reçu. Vous recevrez un email de confirmation dans quelques instants — avec le détail de votre commande et le suivi de livraison.
      </p>
      <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
        <Link
          href="/matelas"
          className="inline-flex items-center gap-3 rounded-pill bg-noir px-7 py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-ivoire transition-all hover:bg-ink hover:-translate-y-px"
        >
          Continuer mes achats
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </Link>
        <Link href="/" className="border-b border-noir pb-1 font-sans text-[12px] uppercase tracking-[0.14em] text-noir hover:text-or hover:border-or">
          Retour à l'accueil
        </Link>
      </div>
      {searchParams?.session_id && (
        <p className="mt-16 font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">
          Référence · {searchParams.session_id.slice(-12)}
        </p>
      )}
    </main>
  );
}
