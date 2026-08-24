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
    <section className="mx-auto max-w-site px-6 py-24 md:px-10">
      <div className="relative overflow-hidden rounded-[32px] bg-noir px-8 py-20 text-center md:px-16 md:py-28">
        {/* Halo or */}
        <div
          aria-hidden
          className="absolute -top-32 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(200,168,118,0.28), transparent 60%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-xl">
          <span className="eyebrow-editorial mb-3 mx-auto">Newsletter</span>
          <h2 className="display-serif mt-5 text-[2rem] font-normal text-ivoire md:text-[3.4rem]">
            {title}
          </h2>
          <p className="mt-6 font-serif text-[17px] italic leading-relaxed text-ivoire/70 md:text-[19px]">{subtitle}</p>

          {status === "success" ? (
            <div className="mt-10 border-t border-white/15 pt-8">
              <span className="text-or text-2xl">◆</span>
              <div className="mt-3 display-serif text-[1.4rem] font-normal text-ivoire">Inscription confirmée</div>
              <p className="mt-2 font-sans text-[14px] leading-relaxed text-ivoire/70">
                Votre code de réduction arrive par email dans quelques instants.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.fr"
                  className="flex-1 rounded-pill border border-white/15 bg-white/5 px-6 py-4 font-serif text-[16px] italic text-ivoire placeholder:text-ivoire/40 focus:border-or focus:outline-none focus:ring-2 focus:ring-or/30"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-pill bg-or px-8 py-4 font-sans text-[12px] font-medium uppercase tracking-[0.16em] text-noir transition-all hover:bg-or-dark hover:-translate-y-px disabled:opacity-60"
                >
                  {status === "loading" ? "Envoi…" : "S'inscrire"}
                </button>
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-left font-sans text-[12px] leading-relaxed text-ivoire/60">
                <input
                  type="checkbox"
                  checked={rgpd}
                  onChange={(e) => setRgpd(e.target.checked)}
                  className="mt-0.5 accent-or"
                />
                <span>{rgpdText}</span>
              </label>

              {error && <p className="font-sans text-[13px] text-error">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
