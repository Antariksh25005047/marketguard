import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  OctagonAlert,
  Gauge,
  Star,
  Sparkles,
} from "lucide-react";

/**
 * InvestmentInsights
 * Card #8 of the MarketGuard AI report — bullish factors, watch points,
 * investment horizon, suitable investor profile, a strengths-vs-risks
 * breakdown, an overall investment score, a risk/reward star rating, and
 * an AI-generated investment insight. Sits in the left column directly
 * below TechnicalAnalysis and follows the same static, document-style
 * design language as the other report cards.
 *
 * Props:
 * @param {Object} stock - {
 *   bullish_points,          // array of strings (3-5 items)
 *   watch_points,            // array of strings (3-5 items)
 *   investment_horizon,      // "Short Term" | "Medium Term" | "Long Term"
 *   investor_type,           // "Conservative" | "Moderate" | "Aggressive"
 *   investment_summary,      // 2-3 line AI summary
 *   strengths,               // array of strings
 *   risks,                   // array of strings
 *   investment_score,        // number, 0-100
 *   reward_rating,           // number, 0-5
 *   risk_rating              // number, 0-5
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

/** Normalizes a points prop into a capped array, tolerating undefined. */
const formatPointsList = (points, max) =>
  Array.isArray(points) ? points.filter(Boolean).slice(0, max) : [];

/** Clamps a rating value into the 0-5 range, defaulting missing values to 0. */
const clampRating = (value) => {
  const num = Number(value);
  if (Number.isNaN(num)) return 0;
  return Math.max(0, Math.min(5, Math.round(num)));
};

// ============================================================
// BADGE / COLOR HELPERS
// ============================================================

/** Styling for the Investment Horizon badge — time-based, neutral tones. */
const HORIZON_STYLES = {
  "Short Term": "bg-sky-50 text-sky-700 ring-sky-200",
  "Medium Term": "bg-indigo-50 text-indigo-700 ring-indigo-200",
  "Long Term": "bg-violet-50 text-violet-700 ring-violet-200",
};

const getHorizonStyle = (value) =>
  HORIZON_STYLES[value] || "bg-slate-100 text-slate-500 ring-slate-200";

/** Styling for the Suitable For badge — risk-based tones. */
const INVESTOR_TYPE_STYLES = {
  Conservative: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Moderate: "bg-amber-50 text-amber-700 ring-amber-200",
  Aggressive: "bg-red-50 text-red-700 ring-red-200",
};

const getInvestorTypeStyle = (value) =>
  INVESTOR_TYPE_STYLES[value] || "bg-slate-100 text-slate-500 ring-slate-200";

/**
 * Styling for the Overall Investment Score — text, progress-bar fill, and
 * the number itself are all derived from the same threshold tiers so the
 * whole section stays visually consistent.
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

const InvestmentInsights = ({ stock }) => {
  const {
    bullish_points,
    watch_points,
    investment_horizon,
    investor_type,
    investment_summary,
    strengths,
    risks,
    investment_score,
    reward_rating,
    risk_rating,
  } = stock || {};

  const bullishList = formatPointsList(bullish_points, 5);
  const watchList = formatPointsList(watch_points, 5);
  const strengthsList = formatPointsList(strengths, 4);
  const risksList = formatPointsList(risks, 4);

  const scoreStyle = getScoreStyle(investment_score);
  const scoreValue = Number(investment_score);
  const scorePercent = Number.isNaN(scoreValue)
    ? 0
    : Math.max(0, Math.min(100, scoreValue));

  const rewardStars = clampRating(reward_rating);
  const riskStars = clampRating(risk_rating);

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* ===================== CARD HEADER ===================== */}
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-800">
        8. Investment Insights
      </h3>

      {/* ===================== 1. BULLISH FACTORS ===================== */}
      <div className="mb-2.5">
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
          Bullish Factors
        </p>
        {bullishList.length > 0 ? (
          <ul className="space-y-1">
            {bullishList.map((point, idx) => (
              <li
                key={idx}
                className="flex items-start gap-1.5 text-[11px] font-medium leading-tight text-slate-600"
              >
                <CheckCircle2
                  className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500"
                  strokeWidth={2.25}
                />
                <span className="truncate">{point}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[11px] text-slate-400">N/A</p>
        )}
      </div>

      {/* ===================== 2. WATCH POINTS ===================== */}
      <div className="mb-3">
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
          Watch Points
        </p>
        {watchList.length > 0 ? (
          <ul className="space-y-1">
            {watchList.map((point, idx) => (
              <li
                key={idx}
                className="flex items-start gap-1.5 text-[11px] font-medium leading-tight text-slate-600"
              >
                <AlertTriangle
                  className="mt-0.5 h-3 w-3 shrink-0 text-amber-500"
                  strokeWidth={2.25}
                />
                <span className="truncate">{point}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[11px] text-slate-400">N/A</p>
        )}
      </div>

      {/* ===================== 3 & 4. HORIZON + SUITABLE FOR ===================== */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-center">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Investment Horizon
          </p>
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${getHorizonStyle(
              investment_horizon
            )}`}
          >
            {formatValue(investment_horizon)}
          </span>
        </div>
        <div className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-center">
          <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Suitable For
          </p>
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${getInvestorTypeStyle(
              investor_type
            )}`}
          >
            {formatValue(investor_type)}
          </span>
        </div>
      </div>

      {/* ===================== 6. STRENGTHS VS RISKS ===================== */}
      <div className="mb-3">
        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
          Strengths vs Risks
        </p>
        <div className="grid grid-cols-2 gap-2">
          {/* Strengths column */}
          <div className="rounded-lg border border-slate-200 p-2">
            <div className="mb-1.5 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.25} />
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Strengths
              </span>
            </div>
            {strengthsList.length > 0 ? (
              <ul className="space-y-1">
                {strengthsList.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-1 text-[10px] font-medium leading-tight text-slate-600"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-2.5 w-2.5 shrink-0 text-emerald-500"
                      strokeWidth={2.5}
                    />
                    <span className="truncate">{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[10px] text-slate-400">N/A</p>
            )}
          </div>

          {/* Risks column */}
          <div className="rounded-lg border border-slate-200 p-2">
            <div className="mb-1.5 flex items-center gap-1.5">
              <OctagonAlert className="h-3.5 w-3.5 text-red-500" strokeWidth={2.25} />
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Risks
              </span>
            </div>
            {risksList.length > 0 ? (
              <ul className="space-y-1">
                {risksList.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-1 text-[10px] font-medium leading-tight text-slate-600"
                  >
                    <AlertTriangle
                      className="mt-0.5 h-2.5 w-2.5 shrink-0 text-red-500"
                      strokeWidth={2.5}
                    />
                    <span className="truncate">{point}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[10px] text-slate-400">N/A</p>
            )}
          </div>
        </div>
      </div>

      {/* ===================== 7. OVERALL INVESTMENT SCORE ===================== */}
      <div className="mb-3 rounded-lg border border-slate-200 px-2.5 py-2">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-500">
            <Gauge className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
            Overall Investment Score
          </span>
          <span className={`text-sm font-extrabold ${scoreStyle.text}`}>
            {Number.isNaN(scoreValue) ? "N/A" : `${scoreValue} / 100`}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${scoreStyle.bar}`}
            style={{ width: `${scorePercent}%` }}
          />
        </div>
      </div>

      {/* ===================== 8. RISK VS REWARD ===================== */}
      <div className="mb-3 space-y-1.5 rounded-lg border border-slate-200 px-2.5 py-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">
            Reward Potential
          </span>
          <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`h-3 w-3 ${
                  idx < rewardStars
                    ? "fill-emerald-500 text-emerald-500"
                    : "fill-transparent text-slate-300"
                }`}
                strokeWidth={2}
              />
            ))}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500">
            Risk Level
          </span>
          <span className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`h-3 w-3 ${
                  idx < riskStars
                    ? "fill-red-500 text-red-500"
                    : "fill-transparent text-slate-300"
                }`}
                strokeWidth={2}
              />
            ))}
          </span>
        </div>
      </div>

      {/* ===================== 9. AI INVESTMENT INSIGHT ===================== */}
      <div className="rounded-lg border border-slate-200 p-3">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            AI Investment Insight
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600">
          {investment_summary || "N/A"}
        </p>
      </div>
    </section>
  );
};

export default InvestmentInsights;
