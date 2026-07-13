#!/usr/bin/env python3
"""
Génère un NDJSON Sanity à partir de l'export Shopify 'products_export.csv'
pour les LITS uniquement (Type in Lit coffre / Lit une place).

Chaque produit importé aura productType: 'lit' + toutes ses variantes,
images (URLs Shopify réutilisables), et méta SEO.

Output : data/lits-import.ndjson
"""
import csv
import json
import re
import os
import unicodedata
from collections import defaultdict

CSV_PATH = "/tmp/lits-extract/products_export.csv"
OUT_PATH = "data/lits-import.ndjson"
os.makedirs("data", exist_ok=True)

def slugify(s):
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode()
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")[:96]

def extract_name(title):
    """Ex: 'Lit coffre 2 places 140x190 MARQUISE en velours' → 'MARQUISE'"""
    # Regex avec accents FR : ÀÁÂÃÄÅÇÈÉÊËÎÏÔÖÙÚÛÜŸ
    tokens = re.findall(r"\b[A-ZÀ-Ÿ]{3,}\b", title or "")
    # Retire les mots communs
    ignore = {"LIT", "COFFRE", "PLACES", "PLACE", "EN", "DE", "LE", "LA",
              "AVEC", "SUR", "AU", "AUX", "DU", "DES", "TISSU", "VELOURS",
              "BEIGE", "BLANC", "CASSE", "CASSÉ", "ECRU", "ÉCRU", "CM"}
    tokens = [t for t in tokens if t not in ignore]
    return tokens[0] if tokens else (title.split()[-1] if title else "SANS-NOM")

# Lecture CSV
products = defaultdict(lambda: {"meta": None, "variants": [], "images": []})
LIT_TYPES = {"Lit coffre", "Lit une place"}

with open(CSV_PATH, "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        h = row.get("Handle", "").strip()
        t = row.get("Type", "").strip()

        # Étape 1 : identifier les handles qui sont bien des lits
        if not h:
            continue

        p = products[h]
        if p["meta"] is None and t in LIT_TYPES:
            p["meta"] = row
        elif p["meta"] is None:
            # Peut-être une ligne variante (Type vide) — on garde temp
            p["meta"] = row  # sera filtré après

        # Variantes
        if row.get("Option1 Value", "").strip():
            price_str = (row.get("Variant Price", "") or "0").replace(",", ".")
            compare_str = (row.get("Variant Compare At Price", "") or "0").replace(",", ".")
            try:
                price = float(price_str) if price_str else 0
            except ValueError:
                price = 0
            try:
                compare_at = float(compare_str) if compare_str else 0
            except ValueError:
                compare_at = 0
            p["variants"].append({
                "size": row["Option1 Value"].strip(),
                "sku": row.get("Variant SKU", "").strip(),
                "price": price,
                "compare_at": compare_at if compare_at > 0 else None,
                "weight_g": row.get("Variant Grams", "").strip(),
            })

        # Images
        img_src = row.get("Image Src", "").strip()
        if img_src:
            p["images"].append({
                "url": img_src,
                "alt": row.get("Image Alt Text", "").strip() or None,
                "position": row.get("Image Position", "").strip(),
            })

# Filter — seuls les handles dont la ligne Type est bien un lit
lit_products = {h: p for h, p in products.items() if p["meta"] and p["meta"].get("Type") in LIT_TYPES}

print(f"Handles totaux : {len(products)}")
print(f"Lits retenus   : {len(lit_products)}\n")

# Générer les docs Sanity
docs = []
for handle, p in lit_products.items():
    m = p["meta"]
    title = m.get("Title", "")
    name = extract_name(title)
    body_html = m.get("Body (HTML)", "").strip()
    tags = m.get("Tags", "").strip()
    seo_title = m.get("SEO Title", "").strip() or f"{title} | DreamsFly"
    seo_desc = m.get("SEO Description", "").strip() or f"Découvrez le lit {name} DreamsFly — fabrication européenne."

    # Prix minimum + prix barré max
    prices = [v["price"] for v in p["variants"] if v["price"] > 0]
    min_price = min(prices) if prices else 0
    max_compare = max((v["compare_at"] for v in p["variants"] if v["compare_at"]), default=None)

    # Description depuis Body HTML → texte brut basique
    description_text = re.sub(r"<[^>]+>", " ", body_html)
    description_text = re.sub(r"\s+", " ", description_text).strip()
    description_blocks = []
    if description_text:
        # Découpe en paragraphes de ~200 caractères
        paragraphs = [description_text[i:i+400] for i in range(0, min(len(description_text), 1600), 400)]
        for i, para in enumerate(paragraphs):
            description_blocks.append({
                "_type": "block",
                "_key": f"desc-{i}",
                "style": "normal",
                "markDefs": [],
                "children": [{"_type": "span", "_key": f"s{i}", "text": para.strip(), "marks": []}]
            })

    doc = {
        "_id": f"product-{handle}",
        "_type": "product",
        "productType": "lit",
        "name": name,
        "title": title,
        "slug": {"_type": "slug", "current": handle},
        "sku": handle,
        "tagline": m.get("Type", "").strip(),
        "description": description_blocks,
        "seo": {
            "metaTitle": seo_title[:70],
            "metaDescription": seo_desc[:170],
        },
        "variants": [
            {
                "_key": f"v{i}",
                "size": v["size"],
                "sku": v["sku"] or handle + "-" + str(i),
                "price": v["price"],
                "compareAtPrice": v["compare_at"],
                "stockStatus": "en-stock",
            }
            for i, v in enumerate(p["variants"])
            if v["price"] > 0
        ],
    }

    docs.append(doc)

with open(OUT_PATH, "w", encoding="utf-8") as f:
    for d in docs:
        f.write(json.dumps(d, ensure_ascii=False) + "\n")

print(f"✓ NDJSON écrit : {OUT_PATH}")
print(f"  {len(docs)} lits")
print(f"\nNoms extraits :")
for d in docs:
    n_var = len(d["variants"])
    prices = [v["price"] for v in d["variants"]]
    p_range = f"{min(prices):.0f} – {max(prices):.0f} €" if prices else "-"
    print(f"  · {d['name']:<15} · {n_var} taille(s) · {p_range}")
