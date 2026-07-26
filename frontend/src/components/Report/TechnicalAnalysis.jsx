import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowDownToLine,
  ArrowUpToLine,
  ListChecks,
  Sparkles,
} from "lucide-react";

/**
 * TechnicalAnalysis
 * Card #5 of the MarketGuard AI report — trend summary, indicator grid,
 * support/resistance, signal list, and an AI technical-view summary.
 * Follows the same static, document-style design language as
 * CompanyOverview, PriceAnalysis, AIRecommendation, and FinancialAnalysis.
 *
 * Props:
 * @param {Object} stock - {
 *   trend,                                   // "Strong Bullish" | "Bullish" | "Neutral" | "Bearish" | "Strong Bearish"
 *   rsi, rsi_interpretation,
 *   macd, macd_interpretation,
 *   dma50, dma50_interpretation,
 *   dma200, dma200_interpretation,
 *   volume_trend, volume_trend_interpretation,
 *   volatility, volatility_interpretation,
 *   support, resistance,
 *   signals,                                 // array of strings (4-5 items)
 *   technical_view                           // 2-3 line AI summary
 * }
 */

// ============================================================
// FORMATTING HELPERS
// ============================================================

/** Generic fallback formatter — renders "N/A" for missing values. */
const formatValue = (value) => {
  if (value === undefined || value === null || value === "") return "N/A";
  return value;
};

/** Currency formatter for price-based fields (Support / Resistance). */
const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") return "N/A";
  const num = Number(value);
  if (Number.isNaN(num)) return "N/A";
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// ============================================================
// COLOR / STYLE HELPERS
// ============================================================

/** Styling + icon for the primary trend badge (5-point scale). */
const getTrendStyle = (trend) => {
  const styles = {
    "Strong Bullish": {
      classes: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      icon: TrendingUp,
    },
    Bullish: {
      classes: "bg-green-50 text-green-700 ring-green-200",
      icon: TrendingUp,
    },
    Neutral: {
      classes: "bg-slate-100 text-slate-600 ring-slate-200",
      icon: Minus,
    },
    Bearish: {
      classes: "bg-orange-50 text-orange-700 ring-orange-200",
      icon: TrendingDown,
    },
    "Strong Bearish": {
      classes: "bg-red-50 text-red-700 ring-red-200",
      icon: TrendingDown,
    },
  };
  return styles[trend] || styles.Neutral;
};

/** Compact badge styling for per-indicator interpretations. */
const getInterpretationStyle = (interpretation) => {
  const styles = {
    Bullish: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Positive: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Neutral: "bg-slate-100 text-slate-600 ring-slate-200",
    Bearish: "bg-red-50 text-red-700 ring-red-200",
    Negative: "bg-red-50 text-red-700 ring-red-200",
  };
  return styles[interpretation] || "bg-slate-100 text-slate-500 ring-slate-200";
};

const TechnicalAnalysis = ({ stock }) => {
  const {
    trend = "Neutral",
    rsi,
    rsi_interpretation,
    macd,
    macd_interpretation,
    dma50,
    dma50_interpretation,
    dma200,
    dma200_interpretation,
    volume_trend,
    volume_trend_interpretation,
    volatility,
    volatility_interpretation,
    support,
    resistance,
    signals = [],
    technical_view,
  } = stock || {};

  const trendStyle = getTrendStyle(trend);
  const TrendIcon = trendStyle.icon;

  // Indicator rows assembled from props for the 2-column grid.
  const indicators = [
    { name: "RSI (14)", value: formatValue(rsi), interpretation: rsi_interpretation },
    { name: "MACD", value: formatValue(macd), interpretation: macd_interpretation },
    { name: "50 DMA", value: formatCurrency(dma50), interpretation: dma50_interpretation },
    { name: "200 DMA", value: formatCurrency(dma200), interpretation: dma200_interpretation },
    {
      name: "Volume Trend",
      value: formatValue(volume_trend),
      interpretation: volume_trend_interpretation,
    },
    {
      name: "Volatility",
      value: formatValue(volatility),
      interpretation: volatility_interpretation,
    },
  ];

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* ===================== CARD HEADER ===================== */}
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-800">
        5. Technical Analysis
      </h3>

      {/* ===================== 1. TREND SUMMARY ===================== */}
      <div
        className={`mb-3 flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-sm font-extrabold ring-1 ring-inset ${trendStyle.classes}`}
      >
        <TrendIcon className="h-4 w-4" strokeWidth={2.5} />
        {formatValue(trend)}
      </div>

      {/* ===================== 2. TECHNICAL INDICATORS ===================== */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        {indicators.map(({ name, value, interpretation }) => (
          <div
            key={name}
            className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5"
          >
            <div className="min-w-0">
              <p className="truncate text-[10px] font-medium uppercase tracking-wide text-slate-400">
                {name}
              </p>
              <p className="text-xs font-bold text-slate-900">{value}</p>
            </div>
            {interpretation && (
              <span
                className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ring-1 ring-inset ${getInterpretationStyle(
                  interpretation
                )}`}
              >
                {interpretation}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ===================== 3. SUPPORT & RESISTANCE ===================== */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-center">
          <div className="mb-0.5 flex items-center justify-center gap-1 text-slate-400">
            <ArrowDownToLine className="h-3 w-3" strokeWidth={2} />
            <span className="text-[10px] font-medium uppercase tracking-wide">
              Support
            </span>
          </div>
          <p className="text-sm font-extrabold text-emerald-600">
            {formatCurrency(support)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-center">
          <div className="mb-0.5 flex items-center justify-center gap-1 text-slate-400">
            <ArrowUpToLine className="h-3 w-3" strokeWidth={2} />
            <span className="text-[10px] font-medium uppercase tracking-wide">
              Resistance
            </span>
          </div>
          <p className="text-sm font-extrabold text-red-600">
            {formatCurrency(resistance)}
          </p>
        </div>
      </div>

      {/* ===================== 4. TECHNICAL SIGNALS ===================== */}
      {signals.length > 0 && (
        <div className="mb-3">
          <div className="mb-1.5 flex items-center gap-1.5">
            <ListChecks className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Technical Signals
            </span>
          </div>
          <ul className="space-y-1">
            {signals.slice(0, 5).map((signal, idx) => (
              <li
                key={idx}
                className="flex items-start gap-1.5 text-[11px] font-medium leading-tight text-slate-600"
              >
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                <span className="truncate">{signal}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ===================== 5. OVERALL TECHNICAL VIEW ===================== */}
      <div className="rounded-lg bg-slate-50 p-2.5">
        <div className="mb-1 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Overall Technical View
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600">
          {technical_view || "N/A"}
        </p>
      </div>
    </section>
  );
};

export default TechnicalAnalysis;
