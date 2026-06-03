import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

/**
 * Génération dynamique d'images Open Graph 1200×630.
 * Utilisée par défaut sur chaque page (paramètre ?title=...&subtitle=...).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") || "DreamsFly").slice(0, 90);
  const subtitle = (searchParams.get("subtitle") || "Matelas premium conçus en France").slice(0, 140);
  const eyebrow = searchParams.get("eyebrow") || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #172554 0%, #0F1B47 70%, #1E2F6B 100%)",
          color: "#FFFFFF",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Halo aurora */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 700,
            height: 700,
            background: "radial-gradient(circle, rgba(127, 212, 245, 0.35), transparent 60%)",
            borderRadius: "50%",
          }}
        />

        {/* Top: logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 30, fontWeight: 600, letterSpacing: "0.04em" }}>
          <div style={{ display: "flex", width: 44, height: 44, background: "#FFFFFF", borderRadius: 10, alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 28, height: 16, background: "#172554", borderRadius: 4 }} />
          </div>
          <span>DREAMS<span style={{ fontStyle: "italic", color: "#7FD4F5", fontWeight: 400 }}>fly</span></span>
        </div>

        {/* Middle: title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 1000 }}>
          {eyebrow && (
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#BFE4F2",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </div>
          )}
          <div style={{ fontSize: title.length > 50 ? 64 : 80, fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            {title}
          </div>
          <div style={{ fontSize: 28, color: "rgba(255, 255, 255, 0.78)", lineHeight: 1.4, fontWeight: 300 }}>
            {subtitle}
          </div>
        </div>

        {/* Bottom: URL */}
        <div style={{ fontSize: 22, color: "#BFE4F2", letterSpacing: "0.04em" }}>
          dreamsfly.fr
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
