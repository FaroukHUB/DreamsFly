/**
 * Bandeau trust signals visible juste sous le hero — ABOVE THE FOLD.
 * Avis Google + certifications + mentions presse / labels.
 */
type TrustBarProps = {
  googleRating?: { value: number; count: number };
  labels?: { label: string; sublabel?: string }[];
  press?: { name: string }[];
};

export function TrustBar({ googleRating, labels, press }: TrustBarProps = {}) {
  const rating = googleRating || { value: 4.9, count: 5000 };
  const labelsToShow =
    labels && labels.length > 0
      ? labels
      : [
          { label: "OEKO-TEX®", sublabel: "Standard 100" },
          { label: "Confection française", sublabel: "Ateliers européens" },
          { label: "Garantie 2 ans", sublabel: "Service après-vente" },
        ];

  return (
    <section
      aria-label="Avis et certifications"
      className="border-y border-border bg-ivoire"
    >
      <div className="mx-auto flex max-w-site flex-wrap items-center justify-between gap-8 px-8 py-6">
        {/* Avis Google */}
        <a
          href="#avis"
          className="flex items-center gap-4 group"
        >
          <div className="flex items-center gap-1.5">
            <GoogleLogo />
            <span className="font-sora text-2xl font-bold tracking-tight text-ink">
              {rating.value.toLocaleString("fr-FR", { minimumFractionDigits: 1 })}
            </span>
            <span className="text-or text-base">★★★★★</span>
          </div>
          <div className="border-l border-border pl-4">
            <div className="text-sm font-semibold text-ink group-hover:text-midnight">
              Plus de {(rating.count / 1000).toFixed(0)} 000 avis vérifiés
            </div>
            <div className="text-xs text-pierre">sur l'ensemble du groupe</div>
          </div>
        </a>

        {/* Labels */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {labelsToShow.map((l, i) => (
            <div key={i} className="flex flex-col">
              <span className="font-sora text-[13px] font-semibold uppercase tracking-wider text-ink">
                {l.label}
              </span>
              {l.sublabel && (
                <span className="text-[11.5px] text-pierre">{l.sublabel}</span>
              )}
            </div>
          ))}
        </div>

        {/* Presse (optionnel) */}
        {press && press.length > 0 && (
          <div className="hidden items-center gap-4 border-l border-border pl-6 lg:flex">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-brume">
              Vus dans
            </span>
            <div className="flex items-center gap-4">
              {press.map((p, i) => (
                <span key={i} className="font-sora text-sm font-semibold text-pierre">
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function GoogleLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-label="Google" role="img">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
