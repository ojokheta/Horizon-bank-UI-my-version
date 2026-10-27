"use client";

import { memo } from "react";
import {
  easeAppleKeynote,
  easeOutCubic,
  lerp,
  remap,
  smootherstep,
  spring,
} from "./easing";

interface DashboardMockupProps {
  frame: number;
  sceneStartFrame: number;
}

const TRANSACTIONS = [
  { name: "Spotify Premium", category: "Entertainment", amount: -3500, color: "#1DB954", icon: "♪" },
  { name: "Grocery Mart", category: "Shopping", amount: -18400, color: "#2E90FA", icon: "🛒" },
  { name: "Salary Deposit", category: "Income", amount: 450000, color: "#10B981", icon: "₦" },
  { name: "Fuel Station", category: "Transport", amount: -22500, color: "#F79E1B", icon: "⛽" },
  { name: "Send to Chidi", category: "Transfer", amount: -80000, color: "#EE46BC", icon: "↗" },
];

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const INCOME_DATA = [280, 320, 295, 410, 380, 450];
const SPEND_DATA = [190, 215, 240, 205, 260, 285];

const DashboardMockup = memo(function DashboardMockup({
  frame,
  sceneStartFrame,
}: DashboardMockupProps) {
  const lp = Math.max(0, Math.min(1, (frame - sceneStartFrame) / 240));

  const containerIn = smootherstep(0, 0.12, lp);
  const containerY = lerp(80, 0, spring(100, 12)(containerIn));
  const containerScale = lerp(0.9, 1, easeAppleKeynote(containerIn));
  const containerOp = smootherstep(0, 0.1, lp);

  const tiltT = smootherstep(0.05, 0.85, lp);
  const rotateX = lerp(12, -3, tiltT) + Math.sin(lp * Math.PI * 2) * 2.5;
  const rotateY = lerp(-14, 6, tiltT) + Math.sin(lp * Math.PI * 2 + 0.8) * 3;

  const specularX = remap(lp, 0.05, 0.9, -40, 140, easeOutCubic);
  const specularOp = lerp(0, 0.35, smootherstep(0.05, 0.3, lp)) *
    (1 - smootherstep(0.75, 0.95, lp));

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 1400,
        height: 820,
        transform: `translate(-50%, -50%) translate3d(0, ${containerY}px, 0) scale(${containerScale}) perspective(1800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
        opacity: containerOp,
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 24,
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.055), rgba(255,255,255,0.015))",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow:
            "0 40px 120px -20px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04) inset",
          overflow: "hidden",
          transform: "translateZ(0)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${specularX}%`,
            top: "-10%",
            width: "45%",
            height: "120%",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
            filter: "blur(28px)",
            pointerEvents: "none",
            opacity: specularOp,
            transform: "skewX(-18deg)",
            willChange: "left, opacity",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            padding: "38px 44px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <DashboardHeader frame={frame} sceneStart={sceneStartFrame} />

          <MetricCards frame={frame} sceneStart={sceneStartFrame} />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 0.8fr",
              gap: 22,
              flex: 1,
              minHeight: 0,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <AnalyticsPanel frame={frame} sceneStart={sceneStartFrame} />
              <TransactionsPanel frame={frame} sceneStart={sceneStartFrame} />
            </div>
            <AllocationPanel frame={frame} sceneStart={sceneStartFrame} />
          </div>
        </div>

        <TransferFlow frame={frame} sceneStart={sceneStartFrame} />
      </div>
    </div>
  );
});

export default DashboardMockup;

const DashboardHeader = memo(function DashboardHeader({
  frame,
  sceneStart,
}: {
  frame: number;
  sceneStart: number;
}) {
  const t = smootherstep(0.02, 0.1, (frame - sceneStart) / 240);
  const y = lerp(-20, 0, spring(110, 13)(t));
  const op = t;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: op,
        transform: `translate3d(0, ${y}px, 0)`,
        willChange: "transform, opacity",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background:
              "linear-gradient(135deg, #10B981 0%, #4B672D 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#EBF6C4",
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: 0.5,
            boxShadow: "0 8px 24px -6px rgba(16,185,129,0.45)",
          }}
        >
          H
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF" }}>
            Welcome back, Ojay
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
            Unified balances and activity · Nigeria
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {["Home", "Cards", "History", "Settings"].map((tab, i) => (
          <div
            key={tab}
            style={{
              padding: "10px 18px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 600,
              color: i === 0 ? "#EBF6C4" : "rgba(255,255,255,0.6)",
              background: i === 0 ? "rgba(16,185,129,0.16)" : "transparent",
              border: i === 0 ? "1px solid rgba(16,185,129,0.32)" : "1px solid transparent",
            }}
          >
            {tab}
          </div>
        ))}
      </div>
    </div>
  );
});

const MetricCards = memo(function MetricCards({
  frame,
  sceneStart,
}: {
  frame: number;
  sceneStart: number;
}) {
  const metrics = [
    {
      label: "Total net balance",
      value: "₦ 1,284,500.00",
      hint: "Across 4 linked accounts",
      accent: "#10B981",
      glow: "rgba(16,185,129,0.22)",
    },
    {
      label: "Monthly income",
      value: "₦ 450,000",
      hint: "June credits",
      accent: "#EBF6C4",
      glow: "rgba(235,246,196,0.18)",
    },
    {
      label: "Monthly spending",
      value: "₦ 285,300",
      hint: "June debits",
      accent: "#FCA5A5",
      glow: "rgba(252,165,165,0.18)",
    },
    {
      label: "Linked banks",
      value: "4",
      hint: "Manage accounts",
      accent: "#93C5FD",
      glow: "rgba(147,197,253,0.18)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 18,
      }}
    >
      {metrics.map((m, i) => {
        const stagger = 0.04 + i * 0.03;
        const t = smootherstep(stagger, stagger + 0.08, (frame - sceneStart) / 240);
        const y = lerp(40, 0, spring(100, 12)(t));
        const scale = lerp(0.94, 1, easeAppleKeynote(t));
        const op = t;
        return (
          <div
            key={m.label}
            style={{
              padding: "22px 22px",
              borderRadius: 18,
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              opacity: op,
              transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
              boxShadow: `0 18px 40px -16px ${m.glow}`,
              willChange: "transform, opacity",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.6,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.52)",
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 28,
                fontWeight: 700,
                color: m.accent,
                letterSpacing: -0.5,
                textShadow: `0 2px 22px ${m.glow}`,
              }}
            >
              {m.value}
            </div>
            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                color: "rgba(255,255,255,0.45)",
              }}
            >
              {m.hint}
            </div>
          </div>
        );
      })}
    </div>
  );
});

const AnalyticsPanel = memo(function AnalyticsPanel({
  frame,
  sceneStart,
}: {
  frame: number;
  sceneStart: number;
}) {
  const t = smootherstep(0.12, 0.22, (frame - sceneStart) / 240);
  const y = lerp(30, 0, spring(90, 12)(t));
  const op = t;

  const chartT = smootherstep(0.18, 0.4, (frame - sceneStart) / 240);

  const maxVal = 500;
  const chartW = 520;
  const chartH = 110;
  const barW = chartW / (MONTH_LABELS.length * 2 + 2);

  const buildLinePath = (data: number[], offset = 0) => {
    const step = chartW / (data.length - 1);
    let d = "";
    data.forEach((v, i) => {
      const drawRatio = Math.max(0, Math.min(1, (chartT * data.length - i) / 1));
      const h = (v / maxVal) * chartH * drawRatio;
      const x = i * step;
      const y = chartH - h + offset;
      if (i === 0) d += `M ${x} ${y}`;
      else {
        const px = (i - 1) * step;
        const cx = (px + x) / 2;
        const prevH = (data[i - 1] / maxVal) * chartH * drawRatio;
        const prevY = chartH - prevH + offset;
        d += ` C ${cx} ${prevY}, ${cx} ${y}, ${x} ${y}`;
      }
    });
    return d;
  };

  return (
    <div
      style={{
        padding: "24px 26px",
        borderRadius: 18,
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        opacity: op,
        transform: `translate3d(0, ${y}px, 0)`,
        willChange: "transform, opacity",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF" }}>
            Unified cash-flow analytics
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
            Income vs spending · All linked institutions
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 22 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#10B981", letterSpacing: 0.5 }}>
              INCOME
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>
              ₦ 450,000
            </span>
          </div>
          <div
            style={{
              height: 10,
              borderRadius: 99,
              background: "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${90 * chartT}%`,
                height: "100%",
                borderRadius: 99,
                background: "linear-gradient(90deg, #10B981, #EBF6C4)",
                boxShadow: "0 0 14px rgba(16,185,129,0.45)",
                willChange: "width",
              }}
            />
          </div>
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#F87171", letterSpacing: 0.5 }}>
              SPENDING
            </span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF" }}>
              ₦ 285,300
            </span>
          </div>
          <div
            style={{
              height: 10,
              borderRadius: 99,
              background: "rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${57 * chartT}%`,
                height: "100%",
                borderRadius: 99,
                background: "linear-gradient(90deg, #F87171, #FB923C)",
                boxShadow: "0 0 14px rgba(248,113,113,0.4)",
                willChange: "width",
              }}
            />
          </div>
        </div>
      </div>

      <svg
        width="100%"
        height={chartH + 40}
        viewBox={`0 0 ${chartW} ${chartH + 40}`}
        style={{ marginTop: 24 }}
      >
        <g transform={`translate(0, 0)`}>
          <path
            d={`${buildLinePath(INCOME_DATA)}`}
            fill="none"
            stroke="#10B981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(16,185,129,0.6))" }}
          />
          <path
            d={`${buildLinePath(SPEND_DATA, 0)}`}
            fill="none"
            stroke="#F87171"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: "drop-shadow(0 0 6px rgba(248,113,113,0.55))" }}
          />
          {INCOME_DATA.map((v, i) => {
            const step = chartW / (INCOME_DATA.length - 1);
            const x = i * step;
            const drawRatio = Math.max(0, Math.min(1, (chartT * INCOME_DATA.length - i) / 1));
            const h = (v / maxVal) * chartH * drawRatio;
            const y = chartH - h;
            return (
              <g key={`in-${i}`}>
                <circle cx={x} cy={y} r={3} fill="#10B981" opacity={drawRatio} />
                <text
                  x={x}
                  y={chartH + 24}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.45)"
                  fontSize="11"
                  fontWeight="600"
                  opacity={drawRatio}
                >
                  {MONTH_LABELS[i]}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
});

const TransactionsPanel = memo(function TransactionsPanel({
  frame,
  sceneStart,
}: {
  frame: number;
  sceneStart: number;
}) {
  const t = smootherstep(0.2, 0.3, (frame - sceneStart) / 240);
  const y = lerp(30, 0, spring(90, 12)(t));
  const op = t;

  return (
    <div
      style={{
        padding: "24px 26px",
        borderRadius: 18,
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        opacity: op,
        transform: `translate3d(0, ${y}px, 0)`,
        willChange: "transform, opacity",
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF" }}>
            Recent transactions
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            Latest activity across all banks
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 18, flex: 1, minHeight: 0 }}>
        {TRANSACTIONS.map((tx, i) => {
          const stagger = 0.26 + i * 0.028;
          const it = smootherstep(stagger, stagger + 0.06, (frame - sceneStart) / 240);
          const iy = lerp(18, 0, spring(100, 13)(it));
          const iop = it;
          const isPositive = tx.amount > 0;
          const fmt = new Intl.NumberFormat("en-NG").format(Math.abs(tx.amount));
          return (
            <div
              key={tx.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "11px 12px",
                borderRadius: 12,
                opacity: iop,
                transform: `translate3d(0, ${iy}px, 0)`,
                willChange: "transform, opacity",
                background:
                  i === 3
                    ? "rgba(16,185,129,0.06)"
                    : "transparent",
                border: i === 3
                  ? "1px solid rgba(16,185,129,0.16)"
                  : "1px solid transparent",
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: `${tx.color}22`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  color: tx.color,
                  flexShrink: 0,
                }}
              >
                {tx.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, color: "#FFFFFF" }}>
                  {tx.name}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.48)", marginTop: 2 }}>
                  {tx.category} · Today · {(i + 8).toString().padStart(2, "0")}:{(30 + i * 7).toString().padStart(2, "0")}
                </div>
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: isPositive ? "#10B981" : "#FFFFFF",
                  flexShrink: 0,
                }}
              >
                {isPositive ? "+" : "−"}₦ {fmt}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

const AllocationPanel = memo(function AllocationPanel({
  frame,
  sceneStart,
}: {
  frame: number;
  sceneStart: number;
}) {
  const t = smootherstep(0.18, 0.28, (frame - sceneStart) / 240);
  const y = lerp(30, 0, spring(90, 12)(t));
  const op = t;

  const pieT = smootherstep(0.3, 0.5, (frame - sceneStart) / 240);

  const accounts = [
    { name: "GTBank", color: "#E8590C", value: 485000, pct: 37.8 },
    { name: "Access", color: "#E11D48", value: 342000, pct: 26.6 },
    { name: "UBA", color: "#8B5CF6", value: 284500, pct: 22.1 },
    { name: "First", color: "#2E90FA", value: 173000, pct: 13.5 },
  ];

  const size = 180;
  const cx = size / 2;
  const cy = size / 2;
  const r = 72;
  const innerR = 48;

  const buildArc = (startAngle: number, endAngle: number, outerR: number, innerR: number) => {
    const full = Math.abs(endAngle - startAngle) >= Math.PI * 2 - 0.001;
    const clippedEnd = full ? startAngle + Math.PI * 2 - 0.001 : endAngle;
    const largeArc = Math.abs(clippedEnd - startAngle) > Math.PI ? 1 : 0;
    const x1 = cx + Math.cos(startAngle) * outerR;
    const y1 = cy + Math.sin(startAngle) * outerR;
    const x2 = cx + Math.cos(clippedEnd) * outerR;
    const y2 = cy + Math.sin(clippedEnd) * outerR;
    const x3 = cx + Math.cos(clippedEnd) * innerR;
    const y3 = cy + Math.sin(clippedEnd) * innerR;
    const x4 = cx + Math.cos(startAngle) * innerR;
    const y4 = cy + Math.sin(startAngle) * innerR;
    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  let cumulative = 0;
  const segments = accounts.map((a) => {
    const start = cumulative * Math.PI * 2 - Math.PI / 2;
    cumulative += a.pct / 100;
    const end = cumulative * Math.PI * 2 - Math.PI / 2;
    return { ...a, startAngle: start, endAngle: end };
  });

  return (
    <div
      style={{
        padding: "24px 26px",
        borderRadius: 18,
        background:
          "linear-gradient(160deg, rgba(255,255,255,0.055), rgba(255,255,255,0.02))",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
        opacity: op,
        transform: `translate3d(0, ${y}px, 0)`,
        willChange: "transform, opacity",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF" }}>
          Balance allocation
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
          How deposits are split
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 14 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <filter id="pie-glow-s3" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {segments.map((s, i) => {
            const revealEnd = s.endAngle * pieT + (1 - pieT) * (s.startAngle + 0.001);
            return (
              <path
                key={s.name}
                d={buildArc(s.startAngle, revealEnd, r, innerR)}
                fill={s.color}
                opacity={0.92}
                filter="url(#pie-glow-s3)"
                style={{ willChange: "d" }}
              />
            );
          })}
          <circle
            cx={cx}
            cy={cy}
            r={innerR - 4}
            fill="rgba(10, 10, 12, 0.85)"
            stroke="rgba(255,255,255,0.08)"
          />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="rgba(255,255,255,0.5)"
            fontSize="11"
            fontWeight="600"
          >
            TOTAL
          </text>
          <text
            x={cx}
            y={cy + 16}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="16"
            fontWeight="700"
            opacity={smootherstep(0.4, 0.55, (frame - sceneStart) / 240)}
          >
            ₦1.28M
          </text>
        </svg>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
        {accounts.map((a, i) => {
          const stagger = 0.44 + i * 0.025;
          const it = smootherstep(stagger, stagger + 0.05, (frame - sceneStart) / 240);
          const iy = lerp(10, 0, easeAppleKeynote(it));
          const iop = it;
          const fmt = new Intl.NumberFormat("en-NG").format(a.value);
          return (
            <div
              key={a.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                opacity: iop,
                transform: `translate3d(0, ${iy}px, 0)`,
                willChange: "transform, opacity",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "rgba(255,255,255,0.9)" }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: a.color,
                    boxShadow: `0 0 8px ${a.color}77`,
                  }}
                />
                {a.name}
              </span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: "#FFFFFF" }}>
                ₦{fmt}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

const TransferFlow = memo(function TransferFlow({
  frame,
  sceneStart,
}: {
  frame: number;
  sceneStart: number;
}) {
  const clickReady = smootherstep(0.5, 0.56, (frame - sceneStart) / 240);
  const cursorT = remap((frame - sceneStart) / 240, 0.5, 0.6, 0, 1, easeAppleKeynote);
  const cursorMoving = (frame - sceneStart) / 240 < 0.6;
  const pressed = smootherstep(0.6, 0.615, (frame - sceneStart) / 240);
  const modalIn = smootherstep(0.61, 0.7, (frame - sceneStart) / 240);
  const checkT = smootherstep(0.72, 0.85, (frame - sceneStart) / 240);

  const startX = 78;
  const startY = 620;
  const endX = 1180;
  const endY = 718;

  const cursorX = cursorMoving ? lerp(startX, endX, cursorT) : endX;
  const cursorY = cursorMoving ? lerp(startY, endY, cursorT) : endY;
  const cursorScale = pressed > 0.001 ? lerp(1, 0.88, pressed) : 1;

  const modalScale = spring(140, 12)(modalIn);
  const modalY = lerp(-8, 0, modalIn);
  const modalOp = smootherstep(0.61, 0.66, (frame - sceneStart) / 240);

  const checkPathLen = 92;
  const checkOffset = checkPathLen * (1 - checkT);

  return (
    <>
      <button
        style={{
          position: "absolute",
          left: 1110,
          top: 690,
          padding: "13px 26px",
          borderRadius: 12,
          background: clickReady > 0.001
            ? `linear-gradient(135deg, #10B981 0%, #4B672D 100%)`
            : "rgba(255,255,255,0.05)",
          border: "1px solid rgba(16,185,129,0.32)",
          color: clickReady > 0.001 ? "#FFFFFF" : "rgba(255,255,255,0.5)",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: 0.3,
          cursor: "pointer",
          boxShadow: clickReady > 0.001
            ? `0 12px 28px -8px rgba(16,185,129,${0.35 + pressed * 0.3})`
            : "none",
          opacity: clickReady,
          transform: `translateZ(40px) scale(${1 - pressed * 0.03})`,
          willChange: "transform, opacity",
          zIndex: 5,
        }}
      >
        Transfer ➝
      </button>

      <div
        style={{
          position: "absolute",
          left: cursorX,
          top: cursorY,
          width: 26,
          height: 26,
          pointerEvents: "none",
          zIndex: 30,
          transform: `scale(${cursorScale})`,
          willChange: "transform, left, top",
          opacity: clickReady,
        }}
      >
        <svg viewBox="0 0 24 24" width="26" height="26" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))" }}>
          <path
            d="M3 3 L 10.5 19 L 12.5 11 L 21 9.5 Z"
            fill="#FFFFFF"
            stroke="rgba(0,0,0,0.65)"
            strokeWidth="0.8"
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            left: -10,
            top: -10,
            width: 46,
            height: 46,
            borderRadius: 999,
            border: "2px solid rgba(16,185,129,0.9)",
            opacity: pressed * 0.9,
            transform: `scale(${1 + pressed * 0.6})`,
            willChange: "transform, opacity",
          }}
        />
      </div>

      {modalOp > 0.001 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 78% 82%, rgba(16,185,129,0.22), transparent 55%), rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            zIndex: 40,
            opacity: modalOp,
            willChange: "opacity",
          }}
        />
      )}

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 420,
          padding: "38px 36px",
          borderRadius: 22,
          background:
            "linear-gradient(160deg, rgba(30,43,35,0.96), rgba(10,12,10,0.96))",
          border: "1px solid rgba(235,246,196,0.16)",
          boxShadow:
            "0 40px 120px -10px rgba(0,0,0,0.85), 0 0 0 1px rgba(16,185,129,0.08) inset",
          transform: `translate(-50%, -50%) translate3d(0, ${modalY}px, 60px) scale(${modalScale})`,
          transformOrigin: "75% 85%",
          opacity: modalOp,
          zIndex: 50,
          willChange: "transform, opacity",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: 999,
              background:
                "radial-gradient(circle at 40% 35%, rgba(16,185,129,0.45), rgba(16,185,129,0.12) 60%, transparent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 60px rgba(16,185,129,${0.45 * checkT})`,
            }}
          >
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeDasharray={176}
                strokeDashoffset={176 * (1 - checkT)}
                strokeLinecap="round"
                style={{ filter: "drop-shadow(0 0 4px rgba(16,185,129,0.8))" }}
              />
              <path
                d="M 18 34 L 28 44 L 48 22"
                fill="none"
                stroke="#EBF6C4"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={checkPathLen}
                strokeDashoffset={checkOffset}
                style={{ filter: "drop-shadow(0 0 6px rgba(235,246,196,0.7))" }}
              />
            </svg>
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: -0.3,
              opacity: smootherstep(0.74, 0.82, (frame - sceneStart) / 240),
            }}
          >
            Transfer successful
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 14.5,
              color: "rgba(255,255,255,0.55)",
              lineHeight: 1.5,
              opacity: smootherstep(0.76, 0.84, (frame - sceneStart) / 240),
            }}
          >
            ₦ 80,000.00 sent to <span style={{ color: "#EBF6C4", fontWeight: 600 }}>Chidi Okafor</span>
            <br />
            Access Bank · Reference HZN-{String(Math.floor(frame % 900000)).padStart(6, "0")}
          </div>

          <div
            style={{
              marginTop: 24,
              padding: "12px 0",
              borderRadius: 12,
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.24)",
              color: "#EBF6C4",
              fontSize: 14,
              fontWeight: 700,
              opacity: smootherstep(0.82, 0.9, (frame - sceneStart) / 240),
            }}
          >
            Continue
          </div>
        </div>
      </div>
    </>
  );
});
