import { test } from "node:test";
import assert from "node:assert/strict";
import { stripBrandSuffix, computeIndexingEnabled } from "../lib/seo/metadata.ts";

/**
 * Le suffixe de marque est ajouté une fois et une seule, par le
 * `title.template` de app/layout.tsx. Tout « DreamsFly » déjà présent en fin
 * d'un champ Sanity doit donc être retiré en amont, sinon il ressort en
 * double — voire en triple — dans la balise <title>.
 */

test("retire le suffixe séparé par un tiret cadratin", () => {
  assert.equal(
    stripBrandSuffix("Comment choisir son oreiller ? Guide expert 2026 — DreamsFly"),
    "Comment choisir son oreiller ? Guide expert 2026",
  );
});

test("retire le suffixe séparé par une barre verticale", () => {
  assert.equal(stripBrandSuffix("Matelas mémoire de forme | DreamsFly"), "Matelas mémoire de forme");
});

test("retire le suffixe séparé par un point médian", () => {
  assert.equal(stripBrandSuffix("Nos showrooms · DreamsFly"), "Nos showrooms");
});

test("retire plusieurs suffixes successifs", () => {
  // Cas réel visé par la consigne : un metaTitle Sanity déjà suffixé, auquel
  // l'ancien buildMetadata ajoutait encore « · DreamsFly ».
  assert.equal(
    stripBrandSuffix("Comment choisir son oreiller ? Guide expert 2026 — DreamsFly · DreamsFly"),
    "Comment choisir son oreiller ? Guide expert 2026",
  );
  assert.equal(
    stripBrandSuffix("Guide sommier | DreamsFly | DreamsFly | DreamsFly"),
    "Guide sommier",
  );
});

test("laisse intact un titre sans suffixe", () => {
  assert.equal(stripBrandSuffix("Guide d'achat du matelas"), "Guide d'achat du matelas");
});

test("ne touche pas à la marque citée en milieu de titre", () => {
  // « DreamsFly » n'est retiré que s'il termine le titre après un séparateur.
  assert.equal(
    stripBrandSuffix("Pourquoi DreamsFly fabrique en Europe"),
    "Pourquoi DreamsFly fabrique en Europe",
  );
});

test("ne renvoie jamais une chaîne vide", () => {
  // Un titre réduit au seul nom de marque doit rester exploitable.
  assert.equal(stripBrandSuffix("DreamsFly"), "DreamsFly");
});

test("normalise les espaces résiduels", () => {
  assert.equal(stripBrandSuffix("Guide oreiller   |   DreamsFly   "), "Guide oreiller");
});

// ─────────────────────────────────────────────────────────────
// Verrouillage de l'indexation
// ─────────────────────────────────────────────────────────────

/**
 * Trois conditions cumulatives. La première — VERCEL_ENV === "production" —
 * est posée par Vercel lui-même : c'est le garde-fou qui tient même si
 * SEO_INDEXING_ENABLED est activé par erreur sur l'environnement Preview.
 */

test("preview Vercel : jamais indexable, même avec l'interrupteur à true", () => {
  assert.equal(
    computeIndexingEnabled({
      VERCEL_ENV: "preview",
      SEO_INDEXING_ENABLED: "true",
      NEXT_PUBLIC_SITE_URL: "https://www.dreamsfly.fr",
    }),
    false,
  );
});

test("preview Vercel avec URL de preview : non indexable", () => {
  assert.equal(
    computeIndexingEnabled({
      VERCEL_ENV: "preview",
      SEO_INDEXING_ENABLED: "true",
      NEXT_PUBLIC_SITE_URL: "https://dreamsfly-git-fix-seo.vercel.app",
    }),
    false,
  );
});

test("production autorisée : indexable", () => {
  assert.equal(
    computeIndexingEnabled({
      VERCEL_ENV: "production",
      SEO_INDEXING_ENABLED: "true",
      NEXT_PUBLIC_SITE_URL: "https://www.dreamsfly.fr",
    }),
    true,
  );
  // L'apex est également accepté : c'est lui que le site utilise comme
  // domaine canonique, www redirigeant vers lui.
  assert.equal(
    computeIndexingEnabled({
      VERCEL_ENV: "production",
      SEO_INDEXING_ENABLED: "true",
      NEXT_PUBLIC_SITE_URL: "https://dreamsfly.fr",
    }),
    true,
  );
});

test("production avec interrupteur désactivé : non indexable", () => {
  assert.equal(
    computeIndexingEnabled({
      VERCEL_ENV: "production",
      SEO_INDEXING_ENABLED: "false",
      NEXT_PUBLIC_SITE_URL: "https://www.dreamsfly.fr",
    }),
    false,
  );
  // Variable absente = désactivé.
  assert.equal(
    computeIndexingEnabled({
      VERCEL_ENV: "production",
      NEXT_PUBLIC_SITE_URL: "https://www.dreamsfly.fr",
    }),
    false,
  );
});

test("production sur un domaine étranger : non indexable", () => {
  // Le cas du domaine parqué Hostinger : toutes les autres conditions sont
  // réunies, mais l'hôte n'est pas celui du site.
  assert.equal(
    computeIndexingEnabled({
      VERCEL_ENV: "production",
      SEO_INDEXING_ENABLED: "true",
      NEXT_PUBLIC_SITE_URL: "https://dreamsfly.hostingersite.com",
    }),
    false,
  );
});

test("développement local : non indexable", () => {
  assert.equal(
    computeIndexingEnabled({
      SEO_INDEXING_ENABLED: "true",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    }),
    false,
  );
});

test("URL malformée ou absente : non indexable", () => {
  assert.equal(
    computeIndexingEnabled({ VERCEL_ENV: "production", SEO_INDEXING_ENABLED: "true" }),
    false,
  );
  assert.equal(
    computeIndexingEnabled({
      VERCEL_ENV: "production",
      SEO_INDEXING_ENABLED: "true",
      NEXT_PUBLIC_SITE_URL: "pas-une-url",
    }),
    false,
  );
});
