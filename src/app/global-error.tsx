"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#05060c", color: "#e8eaf2", fontFamily: "system-ui, sans-serif" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", color: "#fca5a5" }}>
            Error
          </p>
          <h1 style={{ marginTop: 12, fontSize: 28, fontWeight: 700 }}>Something went wrong</h1>
          <p style={{ marginTop: 12, maxWidth: 420, fontSize: 14, color: "#98a0b8", lineHeight: 1.5 }}>
            A critical error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 28,
              border: 0,
              borderRadius: 12,
              padding: "10px 20px",
              background: "linear-gradient(90deg, #7c5cff, #22d3ee)",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
