import React, { useState, useRef, useEffect } from "react";
import { Search, Star, Bell, ChevronDown } from "lucide-react";

/**
 * TopNavbar
 * ----------------------------------------------------------------
 * Sticky top navigation bar for MarketGuard AI. Sits above the
 * Dashboard and Stock Analysis pages, designed to perfectly match
 * the Sidebar's visual language (same tokens, glass effects,
 * emerald glow language, 300ms transitions).
 *
 * Left   : large search bar with ⌘K shortcut badge
 * Center : empty, reserved for future expansion
 * Right  : Watchlist button, Notification bell, User profile
 * ----------------------------------------------------------------
 */

const EMERALD = "#22c55e";
const BRIGHT_EMERALD = "#4ade80";
const NAVBAR_BG = "#080808";
const BORDER = "rgba(255,255,255,0.08)";
const GLASS = "rgba(255,255,255,0.03)";
const TEXT_SECONDARY = "#9ca3af";
const TEXT_MUTED = "#6b7280";

const FONT =
  "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif";

/* ------------------------------------------------------------------ */
/* Search bar                                                          */
/* ------------------------------------------------------------------ */

function SearchBar() {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="relative flex items-center gap-2.5 rounded-xl border px-3.5 transition-all duration-300 ease-out w-full sm:w-[320px] md:w-[450px] w-full max-w-[650px]"
      style={{
        height: 48,
        background: GLASS,
        borderColor: focused ? "rgba(34,197,94,0.4)" : BORDER,
        boxShadow: "none"
      }}
    >
      <Search
        size={17}
        strokeWidth={2}
        color={focused ? BRIGHT_EMERALD : TEXT_MUTED}
        className="shrink-0 transition-colors duration-300"
      />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search stocks, companies, ETFs..."
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 min-w-0 bg-transparent outline-none text-[13.5px]"
        style={{ color: "#ffffff", fontFamily: FONT }}
      />
      <span
        className="hidden sm:flex items-center justify-center rounded-md px-1.5 py-0.5 text-[11px] font-semibold shrink-0 border"
        style={{
          color: TEXT_MUTED,
          borderColor: BORDER,
          background: "rgba(255,255,255,0.03)",
        }}
      >
        ⌘K
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Watchlist button                                                     */
/* ------------------------------------------------------------------ */

function WatchlistButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="hidden sm:flex items-center gap-2 rounded-xl px-3.5 py-2.5 border transition-all duration-300 ease-out"
      style={{
        background: hovered ? "rgba(34,197,94,0.10)" : "transparent",
        borderColor: hovered ? "rgba(34,197,94,0.3)" : BORDER,
        boxShadow: hovered ? "0 0 18px rgba(34,197,94,0.25)" : "none",
      }}
    >
      <Star
        size={17}
        strokeWidth={2}
        color={hovered ? BRIGHT_EMERALD : TEXT_SECONDARY}
        className="transition-colors duration-300"
      />
      <span
        className="text-[13px] font-medium transition-colors duration-300"
        style={{ color: hovered ? BRIGHT_EMERALD : TEXT_SECONDARY }}
      >
        Watchlist
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Notification bell                                                    */
/* ------------------------------------------------------------------ */

function NotificationButton({ hasUnread = true }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center rounded-xl border transition-all duration-300 ease-out shrink-0"
      style={{
        width: 42,
        height: 42,
        background: hovered ? "rgba(34,197,94,0.10)" : "transparent",
        borderColor: hovered ? "rgba(34,197,94,0.3)" : BORDER,
        boxShadow: hovered ? "0 0 18px rgba(34,197,94,0.25)" : "none",
      }}
    >
      <Bell
        size={18}
        strokeWidth={2}
        color={hovered ? BRIGHT_EMERALD : TEXT_SECONDARY}
        className="transition-colors duration-300"
      />
      {hasUnread && (
        <span
          className="absolute top-2 right-2.5 rounded-full"
          style={{
            width: 7,
            height: 7,
            background: "#ef4444",
            boxShadow: "0 0 6px rgba(239,68,68,0.8)",
            border: `1.5px solid ${NAVBAR_BG}`,
          }}
        />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* User profile                                                         */
/* ------------------------------------------------------------------ */

function UserProfile({ initials = "AG" }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-2 rounded-xl pl-1.5 pr-2.5 py-1.5 border transition-all duration-300 ease-out"
      style={{
        background: hovered ? "rgba(255,255,255,0.04)" : "transparent",
        borderColor: hovered ? "rgba(34,197,94,0.25)" : "transparent",
      }}
    >
      <div
        className="relative flex items-center justify-center rounded-full shrink-0 transition-transform duration-300 ease-out"
        style={{
          width: 34,
          height: 34,
          background: `linear-gradient(135deg, ${EMERALD}, ${BRIGHT_EMERALD})`,
          transform: hovered ? "scale(1.06)" : "scale(1)",
          boxShadow: hovered ? "0 0 16px rgba(34,197,94,0.45)" : "none",
        }}
      >
        <span
          className="text-[12.5px] font-bold"
          style={{ color: "#052e16", letterSpacing: "-0.01em" }}
        >
          {initials}
        </span>
        <span
          className="absolute -bottom-0.5 -right-0.5 rounded-full"
          style={{
            width: 10,
            height: 10,
            background: BRIGHT_EMERALD,
            border: `2px solid ${NAVBAR_BG}`,
            boxShadow: "0 0 6px rgba(74,222,128,0.8)",
          }}
        />
      </div>
      <ChevronDown
        size={15}
        strokeWidth={2}
        color={hovered ? BRIGHT_EMERALD : TEXT_MUTED}
        className="hidden sm:block transition-colors duration-300"
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Main TopNavbar export                                               */
/* ------------------------------------------------------------------ */

export default function TopNavbar() {
  return (
    <header
      className="sticky top-0 z-30 w-full flex items-center justify-between gap-4 px-8"
      style={{
        height: 72,
        background: NAVBAR_BG,
        // borderColor: BORDER,
        fontFamily: FONT,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Left: search */}
      <div className="flex-1 flex justify-start pl-8">
        <SearchBar />
      </div>

      {/* Center: reserved for future expansion */}
      {/* <div className="hidden lg:flex flex-1" /> */}

      {/* Right: actions */}
      <div className="flex items-center gap-5  shrink-0">
        <WatchlistButton />
        <NotificationButton />
        <UserProfile />
      </div>
    </header>
  );
}
