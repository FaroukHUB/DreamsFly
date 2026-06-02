/**
 * Sanity Studio embarqué dans Next.js, accessible à /studio.
 * Édition en live de tout le contenu du site.
 */
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
