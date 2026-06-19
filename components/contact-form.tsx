"use client";
import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const data = new FormData(e.currentTarget);
    const payload = Object.fromEntries(data.entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Erreur d'envoi");
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Une erreur est survenue");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-success/40 bg-success/10 p-6 text-center">
        <div className="text-3xl">✓</div>
        <div className="mt-2 font-sora text-lg font-semibold text-ink">Message envoyé !</div>
        <p className="mt-1 text-sm text-pierre">Nous vous répondons sous 24h ouvrées.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Votre nom" required />
        <Field name="email" label="Email" type="email" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="phone" label="Téléphone (optionnel)" type="tel" />
        <SelectField
          name="subject"
          label="Sujet"
          required
          options={[
            "Conseil avant achat",
            "Suivi de ma commande",
            "Garantie / retour",
            "Livraison",
            "Showroom",
            "Autre",
          ]}
        />
      </div>
      <TextareaField name="message" label="Votre message" required rows={5} />

      {error && <p className="text-sm text-error">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-pill bg-midnight px-7 py-4 font-sora text-base font-semibold text-white transition-all hover:bg-midnight-dark hover:-translate-y-px disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Envoi en cours…" : "Envoyer le message"}
      </button>

      <p className="text-xs text-brume">
        En envoyant ce message, vous acceptez notre politique de confidentialité.
      </p>
    </form>
  );
}

function Field({ name, label, type = "text", required }: any) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-ink">{label}{required && " *"}</span>
      <input
        name={name}
        type={type}
        required={required}
        className="rounded-xl border border-border bg-ivoire px-4 py-3 text-sm text-ink focus:border-midnight focus:outline-none focus:ring-2 focus:ring-midnight/20"
      />
    </label>
  );
}

function SelectField({ name, label, options, required }: any) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-ink">{label}{required && " *"}</span>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="rounded-xl border border-border bg-ivoire px-4 py-3 text-sm text-ink focus:border-midnight focus:outline-none focus:ring-2 focus:ring-midnight/20"
      >
        <option value="" disabled>Choisir un sujet</option>
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function TextareaField({ name, label, rows = 4, required }: any) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-ink">{label}{required && " *"}</span>
      <textarea
        name={name}
        rows={rows}
        required={required}
        className="resize-none rounded-xl border border-border bg-ivoire px-4 py-3 text-sm text-ink focus:border-midnight focus:outline-none focus:ring-2 focus:ring-midnight/20"
      />
    </label>
  );
}
