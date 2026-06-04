/**
 * Shells de section — encapsulent les blocs avec variations visuelles.
 * Anti-footprint : varie les fonds + containers selon le layout choisi
 * et le type de bloc rendu.
 */
import { type ReactNode } from "react";

type LayoutVariant = "editorial" | "comparative" | "showcase" | "tutorial" | "compact";

type SectionShellProps = {
  children: ReactNode;
  layout: LayoutVariant;
  index: number;
  blockType: string;
};

// Blocs qui ont besoin d'être PLEINE LARGEUR (cassent la contrainte du layout)
const WIDE_BLOCKS = new Set([
  "productsGrid",
  "lifestyleImageBlock",
  "comparisonTable",
  "relatedPagesBlock",
  "ctaBlock",
]);

// Blocs qui ont leurs propres fonds (pas de shell coloré)
const SELF_STYLED = new Set(["ctaBlock", "useCaseBlock", "lifestyleImageBlock"]);

export function getShellClasses({
  layout,
  index,
  blockType,
}: Omit<SectionShellProps, "children">): {
  outer: string;
  inner: string;
} {
  const isWide = WIDE_BLOCKS.has(blockType);
  const isSelfStyled = SELF_STYLED.has(blockType);
  const alt = index % 2 === 1;

  switch (layout) {
    case "editorial":
      return {
        outer: isSelfStyled ? "" : alt ? "bg-sable" : "bg-ivoire",
        inner: isWide
          ? "mx-auto max-w-site px-8 py-16"
          : "mx-auto max-w-3xl px-8 py-16",
      };
    case "comparative":
      return {
        outer: isSelfStyled ? "" : alt ? "bg-sable" : "bg-ivoire",
        inner: isWide
          ? "mx-auto max-w-site px-8 py-14"
          : "mx-auto max-w-5xl px-8 py-14",
      };
    case "showcase":
      return {
        outer: isSelfStyled ? "" : alt ? "bg-lin" : "bg-ivoire",
        inner: "mx-auto max-w-site px-8 py-20",
      };
    case "tutorial":
      return {
        outer: "bg-ivoire",
        inner: isWide
          ? "mx-auto max-w-site px-8 py-12 border-b border-border last:border-b-0"
          : "mx-auto max-w-3xl px-8 py-12 border-b border-border last:border-b-0",
      };
    case "compact":
      return {
        outer: isSelfStyled ? "" : alt ? "bg-midnight text-white" : "bg-ivoire",
        inner: isWide
          ? "mx-auto max-w-site px-8 py-12"
          : "mx-auto max-w-4xl px-8 py-12",
      };
    default:
      return {
        outer: isSelfStyled ? "" : alt ? "bg-sable" : "bg-ivoire",
        inner: isWide
          ? "mx-auto max-w-site px-8 py-16"
          : "mx-auto max-w-3xl px-8 py-16",
      };
  }
}
