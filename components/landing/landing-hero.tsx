import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

export function LandingHero({
  editorialAngle,
  h1,
  intro,
  focusKeyword,
  ogImage,
}: {
  editorialAngle?: string;
  h1?: string;
  intro?: string;
  focusKeyword?: string;
  ogImage?: any;
}) {
  return (
    <header className="relative mb-16 overflow-hidden rounded-3xl bg-gradient-to-br from-sable via-ivoire to-aurora/15 p-8 md:p-12 lg:p-16">
      {/* Décorations */}
      <div aria-hidden className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-aurora/30 blur-3xl" />
      <div aria-hidden className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-or/15 blur-2xl" />

      {/* Petites étoiles décoratives */}
      <div aria-hidden className="absolute right-12 top-8 text-or text-xl opacity-50">✦</div>
      <div aria-hidden className="absolute right-32 top-16 text-or text-sm opacity-30">✦</div>
      <div aria-hidden className="absolute left-12 bottom-12 text-aurora text-lg opacity-40">✦</div>

      <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        {/* Texte */}
        <div>
          {editorialAngle && (
            <div className="mb-4 inline-flex items-center gap-2 rounded-pill bg-midnight px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
              <span aria-hidden className="text-aurora">✦</span>
              {editorialAngle}
            </div>
          )}
          <h1 className="font-sora text-4xl font-semibold leading-[1.05] tracking-tight text-ink md:text-5xl lg:text-6xl">
            {h1}
          </h1>
          {intro && (
            <p className="mt-6 text-lg leading-relaxed text-pierre md:text-xl">{intro}</p>
          )}

          {/* Mini trust strip */}
          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-border/60 pt-6">
            <div className="flex items-center gap-2">
              <span className="text-or text-base">★★★★★</span>
              <strong className="font-sora text-base font-bold text-ink">4,9 / 5</strong>
              <span className="text-sm text-pierre">— + de 5 000 avis</span>
            </div>
            <span aria-hidden className="text-brume">·</span>
            <span className="text-sm font-medium text-pierre">Livraison France</span>
            <span aria-hidden className="text-brume">·</span>
            <span className="text-sm font-medium text-pierre">Garantie 2 ans</span>
          </div>
        </div>

        {/* Visuel — image OG si dispo, sinon illustration chambre stylisée */}
        <aside className="relative aspect-square overflow-hidden rounded-2xl">
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
            <BedroomIllustration focusKeyword={focusKeyword} />
          )}
        </aside>
      </div>
    </header>
  );
}

/** Illustration SVG d'une chambre cosy au coucher de soleil. */
function BedroomIllustration({ focusKeyword }: { focusKeyword?: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-midnight via-[#1E2F6B] to-midnight-dark">
      {/* Soleil/lune */}
      <div className="absolute right-12 top-12 h-24 w-24 rounded-full bg-gradient-to-br from-or to-or-dark opacity-90 blur-sm" />
      <div className="absolute right-14 top-14 h-20 w-20 rounded-full bg-gradient-to-br from-aurora to-or" />

      {/* Étoiles */}
      <div className="absolute left-12 top-16 text-white/60 text-sm">✦</div>
      <div className="absolute left-20 top-24 text-white/40 text-xs">✦</div>
      <div className="absolute right-32 top-8 text-aurora/80 text-base">✦</div>
      <div className="absolute left-32 top-12 text-aurora/60 text-xs">✦</div>

      {/* Nuages stylisés */}
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-x-0 bottom-24 h-32 w-full opacity-30"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M0 80 Q40 50 80 60 T160 55 Q200 35 250 45 T340 50 Q380 35 400 50 L400 100 L0 100 Z"
          fill="white"
          opacity="0.4"
        />
        <path
          d="M0 110 Q60 80 120 90 T240 85 Q300 65 360 80 L400 100 L0 100 Z"
          fill="white"
          opacity="0.6"
        />
      </svg>

      {/* Lit avec matelas */}
      <div className="absolute inset-x-8 bottom-12 flex flex-col items-center">
        {/* Tête de lit */}
        <div className="h-2 w-44 rounded-t-lg bg-gradient-to-r from-ivoire/95 to-aurora/40" />
        {/* Matelas couche cyan */}
        <div className="h-3 w-52 -mt-px bg-gradient-to-r from-aurora via-sky to-aurora opacity-90 shadow-[0_0_24px_rgba(127,212,245,0.6)]" />
        {/* Matelas principal */}
        <div className="h-8 w-52 rounded-b-md bg-gradient-to-b from-ivoire to-sable shadow-[0_8px_20px_rgba(0,0,0,0.4)]" />
        {/* Pieds */}
        <div className="flex w-52 justify-between -mt-px">
          <div className="h-3 w-2 bg-ink/60" />
          <div className="h-3 w-2 bg-ink/60" />
        </div>
      </div>

      {/* Tag focus keyword */}
      {focusKeyword && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-pill bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-aurora backdrop-blur-sm">
          {focusKeyword}
        </div>
      )}
    </div>
  );
}
