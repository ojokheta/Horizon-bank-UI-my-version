"use client";

import { memo } from "react";
import { MorphingBlob } from "./MorphingBlob";
import {
  easeAppleKeynote,
  easeOutCubic,
  easeSmooth,
  fadeIn,
  fadeInOut,
  lerp,
  remap,
  smootherstep,
  spring,
} from "./easing";
import { localProgress, WIDTH, HEIGHT } from "./useVideoEngine";

const SCENE_START = 0;
const SCENE_END = 150;

const HEADLINE = "Banking, reimagined for the modern era.";
const SPRING_PHYSICS = spring(100, 12);

interface SceneOneProps {
  frame: number;
}

const SceneOne = memo(function SceneOne({ frame }: SceneOneProps) {
  const lp = localProgress(frame, SCENE_START, SCENE_END);

  const morphProg = smootherstep(0, 0.72, lp);

  const zoomScale = remap(lp, 0, 1, 0.55, 1.42, SPRING_PHYSICS);
  const rotateX = remap(lp, 0, 0.45, -18, 0, easeAppleKeynote);
  const rotateY = remap(lp, 0, 0.5, 22, 0, easeAppleKeynote);
  const translateZ = 0;

  const blobOpacity = fadeInOut(frame, 2, 18, 132, 16, easeOutCubic);
  const cardGlow = remap(lp, 0.55, 0.9, 0, 1, easeSmooth);

  const particleBurst = remap(lp, 0.62, 0.82, 0, 1, easeOutCubic);
  const showParticles = particleBurst > 0 && particleBurst < 1.01;

  return (
    <div
      aria-label="Scene 1 - Hook & Organic Shape Morph"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity: frame >= SCENE_START - 2 && frame < SCENE_END + 5 ? 1 : 0,
        pointerEvents: "none",
        willChange: "opacity",
      }}
    >
      <BackgroundGradient lp={lp} />
      <GridFade frame={frame} />
      <VignettePulse lp={lp} />

      <div
        style={{
          position: "absolute",
          left: WIDTH / 2,
          top: HEIGHT / 2 - 40,
          transform: `translate(-50%, -50%) perspective(1600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${zoomScale})`,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <svg
          viewBox="0 0 1260 860"
          width={1260}
          height={860}
          style={{
            display: "block",
            overflow: "visible",
            opacity: blobOpacity,
            filter: `drop-shadow(0 0 ${20 + cardGlow * 40}px rgba(16,185,129,${
              0.3 + cardGlow * 0.4
            }))`,
          }}
        >
          <MorphingBlob progress={morphProg} />
          <CardOverlays progress={lp} cardProgress={morphProg} />
        </svg>
      </div>

      {showParticles && <EtherealParticles t={particleBurst} />}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: HEIGHT - 230,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "0 120px",
          willChange: "transform, opacity",
        }}
      >
        <KineticHeadline text={HEADLINE} frame={frame} startFrame={62} />
      </div>
    </div>
  );
});

export default SceneOne;

const BackgroundGradient = memo(function BackgroundGradient({
  lp,
}: {
  lp: number;
}) {
  const radialStrength = lerp(0.55, 0.9, smootherstep(0, 1, lp));
  const indigoOpacity = lerp(0.5, 0.78, lp);
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 42%, #111827 0%, #0A0A0C 45%, #000000 82%)`,
          opacity: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "40%",
          width: "78%",
          height: "68%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse at center, rgba(76, 29, 149, ${
            0.12 * indigoOpacity
          }) 0%, transparent 60%)`,
          filter: "blur(20px)",
          opacity: radialStrength,
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "52%",
          top: "48%",
          width: "60%",
          height: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse at center, rgba(16,185,129, ${
            0.11 * radialStrength
          }) 0%, transparent 58%)`,
          filter: "blur(24px)",
          mixBlendMode: "screen",
        }}
      />
    </>
  );
});

const GridFade = memo(function GridFade({ frame }: { frame: number }) {
  const op = remap(frame, 70, 140, 0, 0.14, easeSmooth);
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: op,
        willChange: "opacity",
      }}
    >
      <defs>
        <pattern id="scene1grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path
            d="M 80 0 L 0 0 0 80"
            fill="none"
            stroke="#334155"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#scene1grid)" />
    </svg>
  );
});

const VignettePulse = memo(function VignettePulse({ lp }: { lp: number }) {
  const inner = lerp(52, 44, smootherstep(0, 1, lp));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at center, transparent ${inner}%, rgba(0,0,0,0.78) 100%)`,
        willChange: "background",
      }}
    />
  );
});

const CardOverlays = memo(function CardOverlays({
  progress,
  cardProgress,
}: {
  progress: number;
  cardProgress: number;
}) {
  const reveal = smootherstep(0.78, 1, cardProgress);
  if (reveal <= 0.001) return null;

  const chipX = lerp(460, 460, reveal);
  const chipY = lerp(330, 330, reveal);
  const logoX = 720;
  const logoY = 320;
  const numberY = 430;
  const nameY = 505;
  const brandX = 780;
  const brandY = 500;

  return (
    <g opacity={reveal} style={{ willChange: "opacity" }}>
      <defs>
        <linearGradient id="card-chip-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F0C36B" />
          <stop offset="50%" stopColor="#D4A045" />
          <stop offset="100%" stopColor="#8B6914" />
        </linearGradient>
        <linearGradient id="card-text-white" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
          <stop offset="100%" stopColor="rgba(235,246,196,0.92)" />
        </linearGradient>
      </defs>

      <g
        style={{
          transform: `translate(${chipX}px, ${chipY}px)`,
          opacity: smootherstep(0.82, 1, cardProgress),
          willChange: "transform, opacity",
        }}
      >
        <rect
          x="0"
          y="0"
          rx="6"
          ry="6"
          width="56"
          height="42"
          fill="url(#card-chip-gold)"
          opacity="0.92"
        />
        <g stroke="rgba(60,42,10,0.7)" strokeWidth="1" fill="none">
          <line x1="0" y1="14" x2="56" y2="14" />
          <line x1="0" y1="28" x2="56" y2="28" />
          <line x1="18" y1="0" x2="18" y2="42" />
          <line x1="38" y1="0" x2="38" y2="42" />
        </g>
      </g>

      <text
        x={logoX}
        y={logoY}
        textAnchor="end"
        fill="rgba(255,255,255,0.96)"
        fontSize="28"
        fontWeight="700"
        letterSpacing="2"
        style={{
          opacity: smootherstep(0.86, 1, cardProgress),
          fontFamily:
            'Inter, -apple-system, "SF Pro Display", sans-serif',
          willChange: "opacity",
        }}
      >
        HORIZON
      </text>

      <g
        style={{
          transform: `translateY(${numberY}px)`,
          opacity: smootherstep(0.88, 1, cardProgress),
          willChange: "transform, opacity",
        }}
      >
        <text
          x="455"
          y="0"
          fill="url(#card-text-white)"
          fontSize="26"
          fontWeight="500"
          letterSpacing="5"
          style={{
            fontFamily:
              '"SF Mono", ui-monospace, Menlo, Consolas, monospace',
          }}
        >
          5392 ···· ···· 4821
        </text>
      </g>

      <g opacity={smootherstep(0.9, 1, cardProgress)}>
        <text
          x="455"
          y={nameY + 14}
          fill="rgba(255,255,255,0.75)"
          fontSize="12"
          fontWeight="500"
          letterSpacing="1.4"
          style={{
            fontFamily:
              'Inter, -apple-system, "SF Pro Display", sans-serif',
          }}
        >
          CARD HOLDER
        </text>
        <text
          x="455"
          y={nameY + 36}
          fill="rgba(255,255,255,0.96)"
          fontSize="18"
          fontWeight="600"
          letterSpacing="1.6"
          style={{
            fontFamily:
              'Inter, -apple-system, "SF Pro Display", sans-serif',
          }}
        >
          O. JOHNSON
        </text>

        <text
          x={brandX}
          y={brandY + 14}
          textAnchor="end"
          fill="rgba(255,255,255,0.75)"
          fontSize="12"
          fontWeight="500"
          letterSpacing="1.4"
          style={{
            fontFamily:
              'Inter, -apple-system, "SF Pro Display", sans-serif',
          }}
        >
          VALID THRU
        </text>
        <text
          x={brandX}
          y={brandY + 36}
          textAnchor="end"
          fill="rgba(255,255,255,0.96)"
          fontSize="18"
          fontWeight="600"
          letterSpacing="2"
          style={{
            fontFamily:
              'Inter, -apple-system, "SF Pro Display", sans-serif',
          }}
        >
          12 / 31
        </text>
      </g>

      <g
        transform={`translate(780, 500)`}
        opacity={smootherstep(0.92, 1, cardProgress)}
      >
        <circle cx="12" cy="12" r="16" fill="#EB001B" opacity="0.92" />
        <circle cx="28" cy="12" r="16" fill="#F79E1B" opacity="0.92" />
      </g>
    </g>
  );
});

const KineticHeadline = memo(function KineticHeadline({
  text,
  frame,
  startFrame,
}: {
  text: string;
  frame: number;
  startFrame: number;
}) {
  const chars = text.split("");
  const perChar = 2.2;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 1px",
        lineHeight: 1.08,
      }}
    >
      {chars.map((ch, i) => {
        const s = startFrame + i * perChar;
        const charIn = fadeIn(frame, s, 28, easeAppleKeynote);
        const blur = remap(charIn, 0, 1, 28, 0, easeOutCubic);
        const y = remap(charIn, 0, 1, 36, 0, spring(120, 14));
        const scale = remap(charIn, 0, 1, 0.82, 1, easeAppleKeynote);
        const color = charIn > 0.3 ? "#FFFFFF" : "rgba(255,255,255,0.9)";
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontSize: 68,
              fontWeight: 600,
              letterSpacing: -0.8,
              color,
              opacity: charIn,
              transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
              filter: `blur(${blur}px)`,
              whiteSpace: ch === " " ? "pre" : "normal",
              willChange: "transform, opacity, filter",
              textShadow:
                "0 2px 24px rgba(16,185,129,0.18), 0 1px 3px rgba(0,0,0,0.45)",
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </span>
        );
      })}
    </div>
  );
});

const EtherealParticles = memo(function EtherealParticles({
  t,
}: {
  t: number;
}) {
  const COUNT = 48;
  const particles = [];
  for (let i = 0; i < COUNT; i++) {
    const seed = i / COUNT;
    const angle = seed * Math.PI * 2 + (i % 3) * 0.2;
    const speed = 60 + (i * 53) % 180;
    const dist = t * speed;
    const x = WIDTH / 2 + Math.cos(angle) * dist;
    const y = HEIGHT / 2 - 40 + Math.sin(angle) * dist;
    const r = 1.4 + ((i * 17) % 30) / 15;
    const op = (1 - t) * (0.5 + ((i * 7) % 50) / 100);
    const hue = i % 3 === 0 ? "#10B981" : i % 3 === 1 ? "#EBF6C4" : "#FFFFFF";
    particles.push(
      <circle
        key={i}
        cx={x}
        cy={y}
        r={r}
        fill={hue}
        opacity={op}
        style={{ willChange: "opacity" }}
      />
    );
  }
  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      {particles}
    </svg>
  );
});
