import Link from "next/link";
import { categoryIntro } from "@/lib/category-defaults";

/**
 * Texte d'orientation d'achat, sous la grille de produits.
 *
 * POURQUOI
 * Les pages catégorie n'avaient qu'une phrase de chapeau au-dessus de la
 * grille. Une grille de produits sans texte ne dit rien du sujet traité —
 * ni à un moteur de recherche, ni à un visiteur qui découvre la literie et
 * cherche d'abord à comprendre comment choisir.
 *
 * QUAND IL S'EFFACE
 * Dès que la page pilier Sanity fournit ses propres sections éditoriales.
 * Ce texte comble un vide, il ne double jamais un contenu rédigé : deux
 * blocs traitant du même sujet sur la même page se cannibaliseraient.
 *
 * Le lien vers le guide reste affiché dans les deux cas — c'est du maillage
 * interne, pas du remplissage.
 */
export function CategoryIntro({
  productType,
  hasEditorialSections,
  guide,
}: {
  productType: string;
  /** Vrai si la page pilier Sanity apporte déjà ses propres sections. */
  hasEditorialSections?: boolean;
  guide?: { href: string; label: string } | null;
}) {
  const intro = hasEditorialSections ? null : categoryIntro(productType);
  if (!intro && !guide) return null;

  return (
    <section className="mt-20 md:mt-28">
      <div className="mx-auto max-w-3xl">
        {intro && (
          <>
            <h2 className="display-serif on-cream text-[1.9rem] font-normal md:text-[2.6rem]">
              {intro.title}
            </h2>
            <div className="mt-6 space-y-5">
              {intro.paragraphs.map((p, i) => (
                <p key={i} className="font-sans text-[16px] leading-[1.75] text-pierre md:text-[17px]">
                  {p}
                </p>
              ))}
            </div>
          </>
        )}

        {guide && (
          <Link
            href={guide.href}
            className="mt-8 inline-flex items-center gap-2 border-b border-noir pb-1 font-sans text-[12px] font-medium uppercase tracking-[0.14em] text-noir transition-all hover:gap-3 hover:border-or hover:text-or focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-noir focus-visible:ring-offset-2"
          >
            {guide.label}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        )}
      </div>
    </section>
  );
}
