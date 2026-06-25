import { useState, useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────
const ANALYSIS_DATA = {
  BUY: {
    confidence: 92,
    summary: [
      "Strong earnings growth across last 4 consecutive quarters",
      "Positive institutional accumulation in recent 13-F filings",
      "Bullish market momentum with sector outperformance",
      "Increasing revenue trend with expanding profit margins",
      "Analyst consensus upgraded to Overweight in past 30 days",
    ],
    risk: "Low",
    color: "#22c55e",
    colorDim: "rgba(34,197,94,0.12)",
    colorBorder: "rgba(34,197,94,0.3)",
    glow: "rgba(34,197,94,0.2)",
    targetPrice: 298.0,
    currentPrice: 256.4,
    reasoning:
      "Technical indicators align with fundamental strength. RSI shows healthy momentum without overbought conditions. MACD crossover confirms upward trajectory.",
  },
  HOLD: {
    confidence: 67,
    summary: [
      "Mixed signals from recent earnings call guidance",
      "Valuation near fair value based on DCF analysis",
      "Sector headwinds creating short-term uncertainty",
      "Insider transactions show balanced buy/sell activity",
      "Awaiting macro catalyst for directional confirmation",
    ],
    risk: "Medium",
    color: "#eab308",
    colorDim: "rgba(234,179,8,0.12)",
    colorBorder: "rgba(234,179,8,0.3)",
    glow: "rgba(234,179,8,0.18)",
    targetPrice: 263.0,
    currentPrice: 256.4,
    reasoning:
      "Current price reflects intrinsic value with limited margin of safety. Monitoring for Q3 earnings revision and Fed rate decision before increasing position.",
  },
  SELL: {
    confidence: 78,
    summary: [
      "Declining revenue growth for two consecutive quarters",
      "Institutional distribution signals in recent volume data",
      "Competitive pressure eroding market share position",
      "Elevated P/E ratio relative to sector peers",
      "Insider selling activity increased significantly",
    ],
    risk: "High",
    color: "#ef4444",
    colorDim: "rgba(239,68,68,0.12)",
    colorBorder: "rgba(239,68,68,0.3)",
    glow: "rgba(239,68,68,0.18)",
    targetPrice: 218.0,
    currentPrice: 256.4,
    reasoning:
      "Risk/reward unfavorable at current levels. Technical breakdown below 200-day MA with increasing sell-side pressure. Recommend reducing exposure.",
  },
};

const RISK_CONFIG = {
  Low: {
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.25)",
    bars: [1, 0, 0],
    label: "Low Risk",
  },
  Medium: {
    color: "#eab308",
    bg: "rgba(234,179,8,0.1)",
    border: "rgba(234,179,8,0.25)",
    bars: [1, 1, 0],
    label: "Medium Risk",
  },
  High: {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
    bars: [1, 1, 1],
    label: "High Risk",
  },
};

// ─── Circular Progress ────────────────────────────────────────────────────────
function CircularProgress({ value, color, size = 96 }) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = null;
      const duration = 1100;
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setAnimated(Math.round(ease * value));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 300);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={6}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.05s linear",
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "JetBrains Mono, monospace",
            fontSize: "20px",
            fontWeight: "700",
            color,
            lineHeight: 1,
          }}
        >
          {animated}%
        </span>
        <span style={{ fontSize: "9px", color: "#6b7280", marginTop: "2px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          score
        </span>
      </div>
    </div>
  );
}

// ─── Risk Bars ────────────────────────────────────────────────────────────────
function RiskBars({ risk }) {
  const cfg = RISK_CONFIG[risk];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div style={{ display: "flex", gap: "4px", alignItems: "flex-end" }}>
        {cfg.bars.map((active, i) => (
          <div
            key={i}
            style={{
              width: "8px",
              height: `${(i + 1) * 7 + 6}px`,
              borderRadius: "3px",
              background: active ? cfg.color : "rgba(255,255,255,0.08)",
              boxShadow: active ? `0 0 8px ${cfg.color}60` : "none",
              transition: "all 0.4s ease",
              transitionDelay: `${i * 80}ms`,
            }}
          />
        ))}
      </div>
      <span
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "12px",
          fontWeight: "600",
          color: cfg.color,
          background: cfg.bg,
          border: `1px solid ${cfg.border}`,
          padding: "3px 10px",
          borderRadius: "6px",
          letterSpacing: "0.04em",
        }}
      >
        {cfg.label}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIAnalysisCard({
  symbol = "AAPL",
  recommendation = "BUY",
}) {
  const [active, setActive] = useState(recommendation);
  const [isHovered, setIsHovered] = useState(false);
  const [pulseAI, setPulseAI] = useState(false);
  const data = ANALYSIS_DATA[active];
  const risk = RISK_CONFIG[data.risk];
  const upside = (((data.targetPrice - data.currentPrice) / data.currentPrice) * 100).toFixed(1);
  const isPositiveUpside = data.targetPrice >= data.currentPrice;

  useEffect(() => {
    const interval = setInterval(() => setPulseAI((p) => !p), 2800);
    return () => clearInterval(interval);
  }, []);

  const switchRec = (rec) => {
    if (rec === active) return;
    setActive(rec);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

        .aic-root {
          font-family: 'Inter', sans-serif;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          padding: 28px;
          position: relative;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease, border-color 0.35s ease;
          cursor: default;
          box-sizing: border-box;
          width: 100%;
        }

        .aic-root.hovered {
          transform: translateY(-3px);
          border-color: rgba(34,197,94,0.18);
          box-shadow: 0 0 40px rgba(34,197,94,0.08), 0 20px 60px rgba(0,0,0,0.4);
        }

        /* ambient corner glow */
        .aic-root::after {
          content: '';
          position: absolute;
          bottom: -60px;
          right: -60px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 65%);
          pointer-events: none;
          transition: opacity 0.35s ease;
        }
        .aic-root.hovered::after { opacity: 1.5; }

        .aic-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 10px;
        }

        .aic-title-block { display: flex; flex-direction: column; gap: 4px; }

        .aic-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4b5563;
        }

        .aic-title {
          font-size: 17px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .aic-ai-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 50px;
          padding: 6px 14px 6px 10px;
          transition: box-shadow 0.4s ease;
        }
        .aic-ai-badge.pulse {
          box-shadow: 0 0 16px rgba(34,197,94,0.25);
        }

        .aic-ai-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 8px rgba(34,197,94,0.8);
          transition: transform 0.4s ease;
          animation: ai-dot-breathe 2.8s ease-in-out infinite;
        }
        @keyframes ai-dot-breathe {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.75); }
        }

        .aic-ai-label {
          font-size: 11px;
          font-weight: 600;
          color: #22c55e;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        /* Demo switcher */
        .aic-switcher {
          display: flex;
          gap: 5px;
          margin-bottom: 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 4px;
          width: fit-content;
        }

        .aic-sw-btn {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 600;
          padding: 5px 14px;
          border-radius: 7px;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          color: #6b7280;
          background: transparent;
          letter-spacing: 0.06em;
        }
        .aic-sw-btn.buy.active  { color: #022b11; background: #22c55e; border-color: #22c55e; box-shadow: 0 0 12px rgba(34,197,94,0.4); }
        .aic-sw-btn.hold.active { color: #2a2200; background: #eab308; border-color: #eab308; box-shadow: 0 0 12px rgba(234,179,8,0.4); }
        .aic-sw-btn.sell.active { color: #2a0404; background: #ef4444; border-color: #ef4444; box-shadow: 0 0 12px rgba(239,68,68,0.4); }
        .aic-sw-btn:hover:not(.active) { color: #d1d5db; background: rgba(255,255,255,0.06); }

        /* Main rec + confidence row */
        .aic-main-row {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 24px;
          padding: 20px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          flex-wrap: wrap;
        }

        .aic-rec-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
        }

        .aic-rec-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          color: #6b7280;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .aic-rec-pill {
          font-family: 'JetBrains Mono', monospace;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 8px 22px;
          border-radius: 10px;
          border-width: 1px;
          border-style: solid;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .aic-divider-v {
          width: 1px;
          height: 60px;
          background: rgba(255,255,255,0.07);
          flex-shrink: 0;
        }

        .aic-confidence-block {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          min-width: 160px;
        }

        .aic-confidence-text { flex: 1; }

        .aic-conf-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #4b5563;
          margin-bottom: 4px;
        }

        .aic-conf-desc {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.5;
        }

        /* Summary */
        .aic-section-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4b5563;
          margin-bottom: 12px;
        }

        .aic-summary-list {
          list-style: none;
          margin: 0 0 24px 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .aic-summary-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 13px;
          color: #d1d5db;
          line-height: 1.45;
          transition: color 0.2s;
        }
        .aic-summary-item:hover { color: #f9fafb; }

        .aic-bullet {
          flex-shrink: 0;
          margin-top: 5px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--rec-color);
          box-shadow: 0 0 6px var(--rec-color);
        }

        /* Bottom row */
        .aic-bottom-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-top: 20px;
        }

        @media (max-width: 520px) {
          .aic-bottom-row { grid-template-columns: 1fr; }
          .aic-root { padding: 18px 16px; }
          .aic-rec-pill { font-size: 18px; padding: 6px 16px; }
          .aic-divider-v { display: none; }
        }

        .aic-info-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 16px;
          transition: border-color 0.3s;
        }
        .aic-info-card:hover { border-color: rgba(255,255,255,0.12); }

        .aic-info-title {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4b5563;
          margin-bottom: 10px;
        }

        .aic-price-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .aic-price-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #6b7280;
          font-family: 'JetBrains Mono', monospace;
        }

        .aic-price-val { color: #d1d5db; font-weight: 500; }

        .aic-upside {
          margin-top: 4px;
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 15px;
          font-weight: 700;
          padding: 6px 0;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        /* Reasoning */
        .aic-reasoning {
          margin-top: 20px;
          padding: 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          border-left-width: 3px;
          transition: border-color 0.3s;
        }

        .aic-reasoning-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4b5563;
          margin-bottom: 8px;
        }

        .aic-reasoning-text {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.6;
        }

        /* Footer */
        .aic-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
          flex-wrap: wrap;
          gap: 8px;
        }

        .aic-footer-note {
          font-size: 10px;
          color: #374151;
          font-family: 'JetBrains Mono', monospace;
        }

        .aic-footer-ts {
          font-size: 10px;
          color: #374151;
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      <div
        className={`aic-root${isHovered ? " hovered" : ""}`}
        style={{ "--rec-color": data.color }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ── Top Bar ── */}
        <div className="aic-top-bar">
          <div className="aic-title-block">
            <span className="aic-eyebrow">MarketGuard AI · {symbol}</span>
            <h2 className="aic-title">AI Analysis</h2>
          </div>
          <div className={`aic-ai-badge${pulseAI ? " pulse" : ""}`}>
            <div className="aic-ai-dot" />
            <span className="aic-ai-label">AI Powered Recommendation</span>
          </div>
        </div>

        {/* ── Demo Switcher ── */}
        <div className="aic-switcher">
          {["BUY", "HOLD", "SELL"].map((r) => (
            <button
              key={r}
              className={`aic-sw-btn ${r.toLowerCase()}${active === r ? " active" : ""}`}
              onClick={() => switchRec(r)}
            >
              {r}
            </button>
          ))}
        </div>

        {/* ── Main Rec + Confidence ── */}
        <div className="aic-main-row">
          <div className="aic-rec-badge">
            <span className="aic-rec-label">Recommendation</span>
            <div
              className="aic-rec-pill"
              style={{
                color: data.color,
                background: data.colorDim,
                borderColor: data.colorBorder,
                boxShadow: `0 0 20px ${data.glow}`,
              }}
            >
              {active}
            </div>
          </div>

          <div className="aic-divider-v" />

          <div className="aic-confidence-block">
            <CircularProgress value={data.confidence} color={data.color} size={88} />
            <div className="aic-confidence-text">
              <div className="aic-conf-title">Confidence Score</div>
              <div className="aic-conf-desc">
                Based on 47 technical and fundamental signals across multiple data sources.
              </div>
            </div>
          </div>
        </div>

        {/* ── Analysis Summary ── */}
        <div className="aic-section-label">Analysis Summary</div>
        <ul className="aic-summary-list">
          {data.summary.map((point, i) => (
            <li key={i} className="aic-summary-item">
              <div className="aic-bullet" />
              {point}
            </li>
          ))}
        </ul>

        {/* ── Bottom Info Cards ── */}
        <div className="aic-bottom-row">
          {/* Risk */}
          <div className="aic-info-card">
            <div className="aic-info-title">Risk Assessment</div>
            <RiskBars risk={data.risk} />
            <div
              style={{
                marginTop: "12px",
                fontSize: "11px",
                color: "#4b5563",
                lineHeight: "1.5",
              }}
            >
              {data.risk === "Low" && "Stable fundamentals with limited downside exposure."}
              {data.risk === "Medium" && "Moderate volatility expected. Monitor macro conditions."}
              {data.risk === "High" && "Elevated uncertainty. Strict stop-loss discipline advised."}
            </div>
          </div>

          {/* Target Price */}
          <div className="aic-info-card">
            <div className="aic-info-title">Target Price</div>
            <div className="aic-price-row">
              <div className="aic-price-line">
                <span>Current</span>
                <span className="aic-price-val">
                  ${data.currentPrice.toFixed(2)}
                </span>
              </div>
              <div className="aic-price-line">
                <span>AI Target</span>
                <span
                  className="aic-price-val"
                  style={{ color: data.color, fontWeight: "700" }}
                >
                  ${data.targetPrice.toFixed(2)}
                </span>
              </div>
              <div
                className="aic-upside"
                style={{
                  color: isPositiveUpside ? "#22c55e" : "#ef4444",
                  background: isPositiveUpside ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
                  border: `1px solid ${isPositiveUpside ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                }}
              >
                {isPositiveUpside ? "▲" : "▼"} {isPositiveUpside ? "+" : ""}{upside}% potential
              </div>
            </div>
          </div>
        </div>

        {/* ── AI Reasoning ── */}
        <div
          className="aic-reasoning"
          style={{ borderLeftColor: data.color }}
        >
          <div className="aic-reasoning-label">AI Model Reasoning</div>
          <p className="aic-reasoning-text">{data.reasoning}</p>
        </div>

        {/* ── Footer ── */}
        <div className="aic-footer">
          <span className="aic-footer-note">
            Not financial advice · For informational purposes only
          </span>
          <span className="aic-footer-ts">
            Updated {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · MarketGuard AI v2.4
          </span>
        </div>
      </div>
    </>
  );
}
