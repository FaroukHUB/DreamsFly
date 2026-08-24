import Link from "next/link";

/**
 * En-tête éditorial partagé — direction A (luxe).
 * Utilisé sur toutes les pages secondaires : catégorie, landing, magasin,
 * magazine, glossaire, comparatifs, aide, etc.
 *
 * Structure éditoriale : fil d'ariane discret + eyebrow trait+or + H1 Fraunces
 * XXL avec dernier mot italique or + lead texte + rule + optionnelle méta droite.
 *
 * Deux modes :
 *  - `tone="cream"` (défaut) : fond crème/beige, texte noir
 *  - `tone="noir"`          : fond noir, texte ivoire, or intensifié
 */
type Crumb = { name: string; url: string };

type Props = {
  eyebrow?: string;
  title: string;
  lead?: string;
  breadcrumbs?: Crumb[];
  meta?: React.ReactNode;
  tone?: "cream" | "noir";
  /** Nombre du dernier mot à passer en italique — 1 par défaut (le dernier). Passer 0 pour désactiver. */
  emphasize?: number;
};

export function EditorialPageHeader({
  eyebrow,
  title,
  lead,
  breadcrumbs,
  meta,
  tone = "cream",
  emphasize = 1,
}: Props) {
  const isNoir = tone === "noir";
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
