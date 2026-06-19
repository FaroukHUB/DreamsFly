import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

type QuizCtaData = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaLink?: string;
  backgroundImage?: any;
};

/**
 * Section CTA — image en arrière-plan + overlay sombre + texte centré.
 * Mobile-first : padding et tailles réduites sur mobile.
 */
export function QuizCTA({ data }: { data?: QuizCtaData }) {
  const eyebrow = data?.eyebrow || "Aide au choix · 1 minute";
  const title = data?.title || "Trouvez le matelas idéal pour votre sommeil.";
  const subtitle =
    data?.subtitle ||
    "Notre algorithme vous recommande le modèle DreamsFly parfait selon votre morphologie, votre position de sommeil et vos préférences.";
  const ctaLabel = data?.ctaLabel || "Faire le test";
  const ctaLink = data?.ctaLink || "/quiz";
  const bgUrl = data?.backgroundImage
    ? urlFor(data.backgroundImage).width(1920).quality(85).url()
    : null;

  return (
    <section className="relative overflow-hidden bg-midnight">
      {/* Image de fond */}
      {bgUrl ? (
        <Image
          src={bgUrl}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
      ) : (
        /* Fallback gradient si pas d'image */
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-[#1E2F6B] to-midnight-dark" />
      )}

      {/* Overlay sombre lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/65 to-ink/80" />

      {/* Halo aurora décoratif */}
      <div
        aria-hidden
        className="absolute -bottom-32 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(127,212,245,0.20), transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-24 text-center md:px-8 md:py-32">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-aurora md:text-xs">
          {eyebrow}
        </div>
        <h2 className="mb-4 max-w-2xl font-sora text-3xl font-semibold leading-[1.1] tracking-tight text-white md:mb-6 md:text-5xl lg:text-6xl">
          {title}
        </h2>
        <p className="mb-7 max-w-xl text-base leading-relaxed text-white/85 md:mb-9 md:text-lg">
          {subtitle}
        </p>
        <Link
          href={ctaLink}
          className="inline-flex items-center gap-2 rounded-pill bg-ivoire px-7 py-3.5 font-sora text-sm font-semibold text-midnight transition-all hover:bg-aurora hover:-translate-y-px md:px-8 md:py-4 md:text-base"
        >
          {ctaLabel}
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}
