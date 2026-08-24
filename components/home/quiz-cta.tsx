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
  imagePosition?: string;
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
  // Hotspot respecté : Sanity recadre autour du point focal défini dans Studio
  const bgUrl = data?.backgroundImage
    ? urlFor(data.backgroundImage)
        .width(1920)
        .height(720)
        .fit("crop")
        .crop("focalpoint")
        .quality(85)
        .url()
    : null;
  const objectPos = data?.imagePosition || "center";

  return (
    <section className="relative overflow-hidden bg-noir">
      {bgUrl ? (
        <Image
          src={bgUrl}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-70"
          style={{ objectPosition: objectPos }}
          aria-hidden="true"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-noir via-noir-doux to-noir" />
      )}

      {/* Vignette + halo or */}
      <div className="absolute inset-0 bg-gradient-to-b from-noir/60 via-noir/50 to-noir/85" />
      <div
        aria-hidden
        className="absolute -bottom-32 left-1/2 h-[400px] w-[900px] -translate-x-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(200, 168, 118, 0.28), transparent 65%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center justify-center px-6 py-28 text-center md:px-8 md:py-40 reveal">
        <span className="eyebrow-editorial mb-5 mx-auto text-or/90">
          {eyebrow}
        </span>
        <h2 className="display-serif mb-6 max-w-3xl text-[2.2rem] font-normal text-ivoire md:mb-8 md:text-[4.6rem] lg:text-[5.4rem]">
          {typographyEmify(title)}
        </h2>
        <p className="mb-10 max-w-xl font-sans text-[15px] leading-relaxed text-ivoire/70 md:text-base">
          {subtitle}
        </p>
        <Link
          href={ctaLink}
          className="group inline-flex items-center gap-3 rounded-pill bg-ivoire px-8 py-4 font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-noir transition-all hover:bg-or hover:-translate-y-px md:px-10 md:py-4"
        >
          {ctaLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </Link>
      </div>
    </section>
  );
}

function typographyEmify(title: string): React.ReactNode {
  const words = title.trim().split(" ");
  if (words.length < 2) return title;
  const last = words.pop() as string;
  return (
    <>
      {words.join(" ")} <em>{last}</em>
    </>
  );
}
