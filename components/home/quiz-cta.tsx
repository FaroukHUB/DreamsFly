import Link from "next/link";

type QuizCtaData = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaLink?: string;
};

/**
 * Section CTA midnight — « Trouvez votre matelas idéal ».
 * Visuel signature DreamsFly : matelas en couches animées + avion en
 * arrière-plan + halo aurora.
 */
export function QuizCTA({ data }: { data?: QuizCtaData }) {
  const eyebrow = data?.eyebrow || "Aide au choix · 1 minute";
  const title = data?.title || "Trouvez le matelas idéal pour votre sommeil.";
  const subtitle =
    data?.subtitle ||
    "Notre algorithme vous recommande le modèle DreamsFly parfait selon votre morphologie, votre position de sommeil et vos préférences.";
  const ctaLabel = data?.ctaLabel || "Faire le quiz";
  const ctaLink = data?.ctaLink || "/quiz";

  return (
    <section className="relative overflow-hidden bg-midnight py-24">
      {/* Halo aurora */}
      <div
        aria-hidden
        className="absolute -bottom-32 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(127,212,245,0.22), transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-site items-center gap-12 px-8 lg:grid-cols-[1fr_1.2fr]">
        {/* Texte */}
        <div>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-aurora">
            {eyebrow}
          </div>
          <h2 className="font-sora text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            {title}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/80">
            {subtitle}
          </p>
          <Link
            href={ctaLink}
            className="mt-8 inline-flex items-center gap-2 rounded-pill bg-ivoire px-8 py-4 font-sora text-base font-semibold text-midnight transition-all hover:bg-aurora hover:-translate-y-px"
          >
            {ctaLabel}
            <span>→</span>
          </Link>
        </div>

        {/* Visuel matelas en couches animées */}
        <div className="relative flex h-[420px] items-center justify-center">
          {/* Petit avion en arrière-plan */}
          <svg
            aria-hidden
            className="absolute left-0 top-[10%] animate-[planeFly_14s_linear_infinite] opacity-80"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M21 14L3 14L11 7L13 7L21 14Z M11 14L11 19L9 21L9 14 M13 14L13 19L15 21L15 14"
              fill="#38BDF8"
            />
          </svg>

          <MattressLayered />
        </div>
      </div>

      <style>{`
        @keyframes planeFly {
          0% { transform: translateX(0) translateY(0); opacity: 0; }
          10% { opacity: 0.85; }
          50% { transform: translateX(280px) translateY(-30px); }
          90% { opacity: 0.85; }
          100% { transform: translateX(560px) translateY(-60px); opacity: 0; }
        }
        @keyframes layerInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

function MattressLayered() {
  return (
    <svg
      viewBox="0 0 560 380"
      width="100%"
      style={{ maxWidth: 580 }}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Schéma des couches d'un matelas DreamsFly"
    >
      {/* Ombre */}
      <ellipse cx="280" cy="350" rx="220" ry="10" fill="#000" opacity="0.3" />

      {/* Base */}
      <g style={{ animation: "layerInUp 0.7s ease-out 0.1s both" }}>
        <rect x="60" y="290" width="440" height="45" rx="6" fill="#0F172A" />
        <rect x="80" y="335" width="14" height="20" rx="2" fill="#000" />
        <rect x="466" y="335" width="14" height="20" rx="2" fill="#000" />
      </g>

      {/* Ressorts ensachés */}
      <g style={{ animation: "layerInUp 0.7s ease-out 0.25s both" }}>
        <rect x="60" y="215" width="440" height="75" rx="4" fill="#FBF9F4" stroke="#D9DDE4" strokeWidth="1" />
        <g opacity="0.6">
          {Array.from({ length: 15 }).map((_, i) => {
            const cx = 90 + i * 28;
            return (
              <g key={i}>
                <circle cx={cx} cy="252" r="9" fill="none" stroke="#94A3B8" strokeWidth="1.2" />
                <circle cx={cx} cy="252" r="4" fill="none" stroke="#94A3B8" strokeWidth="1.2" />
              </g>
            );
          })}
        </g>
      </g>

      {/* Mousse transition */}
      <g style={{ animation: "layerInUp 0.7s ease-out 0.4s both" }}>
        <rect x="60" y="180" width="440" height="35" rx="4" fill="#F6F7F9" />
      </g>

      {/* Mémoire de forme avec glow */}
      <g style={{ animation: "layerInUp 0.7s ease-out 0.55s both" }}>
        <rect x="60" y="145" width="440" height="35" rx="4" fill="#172554" />
        <ellipse
          cx="280"
          cy="163"
          rx="180"
          ry="8"
          fill="url(#mattressGlow)"
          opacity="0.6"
        />
      </g>

      {/* Housse */}
      <g style={{ animation: "layerInUp 0.7s ease-out 0.7s both" }}>
        <rect x="60" y="110" width="440" height="35" rx="6" fill="#FBF9F4" stroke="#D9DDE4" strokeWidth="1" />
        <g opacity="0.4">
          {[100, 160, 220, 280, 340, 400, 460].map((x) => (
            <line key={x} x1={x} y1="115" x2={x} y2="140" stroke="#94A3B8" strokeWidth="0.6" />
          ))}
        </g>
      </g>

      <defs>
        <radialGradient id="mattressGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7FD4F5" stopOpacity="1" />
          <stop offset="100%" stopColor="#7FD4F5" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
