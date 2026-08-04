import { ImageResponse } from "next/og";

export const alt = "K Asset Ventures — selected auction property opportunities";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#11362a", color: "white", padding: 72, position: "relative", overflow: "hidden", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", width: 520, height: 520, borderRadius: 999, background: "rgba(216,197,143,.13)", right: -100, top: -140 }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 64, height: 64, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 18, background: "#dec98f", color: "#17362c", fontSize: 20, fontWeight: 900 }}>KV</div>
          <div style={{ marginLeft: 20, display: "flex", flexDirection: "column" }}><div style={{ fontSize: 32, fontWeight: 800, letterSpacing: 1 }}>K ASSET VENTURES</div><div style={{ marginTop: 6, fontSize: 16, letterSpacing: 3, color: "#d8c58f", textTransform: "uppercase" }}>By PICM Sdn Bhd</div></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 960 }}><div style={{ fontSize: 62, lineHeight: 1.05, fontWeight: 700, letterSpacing: -3 }}>Selected auction properties. Managed from acquisition to exit.</div><div style={{ marginTop: 24, fontSize: 22, color: "#cbd5d0" }}>A private, structured property participation experience.</div></div>
      </div>
    </div>,
    size,
  );
}
