import React from "react";

/**
 * AIDecisionBreakdown
 * ----------------------------------------------------------------
 * Previously this rendered entirely hardcoded module-level constants
 * (RECOMMENDATION = "BUY", CONFIDENCE_SCORE = 92, fixed FACTORS) and
 * took no props at all — it never changed regardless of which stock
 * was being viewed.
 *
 * The real backend (generate_ai_analysis() in stock_routes.py, bundled
 * into /api/stocks/{symbol}/details as `aiAnalysis`) only returns an
 * aggregate score/recommendation/risk plus a list of real evaluative
 * statements — it doesn't expose a per-factor numeric breakdown, so a
 * weighted "Factor Contribution" bar chart can't be built honestly
 * from what's available. Instead this shows the real recommendation,
 * the real reasoning statements, and the real underlying fundamentals
 * (P/E, EPS, Market Cap, Beta) that actually drove the score.
 *
 * Props:
 *   symbol   — string, e.g. "RELIANCE.NS"
 *   analysis — the aiAnalysis object from /api/stocks/{symbol}/details:
 *              { recommendation, aiScore, confidence, risk, summary,
 *                reasoning, currentPrice, targetPrice, color, colorDim,
 *                colorBorder, glow, peRatio, eps, marketCap, beta }
 */

const RISK_COLORS = {
  Low:    { color: "#22c55e", bright: "#4ade80" },
  Medium: { color: "#eab308", bright: "#facc15" },
  High:   { color: "#ef4444", bright: "#f87171" },
};

function StatusBanner({ analysis }) {
  const recommendation = analysis.recommendation || "HOLD";
  const score = Math.round(analysis.aiScore ?? analysis.confidence ?? 0);
  const risk = analysis.risk || "Medium";
  const style = RISK_COLORS[risk] || RISK_COLORS.Medium;
  const recColor = analysis.color || style.bright;

  return (
    <div
      className="relative w-full rounded-2xl border overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${recColor}1f, rgba(255,255,255,0.02))`,
        borderColor: `${recColor}4d`,
        boxShadow: `0 0 40px ${recColor}2e`,
      }}
    >
      <div className="relative flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-8 px-6 sm:px-10 py-8">
        <div className="flex flex-col items-center sm:items-start justify-center">
          <span className="text-[12px] font-medium uppercase tracking-widest mb-2" style={{ color: "#6b7280" }}>
            AI Recommendation
          </span>
          <span
            className="inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-2xl sm:text-3xl font-bold tracking-tight border"
            style={{
              color: recColor,
              background: `${recColor}1f`,
              borderColor: `${recColor}66`,
              boxShadow: `0 0 30px ${recColor}59`,
              letterSpacing: "-0.02em",
            }}
          >
            {recommendation}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center">
          <span className="text-[12px] font-medium uppercase tracking-widest mb-2" style={{ color: "#6b7280" }}>
            AI Score
          </span>
          <span className="text-5xl sm:text-6xl font-bold tabular-nums leading-none" style={{ color: "#ffffff", letterSpacing: "-0.03em" }}>
            {score}
            <span className="text-2xl sm:text-3xl font-semibold" style={{ color: "#6b7280" }}>/100</span>
          </span>
        </div>

        <div className="flex flex-col items-center sm:items-end justify-center">
          <span className="text-[12px] font-medium uppercase tracking-widest mb-2" style={{ color: "#6b7280" }}>
            Risk Level
          </span>
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 border text-base font-semibold"
            style={{ color: style.bright, background: `${style.color}1a`, borderColor: `${style.color}4d` }}
          >
            <span className="block w-2 h-2 rounded-full" style={{ backgroundColor: style.bright, boxShadow: `0 0 8px ${style.color}99` }} />
            {risk} Risk
          </span>
        </div>
      </div>
    </div>
  );
}

function FundamentalTile({ label, value }) {
  return (
    <div
      className="rounded-xl px-4 py-4 border w-full"
      style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}
    >
      <p className="text-[11px] font-medium tracking-wide mb-1.5" style={{ color: "#6b7280" }}>{label}</p>
      <p className="text-2xl font-semibold tabular-nums" style={{ color: "#ffffff", letterSpacing: "-0.02em" }}>
        {value ?? "—"}
      </p>
    </div>
  );
}

export default function AIDecisionBreakdown({ symbol, analysis, stock }) {
  if (!analysis) {
    return <div className="text-white p-8">Loading decision breakdown...</div>;
  }

  // generate_ai_analysis() (the aiAnalysis object) only returns
  // recommendation/aiScore/risk/summary/reasoning/currentPrice/
  // targetPrice — it does NOT echo back peRatio/eps/marketCap/beta.
  // Those live on the raw stock details object (`stock`), not on
  // `analysis`. Reading them off `analysis` was the bug — they were
  // always undefined there, hence the empty "—" tiles.
  const fundamentals = stock || {};

  const upsideValid = analysis.targetPrice != null && analysis.currentPrice;
  const upside = upsideValid
    ? (((analysis.targetPrice - analysis.currentPrice) / analysis.currentPrice) * 100).toFixed(1)
    : null;

  return (
    <div
      className="relative w-full rounded-2xl border"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.015) 100%)",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: "0 20px 50px -20px rgba(0,0,0,0.6)",
        fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-60" style={{ background: "radial-gradient(700px 280px at 50% -10%, rgba(34,197,94,0.06), transparent 70%)" }} />

      <div className="relative w-full px-6 sm:px-10 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-8">
          <div>
            <h2 className="text-2xl sm:text-[28px] font-semibold tracking-tight mb-1.5" style={{ color: "#ffffff", letterSpacing: "-0.015em" }}>
              AI Decision Breakdown — {symbol}
            </h2>
            <p className="text-sm sm:text-[15px] leading-relaxed" style={{ color: "#6b7280" }}>
              Fundamentals driving the AI's recommendation for this stock.
            </p>
          </div>
          <span className="text-[11px] font-medium uppercase tracking-widest px-3 py-1.5 rounded-md border shrink-0 self-start" style={{ color: "#6b7280", borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
            AI Powered
          </span>
        </div>

        <div className="mb-8">
          <StatusBanner analysis={analysis} />
        </div>

        {upside != null && (
          <div className="mb-8 text-sm" style={{ color: "#9ca3af" }}>
            Current price ₹{analysis.currentPrice} · AI target ₹{analysis.targetPrice}
            {" "}({upside >= 0 ? "+" : ""}{upside}% implied)
          </div>
        )}

        <div className="h-px w-full mb-8" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />

        <div className="w-full mb-10">
          <h3 className="text-[13px] font-semibold uppercase tracking-widest mb-5" style={{ color: "#6b7280" }}>
            Fundamentals Snapshot
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
            <FundamentalTile label="P/E Ratio" value={fundamentals.peRatio?.toFixed?.(1) ?? fundamentals.peRatio} />
            <FundamentalTile label="EPS" value={fundamentals.eps != null ? `₹${fundamentals.eps}` : null} />
            <FundamentalTile
              label="Market Cap"
              value={
                fundamentals.marketCap
                  ? fundamentals.marketCap >= 1e12
                    ? `₹${(fundamentals.marketCap / 1e12).toFixed(2)}T`
                    : `₹${(fundamentals.marketCap / 1e9).toFixed(2)}B`
                  : null
              }
            />
            <FundamentalTile label="Beta" value={fundamentals.beta?.toFixed?.(2) ?? fundamentals.beta} />
          </div>
        </div>

        <div className="h-px w-full mb-8" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />

        <div className="w-full">
          <div
            className="relative w-full rounded-2xl px-6 sm:px-8 py-6 border overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${analysis.colorDim || "rgba(34,197,94,0.12)"}, rgba(255,255,255,0.02))`,
              borderColor: analysis.colorBorder || "rgba(34,197,94,0.3)",
              boxShadow: `0 0 28px ${analysis.glow || "rgba(34,197,94,0.15)"}`,
            }}
          >
            <p className="text-lg sm:text-xl font-semibold leading-relaxed mb-3" style={{ color: analysis.color || "#4ade80", letterSpacing: "-0.01em" }}>
              Why AI Recommends {analysis.recommendation || "HOLD"}
            </p>
            <div className="space-y-2">
              {(analysis.summary || []).length ? (
                analysis.summary.map((line, i) => (
                  <p key={i} className="text-sm sm:text-[15px] leading-relaxed" style={{ color: "#d1d5db" }}>{line}</p>
                ))
              ) : (
                <p className="text-sm sm:text-[15px] leading-relaxed" style={{ color: "#d1d5db" }}>
                  {analysis.reasoning || "No detailed reasoning available for this stock yet."}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
