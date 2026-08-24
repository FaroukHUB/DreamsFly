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

/**
 * Palette éditoriale — dégradés riches signature DreamsFly, rappellent
 * les prises de vue en studio des marques luxury (Loro Piana, Aesop).
 */
const THEME_BG: Record<string, string> = {
  dark: "bg-[radial-gradient(120%_100%_at_20%_0%,#1c1a20_0%,#0b0b0f_60%)]",
  beige: "bg-[radial-gradient(120%_100%_at_20%_0%,#f0e4cc_0%,#c8b28a_100%)]",
  midnight: "bg-[radial-gradient(120%_100%_at_20%_0%,#1e1a26_0%,#3d2e1f_100%)]",
  gold: "bg-[radial-gradient(120%_100%_at_20%_0%,#d1b184_0%,#8f6a3a_100%)]",
};

const THEME_TEXT: Record<string, string> = {
  dark: "text-ivoire",
  beige: "text-noir",
  midnight: "text-ivoire",
  gold: "text-noir",
};

/**
 * Mosaïque collections — direction A ultra-premium.
 * Cards format portrait luxe (aspect 4/5 ~ 720 px de haut sur desktop),
 * grande photo édito, dégradé au bas, numéro Fraunces XXL en filigrane
 * dans le coin, filet or entre chaque bloc de texte, CTA hairline arrow.
 */
export function MosaicCollections({ cards }: { cards?: Card[] }) {
  const data = cards && cards.length === 4 ? cards : DEFAULT_CARDS;

  return (
    <section className="section-cream section-editorial">
      <div className="mx-auto max-w-site">
        <div className="mb-16 grid gap-8 md:mb-24 md:grid-cols-[1.15fr_1fr] md:items-end md:gap-16 reveal">
          <div>
            <span className="eyebrow-editorial on-cream mb-3">Chapitre I · Collections</span>
            <h2 className="display-serif on-cream mt-5 text-[2.4rem] font-normal md:text-[4rem] lg:text-[4.6rem]">
              Quatre <em>familles</em>, une même exigence.
            </h2>
          </div>
          <p className="max-w-[46ch] font-sans text-[15px] leading-relaxed text-taupe md:text-[16px]">
            Chaque collection répond à une posture, à un besoin, à une manière de dormir. Nos conseillers vous accompagnent en showroom pour trouver la vôtre — sans jargon, sans pression.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 xl:gap-8">
          {data.map((c, i) => {
            const theme = c.theme || "midnight";
            const hasImage = !!c.image;
            const imgUrl = hasImage ? urlFor(c.image).width(1200).quality(88).url() : null;
            const num = String(i + 1).padStart(2, "0");
            const isLight = THEME_TEXT[theme] === "text-noir" || THEME_TEXT[theme] === "text-ink";

            return (
              <Link
                key={i}
                href={c.link || "#"}
                style={{ transitionDelay: `${i * 90}ms` }}
                className={`group reveal relative flex aspect-[4/5.2] flex-col overflow-hidden rounded-[32px] transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_28px_60px_-24px_rgba(11,11,15,0.4)] ${
                  hasImage ? "bg-noir" : THEME_BG[theme]
                } ${THEME_TEXT[theme]} ${i % 2 === 1 ? "lg:mt-16" : ""}`}
              >
                {hasImage && imgUrl && (
                  <Image
                    src={imgUrl}
                    alt={c.title || ""}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                )}
                {hasImage && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
                  </>
                )}

                {/* Numéro géant filigrane en haut à droite */}
                <span
                  aria-hidden
                  className={`absolute right-6 top-6 font-serif font-light leading-none opacity-25 ${isLight ? "text-noir" : "text-or"} md:right-8 md:top-8`}
                  style={{ fontSize: "clamp(72px, 8vw, 120px)", fontVariationSettings: "'opsz' 144" }}
                >
                  {num}
                </span>

                {/* Bloc contenu bas */}
                <div className="relative z-10 mt-auto p-7 md:p-9">
                  {c.eyebrow && (
                    <>
                      <div className="mb-4 flex items-center gap-3">
                        <span className={`h-px w-8 ${isLight ? "bg-noir/40" : "bg-or"}`} />
                        <span className="font-sans text-[10.5px] font-medium uppercase tracking-[0.22em] opacity-90">
                          {c.eyebrow}
                        </span>
                      </div>
                    </>
                  )}
                  {c.title && (
                    <h3 className="display-serif text-[1.7rem] font-normal leading-[1.02] md:text-[2rem] lg:text-[2.1rem]">
                      {c.title}
                    </h3>
                  )}
                  <div className="mt-8 flex items-center justify-between">
                    <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] opacity-85">
                      Découvrir
                    </span>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current opacity-70 transition-all duration-500 group-hover:opacity-100 group-hover:rotate-[-45deg]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </div>
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
