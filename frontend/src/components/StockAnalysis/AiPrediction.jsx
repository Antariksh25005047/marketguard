import React, { useState, useEffect, useRef } from "react";

/**
 * AIDecisionBreakdown
 * ----------------------------------------------------------------
 * Full-width, institutional research-terminal section for
 * MarketGuard AI. Appears directly below the AI Analysis Card.
 *
 * Scope: WHY the AI recommends BUY / HOLD / SELL — factor
 * contribution breakdown, decision engine scoring, reasoning,
 * and confidence-by-category. No price charts, no news feed,
 * no watchlists.
 *
 * Layout: w-full — major dashboard section, not a compact card.
 * ----------------------------------------------------------------
 */

const RECOMMENDATION = "BUY";
const CONFIDENCE_SCORE = 92;
const RISK_LEVEL = "Low Risk";

const FACTORS = [
  { label: "Earnings Growth", value: 25 },
  { label: "Institutional Activity", value: 20 },
  { label: "Market Sentiment", value: 18 },
  { label: "Technical Momentum", value: 15 },
  { label: "News Impact", value: 12 },
  { label: "Risk Factors", value: -8 },
];

const ENGINE_SCORE = {
  positive: 90,
  negative: 12,
  net: 92,
};

const AI_REASONING = {
  headline: "Why AI Recommends BUY",
  lines: [
    "Strong earnings growth and institutional accumulation continue to support bullish momentum.",
    "Positive market sentiment and favorable technical indicators outweigh current risk factors.",
  ],
};

const CONFIDENCE_BREAKDOWN = [
  { label: "Fundamentals", value: 95 },
  { label: "Technicals", value: 88 },
  { label: "Sentiment", value: 90 },
  { label: "Risk Control", value: 82 },
];

const EMERALD = "#22c55e";
const BRIGHT_EMERALD = "#4ade80";
const NEGATIVE = "#ef4444";
const NEGATIVE_BRIGHT = "#f87171";

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
      { threshold: 0.15 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function RecommendationBanner() {
  return (
    <div
      className="relative w-full rounded-2xl border overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(255,255,255,0.02))",
        borderColor: "rgba(34,197,94,0.30)",
        boxShadow: "0 0 40px rgba(34,197,94,0.18)",
      }}
    >
      <div className="relative flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-8 px-6 sm:px-10 py-8">
        {/* Recommendation badge */}
        <div className="flex flex-col items-center sm:items-start justify-center">
          <span
            className="text-[12px] font-medium uppercase tracking-widest mb-2"
            style={{ color: "#6b7280" }}
          >
            AI Recommendation
          </span>
          <span
            className="inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-3xl sm:text-4xl font-bold tracking-tight border"
            style={{
              color: BRIGHT_EMERALD,
              background: "rgba(34,197,94,0.12)",
              borderColor: "rgba(34,197,94,0.4)",
              boxShadow: `0 0 30px rgba(34,197,94,0.35)`,
              letterSpacing: "-0.02em",
              textShadow: `0 0 24px rgba(34,197,94,0.5)`,
            }}
          >
            {RECOMMENDATION}
          </span>
        </div>

        {/* Confidence score */}
        <div className="flex flex-col items-center justify-center">
          <span
            className="text-[12px] font-medium uppercase tracking-widest mb-2"
            style={{ color: "#6b7280" }}
          >
            AI Confidence Score
          </span>
          <span
            className="text-5xl sm:text-6xl font-bold tabular-nums leading-none"
            style={{
              color: "#ffffff",
              letterSpacing: "-0.03em",
            }}
          >
            {CONFIDENCE_SCORE}
            <span className="text-2xl sm:text-3xl font-semibold" style={{ color: "#6b7280" }}>
              /100
            </span>
          </span>
        </div>

        {/* Risk level */}
        <div className="flex flex-col items-center sm:items-end justify-center">
          <span
            className="text-[12px] font-medium uppercase tracking-widest mb-2"
            style={{ color: "#6b7280" }}
          >
            Risk Level
          </span>
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 border text-base font-semibold"
            style={{
              color: BRIGHT_EMERALD,
              background: "rgba(34,197,94,0.10)",
              borderColor: "rgba(34,197,94,0.3)",
            }}
          >
            <span
              className="block w-2 h-2 rounded-full"
              style={{ backgroundColor: BRIGHT_EMERALD, boxShadow: `0 0 8px rgba(34,197,94,0.6)` }}
            />
            {RISK_LEVEL}
          </span>
        </div>
      </div>
    </div>
  );
}

function ContributionBar({ label, value, maxAbs, index, inView }) {
  const isPositive = value >= 0;
  const color = isPositive ? BRIGHT_EMERALD : NEGATIVE_BRIGHT;
  const glow = isPositive ? "rgba(34,197,94,0.5)" : "rgba(239,68,68,0.5)";
  const widthPercent = (Math.abs(value) / maxAbs) * 100;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium" style={{ color: "#d1d5db" }}>
          {label}
        </span>
        <span
          className="text-sm font-semibold tabular-nums"
          style={{ color }}
        >
          {isPositive ? "+" : ""}
          {value}
        </span>
      </div>
      <div
        className="relative h-3 rounded-full overflow-hidden w-full"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: inView ? `${widthPercent}%` : "0%",
            background: isPositive
              ? "linear-gradient(90deg, #16a34a 0%, #22c55e 60%, #4ade80 100%)"
              : "linear-gradient(90deg, #b91c1c 0%, #ef4444 60%, #f87171 100%)",
            boxShadow: `0 0 12px ${glow}`,
            transition: `width 1100ms cubic-bezier(0.22,1,0.36,1)`,
            transitionDelay: `${index * 90}ms`,
          }}
        />
      </div>
    </div>
  );
}

function EngineScoreTile({ label, value, color, glow }) {
  return (
    <div
      className="flex-1 rounded-xl border px-5 py-5 text-center"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <p
        className="text-[11px] font-medium uppercase tracking-widest mb-2"
        style={{ color: "#6b7280" }}
      >
        {label}
      </p>
      <p
        className="text-3xl sm:text-4xl font-bold tabular-nums"
        style={{
          color,
          letterSpacing: "-0.02em",
          textShadow: glow ? `0 0 20px ${glow}` : "none",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function ConfidenceMiniCard({ label, value, delay }) {
  return (
    <div
      className="group relative rounded-xl px-4 py-4 border overflow-hidden transition-all duration-300 hover:-translate-y-0.5 w-full"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.08)",
        animation: "adb-fade-up 600ms cubic-bezier(0.22,1,0.36,1) both",
        animationDelay: `${delay}ms`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(34,197,94,0.35)";
        e.currentTarget.style.boxShadow = "0 14px 32px -10px rgba(34,197,94,0.26)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(140px 70px at 50% 0%, rgba(34,197,94,0.12), transparent 70%)",
        }}
      />
      <p
        className="relative text-[11px] font-medium tracking-wide mb-1.5"
        style={{ color: "#6b7280" }}
      >
        {label}
      </p>
      <p
        className="relative text-2xl font-semibold tabular-nums"
        style={{ color: "#ffffff", letterSpacing: "-0.02em" }}
      >
        {value}
        <span className="text-base font-medium ml-0.5" style={{ color: BRIGHT_EMERALD }}>
          %
        </span>
      </p>
    </div>
  );
}

export default function AIDecisionBreakdown() {
  const [barsRef, barsInView] = useInView();
  const maxAbs = Math.max(...FACTORS.map((f) => Math.abs(f.value)));

  return (
    <div
      className="relative w-full rounded-2xl border"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%)",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: "0 20px 50px -20px rgba(0,0,0,0.6)",
        fontFamily:
          "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Ambient backdrop glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
        style={{
          background:
            "radial-gradient(700px 280px at 50% -10%, rgba(34,197,94,0.06), transparent 70%)",
        }}
      />

      <div className="relative w-full px-6 sm:px-10 py-8 sm:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-8">
          <div>
            <h2
              className="text-2xl sm:text-[28px] font-semibold tracking-tight mb-1.5"
              style={{ color: "#ffffff", letterSpacing: "-0.015em" }}
            >
              AI Decision Breakdown
            </h2>
            <p
              className="text-sm sm:text-[15px] leading-relaxed"
              style={{ color: "#6b7280" }}
            >
              Transparent breakdown of factors influencing the AI
              recommendation.
            </p>
          </div>
          <span
            className="text-[11px] font-medium uppercase tracking-widest px-3 py-1.5 rounded-md border shrink-0 self-start"
            style={{
              color: "#6b7280",
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            AI Powered
          </span>
        </div>

        {/* Top section: recommendation banner */}
        <div className="mb-8">
          <RecommendationBanner />
        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-8"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
        />

        {/* Factor contribution breakdown */}
        <div ref={barsRef} className="w-full mb-10">
          <h3
            className="text-[13px] font-semibold uppercase tracking-widest mb-5"
            style={{ color: "#6b7280" }}
          >
            Factor Contribution Breakdown
          </h3>
          <div className="flex flex-col gap-5 w-full">
            {FACTORS.map((factor, i) => (
              <ContributionBar
                key={factor.label}
                label={factor.label}
                value={factor.value}
                maxAbs={maxAbs}
                index={i}
                inView={barsInView}
              />
            ))}
          </div>
        </div>

        {/* Decision engine score */}
        <div className="w-full mb-10">
          <h3
            className="text-[13px] font-semibold uppercase tracking-widest mb-5"
            style={{ color: "#6b7280" }}
          >
            Decision Engine Score
          </h3>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <EngineScoreTile
              label="Positive Factors Score"
              value={ENGINE_SCORE.positive}
              color={BRIGHT_EMERALD}
              glow="rgba(34,197,94,0.45)"
            />
            <EngineScoreTile
              label="Negative Factors Score"
              value={ENGINE_SCORE.negative}
              color={NEGATIVE_BRIGHT}
              glow="rgba(239,68,68,0.45)"
            />
            <EngineScoreTile
              label="Net AI Score"
              value={ENGINE_SCORE.net}
              color="#ffffff"
              glow="rgba(255,255,255,0.18)"
            />
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px w-full mb-8"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
        />

        {/* AI reasoning */}
        <div className="w-full mb-10">
          <div
            className="relative w-full rounded-2xl px-6 sm:px-8 py-6 border overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(74,222,128,0.04))",
              borderColor: "rgba(34,197,94,0.30)",
              boxShadow: "0 0 28px rgba(34,197,94,0.15)",
            }}
          >
            <p
              className="text-lg sm:text-xl font-semibold leading-relaxed mb-3"
              style={{ color: BRIGHT_EMERALD, letterSpacing: "-0.01em" }}
            >
              {AI_REASONING.headline}
            </p>
            <div className="space-y-2">
              {AI_REASONING.lines.map((line) => (
                <p
                  key={line}
                  className="text-sm sm:text-[15px] leading-relaxed"
                  style={{ color: "#d1d5db" }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Confidence breakdown */}
        <div className="w-full">
          <h3
            className="text-[13px] font-semibold uppercase tracking-widest mb-5"
            style={{ color: "#6b7280" }}
          >
            Confidence Breakdown
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
            {CONFIDENCE_BREAKDOWN.map((item, i) => (
              <ConfidenceMiniCard
                key={item.label}
                label={item.label}
                value={item.value}
                delay={i * 80}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes adb-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
