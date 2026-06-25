import { useState, useEffect, useRef } from "react";
import { Search, ArrowRight, Zap, Trophy, TrendingUp, TrendingDown, X, ChevronRight } from "lucide-react";
 
// ─── Static Data ───────────────────────────────────────────────────────────────
 
const BASE_STOCK = {
  ticker: "TSLA", name: "Tesla", color: "#ef4444",
  price: "$248.42", rec: "BUY", confidence: 78, risk: "Medium",
  logo: "T",
};
 
const STOCK_DB = {
  NVDA: { ticker: "NVDA", name: "NVIDIA",    color: "#22c55e", price: "$875.40", rec: "STRONG BUY", confidence: 94, risk: "Low",    logo: "N" },
  AAPL: { ticker: "AAPL", name: "Apple",     color: "#60a5fa", price: "$189.30", rec: "BUY",        confidence: 88, risk: "Low",    logo: "A" },
  MSFT: { ticker: "MSFT", name: "Microsoft", color: "#818cf8", price: "$420.15", rec: "BUY",        confidence: 91, risk: "Low",    logo: "M" },
  AMZN: { ticker: "AMZN", name: "Amazon",    color: "#fb923c", price: "$182.40", rec: "BUY",        confidence: 85, risk: "Medium", logo: "A" },
  GOOGL:{ ticker: "GOOGL",name: "Alphabet",  color: "#a78bfa", price: "$165.80", rec: "BUY",        confidence: 87, risk: "Low",    logo: "G" },
  TSM:  { ticker: "TSM",  name: "TSMC",      color: "#34d399", price: "$148.90", rec: "BUY",        confidence: 83, risk: "Medium", logo: "T" },
  META: { ticker: "META", name: "Meta",      color: "#38bdf8", price: "$524.70", rec: "STRONG BUY", confidence: 90, risk: "Low",    logo: "M" },
};
 
const SUGGESTIONS = Object.values(STOCK_DB);
 
const RECENT = ["NVIDIA", "Apple", "Microsoft"];
 
const COMPARISON_DATA = {
  NVDA: {
    summary: [
      "NVIDIA leads with dominant AI chip demand, delivering exceptional earnings growth of 122% YoY and expanding operating margins above 50%.",
      "Tesla, while undervalued by traditional multiples, faces near-term pressure from EV margin compression and increased competition in its core market.",
      "Overall, NVIDIA holds stronger growth momentum and institutional conviction. Tesla offers a contrarian value opportunity for patient, long-term investors.",
    ],
    winner: "NVDA",
    winnerConf: 91,
    reasons: ["Dominant AI infrastructure revenue", "Superior earnings growth trajectory", "Stronger institutional momentum"],
    bars: [
      { label: "Fundamentals",       a: 82, b: 94 },
      { label: "Technical Strength", a: 90, b: 84 },
      { label: "Valuation",          a: 92, b: 68 },
      { label: "Growth",             a: 74, b: 98 },
    ],
  },
  AAPL: {
    summary: [
      "Apple's unmatched brand equity and services flywheel generate $100B+ in annual free cash flow, making it one of the most capital-efficient businesses globally.",
      "Tesla carries higher execution risk but offers significantly more upside in a bull scenario, particularly if Full Self-Driving reaches commercial scale.",
      "Apple is the lower-risk, steady compounder. Tesla is the higher-conviction growth bet. The right choice depends on your time horizon and risk appetite.",
    ],
    winner: "AAPL",
    winnerConf: 82,
    reasons: ["Unmatched free cash flow generation", "Consistent capital returns to shareholders", "Lower execution and market risk"],
    bars: [
      { label: "Fundamentals",       a: 82, b: 91 },
      { label: "Technical Strength", a: 90, b: 85 },
      { label: "Valuation",          a: 92, b: 78 },
      { label: "Growth",             a: 74, b: 62 },
    ],
  },
  MSFT: {
    summary: [
      "Microsoft's Azure cloud platform and deep OpenAI integration position it at the center of enterprise AI adoption, driving durable double-digit revenue growth.",
      "Tesla offers a higher-risk, higher-reward profile with significant optionality in robotics and autonomous driving beyond its core EV business.",
      "Microsoft is the cleaner compounder with more predictable cash flows. Tesla suits investors who want leveraged exposure to multiple disruptive technologies.",
    ],
    winner: "MSFT",
    winnerConf: 88,
    reasons: ["Azure cloud + AI integration", "Highly predictable enterprise revenue", "Exceptional capital allocation track record"],
    bars: [
      { label: "Fundamentals",       a: 82, b: 93 },
      { label: "Technical Strength", a: 90, b: 87 },
      { label: "Valuation",          a: 92, b: 72 },
      { label: "Growth",             a: 74, b: 86 },
    ],
  },
};
 
const getComparison = (ticker) => COMPARISON_DATA[ticker] || {
  summary: [
    `${STOCK_DB[ticker]?.name || ticker} shows solid financial metrics with consistent revenue growth and a healthy balance sheet relative to its sector peers.`,
    "Tesla continues to trade at a premium multiple, reflecting investor confidence in its long-term energy and autonomy roadmap despite near-term margin headwinds.",
    "Both companies offer distinct risk-reward profiles. Your preference should align with your investment timeline and conviction in each company's core thesis.",
  ],
  winner: ticker,
  winnerConf: 79,
  reasons: ["Stronger near-term earnings visibility", "Favorable risk-adjusted return profile", "Better relative sector positioning"],
  bars: [
    { label: "Fundamentals",       a: 82, b: 80 },
    { label: "Technical Strength", a: 90, b: 78 },
    { label: "Valuation",          a: 92, b: 75 },
    { label: "Growth",             a: 74, b: 82 },
  ],
};
 
// ─── Helpers ───────────────────────────────────────────────────────────────────
 
const recColor = (r) =>
  r === "STRONG BUY" ? "#22c55e" : r === "BUY" ? "#4ade80" : r === "HOLD" ? "#f59e0b" : "#ef4444";
 
const riskColor = (r) =>
  r === "Low" ? "#22c55e" : r === "Medium" ? "#f59e0b" : "#ef4444";
 
// ─── Animated Progress Bar ─────────────────────────────────────────────────────
 
function CompareBar({ label, aVal, bVal, aColor, bColor, delay }) {
  const [wa, setWa] = useState(0);
  const [wb, setWb] = useState(0);
 
  useEffect(() => {
    const t = setTimeout(() => { setWa(aVal); setWb(bVal); }, delay);
    return () => clearTimeout(t);
  }, [aVal, bVal, delay]);
 
  const aWins = aVal >= bVal;
 
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.01em" }}>{label}</span>
      </div>
      {/* A bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10.5, color: aColor, fontWeight: 700, width: 34, flexShrink: 0 }}>TSLA</span>
        <div style={{ flex: 1, height: 5, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${wa}%`, borderRadius: 99,
            background: `linear-gradient(90deg, ${aColor}90, ${aColor})`,
            transition: "width 1s cubic-bezier(0.25,1,0.5,1)",
            boxShadow: aWins ? `0 0 8px ${aColor}60` : "none",
          }} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: aWins ? aColor : "rgba(255,255,255,0.3)", width: 30, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{aVal}%</span>
      </div>
      {/* B bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10.5, color: bColor, fontWeight: 700, width: 34, flexShrink: 0 }}>
          {/* filled in via prop */}
        </span>
        <div style={{ flex: 1, height: 5, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${wb}%`, borderRadius: 99,
            background: `linear-gradient(90deg, ${bColor}90, ${bColor})`,
            transition: "width 1s cubic-bezier(0.25,1,0.5,1)",
            boxShadow: !aWins ? `0 0 8px ${bColor}60` : "none",
          }} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: !aWins ? bColor : "rgba(255,255,255,0.3)", width: 30, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{bVal}%</span>
      </div>
    </div>
  );
}
 
function CompareBarWithTicker({ label, aVal, bVal, aColor, bColor, bTicker, delay }) {
  const [wa, setWa] = useState(0);
  const [wb, setWb] = useState(0);
 
  useEffect(() => {
    const t = setTimeout(() => { setWa(aVal); setWb(bVal); }, delay);
    return () => clearTimeout(t);
  }, [aVal, bVal, delay]);
 
  const aWins = aVal >= bVal;
 
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10, color: aColor, fontWeight: 700, width: 32, flexShrink: 0 }}>TSLA</span>
        <div style={{ flex: 1, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.055)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${wa}%`, borderRadius: 99, background: `linear-gradient(90deg, ${aColor}70, ${aColor})`, transition: "width 0.95s cubic-bezier(0.25,1,0.5,1)", boxShadow: aWins ? `0 0 6px ${aColor}50` : "none" }} />
        </div>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: aWins ? aColor : "rgba(255,255,255,0.28)", width: 28, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{aVal}%</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10, color: bColor, fontWeight: 700, width: 32, flexShrink: 0 }}>{bTicker}</span>
        <div style={{ flex: 1, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.055)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${wb}%`, borderRadius: 99, background: `linear-gradient(90deg, ${bColor}70, ${bColor})`, transition: "width 0.95s cubic-bezier(0.25,1,0.5,1)", boxShadow: !aWins ? `0 0 6px ${bColor}50` : "none" }} />
        </div>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: !aWins ? bColor : "rgba(255,255,255,0.28)", width: 28, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{bVal}%</span>
      </div>
    </div>
  );
}
 
// ─── Stock Card ────────────────────────────────────────────────────────────────
 
function StockCard({ stock, align = "left", animate }) {
  const isLeft = align === "left";
  return (
    <div style={{
      flex: 1, padding: "18px 20px",
      background: "rgba(255,255,255,0.022)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 14,
      display: "flex", flexDirection: "column",
      alignItems: isLeft ? "flex-start" : "flex-end",
      gap: 10,
      opacity: animate ? 1 : 0,
      transform: animate ? "translateY(0)" : `translateY(12px)`,
      transition: "opacity 0.45s ease, transform 0.45s ease",
      transitionDelay: isLeft ? "0s" : "0.08s",
    }}>
      {/* Logo + name */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexDirection: isLeft ? "row" : "row-reverse" }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: `linear-gradient(135deg, ${stock.color}30, ${stock.color}18)`,
          border: `1px solid ${stock.color}40`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, fontWeight: 800, color: stock.color,
          boxShadow: `0 0 14px ${stock.color}22`,
        }}>
          {stock.logo}
        </div>
        <div style={{ textAlign: isLeft ? "left" : "right" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>{stock.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600, marginTop: 1 }}>{stock.ticker}</div>
        </div>
      </div>
 
      {/* Price */}
      <div style={{ textAlign: isLeft ? "left" : "right" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#fff", letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>
          {stock.price}
        </div>
      </div>
 
      {/* Tags */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: isLeft ? "flex-start" : "flex-end", gap: 6 }}>
        <div style={{
          padding: "4px 10px", borderRadius: 7,
          background: `${recColor(stock.rec)}18`,
          border: `1px solid ${recColor(stock.rec)}30`,
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: recColor(stock.rec), letterSpacing: "0.04em" }}>{stock.rec}</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>Confidence</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: recColor(stock.rec) }}>{stock.confidence}%</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>Risk</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: riskColor(stock.risk) }}>{stock.risk}</span>
        </div>
      </div>
    </div>
  );
}
 
// ─── Main Component ────────────────────────────────────────────────────────────
 
export default function AIStockComparison() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [comparing, setComparing] = useState(false);
  const [compared, setCompared] = useState(null);
  const [compData, setCompData] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [hoverDetail, setHoverDetail] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const inputRef = useRef(null);
 
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.05 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
 
  const handleQuery = (val) => {
    setQuery(val);
    if (val.length < 1) { setSuggestions([]); return; }
    const q = val.toLowerCase();
    setSuggestions(SUGGESTIONS.filter(s =>
      s.name.toLowerCase().includes(q) || s.ticker.toLowerCase().includes(q)
    ).slice(0, 5));
  };
 
  const pick = (stock) => {
    setSelected(stock);
    setQuery(stock.name);
    setSuggestions([]);
  };
 
  const clear = () => {
    setSelected(null);
    setQuery("");
    setSuggestions([]);
    setCompared(null);
    setCompData(null);
    setShowResult(false);
    inputRef.current?.focus();
  };
 
  const runCompare = async () => {
    if (!selected) return;
    setComparing(true);
    setShowResult(false);
    await new Promise(r => setTimeout(r, 1100));
    setCompared(selected);
    setCompData(getComparison(selected.ticker));
    setComparing(false);
    setShowResult(true);
  };
 
  const winnerStock = compData && compared
    ? (compData.winner === "TSLA" ? BASE_STOCK : compared)
    : null;
 
  return (
    <>
      <style>{`
        @keyframes ac-fade { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes ac-spin { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes ac-pop  { 0% { opacity:0; transform:scale(0.92) translateY(8px); } 100% { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes ac-glow { 0%,100% { box-shadow:0 0 20px rgba(34,197,94,0.15); } 50% { box-shadow:0 0 36px rgba(34,197,94,0.28); } }
        @keyframes ac-vs   { 0%,100% { text-shadow:0 0 20px rgba(34,197,94,0.5); } 50% { text-shadow:0 0 40px rgba(34,197,94,0.9); } }
        @keyframes ac-slide { from { opacity:0; transform:translateX(-6px); } to { opacity:1; transform:translateX(0); } }
 
        .ac-fade { animation: ac-fade 0.5s cubic-bezier(0.25,1,0.5,1) both; }
        .ac-pop  { animation: ac-pop  0.55s cubic-bezier(0.25,1,0.5,1) both; }
        .ac-vs   { animation: ac-vs 2.2s ease-in-out infinite; }
        .ac-glow { animation: ac-glow 2.5s ease-in-out infinite; }
        .ac-slide { animation: ac-slide 0.3s cubic-bezier(0.25,1,0.5,1) both; }
 
        .ac-sug:hover { background: rgba(34,197,94,0.07) !important; }
        .ac-chip:hover { background: rgba(255,255,255,0.07) !important; border-color: rgba(34,197,94,0.3) !important; color: #22c55e !important; }
        .ac-row:hover { background: rgba(255,255,255,0.025) !important; }
 
        .ac-spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.15);
          border-top-color: #22c55e;
          animation: ac-spin 0.7s linear infinite;
        }
 
        @media (max-width: 820px) {
          .ac-cards { flex-direction: column !important; }
          .ac-bars  { grid-template-columns: 1fr !important; }
          .ac-search-row { flex-direction: column !important; }
        }
      `}</style>
 
      <section ref={ref} style={{ width: "100%", opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}>
        <div style={{
          background: "rgba(255,255,255,0.022)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 18,
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          overflow: "hidden",
        }}>
 
          {/* ── HEADER ──────────────────────────────────────────────────── */}
          <div style={{
            padding: "18px 24px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.055)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Zap size={15} color="#22c55e" strokeWidth={2.3} />
                <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "-0.015em" }}>
                  AI Stock Comparison
                </span>
              </div>
              <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.32)", marginTop: 3, fontWeight: 400 }}>
                Compare your current stock with another investment using AI
              </p>
            </div>
            <div style={{
              padding: "5px 12px", borderRadius: 99,
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.2)",
              fontSize: 11, fontWeight: 650, color: "#22c55e", letterSpacing: "0.04em",
            }}>
              AI Powered
            </div>
          </div>
 
          {/* ── SEARCH AREA ─────────────────────────────────────────────── */}
          {!showResult && (
            <div style={{ padding: "20px 24px 0" }}>
              <div className="ac-search-row" style={{ display: "flex", alignItems: "center", gap: 12 }}>
 
                {/* Current stock badge */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 16px",
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 12, flexShrink: 0,
                  minWidth: 130,
                }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(239,68,68,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: "#ef4444" }}>T</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Tesla</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>TSLA · Current</div>
                  </div>
                </div>
 
                {/* VS */}
                <div style={{ flexShrink: 0, fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>VS</div>
 
                {/* Search box */}
                <div style={{ flex: 1, position: "relative" }}>
                  <div style={{
                    display: "flex", alignItems: "center",
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${selected ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: 12, padding: "0 14px", gap: 10,
                    transition: "border-color 0.2s ease",
                    boxShadow: selected ? "0 0 16px rgba(34,197,94,0.08)" : "none",
                  }}>
                    {selected
                      ? <div style={{ width: 22, height: 22, borderRadius: 5, background: `${selected.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: selected.color }}>{selected.logo}</div>
                      : <Search size={14} color="rgba(255,255,255,0.3)" />
                    }
                    <input
                      ref={inputRef}
                      value={query}
                      onChange={e => handleQuery(e.target.value)}
                      onFocus={() => !selected && query.length > 0 && handleQuery(query)}
                      placeholder="Search company or ticker..."
                      style={{
                        flex: 1, background: "none", border: "none", outline: "none",
                        color: "#fff", fontSize: 13, fontWeight: 500, padding: "11px 0",
                        caretColor: "#22c55e",
                      }}
                    />
                    {(query || selected) && (
                      <button onClick={clear} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", opacity: 0.4, color: "#fff" }}>
                        <X size={13} />
                      </button>
                    )}
                  </div>
 
                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
                      background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12,
                      overflow: "hidden", backdropFilter: "blur(20px)",
                      boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
                    }}
                    className="ac-fade">
                      {suggestions.map((s, i) => (
                        <div
                          key={s.ticker}
                          className="ac-sug"
                          onClick={() => pick(s)}
                          style={{
                            display: "flex", alignItems: "center", gap: 10,
                            padding: "10px 14px",
                            borderBottom: i < suggestions.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                            cursor: "pointer", transition: "background 0.12s ease",
                            animation: `ac-slide 0.2s ease both`,
                            animationDelay: `${i * 0.04}s`,
                          }}
                        >
                          <div style={{ width: 28, height: 28, borderRadius: 7, background: `${s.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: s.color, flexShrink: 0 }}>{s.logo}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{s.name}</div>
                            <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>{s.ticker} · {s.price}</div>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: recColor(s.rec), padding: "2px 7px", borderRadius: 5, background: `${recColor(s.rec)}15` }}>{s.rec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
 
                {/* Compare Button */}
                <button
                  disabled={!selected || comparing}
                  onMouseEnter={() => selected && setHoverBtn(true)}
                  onMouseLeave={() => setHoverBtn(false)}
                  onClick={runCompare}
                  style={{
                    padding: "11px 22px", borderRadius: 12, border: "none",
                    background: selected
                      ? `linear-gradient(135deg, #22c55e, #16a34a)`
                      : "rgba(255,255,255,0.06)",
                    color: selected ? "#fff" : "rgba(255,255,255,0.25)",
                    fontSize: 13, fontWeight: 700, cursor: selected ? "pointer" : "not-allowed",
                    display: "flex", alignItems: "center", gap: 8,
                    boxShadow: hoverBtn && selected ? "0 0 24px rgba(34,197,94,0.35)" : "none",
                    transform: hoverBtn && selected ? "translateY(-1px)" : "translateY(0)",
                    transition: "all 0.18s ease",
                    flexShrink: 0, whiteSpace: "nowrap",
                  }}
                >
                  {comparing
                    ? <><div className="ac-spinner" /> Analyzing...</>
                    : <>Compare <ArrowRight size={13} /></>
                  }
                </button>
              </div>
 
              {/* Recent */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0 20px", flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 500, flexShrink: 0 }}>Recent:</span>
                {RECENT.map(name => {
                  const s = SUGGESTIONS.find(x => x.name === name);
                  return s ? (
                    <button
                      key={name}
                      className="ac-chip"
                      onClick={() => pick(s)}
                      style={{
                        padding: "4px 12px", borderRadius: 99,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.09)",
                        color: "rgba(255,255,255,0.45)",
                        fontSize: 11.5, fontWeight: 600, cursor: "pointer",
                        transition: "all 0.14s ease",
                      }}
                    >
                      Tesla vs {name}
                    </button>
                  ) : null;
                })}
              </div>
            </div>
          )}
 
          {/* ── RESULT ──────────────────────────────────────────────────── */}
          {showResult && compared && compData && (
            <div className="ac-pop" style={{ padding: "20px 24px 22px" }}>
 
              {/* Stock cards */}
              <div className="ac-cards" style={{ display: "flex", alignItems: "stretch", gap: 0, position: "relative", marginBottom: 18 }}>
                <StockCard stock={BASE_STOCK} align="left" animate={showResult} />
 
                {/* VS center */}
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  padding: "0 16px", flexShrink: 0, zIndex: 2,
                }}>
                  <div style={{
                    width: 1, flex: 1,
                    background: "linear-gradient(to bottom, transparent, rgba(34,197,94,0.3), transparent)",
                  }} />
                  <div
                    className="ac-vs"
                    style={{
                      fontSize: 18, fontWeight: 900, color: "#22c55e",
                      letterSpacing: "0.05em", padding: "10px 0",
                    }}
                  >
                    VS
                  </div>
                  <div style={{
                    width: 1, flex: 1,
                    background: "linear-gradient(to bottom, transparent, rgba(34,197,94,0.3), transparent)",
                  }} />
                </div>
 
                <StockCard stock={compared} align="right" animate={showResult} />
              </div>
 
              {/* AI Summary */}
              <div style={{
                padding: "16px 18px",
                background: "rgba(255,255,255,0.018)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 12, marginBottom: 14,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                  <Zap size={11} color="#22c55e" />
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.28)", letterSpacing: "0.09em", textTransform: "uppercase" }}>
                    AI Analysis
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {compData.summary.map((s, i) => (
                    <p key={i} style={{
                      fontSize: 12.5, color: i === 2 ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.48)",
                      lineHeight: 1.6, margin: 0,
                      fontWeight: i === 2 ? 500 : 400,
                    }}>{s}</p>
                  ))}
                </div>
              </div>
 
              {/* Winner + Bars */}
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
 
                {/* Winner */}
                <div
                  className="ac-glow"
                  style={{
                    padding: "14px 16px",
                    background: "rgba(34,197,94,0.06)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: 12, flexShrink: 0, minWidth: 180,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <Trophy size={13} color="#22c55e" />
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                      Better Investment
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 8, background: `${winnerStock.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: winnerStock.color }}>
                      {winnerStock.logo}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 750, color: "#fff", letterSpacing: "-0.01em" }}>{winnerStock.name}</div>
                      <div style={{ fontSize: 10.5, color: "#22c55e", fontWeight: 700 }}>{compData.winnerConf}% Confidence</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {compData.reasons.map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 5 }}>
                        <span style={{ color: "#22c55e", fontSize: 10, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>✓</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
 
                {/* Progress bars */}
                <div className="ac-bars" style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
                  {compData.bars.map((bar, i) => (
                    <CompareBarWithTicker
                      key={bar.label}
                      label={bar.label}
                      aVal={bar.a} bVal={bar.b}
                      aColor={BASE_STOCK.color} bColor={compared.color}
                      bTicker={compared.ticker}
                      delay={200 + i * 100}
                    />
                  ))}
                </div>
              </div>
 
              {/* Footer row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.055)" }}>
                <button
                  onClick={clear}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 12, color: "rgba(255,255,255,0.3)", fontWeight: 500,
                    display: "flex", alignItems: "center", gap: 5,
                  }}
                >
                  ← New Comparison
                </button>
 
                <button
                  onMouseEnter={() => setHoverDetail(true)}
                  onMouseLeave={() => setHoverDetail(false)}
                  style={{
                    padding: "8px 16px", borderRadius: 10,
                    border: `1px solid ${hoverDetail ? "rgba(34,197,94,0.38)" : "rgba(255,255,255,0.08)"}`,
                    background: hoverDetail ? "rgba(34,197,94,0.07)" : "transparent",
                    color: hoverDetail ? "#22c55e" : "rgba(255,255,255,0.4)",
                    fontSize: 12, fontWeight: 650, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 5,
                    transition: "all 0.18s ease",
                  }}
                >
                  View Detailed Report
                  <ArrowRight
                    size={12}
                    style={{ transform: hoverDetail ? "translateX(3px)" : "translateX(0)", transition: "transform 0.2s ease" }}
                  />
                </button>
              </div>
            </div>
          )}
 
        </div>
      </section>
    </>
  );
}
