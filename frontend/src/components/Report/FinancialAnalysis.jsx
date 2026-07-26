import React from "react";
import { Users, Building2, ListChecks, Sparkles } from "lucide-react";

/**
 * FinancialAnalysis
 * Card #6 of the MarketGuard AI report — key financial metrics, ownership
 * split, financial-health status badges, and an AI-generated summary.
 * Sits in the right column directly below PriceAnalysis and follows the
 * same static, document-style design language as the other report cards.
 *
 * Props:
 * @param {Object} stock - {
 *   market_cap, revenue, net_profit, eps, pe_ratio, dividend_yield,
 *   roe, roce,
 *   promoter_holding, institutional_holding,
 *   revenue_growth, profitability, debt_level,
 *   financial_summary
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

/** Percentage formatter — appends "%" to numeric values only. */
const formatPercent = (value) => {
  if (value === undefined || value === null || value === "") return "N/A";
  const num = Number(value);
  if (Number.isNaN(num)) return value; // already-formatted string (e.g. "21.18%")
  return `${num.toFixed(2)}%`;
};

// ============================================================
// COLOR HELPERS
// ============================================================

/**
 * Maps a financial-health field + its qualitative value to a badge style.
 * Each field has its own vocabulary since "High" is good for growth but
 * bad for debt, so the mapping is scoped per field rather than global.
 */
const HEALTH_STATUS_MAP = {
  revenue_growth: {
    Strong: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Moderate: "bg-amber-50 text-amber-700 ring-amber-200",
    Weak: "bg-red-50 text-red-700 ring-red-200",
  },
  profitability: {
    Healthy: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Average: "bg-amber-50 text-amber-700 ring-amber-200",
    Poor: "bg-red-50 text-red-700 ring-red-200",
  },
  debt_level: {
    Low: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    Moderate: "bg-amber-50 text-amber-700 ring-amber-200",
    High: "bg-red-50 text-red-700 ring-red-200",
  },
};

const getHealthStatusStyle = (field, value) => {
  const fallback = "bg-slate-100 text-slate-500 ring-slate-200";
  if (!value) return fallback;
  return HEALTH_STATUS_MAP[field]?.[value] || fallback;
};

const FinancialAnalysis = ({ stock }) => {
  const {
    market_cap,
    revenue,
    net_profit,
    eps,
    pe_ratio,
    dividend_yield,
    roe,
    roce,
    promoter_holding,
    institutional_holding,
    revenue_growth,
    profitability,
    debt_level,
    financial_summary,
  } = stock || {};

  // Metrics assembled from props for the 2-column grid.
  const metrics = [
    { label: "Market Cap", value: formatValue(market_cap) },
    { label: "Revenue", value: formatValue(revenue) },
    { label: "Net Profit", value: formatValue(net_profit) },
    { label: "EPS", value: formatValue(eps) },
    { label: "P/E Ratio", value: formatValue(pe_ratio) },
    { label: "Dividend Yield", value: formatPercent(dividend_yield) },
    { label: "ROE", value: formatPercent(roe) },
    { label: "ROCE", value: formatPercent(roce) },
  ];

  // Financial-health status badges assembled from props.
  const healthStatuses = [
    { field: "revenue_growth", label: "Revenue Growth", value: revenue_growth },
    { field: "profitability", label: "Profitability", value: profitability },
    { field: "debt_level", label: "Debt Level", value: debt_level },
  ];

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* ===================== CARD HEADER ===================== */}
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-800">
        6. Financial Analysis
      </h3>

      {/* ===================== 1. FINANCIAL METRICS ===================== */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        {metrics.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5"
          >
            <span className="truncate text-[10px] font-medium uppercase tracking-wide text-slate-400">
              {label}
            </span>
            <span className="shrink-0 text-xs font-bold text-slate-900">
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* ===================== 2. OWNERSHIP ===================== */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-center">
          <div className="mb-0.5 flex items-center justify-center gap-1 text-slate-400">
            <Building2 className="h-3 w-3" strokeWidth={2} />
            <span className="text-[10px] font-medium uppercase tracking-wide">
              Promoter Holding
            </span>
          </div>
          <p className="text-sm font-extrabold text-slate-900">
            {formatPercent(promoter_holding)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-center">
          <div className="mb-0.5 flex items-center justify-center gap-1 text-slate-400">
            <Users className="h-3 w-3" strokeWidth={2} />
            <span className="text-[10px] font-medium uppercase tracking-wide">
              Institutional Holding
            </span>
          </div>
          <p className="text-sm font-extrabold text-slate-900">
            {formatPercent(institutional_holding)}
          </p>
        </div>
      </div>

      {/* ===================== 3. FINANCIAL HEALTH ===================== */}
      <div className="mb-3">
        <div className="mb-1.5 flex items-center gap-1.5">
          <ListChecks className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Financial Health
          </span>
        </div>
        <div className="space-y-1">
          {healthStatuses.map(({ field, label, value }) => (
            <div key={field} className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500">
                {label}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${getHealthStatusStyle(
                  field,
                  value
                )}`}
              >
                {formatValue(value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== 4. AI FINANCIAL SUMMARY ===================== */}
      <div className="rounded-lg bg-slate-50 p-2.5">
        <div className="mb-1 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Financial Health Summary
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600">
          {financial_summary || "N/A"}
        </p>
      </div>
    </section>
  );
};

export default FinancialAnalysis;
