"use client";

import { PromoVideo } from "@/components/promo-video";

export default function PromoPage() {
  return (
    <main
      style={{
        width: "100vw",
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        color: "#fff",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
      }}
    >
      <PromoVideo
        autoPlay
        loop
        showFrameCounter
        fitToContainer
      />
    </main>
  );
}
