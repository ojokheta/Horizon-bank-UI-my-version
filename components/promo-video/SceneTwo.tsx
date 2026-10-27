"use client";

import { memo } from "react";
import {
  easeAppleKeynote,
  easeOutCubic,
  easeOutQuart,
  fadeInOut,
  lerp,
  remap,
  smootherstep,
  spring,
} from "./easing";
import { localProgress, WIDTH, HEIGHT } from "./useVideoEngine";

const SCENE_START = 150;
const SCENE_END = 300;

const STATEMENTS = [
  {
    text: "Blazing Fast.",
    accent: "#10B981",
    inStart: 156,
    inDur: 38,
    holdEnd: 204,
    outDur: 32,
  },
  {
    text: "Secure by Design.",
    accent: "#EBF6C4",
    inStart: 202,
    inDur: 38,
    holdEnd: 252,
    outDur: 32,
  },
  {
    text: "Built for Nigeria,",
    line2: "Ready for the World.",
    accent: "#FFFFFF",
    inStart: 250,
    inDur: 38,
    holdEnd: 296,
    outDur: 28,
  },
];

interface SceneTwoProps {
  frame: number;
}

const SceneTwo = memo(function SceneTwo({ frame }: SceneTwoProps) {
  const lp = localProgress(frame, SCENE_START, SCENE_END);

  const gridOpacity = fadeInOut(frame, SCENE_START + 6, 22, SCENE_END - 18, 16);
  const bgIndigoShift = remap(lp, 0, 1, 0.08, 0.2, easeOutCubic);

  return (
    <div
      aria-label="Scene 2 - Core Philosophy"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity: frame >= SCENE_START - 2 && frame < SCENE_END + 3 ? 1 : 0,
        pointerEvents: "none",
        willChange: "opacity",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 35% 35%, #111827 0%, #0A0A0C 48%, #000000 88%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "40%",
          top: "55%",
          width: "70%",
          height: "60%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse at center, rgba(76,29,149,${bgIndigoShift}) 0%, transparent 62%)`,
          filter: "blur(30px)",
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "62%",
          top: "38%",
          width: "50%",
          height: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse at center, rgba(16,185,129,${lerp(
            0.08,
            0.16,
            lp
          )}) 0%, transparent 60%)`,
          filter: "blur(34px)",
          mixBlendMode: "screen",
        }}
      />

      <ParallaxLayers frame={frame} />

      <GridLines opacity={gridOpacity} />

      <GeometricDissolve frame={frame} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 48%, rgba(0,0,0,0.76) 100%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px",
        }}
      >
        {STATEMENTS.map((stmt, idx) => (
          <StatementBlock
            key={idx}
            frame={frame}
            index={idx}
            {...stmt}
          />
        ))}
      </div>
    </div>
  );
});

export default SceneTwo;

const GridLines = memo(function GridLines({
  opacity,
}: {
  opacity: number;
}) {
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity,
        willChange: "opacity",
      }}
    >
      <defs>
        <pattern id="s2-grid-h" width="1" height="96" patternUnits="userSpaceOnUse">
          <path
            d="M 0 0 L 1 0"
            stroke="#334155"
            strokeWidth="0.5"
            fill="none"
          />
        </pattern>
        <pattern id="s2-grid-v" width="96" height="1" patternUnits="userSpaceOnUse">
          <path
            d="M 0 0 L 0 1"
            stroke="#334155"
            strokeWidth="0.5"
            fill="none"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#s2-grid-h)" />
      <rect width="100%" height="100%" fill="url(#s2-grid-v)" />
    </svg>
  );
});

const ParallaxLayers = memo(function ParallaxLayers({
  frame,
}: {
  frame: number;
}) {
  const t = localProgress(frame, SCENE_START, SCENE_END);
  const layer1X = remap(t, 0, 1, -80, 80, easeOutQuart);
  const layer2X = remap(t, 0, 1, -140, 140, easeOutQuart);
  const layer3X = remap(t, 0, 1, -220, 220, easeOutQuart);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        perspective: "2200px",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          width: 900,
          height: 520,
          transform: `translate(calc(-50% + ${layer3X}px), -50%) translateZ(-400px) rotateX(12deg)`,
          opacity: 0.22,
          willChange: "transform",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid rgba(99,102,241,0.38)",
            borderRadius: 18,
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(16,185,129,0.08))",
            backdropFilter: "blur(1px)",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "48%",
          width: 760,
          height: 420,
          transform: `translate(calc(-50% + ${layer2X}px), -50%) translateZ(-180px) rotateX(8deg)`,
          opacity: 0.34,
          willChange: "transform",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid rgba(235,246,196,0.22)",
            borderRadius: 14,
            background:
              "linear-gradient(220deg, rgba(235,246,196,0.08), rgba(16,185,129,0.05))",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 620,
          height: 320,
          transform: `translate(calc(-50% + ${layer1X}px), -50%) translateZ(-40px)`,
          opacity: 0.48,
          willChange: "transform",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            background:
              "linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
          }}
        />
      </div>
    </div>
  );
});

const GeometricDissolve = memo(function GeometricDissolve({
  frame,
}: {
  frame: number;
}) {
  const fragStart = SCENE_START + 2;
  const fragEnd = SCENE_START + 70;
  const t = remap(frame, fragStart, fragEnd, 0, 1, easeOutCubic);
  if (t <= 0.001) return null;

  const pieces = [];
  const rows = 6;
  const cols = 9;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seed = (r * cols + c) / (rows * cols);
      const stagger = seed * 0.55;
      const local = (t - stagger) / (1 - stagger);
      const pieceT = Math.max(0, Math.min(1, local));
      if (pieceT <= 0.001) continue;

      const baseX = WIDTH / 2 - 200 + (c - cols / 2) * 48;
      const baseY = HEIGHT / 2 - 150 + (r - rows / 2) * 42;
      const angle = seed * Math.PI * 2;
      const vel = 120 + seed * 380;
      const x = baseX + Math.cos(angle) * vel * pieceT;
      const y =
        baseY + Math.sin(angle) * vel * pieceT + pieceT * pieceT * 180;
      const rot = (seed - 0.5) * 720 * pieceT;
      const scale = lerp(1, 0.2, smootherstep(0.4, 1, pieceT));
      const op = 1 - smootherstep(0.3, 1, pieceT);
      const isCard = (r + c) % 2 === 0;
      pieces.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: isCard ? 42 : 26,
            height: isCard ? 28 : 26,
            borderRadius: isCard ? 4 : 2,
            background: isCard
              ? "linear-gradient(135deg, rgba(16,185,129,0.7), rgba(10,10,12,0.9))"
              : "rgba(235,246,196,0.85)",
            opacity: op * 0.85,
            transform: `rotate(${rot}deg) scale(${scale})`,
            transformOrigin: "center center",
            boxShadow: isCard
              ? "0 0 18px rgba(16,185,129,0.35)"
              : "0 0 10px rgba(235,246,196,0.3)",
            willChange: "transform, opacity",
          }}
        />
      );
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      {pieces}
    </div>
  );
});

interface StatementProps {
  frame: number;
  index: number;
  text: string;
  line2?: string;
  accent: string;
  inStart: number;
  inDur: number;
  holdEnd: number;
  outDur: number;
}

const StatementBlock = memo(function StatementBlock({
  frame,
  index,
  text,
  line2,
  accent,
  inStart,
  inDur,
  holdEnd,
  outDur,
}: StatementProps) {
  const alpha = fadeInOut(frame, inStart, inDur, holdEnd, outDur, easeAppleKeynote);
  if (alpha <= 0.001) return null;

  const slideProgress = remap(frame, inStart, inStart + inDur, 0, 1, easeAppleKeynote);
  const slideOutProgress = remap(
    frame,
    holdEnd,
    holdEnd + outDur,
    0,
    1,
    easeAppleKeynote
  );

  const baseX = index % 2 === 0 ? -1 : 1;
  const translateX =
    lerp(baseX * 180, 0, slideProgress) + slideOutProgress * baseX * 120;
  const mainScale = lerp(0.92, 1, slideProgress) + slideOutProgress * 0.04;
  const blur = lerp(18, 0, slideProgress) + slideOutProgress * 10;

  const renderChars = (str: string, size: number, weight: number, yOffset: number) => {
    const chars = str.split("");
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0 1px",
          marginTop: yOffset,
          willChange: "transform, opacity",
        }}
      >
        {chars.map((ch, i) => {
          const charDelay = i * 1.2;
          const charFrame = frame - inStart - charDelay;
          const charT = Math.max(
            0,
            Math.min(1, charFrame / Math.max(10, inDur - charDelay))
          );
          const eased = spring(130, 13)(charT);
          const charY = lerp(48, 0, eased);
          const charScale = lerp(0.6, 1, eased);
          const charOp = smootherstep(0, 0.6, charT);
          const isAccentChar = index === 1 && (i === 0 || i === 4);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontSize: size,
                fontWeight: weight,
                letterSpacing: -1.2,
                color: isAccentChar ? accent : "#FFFFFF",
                opacity: charOp,
                transform: `translate3d(0, ${charY}px, 0) scale(${charScale})`,
                whiteSpace: ch === " " ? "pre" : "normal",
                willChange: "transform, opacity",
                textShadow: `0 4px 40px ${
                  isAccentChar ? "rgba(16,185,129,0.28)" : "rgba(0,0,0,0.5)"
                }`,
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "50%",
        transform: `translate(0, -50%) translate3d(${translateX}px, 0, 0) scale(${mainScale})`,
        opacity: alpha,
        filter: `blur(${blur}px)`,
        textAlign: "center",
        padding: "0 80px",
        willChange: "transform, opacity, filter",
      }}
    >
      {renderChars(text, line2 ? 108 : 132, 700, 0)}
      {line2 && renderChars(line2, 108, 700, 14)}

      <div
        style={{
          marginTop: 48,
          height: 2,
          marginLeft: "auto",
          marginRight: "auto",
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          width: `${lerp(0, 360, smootherstep(0.1, 0.5, slideProgress)) *
            (1 - slideOutProgress)}px`,
          boxShadow: `0 0 18px ${accent}55`,
          willChange: "width",
        }}
      />
    </div>
  );
});
