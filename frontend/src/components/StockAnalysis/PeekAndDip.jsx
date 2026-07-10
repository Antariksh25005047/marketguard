import React, { useState } from "react";
import { Brain, TrendingUp, TrendingDown, CheckCircle2, ArrowRight } from "lucide-react";

/**
 * PeakAndDip.jsx
 * ---------------------------------------------------------------
 * Compact "AI Market Insight" card placed directly below the
 * Stock Chart on the Stock Analysis page. Not a standalone page.
 *
 * Props:
 *   spikeAnalysis: {
 *     direction:  string   // e.g. "High Dip" | "High Spike"
 *     confidence: number   // 0-100
 *     headline:   string
 *     reasons:    string[]
 *     source:     string
 *   }
 * ---------------------------------------------------------------
 */

const COLORS = {
  green: "#22c55e",
  greenSoft: "rgba(34, 197, 94, 0.12)",
  red: "#ef4444",
  redSoft: "rgba(239, 68, 68, 0.12)",
  border: "rgba(255, 255, 255, 0.08)",
  borderHover: "rgba(255, 255, 255, 0.16)",
  textPrimary: "#f5f5f5",
  textSecondary: "#a1a1aa",
  textMuted: "#6b7280",
};

export default function PeakAndDip({ spikeAnalysis, onViewFullAnalysis }) {
    console.log("PeakAndDip Data:", spikeAnalysis);
  const [hovered, setHovered] = useState(false);

 const {
  direction = "High Spike",
  confidence = 0,
  headline = "",
  reasons = [],
  source = "",
  url = "",
} = spikeAnalysis || {};

  const isDip = direction.toLowerCase().includes("dip");
  const accent = isDip ? COLORS.red : COLORS.green;
  const accentSoft = isDip ? COLORS.redSoft : COLORS.greenSoft;
  const DirectionIcon = isDip ? TrendingDown : TrendingUp;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.card,
        borderColor: hovered ? COLORS.borderHover : COLORS.border,
        boxShadow: hovered
          ? `0 8px 28px rgba(0,0,0,0.35), 0 0 0 1px ${accent}22`
          : "0 4px 16px rgba(0,0,0,0.25)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* Header row */}
      <div style={styles.headerRow}>
        <div style={styles.headerLeft}>
          <Brain size={15} strokeWidth={2.2} color={accent} />
          <span style={styles.headerLabel}>AI Market Insight</span>
        </div>
        <div
          style={{
            ...styles.confidenceBadge,
            borderColor: `${accent}55`,
            color: accent,
            background: accentSoft,
          }}
        >
          {confidence}%
        </div>
      </div>

      {/* Direction */}
      <div style={styles.directionRow}>
        <DirectionIcon size={15} strokeWidth={2.4} color={accent} />
        <span style={{ ...styles.directionText, color: accent }}>
          {direction} Detected
        </span>
      </div>

      {/* Headline */}
      <p style={styles.headline} title={headline}>
        &ldquo;{headline}&rdquo;
      </p>

      {/* Reasons */}
      <div style={styles.reasonsList}>
        {reasons.slice(0, 3).map((reason, i) => (
          <div key={i} style={styles.reasonRow}>
            <CheckCircle2 size={13} strokeWidth={2.4} color={accent} style={{ flexShrink: 0 }} />
            <span style={styles.reasonText} title={reason}>
              {reason}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={styles.footerRow}>
        <span style={styles.sourceText}>
          Source: <span style={{ color: COLORS.textSecondary }}>{source}</span>
        </span>

        <button
            type="button"
            onClick={() => window.open(url, "_blank")}
          style={{
            ...styles.viewBtn,
            color: accent,
            gap: hovered ? 7 : 5,
          }}
        >
          View Full Analysis
          <ArrowRight size={13} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    width: "100%",
    maxHeight: 220,
    boxSizing: "border-box",
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: "16px 18px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    color: "#f5f5f5",
    transition:
      "transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease, border-color 0.3s ease",
    cursor: "default",
  },
  headerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: 7,
  },
  headerLabel: {
    fontSize: 12.5,
    fontWeight: 700,
    letterSpacing: "0.03em",
    textTransform: "uppercase",
    color: "#a1a1aa",
  },
  confidenceBadge: {
    fontSize: 12,
    fontWeight: 700,
    padding: "3px 10px",
    borderRadius: 999,
    border: "1px solid",
    lineHeight: 1.4,
  },
  directionRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  directionText: {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.01em",
  },
  headline: {
    fontSize: 13,
    color: "#e5e5e5",
    margin: 0,
    fontStyle: "italic",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  reasonsList: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  reasonRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  reasonText: {
    fontSize: 12.5,
    color: "#d4d4d8",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  footerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    paddingTop: 8,
    borderTop: "1px solid rgba(255,255,255,0.06)",
  },
  sourceText: {
    fontSize: 11.5,
    color: "#6b7280",
  },
  viewBtn: {
    display: "inline-flex",
    alignItems: "center",
    background: "none",
    border: "none",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
    padding: 0,
    transition: "gap 0.25s ease",
  },
};
