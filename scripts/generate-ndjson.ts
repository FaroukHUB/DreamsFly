/**
 * Génère un fichier NDJSON (1 doc Sanity par ligne) à partir du CSV Trust.
 * À uploader via Sanity Manage → Datasets → production → Import.
 * Pas d'images dans ce premier import — elles s'ajoutent ensuite via Studio.
 */

import { parse } from "csv-parse/sync";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function slugify(s: string): string {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function extractCity(title: string): string {
  const cities = ["BERLIN", "MILAN", "MONACO", "LAS VEGAS", "NEW YORK", "LONDRES",
    "BARCELONE", "DUBAI", "SINGAPOUR", "SYDNEY", "ST GERMAIN"];
  for (const city of cities) if (title.toUpperCase().includes(city)) return city;
  return title.split(" ").pop() || title;
}

function inferType(typeAme: string, mdf: string): string {
  const t = (typeAme + " " + mdf).toLowerCase();
  if (t.includes("mémoire") || mdf === "Oui") return "memoire-ressorts";
  if (t.includes("ressort")) return "mousse-ressorts";
  if (t.includes("polyurethane") || t.includes("polyuréthane")) return "mousse-polyurethane";
  if (t.includes("hr")) return "mousse-hr-ressorts";
  return "mousse-polyurethane";
}

function inferFirmness(s: string): string {
  const v = s.toLowerCase();
  if (v.includes("très ferme") || v.includes("tres ferme")) return "tres-ferme";
  if (v.includes("mi-ferme")) return "mi-ferme";
  if (v.includes("ferme")) return "ferme";
  if (v.includes("moelleux")) return "moelleux";
  if (v.includes("équilibré") || v.includes("equilibre")) return "equilibre";
  return "equilibre";
}

const csvPath = join(process.cwd(), "data", "matelas-trust-industrie.csv");
const raw = readFileSync(csvPath, "utf8");
const rows: Record<string, string>[] = parse(raw, { columns: true, skip_empty_lines: true });

const products = new Map<string, any>();
for (const row of rows) {
  const handle = row["Handle"];
  if (!handle) continue;
  if (!products.has(handle)) products.set(handle, { meta: row, variants: [] });
  const p = products.get(handle);
  if (row["Option1 Value"]?.trim()) {
    p.variants.push({
      _key: slugify(row["Option1 Value"]) || `v${p.variants.length}`,
      size: row["Option1 Value"].trim(),
      sku: row["Variant SKU"]?.trim() || "",
      price: parseFloat(row["Variant Price"] || "0"),
      compareAtPrice: parseFloat(row["Variant Compare At Price"] || "0") || undefined,
      weightKg: parseFloat(row["Variant Grams"] || "0") / 1000 || undefined,
      stockStatus: "en-stock",
    });
  }
}

const docs: any[] = [];
for (const [handle, p] of products) {
  const m = p.meta;
  const name = extractCity(m["Title"]);
  const compositions: any[] = [];
  const c1 = m["Composition 1 Descriptions (product.metafields.caracteristiques.composition_1_descriptions)"];
  if (c1) compositions.push({ _key: "c1", _type: "object", label: c1 });
  for (let i = 2; i <= 8; i++) {
    const k = `Composition ${i} (product.metafields.caracteristiques.composition_${i})`;
    if (m[k]) compositions.push({ _key: `c${i}`, _type: "object", label: m[k] });
  }

  docs.push({
    _type: "product",
    _id: `product-${handle}`,
    name,
    title: m["Title"],
    slug: { _type: "slug", current: slugify(handle) },
    sku: handle,
    tagline: m["Type De Matelas (product.metafields.caracteristiques.type_de_matelas)"] || undefined,
    type: inferType(
      m["Type D Ame (product.metafields.caracteristiques.type_d_ame)"] || "",
      m["Memoire De Forme (product.metafields.caracteristiques.memoire_de_forme)"] || ""
    ),
    firmness: inferFirmness(m["Soutien (product.metafields.confort.soutien)"] || ""),
    welcome: m["Accueil Niveau De Confort (product.metafields.confort.accueil_niveau_de_confort)"] || undefined,
    thicknessCm: parseInt(m["Epaisseur Matelas Cm Matelas (product.metafields.dimensions.epaisseur_matelas_cm_matelas)"] || "0") || undefined,
    features: {
      memoireDeForme: (m["Memoire De Forme (product.metafields.caracteristiques.memoire_de_forme)"] || "").toLowerCase() === "oui",
      antiAcariens: false,
      hypoallergenique: (m["Hypo Allerginique (product.metafields.caracteristiques.hypo_allerginique)"] || "").toLowerCase() === "oui",
      oekoTex: (m["Certification (product.metafields.caracteristiques.certification)"] || "").includes("OEKO"),
      fabriqueEurope: (m["Fabrication (product.metafields.caracteristiques.fabrication)"] || "").toLowerCase().includes("europe"),
      garantieAns: parseInt(m["Garantie (product.metafields.caracteristiques.garantie)"] || "5") || 5,
      independanceCouchage: m["Independance De Couchage (product.metafields.dimensions.independance_de_couchage)"] || undefined,
    },
    composition: compositions,
    variants: p.variants,
    seo: {
      metaTitle: m["SEO Title"] || m["Meta Title (product.metafields.caracteristiques.meta_title)"] || undefined,
      metaDescription: m["SEO Description"] || m["Meta Description (product.metafields.caracteristiques.meta_description)"] || undefined,
    },
  });
}

const ndjson = docs.map((d) => JSON.stringify(d)).join("\n");
const outPath = join(process.cwd(), "data", "matelas-import.ndjson");
writeFileSync(outPath, ndjson, "utf8");

console.log(`✓ Généré : ${outPath}`);
console.log(`  ${docs.length} matelas dans le fichier`);
console.log(`  ${docs.reduce((s, d) => s + d.variants.length, 0)} variantes (tailles)`);
