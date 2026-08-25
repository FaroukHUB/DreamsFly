import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";
import { HeroSlider } from "@/components/hero-slider";

type CTA = { label?: string; link?: string };

export type HeroSlideData = {
  type: "video" | "image" | "promo";
  videoFile?: { asset?: { url?: string } };
  videoPoster?: any;
  image?: any;
  promoBadge?: string;
  promoImage?: any;
  promoPrice?: string;
  title?: string;
  subtitle?: string;
  ctaPrimary?: CTA;
  ctaSecondary?: CTA;
  trustNote?: string;
};

type HeroSecondaryData = {
  enabled?: boolean;
  badge?: string;
  title?: string;
  subtitle?: string;
  image?: any;
  cta?: CTA;
};

export function Hero({
  hero,
  heroSecondary,
  slides,
}: {
  hero?: HeroSlideData;
  heroSecondary?: HeroSecondaryData;
  slides?: HeroSlideData[];
}) {
  const effectiveSlides = slides && slides.length > 0 ? slides : hero ? [hero] : [];
  if (effectiveSlides.length === 0) return <HeroFallback />;

  const showSecondary = heroSecondary?.enabled !== false && heroSecondary?.title;
  const gridCols = showSecondary ? "lg:grid-cols-[1.5fr_1fr]" : "lg:grid-cols-1";

  return (
    <section className={`mx-auto mt-0 grid max-w-site grid-cols-1 gap-4 px-0 md:mt-6 md:px-8 ${gridCols}`}>
      {effectiveSlides.length > 1 ? (
        <HeroSlider slides={effectiveSlides} />
      ) : (
        <div className="relative min-h-[560px] overflow-hidden bg-noir md:min-h-[560px] md:rounded-3xl">
          <HeroSlideMedia slide={effectiveSlides[0]} priority />
          <HeroSlideOverlay slide={effectiveSlides[0]} />
        </div>
      )}
      {showSecondary && <HeroSecondary data={heroSecondary} />}
    </section>
  );
}

/** Rendu media + overlay d'UN slide — utilisé par le slider ET par le mode simple. */
export function HeroSlideMedia({ slide, priority }: { slide: HeroSlideData; priority?: boolean }) {
  if (slide.type === "video") return <HeroVideo slide={slide} />;
  if (slide.type === "image") return <HeroImage slide={slide} priority={priority} />;
  return <HeroPromo slide={slide} />;
}

function HeroVideo({ slide }: { slide: HeroSlideData }) {
  const videoUrl = slide.videoFile?.asset?.url;
  const posterUrl = slide.videoPoster ? urlFor(slide.videoPoster).width(1920).quality(80).url() : undefined;
  if (!videoUrl) return <div className="absolute inset-0 bg-gradient-to-br from-midnight via-midnight-dark to-midnight" />;
  return (
    <video
      src={videoUrl}
      poster={posterUrl}
      autoPlay muted loop playsInline preload="metadata"
      className="absolute inset-0 h-full w-full object-cover"
      aria-hidden="true"
    />
  );
}

function HeroImage({ slide, priority }: { slide: HeroSlideData; priority?: boolean }) {
  if (!slide.image) return null;
  return (
    <Image
      src={urlFor(slide.image).width(1920).quality(85).url()}
      alt={slide.image.alt || slide.title || ""}
      fill sizes="(max-width:1024px) 100vw, 60vw"
      className="object-cover" priority={priority}
    />
  );
}

function HeroPromo({ slide }: { slide: HeroSlideData }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-midnight to-[#1E2F6B]">
      {slide.promoImage && (
        <div className="absolute right-0 top-0 h-full w-1/2">
          <Image src={urlFor(slide.promoImage).width(800).quality(85).url()} alt="" fill sizes="50vw" className="object-contain object-right" />
        </div>
      )}
      {slide.promoPrice && (
        <div className="absolute bottom-6 right-6 rounded-pill bg-or px-5 py-3 font-sora text-sm font-bold text-ink">{slide.promoPrice}</div>
      )}
    </div>
  );
}

export function HeroSlideOverlay({ slide }: { slide: HeroSlideData }) {
  return (
    <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-end p-6 text-white md:min-h-[520px] md:p-14 lg:p-16">
      {/* Vignette sombre pour lisibilité de la typo blanche sur toutes photos */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent md:bg-gradient-to-tr md:from-black/70 md:via-black/20 md:to-transparent" aria-hidden="true" />

      <div className="relative">
        {slide.promoBadge ? (
          <span className="mb-4 inline-block rounded-pill bg-or px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-noir">
            {slide.promoBadge}
          </span>
        ) : (
          <span className="eyebrow-editorial text-or/90 mb-4">Édition automne · manufacture</span>
        )}

        {slide.title && (
          <h1 className="display-serif mb-6 max-w-3xl text-[2.6rem] md:text-[5.6rem] lg:text-[6.8rem]">
            {slide.title.split("\n").map((line, i) => (
              <span key={i} className="block">
                {i % 2 === 1 ? <em>{line}</em> : line}
              </span>
            ))}
          </h1>
        )}

        {slide.subtitle && (
          <p className="mb-8 max-w-md font-sans text-[15px] leading-relaxed text-white/80 md:text-base">
            {slide.subtitle}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          {slide.ctaPrimary?.link && slide.ctaPrimary.label && (
            <Link
              href={slide.ctaPrimary.link}
              className="group inline-flex items-center gap-3 rounded-pill bg-ivoire px-7 py-3.5 font-sans text-sm font-semibold text-noir transition-all hover:bg-or hover:text-noir md:text-base"
            >
              {slide.ctaPrimary.label}
              <ArrowRight />
            </Link>
          )}
          {slide.ctaSecondary?.link && slide.ctaSecondary.label && (
            <Link
              href={slide.ctaSecondary.link}
              className="inline-flex items-center gap-2 border-b border-white/40 pb-1 font-sans text-sm font-medium uppercase tracking-[0.14em] text-white transition-colors hover:border-or hover:text-or"
            >
              {slide.ctaSecondary.label}
            </Link>
          )}
        </div>

        {slide.trustNote && (
          <div className="mt-10 flex items-center gap-4 border-t border-white/15 pt-6">
            <span className="text-or tracking-[0.2em] text-sm">★★★★★</span>
            <p className="font-sans text-xs uppercase tracking-[0.16em] text-white/70">
              {slide.trustNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function HeroSecondary({ data }: { data: HeroSecondaryData }) {
  return (
    <div className="relative min-h-[280px] overflow-hidden bg-gradient-to-br from-creme via-lin to-sable p-6 md:min-h-[520px] md:rounded-3xl md:p-10">
      {data.image && (
        <div className="absolute inset-0">
          <Image src={urlFor(data.image).width(800).quality(80).url()} alt="" fill sizes="40vw" className="object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-t from-creme via-creme/40 to-transparent" />
        </div>
      )}
      <div className="relative z-10 flex h-full flex-col justify-end">
        {data.badge && (
          <span className="eyebrow-editorial on-cream mb-3">
            {data.badge}
          </span>
        )}
        {data.title && (
          <h2 className="display-serif on-cream mb-4 font-normal text-3xl leading-[1.05] md:text-[2.6rem]">
            {data.title.split("\n").map((line, i) => (
              <span key={i} className="block">
                {i % 2 === 1 ? <em>{line}</em> : line}
              </span>
            ))}
          </h2>
        )}
        {data.subtitle && <p className="mb-5 max-w-xs font-sans text-sm leading-relaxed text-taupe md:text-[15px]">{data.subtitle}</p>}
        {data.cta?.link && data.cta.label && (
          <Link href={data.cta.link} className="inline-flex w-fit items-center gap-3 rounded-pill bg-noir px-6 py-3 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-ivoire transition-all hover:bg-ink hover:-translate-y-px md:text-[13px]">
            {data.cta.label}
            <ArrowRight />
          </Link>
        )}
      </div>
    </div>
  );
}

function HeroFallback() {
  return (
    <section className="mx-auto mt-0 max-w-site px-0 md:mt-6 md:px-8">
      <div className="relative min-h-[560px] overflow-hidden bg-noir md:min-h-[560px] md:rounded-3xl">
        <video src="/videos/hero-matelas.mp4" poster="/videos/hero-matelas-poster.jpg" autoPlay muted loop playsInline preload="metadata"
          className="absolute inset-0 h-full w-full object-cover opacity-95" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent md:bg-gradient-to-tr md:from-black/70 md:via-black/20 md:to-transparent" />
        <div className="relative z-10 flex h-full min-h-[560px] flex-col justify-end p-6 text-white md:p-14 lg:p-16">
          <span className="eyebrow-editorial text-or/90 mb-4">Édition automne · manufacture</span>
          <h1 className="display-serif mb-6 max-w-3xl text-[2.6rem] md:text-[5.6rem] lg:text-[6.8rem]">
            Là où la nuit<br />
            <em>prend son envol.</em>
          </h1>
          <p className="mb-8 max-w-md font-sans text-[15px] leading-relaxed text-white/80 md:text-base">
            Le matelas conçu pour votre voyage intérieur.
          </p>
          <Link href="/matelas" className="inline-flex w-fit items-center gap-3 rounded-pill bg-ivoire px-7 py-3.5 font-sans text-sm font-semibold text-noir transition-all hover:bg-or md:text-base">
            Découvrir nos matelas
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
