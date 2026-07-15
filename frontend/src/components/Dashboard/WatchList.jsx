// import React, { useMemo, useState } from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Star,
  Search,
  Plus,
  TrendingUp,
  TrendingDown,
  BarChart3,
  X,
  ArrowUpRight,
  Newspaper,
  Clock,
} from "lucide-react";

/**
 * Watchlist.jsx
 * ---------------------------------------------------------------
 * Redesigned "My Watchlist" section for MarketGuard AI.
 * A dashboard-style list (not a card grid) — every stock is a
 * single premium row: 40% stock info | 60% latest news panel.
 *
 * This file is self-contained with realistic sample data so it
 * renders as-is. Swap `DEFAULT_WATCHLIST` for real data by
 * passing a `stocks` prop of the same shape.
 * ---------------------------------------------------------------
 */

const C = {
  bg: "#050505",
  bg2: "#0a0a0a",
  glass: "rgba(255,255,255,0.035)",
  glassHover: "rgba(255,255,255,0.055)",
  border: "rgba(255,255,255,0.08)",
  borderHover: "rgba(255,255,255,0.16)",
  white: "#f5f5f5",
  gray1: "#a1a1aa",
  gray2: "#71717a",
  gray3: "#52525b",
  green: "#22c55e",
  greenSoft: "rgba(34,197,94,0.12)",
  red: "#ef4444",
  redSoft: "rgba(239,68,68,0.12)",
  yellow: "#eab308",
  yellowSoft: "rgba(234,179,8,0.12)",
};

const RECOMMENDATION_STYLES = {
  BUY: { color: C.green, soft: C.greenSoft, ring: "rgba(34,197,94,0.45)" },
  HOLD: { color: C.yellow, soft: C.yellowSoft, ring: "rgba(234,179,8,0.45)" },
  SELL: { color: C.red, soft: C.redSoft, ring: "rgba(239,68,68,0.45)" },
};

const SENTIMENT_META = {
  positive: { dot: "🟢", color: C.green, soft: C.greenSoft },
  negative: { dot: "🔴", color: C.red, soft: C.redSoft },
  neutral: { dot: "⚪", color: C.gray1, soft: "rgba(255,255,255,0.06)" },
};

const DEFAULT_WATCHLIST = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    logo: "🟢",
    price: 1187.42,
    changePct: 3.42,
    prevClose: 1148.1,
    volume: "48.2M",
    marketCap: "$2.92T",
    recommendation: "BUY",
    news: [
      {
        headline: "NVIDIA launches next generation AI chips",
        source: "Reuters",
        time: "2 hours ago",
        sentiment: "positive",
        confidence: 92,
      },
      {
        headline: "US restricts AI chip exports to select regions",
        source: "Bloomberg",
        time: "5 hours ago",
        sentiment: "negative",
        confidence: 84,
      },
      {
        headline: "Morgan Stanley upgrades NVIDIA price target",
        source: "CNBC",
        time: "8 hours ago",
        sentiment: "positive",
        confidence: 95,
      },
    ],
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    logo: "🔵",
    price: 3842.15,
    changePct: -1.86,
    prevClose: 3914.3,
    volume: "2.1M",
    marketCap: "₹14.1T",
    recommendation: "HOLD",
    news: [
      {
        headline: "TCS falls after weak Q1 revenue outlook",
        source: "Business Standard",
        time: "1 hour ago",
        sentiment: "negative",
        confidence: 78,
      },
      {
        headline: "TCS announces new AI partnership with Nvidia",
        source: "Economic Times",
        time: "6 hours ago",
        sentiment: "positive",
        confidence: 81,
      },
      {
        headline: "Analysts remain neutral ahead of earnings call",
        source: "Mint",
        time: "10 hours ago",
        sentiment: "neutral",
        confidence: 67,
      },
    ],
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    logo: "⚪",
    price: 246.08,
    changePct: -4.21,
    prevClose: 256.9,
    volume: "112.4M",
    marketCap: "$784B",
    recommendation: "SELL",
    news: [
      {
        headline: "Tesla misses delivery estimates for Q2",
        source: "Reuters",
        time: "3 hours ago",
        sentiment: "negative",
        confidence: 89,
      },
      {
        headline: "Musk teases new affordable EV model",
        source: "CNBC",
        time: "7 hours ago",
        sentiment: "positive",
        confidence: 73,
      },
      {
        headline: "Analysts split on near-term price target",
        source: "Barron's",
        time: "12 hours ago",
        sentiment: "neutral",
        confidence: 61,
      },
    ],
  },
];

export default function Watchlist({
  stocks = DEFAULT_WATCHLIST,
  onAddStock,
  onViewAnalysis,
  onRemoveStock,
  onReadArticle,
}) {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [query, setQuery] = useState("");
  const [hoveredRow, setHoveredRow] = useState(null);
  useEffect(() => {
  async function fetchWatchlist() {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/watchlist/1"
      );

      const data = await res.json();

      console.log(data.watchlist);

      setWatchlist(data.watchlist);
    } catch (err) {
      console.error(err);
    }
  }

  fetchWatchlist();
}, []);

  const filtered = useMemo(() => {

    const q = query.trim().toLowerCase();
    if (!q) return watchlist;
    return watchlist.filter(
      (s) =>
    s.symbol.toLowerCase().includes(q) ||
    s.companyName.toLowerCase().includes(q)
  );
  }, [watchlist, query]);

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes wlFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes wlSlideUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes wlPulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }

        .wl-fade { animation: wlFadeIn 0.5s ease both; }

        .wl-row {
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease;
        }
        .wl-row:hover {
          transform: translateY(-3px);
          border-color: rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.045);
          box-shadow: 0 16px 40px rgba(0,0,0,0.45);
        }

        .wl-news-item {
          transition: background 0.25s ease, border-color 0.25s ease;
        }
        .wl-news-item:hover {
          background: rgba(255,255,255,0.04);
          border-color: rgba(255,255,255,0.12);
        }

        .wl-btn {
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }
        .wl-btn-primary:hover {
          box-shadow: 0 0 0 1px rgba(34,197,94,0.4), 0 8px 24px rgba(34,197,94,0.28);
          transform: translateY(-1px);
        }
        .wl-btn-ghost:hover {
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.06);
        }
        .wl-btn-danger:hover {
          border-color: rgba(239,68,68,0.4);
          color: #ef4444 !important;
          background: rgba(239,68,68,0.08);
        }
        .wl-view-all {
          color: #a1a1aa;
        }
        .wl-view-all:hover {
          gap: 7px !important;
          color: #22c55e !important;
        }
        .wl-search-input:focus {
          border-color: rgba(34,197,94,0.4) !important;
          background: rgba(255,255,255,0.05) !important;
        }
        .wl-badge-glow {
          animation: wlPulse 2.6s ease-in-out infinite;
        }

        @media (max-width: 980px) {
          .wl-row-inner { flex-direction: column !important; }
          .wl-left { width: 100% !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08) !important; }
          .wl-right { width: 100% !important; }
          .wl-header-row { flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
          .wl-header-actions { width: 100% !important; }
        }
        @media (max-width: 560px) {
          .wl-search-input { width: 100% !important; }
          .wl-header-actions { flex-direction: column !important; }
        }
      `}</style>

      <div style={styles.container} className="wl-fade">
        {/* ===================== HEADER ===================== */}
        <div className="wl-header-row" style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>
              <Star size={26} strokeWidth={2.2} color={C.green} fill={C.green} />
              My Watchlist
            </h1>
            <p style={styles.subtitle}>
              Track your saved stocks with live prices, AI recommendations and
              personalized news.
            </p>
          </div>

          <div className="wl-header-actions" style={styles.headerActions}>
            <div style={styles.searchWrap}>
              <Search size={15} strokeWidth={2.2} color={C.gray2} style={styles.searchIcon} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search watchlist"
                className="wl-search-input"
                style={styles.searchInput}
              />
            </div>

            <button
              type="button"
              onClick={onAddStock}
              className="wl-btn wl-btn-primary"
              style={styles.addBtn}
            >
              <Plus size={16} strokeWidth={2.4} />
              Add Stock
            </button>
          </div>
        </div>

        {/* ===================== ROWS ===================== */}
        <div style={styles.rowsWrap}>
          {filtered.length === 0 ? (
            <div style={styles.emptyState}>
              No stocks match &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.slice(0,4).map((stock, idx) => {
              const recommendation = stock.recommendation || "HOLD";
              const rec =
                RECOMMENDATION_STYLES[recommendation] ||
                RECOMMENDATION_STYLES.HOLD;

              const changePct = (
                ((stock.price - stock.previousClose) / stock.previousClose) * 100
              ).toFixed(2);

              const isUp = Number(changePct) >= 0;

              return (
                <div
                  key={stock.symbol}
                  className="wl-row"
                  style={{
                    ...styles.row,
                    animation: `wlSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) ${
                      idx * 0.08
                    }s both`,
                  }}
                  onMouseEnter={() => setHoveredRow(stock.symbol)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <div className="wl-row-inner" style={styles.rowInner}>
                    {/* -------- LEFT: Stock Info (40%) -------- */}
                    <div className="wl-left" style={styles.left}>
                      <div style={styles.leftTop}>
                        <div style={styles.logoWrap}>{stock.symbol[0]}</div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={styles.symbolRow}>
                            <span style={styles.symbol}>{stock.symbol}</span>
                            <span
                              className="wl-badge-glow"
                              style={{
                                ...styles.recBadge,
                                color: rec.color,
                                background: rec.soft,
                                border: `1px solid ${rec.color}55`,
                                boxShadow: `0 0 14px ${rec.ring}`,
                              }}
                            >
                              {recommendation}
                            </span>
                          </div>
                          <div style={styles.name}>{stock.companyName}</div>
                        </div>
                      </div>

                      <div style={styles.priceRow}>
                        <span style={styles.price}>
                          {typeof stock.price === "number"
                            ? stock.price.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : stock.price}
                        </span>
                        <span
                          style={{
                            ...styles.changePct,
                            color: isUp ? C.green : C.red,
                            background: isUp ? C.greenSoft : C.redSoft,
                          }}
                        >
                          {isUp ? (
                            <TrendingUp size={12} strokeWidth={2.6} />
                          ) : (
                            <TrendingDown size={12} strokeWidth={2.6} />
                          )}
                          {isUp ? "+" : ""}
                          {changePct}%
                        </span>
                      </div>

                      <div style={styles.actionsRow}>
                        <button
                          type="button"
                          onClick={() => navigate(`/stock-analysis/${stock.symbol}`)}
                          className="wl-btn wl-btn-ghost"
                          style={styles.viewBtn}
                        >
                          <BarChart3 size={13} strokeWidth={2.3} />
                          View Analysis
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveStock && onRemoveStock(stock)}
                          className="wl-btn wl-btn-danger"
                          style={styles.removeBtn}
                        >
                          <X size={13} strokeWidth={2.3} />
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* -------- RIGHT: News Panel (60%) -------- */}
                    <div className="wl-right" style={styles.right}>
                      <div style={styles.newsHeader}>
                        <Newspaper size={13} strokeWidth={2.2} color={C.gray1} />
                        <span style={styles.newsHeaderText}>Latest News</span>
                      </div>

                      <div style={styles.newsList}>
                        {(stock.news ?? []).slice(0, 2).map((item, i) => {
                          const sm =
                            SENTIMENT_META[item.sentiment] ||
                            SENTIMENT_META.neutral;
                          return (
                            <div
                              key={i}
                              className="wl-news-item"
                              style={styles.newsItem}
                              onClick={() =>
                                window.open(
                                    `https://news.google.com/search?q=${stock.symbol}`,
                                    "_blank"
                                )
                            }
                            >
                              <div style={styles.newsItemTop}>
                                <span style={styles.sentimentDot}>{sm.dot}</span>
                                <span style={styles.newsHeadline} title={item.headline}>
                                  {item.headline}
                                </span>
                              </div>
                              <div style={styles.newsMetaRow}>
                                <span style={styles.newsSource}>{item.source}</span>
                                <span style={styles.newsDot}>•</span>
                                <span style={styles.newsTime}>
                                  <Clock size={10} strokeWidth={2.4} />
                                  {item.time}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          window.open(
                              `https://news.google.com/search?q=${stock.symbol}`,
                              "_blank"
                          )
                      }
                        className="wl-btn wl-view-all"
                        style={styles.viewAllLink}
                      >
                        View All News
                        <ArrowUpRight size={12} strokeWidth={2.6} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    background: C.bg,
    backgroundImage:
      "radial-gradient(circle at 10% 0%, rgba(34,197,94,0.05) 0%, transparent 45%)",
    color: C.white,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    boxSizing: "border-box",
    padding: "44px 32px 80px",
  },
  container: {
    maxWidth: 1280,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 32,
  },

  /* Header */
  headerRow: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 24,
  },
  title: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: "clamp(26px, 3.2vw, 34px)",
    fontWeight: 700,
    letterSpacing: "-0.03em",
    margin: "0 0 8px 0",
    color: C.white,
  },
  subtitle: {
    fontSize: 14.5,
    color: C.gray1,
    margin: 0,
    maxWidth: 480,
    lineHeight: 1.6,
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  searchWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: 13,
  },
  searchInput: {
    width: 220,
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "10px 14px 10px 36px",
    fontSize: 13.5,
    color: C.white,
    outline: "none",
    fontFamily: "inherit",
    transition: "border-color 0.25s ease, background 0.25s ease",
  },
  addBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    background: C.green,
    border: `1px solid ${C.green}`,
    color: "#03110a",
    fontSize: 13.5,
    fontWeight: 700,
    padding: "10px 18px",
    borderRadius: 10,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  /* Rows */
  rowsWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  emptyState: {
    padding: "48px 0",
    textAlign: "center",
    color: C.gray2,
    fontSize: 14,
  },
  row: {
    background: C.glass,
    border: `1px solid ${C.border}`,
    borderRadius: 20,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    overflow: "hidden",
  },
  rowInner: {
    display: "flex",
    alignItems: "stretch",
  },

  /* Left panel */
  left: {
    width: "40%",
    boxSizing: "border-box",
    padding: "16px 20px",
    borderRight: `1px solid ${C.border}`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 10,
  },
  leftTop: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  },
  logoWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "rgba(255,255,255,0.05)",
    border: `1px solid ${C.border}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    flexShrink: 0,
  },
  symbolRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  symbol: {
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: "-0.01em",
    color: C.white,
  },
  recBadge: {
    fontSize: 10.5,
    fontWeight: 800,
    letterSpacing: "0.06em",
    padding: "3px 9px",
    borderRadius: 999,
  },
  name: {
    fontSize: 13,
    color: C.gray1,
    marginTop: 2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 8,
  },
  price: {
    fontSize: 21,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    color: C.white,
    fontVariantNumeric: "tabular-nums",
  },
  changePct: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    fontSize: 12,
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: 999,
  },
  actionsRow: {
    display: "flex",
    gap: 8,
  },
  viewBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "rgba(34,197,94,0.08)",
    border: `1px solid rgba(34,197,94,0.28)`,
    color: C.green,
    fontSize: 12,
    fontWeight: 700,
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },
  removeBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    background: "rgba(255,255,255,0.03)",
    border: `1px solid ${C.border}`,
    color: C.gray1,
    fontSize: 12,
    fontWeight: 700,
    padding: "6px 12px",
    borderRadius: 8,
    cursor: "pointer",
  },

  /* Right panel */
  right: {
    width: "60%",
    boxSizing: "border-box",
    padding: "14px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 6,
  },
  newsHeader: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    marginBottom: 2,
  },
  newsHeaderText: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: C.gray2,
  },
  newsList: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  newsItem: {
    padding: "7px 9px",
    borderRadius: 9,
    border: "1px solid transparent",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    cursor: "pointer",
  },
  newsItemTop: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  sentimentDot: {
    fontSize: 11,
    lineHeight: 1,
    flexShrink: 0,
  },
  newsHeadline: {
    fontSize: 13,
    fontWeight: 600,
    color: C.white,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  newsMetaRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    color: C.gray2,
    paddingLeft: 17,
  },
  newsSource: {
    color: C.gray1,
    fontWeight: 600,
  },
  newsDot: {
    color: C.gray3,
  },
  newsTime: {
    display: "inline-flex",
    alignItems: "center",
    gap: 3,
  },
  viewAllLink: {
    alignSelf: "flex-end",
    display: "inline-flex",
    alignItems: "center",
    gap: 3,
    background: "none",
    border: "none",
    color: C.gray1,
    fontSize: 11.5,
    fontWeight: 700,
    cursor: "pointer",
    padding: "2px 0 0",
    marginTop: 2,
    transition: "gap 0.2s ease, color 0.2s ease",
  },
};
