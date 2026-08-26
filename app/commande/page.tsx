import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { CheckoutClient } from "@/components/checkout/checkout-client";

/**
 * /commande — tunnel de paiement intégré.
 *
 * `noindex` : une page de paiement n'a rien à faire dans l'index Google, et
 * son contenu dépend entièrement du panier du visiteur.
 */
export const metadata: Metadata = buildMetadata({
  title: "Finaliser ma commande",
  description: "Paiement sécurisé de votre commande DreamsFly.",
  path: "/commande",
  noindex: true,
});

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-site px-6 py-16 md:px-10 md:py-24">
      <header className="mb-12 text-center">
        <span className="eyebrow-editorial mb-4 mx-auto text-taupe">Paiement sécurisé</span>
        <h1 className="display-serif on-cream text-[2.2rem] font-normal md:text-[3.4rem]">
          Finaliser ma <em>commande</em>
        </h1>
        <div className="mx-auto mt-6 h-px w-16 bg-or" aria-hidden="true" />
      </header>

      <Steps />

      <CheckoutClient />
    </main>
  );
}

/**
 * Fil d'Ariane du tunnel — situe le client dans le parcours.
 *
 * Purement indicatif : les trois étapes vivent sur la même page, on ne
 * prétend pas à une navigation par étapes qui n'existe pas.
 */
function Steps() {
  const steps = ["Panier", "Livraison", "Paiement"];
  const current = 2; // index de l'étape en cours

  return (
    <ol className="mx-auto mb-14 flex max-w-lg items-center justify-center gap-3 md:gap-5">
      {steps.map((label, i) => (
        <li key={label} className="flex items-center gap-3 md:gap-5">
          <span className="flex items-center gap-2.5">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full font-sans text-[11px] font-medium transition-colors ${
                i <= current ? "bg-noir text-or" : "border border-border bg-ivoire text-taupe"
              }`}
            >
              {i + 1}
            </span>
            <span
              className={`font-sans text-[11px] uppercase tracking-[0.14em] ${
                i <= current ? "text-ink" : "text-taupe"
              }`}
            >
              {label}
            </span>
          </span>
          {i < steps.length - 1 && (
            <span className="h-px w-6 bg-border md:w-12" aria-hidden="true" />
          )}
        </li>
      ))}
    </ol>
  );
}
