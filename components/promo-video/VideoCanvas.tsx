"use client";

import { memo } from "react";
import { WIDTH, HEIGHT } from "./useVideoEngine";

interface VideoCanvasProps {
  children: React.ReactNode;
  scale?: number;
  showFrameCounter?: boolean;
  frame?: number;
}

const VideoCanvas = memo(function VideoCanvas({
  children,
  scale = 1,
  showFrameCounter = false,
  frame = 0,
}: VideoCanvasProps) {
  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        position: "relative",
        overflow: "hidden",
        background: "#000000",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        willChange: "transform",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif',
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        color: "#FFFFFF",
        userSelect: "none",
      }}
    >
      {children}
      {showFrameCounter && (
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 20,
            fontFamily: "monospace",
            fontSize: 13,
            color: "rgba(255,255,255,0.6)",
            zIndex: 9999,
          }}
        >
          Frame {frame} / 749 · {(frame / 60).toFixed(2)}s
        </div>
      )}
    </div>
  );
});

export default VideoCanvas;
