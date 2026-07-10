import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef, useId } from "react";

/**
 * MarketGuard AI — Login Page
 * React + Tailwind CSS, pixel-faithful recreation of the provided design.
 *
 * Enhancements implemented (layout/visuals otherwise untouched):
 *  - Hover lift + scale + emerald glow on NVDA / TSLA / Portfolio cards
 *  - Chart line-draw-on-load animation, glow pulse, traveling highlight dot
 *  - Ambient floating particles + sparkles behind the hero
 *  - Button shine-sweep + lift on hover (Sign In / Create account)
 */

/* ----------------------------- helpers ----------------------------- */

function useDrawOnMount(delay = 150) {
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return drawn;
}

/* ----------------------- background atmosphere ---------------------- */

function FloatingParticles({ count = 26, seed = 1 }) {
  const particles = useRef(
    Array.from({ length: count }).map((_, i) => {
      // deterministic pseudo-random so SSR/CSR match
      const r = (n) => {
        const x = Math.sin(n * 999 + seed * 37.13) * 10000;
        return x - Math.floor(x);
      };
      return {
        left: r(i * 3 + 1) * 100,
        top: r(i * 3 + 2) * 100,
        size: 1 + r(i * 3 + 3) * 2.2,
        dur: 6 + r(i * 3 + 4) * 10,
        delay: r(i * 3 + 5) * -10,
        opacity: 0.25 + r(i * 3 + 6) * 0.55,
      };
    })
  ).current;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-emerald-400"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            filter: "blur(0.3px)",
            boxShadow: "0 0 6px 1px rgba(52,211,153,0.55)",
            animation: `mg-float ${p.dur}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Sparkles({ count = 10, seed = 7 }) {
  const sparks = useRef(
    Array.from({ length: count }).map((_, i) => {
      const r = (n) => {
        const x = Math.sin(n * 1337 + seed * 12.9) * 10000;
        return x - Math.floor(x);
      };
      return {
        left: r(i * 5 + 1) * 100,
        top: r(i * 5 + 2) * 92,
        dur: 2.2 + r(i * 5 + 3) * 2.6,
        delay: r(i * 5 + 4) * -6,
        size: 2 + r(i * 5 + 5) * 2,
      };
    })
  ).current;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparks.map((s, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animation: `mg-sparkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        >
          <span
            className="block h-full w-full rotate-45 rounded-[1px] bg-emerald-300"
            style={{ boxShadow: "0 0 8px 2px rgba(110,231,183,0.8)" }}
          />
        </span>
      ))}
    </div>
  );
}

/* --------------------------- candlestick hero ------------------------ */

function CandlestickChart() {
  // Heights tuned to approximate the uptrend silhouette in the reference image.
  const candles = [
    { h: 18, up: true }, { h: 14, up: false }, { h: 22, up: true }, { h: 16, up: false },
    { h: 26, up: true }, { h: 20, up: false }, { h: 30, up: true }, { h: 24, up: false },
    { h: 35, up: true }, { h: 28, up: false }, { h: 40, up: true }, { h: 33, up: false },
    { h: 46, up: true }, { h: 38, up: false }, { h: 53, up: true }, { h: 44, up: false },
    { h: 61, up: true }, { h: 51, up: false }, { h: 70, up: true }, { h: 58, up: false },
    { h: 81, up: true }, { h: 68, up: false }, { h: 93, up: true }, { h: 106, up: true },
  ];
  const max = 115;

  return (
    <div className="absolute inset-0 flex items-end justify-center">
      <div className="flex items-end gap-[6px] pb-[26%] opacity-80">
        {candles.map((c, i) => {
          const bodyH = Math.max(6, (c.h / max) * 150);
          const wickH = bodyH * 1.5;
          const color = c.up ? "#1fae62" : "#3a4a44";
          return (
            <div key={i} className="relative flex flex-col items-center justify-end" style={{ width: 9 }}>
              <div
                className="absolute bottom-0 w-[1.5px]"
                style={{ height: wickH, background: c.up ? "rgba(34,197,94,0.35)" : "rgba(255,255,255,0.12)" }}
              />
              <div
                className="relative rounded-[1.5px]"
                style={{
                  width: 8,
                  height: bodyH,
                  background: color,
                  boxShadow: c.up ? "0 0 8px rgba(34,197,94,0.3)" : "none",
                }}
              />
            </div>
          );
        })}
      </div>
      {/* ascending trend line over the candles */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 600 360"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M 60 290 C 170 280, 250 255, 320 225 C 400 190, 460 150, 560 95"
          stroke="rgba(110,231,183,0.5)"
          strokeWidth="1.4"
          strokeDasharray="2 4"
        />
      </svg>
    </div>
  );
}

/* ------------------------------ mini charts --------------------------- */

function MiniLineChart({ points, color, glow, height = 44, width = 130, fillId }) {
  const drawn = useDrawOnMount(250);
  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const len = points.length * 26; // rough path length estimate for dash animation

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* area fill */}
      <path
        d={`${path} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`}
        fill={`url(#${fillId})`}
        opacity={drawn ? 1 : 0}
        style={{ transition: "opacity 0.8s ease 0.4s" }}
      />

      {/* glow pulse underlay */}
      <path
        d={path}
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
        className="mg-chart-glow"
      />

      {/* main animated line */}
      <path
        d={path}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: `drop-shadow(0 0 4px ${color})`,
          strokeDasharray: len,
          strokeDashoffset: drawn ? 0 : len,
          transition: "stroke-dashoffset 1.1s cubic-bezier(0.4,0,0.2,1)",
        }}
      />

      {/* traveling highlight dot */}
      {drawn && (
        <circle r="3" fill="#fff" style={{ filter: `drop-shadow(0 0 4px ${color})` }}>
          <animateMotion
            dur="2.8s"
            repeatCount="indefinite"
            path={path}
            rotate="auto"
            begin="1.1s"
          />
        </circle>
      )}
    </svg>
  );
}

function PortfolioChart() {
  const width = 230;
  const height = 64;
  const pts = [
    [0, 50], [20, 44], [40, 47], [60, 38], [80, 41],
    [100, 30], [120, 34], [140, 24], [160, 27], [180, 16],
    [200, 19], [230, 6],
  ].map(([x, y]) => ({ x, y }));
  const drawn = useDrawOnMount(350);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const len = pts.length * 30;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
      <defs>
        <linearGradient id="portfolioFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${path} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`}
        fill="url(#portfolioFill)"
        opacity={drawn ? 1 : 0}
        style={{ transition: "opacity 0.9s ease 0.5s" }}
      />
      <path
        d={path}
        stroke="#34d399"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
        className="mg-chart-glow"
      />
      <path
        d={path}
        stroke="#4ade80"
        strokeWidth="2.25"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: "drop-shadow(0 0 5px rgba(74,222,128,0.85))",
          strokeDasharray: len,
          strokeDashoffset: drawn ? 0 : len,
          transition: "stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1) 0.1s",
        }}
      />
      {drawn && (
        <circle r="3.2" fill="#eafff2" style={{ filter: "drop-shadow(0 0 5px #4ade80)" }}>
          <animateMotion dur="3.2s" repeatCount="indefinite" path={path} begin="1.3s" />
        </circle>
      )}
    </svg>
  );
}

/* ------------------------------- icons -------------------------------- */

const MailIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2.2" />
    <path d="M3.5 6.5 12 13l8.5-6.5" />
  </svg>
);

const LockIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
    <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
  </svg>
);

const EyeOffIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M3 3l18 18" />
    <path d="M10.6 5.2A10.7 10.7 0 0 1 12 5c5.2 0 8.8 4.3 9.9 6.6a1.4 1.4 0 0 1 0 1.1 13.6 13.6 0 0 1-2.6 3.6M6.3 6.3C4.1 7.9 2.5 10.2 2.1 11.7a1.4 1.4 0 0 0 0 1.1C3.2 15.1 6.8 19 12 19c1.1 0 2.1-.15 3-.42" />
    <path d="M9.9 10a2.4 2.4 0 0 0 3.4 3.4" />
  </svg>
);

const ArrowRightIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const ShieldIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
  </svg>
);

const BoltIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
  </svg>
);

const BarsIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <rect x="4" y="13" width="3.4" height="7" rx="0.6" />
    <rect x="10.3" y="9" width="3.4" height="11" rx="0.6" />
    <rect x="16.6" y="5" width="3.4" height="15" rx="0.6" />
  </svg>
);

const LogoMark = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M12 2.5 21 7.5v9L12 21.5 3 16.5v-9L12 2.5z" />
    <path d="M7 13.5l3-3 2.2 2.2L17 8" />
    <path d="M14.2 8h2.8v2.8" />
  </svg>
);

/* ------------------------------ stock cards ---------------------------- */

function NvidiaLogo() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#76b900">
        <path d="M3 8.5C5.5 5.8 8.6 4.3 12 4.3c4.6 0 8.6 2.9 10.4 6.9-2.1-2.7-5.3-4.4-9-4.4-3.4 0-6.5 1.5-9 4.2L3 8.5zM3 13.4c2.5 3.6 6 5.8 9.8 5.8 3.6 0 6.8-1.8 8.9-4.6-1.7 1-3.8 1.6-6.1 1.6-3.7 0-7-1.7-9.2-4.6L3 13.4z" />
      </svg>
    </div>
  );
}

function TeslaLogo() {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/10 ring-1 ring-red-500/25">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#e82127">
        <path d="M12 6.2c2.3 0 4.3.9 5.4 2.1-1.6-.5-3.3-.7-5.4-.7s-3.8.2-5.4.7C7.7 7.1 9.7 6.2 12 6.2zM3.2 7.6c.9 1 2.2 1.6 2.2 1.6S6.7 11.4 8 12.5l2.9 10.3c.1.5.6.5.7 0L14.5 12.5c1.3-1.1 2.6-3.3 2.6-3.3s1.3-.6 2.2-1.6c-1.6 1-4.5 1.8-7.3 1.8-2.8 0-5.7-.8-7.3-1.8h-1.5z" />
      </svg>
    </div>
  );
}

function StockCard({ symbol, name, price, change, changeAbs, up, logo, chartColor, points, glowClass }) {
  return (
    <div
      className={`group relative w-[280px] rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-black/40 p-4 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] ${glowClass}`}
      style={{
        boxShadow:
          "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="flex items-center gap-3">
        {logo}
        <div className="min-w-0">
          <div className="text-[15px] font-bold leading-tight text-white">{symbol}</div>
          <div className="truncate text-[11px] leading-tight text-gray-400">{name}</div>
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <div className="text-[26px] font-bold leading-none tracking-tight text-white">
            {price}
          </div>
          <div
            className={`mt-1.5 flex items-center gap-1 text-[13px] font-semibold ${
              up ? "text-emerald-400" : "text-red-500"
            }`}
          >
            <span className="text-[10px]">{up ? "▲" : "▼"}</span>
            <span>
              {change} ({changeAbs})
            </span>
          </div>
        </div>
        <MiniLineChart points={points} color={chartColor} fillId={`fill-${symbol}`} />
      </div>
    </div>
  );
}

/* -------------------------------- ticker -------------------------------- */

function TickerItem({ symbol, change, price }) {
  return (
    <div className="flex flex-col items-start gap-1 px-5">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-bold text-white">{symbol}</span>
        <span className="text-[13px] font-semibold text-emerald-400">{change}</span>
      </div>
      <span className="text-[13px] text-gray-400">{price}</span>
    </div>
  );
}

/* -------------------------------- trust row ------------------------------ */

function TrustBadge({ icon, title, sub }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 ring-1 ring-emerald-500/25 text-emerald-400">
        {icon}
      </div>
      <div>
        <div className="text-[13.5px] font-semibold text-white">{title}</div>
        <div className="text-[12px] text-gray-400">{sub}</div>
      </div>
    </div>
  );
}

/* --------------------------------- buttons ------------------------------- */

function ShineButton({ children, variant = "primary", className = "", ...rest }) {
  const base =
    "group relative isolate overflow-hidden flex w-full items-center justify-center gap-2 rounded-xl text-[14.5px] font-semibold transition-all duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0";
  const styles =
    variant === "primary"
      ? "h-12 text-white bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_8px_24px_rgba(16,185,129,0.35)] hover:shadow-[0_10px_32px_rgba(16,185,129,0.55)]"
      : "h-12 text-white/90 border border-white/15 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/25";

  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
    </button>
  );
}

/* ---------------------------------- inputs -------------------------------- */

function FieldLabel({ children }) {
  return <label className="mb-2 block text-[13.5px] font-medium text-white">{children}</label>;
}

function TextInput({
  icon,
  placeholder,
  type = "text",
  value,
  onChange,
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="h-[50px] w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-[14px] text-white placeholder-gray-500 outline-none transition-colors focus:border-emerald-500/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-emerald-500/20"
      />
    </div>
  );
}

function PasswordInput({ value, onChange }) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
        <LockIcon className="h-[18px] w-[18px]" />
      </span>

      <input
        type={show ? "text" : "password"}
        placeholder="Enter your password"
        value={value}
        onChange={onChange}
        className="h-[50px] w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-11 text-[14px] text-white placeholder-gray-500 outline-none transition-colors focus:border-emerald-500/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-emerald-500/20"
      />

      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-200"
        aria-label={show ? "Hide password" : "Show password"}
      >
        <EyeOffIcon className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}

/* ===================================================================== */
/* MAIN PAGE                                                              */
/* ===================================================================== */

export default function MarketGuardLogin() {
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const nvdaPoints = [
    { x: 0, y: 34 }, { x: 16, y: 30 }, { x: 32, y: 33 }, { x: 48, y: 24 },
    { x: 64, y: 27 }, { x: 80, y: 16 }, { x: 96, y: 20 }, { x: 113, y: 6 },
    { x: 130, y: 10 },
  ];
  const tslaPoints = [
    { x: 0, y: 10 }, { x: 16, y: 16 }, { x: 32, y: 12 }, { x: 48, y: 22 },
    { x: 64, y: 17 }, { x: 80, y: 26 }, { x: 96, y: 20 }, { x: 113, y: 30 },
    { x: 130, y: 24 },
  ];

  const ticker = [
    { symbol: "NVDA", change: "+4.32%", price: "$892.40" },
    { symbol: "MSFT", change: "+1.67%", price: "$415.41" },
    { symbol: "AMZN", change: "+0.89%", price: "$186.21" },
    { symbol: "GOOG", change: "+2.45%", price: "$173.15" },
    { symbol: "META", change: "+3.21%", price: "$508.58" },
    { symbol: "BTC", change: "+5.78%", price: "$67,231.00" },
    { symbol: "AAPL", change: "+1.25%", price: "$195.42" },
  ];
  const handleLogin = async () => {
  setError("");

  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.access_token);

      navigate("/dashboard");
    } else {
      setError(data.detail || "Incorrect email or password");
    }
  } catch (err) {
    setError("Server Error. Please try again.");
    console.error(err);
  }
};

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans antialiased">
      {/* local keyframes */}
      <style>{`
        @keyframes mg-float {
          0%, 100% { transform: translate(0,0); }
          50% { transform: translate(6px,-14px); }
        }
        @keyframes mg-sparkle {
          0%, 100% { opacity: 0; transform: scale(0.4) rotate(45deg); }
          50% { opacity: 1; transform: scale(1) rotate(45deg); }
        }
        @keyframes mg-glow-pulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.55; }
        }
        .mg-chart-glow { animation: mg-glow-pulse 2.6s ease-in-out infinite; }
        @keyframes mg-card-glow {
          0%, 100% { box-shadow: 0 0 0 rgba(16,185,129,0); }
        }
      `}</style>

      {/* ambient backdrop */}
      <div className="pointer-events-none absolute inset-0">
        {/* world-map dot grid, faint */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(16,185,129,0.5) 0.6px, transparent 0.6px)",
            backgroundSize: "14px 14px",
            maskImage:
              "radial-gradient(ellipse 55% 65% at 58% 35%, black 40%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 55% 65% at 58% 35%, black 40%, transparent 75%)",
          }}
        />
        {/* central glow behind candles */}
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />
        <FloatingParticles />
        <Sparkles />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1640px] flex-col px-10 pb-8 pt-8 lg:px-16">
        <div className="grid flex-1 grid-cols-1 gap-10 lg:grid-cols-[1fr_460px]">
          {/* ----------------------------- LEFT SIDE ----------------------------- */}
          <div className="relative flex flex-col pb-4 pt-2">
            {/* logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/40 text-emerald-400">
                <LogoMark className="h-7 w-7" />
              </div>
              <div>
                <div className="text-[22px] font-bold leading-none text-white">
                  MarketGuard <span className="text-emerald-400">AI</span>
                </div>
                <div className="mt-1 text-[11px] font-medium tracking-[0.12em] text-gray-400">
                  AI-POWERED STOCK INTELLIGENCE
                </div>
              </div>
            </div>

            {/* candlestick hero + floating stat cards */}
            <div className="relative mt-6 h-[480px]">
              <div className="pointer-events-none absolute inset-0">
                <CandlestickChart />
              </div>

              {/* NVDA card */}
              <div className="absolute left-0 top-[58px]">
                <StockCard
                  symbol="NVDA"
                  name="NVIDIA Corporation"
                  price="$892.40"
                  change="4.32%"
                  changeAbs="38.73"
                  up
                  logo={<NvidiaLogo />}
                  chartColor="#34d399"
                  points={nvdaPoints}
                  glowClass="hover:shadow-[0_20px_60px_-10px_rgba(16,185,129,0.55)] hover:border-emerald-400/40"
                />
              </div>

              {/* TSLA card */}
              <div className="absolute left-[26px] top-[280px]">
                <StockCard
                  symbol="TSLA"
                  name="Tesla, Inc."
                  price="$178.62"
                  change="-1.11%"
                  changeAbs="-2.01"
                  up={false}
                  logo={<TeslaLogo />}
                  chartColor="#ef4444"
                  points={tslaPoints}
                  glowClass="hover:shadow-[0_20px_60px_-10px_rgba(16,185,129,0.55)] hover:border-emerald-400/40"
                />
              </div>

              {/* Portfolio value card */}
              <div className="absolute bottom-[2px] right-[6%] w-[260px]">
                <div
                  className="group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-black/40 p-4 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_20px_60px_-10px_rgba(16,185,129,0.55)] hover:border-emerald-400/40"
                  style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.5)" }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-gray-300">Portfolio Value</span>
                    <span className="text-[13px] font-semibold text-emerald-400">+12.8%</span>
                  </div>
                  <div className="mt-2">
                    <PortfolioChart />
                  </div>
                  <div className="mt-1 text-[26px] font-bold text-white">$128,450</div>
                </div>
              </div>
            </div>

            {/* headline block */}
            <div className="relative z-10 mt-10 max-w-xl">
              <div className="mb-3 text-[12.5px] font-semibold tracking-[0.14em] text-emerald-400">
                AI-POWERED STOCK INTELLIGENCE
              </div>
              <h1 className="text-[40px] font-extrabold leading-[1.12] tracking-tight text-white lg:text-[42px]">
                Smarter Insights.
                <br />
                <span className="text-emerald-400">Stronger</span> Investments.
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-gray-400">
                MarketGuard AI delivers real-time market data, AI-driven analysis, and
                actionable insights to help you stay ahead.
              </p>
            </div>

            {/* trust badges */}
            <div className="relative z-10 mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
              <TrustBadge
                icon={<ShieldIcon className="h-[18px] w-[18px]" />}
                title="Secure"
                sub="Your data is protected"
              />
              <TrustBadge
                icon={<BoltIcon className="h-[16px] w-[16px]" />}
                title="Real-Time"
                sub="Live market updates"
              />
              <TrustBadge
                icon={<BarsIcon className="h-[16px] w-[16px]" />}
                title="AI-Powered"
                sub="Smart market analysis"
              />
            </div>
          </div>

          {/* ----------------------------- RIGHT SIDE ----------------------------- */}
          <div className="flex items-start pt-1 lg:pt-2">
            <div
              className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0a0f0d]/90 to-black/90 p-8 backdrop-blur-2xl"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.04), 0 30px 80px -20px rgba(0,0,0,0.8)",
              }}
            >
              {/* top hairline glow */}
              <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
              <div className="absolute -top-10 left-1/2 h-20 w-2/3 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-2xl" />

              <div className="relative">
                <h2 className="text-center text-[32px] font-extrabold text-white">
                  Welcome <span className="text-emerald-400">Back</span>
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-center text-[14px] leading-relaxed text-gray-400">
                  Access AI-powered market intelligence, real-time stock analysis, and
                  institutional-grade insights.
                </p>

                <div className="mt-6">
                  <FieldLabel>Email address</FieldLabel>
                  <TextInput
                    icon={<MailIcon className="h-[18px] w-[18px]" />}
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mt-4">
                  <FieldLabel>Password</FieldLabel>
                  <PasswordInput 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && (
                  <p className="mt-2 text-sm text-red-500 font-medium">
                    {error}
                  </p>
                  )}
                </div>

                <div className="mt-3.5 flex items-center justify-between">
                  <label className="flex items-center gap-2.5 text-[13.5px] text-gray-300">
                    <button
                      type="button"
                      onClick={() => setRemember((r) => !r)}
                      className={`flex h-[18px] w-[18px] items-center justify-center rounded-[5px] border transition-colors ${
                        remember
                          ? "border-emerald-400 bg-emerald-400"
                          : "border-white/25 bg-transparent"
                      }`}
                      aria-pressed={remember}
                      aria-label="Remember me"
                    >
                      {remember && (
                        <svg viewBox="0 0 24 24" className="h-3 w-3 text-black" fill="none" stroke="currentColor" strokeWidth="3">
                          <path d="M5 12l5 5L19 7" />
                        </svg>
                      )}
                    </button>
                    Remember me
                  </label>
                  <a href="#" className="text-[13.5px] font-medium text-emerald-400 hover:text-emerald-300">
                    Forgot password?
                  </a>
                </div>

                <div className="mt-5">
                  <ShineButton 
                  variant="primary"
                  onClick={handleLogin}
                  >
                    Sign In
                    <ArrowRightIcon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                  </ShineButton>
                </div>

                <div className="my-5 flex items-center gap-3">
                  <span className="h-px flex-1 bg-white/10" />
                  <span className="text-[12px] font-medium tracking-wide text-gray-500">OR</span>
                  <span className="h-px flex-1 bg-white/10" />
                </div>

                <ShineButton variant="secondary">Create new account</ShineButton>

                <p className="mt-5 text-center text-[13.5px] text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-emerald-400 hover:text-emerald-300"
                    >
                    Sign up
                    </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------- TICKER BAR ----------------------------- */}
        <div className="relative z-10 mt-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] py-4 backdrop-blur-xl">
          <div className="flex flex-wrap items-center justify-between divide-x divide-white/10 px-2">
            {ticker.map((t) => (
              <div key={t.symbol} className="flex-1">
                <TickerItem {...t} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
