#!/usr/bin/env node
/**
 * Dry-run des corrections SEO sur l'article « guide-choisir-oreiller ».
 *
 * PAR DÉFAUT : n'écrit RIEN. Affiche les valeurs actuelles, les valeurs
 * proposées, et signale ce qui demande une décision humaine.
 * Ajouter --publish pour appliquer (patch partiel, jamais createOrReplace).
 *
 * Usage :
 *   SANITY_PROJECT_ID=qqxvd0fj \
 *   SANITY_DATASET=production \
 *   SANITY_WRITE_TOKEN=sk... \
 *   node scripts/seo-oreiller-dryrun.mjs [--publish]
 *
 * Le script vérifie aussi les URL de sources par requête HEAD depuis TA
 * machine : aucune référence n'est proposée sans avoir répondu.
 */

import { createClient } from "@sanity/client";

const SLUG = "guide-choisir-oreiller";

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) throw new Error("SANITY_PROJECT_ID manquant");
if (!token) throw new Error("SANITY_WRITE_TOKEN manquant (rôle Editor minimum)");

const PUBLISH = process.argv.includes("--publish");
/**
 * --dump écrit le HTML actuel et sa version transformée dans deux fichiers,
 * pour relecture à l'œil. Les détections par motif ne prouvent qu'une
 * présence, jamais une absence : seule la lecture du contenu permet
 * d'affirmer qu'une revendication n'y est pas.
 */
const DUMP = process.argv.includes("--dump");

const client = createClient({ projectId, dataset, apiVersion: "2024-01-01", token, useCdn: false });

// ─────────────────────────────────────────────────────────────
// Valeurs cibles
// ─────────────────────────────────────────────────────────────

const TARGET = {
  // Sans « DreamsFly » : le title.template du layout l'ajoute déjà.
  metaTitle: "Comment choisir son oreiller ? Le guide complet",
  metaDescription:
    "Position, hauteur, fermeté, duvet ou mémoire de forme : découvrez comment choisir un oreiller adapté à votre morphologie et à votre matelas.",
  // datePublished reste au 5 juillet 2026, seule dateModified bouge.
  updatedAt: "2026-08-25T00:00:00.000Z",
};

/** Anciennes routes présentes dans le contenu → routes réelles. */
const LEGACY_LINKS = {
  "/blog/comment-choisir-son-matelas": "/magazine/guide-choisir-matelas",
  "/blog/quel-matelas-mal-de-dos": "/magazine/matelas-mal-de-dos",
  "/quiz-oreiller": "/quiz",
  "/showrooms": "/magasins",
  "/collections/oreillers": "/oreillers",
};

/**
 * Mention de date vague à SUPPRIMER (option A).
 *
 * Elle n'est pas remplacée par une date exacte : app/magazine/[slug]/page.tsx
 * rend déjà « Mis à jour le … » à partir du champ `updatedAt`. Laisser une
 * seconde mention dans le HTML afficherait deux fois la même phrase et
 * créerait une seconde source de vérité, susceptible de diverger du
 * `dateModified` du BlogPosting. Une seule date visible, un seul champ.
 */
const VAGUE_DATE_RE = /MISE\s+À\s+JOUR\s+AOÛT\s+2026/gi;

/**
 * Retire la mention de date du HTML.
 *
 * Si la mention constitue à elle seule le contenu d'un élément en ligne —
 * typiquement <span class="df-badge">MISE À JOUR AOÛT 2026</span> —, on
 * retire l'élément entier : ne supprimer que le texte laisserait un badge
 * vide, visible à l'écran comme un rectangle sans contenu.
 */
function removeVagueDate(html) {
  const removals = [];

  // 1. Élément porteur dont la mention est le seul contenu TEXTUEL.
  //
  //    Le cas réel n'est pas <span>Mise à jour août 2026</span> mais
  //    <span><b class="df-diamond">◆</b> Mise à jour août 2026</span> : une
  //    puce décorative accompagne le texte. N'enlever que le texte laisserait
  //    un losange orphelin flottant dans la barre de méta. On compare donc le
  //    contenu débarrassé de ses balises et de ses puces.
  //    Volontairement limité aux éléments EN LIGNE : inclure div ou p ferait
  //    capturer le conteneur parent (<div class="df-meta">) avant ses enfants,
  //    et son texte global ne correspondrait à rien — les spans internes ne
  //    seraient alors jamais examinés.
  const BLOCK = /<(span|li|em|strong|small|b|i)\b[^>]*>((?:(?!<\/?\1\b)[\s\S])*)<\/\1\s*>/gi;
  let out = html.replace(BLOCK, (match, _tag, inner) => {
    const textOnly = inner
      .replace(/<[^>]*>/g, "") // balises décoratives
      .replace(/[◆•·|—–\-\s]/g, " ") // puces et séparateurs
      .trim();
    if (/^mise\s+à\s+jour\s+ao[uû]t\s+2026$/i.test(textOnly)) {
      removals.push({ kind: "élément porteur entier", snippet: match });
      return "";
    }
    return match;
  });

  // 2. Mention nue au fil du texte.
  out = out.replace(VAGUE_DATE_RE, (m) => {
    removals.push({ kind: "texte seul", snippet: m });
    return "";
  });

  // Nettoyage de la ponctuation devenue orpheline : séparateurs en fin
  // d'élément, parenthèses et crochets vides, espaces doublés. Sans cela une
  // mention retirée au milieu d'une phrase laisse « Ce guide () vous aide ».
  out = out.replace(/(\s*[·—–|]\s*)(?=\s*<\/)/g, "");
  out = out.replace(/\(\s*\)/g, "");
  out = out.replace(/\[\s*\]/g, "");
  out = out.replace(/\s+([.,;:!?])/g, "$1");

  // Filet de sécurité : tout élément en ligne dont il ne reste que de la
  // décoration — une puce ◆, un séparateur — est retiré à son tour. Sans
  // cela, retirer le texte d'un <span><b>◆</b> texte</span> laisserait un
  // losange orphelin flottant dans la barre de méta.
  const DECORATIVE_ONLY = /<(span|li)\b[^>]*>((?:(?!<\/?\1\b)[\s\S])*)<\/\1\s*>/gi;
  out = out.replace(DECORATIVE_ONLY, (match, _tag, inner) => {
    const textOnly = inner.replace(/<[^>]*>/g, "").replace(/[◆•·|—–\s]/g, "").trim();
    if (textOnly === "") {
      removals.push({ kind: "conteneur devenu décoratif", snippet: match });
      return "";
    }
    return match;
  });

  out = out.replace(/[ \t]{2,}/g, " ");

  return { html: out, removals };
}

/**
 * Formulations d'expertise à retirer : aucun ostéopathe n'a relu ces
 * contenus. Le script les SIGNALE avec leur contexte plutôt que de les
 * réécrire — supprimer un membre de phrase au hasard casse la grammaire,
 * c'est une décision de rédaction, pas de script.
 */
const EXPERTISE_CLAIMS = [
  /validés?\s+par\s+(?:des|les)\s+ostéopathes?/gi,
  /validés?\s+par\s+(?:un|notre|nos)\s+(?:expert|kiné|médecin|professionnel)[^.,;]*/gi,
  /approuvés?\s+par\s+(?:des|les)\s+(?:ostéopathes?|kinés?|médecins?)/gi,
  /recommandés?\s+par\s+(?:des|les)\s+(?:ostéopathes?|kinés?|médecins?)/gi,
  // Référence introuvable : à retirer faute de publication accessible.
  /\bSFDO\b[^.,;)]*/g,
  // Chiffre invérifiable.
  /\b38\s*%[^.]{0,60}cervicalgies?[^.]{0,40}/gi,
  /cervicalgies?\s+chroniques?[^.]{0,40}38\s*%/gi,
];

/**
 * Sources candidates. Chacune est vérifiée par requête HEAD avant d'être
 * proposée : rien n'est inséré sur la foi d'une URL mémorisée.
 */
const SOURCE_CANDIDATES = [
  {
    label: "OEKO-TEX® STANDARD 100 — référentiel officiel",
    url: "https://www.oeko-tex.com/en/our-standards/oeko-tex-standard-100/",
  },
  {
    label: "GOTS — Global Organic Textile Standard",
    url: "https://global-standards.org/our-standards/gots",
    // Vigilance : la recherche renvoie aussi global-standard.org (sans « s »).
    // Le contrôle ci-dessous affiche l'URL finale après redirection ; si
    // celle-ci ne répond pas, utiliser celle qui répond.
    note: "vérifier l'orthographe du domaine dans la sortie",
  },
  {
    label:
      "Effect of Different Pillow Heights on Cervicothoracic Spine Segments (PMC4623167) — 16 adultes jeunes asymptomatiques, décubitus dorsal",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4623167/",
  },
  {
    label:
      "Pillow preferences, spinal degeneration — essai pilote (PubMed 31489809) — pas d'amélioration globale significative",
    url: "https://pubmed.ncbi.nlm.nih.gov/31489809/",
  },
  {
    label: "Radwan et al. — revue systématique, European Journal of Integrative Medicine",
    url: "https://doi.org/10.1016/j.eujim.2020.101269",
  },
  {
    label: "INSERM — dossier Sommeil",
    url: "https://www.inserm.fr/dossier/sommeil/",
  },
  {
    label: "DOWNPASS — bien-être animal et traçabilité du duvet",
    url: "https://www.downpass.com/en/animal-welfare-quality/",
  },
];

/**
 * Nuances à conserver à l'écrit si ces études sont citées.
 *
 * Le lectorat d'un guide d'achat n'est pas un lectorat scientifique : une
 * étude sur 16 volontaires jeunes et asymptomatiques ne fonde pas une
 * recommandation médicale, et un essai négatif ne doit pas être présenté
 * comme une validation.
 */
const SOURCE_CAVEATS = [
  "PMC4623167 : 16 adultes jeunes asymptomatiques, mesurés en décubitus dorsal uniquement. Ne pas généraliser à toutes les morphologies ni aux dormeurs sur le côté.",
  "PubMed 31489809 : essai pilote n'ayant PAS montré d'amélioration globale significative. À citer comme tel, pas comme une preuve d'efficacité.",
  "Aucune de ces publications ne fonde une recommandation médicale. Rester sur un registre de conseil d'achat.",
];

// ─────────────────────────────────────────────────────────────
// Utilitaires d'affichage
// ─────────────────────────────────────────────────────────────

const line = (c = "─") => console.log(c.repeat(72));
const show = (label, value) =>
  console.log(`  ${label.padEnd(20)} ${value === undefined || value === null ? "(vide)" : value}`);

function diff(label, before, after) {
  const changed = before !== after;
  console.log(`\n  ${changed ? "✏️ " : "✓ "} ${label}`);
  console.log(`     AVANT : ${before ?? "(vide)"}`);
  console.log(`     APRÈS : ${after}`);
  return changed;
}

/** Contexte autour d'une correspondance, pour juger sur pièces. */
function context(text, index, length, pad = 90) {
  const start = Math.max(0, index - pad);
  const end = Math.min(text.length, index + length + pad);
  return `${start > 0 ? "…" : ""}${text.slice(start, end).replace(/\s+/g, " ")}${end < text.length ? "…" : ""}`;
}

/**
 * Vérifie qu'une URL répond réellement.
 *
 * Une requête HEAD seule ne suffit pas : beaucoup de sites institutionnels
 * et d'éditeurs scientifiques la refusent (405) ou filtrent les clients sans
 * navigateur (403). On retente donc en GET, en suivant les redirections, et
 * on affiche l'URL finale — un 301 vers la bonne page est un succès, mais il
 * faut citer la destination, pas l'ancienne adresse.
 */
async function checkUrl(url) {
  const headers = {
    // Certains hôtes renvoient 403 à un client sans User-Agent reconnaissable.
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
    accept: "text/html,application/xhtml+xml,*/*",
  };

  const attempt = async (method) => {
    const res = await fetch(url, { method, redirect: "follow", headers });
    return { ok: res.ok, status: res.status, final: res.url, method };
  };

  try {
    const head = await attempt("HEAD");
    if (head.ok) return head;
    // 403 / 405 / 404 sur HEAD : beaucoup de serveurs ne l'implémentent pas
    // correctement. Le GET fait foi.
    const get = await attempt("GET");
    return { ...get, headStatus: head.status };
  } catch {
    try {
      return await attempt("GET");
    } catch (err) {
      return { ok: false, status: 0, error: err.message };
    }
  }
}

// ─────────────────────────────────────────────────────────────
// Programme
// ─────────────────────────────────────────────────────────────

console.log(`\n🔎 Dry-run SEO — /magazine/${SLUG}`);
console.log(`   Projet ${projectId} · dataset ${dataset} · mode ${PUBLISH ? "PUBLISH" : "DRY (lecture seule)"}\n`);

const doc = await client.fetch(
  `*[_type == "guide" && slug.current == $slug][0]{
     _id, _rev, title, metaTitle, metaDescription, excerpt, publishedAt, updatedAt,
     "authorName": author->name, "authorPlaceholder": author->isPlaceholder,
     "reviewerName": reviewer->name,
     coverImage,
     "coverDims": coverImage.asset->metadata.dimensions,
     "coverUrl": coverImage.asset->url,
     sources,
     "htmlBlocks": body[_type == "htmlBlock"]{_key, html}
   }`,
  { slug: SLUG },
);

if (!doc) {
  console.error(`❌ Aucun document guide avec le slug « ${SLUG} ».`);
  process.exit(1);
}

// ─── 1. Valeurs actuelles ────────────────────────────────────
line("═");
console.log("1. VALEURS ACTUELLES");
line("═");
show("_id", doc._id);
show("title", doc.title);
show("metaTitle", doc.metaTitle);
show("metaDescription", doc.metaDescription);
show("publishedAt", doc.publishedAt);
show("updatedAt", doc.updatedAt);
show("auteur", `${doc.authorName ?? "(aucun)"}${doc.authorPlaceholder ? " [placeholder]" : ""}`);
show("relecteur", doc.reviewerName ?? "(aucun)");
show("image", doc.coverDims ? `${doc.coverDims.width} × ${doc.coverDims.height}` : "(aucune)");
show("sources", Array.isArray(doc.sources) ? `${doc.sources.length} entrée(s)` : "(aucune)");
show("blocs HTML", `${doc.htmlBlocks?.length ?? 0}`);

// ─── 2. Champs simples ───────────────────────────────────────
line("═");
console.log("2. CHAMPS PROPOSÉS");
line("═");

const patch = {};
if (diff("metaTitle", doc.metaTitle, TARGET.metaTitle)) patch.metaTitle = TARGET.metaTitle;
if (diff("metaDescription", doc.metaDescription, TARGET.metaDescription))
  patch.metaDescription = TARGET.metaDescription;
if (diff("updatedAt (dateModified)", doc.updatedAt, TARGET.updatedAt))
  patch.updatedAt = TARGET.updatedAt;

// L'excerpt est affiché sous le titre ET sert de description de repli dans
// le BlogPosting. La mention « Sources SFDO. » y renvoie à une référence
// introuvable : on retire la phrase entière, pas le sigle seul, sinon il
// resterait « Sources. » qui ne veut rien dire.
if (typeof doc.excerpt === "string") {
  const cleanedExcerpt = doc.excerpt
    .replace(/\s*Sources?\s*:?\s*SFDO\s*\.?\s*$/i, "")
    .replace(/\s*\(\s*Sources?\s*:?\s*SFDO\s*\)\s*/gi, " ")
    .trim();
  if (diff("excerpt", doc.excerpt, cleanedExcerpt)) patch.excerpt = cleanedExcerpt;
}

console.log(`\n  ✓  publishedAt conservé : ${doc.publishedAt}`);

// ─── 3. Transformations du contenu HTML ──────────────────────
line("═");
console.log("3. CONTENU HTML — transformations automatiques");
line("═");

const htmlPatch = {};
let autoChanges = 0;

for (const block of doc.htmlBlocks || []) {
  const original = block.html || "";
  let updated = original;
  const notes = [];

  // Date vague : SUPPRIMÉE (option A). La date de mise à jour n'a qu'une
  // seule source de vérité — le champ `updatedAt`, rendu par la page et
  // repris en `dateModified` dans le BlogPosting.
  const dateResult = removeVagueDate(updated);
  if (dateResult.removals.length) {
    for (const r of dateResult.removals) {
      // Contexte AVANT/APRÈS : retirer une mention au fil du texte peut
      // laisser un séparateur orphelin (« Guide · · 12 min »). Il faut le
      // voir avant d'écrire, pas après.
      const at = updated.indexOf(r.snippet);
      if (at >= 0) {
        notes.push(`mention de date supprimée (${r.kind})`);
        notes.push(`   AVANT : ${context(updated, at, r.snippet.length, 70)}`);
      }
    }
    updated = dateResult.html;
    const after = updated.search(/mise\s+à\s+jour/i);
    notes.push(
      `   APRÈS : ${after >= 0 ? context(updated, after, 20, 70) : "(plus aucune mention « mise à jour » dans le bloc)"}`,
    );
  }

  // Liens hérités
  for (const [from, to] of Object.entries(LEGACY_LINKS)) {
    const re = new RegExp(`(["'])${from.replace(/\//g, "\\/")}(\\/?)(["'#?])`, "g");
    const hits = [...updated.matchAll(re)];
    if (hits.length) {
      updated = updated.replace(re, `$1${to}$3`);
      notes.push(`${hits.length} lien(s) ${from} → ${to}`);
    }
  }

  if (updated !== original) {
    htmlPatch[`body[_key=="${block._key}"].html`] = updated;
    autoChanges++;
    console.log(`\n  ✏️  bloc ${block._key}`);
    for (const n of notes) console.log(`     · ${n}`);
  }
}

if (autoChanges === 0) console.log("\n  ✓  Aucune transformation automatique nécessaire.");

// ─── 4. À arbitrer à la main ─────────────────────────────────
line("═");
console.log("4. À ARBITRER — le script ne touche PAS à ces passages");
line("═");

let manual = 0;

// Le scan porte sur TOUS les champs texte, pas seulement le HTML : la
// première version ne regardait que les blocs et ratait « validés par les
// ostéopathes » présent dans la metaDescription.
const SCANNED_FIELDS = [
  ["title", doc.title],
  ["metaTitle", doc.metaTitle],
  ["metaDescription", doc.metaDescription],
  ["excerpt", doc.excerpt],
  ...(doc.htmlBlocks || []).map((b) => [`body[${b._key}].html`, b.html]),
];

for (const [field, text] of SCANNED_FIELDS) {
  if (typeof text !== "string") continue;
  for (const re of EXPERTISE_CLAIMS) {
    for (const m of text.matchAll(re)) {
      manual++;
      const replaced = field === "metaTitle" || field === "metaDescription";
      console.log(`\n  ⚠️  ${field} — « ${m[0].trim()} »`);
      console.log(`     ${context(text, m.index, m[0].length)}`);
      if (replaced) console.log(`     ↳ champ intégralement remplacé plus haut : disparaît de fait.`);
    }
  }
}
console.log(
  manual === 0
    ? "\n  ✓  Aucune revendication d'expertise détectée."
    : `\n  ${manual} passage(s) à réécrire : retirer un membre de phrase casse la grammaire,\n     c'est une décision de rédaction. Colle-moi ces extraits.`,
);

// ─── 5. Vérification des sources ─────────────────────────────
line("═");
console.log("5. SOURCES — vérification réseau depuis cette machine");
line("═");

for (const src of SOURCE_CANDIDATES) {
  const r = await checkUrl(src.url);
  const icon = r.ok ? "✅" : "❌";
  console.log(`\n  ${icon} ${r.status || "erreur"}  ${src.url}`);
  console.log(`     ${src.label}`);
  if (r.method === "GET" && r.headStatus) console.log(`     (HEAD ${r.headStatus} → retenté en GET)`);
  if (r.final && r.final !== src.url) console.log(`     → URL FINALE : ${r.final}`);
  if (src.note) console.log(`     ⚠️  ${src.note}`);
  if (r.error) console.log(`     ${r.error}`);
}

console.log("\n  ⚠️  Nuances à respecter à l'écrit si ces études sont citées :");
for (const c of SOURCE_CAVEATS) console.log(`     · ${c}`);

console.log("\n  Sources actuellement enregistrées :");
if (!doc.sources?.length) {
  console.log("     (aucune) — le tableau `sources` est vide.");
  console.log("     Il ne s'agit donc pas de rendre des références cliquables,");
  console.log("     mais d'en créer. À ne faire que pour les affirmations que");
  console.log("     l'article avance réellement.");
} else {
  for (const s of doc.sources) {
    console.log(`     · ${s.title ?? "(sans titre)"} — ${s.url || "AUCUNE URL (non cliquable)"}`);
  }
}

// ─── 6. Image ────────────────────────────────────────────────
line("═");
console.log("6. IMAGE PRINCIPALE");
line("═");
if (doc.coverDims) {
  const { width, height } = doc.coverDims;
  const ratio = (width / height).toFixed(2);
  console.log(`  Source Sanity : ${width} × ${height} (ratio ${ratio})`);
  console.log(`  Rendu demandé : 1400 × 800 (ratio 1.75) dans app/magazine/[slug]/page.tsx`);
  console.log(
    width >= 1920 && height >= 1280
      ? "  ✅ Assez grande pour un recadrage paysage 1920 × 1280."
      : `  ⚠️  Trop petite pour 1920 × 1280 — un agrandissement dégraderait le rendu.`,
  );
  console.log(`  URL source : ${doc.coverUrl}`);
} else {
  console.log("  (aucune image de couverture)");
}

// ─── 7. Application ──────────────────────────────────────────
line("═");
const total = Object.keys(patch).length + Object.keys(htmlPatch).length;
console.log(`RÉCAPITULATIF : ${total} champ(s) modifiable(s) automatiquement, ${manual} à arbitrer.`);
line("═");

if (DUMP) {
  const { writeFileSync } = await import("node:fs");
  for (const block of doc.htmlBlocks || []) {
    writeFileSync(`dump-${block._key}-avant.html`, block.html || "", "utf8");
    const patched = htmlPatch[`body[_key=="${block._key}"].html`];
    if (patched) writeFileSync(`dump-${block._key}-apres.html`, patched, "utf8");
  }
  console.log(`\n📄 Contenu écrit dans dump-*-avant.html / dump-*-apres.html`);
  console.log(`   Ces fichiers ne partent nulle part : à relire, puis à supprimer.\n`);
}

if (!PUBLISH) {
  console.log("\n💡 Mode DRY — rien n'a été écrit.\n   Relance avec --publish après validation.\n");
  process.exit(0);
}

if (total === 0) {
  console.log("\n✓ Rien à écrire.\n");
  process.exit(0);
}

// Patch PARTIEL uniquement : jamais createOrReplace, qui écraserait le
// document entier avec les seuls champs récupérés par la requête.
await client
  .patch(doc._id)
  .set({ ...patch, ...htmlPatch })
  .commit();
console.log(`\n✅ ${total} champ(s) mis à jour sur ${doc._id} (patch partiel).\n`);
