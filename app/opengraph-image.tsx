import { ImageResponse } from "next/og";

export const alt = "K Asset Ventures — auction property income opportunities";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#f4f0e7", color: "#143c2e", fontFamily: "Arial, sans-serif" }}>
      <div style={{ width: "64%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "62px 68px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 3 }}>K ASSET VENTURES</div>
          <div style={{ marginTop: 10, fontSize: 14, fontWeight: 600, letterSpacing: 3, color: "#8b7040", textTransform: "uppercase" }}>by PICM Sdn Bhd</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 72, height: 2, background: "#a68649", marginBottom: 28 }} />
          <div style={{ fontSize: 58, lineHeight: 1.04, fontWeight: 600, letterSpacing: -2.5 }}>Build income through selected auction property opportunities.</div>
        </div>
      </div>
      <div style={{ width: "36%", display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "#143c2e", color: "white", padding: "62px 54px" }}>
        <div style={{ fontSize: 64, lineHeight: 1, fontWeight: 700, color: "#d8c18a" }}>1.5%</div>
        <div style={{ marginTop: 12, fontSize: 19, lineHeight: 1.35 }}>Monthly holding return</div>
        <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,.25)", marginTop: 34, marginBottom: 30 }} />
        <div style={{ fontSize: 50, lineHeight: 1, fontWeight: 700, color: "#d8c18a" }}>24</div>
        <div style={{ marginTop: 12, fontSize: 19, lineHeight: 1.35 }}>Maximum holding months</div>
      </div>
    </div>,
    size,
  );
}
