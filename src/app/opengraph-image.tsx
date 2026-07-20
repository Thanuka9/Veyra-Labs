import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Veyra Labs — Software & AI Engineering Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(145deg, #05060c 0%, #0f1220 45%, #12102a 100%)",
          color: "#e8eaf2",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #7c5cff, #5b6dff, #22d3ee)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: 999,
            background: "rgba(124, 92, 255, 0.22)",
            filter: "blur(8px)",
            top: -80,
            right: -40,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 360,
            height: 360,
            borderRadius: 999,
            background: "rgba(34, 211, 238, 0.12)",
            filter: "blur(8px)",
            bottom: -100,
            left: 80,
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #7c5cff, #22d3ee)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 800,
              color: "white",
            }}
          >
            V
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -0.5 }}>Veyra Labs</div>
            <div style={{ fontSize: 18, color: "#98a0b8" }}>Software & AI Engineering Studio</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 900 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 750,
              lineHeight: 1.1,
              letterSpacing: -1.2,
            }}
          >
            Build intelligent products that ship.
          </div>
          <div style={{ fontSize: 24, color: "#b6bdd0", lineHeight: 1.35 }}>
            SaaS · AI systems · E-commerce · Premium websites
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "#98a0b8",
          }}
        >
          <div>veyralabs.com</div>
          <div
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              background: "rgba(124, 92, 255, 0.2)",
              border: "1px solid rgba(124, 92, 255, 0.45)",
              color: "#c4b5fd",
              fontSize: 16,
              fontWeight: 600,
            }}
          >
            Get a quote
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
