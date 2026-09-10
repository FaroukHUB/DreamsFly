"use client";
import { useEffect, useRef, useState } from "react";
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
  const bannerRef = useRef<HTMLDivElement | null>(null);

  /**
   * Signale au reste de la page qu'un bandeau occupe le bas de l'écran, et
   * publie sa hauteur réelle dans `--df-cookie-banner-h`.
   *
   * Le hero ancre son contenu en bas : à la première visite, ses boutons se
   * retrouvaient derrière ce bandeau sur mobile. Plutôt que de réserver en
   * permanence une marge que 99 % des visites n'utilisent pas — le choix est
   * mémorisé six mois — la page ne se décale que tant que le bandeau est là.
   *
   * La hauteur est MESURÉE et non estimée : elle varie avec la largeur de
   * l'écran et le retour à la ligne du texte, et un `ResizeObserver` suit
   * cette variation, y compris à la rotation de l'appareil.
   */
  useEffect(() => {
    const root = document.documentElement;
    if (!visible) {
      delete root.dataset.cookieBanner;
      root.style.removeProperty("--df-cookie-banner-h");
      return;
    }

    root.dataset.cookieBanner = "visible";
    const node = bannerRef.current;
    if (!node) return;

    const publishHeight = () => {
      root.style.setProperty("--df-cookie-banner-h", `${Math.ceil(node.getBoundingClientRect().height)}px`);
    };
    publishHeight();

    // `ResizeObserver` est absent des navigateurs anciens : sans lui la
    // hauteur reste celle du premier rendu, ce qui reste correct.
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(publishHeight) : null;
    observer?.observe(node);

    return () => {
      observer?.disconnect();
      delete root.dataset.cookieBanner;
      root.style.removeProperty("--df-cookie-banner-h");
    };
  }, [visible]);

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
      ref={bannerRef}
      role="dialog"
      aria-label="Gestion des cookies"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[180] border-t border-white/10 bg-noir px-4 py-4 text-ivoire shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.5)] sm:px-5 sm:py-5 md:px-8 md:py-6"
    >
      <div className="mx-auto flex max-w-site flex-col gap-3.5 sm:gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="font-serif text-[16px] leading-snug text-ivoire md:text-[17px]">
            Vos préférences, votre choix.
          </p>
          <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-ivoire/70">
            {/* Deux formulations du MÊME message : l'information essentielle
                — cookies techniques seulement, mesure d'audience soumise au
                consentement — est présente dans les deux, avec le lien vers
                la page dédiée. La version courte évite au bandeau d'occuper
                la moitié d'un petit écran. */}
            <span className="sm:hidden">
              Seuls des cookies essentiels sont utilisés. La mesure d'audience ne
              sera activée qu'avec votre accord.
            </span>
            <span className="hidden sm:inline">
              Nous n'utilisons que des cookies essentiels au fonctionnement du site
              (panier, sécurité). Les cookies de mesure d'audience ne seront activés
              qu'avec votre accord.
            </span>{" "}
            <Link href="/cookies" className="border-b border-or/60 text-or hover:border-or">
              En savoir plus
            </Link>
          </p>
        </div>

        {/* CNIL : refuser aussi simple qu'accepter — deux boutons identiques */}
        <div className="flex flex-shrink-0 flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => choose(false)}
            className="flex-1 rounded-pill border border-white/30 px-4 py-2.5 text-center font-sans text-[11.5px] font-medium uppercase tracking-[0.12em] sm:flex-none sm:px-6 sm:py-3 sm:text-[12px] sm:tracking-[0.14em] text-ivoire transition-colors hover:border-or hover:text-or"
          >
            Tout refuser
          </button>
          <button
            onClick={() => choose(true)}
            className="flex-1 rounded-pill bg-or px-4 py-2.5 text-center font-sans text-[11.5px] font-medium uppercase tracking-[0.12em] sm:flex-none sm:px-6 sm:py-3 sm:text-[12px] sm:tracking-[0.14em] text-noir transition-all hover:bg-or-dark"
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
