import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

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
      structure: (S) =>
        S.list()
          .title("Contenu")
          .items([
            S.listItem()
              .title("📄 Page d'accueil")
              .child(S.editor().schemaType("homepage").documentId("homepage")),
            S.listItem()
              .title("⚙️ Paramètres du site")
              .child(S.editor().schemaType("siteSettings").documentId("siteSettings")),

            S.divider(),

            // ─── Catalogue segmenté par catégorie ───
            S.listItem()
              .title("🛍️ Catalogue")
              .child(
                S.list()
                  .title("Catalogue")
                  .items([
                    S.listItem()
                      .title("🛏️ Matelas")
                      .child(
                        S.documentList()
                          .title("Matelas")
                          .filter('_type == "product" && (productType == "matelas" || !defined(productType))')
                          .defaultLayout("detail")
                          .defaultOrdering([{ field: "name", direction: "asc" }])
                      ),
                    S.listItem()
                      .title("🛋️ Lits")
                      .child(
                        S.documentList()
                          .title("Lits")
                          .filter('_type == "product" && productType == "lit"')
                          .defaultLayout("detail")
                          .defaultOrdering([{ field: "name", direction: "asc" }])
                      ),
                    S.listItem()
                      .title("🪑 Sommiers")
                      .child(
                        S.documentList()
                          .title("Sommiers")
                          .filter('_type == "product" && productType == "sommier"')
                          .defaultLayout("detail")
                          .defaultOrdering([{ field: "name", direction: "asc" }])
                      ),
                    S.listItem()
                      .title("🌙 Oreillers")
                      .child(
                        S.documentList()
                          .title("Oreillers")
                          .filter('_type == "product" && productType == "oreiller"')
                          .defaultLayout("detail")
                          .defaultOrdering([{ field: "name", direction: "asc" }])
                      ),
                    S.listItem()
                      .title("🧣 Linge de lit")
                      .child(
                        S.documentList()
                          .title("Linge de lit")
                          .filter('_type == "product" && productType == "linge"')
                          .defaultLayout("detail")
                          .defaultOrdering([{ field: "name", direction: "asc" }])
                      ),
                    S.listItem()
                      .title("📦 Packs")
                      .child(
                        S.documentList()
                          .title("Packs")
                          .filter('_type == "product" && productType == "pack"')
                          .defaultLayout("detail")
                          .defaultOrdering([{ field: "name", direction: "asc" }])
                      ),
                    S.divider(),
                    S.listItem()
                      .title("📋 Tous les produits")
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
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: { types: schemaTypes },
});
