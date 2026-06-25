import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// ─── Data generators ───────────────────────────────────────────────────────
const generateData = (points, basePrice, volatility, trend) => {
  const data = [];
  let price = basePrice;
  const now = Date.now();

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.48) * volatility + trend;
    price = Math.max(price + change, basePrice * 0.5);
    data.push({
      time: now - (points - i) * 1000,
      price: parseFloat(price.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000 + 500000),
    });
  }
  return data;
};

const TIMEFRAME_CONFIG = {
  "1D": {
    points: 390,
    label: "1 Day",
    format: (ts) =>
      new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    tickCount: 7,
    volatility: 1.2,
    trend: 0.05,
  },
  "1W": {
    points: 168,
    label: "1 Week",
    format: (ts) =>
      new Date(ts).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }),
    tickCount: 7,
    volatility: 2.5,
    trend: 0.1,
  },
  "1M": {
    points: 30,
    label: "1 Month",
    format: (ts) =>
      new Date(ts).toLocaleDateString([], { month: "short", day: "numeric" }),
    tickCount: 6,
    volatility: 5,
    trend: 0.2,
  },
  "6M": {
    points: 180,
    label: "6 Months",
    format: (ts) =>
      new Date(ts).toLocaleDateString([], { month: "short", day: "numeric" }),
    tickCount: 6,
    volatility: 7,
    trend: 0.3,
  },
  "1Y": {
    points: 252,
    label: "1 Year",
    format: (ts) =>
      new Date(ts).toLocaleDateString([], { month: "short", year: "2-digit" }),
    tickCount: 6,
    volatility: 10,
    trend: 0.4,
  },
  "5Y": {
    points: 260,
    label: "5 Years",
    format: (ts) =>
      new Date(ts).toLocaleDateString([], { month: "short", year: "numeric" }),
    tickCount: 5,
    volatility: 18,
    trend: 0.6,
  },
};

// ─── Custom Tooltip ─────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label, formatTime }) => {
  if (!active || !payload || !payload.length) return null;
  const price = payload[0]?.value;
  const volume = payload[0]?.payload?.volume;

  return (
    <div
      style={{
        background: "rgba(5,5,5,0.92)",
        border: "1px solid rgba(34,197,94,0.3)",
        borderRadius: "10px",
        padding: "10px 14px",
        boxShadow: "0 0 20px rgba(34,197,94,0.15)",
        backdropFilter: "blur(12px)",
        minWidth: "140px",
      }}
    >
      <p style={{ color: "#6b7280", fontSize: "11px", margin: "0 0 4px 0", fontFamily: "monospace" }}>
        {formatTime ? formatTime(label) : label}
      </p>
      <p style={{ color: "#22c55e", fontSize: "18px", fontWeight: "700", margin: "0 0 4px 0", fontFamily: "monospace" }}>
        ${price?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <p style={{ color: "#4b5563", fontSize: "11px", margin: 0, fontFamily: "monospace" }}>
        Vol: {(volume / 1000).toFixed(0)}K
      </p>
    </div>
  );
};

// ─── Custom Dot ─────────────────────────────────────────────────────────────
const CustomActiveDot = ({ cx, cy }) => (
  <g>
    <circle cx={cx} cy={cy} r={5} fill="#22c55e" stroke="#050505" strokeWidth={2} />
    <circle cx={cx} cy={cy} r={9} fill="none" stroke="rgba(34,197,94,0.35)" strokeWidth={1.5} />
  </g>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export default function StockChart({ symbol = "TSLA", basePrice = 256.4 }) {
  const [activeTimeframe, setActiveTimeframe] = useState("1D");
  const [chartData, setChartData] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);
  const [priceChange, setPriceChange] = useState({ value: 0, pct: 0, positive: true });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const buildData = useCallback((tf) => {
    const cfg = TIMEFRAME_CONFIG[tf];
    const data = generateData(cfg.points, basePrice, cfg.volatility, cfg.trend);
    const first = data[0]?.price ?? basePrice;
    const last = data[data.length - 1]?.price ?? basePrice;
    const change = last - first;
    const pct = ((change / first) * 100);
    setPriceChange({ value: change, pct, positive: change >= 0 });
    return data;
  }, [basePrice]);

  useEffect(() => {
    const data = buildData(activeTimeframe);
    setChartData(data);
    setAnimationKey((k) => k + 1);
  }, [activeTimeframe, buildData]);

  const handleTimeframeChange = (tf) => {
    if (tf === activeTimeframe || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTimeframe(tf);
      setIsTransitioning(false);
    }, 180);
  };

  const cfg = TIMEFRAME_CONFIG[activeTimeframe];
  const currentPrice = chartData[chartData.length - 1]?.price ?? basePrice;
  const minPrice = chartData.length ? Math.min(...chartData.map((d) => d.price)) : basePrice * 0.9;
  const maxPrice = chartData.length ? Math.max(...chartData.map((d) => d.price)) : basePrice * 1.1;
  const padding = (maxPrice - minPrice) * 0.12;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .mg-chart-root {
          font-family: 'Inter', sans-serif;
          background: #050505;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
          position: relative;
          padding: 24px 24px 20px;
          width: 100%;
          box-sizing: border-box;
        }

        /* Ambient glow behind chart */
        .mg-chart-root::before {
          content: '';
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60%;
          height: 200px;
          background: radial-gradient(ellipse, rgba(34,197,94,0.06) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .mg-header-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .mg-header-left {}

        .mg-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6b7280;
          margin: 0 0 4px 0;
        }

        .mg-title {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 6px 0;
        }

        .mg-price-row {
          display: flex;
          align-items: baseline;
          gap: 10px;
          flex-wrap: wrap;
        }

        .mg-price {
          font-family: 'JetBrains Mono', monospace;
          font-size: 28px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.02em;
        }

        .mg-change {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          padding: 2px 8px;
          border-radius: 6px;
        }
        .mg-change.positive {
          color: #22c55e;
          background: rgba(34,197,94,0.1);
        }
        .mg-change.negative {
          color: #ef4444;
          background: rgba(239,68,68,0.1);
        }

        .mg-tf-group {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 4px;
          overflow-x: auto;
          flex-shrink: 0;
          scrollbar-width: none;
        }
        .mg-tf-group::-webkit-scrollbar { display: none; }

        .mg-tf-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 500;
          padding: 6px 13px;
          border-radius: 7px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.22s ease;
          white-space: nowrap;
          letter-spacing: 0.02em;
          color: #6b7280;
          background: transparent;
        }

        .mg-tf-btn:hover:not(.active) {
          color: #d1d5db;
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.1);
        }

        .mg-tf-btn.active {
          color: #052010;
          background: #22c55e;
          border-color: #22c55e;
          box-shadow: 0 0 14px rgba(34,197,94,0.45), 0 0 28px rgba(34,197,94,0.15);
          font-weight: 600;
        }

        .mg-chart-wrap {
          position: relative;
          z-index: 1;
          transition: opacity 0.18s ease;
        }
        .mg-chart-wrap.transitioning {
          opacity: 0.3;
        }

        /* Recharts overrides */
        .recharts-cartesian-grid-horizontal line,
        .recharts-cartesian-grid-vertical line {
          stroke: rgba(255,255,255,0.04) !important;
        }
        .recharts-tooltip-cursor {
          stroke: rgba(34,197,94,0.3) !important;
          stroke-width: 1px !important;
          stroke-dasharray: 4 3 !important;
        }

        @media (max-width: 640px) {
          .mg-chart-root { padding: 16px 12px 14px; }
          .mg-price { font-size: 22px; }
          .mg-title { font-size: 14px; }
          .mg-tf-group { max-width: 100%; }
          .mg-header-row { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="mg-chart-root">

        {/* ── Header ── */}
        <div className="mg-header-row">
          <div className="mg-header-left">
            <p className="mg-label">Price Performance</p>
            <p className="mg-title">{symbol} · {cfg.label}</p>
            <div className="mg-price-row">
              <span className="mg-price">
                ${currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`mg-change ${priceChange.positive ? "positive" : "negative"}`}>
                {priceChange.positive ? "▲" : "▼"}{" "}
                {Math.abs(priceChange.value).toFixed(2)} ({Math.abs(priceChange.pct).toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="mg-tf-group">
            {Object.keys(TIMEFRAME_CONFIG).map((tf) => (
              <button
                key={tf}
                className={`mg-tf-btn${activeTimeframe === tf ? " active" : ""}`}
                onClick={() => handleTimeframeChange(tf)}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* ── Chart ── */}
        <div className={`mg-chart-wrap${isTransitioning ? " transitioning" : ""}`}>
          <ResponsiveContainer width="100%" height={480}>
            <AreaChart
              key={animationKey}
              data={chartData}
              margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity={0.22} />
                  <stop offset="45%" stopColor="#22c55e" stopOpacity={0.08} />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="1 0"
                vertical={false}
                stroke="rgba(255,255,255,0.04)"
              />

              <XAxis
                dataKey="time"
                tickFormatter={cfg.format}
                tickCount={cfg.tickCount}
                tick={{ fill: "#4b5563", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                tickLine={false}
                interval="preserveStartEnd"
                minTickGap={48}
              />

              <YAxis
                domain={[minPrice - padding, maxPrice + padding]}
                tickFormatter={(v) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
                tick={{ fill: "#4b5563", fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}
                axisLine={false}
                tickLine={false}
                width={64}
                tickCount={6}
              />

              <Tooltip
                content={<CustomTooltip formatTime={cfg.format} />}
                cursor={{ stroke: "rgba(34,197,94,0.25)", strokeWidth: 1, strokeDasharray: "4 3" }}
              />

              <ReferenceLine
                y={basePrice}
                stroke="rgba(255,255,255,0.08)"
                strokeDasharray="3 4"
                strokeWidth={1}
              />

              <Area
                type="monotoneX"
                dataKey="price"
                stroke="#22c55e"
                strokeWidth={1.8}
                fill="url(#emeraldGradient)"
                dot={false}
                activeDot={<CustomActiveDot />}
                isAnimationActive={true}
                animationDuration={900}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Bottom meta bar ── */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "14px",
          paddingTop: "14px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          flexWrap: "wrap",
          gap: "8px",
          position: "relative",
          zIndex: 1,
        }}>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#374151" }}>
            {chartData.length > 0
              ? `${chartData.length.toLocaleString()} data points · ${cfg.label}`
              : "Loading…"}
          </span>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "inline-block", width: "24px", height: "2px", background: "linear-gradient(90deg,#22c55e,#4ade80)", borderRadius: "2px" }} />
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#4b5563" }}>{symbol}</span>
            </div>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "#374151" }}>
              MarketGuard AI
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
