import React, { useState, useEffect, useRef } from "react";
import { TrendingUp } from "lucide-react";

/**
 * StockHeaderPro
 * ----------------------------------------------------------------
 * Premium institutional information panel for MarketGuard AI.
 * Sits directly below TopNavbar. Not a hero section — a dense,
 * data-forward header in the spirit of Bloomberg Terminal /
 * TradingView / Yahoo Finance Premium.
 * ----------------------------------------------------------------
 */

const EMERALD = "#22c55e";
const BRIGHT_EMERALD = "#4ade80";
const CARD_BG = "#0B0B0B";
const BORDER = "rgba(255,255,255,0.08)";
const DIVIDER = "rgba(255,255,255,0.05)";
const TEXT_SECONDARY = "#9ca3af";
const TEXT_MUTED = "#6b7280";

const FONT =
  "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif";

const STOCK = {
  name: "Tesla, Inc.",
  ticker: "TSLA",
  exchange: "NASDAQ",
  price: 256.4,
  change: 6.02,
  changePercent: 2.4,
  date: "May 24, 2024",
  time: "4:00 PM EDT",
  marketStatus: "Market Closed",
};

const STATS = [
  { label: "Market Cap", value: "$820.28B" },
  { label: "Volume", value: "48.52M" },
  { label: "52W High", value: "$299.29" },
  { label: "52W Low", value: "$138.80" },
  { label: "P/E Ratio", value: "62.45" },
];

const AI_RECOMMENDATION = "BUY";
const AI_SCORE = 92;

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

/* ------------------------------------------------------------------ */
/* AI confidence ring                                                  */
/* ------------------------------------------------------------------ */

function ConfidenceRing({ score }) {
  const [ref, inView] = useInView();
  const size = 100;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = inView
    ? circumference - (score / 100) * circumference
    : circumference;

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="aiRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={EMERALD} />
            <stop offset="100%" stopColor={BRIGHT_EMERALD} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#aiRingGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1300ms cubic-bezier(0.22,1,0.36,1)",
            filter: "drop-shadow(0 0 10px rgba(34,197,94,0.6))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-bold tabular-nums leading-none"
          style={{ fontSize: 30, color: "#ffffff", letterSpacing: "-0.02em" }}
        >
          {score}
        </span>
        <span className="text-[10px] font-medium mt-0.5" style={{ color: TEXT_MUTED }}>
          /100
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat item                                                           */
/* ------------------------------------------------------------------ */

function StatItem({ label, value, isLast }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center"
      style={{ borderRight: isLast ? "none" : `1px solid ${DIVIDER}` }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex flex-col px-4 lg:px-5 cursor-default"
      >
        <span
          className="font-medium uppercase tracking-widest mb-1 whitespace-nowrap"
          style={{ fontSize: 11, color: TEXT_MUTED }}
        >
          {label}
        </span>
        <span
          className="font-semibold tabular-nums whitespace-nowrap transition-colors duration-300"
          style={{
            fontSize: 24,
            letterSpacing: "-0.02em",
            color: hovered ? "#ffffff" : "#e5e7eb",
          }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                       */
/* ------------------------------------------------------------------ */

export default function StockHeaderPro() {
  const isUp = STOCK.change >= 0;

  return (
    <div
      className="relative w-full rounded-[16px] border"
      style={{
        background: CARD_BG,
        borderColor: BORDER,
        fontFamily: FONT,
        boxShadow: "0 20px 50px -24px rgba(0,0,0,0.7)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[16px] opacity-50"
        style={{
          background:
            "radial-gradient(640px 220px at 15% 0%, rgba(34,197,94,0.06), transparent 70%)",
        }}
      />

      <div
        className="relative w-full flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-5"
        style={{ paddingTop: 18, paddingBottom: 18, paddingLeft: 30, paddingRight: 30 }}
      >
        {/* ---------------- LEFT SECTION ---------------- */}
        <div className="w-[250px]">
          {/* Company name */}
          <h1
            className="font-bold tracking-tight leading-none mb-2"
            style={{ fontSize: 34, color: "#ffffff", letterSpacing: "-0.025em" }}
          >
            {STOCK.name}
          </h1>

          {/* Badges */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[13px] font-semibold px-2.5 py-1 rounded-md border"
              style={{
                color: "#e5e7eb",
                borderColor: BORDER,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              {STOCK.ticker}
            </span>
            <span
              className="text-[13px] font-semibold px-2.5 py-1 rounded-md border"
              style={{
                color: TEXT_SECONDARY,
                borderColor: BORDER,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              {STOCK.exchange}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3.5 flex-wrap mb-1.5">
            <span
              className="font-bold tabular-nums leading-none"
              style={{ fontSize: 48, color: "#ffffff", letterSpacing: "-0.03em" }}
            >
              ${STOCK.price.toFixed(2)}
            </span>
            <div
              className="flex items-center gap-1.5 mb-1"
              style={{ color: isUp ? BRIGHT_EMERALD : "#f87171" }}
            >
              <TrendingUp size={18} strokeWidth={2.2} />
              <span className="text-base font-semibold tabular-nums">
                +{STOCK.change.toFixed(2)} (+{STOCK.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Timestamp — single compact line */}
          <div className="flex items-center gap-2 text-[13px]" style={{ color: TEXT_MUTED }}>
            <span
              className="inline-block rounded-full"
              style={{
                width: 6,
                height: 6,
                background: "#f87171",
                boxShadow: "0 0 5px rgba(248,113,113,0.7)",
              }}
            />
            <span>{STOCK.marketStatus}</span>
            <span>&middot;</span>
            <span>
              Updated: {STOCK.date} &bull; {STOCK.time}
            </span>
          </div>
        </div>

        {/* ---------------- DIVIDER (desktop) ---------------- */}
        <div
          className="hidden lg:block self-stretch my-1"
          style={{ width: 1, background: DIVIDER }}
        />

        {/* ---------------- RIGHT: STATS ---------------- */}
        <div className="flex flex-1 items-center justify-between min-w-0">
          {STATS.map((stat, i) => (
            <StatItem
              key={stat.label}
              label={stat.label}
              value={stat.value}
              isLast={i === STATS.length - 1}
            />
          ))}
        </div>

        {/* ---------------- DIVIDER (desktop) ---------------- */}
        <div
          className="hidden lg:block self-stretch my-1"
          style={{ width: 1, background: DIVIDER }}
        />

        {/* ---------------- AI RECOMMENDATION ---------------- */}
        <div className="flex items-center gap-4 pl-6">
          <div className="flex flex-col">
            <span
              className="font-medium uppercase tracking-widest mb-1.5 whitespace-nowrap"
              style={{ fontSize: 13, color: TEXT_MUTED }}
            >
              AI Recommendation
            </span>
            <span
              className="font-bold leading-none"
              style={{
                fontSize: 40,
                color: BRIGHT_EMERALD,
                letterSpacing: "-0.02em",
                textShadow: "0 0 26px rgba(34,197,94,0.5)",
              }}
            >
              {AI_RECOMMENDATION}
            </span>
          </div>
          <ConfidenceRing score={AI_SCORE} />
        </div>
      </div>
    </div>
  );
}
