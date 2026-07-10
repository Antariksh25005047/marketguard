import React, { useEffect, useState, useCallback } from "react";
import { Newspaper, ChevronRight, RefreshCw } from "lucide-react";

const NEWS_LIMIT = 5;

/**
 * Converts an ISO timestamp into a short relative-time string,
 * e.g. "15 min ago", "3 hours ago", "2 days ago".
 */
function formatTimeAgo(dateInput) {
  const publishedDate = new Date(dateInput);
  if (Number.isNaN(publishedDate.getTime())) return "";

  const diffMs = Date.now() - publishedDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return publishedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getRisk(score = 0) {
  if (score >= 50) {
    return {
      label: "Suspicious",
      color: "text-red-400",
      bg: "bg-red-500/10 border border-red-500/30",
    };
  }
  

  if (score >= 25) {
    return {
      label: "Moderate",
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border border-yellow-500/30",
    };
  }

  return {
    label: "Safe",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border border-emerald-500/30",
  };
}

function getInsight(score = 0) {
  if (score >= 50)
    return "High manipulation probability. Verify from multiple trusted sources.";

  if (score >= 25)
    return "Some unusual activity detected. Trade with caution.";

  return "Normal market sentiment. No unusual hype detected.";
}

/**
 * Minimal row skeleton shown while news is loading.
 */
function NewsRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-4 w-4 shrink-0 animate-pulse rounded bg-white/10" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-4/5 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-white/5" />
      </div>
    </div>
  );
}

/**
 * StockNews
 * Compact, list-style news feed for the currently selected stock.
 * Designed to sit inside the Stock Analysis page — minimal, dense,
 * TradingView/Bloomberg-style, no thumbnails, no motion effects.
 *
 * Props:
 *  - symbol: string — the currently selected stock ticker (e.g. "AAPL")
 */
export default function StockNews({ symbol }) {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'

  const fetchStockNews = useCallback(async () => {
    if (!symbol) return;

    setStatus("loading");
    try {
      const response = await fetch(
        `/api/news?symbol=${encodeURIComponent(symbol)}`
        );
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

      const data = await response.json();
      const items = Array.isArray(data) ? data : data.articles || [];

      setArticles(items.slice(0, NEWS_LIMIT));
      setStatus("success");
    } catch (err) {
      console.error("Failed to fetch stock news:", err);
      setStatus("error");
    }
  }, [symbol]);

  useEffect(() => {
    fetchStockNews();
  }, [fetchStockNews]);

  return (
    <div className="w-full rounded-xl border border-white/10 bg-white/[0.02]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
        <h3 className="text-sm font-semibold text-white">
            Latest {symbol} News
        </h3>
        <p className="mt-1 text-xs text-white/45">
            AI-filtered news with pump-risk analysis
        </p>
        </div>
        {/* <button
          onClick={() => {
            window.location.href = symbol ? `/news?symbol=${symbol}` : "/news";
          }}
          className="text-xs font-medium text-emerald-400 hover:text-emerald-300"
        >
          View All
        </button> */}
      </div>

      {/* Loading */}
      {status === "loading" && (
        <div className="divide-y divide-white/5">
          {Array.from({ length: NEWS_LIMIT }).map((_, i) => (
            <NewsRowSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
          <p className="text-xs text-white/40">Couldn't load news for {symbol}.</p>
          <button
            onClick={fetchStockNews}
            className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-1.5 text-xs font-medium text-white/70 hover:bg-white/5"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      )}

      {/* Empty */}
      {status === "success" && articles.length === 0 && (
        <div className="px-4 py-8 text-center text-xs text-white/40">
          No recent news for {symbol}.
        </div>
      )}

      {/* List */}
      {status === "success" && articles.length > 0 && (
        <ul className="divide-y divide-white/5">
          {articles.map((article, index) => {
             const risk = getRisk(article.pump_score);
             return (
            <li key={article.id ?? article.url ?? index}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                 <Newspaper className="h-4 w-4 text-emerald-400" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white/85">{article.title}</p>
                  <div className="mt-1 flex items-center gap-2 flex-wrap text-xs">
                    <p className="mt-2 text-xs text-white/50">
                    💡 AI Insight: {getInsight(article.pump_score)}
                    </p>
                    <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-white/60">
  {article.source}
</span>

<span
  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${risk.bg} ${risk.color}`}
>
  {risk.label}
</span>

<span className="text-white/40">
  {formatTimeAgo(article.published_at)}
</span>
                    {/* <span className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-white/60">
                      {article.source}
                    </span>
                    <span>{formatTimeAgo(article.publishedAt)}</span> */}
                  </div>
                </div>

                {/* <ChevronRight className="h-4 w-4 shrink-0 text-white/30" /> */}
              </a>
            </li>
             );
        })}
        </ul>
      )}
    </div>
  );
}
