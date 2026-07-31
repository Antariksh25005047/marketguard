import React from "react";
import { Newspaper, Clock, ListChecks, Sparkles } from "lucide-react";

/**
 * NewsSummary
 * Card #7 of the MarketGuard AI report — overall news sentiment, recent
 * headlines, key highlights, and an AI-generated news summary. Sits in the
 * right column directly below FinancialAnalysis and follows the same
 * static, document-style design language as the other report cards.
 *
 * Props:
 * @param {Object} stock - {
 *   overall_sentiment,        // "Positive" | "Neutral" | "Negative"
 *   sentiment_confidence,     // number, e.g. 88
 *   news: [{ headline, source, published, sentiment }],
 *   highlights,                // array of strings (3-5 items)
 *   news_summary                // 2-3 line AI summary
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

/** Confidence formatter — appends "%" to numeric values only. */
const formatConfidence = (value) => {
  if (value === undefined || value === null || value === "") return "N/A";
  const num = Number(value);
  if (Number.isNaN(num)) return value;
  return `${num}%`;
};

// ============================================================
// SENTIMENT COLOR HELPERS
// ============================================================

/** Badge classes + dot color for a given sentiment value. */
const SENTIMENT_STYLES = {
  Positive: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  Neutral: {
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  Negative: {
    badge: "bg-red-50 text-red-700 ring-red-200",
    dot: "bg-red-500",
  },
};

const getSentimentStyle = (sentiment) =>
  SENTIMENT_STYLES[sentiment] || {
    badge: "bg-slate-100 text-slate-500 ring-slate-200",
    dot: "bg-slate-400",
  };

const NewsSummary = ({ stock }) => {
  const newsData = stock?.newsAnalysis || {};

  const {
    overallSentiment,
    sentimentConfidence,
    news = [],
    highlights = [],
    summary,
    } = newsData;

  const overallStyle = getSentimentStyle(overallSentiment);

  return (
    <section className="w-full rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* ===================== CARD HEADER ===================== */}
      <h3 className="mb-2.5 text-xs font-bold uppercase tracking-wide text-slate-800">
        7. News Summary
      </h3>

      {/* ===================== 1. NEWS SENTIMENT ===================== */}
      <div className="mb-3 flex items-center justify-between rounded-lg border border-slate-200 px-2.5 py-1.5">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Overall News Sentiment
          </p>
          <div
            className={`mt-0.5 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-bold ring-1 ring-inset ${overallStyle.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${overallStyle.dot}`} />
            {formatValue(overallSentiment)}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            Confidence
          </p>
          <p className="text-sm font-extrabold text-slate-900">
            {formatConfidence(sentimentConfidence)}
          </p>
        </div>
      </div>

      {/* ===================== 2. RECENT HEADLINES ===================== */}
      <div className="mb-3">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Newspaper className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            Recent Headlines
          </span>
        </div>
        <div className="space-y-1.5">
          {news.length > 0 ? (
            news.slice(0, 8).map((item, idx) => {
              const itemStyle = getSentimentStyle(item?.sentiment);
              return (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5"
                >
                  <p className="line-clamp-1 text-[11px] font-semibold leading-tight text-slate-800">
                    {formatValue(item?.headline)}
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="truncate text-[10px] text-slate-400">
                      {formatValue(item?.source)} ·{" "}
                      <Clock className="mb-0.5 inline h-2.5 w-2.5" strokeWidth={2} />{" "}
                      {formatValue(item?.published)}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ring-1 ring-inset ${itemStyle.badge}`}
                    >
                      {formatValue(item?.sentiment)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-[11px] text-slate-400">N/A</p>
          )}
        </div>
      </div>

      {/* ===================== 3. KEY HIGHLIGHTS ===================== */}
      {highlights.length > 0 && (
        <div className="mb-3">
          <div className="mb-1.5 flex items-center gap-1.5">
            <ListChecks className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
            <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
              Key Highlights
            </span>
          </div>
          <ul className="space-y-2">
            {highlights.slice(0, 8).map((point, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-[12px] font-medium leading-relaxed text-slate-600"
              >
                <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ===================== 4. AI NEWS SUMMARY ===================== */}
      <div className="rounded-lg bg-slate-50 p-2.5">
        <div className="mb-1 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-slate-400" strokeWidth={2} />
          <span className="text-[11px] font-bold uppercase tracking-wide text-slate-500">
            AI News Analysis
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600">
          {summary || "N/A"}
        </p>
      </div>
    </section>
  );
};

export default NewsSummary;
