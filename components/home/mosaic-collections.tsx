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
 * Palette éditoriale — dégradés riches signature DreamsFly.
 * Inline style pour garantir le rendu (Tailwind arbitrary bg parfois
 * pas détecté quand construit dynamiquement à partir d'un map).
 */
const THEME_GRADIENTS: Record<string, string> = {
  dark: "radial-gradient(120% 100% at 20% 0%, #262229 0%, #0b0b0f 65%)",
  beige: "radial-gradient(120% 100% at 20% 0%, #f0e4cc 0%, #c8b28a 100%)",
  midnight: "radial-gradient(120% 100% at 20% 0%, #1e1a26 0%, #3d2e1f 100%)",
  gold: "radial-gradient(120% 100% at 20% 0%, #d1b184 0%, #8f6a3a 100%)",
};

const THEME_TEXT: Record<string, string> = {
  dark: "text-ivoire",
  beige: "text-noir",
  midnight: "text-ivoire",
  gold: "text-noir",
};

/**
 * Mosaïque collections — direction A ultra-premium.
 * 4 colonnes sur desktop, mais chaque carte a une hauteur MINIMUM
 * imposée (720/820 px) — impossible à louper. Numéro Fraunces géant
 * en filigrane, hover scale image + shadow XXL 60 px.
 */
export function MosaicCollections({ cards }: { cards?: Card[] }) {
  const data = cards && cards.length === 4 ? cards : DEFAULT_CARDS;

  return (
    <section className="section-cream section-editorial">
      <div className="mx-auto max-w-site">
        <div className="mb-20 grid gap-8 md:mb-28 md:grid-cols-[1.15fr_1fr] md:items-end md:gap-16 reveal">
          <div>
            <span className="eyebrow-editorial on-cream mb-3">Chapitre I · Collections</span>
            <h2 className="display-serif on-cream mt-5 text-[2.6rem] font-normal md:text-[4.4rem] lg:text-[5rem]">
              Quatre <em>familles</em>, une même exigence.
            </h2>
          </div>
          <p className="max-w-[46ch] font-sans text-[15px] leading-relaxed text-taupe md:text-[17px]">
            Chaque collection répond à une posture, à un besoin, à une manière de dormir. Nos conseillers vous accompagnent en showroom pour trouver la vôtre — sans jargon, sans pression.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5 xl:gap-7">
          {data.map((c, i) => {
            const theme = c.theme || "midnight";
            const hasImage = !!c.image;
            const imgUrl = hasImage ? urlFor(c.image).width(1200).quality(90).url() : null;
            const num = String(i + 1).padStart(2, "0");
            const isLight = THEME_TEXT[theme] === "text-noir" || THEME_TEXT[theme] === "text-ink";
            const bgStyle = hasImage
              ? { backgroundColor: "#0b0b0f" }
              : { background: THEME_GRADIENTS[theme] };

            return (
              <Link
                key={i}
                href={c.link || "#"}
                style={{ transitionDelay: `${i * 90}ms`, ...bgStyle }}
                className={`group reveal relative flex min-h-[540px] flex-col overflow-hidden rounded-[32px] shadow-[0_10px_30px_-15px_rgba(11,11,15,0.2)] transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_-20px_rgba(11,11,15,0.5)] md:min-h-[720px] lg:min-h-[820px] ${THEME_TEXT[theme]} ${i % 2 === 1 ? "lg:mt-14" : ""}`}
              >
                {hasImage && imgUrl && (
                  <Image
                    src={imgUrl}
                    alt={c.title || ""}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.08]"
                    priority={i < 2}
                  />
                )}
                {hasImage && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent" />
                  </>
                )}

                {/* Grain overlay subtil — texture magazine */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='240' height='240' filter='url(%23n)' opacity='0.5'/></svg>\")",
                  }}
                />

                {/* Numéro géant filigrane */}
                <span
                  aria-hidden
                  className={`absolute font-serif font-light leading-none ${isLight ? "text-noir/25" : "text-or/35"}`}
                  style={{
                    top: "clamp(20px, 3vw, 44px)",
                    right: "clamp(18px, 2.8vw, 40px)",
                    fontSize: "clamp(110px, 11vw, 200px)",
                    fontVariationSettings: "'opsz' 144",
                  }}
                >
                  {num}
                </span>

                {/* Bloc contenu bas */}
                <div className="relative z-10 mt-auto p-7 md:p-9 lg:p-10">
                  {c.eyebrow && (
                    <div className="mb-5 flex items-center gap-3">
                      <span className={`h-px w-10 ${isLight ? "bg-noir/50" : "bg-or"}`} />
                      <span className="font-sans text-[11px] font-medium uppercase tracking-[0.22em] opacity-90">
                        {c.eyebrow}
                      </span>
                    </div>
                  )}
                  {c.title && (
                    <h3
                      className="display-serif font-normal leading-[1.02]"
                      style={{ fontSize: "clamp(1.7rem, 2vw, 2.2rem)" }}
                    >
                      {c.title}
                    </h3>
                  )}
                  <div className="mt-8 flex items-center justify-between">
                    <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] opacity-90">
                      Découvrir
                    </span>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-current opacity-70 transition-all duration-500 group-hover:h-13 group-hover:w-13 group-hover:opacity-100 group-hover:rotate-[-45deg]">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
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
