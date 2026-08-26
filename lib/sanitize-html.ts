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
 * Enveloppes de document à retirer PUREMENT (la balise part, les enfants
 * restent) : elles ne portent jamais de mise en forme.
 *
 * `(?![\w-])` plutôt que `\b` : évite de casser un élément personnalisé
 * comme <article-card> ou <main-nav>, dont le nom commence par le même mot.
 */
const BARE_WRAPPERS = /<\/?(?:html|head|body)(?![\w-])[^>]*>/gi;

/**
 * Conteneurs sémantiques à TRANSFORMER en <div>, pas à supprimer.
 *
 * Un article rédigé porte sa mise en forme sur son conteneur racine —
 * typiquement <main class="df-guide">. Supprimer la balise emporterait la
 * classe, et avec elle toutes les règles CSS `.df-guide …`. On remplace donc
 * le nom de l'élément en conservant ses attributs intacts : la page garde un
 * seul <main> et un seul <article>, sans rien perdre du design.
 */
const SEMANTIC_WRAPPERS_OPEN = /<(?:main|article)(?![\w-])([^>]*)>/gi;
const SEMANTIC_WRAPPERS_CLOSE = /<\/(?:main|article)(?![\w-])\s*>/gi;

/** Anciennes URL encore présentes dans le contenu Sanity → routes réelles. */
const LEGACY_LINKS: Record<string, string> = {
  "/blog/comment-choisir-son-matelas": "/magazine/guide-choisir-matelas",
  "/blog/quel-matelas-mal-de-dos": "/magazine/matelas-mal-de-dos",
  "/quiz-oreiller": "/quiz",
  "/showrooms": "/magasins",
  "/collections/oreillers": "/oreillers",
};

/**
 * Réécrit les liens hérités au moment du rendu.
 *
 * Les anciennes URL restent enregistrées en base : plutôt que de modifier le
 * contenu des rédacteurs, on les corrige à l'affichage. Des redirections
 * permanentes dans next.config.ts couvrent en second rideau les liens
 * externes et les favoris déjà en circulation.
 *
 * La partie query et ancre est préservée : /showrooms#paris → /magasins#paris
 */
export function normalizeLegacyLinks(html: string): string {
  return html.replace(
    /(\shref\s*=\s*)(["'])([^"']*)\2/gi,
    (match, prefix: string, quote: string, href: string) => {
      const [pathPart, ...restParts] = href.split(/(?=[?#])/);
      const rest = restParts.join("");
      const clean = pathPart.replace(/\/+$/, "") || pathPart;
      const target = LEGACY_LINKS[clean] ?? LEGACY_LINKS[pathPart];
      return target ? `${prefix}${quote}${target}${rest}${quote}` : match;
    },
  );
}

/**
 * Neutralise le contenu d'une feuille de style éditoriale.
 *
 * Le CSS n'est pas exécutable, mais trois vecteurs subsistent : `expression()`
 * (vieux IE), les URL `javascript:`, et `@import` qui chargerait une feuille
 * distante — bloquée par la CSP du site, donc autant la retirer proprement.
 * On neutralise aussi toute séquence `</style` qui permettrait de sortir de
 * l'élément et d'injecter du balisage.
 */
function sanitizeCss(css: string): string {
  return css
    .replace(/<\/style/gi, "<\\/style")
    .replace(/expression\s*\(/gi, "expr-blocked(")
    .replace(/javascript\s*:/gi, "blocked:")
    .replace(/@import\b[^;]*;?/gi, "");
}

/**
 * Extrait les feuilles de style avant sanitisation.
 *
 * Les <style> sont mis de côté puis réinjectés APRÈS le passage dans le
 * sanitizer, et non confiés à DOMPurify. Raison : la préservation du CSS
 * devient alors indépendante du chemin emprunté — DOMPurify chargé ou repli
 * regex, le résultat est le même. C'est ce qui garantit que le design
 * éditorial `.df-` survit sur le runtime serverless, là où jsdom échoue
 * parfois à se charger.
 *
 * Fonctionne que le <style> vienne du <head> ou du corps du document.
 */
function extractStyles(html: string): { styles: string[]; rest: string } {
  const styles: string[] = [];
  const rest = html.replace(
    /<style\b([^>]*)>([\s\S]*?)<\/style\s*>/gi,
    (_match, attrs: string, css: string) => {
      // Seuls `media` et `type` sont conservés : tout le reste, à commencer
      // par un éventuel handler on*, est écarté.
      const media = /\smedia\s*=\s*(["'])([^"']*)\1/i.exec(attrs);
      const openTag = media ? `<style media="${media[2]}">` : "<style>";
      styles.push(`${openTag}${sanitizeCss(css)}</style>`);
      return "";
    },
  );
  return { styles, rest };
}

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
  // déjà émis par generateMetadata. Les <style> ont été mis à l'abri avant.
  out = out.replace(/<title\b[^>]*>[\s\S]*?<\/title\s*>/gi, "");
  out = out.replace(/<(?:meta|link|base)\b[^>]*\/?>/gi, "");

  // Scripts, JSON-LD compris : les données structurées sont générées par
  // le code à partir des champs Sanity, jamais collées dans le contenu.
  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
  out = out.replace(/<script\b[^>]*\/?>/gi, "");

  // <main> et <article> deviennent des <div> : leurs attributs — donc leurs
  // classes de mise en forme — sont conservés tels quels.
  out = out.replace(SEMANTIC_WRAPPERS_OPEN, (_m, attrs: string) => `<div${attrs}>`);
  out = out.replace(SEMANTIC_WRAPPERS_CLOSE, "</div>");

  // html / head / body : purement retirés, ils ne portent pas de style.
  out = out.replace(BARE_WRAPPERS, "");

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
 *
 * Les feuilles de style sont remises en tête du fragment. L'ordre n'a pas
 * d'incidence sur l'application du CSS, et cela garantit leur survie quel
 * que soit le comportement de DOMPurify.
 */
export function sanitizeEditorialHtml(dirty: string): string {
  if (!dirty) return "";
  const { styles, rest } = extractStyles(dirty);
  const body = sanitizeHtml(normalizeLegacyLinks(stripDocumentChrome(rest)));
  return styles.join("") + body;
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
