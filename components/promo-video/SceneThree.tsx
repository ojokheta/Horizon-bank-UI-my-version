"use client";

import { memo } from "react";
import DashboardMockup from "./DashboardMockup";
import {
  easeAppleKeynote,
  easeOutCubic,
  fadeInOut,
  lerp,
  remap,
  smootherstep,
} from "./easing";
import { localProgress, WIDTH, HEIGHT } from "./useVideoEngine";

const SCENE_START = 300;
const SCENE_END = 540;

interface SceneThreeProps {
  frame: number;
}

const SceneThree = memo(function SceneThree({ frame }: SceneThreeProps) {
  const lp = localProgress(frame, SCENE_START, SCENE_END);

  const sceneIn = smootherstep(0, 0.06, lp);
  const sceneOut = 1 - smootherstep(0.93, 1, lp);
  const sceneAlpha = Math.min(sceneIn, sceneOut);

  const bgOrbitAngle = lp * Math.PI * 0.8;

  const gridOp = fadeInOut(frame, SCENE_START + 8, 20, SCENE_END - 22, 18);

  const cameraPushIn = smootherstep(0.04, 0.35, lp);
  const zoom = lerp(0.72, 1.08, easeAppleKeynote(cameraPushIn));

  return (
    <div
      aria-label="Scene 3 - UI Showcase & Feature Highlights"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity: sceneAlpha,
        pointerEvents: "none",
        willChange: "opacity",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 52%, #0F172A 0%, #0A0A0C 50%, #000000 90%)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "55%",
          width: "68%",
          height: "62%",
          transform: `translate(-50%, -50%) rotate(${bgOrbitAngle}rad)`,
          background: `radial-gradient(ellipse at center, rgba(76,29,149,0.16) 0%, transparent 65%)`,
          filter: "blur(28px)",
          mixBlendMode: "screen",
          willChange: "transform",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          width: "55%",
          height: "48%",
          transform: `translate(-50%, -50%) rotate(${-bgOrbitAngle * 0.7}rad)`,
          background: `radial-gradient(ellipse at center, rgba(16,185,129,0.14) 0%, transparent 60%)`,
          filter: "blur(36px)",
          mixBlendMode: "screen",
          willChange: "transform",
        }}
      />

      <DeepGrid opacity={gridOp} lp={lp} />

      <FloatingParticles frame={frame} sceneStart={SCENE_START} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoom})`,
          transformOrigin: "50% 50%",
          willChange: "transform",
        }}
      >
        <DashboardMockup frame={frame} sceneStartFrame={SCENE_START} />
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 46%, rgba(0,0,0,0.78) 100%)`,
          pointerEvents: "none",
        }}
      />

      <SceneBadges frame={frame} sceneStart={SCENE_START} />
    </div>
  );
});

export default SceneThree;

const DeepGrid = memo(function DeepGrid({
  opacity,
  lp,
}: {
  opacity: number;
  lp: number;
}) {
  const perspectiveShift = remap(lp, 0.1, 0.9, -30, 30, easeOutCubic);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        perspective: "2400px",
        opacity,
        willChange: "opacity",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "100%",
          width: "400%",
          height: "300%",
          transformOrigin: "50% 0%",
          transform: `translateX(-50%) rotateX(68deg) translateZ(${perspectiveShift}px) translateY(-30px)`,
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.28) 1px, transparent 1px)",
          backgroundSize: "110px 110px, 110px 110px",
          maskImage:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.55) 70%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.55) 70%, transparent)",
          willChange: "transform",
        }}
      />
    </div>
  );
});

const FloatingParticles = memo(function FloatingParticles({
  frame,
  sceneStart,
}: {
  frame: number;
  sceneStart: number;
}) {
  const lifeT = (frame - sceneStart) / 240;
  const COUNT = 60;
  const nodes = [];
  for (let i = 0; i < COUNT; i++) {
    const s = i / COUNT;
    const driftX = (Math.sin(s * 97.13 + frame * 0.008) * 0.5 + 0.5) * WIDTH;
    const driftY = (Math.cos(s * 53.7 + frame * 0.005 + 1.4) * 0.5 + 0.5) * HEIGHT;
    const localLife = ((lifeT + s * 1.3) % 1.1) / 1.1;
    const op =
      Math.sin(localLife * Math.PI) *
      (0.25 + ((i * 13) % 35) / 100) *
      fadeInOut(frame, sceneStart + 10, 30, sceneStart + 220, 20);
    const r = 0.8 + ((i * 7) % 20) / 12;
    const col =
      i % 4 === 0
        ? "#10B981"
        : i % 4 === 1
        ? "#EBF6C4"
        : i % 4 === 2
        ? "#93C5FD"
        : "#FFFFFF";
    nodes.push(
      <circle
        key={i}
        cx={driftX}
        cy={driftY}
        r={r}
        fill={col}
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
      {nodes}
    </svg>
  );
});

const SceneBadges = memo(function SceneBadges({
  frame,
  sceneStart,
}: {
  frame: number;
  sceneStart: number;
}) {
  const BADGES = [
    {
      label: "Open Banking API",
      accent: "#93C5FD",
      start: 0.08,
      x: 70,
      y: 110,
    },
    {
      label: "CBN Licensed",
      accent: "#FCA5A5",
      start: 0.12,
      x: WIDTH - 290,
      y: 130,
    },
    {
      label: "₦ Instant NIP Transfers",
      accent: "#10B981",
      start: 0.16,
      x: 90,
      y: HEIGHT - 120,
    },
  ];

  return (
    <>
      {BADGES.map((b) => {
        const t = smootherstep(b.start, b.start + 0.07, (frame - sceneStart) / 240);
        const y = lerp(16, 0, b.start + t);
        const op = t;
        const glowOp = t * 0.8;
        return (
          <div
            key={b.label}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              borderRadius: 999,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              border: `1px solid ${b.accent}44`,
              backdropFilter: "blur(14px)",
              opacity: op,
              transform: `translate3d(0, ${y}px, 0)`,
              boxShadow: `0 14px 30px -10px ${b.accent}44, 0 0 0 1px rgba(255,255,255,0.03) inset`,
              willChange: "transform, opacity",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: 999,
                background: b.accent,
                boxShadow: `0 0 10px ${b.accent}, 0 0 22px ${b.accent}88`,
                opacity: glowOp,
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: b.accent,
                letterSpacing: 0.3,
              }}
            >
              {b.label}
            </span>
          </div>
        );
      })}
    </>
  );
});
