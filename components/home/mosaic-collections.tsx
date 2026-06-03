import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";

type Card = {
  eyebrow?: string;
  title?: string;
  link?: string;
  image?: any;
  theme?: "dark" | "beige" | "midnight" | "gold";
};

const THEME_BG: Record<string, string> = {
  dark: "bg-gradient-to-br from-ink to-pierre",
  beige: "bg-gradient-to-br from-lin to-beige-profond",
  midnight: "bg-gradient-to-br from-midnight to-[#3A4A8A]",
  gold: "bg-gradient-to-br from-or to-[#D9BB85]",
};

const THEME_TEXT: Record<string, string> = {
  dark: "text-white",
  beige: "text-ink",
  midnight: "text-white",
  gold: "text-ink",
};

/**
 * Mosaïque de collections — 4 grands cards qui font office d'entrée
 * dans les silos thématiques.
 *
 * Source :
 *  - siteSettings.mosaicCollections (Sanity) si défini
 *  - sinon fallback éditorial DreamsFly (Performance / Original / Premium / Showrooms)
 */
export function MosaicCollections({ cards }: { cards?: Card[] }) {
  const data = cards && cards.length === 4 ? cards : DEFAULT_CARDS;

  return (
    <section className="mx-auto max-w-site px-8 py-20">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((c, i) => {
          const theme = c.theme || "midnight";
          const hasImage = !!c.image;
          return (
            <Link
              key={i}
              href={c.link || "#"}
              className={`group relative flex h-[340px] flex-col justify-end overflow-hidden rounded-3xl p-6 transition-transform hover:-translate-y-1 ${
                hasImage ? "bg-sable" : THEME_BG[theme]
              } ${THEME_TEXT[theme]}`}
            >
              {hasImage && (
                <Image
                  src={urlFor(c.image).width(700).quality(85).url()}
                  alt={c.title || ""}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
              {hasImage && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />}

              <div className="relative z-10">
                {c.eyebrow && (
                  <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest opacity-90">
                    {c.eyebrow}
                  </div>
                )}
                {c.title && (
                  <h3 className="font-sora text-2xl font-semibold leading-tight tracking-tight">
                    {c.title}
                  </h3>
                )}
                <span className="mt-3 inline-block border-b border-current pb-0.5 text-sm font-semibold">
                  Découvrir →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

const DEFAULT_CARDS: Card[] = [
  {
    eyebrow: "Gamme Performance",
    title: "Le sommeil, élevé au rang d'art",
    link: "/matelas-memoire-de-forme",
    theme: "midnight",
  },
  {
    eyebrow: "Gamme Confort",
    title: "La qualité accessible à tous",
    link: "/matelas",
    theme: "beige",
  },
  {
    eyebrow: "Soutien renforcé",
    title: "Conçu pour le mal de dos",
    link: "/matelas-mal-de-dos",
    theme: "dark",
  },
  {
    eyebrow: "Boutiques physiques",
    title: "Essayez avant d'acheter",
    link: "/magasins",
    theme: "gold",
  },
];
