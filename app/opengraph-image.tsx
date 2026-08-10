import { ImageResponse } from "next/og";

export const alt = "K Asset Ventures — selected Malaysian residential property projects";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#f6f3ed", color: "#0e1726", fontFamily: "Arial, sans-serif" }}>
      <div style={{ width: "64%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "62px 68px" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: 3 }}>K ASSET VENTURES</div>
          <div style={{ marginTop: 10, fontSize: 14, fontWeight: 600, letterSpacing: 3, color: "#a47c48", textTransform: "uppercase" }}>by PICM Sdn Bhd</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 72, height: 2, background: "#a47c48", marginBottom: 28 }} />
          <div style={{ fontSize: 56, lineHeight: 1.04, fontWeight: 600, letterSpacing: -2.5 }}>Turning selected property opportunities into managed projects.</div>
        </div>
      </div>
      <div style={{ width: "36%", display: "flex", flexDirection: "column", justifyContent: "flex-end", background: "#0e1726", color: "white", padding: "62px 54px" }}>
        <div style={{ fontSize: 22, lineHeight: 1.3, fontWeight: 700, color: "#c6a574", textTransform: "uppercase", letterSpacing: 2 }}>Property focused</div>
        <div style={{ marginTop: 14, fontSize: 20, lineHeight: 1.45 }}>Selected Malaysian residential property projects</div>
        <div style={{ width: "100%", height: 1, background: "rgba(255,255,255,.25)", marginTop: 34, marginBottom: 30 }} />
        <div style={{ fontSize: 22, lineHeight: 1.3, fontWeight: 700, color: "#c6a574", textTransform: "uppercase", letterSpacing: 2 }}>Member access</div>
        <div style={{ marginTop: 14, fontSize: 20, lineHeight: 1.45 }}>Specific opportunity details available to approved members</div>
      </div>
    </div>,
    size,
  );
}
