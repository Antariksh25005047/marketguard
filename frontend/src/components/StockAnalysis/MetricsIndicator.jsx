import {
  TrendingUp,
  TrendingDown,
  BarChart2,
  DollarSign,
  Wallet,
  PiggyBank,
  Percent,
  Activity,
  CandlestickChart,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────



// ─── Color tokens ─────────────────────────────────────────────────────────────

const COLOR_MAP = {
  emerald: {
    icon: "#22C55E",
    iconBg: "rgba(34,197,94,0.09)",
    iconBorder: "rgba(34,197,94,0.16)",
    badge: "rgba(34,197,94,0.10)",
    badgeText: "#22C55E",
    badgeBorder: "rgba(34,197,94,0.20)",
    value: "#22C55E",
  },
  green: {
    icon: "#4ADE80",
    iconBg: "rgba(74,222,128,0.08)",
    iconBorder: "rgba(74,222,128,0.15)",
    badge: "rgba(74,222,128,0.09)",
    badgeText: "#4ADE80",
    badgeBorder: "rgba(74,222,128,0.20)",
    value: "#4ADE80",
  },
  yellow: {
    icon: "#EAB308",
    iconBg: "rgba(234,179,8,0.09)",
    iconBorder: "rgba(234,179,8,0.16)",
    badge: "rgba(234,179,8,0.10)",
    badgeText: "#EAB308",
    badgeBorder: "rgba(234,179,8,0.20)",
    value: "#EAB308",
  },
  blue: {
    icon: "#60A5FA",
    iconBg: "rgba(96,165,250,0.09)",
    iconBorder: "rgba(96,165,250,0.16)",
    badge: "rgba(96,165,250,0.10)",
    badgeText: "#60A5FA",
    badgeBorder: "rgba(96,165,250,0.20)",
    value: "#60A5FA",
  },
  red: {
    icon: "#F87171",
    iconBg: "rgba(248,113,113,0.09)",
    iconBorder: "rgba(248,113,113,0.16)",
    badge: "rgba(248,113,113,0.10)",
    badgeText: "#F87171",
    badgeBorder: "rgba(248,113,113,0.20)",
    value: "#F87171",
  },
  purple: {
    icon: "#A78BFA",
    iconBg: "rgba(167,139,250,0.09)",
    iconBorder: "rgba(167,139,250,0.16)",
    badge: "rgba(167,139,250,0.10)",
    badgeText: "#A78BFA",
    badgeBorder: "rgba(167,139,250,0.20)",
    value: "#A78BFA",
  },
  gray: {
    icon: "#6B7280",
    iconBg: "rgba(107,114,128,0.09)",
    iconBorder: "rgba(107,114,128,0.16)",
    badge: "rgba(107,114,128,0.10)",
    badgeText: "#9CA3AF",
    badgeBorder: "rgba(107,114,128,0.20)",
    value: "#9CA3AF",
  },
};

// ─── Single Card ──────────────────────────────────────────────────────────────

function MetricCard({ metric }) {
  const { label, value, description, icon: Icon, color, status } = metric;
  const c = COLOR_MAP[color] ?? COLOR_MAP.emerald;

  return (
    <div className="fm-card">
      {/* Top row: icon + optional badge */}
      <div className="fm-card-top">
        <div
          className="fm-icon-wrap"
          style={{
            background: c.iconBg,
            border: `1px solid ${c.iconBorder}`,
          }}
        >
          <Icon size={14} color={c.icon} strokeWidth={2} />
        </div>

        {status && (
          <span
            className="fm-badge"
            style={{
              background: c.badge,
              color: c.badgeText,
              border: `1px solid ${c.badgeBorder}`,
            }}
          >
            {status}
          </span>
        )}
      </div>

      {/* Label */}
      <span className="fm-label">{label}</span>

      {/* Value */}
      <div className="fm-value" style={{ color: c.value }}>
        {value}
      </div>

      {/* Description */}
      <p className="fm-desc">{description}</p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FinancialMetrics({ stock }) {
    const metrics = [
  {
    id: "market-cap",
    label: "Market Cap",
    value: stock?.marketCap
      ? `$${(stock.marketCap / 1e9).toFixed(2)}B`
      : "-",
    description: "Total market value of the company.",
    icon: TrendingUp,
    color: "emerald",
    status: "Large Cap",
  },
  {
    id: "pe-ratio",
    label: "P/E Ratio",
    value: stock?.peRatio?.toFixed(2) ?? "-",
    description: "Price compared to earnings per share.",
    icon: BarChart2,
    color: "yellow",
    status: null,
  },
  {
    id: "eps",
    label: "EPS",
    value: stock?.eps ?? "-",
    description: "Earnings generated per share.",
    icon: DollarSign,
    color: "green",
    status: null,
  },
  {
    id: "volume",
    label: "Volume",
    value: stock?.volume?.toLocaleString() ?? "-",
    description: "Today's trading volume.",
    icon: Wallet,
    color: "blue",
    status: null,
  },
  {
    id: "beta",
    label: "Beta",
    value: stock?.beta ?? "-",
    description: "Measures stock price volatility.",
    icon: Activity,
    color: "red",
    status: "Volatility",
  },
  {
    id: "52w-high",
    label: "52W High",
    value: stock?.high52w ?? "-",
    description: "Highest price in last 52 weeks.",
    icon: TrendingUp,
    color: "green",
    status: null,
  },
  {
    id: "52w-low",
    label: "52W Low",
    value: stock?.low52w ?? "-",
    description: "Lowest price in last 52 weeks.",
    icon: TrendingDown,
    color: "red",
    status: null,
  },
  {
    id: "currency",
    label: "Currency",
    value: stock?.currency ?? "-",
    description: "Trading currency.",
    icon: CandlestickChart,
    color: "purple",
    status: null,
  },
];
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .fm-section {
          width: 100%;
          padding: 32px 0;
          font-family: 'Inter', sans-serif;
        }

        .fm-header { margin-bottom: 20px; }
        .fm-title {
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.3px;
          margin: 0 0 5px 0;
        }
        .fm-subtitle {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
          font-weight: 400;
        }

        /* Grid */
        .fm-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }
        @media (max-width: 1024px) {
          .fm-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .fm-grid { grid-template-columns: 1fr; }
        }

        /* Card */
        .fm-card {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          cursor: default;
          transition: transform 250ms ease, background 250ms ease,
                      border-color 250ms ease, box-shadow 250ms ease;
        }
        .fm-card:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.11);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.32);
        }

        .fm-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .fm-icon-wrap {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .fm-badge {
          font-size: 10px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 999px;
          letter-spacing: 0.2px;
          white-space: nowrap;
        }

        .fm-label {
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .fm-value {
          font-size: 19px;
          font-weight: 700;
          letter-spacing: -0.5px;
          line-height: 1;
        }

        .fm-desc {
          font-size: 11.5px;
          color: #4b5563;
          margin: 0;
          line-height: 1.45;
          font-weight: 400;
        }
      `}</style>

      <section className="fm-section">
        <div className="fm-header">
          <h2 className="fm-title">Financial Metrics</h2>
          <p className="fm-subtitle">
            Key financial indicators that help evaluate the company's overall financial performance.
          </p>
        </div>

        <div className="fm-grid">
          {metrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      </section>
    </>
  );
}
