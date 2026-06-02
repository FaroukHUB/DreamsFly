/**
 * Script d'import du catalogue Trust Industrie (20 matelas) dans Sanity.
 *
 * Usage :
 *   1. Renseigne dans .env les variables NEXT_PUBLIC_SANITY_PROJECT_ID et SANITY_API_WRITE_TOKEN
 *   2. Lance : npm run import:trust
 *
 * Le script :
 *   - Lit data/matelas-trust-industrie.csv
 *   - Pour chaque produit : crée un document `product` dans Sanity
 *   - Télécharge et uploade les images dans les assets Sanity
 *   - Lie chaque variante (taille) avec son prix
 *
 * Les descriptions Trust sont conservées comme base mais doivent être
 * RÉÉCRITES manuellement dans Sanity Studio pour DreamsFly (stratégie A — pas
 * de duplicate content visible).
 */

import { config } from "dotenv";
import { createClient } from "@sanity/client";
import { parse } from "csv-parse/sync";
import { readFileSync } from "node:fs";
import { join } from "node:path";

config({ path: ".env.local" });
config({ path: ".env" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

// ────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function extractCity(title: string): string {
  // Titres type "Matelas ferme 2 places MILAN en mousse polyuréthane"
  const cities = [
    "BERLIN", "MILAN", "MONACO", "LAS VEGAS", "NEW YORK", "LONDRES",
    "BARCELONE", "DUBAI", "SINGAPOUR", "SYDNEY", "ST GERMAIN",
  ];
  for (const city of cities) {
    if (title.toUpperCase().includes(city)) return city;
  }
  return title.split(" ").pop() || title;
}

function inferType(typeAme: string, memoireDeForme: string): string {
  const t = (typeAme + " " + memoireDeForme).toLowerCase();
  if (t.includes("mémoire") || memoireDeForme === "Oui") return "memoire-ressorts";
  if (t.includes("ressort")) return "mousse-ressorts";
  if (t.includes("polyurethane") || t.includes("polyuréthane")) return "mousse-polyurethane";
  if (t.includes("hr")) return "mousse-hr-ressorts";
  return "mousse-polyurethane";
}

function inferFirmness(soutien: string): string {
  const s = soutien.toLowerCase();
  if (s.includes("très ferme") || s.includes("tres ferme")) return "tres-ferme";
  if (s.includes("mi-ferme")) return "mi-ferme";
  if (s.includes("ferme")) return "ferme";
  if (s.includes("moelleux")) return "moelleux";
  if (s.includes("équilibré") || s.includes("equilibre")) return "equilibre";
  return "equilibre";
}

async function uploadImageFromUrl(url: string, filename: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ⚠️  Image inaccessible : ${url}`);
      return null;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload("image", buffer, { filename });
    return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
  } catch (err) {
    console.warn(`  ⚠️  Erreur upload image : ${err}`);
    return null;
  }
}

// ────────────────────────────────────────────────────────────
// Import principal
// ────────────────────────────────────────────────────────────

async function main() {
  const csvPath = join(process.cwd(), "data", "matelas-trust-industrie.csv");
  const raw = readFileSync(csvPath, "utf8");
  const rows: Record<string, string>[] = parse(raw, { columns: true, skip_empty_lines: true });

  // Regroupement par handle
  const products = new Map<string, any>();
  for (const row of rows) {
    const handle = row["Handle"];
    if (!handle) continue;
    if (!products.has(handle)) {
      products.set(handle, { meta: row, variants: [], images: [] });
    }
    const p = products.get(handle);

    if (row["Option1 Value"]?.trim()) {
      p.variants.push({
        size: row["Option1 Value"].trim(),
        sku: row["Variant SKU"]?.trim() || "",
        price: parseFloat(row["Variant Price"] || "0"),
        compareAtPrice: parseFloat(row["Variant Compare At Price"] || "0") || undefined,
        weightKg: parseFloat(row["Variant Grams"] || "0") / 1000 || undefined,
        stockStatus: "en-stock",
      });
    }

    if (row["Image Src"]?.trim()) {
      const exists = p.images.find((img: any) => img.url === row["Image Src"]);
      if (!exists) {
        p.images.push({ url: row["Image Src"].trim(), alt: row["Image Alt Text"] || "" });
      }
    }
  }

  console.log(`\n📦 ${products.size} produits à importer\n`);

  for (const [handle, p] of products) {
    const m = p.meta;
    const name = extractCity(m["Title"]);
    const compositions = [];
    if (m["Composition 1 Descriptions (product.metafields.caracteristiques.composition_1_descriptions)"]) compositions.push({ label: m["Composition 1 Descriptions (product.metafields.caracteristiques.composition_1_descriptions)"] });
    for (let i = 2; i <= 8; i++) {
      const k = `Composition ${i} (product.metafields.caracteristiques.composition_${i})`;
      if (m[k]) compositions.push({ label: m[k] });
    }

    console.log(`→ ${name} (${m["Title"]})`);

    // Upload images (max 5 par produit pour démarrer)
    const sanityImages: any[] = [];
    for (const img of p.images.slice(0, 5)) {
      const filename = `${handle}-${sanityImages.length + 1}.png`;
      const uploaded = await uploadImageFromUrl(img.url, filename);
      if (uploaded) {
        sanityImages.push({ ...uploaded, alt: img.alt || name });
      }
    }
    console.log(`   ${sanityImages.length} images uploadées`);

    const doc = {
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
        antiAcariens: !!m["Anti Acariens (product.metafields.caracteristiques.anti_acariens)"],
        hypoallergenique: (m["Hypo Allerginique (product.metafields.caracteristiques.hypo_allerginique)"] || "").toLowerCase() === "oui",
        oekoTex: (m["Certification (product.metafields.caracteristiques.certification)"] || "").includes("OEKO"),
        fabriqueEurope: (m["Fabrication (product.metafields.caracteristiques.fabrication)"] || "").toLowerCase().includes("europe"),
        garantieAns: parseInt(m["Garantie (product.metafields.caracteristiques.garantie)"] || "5") || 5,
        independanceCouchage: m["Independance De Couchage (product.metafields.dimensions.independance_de_couchage)"] || undefined,
      },
      composition: compositions,
      variants: p.variants,
      images: sanityImages,
      seo: {
        metaTitle: m["SEO Title"] || m["Meta Title (product.metafields.caracteristiques.meta_title)"] || undefined,
        metaDescription: m["SEO Description"] || m["Meta Description (product.metafields.caracteristiques.meta_description)"] || undefined,
      },
    };

    await client.createOrReplace(doc);
    console.log(`   ✓ importé\n`);
  }

  console.log(`\n✅ Import terminé : ${products.size} produits dans Sanity.`);
  console.log(`\n💡 Prochaines étapes :`);
  console.log(`   1. Va sur ton Studio (dreamsfly.fr/studio ou localhost:3000/studio)`);
  console.log(`   2. Pour chaque matelas, RÉÉCRIS la description en ton DreamsFly`);
  console.log(`   3. Vérifie/édite les SEO title/description`);
  console.log(`   4. Crée tes pages catégorie + ajoute les produits dedans\n`);
}

main().catch((err) => {
  console.error("❌ Erreur d'import :", err);
  process.exit(1);
});
