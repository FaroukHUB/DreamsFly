import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";

type CTA = { label?: string; link?: string };

type HeroData = {
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

/**
 * Hero modulaire — mobile full-width edge-to-edge, desktop avec margins.
 */
export function Hero({
  hero,
  heroSecondary,
}: {
  hero?: HeroData;
  heroSecondary?: HeroSecondaryData;
}) {
  if (!hero) return <HeroFallback />;

  const showSecondary = heroSecondary?.enabled !== false && heroSecondary?.title;
  const gridCols = showSecondary ? "lg:grid-cols-[1.5fr_1fr]" : "lg:grid-cols-1";

  return (
    <section className={`mx-auto mt-0 grid max-w-site grid-cols-1 gap-4 px-0 md:mt-6 md:px-8 ${gridCols}`}>
      <div className="relative min-h-[480px] overflow-hidden bg-midnight md:min-h-[420px] md:rounded-3xl">
        {hero.type === "video" && <HeroVideo hero={hero} />}
        {hero.type === "image" && <HeroImage hero={hero} />}
        {hero.type === "promo" && <HeroPromo hero={hero} />}
        <HeroOverlay hero={hero} />
      </div>
      {showSecondary && <HeroSecondary data={heroSecondary} />}
    </section>
  );
}

function HeroVideo({ hero }: { hero: HeroData }) {
  const videoUrl = hero.videoFile?.asset?.url;
  const posterUrl = hero.videoPoster ? urlFor(hero.videoPoster).width(1920).quality(80).url() : undefined;

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

function HeroImage({ hero }: { hero: HeroData }) {
  if (!hero.image) return null;
  return (
    <Image
      src={urlFor(hero.image).width(1920).quality(85).url()}
      alt={hero.image.alt || hero.title || ""}
      fill sizes="(max-width:1024px) 100vw, 60vw"
      className="object-cover" priority
    />
  );
}

function HeroPromo({ hero }: { hero: HeroData }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-midnight to-[#1E2F6B]">
      {hero.promoImage && (
        <div className="absolute right-0 top-0 h-full w-1/2">
          <Image src={urlFor(hero.promoImage).width(800).quality(85).url()} alt="" fill sizes="50vw" className="object-contain object-right" />
        </div>
      )}
      {hero.promoPrice && (
        <div className="absolute bottom-6 right-6 rounded-pill bg-or px-5 py-3 font-sora text-sm font-bold text-ink">{hero.promoPrice}</div>
      )}
    </div>
  );
}

function HeroOverlay({ hero }: { hero: HeroData }) {
  return (
    <div className="relative z-10 flex h-full min-h-[480px] flex-col justify-center p-6 text-white md:min-h-[420px] md:p-12">
      {(hero.type === "promo" || hero.promoBadge) && hero.promoBadge && (
        <span className="mb-3 inline-block w-fit rounded-pill bg-sky px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-midnight md:mb-4 md:text-xs">
          {hero.promoBadge}
        </span>
      )}

      {hero.title && (
        <h1 className="mb-4 max-w-xl font-sora text-4xl font-semibold leading-[1.05] tracking-tight md:mb-6 md:text-6xl lg:text-7xl">
          {hero.title.split("\n").map((line, i) => (
            <span key={i} className="block">
              {i % 2 === 1 ? <span className="italic text-aurora">{line}</span> : line}
            </span>
          ))}
        </h1>
      )}

      {hero.subtitle && <p className="mb-6 max-w-md text-base text-white/85 md:mb-8 md:text-lg">{hero.subtitle}</p>}

      <div className="flex flex-wrap items-center gap-3 md:gap-5">
        {hero.ctaPrimary?.link && hero.ctaPrimary.label && (
          <Link
            href={hero.ctaPrimary.link}
            className="inline-flex items-center gap-2 rounded-pill bg-ivoire px-6 py-3 font-sans text-sm font-semibold text-midnight transition-all hover:bg-aurora hover:-translate-y-px md:px-7 md:py-3.5 md:text-base"
          >
            {hero.ctaPrimary.label}
            <ArrowRight />
          </Link>
        )}
        {hero.ctaSecondary?.link && hero.ctaSecondary.label && (
          <Link
            href={hero.ctaSecondary.link}
            className="border-b border-white/40 pb-0.5 text-sm font-medium text-white transition-colors hover:border-aurora hover:text-aurora"
          >
            {hero.ctaSecondary.label}
          </Link>
        )}
      </div>

      {hero.trustNote && (
        <p className="mt-6 flex items-center gap-2 text-xs text-white/75 md:mt-8 md:text-sm">
          <span className="text-or">★★★★★</span>
          {hero.trustNote}
        </p>
      )}
    </div>
  );
}

function HeroSecondary({ data }: { data: HeroSecondaryData }) {
  return (
    <div className="relative min-h-[280px] overflow-hidden bg-gradient-to-br from-lin to-sable p-6 md:min-h-[420px] md:rounded-3xl md:p-12">
      {data.image && (
        <div className="absolute inset-0">
          <Image src={urlFor(data.image).width(800).quality(80).url()} alt="" fill sizes="40vw" className="object-cover opacity-50" />
        </div>
      )}
      <div className="relative z-10 flex h-full flex-col justify-center">
        {data.badge && (
          <span className="mb-2 inline-block w-fit rounded-pill bg-midnight px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white md:mb-3 md:text-xs">
            {data.badge}
          </span>
        )}
        {data.title && <h2 className="mb-2 font-sora text-2xl font-semibold leading-tight tracking-tight text-ink md:mb-3 md:text-4xl">{data.title}</h2>}
        {data.subtitle && <p className="mb-4 max-w-xs text-sm text-pierre md:mb-6 md:text-base">{data.subtitle}</p>}
        {data.cta?.link && data.cta.label && (
          <Link href={data.cta.link} className="inline-flex w-fit items-center gap-2 rounded-pill bg-midnight px-5 py-2.5 font-sans text-sm font-semibold text-white transition-all hover:bg-midnight-dark hover:-translate-y-px md:px-6 md:py-3">
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
      <div className="relative min-h-[480px] overflow-hidden bg-midnight md:min-h-[420px] md:rounded-3xl">
        <video src="/videos/hero-matelas.mp4" autoPlay muted loop playsInline preload="metadata"
          className="absolute inset-0 h-full w-full object-cover opacity-90" aria-hidden="true" />
        <div className="relative z-10 flex h-full min-h-[480px] flex-col justify-center p-6 text-white md:min-h-[420px] md:p-12">
          <h1 className="mb-4 max-w-xl font-sora text-4xl font-light leading-[1.05] tracking-tight md:mb-6 md:text-7xl">
            Là où la nuit<br />
            <span className="italic font-medium text-aurora">prend son envol.</span>
          </h1>
          <p className="mb-6 max-w-md text-base font-light text-white/80 md:mb-8 md:text-lg">
            Le matelas conçu pour votre voyage intérieur.
          </p>
          <Link href="/matelas" className="inline-flex w-fit items-center gap-2 rounded-pill bg-ivoire px-6 py-3 font-sans text-sm font-semibold text-midnight transition-all hover:bg-aurora hover:-translate-y-px md:px-7 md:py-3.5 md:text-base">
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
