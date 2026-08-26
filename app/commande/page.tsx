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
      <header className="mb-14 text-center">
        <span className="eyebrow-editorial mb-4 mx-auto text-taupe">Paiement sécurisé</span>
        <h1 className="display-serif on-cream text-[2.2rem] font-normal md:text-[3.4rem]">
          Finaliser ma <em>commande</em>
        </h1>
        <div className="mx-auto mt-6 h-px w-16 bg-or" aria-hidden="true" />
      </header>

      <CheckoutClient />
    </main>
  );
}
