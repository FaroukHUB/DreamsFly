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
 * HERO MODULAIRE — affiche soit une vidéo, soit une image, soit une bannière promo,
 * selon le choix défini dans Sanity Studio.
 */
export function Hero({
  hero,
  heroSecondary,
}: {
  hero?: HeroData;
  heroSecondary?: HeroSecondaryData;
}) {
  // Fallback si pas de données Sanity
  if (!hero) {
    return <HeroFallback />;
  }

  const showSecondary = heroSecondary?.enabled !== false && heroSecondary?.title;
  const gridCols = showSecondary ? "lg:grid-cols-[1.5fr_1fr]" : "lg:grid-cols-1";

  return (
    <section className={`mx-auto mt-6 grid max-w-site grid-cols-1 gap-4 px-8 ${gridCols}`}>
      {/* Hero principal */}
      <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-midnight">
        {hero.type === "video" && <HeroVideo hero={hero} />}
        {hero.type === "image" && <HeroImage hero={hero} />}
        {hero.type === "promo" && <HeroPromo hero={hero} />}
        <HeroOverlay hero={hero} />
      </div>

      {/* Hero secondaire */}
      {showSecondary && <HeroSecondary data={heroSecondary} />}
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// Variantes
// ────────────────────────────────────────────────────────────

function HeroVideo({ hero }: { hero: HeroData }) {
  const videoUrl = hero.videoFile?.asset?.url;
  const posterUrl = hero.videoPoster ? urlFor(hero.videoPoster).width(1920).quality(80).url() : undefined;

  if (!videoUrl) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-midnight via-midnight-dark to-midnight" />
    );
  }

  return (
    <video
      src={videoUrl}
      poster={posterUrl}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
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
      fill
      sizes="(max-width: 1024px) 100vw, 60vw"
      className="object-cover"
      priority
    />
  );
}

function HeroPromo({ hero }: { hero: HeroData }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-midnight to-[#1E2F6B]">
      {hero.promoImage && (
        <div className="absolute right-0 top-0 h-full w-1/2">
          <Image
            src={urlFor(hero.promoImage).width(800).quality(85).url()}
            alt=""
            fill
            sizes="50vw"
            className="object-contain object-right"
          />
        </div>
      )}
      {hero.promoPrice && (
        <div className="absolute bottom-6 right-6 rounded-pill bg-or px-5 py-3 font-sora text-sm font-bold text-ink">
          {hero.promoPrice}
        </div>
      )}
    </div>
  );
}

function HeroOverlay({ hero }: { hero: HeroData }) {
  return (
    <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-center p-12 text-white">
      {(hero.type === "promo" || hero.promoBadge) && hero.promoBadge && (
        <span className="mb-4 inline-block w-fit rounded-pill bg-sky px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-midnight">
          {hero.promoBadge}
        </span>
      )}

      {hero.title && (
        <h1 className="mb-6 max-w-xl font-sora text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
          {hero.title.split("\n").map((line, i) => (
            <span key={i} className="block">
              {i % 2 === 1 ? <span className="italic text-aurora">{line}</span> : line}
            </span>
          ))}
        </h1>
      )}

      {hero.subtitle && (
        <p className="mb-8 max-w-md text-lg text-white/85">{hero.subtitle}</p>
      )}

      <div className="flex flex-wrap items-center gap-5">
        {hero.ctaPrimary?.link && hero.ctaPrimary.label && (
          <Link
            href={hero.ctaPrimary.link}
            className="inline-flex items-center gap-2 rounded-pill bg-ivoire px-7 py-3.5 font-sans text-base font-semibold text-midnight transition-all hover:bg-aurora hover:-translate-y-px"
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
        <p className="mt-8 flex items-center gap-2 text-sm text-white/75">
          <span className="text-or">★★★★★</span>
          {hero.trustNote}
        </p>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Hero secondaire (bannière droite)
// ────────────────────────────────────────────────────────────

function HeroSecondary({ data }: { data: HeroSecondaryData }) {
  return (
    <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-gradient-to-br from-lin to-sable p-12">
      {data.image && (
        <div className="absolute inset-0">
          <Image
            src={urlFor(data.image).width(800).quality(80).url()}
            alt=""
            fill
            sizes="40vw"
            className="object-cover opacity-50"
          />
        </div>
      )}
      <div className="relative z-10 flex h-full flex-col justify-center">
        {data.badge && (
          <span className="mb-3 inline-block w-fit rounded-pill bg-midnight px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
            {data.badge}
          </span>
        )}
        {data.title && (
          <h2 className="mb-3 font-sora text-3xl font-semibold leading-tight tracking-tight text-ink md:text-4xl">
            {data.title}
          </h2>
        )}
        {data.subtitle && (
          <p className="mb-6 max-w-xs text-base text-pierre">{data.subtitle}</p>
        )}
        {data.cta?.link && data.cta.label && (
          <Link
            href={data.cta.link}
            className="inline-flex w-fit items-center gap-2 rounded-pill bg-midnight px-6 py-3 font-sans text-sm font-semibold text-white transition-all hover:bg-midnight-dark hover:-translate-y-px"
          >
            {data.cta.label}
            <ArrowRight />
          </Link>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Fallback (avant que Sanity soit configuré)
// ────────────────────────────────────────────────────────────

function HeroFallback() {
  return (
    <section className="mx-auto mt-6 max-w-site px-8">
      <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-midnight">
        <video
          src="/videos/hero-matelas.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover opacity-90"
          aria-hidden="true"
        />
        <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-center p-12 text-white">
          <h1 className="mb-6 max-w-2xl font-sora text-5xl font-light leading-[1.05] tracking-tight md:text-7xl">
            Là où la nuit<br />
            <span className="italic font-medium text-aurora">prend son envol.</span>
          </h1>
          <p className="mb-8 max-w-md text-lg font-light text-white/80">
            Le matelas conçu pour votre voyage intérieur.
          </p>
          <Link
            href="/matelas"
            className="inline-flex w-fit items-center gap-2 rounded-pill bg-ivoire px-7 py-3.5 font-sans text-base font-semibold text-midnight transition-all hover:bg-aurora hover:-translate-y-px"
          >
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
