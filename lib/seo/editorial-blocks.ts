import { sanitizeEditorialHtml, containsH1 } from "@/lib/sanitize-html";

/**
 * Préparation des blocs HTML libres d'un document Sanity avant rendu.
 *
 * Extrait de la page Magazine pour être testable isolément : la décision
 * « faut-il rendre notre propre <h1> ? » est un invariant SEO, elle mérite
 * une couverture de tests propre.
 */

/** Bloc de contenu Sanity, réduit à ce dont on a besoin ici. */
type BodyBlock = { _type?: string; _key?: string; html?: unknown };

/**
 * Nettoie tous les blocs `htmlBlock` d'un corps d'article, une fois pour
 * toutes, et les indexe par `_key`.
 *
 * Le nettoyage a lieu AVANT le rendu : la page doit savoir si le contenu
 * éditorial porte déjà un <h1>, information impossible à obtenir depuis
 * l'intérieur du rendu de PortableText.
 */
export function sanitizeHtmlBlocks(body: BodyBlock[] | null | undefined): Map<string, string> {
  const out = new Map<string, string>();
  for (const block of body || []) {
    if (block?._type === "htmlBlock" && typeof block.html === "string" && block._key) {
      out.set(block._key, sanitizeEditorialHtml(block.html));
    }
  }
  return out;
}

/** Au moins un des blocs nettoyés porte-t-il déjà un titre de niveau 1 ? */
export function hasEditorialH1(sanitized: Map<string, string>): boolean {
  for (const html of sanitized.values()) {
    if (containsH1(html)) return true;
  }
  return false;
}
