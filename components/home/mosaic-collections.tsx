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
 * Mosaïque collections — cards allongées avec upload image possible.
 * Mobile : 2 cols. Desktop : 4 cols.
 * Hauteur 480px mobile / 560px desktop pour le visuel impactant.
 */
export function MosaicCollections({ cards }: { cards?: Card[] }) {
  const data = cards && cards.length === 4 ? cards : DEFAULT_CARDS;

  return (
    <section className="px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-site">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((c, i) => {
            const theme = c.theme || "midnight";
            const hasImage = !!c.image;
            const imgUrl = hasImage ? urlFor(c.image).width(900).quality(85).url() : null;

            return (
              <Link
                key={i}
                href={c.link || "#"}
                className={`group relative flex h-[480px] flex-col justify-end overflow-hidden rounded-3xl p-6 transition-transform hover:-translate-y-1 md:h-[560px] md:p-8 ${
                  hasImage ? "bg-sable" : THEME_BG[theme]
                } ${THEME_TEXT[theme]}`}
              >
                {hasImage && imgUrl && (
                  <Image
                    src={imgUrl}
                    alt={c.title || ""}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                {hasImage && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                )}

                <div className="relative z-10">
                  {c.eyebrow && (
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest opacity-90 md:text-xs">
                      {c.eyebrow}
                    </div>
                  )}
                  {c.title && (
                    <h3 className="font-sora text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
                      {c.title}
                    </h3>
                  )}
                  <span className="mt-4 inline-block border-b border-current pb-0.5 text-sm font-semibold">
                    Découvrir →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const DEFAULT_CARDS: Card[] = [
  { eyebrow: "Gamme Performance", title: "Le sommeil, élevé au rang d'art", link: "/matelas-memoire-de-forme", theme: "midnight" },
  { eyebrow: "Gamme Confort", title: "La qualité accessible à tous", link: "/matelas", theme: "beige" },
  { eyebrow: "Soutien renforcé", title: "Conçu pour le mal de dos", link: "/matelas-mal-de-dos", theme: "dark" },
  { eyebrow: "Boutiques physiques", title: "Essayez avant d'acheter", link: "/magasins", theme: "gold" },
];
