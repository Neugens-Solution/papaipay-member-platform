import { ImageResponse } from "next/og";

export const alt = "PAPAIPAY Kasset Ventures Member Portal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#0d2b21", color: "white", padding: 72, position: "relative", overflow: "hidden", fontFamily: "Arial, sans-serif" }}>
      <div style={{ position: "absolute", width: 520, height: 520, borderRadius: 999, background: "rgba(52,211,153,.16)", right: -100, top: -140 }} />
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column" }}><div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1 }}>PAPAIPAY</div><div style={{ marginTop: 8, fontSize: 18, letterSpacing: 4, color: "#a7f3d0", textTransform: "uppercase" }}>Kasset Ventures Member Portal</div></div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 880 }}><div style={{ fontSize: 66, lineHeight: 1.05, fontWeight: 700, letterSpacing: -3 }}>A clearer property participation journey.</div><div style={{ marginTop: 24, fontSize: 24, color: "#cbd5e1" }}>Opportunities · Verification · Payment Proof · Portfolio · Distributions</div></div>
      </div>
    </div>,
    size,
  );
}
