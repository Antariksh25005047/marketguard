// import NewsCard from "./NewsCard";
import React, { useEffect, useState, useCallback } from "react";
// import { motion } from "framer-motion";
import { Newspaper, RefreshCw, ArrowRight } from "lucide-react";
// import NewsCard from "./NewsCard";

function formatTimeAgo(dateInput) {
  const publishedDate = new Date(dateInput);

  const diffMs = Date.now() - publishedDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

const NEWS_ENDPOINT = "/api/news/market";
const SKELETON_COUNT = 6;

/**
 * Loading skeleton — mirrors the shape of a real MarketNewsCard so the
 * layout doesn't jump once data arrives.
 */
function NewsCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
      <div className="h-44 w-full animate-pulse bg-white/5" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="h-4 w-5/6 animate-pulse rounded bg-white/10" />
        <div className="h-4 w-3/5 animate-pulse rounded bg-white/10" />
        <div className="space-y-2 pt-1">
          <div className="h-3 w-full animate-pulse rounded bg-white/5" />
          <div className="h-3 w-full animate-pulse rounded bg-white/5" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="h-3 w-20 animate-pulse rounded bg-white/5" />
          <div className="h-3 w-16 animate-pulse rounded bg-white/5" />
        </div>
        <div className="mt-3 h-9 w-full animate-pulse rounded-lg bg-white/5" />
      </div>
    </div>
  );
}

/**
 * Empty state — shown when the API responds successfully but with no articles.
 */
function EmptyState() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center backdrop-blur-xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
        <Newspaper className="h-5 w-5 text-emerald-400" />
      </div>
      <p className="text-sm font-medium text-white/70">No market news right now</p>
      <p className="max-w-sm text-xs text-white/40">
        New articles are published throughout the trading day — check back shortly.
      </p>
    </div>
  );
}

/**
 * Error state — shown when the fetch fails. Offers a retry action.
 */
function ErrorState({ onRetry }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/[0.04] px-6 py-16 text-center backdrop-blur-xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
        <RefreshCw className="h-5 w-5 text-red-400" />
      </div>
      <p className="text-sm font-medium text-white/70">Couldn't load market news</p>
      <p className="max-w-sm text-xs text-white/40">
        Something went wrong while reaching the news service. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="mt-2 flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-medium text-emerald-400 transition-all duration-300 hover:border-emerald-500/60 hover:bg-emerald-500/20 hover:text-emerald-300"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </button>
    </div>
  );
}

/**
 * MarketNews
 * Dashboard section that fetches and displays the latest market news.
 * Sits below the Market Overview cards and above the Footer.
 */
export default function MarketNews() {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'

  const fetchNews = useCallback(async () => {
    setStatus("loading");
    try {
      const response = await fetch(NEWS_ENDPOINT);
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      const data = await response.json();
      console.log("NEWS RESPONSE:", data);
      // Support either a raw array or a { articles: [...] } envelope.
      const items = Array.isArray(data) ? data : data.articles || [];
      console.log("ITEMS:", items);

      setArticles(items);
      setStatus("success");
    } catch (err) {
      console.error("Failed to fetch market news:", err);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  return (
    <section className="w-full mt-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            {/* <h2 className="text-xl font-semibold text-white">
              Latest Market News
            </h2> */}
            <p className="mt-1 text-sm text-gray-400">
              Stay updated with the latest financial and stock market developments.
            </p>
          </div>

          <button
            onClick={() => {
              // Wire this up to your news/listing route, e.g. navigate('/news')
              window.location.href = "/news";
            }}
            className="group flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10
                       bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/70 backdrop-blur-md
                       transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-500/10
                       hover:text-emerald-400"
          >
            View All News
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Content grid */}
        <div className="space-y-4">
          {status === "loading" &&
            Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}

          {status === "error" && <ErrorState onRetry={fetchNews} />}

          {status === "success" && articles.length === 0 && <EmptyState />}

          {/* {status === "success" &&
            articles.length > 0 &&
            articles
              .slice(0, 4)
              .map((article, index) => (
                <NewsCard
                  key={article.id ?? article.url ?? index}
                  article={article}
                  index={index}
                />
              ))} */}
              <div className="rounded-xl border border-white/10 bg-[#111111] divide-y divide-white/10">

  {articles.slice(0,6).map((article,index)=>(
    <a
      key={article.id ?? index}
      href={article.url}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-all duration-200"
    >

      <div className="flex items-start gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
        <Newspaper className="h-5 w-5 text-emerald-400" />
        </div>

        <div>
          <p className="font-medium text-white line-clamp-2">
            {article.title}
          </p>

          <div className="mt-2 flex items-center gap-2">
  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
    {article.source}
  </span>

  <span className="text-xs text-gray-500">
    {formatTimeAgo(article.publishedAt)}
  </span>
</div>
        </div>

      </div>

      <ArrowRight
  size={18}
  className="text-gray-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-emerald-400"
/>

    </a>
  ))}

</div>
        </div>
      </div>
    </section>
  );
}
