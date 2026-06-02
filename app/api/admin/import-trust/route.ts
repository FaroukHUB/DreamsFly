/**
 * Route d'import des 20 matelas Trust dans Sanity.
 *
 * À visiter UNE SEULE FOIS depuis ton navigateur avec la clé secrète :
 *   https://dreams-fly.vercel.app/api/admin/import-trust?key=<IMPORT_KEY>
 *
 * Cette route est exécutée côté serveur Vercel — l'IP Vercel est autorisée
 * par Sanity, contrairement aux IPs Google Cloud d'autres environnements.
 *
 * Après le succès de l'import, supprime ce fichier (ou désactive la route)
 * pour des raisons de sécurité.
 */

import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { sanityWriteClient } from "@/lib/sanity/client";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  const expected = process.env.IMPORT_KEY;

  if (!expected) {
    return NextResponse.json(
      { error: "IMPORT_KEY env var manquante côté serveur." },
      { status: 500 }
    );
  }
  if (key !== expected) {
    return NextResponse.json({ error: "Clé invalide." }, { status: 401 });
  }
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "SANITY_API_WRITE_TOKEN env var manquante." },
      { status: 500 }
    );
  }

  let ndjsonContent: string;
  try {
    const filePath = join(process.cwd(), "data", "matelas-import.ndjson");
    ndjsonContent = readFileSync(filePath, "utf8");
  } catch (err: any) {
    return NextResponse.json(
      { error: "Fichier NDJSON introuvable", details: err.message },
      { status: 500 }
    );
  }

  const lines = ndjsonContent.split("\n").filter(Boolean);
  const docs = lines.map((l) => JSON.parse(l));

  const results: any[] = [];
  let imported = 0;
  let errors = 0;

  for (const doc of docs) {
    try {
      await sanityWriteClient.createOrReplace(doc);
      results.push({ name: doc.name, status: "✓ imported" });
      imported++;
    } catch (err: any) {
      results.push({ name: doc.name, status: "✗ failed", error: err.message });
      errors++;
    }
  }

  return NextResponse.json({
    ok: errors === 0,
    summary: {
      total: docs.length,
      imported,
      errors,
    },
    results,
    nextSteps: [
      "1. Va dans Sanity Studio (/studio) pour vérifier les 20 matelas",
      "2. Réécris les descriptions en ton DreamsFly (pas de copier-coller Trust)",
      "3. Uploade des photos via Studio (drag-drop dans le champ Images)",
      "4. ⚠️ SÉCURITÉ : supprime app/api/admin/import-trust/route.ts une fois l'import validé",
    ],
  });
}
