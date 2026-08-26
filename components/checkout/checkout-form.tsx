"use client";

import { useState } from "react";
import Link from "next/link";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { formatCents, type PricedLine } from "./types";
import { AcceptedMethods, SecurityAssurances } from "./payment-badges";

/**
 * Formulaire de commande — mise en page et champs entièrement maison.
 *
 * Stripe ne fournit que le bloc moyen de paiement (<PaymentElement/>) :
 * contact, livraison et récapitulatif sont nos propres composants, dans la
 * charte du site. Les coordonnées saisies ici sont transmises à Stripe au
 * moment de la confirmation via `confirmParams.shipping`, ce qui permet au
 * webhook de les retrouver sur le PaymentIntent.
 */

type Totals = {
  subtotal: number;
  shipping: number;
  amount: number;
  lines: PricedLine[];
  /** Moyens de paiement réellement activés côté Stripe. */
  paymentMethodTypes: string[];
};

const COUNTRIES = [
  { code: "FR", label: "France" },
  { code: "BE", label: "Belgique" },
  { code: "LU", label: "Luxembourg" },
  { code: "CH", label: "Suisse" },
];

type Fields = {
  email: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  postalCode: string;
  city: string;
  country: string;
};

const EMPTY: Fields = {
  email: "",
  name: "",
  phone: "",
  line1: "",
  line2: "",
  postalCode: "",
  city: "",
  country: "FR",
};

export function CheckoutForm({
  totals,
  refreshing,
  onRetry,
}: {
  totals: Totals;
  refreshing: boolean;
  onRetry: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFields((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  function validate(): boolean {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.trim())) next.email = "Email invalide";
    if (fields.name.trim().length < 2) next.name = "Nom requis";
    if (!/^[+0-9 ().-]{6,}$/.test(fields.phone.trim())) next.phone = "Téléphone requis pour la livraison";
    if (fields.line1.trim().length < 4) next.line1 = "Adresse requise";
    if (fields.postalCode.trim().length < 4) next.postalCode = "Code postal requis";
    if (fields.city.trim().length < 2) next.city = "Ville requise";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!stripe || !elements) return;
    if (!validate()) {
      // Ramène l'utilisateur sur le premier champ en défaut plutôt que de
      // le laisser chercher pourquoi rien ne se passe.
      document.querySelector<HTMLElement>("[data-field-error='true']")?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/merci`,
          receipt_email: fields.email.trim(),
          shipping: {
            name: fields.name.trim(),
            phone: fields.phone.trim(),
            address: {
              line1: fields.line1.trim(),
              line2: fields.line2.trim() || undefined,
              postal_code: fields.postalCode.trim(),
              city: fields.city.trim(),
              country: fields.country,
            },
          },
        },
      });

      // On n'arrive ici QUE si la confirmation a échoué : en cas de succès,
      // Stripe redirige le navigateur vers return_url.
      if (error) {
        setFormError(
          error.type === "card_error" || error.type === "validation_error"
            ? error.message || "Le paiement a été refusé."
            : "Le paiement n'a pas abouti. Aucun montant n'a été débité.",
        );
      }
    } catch {
      setFormError("Le paiement n'a pas abouti. Aucun montant n'a été débité.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
      {/* ─── Colonne gauche : saisie ─────────────────────────── */}
      <div className="space-y-12">
        <Section step="01" title="Vos coordonnées">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Email"
              value={fields.email}
              onChange={set("email")}
              error={errors.email}
              type="email"
              autoComplete="email"
              placeholder="votre@email.fr"
            />
            <Field
              label="Téléphone"
              value={fields.phone}
              onChange={set("phone")}
              error={errors.phone}
              type="tel"
              autoComplete="tel"
              placeholder="06 12 34 56 78"
              hint="Le livreur vous contacte pour convenir du créneau."
            />
          </div>
        </Section>

        <Section step="02" title="Adresse de livraison">
          <div className="grid gap-4">
            <Field
              label="Nom complet"
              value={fields.name}
              onChange={set("name")}
              error={errors.name}
              autoComplete="name"
            />
            <Field
              label="Adresse"
              value={fields.line1}
              onChange={set("line1")}
              error={errors.line1}
              autoComplete="address-line1"
              placeholder="12 rue des Lilas"
            />
            <Field
              label="Complément (étage, bâtiment, code)"
              value={fields.line2}
              onChange={set("line2")}
              autoComplete="address-line2"
              optional
            />
            <div className="grid gap-4 sm:grid-cols-[160px_1fr]">
              <Field
                label="Code postal"
                value={fields.postalCode}
                onChange={set("postalCode")}
                error={errors.postalCode}
                autoComplete="postal-code"
                inputMode="numeric"
              />
              <Field
                label="Ville"
                value={fields.city}
                onChange={set("city")}
                error={errors.city}
                autoComplete="address-level2"
              />
            </div>
            <label className="block">
              <span className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">
                Pays
              </span>
              <select
                value={fields.country}
                onChange={set("country")}
                className="w-full rounded-[10px] border border-border bg-ivoire px-3.5 py-3 font-sans text-[15px] text-ink focus:border-or focus:outline-none focus:ring-2 focus:ring-or/25"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Section>

        <Section step="03" title="Paiement">
          {totals.paymentMethodTypes.length > 0 && (
            <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-border pb-6">
              <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">
                Moyens acceptés
              </span>
              <AcceptedMethods types={totals.paymentMethodTypes} />
            </div>
          )}

          <PaymentElement options={{ layout: "tabs" }} />

          <p className="mt-4 flex items-start gap-2 font-sans text-[12px] leading-relaxed text-taupe">
            <LockIcon />
            <span>
              Paiement traité par Stripe. Vos coordonnées bancaires ne transitent jamais par nos
              serveurs et ne sont pas conservées par DreamsFly.
            </span>
          </p>
        </Section>

        <div className="rounded-[20px] bg-sable p-7">
          <SecurityAssurances />
        </div>
      </div>

      {/* ─── Colonne droite : récapitulatif ──────────────────── */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <div className="rounded-[20px] border border-border bg-ivoire p-7">
          <h2 className="display-serif on-cream text-[1.5rem] font-normal">Votre commande</h2>

          <ul className="mt-6 space-y-4 border-b border-border pb-6">
            {totals.lines.map((l) => (
              <li key={l.variantKey} className="flex gap-3 text-[14px]">
                <span className="mt-0.5 min-w-[26px] font-sans text-[12px] text-taupe">
                  {l.quantity}×
                </span>
                <span className="flex-1">
                  <span className="block font-medium text-ink">{l.productName}</span>
                  {l.size && <span className="block font-sans text-[12px] text-pierre">{l.size}</span>}
                </span>
                <span className="font-sans text-[14px] text-ink">{formatCents(l.lineAmount)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-2.5 font-sans text-[14px]">
            <Row label="Sous-total" value={formatCents(totals.subtotal)} />
            <Row label="Livraison à domicile" value={formatCents(totals.shipping)} />
          </dl>

          <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
            <span className="font-sans text-[13px] font-medium uppercase tracking-[0.12em] text-ink">
              Total TTC
            </span>
            <span className="display-serif text-[1.9rem] font-normal text-ink">
              {formatCents(totals.amount)}
            </span>
          </div>

          {formError && (
            <p role="alert" className="mt-5 rounded-[10px] bg-error/10 px-4 py-3 font-sans text-[13px] text-error">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={!stripe || submitting || refreshing}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-pill bg-noir px-6 py-4 font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-ivoire transition-all hover:bg-ink hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {submitting
              ? "Paiement en cours…"
              : refreshing
                ? "Mise à jour…"
                : `Payer ${formatCents(totals.amount)}`}
          </button>

          <p className="mt-3 flex items-center justify-center gap-1.5 font-sans text-[11px] uppercase tracking-[0.12em] text-taupe">
            <LockIcon />
            Paiement chiffré · 3-D Secure
          </p>

          <p className="mt-4 text-center font-sans text-[11px] leading-relaxed text-taupe">
            En validant, vous acceptez nos{" "}
            <Link href="/cgv" className="underline hover:text-noir">
              conditions générales de vente
            </Link>
            .
          </p>

          <ul className="mt-6 space-y-3 border-t border-border pt-6">
            <Perk title="Livraison à domicile">
              5 à 7 jours ouvrés, montée à l'étage incluse par deux livreurs. Rendez-vous confirmé
              par SMS 48 h avant.
            </Perk>
            <Perk title="Reprise de l'ancien matelas">
              Gratuite le jour de la livraison, sur simple demande. Remise à un centre de recyclage
              agréé.
            </Perk>
            <Perk title="Une question ?">
              <a href="tel:0785889260" className="underline hover:text-noir">
                07 85 88 92 60
              </a>{" "}
              ou{" "}
              <a href="mailto:contact@dreamsfly.fr" className="underline hover:text-noir">
                contact@dreamsfly.fr
              </a>
            </Perk>
          </ul>

          <button
            type="button"
            onClick={onRetry}
            className="mt-6 block w-full text-center font-sans text-[11px] uppercase tracking-[0.12em] text-taupe underline hover:text-noir"
          >
            Recalculer le total
          </button>
        </div>

        <Link
          href="/panier"
          className="mt-5 block text-center font-sans text-[12px] uppercase tracking-[0.12em] text-taupe hover:text-noir"
        >
          ← Modifier mon panier
        </Link>
      </aside>
    </form>
  );
}

function Section({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-noir font-sans text-[11px] font-medium text-or">
          {step}
        </span>
        <h2 className="display-serif on-cream text-[1.5rem] font-normal md:text-[1.8rem]">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  hint,
  optional,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  hint?: string;
  optional?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.14em] text-taupe">
        {label}
        {optional && <span className="ml-1.5 normal-case tracking-normal opacity-70">(facultatif)</span>}
      </span>
      <input
        {...rest}
        value={value}
        onChange={onChange}
        data-field-error={error ? "true" : undefined}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-[10px] border bg-ivoire px-3.5 py-3 font-sans text-[15px] text-ink transition-colors placeholder:text-pierre/50 focus:outline-none focus:ring-2 ${
          error
            ? "border-error focus:border-error focus:ring-error/25"
            : "border-border focus:border-or focus:ring-or/25"
        }`}
      />
      {error ? (
        <span className="mt-1.5 block font-sans text-[12px] text-error">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block font-sans text-[12px] text-taupe">{hint}</span>
      ) : null}
    </label>
  );
}

function Perk({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-or" aria-hidden="true" />
      <span>
        <span className="block font-sans text-[12px] font-medium text-ink">{title}</span>
        <span className="block font-sans text-[12px] leading-relaxed text-pierre">{children}</span>
      </span>
    </li>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-pierre">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="mt-0.5 shrink-0 text-or"
      aria-hidden="true"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
