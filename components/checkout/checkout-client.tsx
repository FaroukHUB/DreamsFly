"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "@/lib/cart/store";
import { CheckoutForm } from "./checkout-form";
import type { PricedLine } from "./types";

/**
 * Tunnel de paiement intégré — le client ne quitte jamais dreamsfly.fr.
 *
 * Ce composant a une seule responsabilité : obtenir un `clientSecret`
 * auprès de /api/payment-intent, puis monter le contexte Stripe autour du
 * formulaire. Toute la logique de paiement vit dans <CheckoutForm/>.
 *
 * Les montants affichés à droite sont ceux renvoyés par le serveur, jamais
 * ceux du panier local : si le prix d'un produit a changé depuis que le
 * client l'a ajouté, il voit le vrai montant avant de payer.
 */

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

/** Reprise du paiement en cours après un rechargement de page. */
const INTENT_STORAGE_KEY = "df:payment-intent";

type Totals = {
  subtotal: number;
  shipping: number;
  amount: number;
  lines: PricedLine[];
};

export function CheckoutClient() {
  const lines = useCart((s) => s.lines);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Conservé hors du state : sa modification ne doit pas relancer le rendu,
  // elle sert uniquement à réutiliser le même paiement d'un appel à l'autre.
  // Persisté en sessionStorage pour qu'un rechargement de la page reprenne
  // le paiement en cours au lieu d'en ouvrir un nouveau — sinon chaque F5
  // laisserait derrière lui une commande « en attente » orpheline.
  const intentIdRef = useRef<string | null>(null);
  if (intentIdRef.current === null && typeof window !== "undefined") {
    intentIdRef.current = sessionStorage.getItem(INTENT_STORAGE_KEY);
  }

  // Signature stable du panier : évite de rappeler l'API à chaque rendu.
  const cartSignature = useMemo(
    () =>
      lines
        .map((l) => `${l.productId}:${l.variantKey}:${l.quantity}`)
        .sort()
        .join("|"),
    [lines],
  );

  const syncPayment = useCallback(async () => {
    if (lines.length === 0) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // On n'envoie QUE des références : le serveur relit les prix.
          lines: lines.map((l) => ({
            productId: l.productId,
            variantKey: l.variantKey,
            quantity: l.quantity,
          })),
          ...(intentIdRef.current ? { paymentIntentId: intentIdRef.current } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Le paiement n'a pas pu être préparé.");

      const previousId = intentIdRef.current;
      intentIdRef.current = data.paymentIntentId;
      try {
        sessionStorage.setItem(INTENT_STORAGE_KEY, data.paymentIntentId);
      } catch {
        // Navigation privée ou stockage bloqué : on continue sans mémoriser.
      }

      setTotals({
        subtotal: data.subtotal,
        shipping: data.shipping,
        amount: data.amount,
        lines: data.lines || [],
      });

      setClientSecret((prev) => {
        // Premier passage : on monte l'Element sur ce secret.
        if (!prev) return data.clientSecret;
        // Le serveur a dû ouvrir une NOUVELLE intention (l'ancienne n'était
        // plus modifiable). Garder l'ancien secret ferait payer le client
        // sur une intention périmée — il faut remonter l'Element.
        if (previousId && previousId !== data.paymentIntentId) return data.clientSecret;
        // Même intention, montant simplement mis à jour : on conserve le
        // secret, sinon le PaymentElement serait démonté et la carte déjà
        // saisie effacée.
        return prev;
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [lines]);

  useEffect(() => {
    void syncPayment();
    // syncPayment dépend de `lines`, mais on veut relancer sur le contenu
    // réel du panier — pas sur chaque nouvelle référence de tableau.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartSignature]);

  if (!stripePromise) {
    return (
      <Notice title="Paiement indisponible">
        Le module de paiement n'est pas configuré. Écrivez-nous à{" "}
        <a href="mailto:contact@dreamsfly.fr" className="underline">
          contact@dreamsfly.fr
        </a>{" "}
        pour finaliser votre commande.
      </Notice>
    );
  }

  if (lines.length === 0) {
    return (
      <Notice title="Votre panier est vide">
        <Link href="/matelas" className="underline">
          Découvrir nos matelas
        </Link>
      </Notice>
    );
  }

  if (error && !clientSecret) {
    return (
      <Notice title="Commande impossible">
        {error}
        <button onClick={() => void syncPayment()} className="mt-4 block underline">
          Réessayer
        </button>
      </Notice>
    );
  }

  if (!clientSecret || !totals) {
    return (
      <Notice title="Préparation de votre commande">
        <span className="animate-pulse">Un instant…</span>
      </Notice>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        locale: "fr",
        // Aligne les champs Stripe sur la charte du site — mêmes polices,
        // même or, mêmes arrondis que le reste des formulaires.
        appearance: {
          theme: "flat",
          variables: {
            colorPrimary: "#C8A876",
            colorBackground: "#FFFFFF",
            colorText: "#0F172A",
            colorDanger: "#EF4444",
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSizeBase: "15px",
            borderRadius: "10px",
            spacingUnit: "4px",
          },
          rules: {
            ".Input": { border: "1px solid #E2E8F0", boxShadow: "none", padding: "12px 14px" },
            ".Input:focus": { border: "1px solid #C8A876", boxShadow: "0 0 0 3px rgba(200,168,118,.25)" },
            ".Label": {
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "#8B7355",
              marginBottom: "6px",
            },
          },
        },
      }}
    >
      <CheckoutForm totals={totals} refreshing={loading} onRetry={syncPayment} />
    </Elements>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-lg py-24 text-center">
      <span className="eyebrow-editorial mb-4 mx-auto text-taupe">Commande</span>
      <h1 className="display-serif on-cream text-[2rem] font-normal md:text-[2.6rem]">{title}</h1>
      <div className="mt-6 font-sans text-[14px] leading-relaxed text-pierre">{children}</div>
    </div>
  );
}
