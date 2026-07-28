import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Gauge,
  Target,
  Percent,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

/**
 * AIRecommendation
 * Card #3 of the MarketGuard AI report — compact AI verdict panel intended
 * to sit beside FinancialAnalysis in a 2-column layout (~280-320px tall).
 *
 * Props:
 * @param {Object} stock - {
 *   recommendation, confidence, target_price, current_price,
 *   upside_percent, risk_level, ai_summary
 * }
 */

// ---------- recommendation styling ----------
const RECOMMENDATION_STYLES = {
  BUY: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: TrendingUp,
  },
  HOLD: {
    badge: "bg-yellow-50 text-yellow-700 ring-yellow-200",
    icon: Minus,
  },
  SELL: {
    badge: "bg-red-50 text-red-700 ring-red-200",
    icon: TrendingDown,
  },
};

// ---------- risk level styling ----------
const RISK_STYLES = {
  Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Medium: "bg-amber-50 text-amber-700 ring-amber-200",
  High: "bg-red-50 text-red-700 ring-red-200",
};

// ---------- formatting helpers ----------
const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") return "N/A";
  const num = Number(value);
  if (Number.isNaN(num)) return "N/A";
  return `₹${num.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatPercent = (value) => {
  if (value === undefined || value === null || value === "") return "N/A";
  const num = Number(value);
  if (Number.isNaN(num)) return "N/A";
  const sign = num > 0 ? "+" : "";
  return `${sign}${num.toFixed(1)}%`;
};

// Accepts an array of strings, or falls back to splitting a plain string.
const getReasoningPoints = (ai_summary) => {
  if (Array.isArray(ai_summary)) return ai_summary.slice(0, 4);
  if (typeof ai_summary === "string" && ai_summary.trim().length > 0) {
    return ai_summary
      .split(/\n|(?<=[.])\s+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4);
  }
  return [];
};

const AIRecommendation = ({ stock }) => {
  const ai = stock?.aiAnalysis || {};

  const {
   recommendation = "HOLD",
   aiScore,
   targetPrice,
   currentPrice,
   risk = "Medium",
   summary = [],
  } = ai;
  const upsidePercent =
    currentPrice && targetPrice
      ? ((targetPrice - currentPrice) / currentPrice) * 100
      : 0;

  const recStyle =
    RECOMMENDATION_STYLES[recommendation] || RECOMMENDATION_STYLES.HOLD;
  const RecIcon = recStyle.icon;
  const riskStyle = RISK_STYLES[risk] || RISK_STYLES.Medium;
  const reasoningPoints = Array.isArray(summary)
  ? summary
  : getReasoningPoints(summary);

  return (
    <section className="flex h-full max-h-[320px] min-h-[280px] w-full flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* ===================== CARD HEADER ===================== */}
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-800">
        3. AI Recommendation
      </h3>

      {/* ===================== RECOMMENDATION BADGE ===================== */}
      <div
        className={`mb-3 flex items-center justify-center gap-1.5 rounded-lg py-2 text-base font-extrabold ring-1 ring-inset ${recStyle.badge}`}
      >
        <RecIcon className="h-4 w-4" strokeWidth={2.5} />
        {recommendation}
      </div>

      {/* ===================== STAT CARDS ===================== */}
      <div className="mb-3 grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-slate-200 px-2 py-1.5 text-center">
          <div className="mb-0.5 flex items-center justify-center gap-1">
            <Gauge className="h-3 w-3 text-slate-400" strokeWidth={2} />
            <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
              Confidence
            </span>
          </div>
          <p className="text-sm font-extrabold text-slate-900">
            {aiScore !== undefined ? `${aiScore}%` : "N/A"}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 px-2 py-1.5 text-center">
          <div className="mb-0.5 flex items-center justify-center gap-1">
            <Target className="h-3 w-3 text-slate-400" strokeWidth={2} />
            <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
              Target
            </span>
          </div>
          <p className="text-sm font-extrabold text-slate-900">
            {formatCurrency(targetPrice)}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 px-2 py-1.5 text-center">
          <div className="mb-0.5 flex items-center justify-center gap-1">
            <Percent className="h-3 w-3 text-slate-400" strokeWidth={2} />
            <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
              Upside
            </span>
          </div>
          <p className="text-sm font-extrabold text-emerald-600">
            {formatPercent(upsidePercent)}
          </p>
        </div>
      </div>

      {/* ===================== RISK LEVEL ===================== */}
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <ShieldAlert className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
          Risk Level
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ring-inset ${riskStyle}`}
        >
          {risk}
        </span>
      </div>

      {/* ===================== AI REASONING ===================== */}
      <div className="flex-1 border-t border-slate-100 pt-2.5">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            AI Reasoning
          </span>
        </div>
        <ul className="space-y-1">
          {reasoningPoints.map((point, idx) => (
            <li
              key={idx}
              className="flex items-start gap-1.5 text-[11px] font-medium leading-tight text-slate-600"
            >
              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
              <span className="truncate">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AIRecommendation;
