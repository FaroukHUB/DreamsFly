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
            S.documentTypeListItem("product").title("🛏️ Matelas"),
            S.documentTypeListItem("category").title("📦 Catégories"),
            S.divider(),
            S.documentTypeListItem("guide").title("📰 Magazine"),
            S.documentTypeListItem("author").title("👤 Auteurs & experts"),
            S.documentTypeListItem("review").title("⭐ Avis clients"),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: { types: schemaTypes },
});
