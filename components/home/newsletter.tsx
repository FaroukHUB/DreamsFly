"use client";
import { useState } from "react";

/**
 * Newsletter midnight — inscription email avec promesse de -10%.
 * Compose le hook /api/newsletter (à brancher Resend/Mailchimp Étape 5+).
 */
export function Newsletter({
  title = "Recevez −10 % sur votre première commande",
  subtitle = "Conseils d'experts du sommeil, nouveautés et offres exclusives. Pas de spam, promis.",
  rgpdText = "J'ai lu et j'accepte la politique de confidentialité de DreamsFly.",
}: {
  title?: string;
  subtitle?: string;
  rgpdText?: string;
}) {
  const [email, setEmail] = useState("");
  const [rgpd, setRgpd] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rgpd) {
      setError("Veuillez accepter notre politique de confidentialité.");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      // TODO: brancher Resend audience ou Mailchimp dans /api/newsletter
      await new Promise((r) => setTimeout(r, 600));
      setStatus("success");
    } catch {
      setStatus("error");
      setError("Une erreur est survenue, réessayez dans un instant.");
    }
  }

  return (
    <section className="mx-auto max-w-site px-8 py-20">
      <div className="relative overflow-hidden rounded-3xl bg-midnight px-8 py-16 text-center md:px-12 md:py-20">
        {/* Halo aurora */}
        <div
          aria-hidden
          className="absolute -top-32 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(127,212,245,0.2), transparent 60%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-xl">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-aurora">
            Newsletter
          </div>
          <h2 className="font-sora text-3xl font-semibold leading-tight tracking-tight text-white md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/80">{subtitle}</p>

          {status === "success" ? (
            <div className="mt-8 rounded-2xl border border-aurora/40 bg-aurora/10 p-6 text-center text-white">
              <div className="text-2xl">✓</div>
              <div className="mt-2 font-sora text-lg font-semibold">Inscription confirmée !</div>
              <p className="mt-1 text-sm text-white/75">
                Votre code de réduction arrive par email dans quelques instants.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  className="flex-1 rounded-pill border border-white/20 bg-white/10 px-5 py-3.5 font-sans text-[15px] text-white placeholder:text-white/45 focus:border-aurora focus:outline-none focus:ring-2 focus:ring-aurora/30"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-pill bg-ivoire px-7 py-3.5 font-sora text-[15px] font-semibold text-midnight transition-all hover:bg-aurora hover:-translate-y-px disabled:opacity-60"
                >
                  {status === "loading" ? "Envoi…" : "S'inscrire"}
                </button>
              </div>

              <label className="flex cursor-pointer items-start gap-2 text-left text-xs text-white/70">
                <input
                  type="checkbox"
                  checked={rgpd}
                  onChange={(e) => setRgpd(e.target.checked)}
                  className="mt-0.5 accent-aurora"
                />
                <span>{rgpdText}</span>
              </label>

              {error && <p className="text-sm text-error">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
