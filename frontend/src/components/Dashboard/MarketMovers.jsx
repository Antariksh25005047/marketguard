import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, TrendingDown, ArrowRight, AlertCircle } from "lucide-react";

const MarketMovers = () => {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovers = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await fetch("http://127.0.0.1:8000/api/stocks/movers");
        if (!response.ok) {
          throw new Error("Failed to fetch market movers");
        }
        const data = await response.json();
        setGainers(data.gainers || []);
        setLosers(data.losers || []);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMovers();
  }, []);

  const handleViewAnalysis = (symbol) => {
  navigate(`/stock-analysis/${symbol}`);
  };

  const SkeletonCard = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-white/10 rounded"></div>
              <div className="h-3 w-20 bg-white/10 rounded"></div>
            </div>
            <div className="h-8 w-8 bg-white/10 rounded-full"></div>
          </div>
          <div className="h-3 w-full bg-white/10 rounded mb-2"></div>
          <div className="h-3 w-3/4 bg-white/10 rounded mb-2"></div>
          <div className="h-3 w-1/2 bg-white/10 rounded"></div>
        </div>
      ))}
    </div>
  );

  const StockCard = ({ stock, type }) => {
    const isGainer = type === "gainer";
    // const accentColor = isGainer ? "emerald" : "red";

    return (

        <div
        className={`group relative rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-4 transition-all duration-300 ${
    isGainer
        ? "hover:border-emerald-400/30"
        : "hover:border-red-400/30"
        }`}
            >
        <div
          className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
            isGainer
              ? "bg-gradient-to-br from-emerald-500/5 to-transparent"
              : "bg-gradient-to-br from-red-500/5 to-transparent"
          }`}
        ></div>

        <div className="relative flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold text-base leading-tight">
              {stock.companyName}
            </h3>
            <p className="text-slate-400 text-sm mt-0.5">{stock.symbol}</p>
          </div>
          {/* <div
            className={`flex items-center justify-center h-10 w-10 rounded-full ${
              isGainer
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {isGainer ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
          </div> */}
        </div>

        <div className="relative flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-white">
            ₹{stock.price?.toFixed(2)}
          </span>
          <span
            className={`text-sm font-semibold px-2.5 py-1 rounded-lg ${
              isGainer
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {stock.change > 0 ? "+" : ""}
            {stock.change?.toFixed(2)}%
          </span>
        </div>

        <div className="mt-3">
    <p className="text-xs uppercase text-white/40">
        🔥 Why Trending
    </p>

    <p className="mt-1 text-sm text-white/80 line-clamp-2">
        {stock.reason}
    </p>

    <p className="mt-2 text-xs text-white/40">
        Source: {stock.source}
    </p>
    </div>
        <button
          onClick={() => handleViewAnalysis(stock.symbol)}
          className={`mt-4 inline-flex items-center gap-2 text-sm font-medium ${
        isGainer
        ? "text-emerald-400 hover:text-emerald-300"
        : "text-red-400 hover:text-red-300"
        }`}
        >
          View Analysis
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
      </div>
    );
  };

  return (
    <section className="w-full py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Market Movers & Shakers
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-1.5">
            Stocks making the biggest moves today.
          </p>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl py-16 px-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <p className="text-slate-300 font-medium">
              Unable to load market movers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Gainers */}
            <div className="rounded-2xl border border-white/10 bg-[#0F1115] p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div>

                <h3 className="text-lg font-semibold text-white">
                    Top Gainers
                </h3>
                </div>
              {/* <div className="flex items-center gap-2 mb-5">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                </div> */}

                {/* <h3 className="text-lg font-semibold text-white">
                    Top Gainers
                </h3>
              </div> */}

              {loading ? (
                <SkeletonCard />
              ) : gainers.length === 0 ? (
                <p className="text-slate-400 text-sm">No gainers to show.</p>
              ) : (
                <div className="space-y-3">
                  {gainers.slice(0, 4).map((stock) => (
                    <StockCard key={stock.symbol} stock={stock} type="gainer" />
                    ))}
                </div>
              )}
            </div>

            {/* Top Losers */}
            <div className="rounded-2xl border border-white/10 bg-[#0F1115] p-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="h-9 w-9 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <TrendingDown className="h-5 w-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Top Losers
                </h3>
              </div>

              {loading ? (
                <SkeletonCard />
              ) : losers.length === 0 ? (
                <p className="text-slate-400 text-sm">No losers to show.</p>
              ) : (
                <div className="space-y-3">
                  {losers.slice(0, 4).map((stock) => (
                    <StockCard key={stock.symbol} stock={stock} type="loser" />
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MarketMovers;