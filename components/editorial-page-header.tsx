import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import { UspStrip } from "./usp-strip";

/**
 * En-tête éditorial partagé — direction A (luxe).
 *
 * 2 modes selon la présence d'une image :
 *
 * SANS image (fond crème/noir) — layout centré texte :
 *   - Fil d'ariane discret
 *   - Eyebrow trait+or
 *   - H1 Fraunces XXL avec dernier mot en italique or
 *   - Lead texte
 *
 * AVEC image — HERO PLEINE LARGEUR :
 *   - Image full-cover en background
 *   - Overlay dégradé sombre pour lisibilité (from-black/85)
 *   - Texte blanc superposé en bas-gauche
 *   - Fil d'ariane en haut
 *   - min-h 480px mobile / 620px desktop
 */
type Crumb = { name: string; url: string };

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  breadcrumbs?: Crumb[];
  meta?: React.ReactNode;
  tone?: "cream" | "noir";
  emphasize?: number;
  image?: any;
  imageUrl?: string;
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
}: Props) {
  const isNoir = tone === "noir";
  const resolvedImageUrl = imageUrl || (image ? urlFor(image).width(1920).quality(88).url() : null);
  const hasImage = !!resolvedImageUrl;

  // ─── MODE IMAGE : hero pleine largeur avec texte overlay ───
  if (hasImage) {
    return (
      <>
      <section className="relative overflow-hidden bg-noir text-ivoire">
        <Image
          src={resolvedImageUrl}
          alt={image?.alt || title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Overlay sombre pour lisibilité de la typo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,11,15,0.55) 0%, rgba(11,11,15,0.35) 40%, rgba(11,11,15,0.85) 100%)",
          }}
          aria-hidden="true"
        />
        {/* Halo ambré signature bas-droite */}
        <div
          className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(200,168,118,0.35), transparent 65%)" }}
          aria-hidden="true"
        />

        <div className="relative mx-auto flex min-h-[480px] max-w-site flex-col justify-between px-6 pb-14 pt-10 md:min-h-[620px] md:px-10 md:pb-24 md:pt-12">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <nav
              className="flex flex-wrap items-center gap-2 font-sans text-[11px] uppercase tracking-[0.14em] text-ivoire/60"
              aria-label="Fil d'ariane"
            >
              {breadcrumbs.map((c, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <span key={i} className="flex items-center gap-2">
                    {isLast ? (
                      <span className="text-ivoire">{c.name}</span>
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

          <div className="mt-auto max-w-4xl">
            {eyebrow && (
              <span className="eyebrow-editorial mb-5 text-or">
                {eyebrow}
              </span>
            )}
            <h1 className="display-serif mt-5 text-[2.4rem] font-normal text-ivoire md:text-[4.6rem] lg:text-[5.6rem]">
              {emphasize > 0 ? emphasizeLast(title, emphasize) : title}
            </h1>
            {lead && (
              <p className="mt-6 max-w-[54ch] font-serif text-[17px] italic leading-relaxed text-ivoire/85 md:mt-8 md:text-[20px]">
                {lead}
              </p>
            )}
            {meta && (
              <div className="mt-6 font-sans text-[13px] leading-relaxed text-ivoire/70">
                {meta}
              </div>
            )}
          </div>
        </div>
      </section>
      <UspStrip tone="noir" />
      </>
    );
  }

  // ─── MODE SANS IMAGE : hero éditorial fond crème / noir ───
  return (
    <>
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

        <div className={`grid gap-10 ${meta ? "md:grid-cols-[1.6fr_1fr] md:items-end md:gap-16" : ""}`}>
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
          </div>
          {meta && (
            <div
              className={`font-sans text-[13px] leading-relaxed md:text-right ${
                isNoir ? "text-ivoire/70" : "text-taupe"
              }`}
            >
              {meta}
            </div>
          )}
        </div>
      </div>
    </section>
    <UspStrip tone="noir" />
    </>
  );
}

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
