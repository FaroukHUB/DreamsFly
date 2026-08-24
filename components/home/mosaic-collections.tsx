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
  dark: "bg-gradient-to-b from-noir-doux to-noir",
  beige: "bg-gradient-to-b from-[#E9DFCC] to-[#D9C9A8]",
  midnight: "bg-gradient-to-b from-[#1a1624] to-[#3d2f24]",
  gold: "bg-gradient-to-b from-or to-or-dark",
};

const THEME_TEXT: Record<string, string> = {
  dark: "text-ivoire",
  beige: "text-ink",
  midnight: "text-ivoire",
  gold: "text-noir",
};

/**
 * Mosaïque collections — style éditorial luxe (direction A).
 * Numéro de chapitre en Fraunces or, titre en serif italique,
 * hairline séparateur, lien uppercase tracké.
 */
export function MosaicCollections({ cards }: { cards?: Card[] }) {
  const data = cards && cards.length === 4 ? cards : DEFAULT_CARDS;

  return (
    <section className="section-cream section-editorial">
      <div className="mx-auto max-w-site">
        <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-[1fr_1fr] md:items-end md:gap-16 reveal">
          <div>
            <span className="eyebrow-editorial on-cream mb-3">Chapitre I · Collections</span>
            <h2 className="display-serif on-cream mt-4 text-[2.2rem] font-normal md:text-[3.6rem]">
              Quatre <em>familles</em>, une même exigence.
            </h2>
          </div>
          <p className="max-w-[46ch] font-sans text-[15px] leading-relaxed text-taupe md:text-base">
            Chaque collection répond à une posture, à un besoin, à une manière de dormir. Nos conseillers vous accompagnent en showroom pour trouver la vôtre — sans jargon, sans pression.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((c, i) => {
            const theme = c.theme || "midnight";
            const hasImage = !!c.image;
            const imgUrl = hasImage ? urlFor(c.image).width(900).quality(85).url() : null;
            const num = String(i + 1).padStart(2, "0");
            const isLight = THEME_TEXT[theme] === "text-noir" || THEME_TEXT[theme] === "text-ink";

            return (
              <Link
                key={i}
                href={c.link || "#"}
                style={{ transitionDelay: `${i * 80}ms` }}
                className={`group reveal relative flex h-[480px] flex-col justify-between overflow-hidden rounded-[28px] p-7 transition-all duration-500 hover:-translate-y-2 md:h-[580px] md:p-9 ${
                  hasImage ? "bg-noir" : THEME_BG[theme]
                } ${THEME_TEXT[theme]} ${i % 2 === 1 ? "md:mt-10" : ""}`}
              >
                {hasImage && imgUrl && (
                  <Image
                    src={imgUrl}
                    alt={c.title || ""}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover opacity-90 transition-transform duration-[900ms] group-hover:scale-105"
                  />
                )}
                {hasImage && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                )}

                <div className="relative z-10 flex items-start justify-between">
                  <span className={`num-editorial ${isLight ? "!text-noir/80" : ""}`}>{num}</span>
                  <svg className="opacity-60 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M7 17 17 7M17 7H8M17 7V16" />
                  </svg>
                </div>

                <div className="relative z-10">
                  {c.eyebrow && (
                    <div className="mb-3 font-sans text-[11px] font-medium uppercase tracking-[0.2em] opacity-80">
                      {c.eyebrow}
                    </div>
                  )}
                  {c.title && (
                    <h3 className="display-serif text-[1.6rem] font-normal leading-[1.05] md:text-[1.9rem]">
                      {c.title}
                    </h3>
                  )}
                  <span className="mt-6 inline-flex items-center gap-2 border-b border-current pb-1 font-sans text-[11px] font-medium uppercase tracking-[0.16em] opacity-90">
                    Découvrir la collection
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
