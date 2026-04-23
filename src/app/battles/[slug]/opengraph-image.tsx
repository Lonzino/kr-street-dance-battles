import { ImageResponse } from "next/og";
import { getBattleBySlug } from "@/lib/data";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const battle = await getBattleBySlug(slug);
  const title = battle?.title ?? "Battle";
  const date = battle?.date ?? "";
  const venue = battle?.venue.name ?? "";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        background: "linear-gradient(135deg, #0a0a0b 0%, #1a1a1d 100%)",
        color: "#fafafa",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          fontSize: 24,
          color: "#f97316",
          letterSpacing: "0.2em",
          display: "flex",
        }}
      >
        KR STREET DANCE BATTLES
      </div>

      <div
        style={{
          fontSize: 72,
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          display: "flex",
        }}
      >
        {title.length > 40 ? `${title.slice(0, 40)}…` : title}
      </div>

      <div
        style={{
          display: "flex",
          gap: 32,
          fontSize: 26,
          color: "#8a8a92",
        }}
      >
        {date && <span>{date}</span>}
        {venue && <span>· {venue.length > 30 ? `${venue.slice(0, 30)}…` : venue}</span>}
      </div>
    </div>,
    { ...size },
  );
}
