import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize le HTML libre saisi dans Sanity (blocs htmlBlock) avant
 * injection via dangerouslySetInnerHTML.
 *
 * Politique :
 *  ✅ Autorisé : tout le HTML de mise en page, <style> (styling custom),
 *     <iframe> (YouTube/Vimeo/Maps uniquement — allowlist de domaines)
 *  ❌ Supprimé : <script>, handlers on* (onclick, onerror…), javascript: URLs,
 *     <object>/<embed>/<form>, iframes hors allowlist
 *
 * Même si l'admin est aujourd'hui le seul éditeur Studio, cette barrière
 * évite qu'un compte compromis ou un futur collaborateur puisse injecter
 * du script exécutable sur le site (vol de session, redirections, skimming).
 */

const IFRAME_ALLOWED_HOSTS = [
  "www.youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
  "www.google.com", // Google Maps embed
  "open.spotify.com",
];

// Hook : filtre les iframes selon leur domaine source
DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  if (data.tagName === "iframe") {
    const src = (node as Element).getAttribute?.("src") || "";
    try {
      const host = new URL(src, "https://x.invalid").hostname;
      if (!IFRAME_ALLOWED_HOSTS.includes(host)) {
        (node as Element).remove?.();
      }
    } catch {
      (node as Element).remove?.();
    }
  }
});

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    // <style> pour le CSS custom, <iframe> pour les embeds (filtrés par le hook)
    ADD_TAGS: ["style", "iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "loading", "referrerpolicy"],
    // Jamais de scripts ni de handlers inline
    FORBID_TAGS: ["script", "object", "embed", "form", "input", "button"],
    FORBID_ATTR: ["onerror", "onclick", "onload", "onmouseover", "onfocus", "onanimationstart"],
  });
}
