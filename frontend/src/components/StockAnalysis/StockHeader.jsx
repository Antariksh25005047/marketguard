import React from "react";

/**
 * StockHeader.jsx
 * MarketGuard AI — Stock Analysis Page header.
 *
 * Scope: company identity, price, daily change, and three glass stat cards
 * (Market Cap / Volume / 52W High). No charts, no AI analysis, no news,
 * no metrics grid — those live elsewhere on the page.
 */

function TrendUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 15.5l5.5-6 4 3.2L20 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 6H20v5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrendDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M4 8.5l5.5 6 4-3.2L20 18" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 18H20v-5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      className="
        group relative shrink-0 rounded-2xl px-5 py-3.5
        backdrop-blur-xl transition-all duration-300 ease-out
        hover:-translate-y-1
      "
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow =
          "0 12px 32px -8px rgba(34,197,94,0.45), 0 0 0 1px rgba(34,197,94,0.25)";
        e.currentTarget.style.borderColor = "rgba(34,197,94,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
      }}
    >
      <div className="whitespace-nowrap text-[11.5px] font-medium tracking-wide text-gray-400">
        {label}
      </div>
      <div className="mt-1 whitespace-nowrap text-[20px] font-bold leading-none text-white">
        {value}
      </div>
    </div>
  );
}

export default function StockHeader({ stock, onAddWatchlist }) {
  const companyName = stock?.companyName || "Unknown Company";
  const ticker = stock?.symbol || "N/A";
  const price = stock?.price || 0;

  const previousClose = stock?.previousClose || 0;

  const changePercent =
  previousClose !== 0
    ? ((price - previousClose) / previousClose) * 100
    : 0;

  const marketCap = stock?.marketCap?.toLocaleString() || "-";
  const volume = stock?.volume?.toLocaleString() || "-";
  const high52w = stock?.high52w || "-";
  const isIndianStock =
  ticker.endsWith(".NS") || ticker.endsWith(".BO");
  // companyName = "Tesla Inc.",
  // ticker = "TSLA",
  // price = 256.4,
  // changePercent = 2.4,
  // marketCap = "$820B",
  // volume = "48.2M",
  // high52w = "$299.29",
//}) {
  const isPositive = changePercent >= 0;
  const changeColor = isPositive ? "#4ade80" : "#ef4444";
  console.log("StockHeader received:", stock);
  console.log("Ticker:", ticker);
  console.log("Price:", price);
  console.log("isIndianStock:", isIndianStock);

  return (
    <header
      className="w-full rounded-2xl px-6 py-6 sm:px-8 sm:py-7"
      style={{
        background: "#050505",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* <h1 style={{ color: "red", fontSize: "50px" }}>
        TEST HEADER
      </h1> */}
      <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        {/* ----------------------------- LEFT: identity + price ----------------------------- */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-[22px] font-bold leading-tight text-white sm:text-[26px]">
              {companyName}
            </h1>
            <span
              className="rounded-md px-2 py-0.5 text-[12.5px] font-semibold tracking-wide"
              style={{
                color: "#4ade80",
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.25)",
              }}
            >
              {ticker}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-end gap-3">
  <span className="text-[36px] font-extrabold leading-none tracking-tight text-white sm:text-[42px]">
    {isIndianStock ? "₹" : "$"}
    {price.toFixed(2)}
  </span>

  <span
    className="flex items-center gap-1 pb-1 text-[15px] font-semibold sm:text-[16px]"
    style={{ color: changeColor }}
  >
    {isPositive ? (
      <TrendUpIcon className="h-4 w-4" />
    ) : (
      <TrendDownIcon className="h-4 w-4" />
    )}
    {isPositive ? "+" : ""}
    {changePercent.toFixed(1)}%
  </span>
</div>

{/* ⭐ Button yahan hoga */}
{/* <div className="mt-5">
  <button
    onClick={() => {
      console.log("BUTTON CLICKED");
      onAddWatchlist();
    }}
    className="rounded-lg bg-green-500 px-4 py-2 text-black font-semibold hover:bg-green-400"
  >
    ⭐ Add to Watchlist
  </button>
</div> */}
        </div>

        {/* ----------------------------- RIGHT: stat cards ----------------------------- */}
        <div className="flex flex-col items-end gap-4">

  <button
    onClick={onAddWatchlist}
    className="
      flex items-center gap-2
      rounded-xl
      bg-green-500
      px-5 py-3
      font-semibold
      text-black
      hover:bg-green-400
      transition-all
    "
  >
    ⭐ Add to Watchlist
  </button>

  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:flex lg:gap-3">
    <StatCard label="Market Cap" value={marketCap} />
    <StatCard label="Volume" value={volume} />
    <StatCard label="52W High" value={high52w} />
  </div>

</div>
      </div>
    </header>
  );
}
