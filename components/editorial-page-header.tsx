import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

/**
 * En-tête éditorial partagé — direction A (luxe).
 * Utilisé sur toutes les pages secondaires : catégorie, landing, magasin,
 * magazine, glossaire, comparatifs, aide, etc.
 *
 * Modes :
 *  - `tone="cream"` (défaut) : fond crème/beige, texte noir
 *  - `tone="noir"`          : fond noir, texte ivoire, or intensifié
 *
 * Image :
 *  - `image` : Sanity image object → hero avec image en split (texte gauche + image droite)
 *  - `imageUrl` : URL directe (fallback simple)
 *  - Si aucune image, layout centré sur texte comme avant
 */
type Crumb = { name: string; url: string };

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  breadcrumbs?: Crumb[];
  meta?: React.ReactNode;
  tone?: "cream" | "noir";
  /** Nombre du dernier mot à passer en italique — 1 par défaut. Passer 0 pour désactiver. */
  emphasize?: number;
  /** Image Sanity — génère un hero split image droite */
  image?: any;
  /** URL directe (alternative à `image`) */
  imageUrl?: string;
  /** Aspect ratio de l'image — défaut 4/5 */
  imageAspect?: string;
};

export function EditorialPageHeader({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  meta,
  tone = "cream",
  emphasize = 1,
  image,
  imageUrl,
  imageAspect = "4/5",
}: Props) {
  const isNoir = tone === "noir";
  const resolvedImageUrl = imageUrl || (image ? urlFor(image).width(1400).quality(88).url() : null);
  const hasImage = !!resolvedImageUrl;

  return (
    <section
      className={`${isNoir ? "bg-noir text-ivoire" : "bg-page text-ink"} border-b ${
        isNoir ? "border-white/10" : "border-ink/10"
      }`}
    >
      <div className="mx-auto max-w-site px-6 pb-14 pt-12 md:px-10 md:pb-24 md:pt-16">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            className={`mb-10 flex flex-wrap items-center gap-2 font-sans text-[11px] uppercase tracking-[0.14em] ${
              isNoir ? "text-ivoire/50" : "text-taupe"
            }`}
            aria-label="Fil d'ariane"
          >
            {breadcrumbs.map((c, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <span key={i} className="flex items-center gap-2">
                  {isLast ? (
                    <span className={isNoir ? "text-ivoire" : "text-ink"}>{c.name}</span>
                  ) : (
                    <Link href={c.url} className="transition-colors hover:text-or">
                      {c.name}
                    </Link>
                  )}
                  {!isLast && <span className="opacity-40">/</span>}
                </span>
              );
            })}
          </nav>
        )}

        <div
          className={`grid gap-10 ${
            hasImage
              ? "md:grid-cols-[1.1fr_1fr] md:items-center md:gap-16"
              : meta
                ? "md:grid-cols-[1.6fr_1fr] md:items-end md:gap-16"
                : ""
          }`}
        >
          <div>
            {eyebrow && (
              <span className={`eyebrow-editorial ${isNoir ? "" : "on-cream"} mb-5`}>{eyebrow}</span>
            )}
            <h1
              className={`display-serif ${isNoir ? "" : "on-cream"} mt-5 text-[2.4rem] font-normal md:text-[4.4rem] lg:text-[5.2rem]`}
            >
              {emphasize > 0 ? emphasizeLast(title, emphasize) : title}
            </h1>
            {lead && (
              <p
                className={`mt-6 max-w-[52ch] font-sans text-[15px] leading-relaxed md:mt-8 md:text-[17px] ${
                  isNoir ? "text-ivoire/70" : "text-taupe"
                }`}
              >
                {lead}
              </p>
            )}
            {meta && !hasImage && (
              <div
                className={`mt-6 font-sans text-[13px] leading-relaxed ${
                  isNoir ? "text-ivoire/70" : "text-taupe"
                }`}
              >
                {meta}
              </div>
            )}
          </div>

          {hasImage && (
            <div
              className="relative overflow-hidden rounded-[28px] shadow-[0_30px_60px_-20px_rgba(11,11,15,0.25)]"
              style={{ aspectRatio: imageAspect }}
            >
              <Image
                src={resolvedImageUrl}
                alt={image?.alt || title}
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
                priority
              />
              {/* Subtile teinte ambrée pour l'unité graphique */}
              <div
                aria-hidden
                className="absolute inset-0 mix-blend-overlay opacity-15"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(200, 168, 118, 0.4), transparent 60%)",
                }}
              />
            </div>
          )}

          {meta && hasImage && (
            <div
              className={`col-span-full font-sans text-[13px] leading-relaxed ${
                isNoir ? "text-ivoire/70" : "text-taupe"
              }`}
            >
              {meta}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** Enveloppe les `n` derniers mots dans <em> pour la mise en italique or. */
function emphasizeLast(title: string, n: number): React.ReactNode {
  const words = title.trim().split(/\s+/);
  if (words.length <= n) return title;
  const head = words.slice(0, words.length - n).join(" ");
  const tail = words.slice(words.length - n).join(" ");
  return (
    <>
      {head} <em>{tail}</em>
    </>
  );
}
