"use client";

import { lerp } from "./easing";

const extractNumbers = (d: string): number[] => {
  const matches = d.match(/-?\d*\.?\d+/g);
  return matches ? matches.map(Number) : [];
};

const templatePath = (d: string, nums: number[]): string => {
  let i = 0;
  return d.replace(/-?\d*\.?\d+/g, () => {
    const v = nums[i++] ?? 0;
    return Number.isInteger(v) ? String(v) : v.toFixed(3);
  });
};

export const morphPath = (
  pathA: string,
  pathB: string,
  t: number
): string => {
  const a = extractNumbers(pathA);
  const b = extractNumbers(pathB);
  const len = Math.max(a.length, b.length);
  const out: number[] = new Array(len);
  for (let i = 0; i < len; i++) {
    out[i] = lerp(a[i] ?? 0, b[i] ?? 0, t);
  }
  return templatePath(pathA, out);
};

const BLOB_1 =
  "M 500 300 C 520 200 660 170 740 200 C 820 230 870 340 860 430 C 850 520 770 600 680 620 C 590 640 480 630 420 570 C 360 510 360 410 380 350 C 400 300 480 290 500 300 Z";

const BLOB_2 =
  "M 510 310 C 560 220 640 180 720 210 C 830 240 880 330 850 420 C 820 530 760 600 670 610 C 560 620 460 600 410 540 C 350 470 370 400 390 340 C 430 300 470 290 510 310 Z";

const BLOB_3 =
  "M 490 305 C 540 210 660 190 740 215 C 840 245 875 345 845 440 C 810 545 735 610 655 615 C 555 620 460 595 405 535 C 345 470 365 395 395 340 C 430 305 455 295 490 305 Z";

const CARD_SHAPE =
  "M 400 300 C 400 275 420 260 445 260 L 815 260 C 840 260 860 275 860 300 L 860 560 C 860 585 840 600 815 600 L 445 600 C 420 600 400 585 400 560 L 400 300 Z";

const KEYFRAMES = [BLOB_1, BLOB_2, BLOB_3, BLOB_1, CARD_SHAPE];

interface MorphingBlobProps {
  progress: number;
  size?: number;
  viewBoxSize?: number;
  fillGradientId?: string;
  glowColor?: string;
  glowOpacity?: number;
  strokeWidth?: number;
  strokeColor?: string;
}

export function MorphingBlob({
  progress,
  fillGradientId = "blob-gradient",
  glowColor = "#10B981",
  glowOpacity = 0.55,
  strokeWidth = 1.5,
  strokeColor = "rgba(255,255,255,0.85)",
}: MorphingBlobProps) {
  const t = Math.max(0, Math.min(1, progress));
  const totalSegs = KEYFRAMES.length - 1;
  const scaled = t * totalSegs;
  const seg = Math.min(Math.floor(scaled), totalSegs - 1);
  const segT = scaled - seg;
  const smoothSegT =
    segT < 0.5 ? 4 * segT * segT * segT : 1 - Math.pow(-2 * segT + 2, 3) / 2;
  const path = morphPath(KEYFRAMES[seg], KEYFRAMES[seg + 1], smoothSegT);

  const pulse = 1 + Math.sin(progress * Math.PI * 6) * 0.02;

  return (
    <g
      style={{
        transformOrigin: "630px 430px",
        transform: `scale(${pulse})`,
        willChange: "transform",
      }}
    >
      <defs>
        <radialGradient id={fillGradientId} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#059669" stopOpacity="0.75" />
          <stop offset="80%" stopColor="#111827" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.08" />
        </radialGradient>
        <filter id={`${fillGradientId}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="22" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`${fillGradientId}-stroke`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="50%" stopColor="rgba(235,246,196,0.75)" />
          <stop offset="100%" stopColor="rgba(16,185,129,0.9)" />
        </linearGradient>
      </defs>

      <path
        d={path}
        fill={glowColor}
        opacity={glowOpacity * 0.35}
        filter={`url(#${fillGradientId}-glow)`}
        style={{ transform: "translate(0px, 4px)", willChange: "opacity" }}
      />
      <path
        d={path}
        fill={`url(#${fillGradientId})`}
        stroke={`url(#${fillGradientId}-stroke)`}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        style={{ willChange: "d" }}
      />
    </g>
  );
}
