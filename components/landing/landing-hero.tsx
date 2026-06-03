/**
 * Hero zone d'une landing SEO — H1 + intro + trust signals visibles.
 * Le but : que même une landing minimaliste paraisse riche above-the-fold.
 */
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

export function LandingHero({
  editorialAngle,
  h1,
  intro,
  focusKeyword,
  ogImage,
  productsCount,
}: {
  editorialAngle?: string;
  h1?: string;
  intro?: string;
  focusKeyword?: string;
  ogImage?: any;
  productsCount?: number;
}) {
  return (
    <header className="mb-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
      {/* Texte */}
      <div className="max-w-2xl">
        {editorialAngle && (
          <div className="eyebrow mb-3">{editorialAngle}</div>
        )}
        <h1 className="font-sora text-4xl font-semibold leading-tight tracking-tight text-ink md:text-5xl lg:text-6xl">
          {h1}
        </h1>
        {intro && (
          <p className="mt-6 text-lg leading-relaxed text-pierre md:text-xl">
            {intro}
          </p>
        )}

        {/* Mini trust strip */}
        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border pt-6">
          <div className="flex items-center gap-2">
            <span className="text-or text-base">★★★★★</span>
            <strong className="font-sora text-base font-bold text-ink">4,9 / 5</strong>
            <span className="text-sm text-pierre">— Plus de 5 000 avis</span>
          </div>
          <span aria-hidden className="text-brume">·</span>
          <span className="text-sm font-medium text-pierre">Livraison France · Garantie 2 ans</span>
        </div>
      </div>

      {/* Visuel — image OG ou fallback gradient avec accent */}
      <aside className="relative aspect-[4/5] overflow-hidden rounded-3xl lg:aspect-square">
        {ogImage ? (
          <Image
            src={urlFor(ogImage).width(800).quality(85).url()}
            alt={h1 || ""}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-midnight via-midnight-dark to-[#1E2F6B]">
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-aurora opacity-30 blur-3xl" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
              <svg width="120" height="80" viewBox="0 0 120 80" fill="none" aria-hidden className="opacity-90">
                <rect x="10" y="20" width="100" height="50" rx="6" fill="#FFF" opacity="0.95" />
                <rect x="10" y="14" width="100" height="10" rx="3" fill="#7FD4F5" opacity="0.7" />
                <rect x="20" y="68" width="6" height="10" rx="1" fill="#0F1B47" />
                <rect x="94" y="68" width="6" height="10" rx="1" fill="#0F1B47" />
                <g opacity="0.5">
                  <line x1="30" y1="20" x2="30" y2="70" stroke="#475569" strokeWidth="0.5" />
                  <line x1="50" y1="20" x2="50" y2="70" stroke="#475569" strokeWidth="0.5" />
                  <line x1="70" y1="20" x2="70" y2="70" stroke="#475569" strokeWidth="0.5" />
                  <line x1="90" y1="20" x2="90" y2="70" stroke="#475569" strokeWidth="0.5" />
                </g>
              </svg>
              {focusKeyword && (
                <div className="mt-6 max-w-[80%] font-sora text-sm font-medium uppercase tracking-widest text-aurora">
                  {focusKeyword}
                </div>
              )}
            </div>
          </div>
        )}
      </aside>
    </header>
  );
}
