import { ImageResponse } from "next/og";

export const alt = "ShipNaija.dev — Build in public, Naija style";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(22,163,74,0.25), transparent 50%), radial-gradient(circle at 75% 75%, rgba(234,179,8,0.15), transparent 50%)",
          color: "white",
          fontSize: 72,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <span style={{ fontWeight: 700 }}>Ship</span>
          <span style={{ fontWeight: 700, color: "#22c55e" }}>Naija</span>
          <span style={{ fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>.dev</span>
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 32,
            color: "rgba(255,255,255,0.65)",
          }}
        >
          Build in public. Ship faster. Naija style.
        </div>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            gap: 16,
            fontSize: 24,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          <span>Daily build logs</span>
          <span style={{ color: "#22c55e" }}>·</span>
          <span>Project showcase</span>
          <span style={{ color: "#22c55e" }}>·</span>
          <span>Weekly ship challenges</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
