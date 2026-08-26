import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { ClearCartOnSuccess } from "@/components/checkout/clear-cart-on-success";

export const metadata: Metadata = buildMetadata({
  title: "Merci pour votre commande",
  description: "Votre commande DreamsFly a bien été confirmée.",
  path: "/merci",
  noindex: true,
});

type SearchParams = Promise<{
  payment_intent?: string;
  redirect_status?: string;
  /** Ancien tunnel Checkout hébergé — conservé le temps de la bascule. */
  session_id?: string;
}>;

/**
 * Page de retour après paiement.
 *
 * Stripe redirige ici avec `redirect_status`. Attention : cette page est un
 * simple accusé de réception côté navigateur — c'est le webhook qui fait
 * foi pour l'enregistrement de la commande. On ne promet donc jamais
 * « commande confirmée » sur la seule base de l'URL, qui est falsifiable.
 */
export default async function ThanksPage({ searchParams }: { searchParams?: SearchParams }) {
  const sp = (await searchParams) || {};
  const status = sp.redirect_status;
  const reference = sp.payment_intent || sp.session_id;

  // « processing » : certains moyens de paiement (virement, prélèvement)
  // se règlent en différé. Le client ne doit pas croire que ça a échoué.
  const pending = status === "processing";
  const failed = status === "failed" || status === "requires_payment_method";

  if (failed) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-24 text-center md:px-10">
        <span className="eyebrow-editorial mb-4 mx-auto text-taupe">Paiement</span>
        <div className="my-6 h-px w-16 bg-or" aria-hidden="true" />
        <h1 className="display-serif on-cream text-[2.2rem] font-normal md:text-[3.4rem]">
          Le paiement n'a pas <em>abouti</em>.
        </h1>
        <p className="mt-8 max-w-md font-serif text-[18px] italic leading-relaxed text-taupe md:text-[20px]">
          Aucun montant n'a été débité et votre panier est intact. Vous pouvez réessayer, ou nous
          écrire si le problème persiste.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
          <Link
            href="/commande"
            className="inline-flex items-center gap-3 rounded-pill bg-noir px-7 py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-ivoire transition-all hover:bg-ink hover:-translate-y-px"
          >
            Reprendre ma commande
          </Link>
          <a
            href="mailto:contact@dreamsfly.fr"
            className="border-b border-noir pb-1 font-sans text-[12px] uppercase tracking-[0.14em] text-noir hover:border-or hover:text-or"
          >
            Nous contacter
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-24 text-center md:px-10">
      {/* Le panier n'est vidé qu'ici : tant que le paiement n'a pas abouti,
          le client doit retrouver ses articles s'il revient en arrière. */}
      <ClearCartOnSuccess />

      <span className="eyebrow-editorial mb-4 mx-auto text-taupe">
        {pending ? "Paiement en cours de traitement" : "Confirmation de commande"}
      </span>
      <div className="my-6 h-px w-16 bg-or" aria-hidden="true" />
      <h1 className="display-serif on-cream text-[2.4rem] font-normal md:text-[4rem]">
        Merci pour votre <em>commande</em>.
      </h1>
      <p className="mt-8 max-w-md font-serif text-[18px] italic leading-relaxed text-taupe md:text-[22px]">
        {pending
          ? "Votre paiement est en cours de validation par votre banque. Vous recevrez un email dès qu'il sera confirmé."
          : "Votre paiement a été reçu. Vous recevrez un email de confirmation dans quelques instants — avec le détail de votre commande et les modalités de livraison."}
      </p>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
        <Link
          href="/matelas"
          className="inline-flex items-center gap-3 rounded-pill bg-noir px-7 py-3.5 font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-ivoire transition-all hover:bg-ink hover:-translate-y-px"
        >
          Continuer mes achats
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
        <Link
          href="/"
          className="border-b border-noir pb-1 font-sans text-[12px] uppercase tracking-[0.14em] text-noir hover:border-or hover:text-or"
        >
          Retour à l'accueil
        </Link>
      </div>

      {reference && (
        <p className="mt-16 font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">
          Référence · {reference.slice(-12)}
        </p>
      )}
    </main>
  );
}
