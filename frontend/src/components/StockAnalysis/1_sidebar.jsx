import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Eye,
  Globe,
  ScanSearch,
  BrainCircuit,
  Newspaper,
  Briefcase,
  Bell,
  Settings,
  ShieldCheck,
  Menu,
  X,
  ChevronsLeft,
  Sparkles,
} from "lucide-react";

/**
 * Sidebar
 * ----------------------------------------------------------------
 * Fixed, premium institutional navigation sidebar for MarketGuard
 * AI. Used across the entire application (Dashboard, Stock
 * Analysis, Watchlist, Portfolio, Market Overview, and more).
 *
 * Desktop : fixed 260px sidebar, always visible.
 * Tablet  : collapsible icon-rail sidebar (toggle to expand).
 * Mobile  : hamburger trigger opens a slide-in drawer with overlay.
 * ----------------------------------------------------------------
 */

const EMERALD = "#22c55e";
const BRIGHT_EMERALD = "#4ade80";
const SIDEBAR_BG = "#080808";
const BORDER = "rgba(255,255,255,0.08)";
const GLASS = "rgba(255,255,255,0.03)";
const TEXT_SECONDARY = "#9ca3af";
const TEXT_MUTED = "#6b7280";

const FONT =
  "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "watchlist", label: "Watchlist", icon: Eye },
  { id: "market-overview", label: "Market Overview", icon: Globe },
  { id: "stock-screener", label: "Stock Screener", icon: ScanSearch },
  { id: "ai-analysis", label: "AI Analysis", icon: BrainCircuit },
  { id: "news-insights", label: "News & Insights", icon: Newspaper },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "settings", label: "Settings", icon: Settings },
];

/* ------------------------------------------------------------------ */
/* Logo                                                                */
/* ------------------------------------------------------------------ */

function Logo({ collapsed }) {
  return (
    <div className="flex items-center gap-3 px-1">
      <div
        className="relative flex items-center justify-center rounded-xl shrink-0"
        style={{
          width: 38,
          height: 38,
          background: "rgba(34,197,94,0.12)",
          border: `1px solid rgba(34,197,94,0.35)`,
          boxShadow: `0 0 22px rgba(34,197,94,0.35)`,
        }}
      >
        <ShieldCheck size={20} color={BRIGHT_EMERALD} strokeWidth={2.2} />
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2 }}
            className="text-[15px] font-semibold tracking-tight whitespace-nowrap"
            style={{ color: "#ffffff", letterSpacing: "-0.01em" }}
          >
            MarketGuard AI
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Nav item                                                            */
/* ------------------------------------------------------------------ */

function NavItem({ item, isActive, collapsed, onClick }) {
  const Icon = item.icon;
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={collapsed ? item.label : undefined}
      className="relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300 ease-out"
      style={{
        background: isActive
          ? "rgba(34,197,94,0.12)"
          : hovered
          ? "rgba(255,255,255,0.04)"
          : "transparent",
        border: `1px solid ${isActive ? "rgba(34,197,94,0.3)" : "transparent"}`,
        transform: isActive
          ? "scale(1.02)"
          : hovered
          ? "translateX(3px)"
          : "translateX(0px)",
        justifyContent: collapsed ? "center" : "flex-start",
      }}
    >
      {/* Left accent indicator */}
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full"
          style={{
            width: 3,
            height: 18,
            background: BRIGHT_EMERALD,
            boxShadow: `0 0 8px rgba(74,222,128,0.7)`,
          }}
        />
      )}

      <Icon
        size={19}
        strokeWidth={2}
        color={isActive ? EMERALD : hovered ? "#d1d5db" : TEXT_SECONDARY}
        className="shrink-0 transition-colors duration-300"
      />

      <AnimatePresence>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-[13.5px] font-medium whitespace-nowrap"
            style={{ color: isActive ? EMERALD : hovered ? "#e5e7eb" : TEXT_SECONDARY }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Upgrade card                                                        */
/* ------------------------------------------------------------------ */

function UpgradeCard({ collapsed }) {
  const [hovered, setHovered] = useState(false);

  if (collapsed) {
    return (
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        title="Upgrade to Pro"
        className="flex items-center justify-center w-full rounded-xl py-2.5 transition-all duration-300"
        style={{
          background: "rgba(34,197,94,0.12)",
          border: `1px solid rgba(34,197,94,0.3)`,
          boxShadow: hovered ? `0 0 20px rgba(34,197,94,0.35)` : "none",
        }}
      >
        <Sparkles size={18} color={BRIGHT_EMERALD} />
      </button>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-xl border px-4 py-4 overflow-hidden transition-all duration-300"
      style={{
        background:
          "linear-gradient(135deg, rgba(34,197,94,0.14), rgba(255,255,255,0.02))",
        borderColor: "rgba(34,197,94,0.3)",
        boxShadow: hovered
          ? "0 0 28px rgba(34,197,94,0.32)"
          : "0 0 14px rgba(34,197,94,0.12)",
        transform: hovered ? "translateY(-2px)" : "translateY(0px)",
      }}
    >
      <div className="relative flex items-center gap-2 mb-2">
        <Sparkles size={15} color={BRIGHT_EMERALD} />
        <span
          className="text-[13px] font-semibold"
          style={{ color: "#ffffff", letterSpacing: "-0.01em" }}
        >
          Upgrade to Pro
        </span>
      </div>
      <p
        className="relative text-[11.5px] leading-relaxed mb-3.5"
        style={{ color: TEXT_SECONDARY }}
      >
        Unlock advanced AI analysis, real-time alerts, and premium market
        intelligence.
      </p>
      <button
        className="relative w-full rounded-lg py-2 text-[12.5px] font-semibold transition-transform duration-300"
        style={{
          background: `linear-gradient(135deg, ${EMERALD}, ${BRIGHT_EMERALD})`,
          color: "#052e16",
          boxShadow: hovered
            ? "0 0 22px rgba(74,222,128,0.55)"
            : "0 0 10px rgba(34,197,94,0.3)",
          transform: hovered ? "scale(1.015)" : "scale(1)",
        }}
      >
        Upgrade Now
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar inner content (shared across desktop/tablet/mobile)         */
/* ------------------------------------------------------------------ */

function SidebarContent({ collapsed, activeItem, onNavigate, onCollapseToggle, showCollapseToggle }) {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Top: logo */}
      <div className="flex items-center justify-between px-4 pt-6 pb-7">
        <Logo collapsed={collapsed} />
        {showCollapseToggle && (
          <button
            onClick={onCollapseToggle}
            className="hidden md:flex items-center justify-center rounded-lg p-1.5 transition-all duration-300 hover:bg-white/5 shrink-0"
            style={{ color: TEXT_MUTED }}
          >
            <ChevronsLeft
              size={16}
              style={{
                transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 300ms",
              }}
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 flex flex-col gap-1.5">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            isActive={activeItem === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </nav>

      {/* Bottom: upgrade card + footer */}
      <div className="px-3 pb-5 pt-4">
        {!collapsed && (
        <p
        className="text-[11px] text-center"
        style={{ color: TEXT_MUTED }}
        >
            © 2026 MarketGuard AI
        </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Sidebar export                                                 */
/* ------------------------------------------------------------------ */

export default function Sidebar({
  activeItem: activeItemProp,
  onNavigate: onNavigateProp,
}) {
  const [internalActive, setInternalActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = activeItemProp ?? internalActive;
  const handleNavigate = (id) => {
    setInternalActive(id);
    setMobileOpen(false);
    onNavigateProp?.(id);
  };

  return (
    <>
      {/* Mobile hamburger trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 flex items-center justify-center rounded-lg p-2.5 border"
        style={{
          background: SIDEBAR_BG,
          borderColor: BORDER,
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
      >
        <Menu size={20} color="#ffffff" />
      </button>

      {/* Desktop / Tablet fixed sidebar */}
      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="hidden md:flex flex-col fixed left-0 top-0 z-30 h-screen transition-all duration-300 ease-out"
        style={{
          width: collapsed ? 80 : 260,
          background: SIDEBAR_BG,
        //   borderColor: BORDER,
          fontFamily: FONT,
        }}
      >
        <SidebarContent
          collapsed={collapsed}
          activeItem={activeItem}
          onNavigate={handleNavigate}
          onCollapseToggle={() => setCollapsed((c) => !c)}
          showCollapseToggle
        />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.6)" }}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden fixed left-0 top-0 z-50 h-screen w-[260px] border-r flex flex-col"
              style={{
                background: SIDEBAR_BG,
                borderColor: BORDER,
                fontFamily: FONT,
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-5 right-4 flex items-center justify-center rounded-lg p-1.5 transition-colors duration-300 hover:bg-white/5"
                style={{ color: TEXT_MUTED }}
              >
                <X size={18} />
              </button>
              <SidebarContent
                collapsed={false}
                activeItem={activeItem}
                onNavigate={handleNavigate}
                showCollapseToggle={false}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to push page content — matches sidebar width on md+ */}
      <div
        className="hidden md:block shrink-0 transition-all duration-300 ease-out"
        style={{ width: collapsed ? 80 : 260 }}
      />
    </>
  );
}
