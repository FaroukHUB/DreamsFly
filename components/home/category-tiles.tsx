import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";

type Tile = {
  name?: string;
  promo?: string;
  link?: string;
  image?: any;
};

const FALLBACK_TILES: Tile[] = [
  { name: "Matelas", promo: "Jusqu'à -40%", link: "/matelas" },
  { name: "Lits", promo: "Design & confort", link: "/lits" },
  { name: "Sommiers", promo: "Jusqu'à -30%", link: "/sommiers" },
  { name: "Oreillers", promo: "Confort cervical", link: "/oreillers" },
];

/**
 * Tuiles catégories — image plein cadre + overlay + tag promo + flèche.
 * Inspiré du style emma.fr sans le copier 1:1 (palette DreamsFly,
 * tipologie d'étiquette différente, boutons ronds avec dégradé subtil).
 *
 * Mobile : grid 2 cols, cards bien hautes (550px) pour respirer.
 * Desktop : 4 cols, hauteur 480px.
 */
export function CategoryTiles({ tiles }: { tiles?: Tile[] }) {
  const data = tiles && tiles.length > 0 ? tiles : FALLBACK_TILES;

  return (
    <section className="bg-sable px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-site">
        <div className="mb-8 md:mb-12">
          <div className="eyebrow mb-3">Nos catégories</div>
          <h2 className="font-sora text-3xl font-semibold tracking-tight text-ink md:text-5xl">
            Tout pour la chambre.
          </h2>
          <p className="mt-3 max-w-md text-base text-pierre md:text-lg">
            Des matelas aux oreillers, retrouvez l'essentiel pour la chambre signé DreamsFly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((t, i) => {
            const imgUrl = t.image ? urlFor(t.image).width(900).quality(85).url() : null;
            return (
              <Link
                key={i}
                href={t.link || "#"}
                className="group relative flex h-[420px] flex-col justify-end overflow-hidden rounded-3xl bg-sable transition-transform hover:-translate-y-1 sm:h-[460px] lg:h-[520px]"
              >
                {/* Image */}
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={t.name || ""}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <PlaceholderIllustration category={t.name || ""} index={i} />
                )}

                {/* Overlay sombre */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />

                {/* Halo or décoratif top */}
                <div
                  aria-hidden
                  className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-or/30 blur-2xl opacity-60 transition-opacity group-hover:opacity-90"
                />

                {/* Contenu */}
                <div className="relative z-10 flex flex-col gap-2 p-6 text-white md:gap-3 md:p-8">
                  <h3 className="font-sora text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                    {t.name}
                  </h3>
                  {t.promo && (
                    <span className="text-xs font-semibold uppercase tracking-widest text-aurora/90 md:text-sm">
                      {t.promo}
                    </span>
                  )}
                  {/* Flèche cercle bas-droite (style proche Emma sans copie 1:1) */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-white/75">
                      Découvrir
                    </span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ivoire text-midnight transition-transform group-hover:translate-x-1 md:h-14 md:w-14">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
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

/** Illustration SVG par défaut quand pas d'image uploadée. */
function PlaceholderIllustration({ category, index }: { category: string; index: number }) {
  const gradients = [
    "bg-gradient-to-br from-midnight via-[#1E2F6B] to-midnight-dark",
    "bg-gradient-to-br from-or via-[#C8A876] to-or-dark",
    "bg-gradient-to-br from-aurora via-[#7FD4F5] to-sky",
    "bg-gradient-to-br from-lin via-beige-profond to-pierre",
  ];
  return (
    <div aria-hidden className={`absolute inset-0 ${gradients[index % 4]}`}>
      {/* Pattern décoratif */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }} />
    </div>
  );
}
