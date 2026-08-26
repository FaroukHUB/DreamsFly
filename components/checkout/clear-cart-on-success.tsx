"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart/store";

/**
 * Vide le panier à l'arrivée sur la page de remerciement.
 *
 * Placé ici plutôt que dans le formulaire : `confirmPayment` provoque une
 * redirection navigateur, donc tout code exécuté après lui dans le tunnel
 * ne l'est jamais. Et si le paiement échoue, le client revient sur
 * /commande avec son panier intact.
 */
export function ClearCartOnSuccess({ confirmed }: { confirmed: boolean }) {
  const clear = useCart((s) => s.clear);

  useEffect(() => {
    // Sans confirmation de Stripe, on ne touche à rien : quelqu'un qui
    // ouvre /merci par curiosité ou par un lien en favori ne doit pas
    // perdre son panier.
    if (!confirmed) return;
    clear();
    try {
      // Le paiement est terminé : la prochaine commande doit repartir sur
      // une intention neuve, pas tenter de réutiliser celle-ci.
      sessionStorage.removeItem("df:payment-intent");
    } catch {
      // Stockage indisponible — sans conséquence, la route recrée une
      // intention si l'ancienne n'est plus modifiable.
    }
  }, [clear, confirmed]);

  return null;
}
