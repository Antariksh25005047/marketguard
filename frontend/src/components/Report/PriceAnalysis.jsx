import StockChart from "../StockAnalysis/StockChart";
import React from "react";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  ArrowUpToLine,
  ArrowDownToLine,
  CalendarRange,
} from "lucide-react";

/**
 * PriceAnalysis
 * Card #2 of the MarketGuard AI report — current market data, price range,
 * and trailing performance, presented in an equity-research exhibit style.
 *
 * Props:
 * @param {Object} stock - {
 *   current_price, previous_close, today_change, today_change_percent,
 *   day_high, day_low, week52_high, week52_low,
 *   one_month_return, six_month_return, one_year_return
 * }
 */

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

const formatSignedCurrency = (value) => {
  if (value === undefined || value === null || value === "") return "N/A";
  const num = Number(value);
  if (Number.isNaN(num)) return "N/A";
  const sign = num > 0 ? "+" : num < 0 ? "-" : "";
  return `${sign}₹${Math.abs(num).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatPercent = (value) => {
  if (value === undefined || value === null || value === "") return "N/A";
  const num = Number(value);
  if (Number.isNaN(num)) return "N/A";
  const sign = num > 0 ? "+" : "";
  return `${sign}${num.toFixed(2)}%`;
};

// ---------- color / icon helpers ----------
const getToneClass = (value) => {
  const num = Number(value);
  if (Number.isNaN(num) || num === 0) return "text-slate-600";
  return num > 0 ? "text-emerald-600" : "text-red-600";
};

const getTrendIcon = (value) => {
  const num = Number(value);
  if (Number.isNaN(num) || num === 0) return Minus;
  return num > 0 ? TrendingUp : TrendingDown;
};

const PriceAnalysis = ({ stock }) => {
  const {
  price,
  previousClose,
  dayHigh,
  dayLow,
  high52w,
  low52w,
  oneMonthReturn,
  sixMonthReturn,
  oneYearReturn,
} = stock || {};
const todayChange =
  price && previousClose
    ? price - previousClose
    : 0;

const todayChangePercent =
  price && previousClose
    ? ((price - previousClose) / previousClose) * 100
    : 0;

  const ChangeTrendIcon = getTrendIcon(todayChange);
  const changeTone = getToneClass(todayChange);

  const rangeFields = [
  { icon: ArrowUpToLine, label: "Day High", value: formatCurrency(dayHigh) },
  { icon: ArrowDownToLine, label: "Day Low", value: formatCurrency(dayLow) },
  {
    icon: CalendarRange,
    label: "52 Week High",
    value: formatCurrency(high52w),
  },
  {
    icon: CalendarRange,
    label: "52 Week Low",
    value: formatCurrency(low52w),
  },
];

  const performanceFields = [
  { label: "1 Month Return", value: oneMonthReturn },
  { label: "6 Month Return", value: sixMonthReturn },
  { label: "1 Year Return", value: oneYearReturn },
];

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* ===================== CARD HEADER ===================== */}
      <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-800">
        2. Price Analysis
      </h3>

      {/* ===================== 1. CURRENT MARKET DATA ===================== */}
      <div className="mb-6 border-b border-slate-100 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-slate-400" strokeWidth={2} />
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Current Price
              </span>
            </div>
            <p className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {formatCurrency(price)}
            </p>
          </div>

          <div className={`flex items-center gap-2 ${changeTone}`}>
            <ChangeTrendIcon className="h-5 w-5" strokeWidth={2.25} />
            <span className="text-base font-bold sm:text-lg">
              {formatSignedCurrency(todayChange)}
            </span>
            <span className="text-base font-bold sm:text-lg">
              ({formatPercent(todayChangePercent)})
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2.5">
          <Clock className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
          <span className="text-sm font-medium text-slate-500">
            Previous Close
          </span>
          <span className="text-sm font-bold text-slate-900">
            {formatCurrency(previousClose)}
          </span>
        </div>
      </div>

      {/* ===================== 2. PRICE RANGE ===================== */}
      <div className="mb-6 border-b border-slate-100 pb-6">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500">
          Price Range
        </h4>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {rangeFields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-lg border border-slate-200 p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <Icon className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
                <span className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  {label}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 sm:text-base">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== 3. PERFORMANCE ===================== */}
      <div className="mb-6">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500">
          Performance
        </h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {performanceFields.map(({ label, value }) => {
            const TrendIcon = getTrendIcon(value);
            const tone = getToneClass(value);
            return (
              <div
                key={label}
                className="rounded-lg border border-slate-200 p-4"
              >
                <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  {label}
                </p>
                <div className={`flex items-center gap-1.5 ${tone}`}>
                  <TrendIcon className="h-4 w-4" strokeWidth={2.25} />
                  <span className="text-lg font-extrabold">
                    {formatPercent(value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================== 4. PRICE CHART SECTION ===================== */}
      <div>
        <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-500">
          Price Chart
        </h4>
        <StockChart
        symbol={stock.symbol}
        basePrice={price}
        spikeAnalysis={stock.spikeAnalysis}
        height={130}
        />
      </div>
    </section>
  );
};

export default PriceAnalysis;
