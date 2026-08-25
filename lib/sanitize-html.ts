/**
 * Sanitize le HTML libre saisi dans Sanity (blocs htmlBlock) avant
 * injection via dangerouslySetInnerHTML.
 *
 * Politique :
 *  ✅ Autorisé : tout le HTML de mise en page, <style> (styling custom),
 *     <iframe> (YouTube/Vimeo/Maps/Spotify uniquement — allowlist)
 *  ❌ Supprimé : <script>, handlers on* (onclick, onerror…), javascript: URLs,
 *     <object>/<embed>/<form>
 *
 * Implémentation à deux niveaux :
 *  1. DOMPurify (via isomorphic-dompurify) chargé PARESSEUSEMENT et sous
 *     try/catch — sur certains runtimes serverless le chargement de jsdom
 *     échoue (require d'un module ESM) et faisait tomber les pages en 500.
 *  2. Fallback regex autonome si DOMPurify indisponible : moins fin mais
 *     couvre les vecteurs XSS principaux, et surtout NE CRASHE JAMAIS.
 */

const IFRAME_ALLOWED_HOSTS = [
  "www.youtube.com",
  "www.youtube-nocookie.com",
  "player.vimeo.com",
  "www.google.com", // Google Maps embed
  "open.spotify.com",
];

type Sanitizer = (dirty: string) => string;

let cachedSanitizer: Sanitizer | null = null;

/** Fallback sans dépendance — strip les vecteurs XSS principaux par regex. */
function fallbackSanitize(dirty: string): string {
  let out = dirty;
  // <script>…</script> et <script …/> — y compris multiline
  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
  out = out.replace(/<script\b[^>]*\/?\s*>/gi, "");
  // object / embed / form / input / button
  out = out.replace(/<\/?(?:object|embed|form|input|button)\b[^>]*>/gi, "");
  // Handlers inline on*="…" / on*='…' / on*=…
  out = out.replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*'[^']*'/gi, "");
  out = out.replace(/\son[a-z]+\s*=\s*[^\s>]+/gi, "");
  // javascript: dans href/src
  out = out.replace(/\s(href|src)\s*=\s*(["']?)\s*javascript:[^"'\s>]*\2/gi, "");
  // iframes hors allowlist
  out = out.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe\s*>|<iframe\b[^>]*\/?\s*>/gi, (match) => {
    const srcMatch = match.match(/\ssrc\s*=\s*["']([^"']+)["']/i);
    if (!srcMatch) return "";
    try {
      const host = new URL(srcMatch[1], "https://x.invalid").hostname;
      return IFRAME_ALLOWED_HOSTS.includes(host) ? match : "";
    } catch {
      return "";
    }
  });
  return out;
}

/** Tente de construire le sanitizer DOMPurify ; fallback regex sinon. */
function buildSanitizer(): Sanitizer {
  try {
    // Chargement paresseux — c'est ici que jsdom peut échouer sur certains
    // runtimes serverless. Le try/catch garantit qu'on ne crashe jamais.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const DOMPurify = require("isomorphic-dompurify");
    const purify = DOMPurify.default || DOMPurify;

    purify.addHook("uponSanitizeElement", (node: Element, data: { tagName: string }) => {
      if (data.tagName === "iframe") {
        const src = node.getAttribute?.("src") || "";
        try {
          const host = new URL(src, "https://x.invalid").hostname;
          if (!IFRAME_ALLOWED_HOSTS.includes(host)) node.remove?.();
        } catch {
          node.remove?.();
        }
      }
    });

    // Sanity check : vérifie que la lib fonctionne réellement
    const test = purify.sanitize("<b>ok</b><script>bad()</script>");
    if (typeof test !== "string" || test.includes("script")) throw new Error("dompurify inopérant");

    return (dirty: string) =>
      purify.sanitize(dirty, {
        ADD_TAGS: ["style", "iframe"],
        ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "loading", "referrerpolicy"],
        FORBID_TAGS: ["script", "object", "embed", "form", "input", "button"],
        FORBID_ATTR: ["onerror", "onclick", "onload", "onmouseover", "onfocus", "onanimationstart"],
      });
  } catch (err) {
    console.warn("[sanitize-html] DOMPurify indisponible, fallback regex :", (err as Error)?.message);
    return fallbackSanitize;
  }
}

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";
  if (!cachedSanitizer) cachedSanitizer = buildSanitizer();
  try {
    return cachedSanitizer(dirty);
  } catch {
    // Ceinture + bretelles : même si le sanitizer choisi jette à l'exécution,
    // on retombe sur le fallback plutôt que de faire tomber la page.
    cachedSanitizer = fallbackSanitize;
    return fallbackSanitize(dirty);
  }
}
