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

/**
 * Balises structurelles de document qui n'ont rien à faire dans un fragment
 * injecté au milieu d'une page. On retire la BALISE, jamais son contenu :
 * un article collé depuis un éditeur externe arrive souvent enveloppé dans
 * <html><body><main><article>, et supprimer ces conteneurs avec leurs
 * enfants effacerait l'article entier.
 *
 * `(?![\w-])` plutôt que `\b` : évite de casser un élément personnalisé
 * comme <article-card> ou <main-nav>, dont le nom commence par le même mot.
 */
const DOCUMENT_WRAPPERS = /<\/?(?:html|head|body|main|article)(?![\w-])[^>]*>/gi;

/**
 * Retire l'enveloppe de document d'un fragment éditorial.
 *
 * Déterministe : n'utilise que des expressions régulières, donc produit le
 * même résultat que DOMPurify soit chargé ou non. C'est la garantie
 * essentielle — sur le runtime serverless de Vercel, jsdom échoue parfois à
 * se charger et le sanitizer bascule sur son repli regex, historiquement
 * bien plus permissif (il laissait passer <title>, <meta> et <link>).
 */
function stripDocumentChrome(html: string): string {
  let out = html;

  // Déclaration de type et commentaires — aucun intérêt dans un fragment,
  // et un commentaire mal fermé peut avaler le reste du contenu.
  out = out.replace(/<!DOCTYPE[^>]*>/gi, "");
  out = out.replace(/<!--[\s\S]*?-->/g, "");

  // Éléments de <head> : dupliqueraient title, canonical et Open Graph
  // déjà émis par generateMetadata.
  out = out.replace(/<title\b[^>]*>[\s\S]*?<\/title\s*>/gi, "");
  out = out.replace(/<(?:meta|link|base)\b[^>]*\/?>/gi, "");

  // Scripts, JSON-LD compris : les données structurées sont générées par
  // le code à partir des champs Sanity, jamais collées dans le contenu.
  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
  out = out.replace(/<script\b[^>]*\/?>/gi, "");

  // Conteneurs de document : la balise part, les enfants restent.
  out = out.replace(DOCUMENT_WRAPPERS, "");

  return out;
}

/**
 * Nettoie un fragment HTML éditorial destiné à être injecté DANS une page.
 *
 * À utiliser partout où du HTML libre saisi dans Sanity est rendu —
 * `sanitizeHtml` seul ne suffit pas : il protège contre le XSS mais laisse
 * passer les balises de document, ce qui produit des pages à deux <title>,
 * deux <main>, deux <h1> et plusieurs canonical.
 *
 * Les <h1> du contenu sont volontairement CONSERVÉS : c'est à la page
 * appelante de décider si elle rend en plus son propre titre.
 */
export function sanitizeEditorialHtml(dirty: string): string {
  if (!dirty) return "";
  return sanitizeHtml(stripDocumentChrome(dirty));
}

/**
 * Le fragment porte-t-il un titre de niveau 1 ?
 *
 * Sert à décider si la page doit rendre son propre <h1> ou laisser celui du
 * contenu. `(?![\w-])` évite de confondre <h1> avec un élément personnalisé
 * dont le nom commencerait pareil (<h1-hero>).
 */
export function containsH1(html: string): boolean {
  return /<h1(?![\w-])/i.test(html);
}

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
        // <style> : les articles DreamsFly embarquent leur CSS préfixé .df-
        ADD_TAGS: ["style", "iframe"],
        ADD_ATTR: [
          "allow",
          "allowfullscreen",
          "frameborder",
          "referrerpolicy",
          // Attributs d'images responsives et de performance utilisés par
          // les articles : sans eux, srcset et lazy-loading sautent.
          "srcset",
          "sizes",
          "loading",
          "fetchpriority",
          "target",
          "rel",
          "width",
          "height",
        ],
        // main/article/title/meta/link/base sont déjà retirés en amont par
        // stripDocumentChrome ; les interdire ici couvre le cas où
        // sanitizeHtml serait appelé directement. KEEP_CONTENT (défaut
        // true) garantit que seuls les conteneurs partent, pas leur contenu.
        FORBID_TAGS: [
          "script",
          "object",
          "embed",
          "form",
          "input",
          "button",
          "main",
          "article",
          "title",
          "meta",
          "link",
          "base",
        ],
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
