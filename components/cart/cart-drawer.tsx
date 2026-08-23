"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart/store";

/**
 * Tiroir panier — slide depuis la droite quand isOpen = true.
 * Liste les articles, permet d'ajuster la quantité, ouvre Stripe Checkout.
 */
export function CartDrawer() {
  const { lines, isOpen, close, setQuantity, remove, subtotal, shipping, total } = useCart();

  // Empêche le scroll body quand ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Fermer avec ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
      />

      {/* Drawer */}
      <aside
        aria-label="Panier"
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-ivoire shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b border-border p-5">
          <h2 className="font-sora text-xl font-semibold tracking-tight text-ink">
            Votre panier
            {lines.length > 0 && (
              <span className="ml-2 text-base font-medium text-pierre">
                ({lines.reduce((n, l) => n + l.quantity, 0)})
              </span>
            )}
          </h2>
          <button
            onClick={close}
            aria-label="Fermer le panier"
            className="rounded-full p-2 text-ink transition-colors hover:bg-sable"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-5">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl opacity-30">🛏️</div>
              <p className="mt-4 text-pierre">Votre panier est vide.</p>
              <Link
                href="/matelas"
                onClick={close}
                className="mt-6 inline-flex items-center gap-2 rounded-pill bg-midnight px-6 py-3 font-sora text-sm font-semibold text-white hover:bg-midnight-dark"
              >
                Découvrir nos matelas
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((l) => (
                <li
                  key={l.variantKey}
                  className="flex gap-4 rounded-2xl border border-border bg-ivoire p-3"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-sable">
                    {l.image && (
                      <Image src={l.image} alt={l.productName} fill sizes="80px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/matelas/${l.productSlug}`}
                      onClick={close}
                      className="font-sora text-sm font-semibold leading-tight text-ink hover:text-midnight"
                    >
                      {l.productName}
                    </Link>
                    {l.variantSize && (
                      <span className="mt-0.5 text-xs text-pierre">{l.variantSize}</span>
                    )}
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-pill border border-border bg-ivoire">
                        <button
                          aria-label="Diminuer"
                          onClick={() => setQuantity(l.variantKey, l.quantity - 1)}
                          className="px-2.5 py-1 text-ink hover:text-midnight"
                        >
                          −
                        </button>
                        <span className="min-w-[20px] text-center text-sm font-semibold">{l.quantity}</span>
                        <button
                          aria-label="Augmenter"
                          onClick={() => setQuantity(l.variantKey, l.quantity + 1)}
                          className="px-2.5 py-1 text-ink hover:text-midnight"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-sora text-sm font-bold text-discount">
                        {(l.unitPrice * l.quantity).toFixed(2)} €
                      </span>
                    </div>
                  </div>
                  <button
                    aria-label="Retirer"
                    onClick={() => remove(l.variantKey)}
                    className="self-start text-brume hover:text-error"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer (checkout) */}
        {lines.length > 0 && (
          <footer className="border-t border-border bg-ivoire p-5">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-pierre">Sous-total</span>
              <span className="font-medium text-ink">{subtotal().toFixed(2)} €</span>
            </div>
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-pierre">Livraison (France métropolitaine)</span>
              <span className="font-medium text-ink">{shipping().toFixed(2)} €</span>
            </div>
            <div className="mb-4 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-semibold text-ink">Total TTC</span>
              <span className="font-sora text-2xl font-bold text-ink">
                {total().toFixed(2)} €
              </span>
            </div>

            <CheckoutButton />

            <p className="mt-3 text-center text-xs text-pierre">
              ou <strong className="text-ink">{(total() / 4).toFixed(2)} €</strong> × 4 sans frais via Alma
            </p>
          </footer>
        )}
      </aside>
    </>
  );
}

function CheckoutButton() {
  const lines = useCart((s) => s.lines);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error(data.error || "Erreur checkout");
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={onCheckout}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-pill bg-midnight px-6 py-4 font-sora text-base font-semibold text-white transition-all hover:bg-midnight-dark hover:-translate-y-px disabled:opacity-60"
      >
        {loading ? "Redirection…" : "Passer commande →"}
      </button>
      {error && <p className="mt-2 text-center text-sm text-error">{error}</p>}
    </>
  );
}

// import minimal au sommet local pour useState (re-declaration safe)
import { useState } from "react";
