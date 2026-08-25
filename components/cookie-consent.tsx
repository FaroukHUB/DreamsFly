"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Bannière de consentement cookies — conforme CNIL.
 *
 * Règles respectées :
 *  - « Tout refuser » aussi visible et accessible que « Tout accepter »
 *    (même rangée, même taille)
 *  - Aucun traceur non essentiel déposé avant consentement (le site n'en
 *    pose d'ailleurs aucun aujourd'hui — la bannière gate les futurs
 *    outils analytics/marketing)
 *  - Choix conservé 6 mois puis redemandé
 *  - Révocable à tout moment via « Gérer les cookies » dans le footer
 *    (événement 'df:open-cookie-consent')
 *
 * Le choix est exposé sur window.dfConsent et via l'événement
 * 'df:consent-change' — tout futur script analytics doit vérifier
 * window.dfConsent?.analytics === true avant de se charger.
 */

const LS_KEY = "df:cookie-consent";
const MAX_AGE_MS = 6 * 30 * 24 * 60 * 60 * 1000; // ~6 mois

type Consent = { analytics: boolean; ts: number };

function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    if (!parsed || typeof parsed.ts !== "number") return null;
    if (Date.now() - parsed.ts > MAX_AGE_MS) return null; // expiré → redemander
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(analytics: boolean) {
  const consent: Consent = { analytics, ts: Date.now() };
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(consent));
  } catch {}
  (window as any).dfConsent = consent;
  window.dispatchEvent(new CustomEvent("df:consent-change", { detail: consent }));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      (window as any).dfConsent = existing;
    } else {
      setVisible(true);
    }
    // Réouverture depuis le footer (« Gérer les cookies »)
    const reopen = () => setVisible(true);
    window.addEventListener("df:open-cookie-consent", reopen);
    return () => window.removeEventListener("df:open-cookie-consent", reopen);
  }, []);

  if (!visible) return null;

  function choose(analytics: boolean) {
    writeConsent(analytics);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Gestion des cookies"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[180] border-t border-white/10 bg-noir px-5 py-5 text-ivoire shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.5)] md:px-8 md:py-6"
    >
      <div className="mx-auto flex max-w-site flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="font-serif text-[16px] leading-snug text-ivoire md:text-[17px]">
            Vos préférences, votre choix.
          </p>
          <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-ivoire/70">
            Nous n'utilisons que des cookies essentiels au fonctionnement du site
            (panier, sécurité). Les cookies de mesure d'audience ne seront activés
            qu'avec votre accord.{" "}
            <Link href="/cookies" className="border-b border-or/60 text-or hover:border-or">
              En savoir plus
            </Link>
          </p>
        </div>

        {/* CNIL : refuser aussi simple qu'accepter — deux boutons identiques */}
        <div className="flex flex-shrink-0 flex-wrap items-center gap-3">
          <button
            onClick={() => choose(false)}
            className="rounded-pill border border-white/30 px-6 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-ivoire transition-colors hover:border-or hover:text-or"
          >
            Tout refuser
          </button>
          <button
            onClick={() => choose(true)}
            className="rounded-pill bg-or px-6 py-3 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-noir transition-all hover:bg-or-dark"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}

/** Bouton « Gérer les cookies » — à poser dans le footer (révocabilité CNIL). */
export function ManageCookiesButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("df:open-cookie-consent"))}
      className={className || "hover:text-or"}
    >
      Gérer les cookies
    </button>
  );
}
