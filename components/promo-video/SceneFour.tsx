"use client";

import { memo } from "react";
import DashboardMockup from "./DashboardMockup";
import {
  easeAppleKeynote,
  easeInExpo,
  easeOutCubic,
  easeOutQuart,
  fadeIn,
  fadeInOut,
  fadeOut,
  lerp,
  remap,
  smootherstep,
  spring,
} from "./easing";
import { localProgress, WIDTH, HEIGHT, TOTAL_FRAMES } from "./useVideoEngine";

const SCENE_START = 540;
const SCENE_END = TOTAL_FRAMES;

interface SceneFourProps {
  frame: number;
}

const SceneFour = memo(function SceneFour({ frame }: SceneFourProps) {
  const lp = localProgress(frame, SCENE_START, SCENE_END);

  const sceneIn = smootherstep(0, 0.04, lp);
  const dissolveOut = fadeOut(frame, 730, 20, easeInExpo);
  const sceneAlpha = Math.min(sceneIn, dissolveOut);

  return (
    <div
      aria-label="Scene 4 - Climax, Brand Reveal & Outro"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity: sceneAlpha,
        pointerEvents: "none",
        willChange: "opacity",
        background: "#000000",
      }}
    >
      <BackgroundEvolve lp={lp} />

      <DashboardZoomOut frame={frame} sceneStart={SCENE_START} />

      <DepthOfFieldBlur lp={lp} />

      <OrbitalAura frame={frame} sceneStart={SCENE_START} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <BrandMark frame={frame} sceneStart={SCENE_START} />
        <CTAButton frame={frame} sceneStart={SCENE_START} />
      </div>

      <FinalEchoDissolve frame={frame} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.82) 100%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
});

export default SceneFour;

const BackgroundEvolve = memo(function BackgroundEvolve({
  lp,
}: {
  lp: number;
}) {
  const indigoShift = remap(lp, 0, 0.4, 0.14, 0.04, easeOutCubic);
  const emeraldShift = remap(lp, 0.18, 0.55, 0.05, 0.18, easeOutQuart);
  const dimAll = 1 - smootherstep(0.75, 1, lp);

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 48%, #0B1120 0%, #06070A 45%, #000000 88%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "70%",
          height: "65%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse at center, rgba(76,29,149,${indigoShift}) 0%, transparent 65%)`,
          filter: "blur(34px)",
          mixBlendMode: "screen",
          opacity: dimAll,
          willChange: "opacity",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "48%",
          width: "52%",
          height: "48%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse at center, rgba(16,185,129,${emeraldShift}) 0%, transparent 62%)`,
          filter: "blur(40px)",
          mixBlendMode: "screen",
          opacity: dimAll,
          willChange: "opacity",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "40%",
          height: "35%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse at center, rgba(235,246,196,${
            0.12 * smootherstep(0.2, 0.45, lp)
          }) 0%, transparent 70%)`,
          filter: "blur(28px)",
          mixBlendMode: "screen",
          opacity: dimAll,
          willChange: "opacity",
        }}
      />
    </>
  );
});

const DashboardZoomOut = memo(function DashboardZoomOut({
  frame,
  sceneStart,
}: {
  frame: number;
  sceneStart: number;
}) {
  const t = (frame - sceneStart) / 210;

  const zoomOut = smootherstep(0, 0.3, t);
  const scale = lerp(1.08, 0.06, easeInExpo(zoomOut));
  const translateY = lerp(0, 160, smootherstep(0.08, 0.32, t));
  const rotateX = lerp(0, 32, smootherstep(0.05, 0.3, t));
  const rotateY = lerp(0, -22, smootherstep(0.05, 0.3, t));
  const op = 1 - smootherstep(0.16, 0.32, t);
  const blurAmt = smootherstep(0.12, 0.32, t) * 22;

  if (op <= 0.001) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity: op,
        transform: `translate3d(0, ${translateY}px, 0)`,
        filter: `blur(${blurAmt}px)`,
        willChange: "transform, opacity, filter",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${scale}) perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformOrigin: "50% 50%",
          willChange: "transform",
        }}
      >
        <DashboardMockup frame={frame} sceneStartFrame={300} />
      </div>
    </div>
  );
});

const DepthOfFieldBlur = memo(function DepthOfFieldBlur({
  lp,
}: {
  lp: number;
}) {
  const blurIn = smootherstep(0.1, 0.25, lp);
  const blurOut = 1 - smootherstep(0.5, 0.7, lp);
  const amount = Math.min(blurIn, blurOut) * 14;
  if (amount <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backdropFilter: `blur(${amount}px)`,
        WebkitBackdropFilter: `blur(${amount}px)`,
        pointerEvents: "none",
        opacity: 0.55,
        willChange: "backdrop-filter",
      }}
    />
  );
});

const OrbitalAura = memo(function OrbitalAura({
  frame,
  sceneStart,
}: {
  frame: number;
  sceneStart: number;
}) {
  const t = (frame - sceneStart) / 210;
  const ringsIn = smootherstep(0.35, 0.55, t);
  const ringsOut = 1 - smootherstep(0.9, 1, t);
  const op = Math.min(ringsIn, ringsOut);

  const ring1Rot = frame * 0.25;
  const ring2Rot = -frame * 0.17;
  const ring3Rot = frame * 0.1 + 60;

  const scalePulse = 1 + Math.sin((frame - sceneStart) * 0.04) * 0.015;

  if (op <= 0.001) return null;

  return (
    <svg
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 720,
        height: 720,
        transform: `translate(-50%, -50%) scale(${scalePulse})`,
        pointerEvents: "none",
        opacity: op,
        willChange: "transform, opacity",
      }}
      viewBox="0 0 720 720"
    >
      <defs>
        <linearGradient id="ring-emerald-s4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.0" />
          <stop offset="30%" stopColor="#10B981" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#EBF6C4" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
        </linearGradient>
        <linearGradient id="ring-sage-s4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EBF6C4" stopOpacity="0.0" />
          <stop offset="40%" stopColor="#EBF6C4" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#6366F1" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#EBF6C4" stopOpacity="0.0" />
        </linearGradient>
        <linearGradient id="ring-indigo-s4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.0" />
          <stop offset="50%" stopColor="#6366F1" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      <g transform={`translate(360 360) rotate(${ring1Rot})`}>
        <circle
          cx="0"
          cy="0"
          r="310"
          fill="none"
          stroke="url(#ring-emerald-s4)"
          strokeWidth="2"
          style={{ filter: "drop-shadow(0 0 10px rgba(16,185,129,0.7))" }}
        />
      </g>
      <g transform={`translate(360 360) rotate(${ring2Rot})`}>
        <circle
          cx="0"
          cy="0"
          r="260"
          fill="none"
          stroke="url(#ring-sage-s4)"
          strokeWidth="1.5"
          style={{ filter: "drop-shadow(0 0 8px rgba(235,246,196,0.5))" }}
        />
      </g>
      <g transform={`translate(360 360) rotate(${ring3Rot})`}>
        <circle
          cx="0"
          cy="0"
          r="215"
          fill="none"
          stroke="url(#ring-indigo-s4)"
          strokeWidth="1.2"
          strokeDasharray="6 10"
          style={{ filter: "drop-shadow(0 0 6px rgba(99,102,241,0.5))" }}
        />
      </g>
    </svg>
  );
});

const BrandMark = memo(function BrandMark({
  frame,
  sceneStart,
}: {
  frame: number;
  sceneStart: number;
}) {
  const t = (frame - sceneStart) / 210;

  const overallIn = smootherstep(0.28, 0.42, t);
  const overallHold = 1 - smootherstep(0.92, 0.98, t);
  const alpha = Math.min(overallIn, overallHold);

  const emergeT = spring(140, 14)(overallIn);
  const scale = lerp(0.52, 1, emergeT);
  const y = lerp(40, 0, spring(110, 12)(overallIn));

  const letterSpaceStart = smootherstep(0.3, 0.48, t);
  const letterSpace = lerp(16, 2, easeAppleKeynote(letterSpaceStart));

  const shineSweep = smootherstep(0.5, 0.75, t);
  const shineX = lerp(-40, 140, shineSweep);

  const taglineIn = smootherstep(0.55, 0.7, t);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: alpha,
        transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
        transformOrigin: "50% 50%",
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 22,
          marginBottom: 34,
        }}
      >
        <BrandIcon frame={frame} sceneStart={sceneStart} />

        <div
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "4px 8px",
            marginLeft: 4,
          }}
        >
          <div
            style={{
              fontSize: 118,
              fontWeight: 800,
              letterSpacing: letterSpace,
              color: "#FFFFFF",
              fontFamily:
                'Inter, -apple-system, "SF Pro Display", "Segoe UI", sans-serif',
              textRendering: "geometricPrecision",
              backgroundImage:
                "linear-gradient(135deg, #FFFFFF 0%, #EBF6C4 45%, #10B981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 2px 40px rgba(16,185,129,0.2)",
              filter:
                "drop-shadow(0 10px 30px rgba(16,185,129,0.25)) drop-shadow(0 2px 6px rgba(0,0,0,0.6))",
              willChange: "letter-spacing",
            }}
          >
            Horizon
          </div>

          <div
            style={{
              position: "absolute",
              left: `${shineX}%`,
              top: 0,
              width: "38%",
              height: "100%",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
              filter: "blur(6px)",
              mixBlendMode: "screen",
              pointerEvents: "none",
              transform: "skewX(-16deg)",
              opacity: shineSweep > 0 && shineSweep < 1 ? 0.75 : 0,
              willChange: "left, opacity",
            }}
          />
        </div>
      </div>

      <div
        style={{
          width: "80%",
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(16,185,129,0.65), rgba(235,246,196,0.85), rgba(16,185,129,0.65), transparent)",
          boxShadow: "0 0 14px rgba(16,185,129,0.45)",
          opacity: smootherstep(0.5, 0.62, t),
          transform: `scaleX(${smootherstep(0.45, 0.6, t)})`,
          willChange: "transform, opacity",
        }}
      />

      <div
        style={{
          marginTop: 30,
          display: "flex",
          gap: 56,
          opacity: taglineIn,
          transform: `translate3d(0, ${lerp(20, 0, taglineIn)}px, 0)`,
          willChange: "transform, opacity",
        }}
      >
        {[
          { k: "Fintech", v: "Reimagined" },
          { k: "Nigeria", v: "Global Ready" },
          { k: "Secure", v: "by Design" },
        ].map((pair) => (
          <div
            key={pair.k}
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                color: "rgba(16,185,129,0.95)",
                marginBottom: 6,
              }}
            >
              {pair.k}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: "rgba(255,255,255,0.86)",
                letterSpacing: 0.2,
              }}
            >
              {pair.v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

const BrandIcon = memo(function BrandIcon({
  frame,
  sceneStart,
}: {
  frame: number;
  sceneStart: number;
}) {
  const t = (frame - sceneStart) / 210;
  const iconIn = smootherstep(0.3, 0.48, t);

  const scale = spring(150, 13)(iconIn);
  const rot = lerp(-28, 0, easeAppleKeynote(iconIn));
  const op = iconIn;

  const strokeDrawT = smootherstep(0.34, 0.56, t);

  return (
    <svg
      width={108}
      height={108}
      viewBox="0 0 108 108"
      style={{
        opacity: op,
        transform: `rotate(${rot}deg) scale(${scale})`,
        filter:
          "drop-shadow(0 12px 30px rgba(16,185,129,0.55)) drop-shadow(0 4px 10px rgba(0,0,0,0.55))",
        willChange: "transform, opacity",
      }}
    >
      <defs>
        <linearGradient id="brand-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EBF6C4" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#4B672D" />
        </linearGradient>
        <linearGradient id="brand-icon-inner" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0A0A0C" />
          <stop offset="100%" stopColor="#1E2B23" />
        </linearGradient>
      </defs>

      <rect
        x="8"
        y="8"
        rx="26"
        ry="26"
        width="92"
        height="92"
        fill="none"
        stroke="url(#brand-icon-grad)"
        strokeWidth="4"
        strokeDasharray="400"
        strokeDashoffset={400 * (1 - strokeDrawT)}
        strokeLinejoin="round"
      />

      <g
        style={{
          opacity: smootherstep(0.44, 0.58, t),
          willChange: "opacity",
        }}
      >
        <path
          d="M 28 68 L 44 46 L 58 58 L 80 30"
          fill="none"
          stroke="url(#brand-icon-grad)"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="140"
          strokeDashoffset={140 * (1 - smootherstep(0.48, 0.66, t))}
          style={{
            filter: "drop-shadow(0 0 6px rgba(16,185,129,0.9))",
          }}
        />

        <circle
          cx="80"
          cy="30"
          r="6.5"
          fill="#EBF6C4"
          style={{
            filter: "drop-shadow(0 0 8px rgba(235,246,196,0.9))",
            opacity: smootherstep(0.62, 0.74, t),
          }}
        />
      </g>
    </svg>
  );
});

const CTAButton = memo(function CTAButton({
  frame,
  sceneStart,
}: {
  frame: number;
  sceneStart: number;
}) {
  const t = (frame - sceneStart) / 210;
  const btnIn = smootherstep(0.65, 0.8, t);
  const btnOut = 1 - smootherstep(0.96, 1, t);
  const op = Math.min(btnIn, btnOut);
  const s = spring(140, 14)(btnIn);
  const y = lerp(26, 0, spring(110, 13)(btnIn));

  const pulse = Math.sin((frame - sceneStart) * 0.12) * 0.5 + 0.5;
  const pulseScale = 1 + pulse * 0.015;

  if (op <= 0.001) return null;

  return (
    <div
      style={{
        marginTop: 74,
        display: "inline-flex",
        alignItems: "center",
        position: "relative",
        opacity: op,
        transform: `translate3d(0, ${y}px, 0) scale(${s}) scale(${pulseScale})`,
        transformOrigin: "50% 50%",
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: 999,
          padding: 2,
          background: `linear-gradient(${
            (frame * 0.9) % 360
          }deg, rgba(16,185,129,0.9) 0%, rgba(235,246,196,0.95) 50%, rgba(16,185,129,0.9) 100%)`,
          WebkitMask:
            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          boxShadow: `0 0 ${28 + pulse * 18}px rgba(16,185,129,${
            0.35 + pulse * 0.3
          })`,
          willChange: "background, box-shadow",
        }}
      />

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 12,
          padding: "18px 40px",
          borderRadius: 999,
          background:
            "linear-gradient(135deg, rgba(30,43,35,0.92), rgba(10,12,10,0.96))",
          border: "1px solid rgba(235,246,196,0.22)",
          boxShadow:
            "0 20px 50px -14px rgba(16,185,129,0.45), 0 0 0 1px rgba(255,255,255,0.04) inset",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          style={{ opacity: 0.95 }}
        >
          <path
            d="M12 2L13.09 8.26L19 9L14.5 13.74L15.18 20L12 16.77L8.82 20L9.5 13.74L5 9L10.91 8.26L12 2Z"
            fill="#EBF6C4"
            style={{ filter: "drop-shadow(0 0 4px rgba(235,246,196,0.9))" }}
          />
        </svg>

        <span
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: 0.4,
            fontFamily:
              'Inter, -apple-system, "SF Pro Display", sans-serif',
          }}
        >
          ojokay.dev/horizon
        </span>

        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#10B981"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17L17 7" />
          <path d="M7 7H17V17" />
        </svg>
      </div>
    </div>
  );
});

const FinalEchoDissolve = memo(function FinalEchoDissolve({
  frame,
}: {
  frame: number;
}) {
  const echoStart = 720;
  const t = Math.max(0, Math.min(1, (frame - echoStart) / 30));

  const layers = [];
  for (let i = 0; i < 3; i++) {
    const delay = i * 0.12;
    const localT = Math.max(0, Math.min(1, (t - delay) / (1 - delay)));
    layers.push(
      <div
        key={i}
        style={{
          position: "absolute",
          inset: 0,
          background:
            i === 2
              ? "#000000"
              : `radial-gradient(ellipse at center, rgba(0,0,0,${
                  0.25 * localT
                }) 0%, rgba(0,0,0,0) 80%)`,
          opacity: localT,
          pointerEvents: "none",
          willChange: "opacity",
        }}
      />
    );
  }
  return <>{layers}</>;
});
