import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  Activity,
  TrendingUp,
  TrendingDown,
  BarChart2,
  ArrowDownToLine,
  ArrowUpToLine,
  Layers,
  Zap,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

// const INDICATORS = [
//   {
//     id: "rsi",
//     label: "RSI",
//     sublabel: "Relative Strength Index",
//     value: "56",
//     unit: "",
//     status: "Neutral",
//     description: "Momentum is balanced between buyers and sellers.",
//     icon: Activity,
//     color: "yellow",
//   },
//   {
//     id: "macd",
//     label: "MACD",
//     sublabel: "Moving Avg. Convergence",
//     value: "Bullish",
//     unit: "",
//     status: "Bullish",
//     description: "Positive momentum crossover detected.",
//     icon: TrendingUp,
//     color: "emerald",
//   },
//   {
//     id: "ema20",
//     label: "EMA 20",
//     sublabel: "Exponential Moving Average",
//     value: "Above Price",
//     unit: "",
//     status: "Bullish",
//     description: "Short-term trend remains strong.",
//     icon: Layers,
//     color: "green",
//   },
//   {
//     id: "ema50",
//     label: "EMA 50",
//     sublabel: "Exponential Moving Average",
//     value: "Above Price",
//     unit: "",
//     status: "Bullish",
//     description: "Long-term trend remains positive.",
//     icon: Layers,
//     color: "green",
//   },
//   {
//     id: "support",
//     label: "Support",
//     sublabel: "Key Price Level",
//     value: "$245.00",
//     unit: "",
//     status: "Support",
//     description: "Strong buying zone identified.",
//     icon: ArrowDownToLine,
//     color: "blue",
//   },
//   {
//     id: "resistance",
//     label: "Resistance",
//     sublabel: "Key Price Level",
//     value: "$272.00",
//     unit: "",
//     status: "Resistance",
//     description: "Major selling pressure zone.",
//     icon: ArrowUpToLine,
//     color: "red",
//   },
//   {
//     id: "volume",
//     label: "Volume",
//     sublabel: "24h Trading Volume",
//     value: "48.2M",
//     unit: "",
//     status: "High",
//     description: "Higher than average trading activity.",
//     icon: BarChart2,
//     color: "purple",
//   },
//   {
//     id: "trend",
//     label: "Trend Strength",
//     sublabel: "Directional Momentum",
//     value: "Strong Bullish",
//     unit: "",
//     status: "Strong",
//     description: "Overall trend remains firmly positive.",
//     icon: Zap,
//     color: "emerald",
//   },
// ];

// ─── Color tokens ─────────────────────────────────────────────────────────────

const COLOR_MAP = {
  yellow: {
    icon: "#EAB308",
    iconBg: "rgba(234,179,8,0.10)",
    iconBorder: "rgba(234,179,8,0.18)",
    badge: "rgba(234,179,8,0.12)",
    badgeText: "#EAB308",
    badgeBorder: "rgba(234,179,8,0.22)",
    value: "#EAB308",
  },
  emerald: {
    icon: "#22C55E",
    iconBg: "rgba(34,197,94,0.10)",
    iconBorder: "rgba(34,197,94,0.18)",
    badge: "rgba(34,197,94,0.10)",
    badgeText: "#22C55E",
    badgeBorder: "rgba(34,197,94,0.22)",
    value: "#22C55E",
  },
  green: {
    icon: "#4ADE80",
    iconBg: "rgba(74,222,128,0.09)",
    iconBorder: "rgba(74,222,128,0.17)",
    badge: "rgba(74,222,128,0.10)",
    badgeText: "#4ADE80",
    badgeBorder: "rgba(74,222,128,0.22)",
    value: "#4ADE80",
  },
  blue: {
    icon: "#60A5FA",
    iconBg: "rgba(96,165,250,0.10)",
    iconBorder: "rgba(96,165,250,0.18)",
    badge: "rgba(96,165,250,0.10)",
    badgeText: "#60A5FA",
    badgeBorder: "rgba(96,165,250,0.22)",
    value: "#60A5FA",
  },
  red: {
    icon: "#F87171",
    iconBg: "rgba(248,113,113,0.10)",
    iconBorder: "rgba(248,113,113,0.18)",
    badge: "rgba(248,113,113,0.10)",
    badgeText: "#F87171",
    badgeBorder: "rgba(248,113,113,0.22)",
    value: "#F87171",
  },
  purple: {
    icon: "#A78BFA",
    iconBg: "rgba(167,139,250,0.10)",
    iconBorder: "rgba(167,139,250,0.18)",
    badge: "rgba(167,139,250,0.10)",
    badgeText: "#A78BFA",
    badgeBorder: "rgba(167,139,250,0.22)",
    value: "#A78BFA",
  },
};

// ─── Single Card ──────────────────────────────────────────────────────────────

function IndicatorCard({ indicator }) {
  const { label, sublabel, value, status, description, icon: Icon, color } = indicator;
  const c = COLOR_MAP[color] ?? COLOR_MAP.emerald;

  return (
    <div className="ti-card">
      {/* Top row: icon + badge */}
      <div className="ti-card-top">
        <div
          className="ti-icon-wrap"
          style={{ background: c.iconBg, border: `1px solid ${c.iconBorder}` }}
        >
          <Icon size={16} color={c.icon} strokeWidth={2} />
        </div>

        <span
          className="ti-badge"
          style={{
            background: c.badge,
            color: c.badgeText,
            border: `1px solid ${c.badgeBorder}`,
          }}
        >
          {status}
        </span>
      </div>

      {/* Label */}
      <div className="ti-label-group">
        <span className="ti-label">{label}</span>
        <span className="ti-sublabel">{sublabel}</span>
      </div>

      {/* Value */}
      <div className="ti-value" style={{ color: c.value }}>
        {value}
      </div>

      {/* Divider */}
      <div className="ti-divider" />

      {/* Description */}
      <p className="ti-description">{description}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TechnicalIndicators() {

  const { symbol } = useParams();

  const [indicators, setIndicators] = useState([]);

  useEffect(() => {

    fetch(`http://127.0.0.1:8000/api/stocks/${symbol}/technical`)
      .then(res => res.json())
      .then(data => {

        setIndicators([
          {
  id: "rsi",
  label: "RSI",
  sublabel: "Relative Strength Index",
  value: data.rsi,
  status: data.rsi > 70 ? "Overbought" : data.rsi < 30 ? "Oversold" : "Neutral",
  description: "Relative Strength Index",
  icon: Activity,
  color: "yellow",
},

{
  id: "macd",
  label: "MACD",
  sublabel: "Moving Avg. Convergence",
  value: data.macd,
  status: data.macd,
  description: "Moving Average Convergence Divergence",
  icon: TrendingUp,
  color: data.macd === "Bullish" ? "emerald" : "red",
},

{
  id: "ema20",
  label: "EMA 20",
  sublabel: "20 Day EMA",
  value: `$${data.ema20}`,
  status: "EMA",
  description: "20 Day Exponential Moving Average",
  icon: Layers,
  color: "green",
},

{
  id: "ema50",
  label: "EMA 50",
  sublabel: "50 Day EMA",
  value: `$${data.ema50}`,
  status: "EMA",
  description: "50 Day Exponential Moving Average",
  icon: Layers,
  color: "green",
},

{
  id: "support",
  label: "Support",
  sublabel: "Support Level",
  value: `$${data.support}`,
  status: "Support",
  description: "Nearest Support",
  icon: ArrowDownToLine,
  color: "blue",
},

{
  id: "resistance",
  label: "Resistance",
  sublabel: "Resistance Level",
  value: `$${data.resistance}`,
  status: "Resistance",
  description: "Nearest Resistance",
  icon: ArrowUpToLine,
  color: "red",
},

{
  id: "volume",
  label: "Volume",
  sublabel: "Today's Volume",
  value: Number(data.volume).toLocaleString(),
  status: "High",
  description: "Trading Volume",
  icon: BarChart2,
  color: "purple",
},

{
  id: "trend",
  label: "Trend",
  sublabel: "Overall Trend",
  value: data.trend,
  status: data.trend,
  description: "Current Trend",
  icon: Zap,
  color: data.trend.includes("Bull") ? "emerald" : "red",
}
        ]);

      });

  }, [symbol]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .ti-section {
          width: 100%;
          padding: 32px 0;
          font-family: 'Inter', sans-serif;
        }

        /* Header */
        .ti-header { margin-bottom: 24px; }
        .ti-title {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.3px;
          margin: 0 0 6px 0;
        }
        .ti-subtitle {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
          font-weight: 400;
        }

        /* Grid */
        .ti-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        @media (max-width: 1024px) {
          .ti-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .ti-grid { grid-template-columns: 1fr; }
        }

        /* Card */
        .ti-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 20px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          cursor: default;
          transition: transform 280ms ease, background 280ms ease, border-color 280ms ease, box-shadow 280ms ease;
        }
        .ti-card:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.11);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
        }

        /* Icon wrapper */
        .ti-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Top row */
        .ti-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Badge */
        .ti-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 999px;
          letter-spacing: 0.2px;
          white-space: nowrap;
        }

        /* Label group */
        .ti-label-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .ti-label {
          font-size: 13px;
          font-weight: 600;
          color: #e5e7eb;
          letter-spacing: -0.1px;
        }
        .ti-sublabel {
          font-size: 11px;
          color: #4b5563;
          font-weight: 400;
        }

        /* Value */
        .ti-value {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: -0.5px;
          line-height: 1;
        }

        /* Divider */
        .ti-divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.05);
          margin: 0;
        }

        /* Description */
        .ti-description {
          font-size: 12px;
          color: #6b7280;
          margin: 0;
          line-height: 1.5;
          font-weight: 400;
        }
      `}</style>

      <section className="ti-section">
        {/* Section header */}
        <div className="ti-header">
          <h2 className="ti-title">Technical Indicators</h2>
          <p className="ti-subtitle">
            Key technical signals generated from recent market activity.
          </p>
        </div>

        {/* Cards grid */}
        <div className="ti-grid">
          {indicators.map((indicator) => (
            <IndicatorCard key={indicator.id} indicator={indicator} />
          ))}
        </div>
      </section>
    </>
  );
}
