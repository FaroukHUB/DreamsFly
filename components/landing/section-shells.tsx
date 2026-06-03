/**
 * Shells de section — encapsulent les blocs avec variations visuelles
 * selon le layout choisi et la position dans la page. Permet de casser
 * le footprint SEO sans dupliquer le code des blocs.
 */
import { type ReactNode } from "react";

type LayoutVariant = "editorial" | "comparative" | "showcase" | "tutorial" | "compact";

type SectionShellProps = {
  children: ReactNode;
  layout: LayoutVariant;
  /** Position 0-based de la section dans la page (utilisé pour alternance). */
  index: number;
  /** Type de bloc rendu pour décider du shell. */
  blockType: string;
};

/**
 * Retourne les classes utilitaires à appliquer à un wrapper de section,
 * selon le layout choisi et la position de la section.
 *
 * Editorial : sections respirées avec alternance de fonds, max-width article
 * Comparative : containers larges, plus de tableaux
 * Showcase : sections plus visuelles, alternance image gauche/droite
 * Tutorial : structure step-by-step, fond uniforme
 * Compact : fonds alternés rapides, CTAs forts
 */
export function getShellClasses({
  layout,
  index,
  blockType,
}: Omit<SectionShellProps, "children">): {
  outer: string;
  inner: string;
} {
  // Sections qui restent toujours full-bleed (avec leurs propres fonds)
  const fullBleed = ["ctaBlock", "useCaseBlock"].includes(blockType);

  const alt = index % 2 === 1;

  switch (layout) {
    case "editorial":
      return {
        outer: fullBleed ? "" : alt ? "bg-sable" : "bg-ivoire",
        inner: "mx-auto max-w-3xl px-8 py-16",
      };
    case "comparative":
      return {
        outer: alt ? "bg-sable" : "bg-ivoire",
        inner: "mx-auto max-w-5xl px-8 py-14",
      };
    case "showcase":
      return {
        outer: alt ? "bg-lin" : "bg-ivoire",
        inner: "mx-auto max-w-site px-8 py-20",
      };
    case "tutorial":
      return {
        outer: "bg-ivoire",
        inner: "mx-auto max-w-3xl px-8 py-12 border-b border-border last:border-b-0",
      };
    case "compact":
      return {
        outer: alt ? "bg-midnight text-white" : "bg-ivoire",
        inner: "mx-auto max-w-4xl px-8 py-12",
      };
    default:
      return {
        outer: alt ? "bg-sable" : "bg-ivoire",
        inner: "mx-auto max-w-3xl px-8 py-16",
      };
  }
}
