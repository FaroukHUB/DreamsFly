import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { ProductGalleryPane } from "./sanity/components/product-gallery-pane";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-01-01";

export default defineConfig({
  name: "dreamsfly",
  title: "DreamsFly Studio",
  projectId,
  dataset,
  apiVersion,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure: (S) => {
        const galleryPane = (opts: { productType?: string; includeLegacy?: boolean; title: string }) =>
          S.component(ProductGalleryPane as any)
            .id(`gallery-${opts.productType || "all"}${opts.includeLegacy ? "-legacy" : ""}`)
            .title(opts.title)
            .options(opts);

        return S.list()
          .title("Contenu")
          .items([
            S.listItem()
              .title("📄 Page d'accueil")
              .child(S.editor().schemaType("homepage").documentId("homepage")),
            S.listItem()
              .title("⚙️ Paramètres du site")
              .child(S.editor().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem()
              .title("🧭 Page Quiz")
              .child(S.editor().schemaType("quizPage").documentId("quizPage")),
            S.listItem()
              .title("🏬 Page Magasins")
              .child(S.editor().schemaType("showroomsPage").documentId("showroomsPage")),

            S.divider(),

            // ─── Catalogue segmenté par catégorie — vraie grille galerie ───
            S.listItem()
              .title("🛍️ Catalogue")
              .child(
                S.list()
                  .title("Catalogue")
                  .items([
                    S.listItem()
                      .title("⭐ Mis en avant sur la home")
                      .child(
                        S.documentList()
                          .title("Produits mis en avant sur la home")
                          .filter('_type == "product" && featured == true')
                          .defaultLayout("detail")
                          .defaultOrdering([{ field: "productType", direction: "asc" }, { field: "name", direction: "asc" }])
                      ),
                    S.divider(),
                    S.listItem()
                      .title("🛏️ Matelas")
                      .child(galleryPane({ productType: "matelas", includeLegacy: true, title: "Galerie Matelas" })),
                    S.listItem()
                      .title("🛋️ Lits")
                      .child(galleryPane({ productType: "lit", title: "Galerie Lits" })),
                    S.listItem()
                      .title("🪑 Sommiers")
                      .child(galleryPane({ productType: "sommier", title: "Galerie Sommiers" })),
                    S.listItem()
                      .title("🌙 Oreillers")
                      .child(galleryPane({ productType: "oreiller", title: "Galerie Oreillers" })),
                    S.listItem()
                      .title("🧣 Linge de lit")
                      .child(galleryPane({ productType: "linge", title: "Galerie Linge de lit" })),
                    S.listItem()
                      .title("📦 Packs")
                      .child(galleryPane({ productType: "pack", title: "Galerie Packs" })),
                    S.divider(),
                    S.listItem()
                      .title("🖼️ Tous les produits (galerie)")
                      .child(galleryPane({ title: "Galerie complète" })),
                    S.listItem()
                      .title("📋 Tous les produits (liste)")
                      .child(
                        S.documentList()
                          .title("Tous les produits")
                          .filter('_type == "product"')
                          .defaultLayout("detail")
                          .defaultOrdering([{ field: "productType", direction: "asc" }, { field: "name", direction: "asc" }])
                      ),
                  ])
              ),

            S.documentTypeListItem("landingPage").title("📐 Pages SEO (silos)"),

            S.divider(),

            S.documentTypeListItem("guide").title("📰 Magazine"),
            S.documentTypeListItem("comparison").title("⚖️ Comparatifs"),
            S.documentTypeListItem("glossary").title("📚 Glossaire"),

            S.divider(),

            S.documentTypeListItem("showroom").title("🏬 Showrooms"),
            S.documentTypeListItem("author").title("👤 Auteurs & experts"),
            S.documentTypeListItem("review").title("⭐ Avis clients"),

            S.divider(),

            S.documentTypeListItem("staticPage").title("📄 Pages statiques (aide, légal…)"),

            S.divider(),

            S.documentTypeListItem("order").title("💳 Commandes"),
          ]);
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: {
    types: schemaTypes,
    templates: (prev) => [
      ...prev,
      {
        id: "product-matelas",
        title: "🛏️ Nouveau matelas",
        schemaType: "product",
        value: { productType: "matelas" },
      },
      {
        id: "product-lit",
        title: "🛋️ Nouveau lit",
        schemaType: "product",
        value: { productType: "lit" },
      },
      {
        id: "product-sommier",
        title: "🪑 Nouveau sommier",
        schemaType: "product",
        value: { productType: "sommier" },
      },
      {
        id: "product-oreiller",
        title: "🌙 Nouveau oreiller",
        schemaType: "product",
        value: { productType: "oreiller" },
      },
      {
        id: "product-linge",
        title: "🧣 Nouveau linge de lit",
        schemaType: "product",
        value: { productType: "linge" },
      },
      {
        id: "product-pack",
        title: "📦 Nouveau pack",
        schemaType: "product",
        value: { productType: "pack" },
      },
    ],
  },
});
