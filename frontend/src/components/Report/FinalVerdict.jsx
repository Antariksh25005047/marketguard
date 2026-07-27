import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Percent,
  Gauge,
  ShieldAlert,
  CalendarClock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

/**
 * FinalVerdict
 * Card #9 of the MarketGuard AI report — the closing, full-width section
 * that consolidates the entire report into one recommendation: an overall
 * call, five summary metrics, key reasons, an AI final recommendation, and
 * an overall investment score. Sits directly below NewsSummary and follows
 * the same static, document-style design language as every other report
 * card (white background, rounded-xl border, subtle shadow, no animation).
 *
 * Props:
 * @param {Object} stock - {
 *   recommendation,      // "Strong Buy" | "Buy" | "Hold" | "Sell" | "Strong Sell"
 *   target_price,
 *   upside_percent,
 *   confidence,
 *   risk_level,          // "Low" | "Medium" | "High"
 *   investment_horizon,  // "Short Term" | "Medium Term" | "Long Term"
 *   investment_score,    // number, 0-100
 *   key_reasons,         // array of strings (4-6 items)
 *   final_summary         // AI-generated closing paragraph
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

/** Currency formatter for price-based fields (Target Price). */
const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") return "N/A";
  const num = Number(value);
  if (Number.isNaN(num)) return "N/A";
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/** Percentage formatter — appends "%" to numeric values only. */
const formatPercent = (value) => {
  if (value === undefined || value === null || value === "") return "N/A";
  const num = Number(value);
  if (Number.isNaN(num)) return value; // already-formatted string
  const sign = num > 0 ? "+" : "";
  return `${sign}${num.toFixed(1)}%`;
};

/** Normalizes the key_reasons prop into a capped array. */
const formatPointsList = (points, max) =>
  Array.isArray(points) ? points.filter(Boolean).slice(0, max) : [];

// ============================================================
// COLOR / STYLE HELPERS
// ============================================================

/** Styling + icon for the overall recommendation badge (5-point scale). */
const RECOMMENDATION_STYLES = {
  "Strong Buy": {
    classes: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: TrendingUp,
  },
  Buy: {
    classes: "bg-green-50 text-green-700 ring-green-200",
    icon: TrendingUp,
  },
  Hold: {
    classes: "bg-amber-50 text-amber-700 ring-amber-200",
    icon: Minus,
  },
  Sell: {
    classes: "bg-orange-50 text-orange-700 ring-orange-200",
    icon: TrendingDown,
  },
  "Strong Sell": {
    classes: "bg-red-50 text-red-700 ring-red-200",
    icon: TrendingDown,
  },
};

const getRecommendationStyle = (value) =>
  RECOMMENDATION_STYLES[value] || {
    classes: "bg-slate-100 text-slate-500 ring-slate-200",
    icon: Minus,
  };

/** Styling for the Risk Level metric badge. */
const RISK_STYLES = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  High: "bg-red-50 text-red-700 ring-red-200",
};

const getRiskStyle = (value) =>
  RISK_STYLES[value] || "bg-slate-100 text-slate-500 ring-slate-200";

/** Styling for the Investment Horizon metric badge — neutral time tones. */
const HORIZON_STYLES = {
  "Short Term": "bg-sky-50 text-sky-700 ring-sky-200",
  "Medium Term": "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "Long Term": "bg-violet-50 text-violet-700 ring-violet-200",
};

const getHorizonStyle = (value) =>
  HORIZON_STYLES[value] || "bg-slate-100 text-slate-500 ring-slate-200";

/**
 * Styling for the Overall Investment Score — text and progress-bar fill
 * share the same threshold tiers so the section stays visually consistent.
 * 80-100 = green, 60-79 = amber, below 60 = red.
 */
const getScoreStyle = (score) => {
  if (score === undefined || score === null || Number.isNaN(Number(score))) {
    return { text: "text-slate-400", bar: "bg-slate-300" };
  }
  const num = Number(score);
  if (num >= 80) return { text: "text-emerald-600", bar: "bg-emerald-500" };
  if (num >= 60) return { text: "text-amber-600", bar: "bg-amber-500" };
  return { text: "text-red-600", bar: "bg-red-500" };
};

const FinalVerdict = ({ stock }) => {
  const {
    recommendation,
    target_price,
    upside_percent,
    confidence,
    risk_level,
    investment_horizon,
    investment_score,
    key_reasons,
    final_summary,
  } = stock || {};

  const recStyle = getRecommendationStyle(recommendation);
  const RecIcon = recStyle.icon;
  const reasonsList = formatPointsList(key_reasons, 6);

  const scoreStyle = getScoreStyle(investment_score);
  const scoreValue = Number(investment_score);
  const scorePercent = Number.isNaN(scoreValue)
    ? 0
    : Math.max(0, Math.min(100, scoreValue));

  // Summary metric cards assembled from props for the 5-column grid.
  const metrics = [
    {
      icon: Target,
      label: "Target Price",
      content: (
        <span className="text-sm font-extrabold text-slate-900">
          {formatCurrency(target_price)}
        </span>
      ),
    },
    {
      icon: Percent,
      label: "Expected Upside",
      content: (
        <span className="text-sm font-extrabold text-emerald-600">
          {formatPercent(upside_percent)}
        </span>
      ),
    },
    {
      icon: Gauge,
      label: "Confidence",
      content: (
        <span className="text-sm font-extrabold text-slate-900">
          {confidence !== undefined && confidence !== null
            ? `${confidence}%`
            : "N/A"}
        </span>
      ),
    },
    {
      icon: ShieldAlert,
      label: "Risk Level",
      content: (
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset ${getRiskStyle(
            risk_level
          )}`}
        >
          {formatValue(risk_level)}
        </span>
      ),
    },
    {
      icon: CalendarClock,
      label: "Investment Horizon",
      content: (
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ring-1 ring-inset ${getHorizonStyle(
            investment_horizon
          )}`}
        >
          {formatValue(investment_horizon)}
        </span>
      ),
    },
  ];

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* ===================== CARD HEADER ===================== */}
      <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-800">
        9. Final Verdict
      </h3>

      {/* ===================== 1. OVERALL RECOMMENDATION ===================== */}
      <div
        className={`mb-6 flex items-center justify-center gap-2 rounded-lg py-3 text-xl font-extrabold ring-1 ring-inset ${recStyle.classes}`}
      >
        <RecIcon className="h-5 w-5" strokeWidth={2.5} />
        {formatValue(recommendation)}
      </div>

      {/* ===================== 2. SUMMARY METRICS ===================== */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {metrics.map(({ icon: Icon, label, content }) => (
          <div
            key={label}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-center"
          >
            <div className="mb-1 flex items-center justify-center gap-1.5 text-slate-400">
              <Icon className="h-3.5 w-3.5" strokeWidth={2} />
              <span className="text-[10px] font-medium uppercase tracking-wide">
                {label}
              </span>
            </div>
            {content}
          </div>
        ))}
      </div>

      {/* ===================== 3. KEY REASONS ===================== */}
      <div className="mb-6 border-t border-slate-100 pt-5">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">
          Key Reasons
        </h4>
        {reasonsList.length > 0 ? (
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {reasonsList.map((reason, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm font-medium leading-snug text-slate-600"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500"
                  strokeWidth={2.25}
                />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400">N/A</p>
        )}
      </div>

      {/* ===================== 4. AI FINAL VERDICT ===================== */}
      <div className="mb-6 rounded-lg border border-slate-200 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-slate-400" strokeWidth={2} />
          <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
            AI Final Recommendation
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-600">
          {final_summary || "N/A"}
        </p>
      </div>

      {/* ===================== 5. INVESTMENT SCORE ===================== */}
      <div className="rounded-lg border border-slate-200 px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
            <Gauge className="h-4 w-4 text-slate-400" strokeWidth={2} />
            Investment Score
          </span>
          <span className={`text-base font-extrabold ${scoreStyle.text}`}>
            {Number.isNaN(scoreValue) ? "N/A" : `${scoreValue} / 100`}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${scoreStyle.bar}`}
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>
    </section>
  );
};

export default FinalVerdict;
