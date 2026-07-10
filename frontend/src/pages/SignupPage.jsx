import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";

/**
 * MarketGuard AI — Sign Up / Onboarding Page
 * React + Tailwind CSS. Shares the login page's design tokens (black bg,
 * emerald accent, glassmorphism, Inter type) for brand continuity, while
 * introducing its own signature moment: an ascending "proof cascade" of
 * three count-up stat cards beside a confident equity curve — the page's
 * job is to prove people succeed with the product, where the login page's
 * job was to prove the product itself works in real time.
 *
 * Enhancements implemented:
 *  - Hover lift(-8px) + scale(1.03) + emerald glow on all three stat cards
 *  - Count-up animation on the stat numbers, staggered on load
 *  - Animated equity curve: line-draw on load + glow pulse + traveling dot
 *  - Ambient emerald particles + sparkles
 *  - Shine-sweep + lift + glow on the primary button
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

function useCountUp(target, { duration = 1400, delay = 200, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf;
    let start;
    const startDelay = setTimeout(() => {
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min(1, (ts - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        setValue(target * eased);
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(startDelay);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);
  return value.toFixed(decimals);
}

/* ----------------------- background atmosphere ---------------------- */

function FloatingParticles({ count = 24, seed = 3 }) {
  const particles = useRef(
    Array.from({ length: count }).map((_, i) => {
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

function Sparkles({ count = 9, seed = 11 }) {
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

/* --------------------------- equity curve hero ------------------------ */

function EquityCurve() {
  const width = 600;
  const height = 320;
  const drawn = useDrawOnMount(300);

  // confident, mostly-monotonic uptrend with light texture — distinct from
  // the login page's candlesticks, but in the same visual language.
  const pts = [
    [10, 250], [60, 245], [110, 230], [160, 235], [210, 205],
    [260, 212], [310, 175], [360, 182], [410, 140], [460, 148],
    [510, 100], [560, 108], [590, 60],
  ].map(([x, y]) => ({ x, y }));

  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const len = pts.length * 60;

  return (
    <div className="absolute inset-0">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none" fill="none">
        <defs>
          <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* faint horizontal grid, fintech-dashboard texture */}
        {[0.2, 0.4, 0.6, 0.8].map((f) => (
          <line
            key={f}
            x1="0"
            x2={width}
            y1={height * f}
            y2={height * f}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        <path
          d={`${path} L ${pts[pts.length - 1].x} ${height} L ${pts[0].x} ${height} Z`}
          fill="url(#equityFill)"
          opacity={drawn ? 1 : 0}
          style={{ transition: "opacity 1s ease 0.5s" }}
        />

        <path
          d={path}
          stroke="#34d399"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.3"
          className="mg-chart-glow"
        />

        <path
          d={path}
          stroke="#4ade80"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: "drop-shadow(0 0 6px rgba(74,222,128,0.85))",
            strokeDasharray: len,
            strokeDashoffset: drawn ? 0 : len,
            transition: "stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1) 0.1s",
          }}
        />

        {drawn && (
          <circle r="4" fill="#eafff2" style={{ filter: "drop-shadow(0 0 6px #4ade80)" }}>
            <animateMotion dur="3.6s" repeatCount="indefinite" path={path} begin="1.6s" />
          </circle>
        )}

        {/* endpoint marker */}
        <circle
          cx={pts[pts.length - 1].x}
          cy={pts[pts.length - 1].y}
          r="5"
          fill="#34d399"
          opacity={drawn ? 1 : 0}
          style={{ transition: "opacity 0.5s ease 1.6s", filter: "drop-shadow(0 0 8px #34d399)" }}
        />
      </svg>
    </div>
  );
}

/* ------------------------------- icons -------------------------------- */

const UserIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <circle cx="12" cy="8" r="3.6" />
    <path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" />
  </svg>
);

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

const TargetIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
    <circle cx="12" cy="12" r="8.2" />
    <circle cx="12" cy="12" r="4.4" />
    <circle cx="12" cy="12" r="0.9" fill="currentColor" />
  </svg>
);

const TrendUpIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" {...props}>
    <path d="M3 16l5.5-6 4 3.2L20 6" />
    <path d="M14.5 6H20v5.5" />
  </svg>
);

const UsersIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
    <circle cx="9" cy="8.5" r="3" />
    <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
    <circle cx="17" cy="9.5" r="2.4" />
    <path d="M15.2 14.3c2.4.3 4.3 2 4.3 4.7" />
  </svg>
);

const LogoMark = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
    <path d="M12 2.5 21 7.5v9L12 21.5 3 16.5v-9L12 2.5z" />
    <path d="M7 13.5l3-3 2.2 2.2L17 8" />
    <path d="M14.2 8h2.8v2.8" />
  </svg>
);

const CheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" {...props}>
    <path d="M5 12l5 5L19 7" />
  </svg>
);

const ShieldCheckIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    <path d="M9 12.2l2 2 4-4.4" />
  </svg>
);

const ZapIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" />
  </svg>
);

const ClockIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3.2 1.9" />
  </svg>
);

/* ------------------------------ stat cards ----------------------------- */

function StatCard({ icon, label, value, suffix, decimals, position }) {
  const display = useCountUp(value, { delay: position.delay, decimals });
  return (
    <div
      className="group absolute w-[200px] sm:w-[220px] rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-black/40 p-4 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.03] hover:border-emerald-400/40 hover:shadow-[0_20px_60px_-10px_rgba(16,185,129,0.55)]"
      style={{
        left: position.left,
        top: position.top,
        boxShadow: "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        animation: `mg-card-in 0.7s cubic-bezier(0.16,1,0.3,1) ${position.delay - 100}ms backwards`,
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
          {icon}
        </div>
        <span className="text-[12.5px] font-medium text-gray-300">{label}</span>
      </div>
      <div className="mt-2.5 text-[28px] font-bold leading-none tracking-tight text-white">
        {display}
        {suffix}
      </div>
    </div>
  );
}

/* --------------------------------- buttons ------------------------------- */

function ShineButton({ children, variant = "primary", className = "", disabled, ...rest }) {
  const base =
    "group relative isolate overflow-hidden flex w-full items-center justify-center gap-2 rounded-xl text-[14.5px] font-semibold transition-all duration-300 ease-out";
  const interactive = disabled
    ? "opacity-40 cursor-not-allowed"
    : "hover:-translate-y-0.5 active:translate-y-0";
  const styles =
    variant === "primary"
      ? `h-12 text-white bg-gradient-to-r from-emerald-400 to-emerald-600 ${
          disabled ? "" : "shadow-[0_8px_24px_rgba(16,185,129,0.35)] hover:shadow-[0_10px_32px_rgba(16,185,129,0.55)]"
        }`
      : "h-12 text-white/90 border border-white/15 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/25";

  return (
    <button className={`${base} ${interactive} ${styles} ${className}`} disabled={disabled} {...rest}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {!disabled && (
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      )}
    </button>
  );
}

/* ---------------------------------- inputs -------------------------------- */

function FieldLabel({ children }) {
  return <label className="mb-2 block text-[13.5px] font-medium text-white">{children}</label>;
}

function TextInput({ icon, placeholder, type = "text", value, onChange }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-[50px] w-full rounded-xl border border-white/10 bg-white/[0.03] pl-11 pr-4 text-[14px] text-white placeholder-gray-500 outline-none transition-colors focus:border-emerald-500/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-emerald-500/20"
      />
    </div>
  );
}

function PasswordInput({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
        <LockIcon className="h-[18px] w-[18px]" />
      </span>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
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

/* password strength — small, useful, on-brand; not in the brief explicitly
   but a signup form for a financial product should give real feedback. */
function PasswordStrength({ password }) {
  const score = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  if (!password) return null;
  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["#ef4444", "#f59e0b", "#34d399", "#10b981"];
  const idx = Math.max(0, score - 1);
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-1 flex-1 rounded-full transition-colors duration-300"
            style={{ background: i <= idx ? colors[idx] : "rgba(255,255,255,0.1)" }}
          />
        ))}
      </div>
      <span className="text-[11px] font-medium" style={{ color: colors[idx] }}>
        {labels[idx]}
      </span>
    </div>
  );
}

/* ===================================================================== */
/* MAIN PAGE                                                              */
/* ===================================================================== */

export default function MarketGuardSignup() {
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const handleSignup = async () => {
  if (!form.name || !form.email || !form.password || !form.confirm) {
    alert("Please fill all fields");
    return;
  }

  if (form.password !== form.confirm) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.access_token);

      navigate("/dashboard");
    } else {
      alert(data.detail);
    }
  } catch (err) {
    console.error(err);
    alert("Backend server is not running.");
  }
};
  const confirmMismatch = form.confirm.length > 0 && form.confirm !== form.password;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-sans antialiased">
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
          0%, 100% { opacity: 0.22; }
          50% { opacity: 0.5; }
        }
        @keyframes mg-card-in {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .mg-chart-glow { animation: mg-glow-pulse 2.8s ease-in-out infinite; }
      `}</style>

      {/* ambient backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: "radial-gradient(rgba(16,185,129,0.5) 0.6px, transparent 0.6px)",
            backgroundSize: "14px 14px",
            maskImage: "radial-gradient(ellipse 55% 65% at 55% 38%, black 40%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 55% 65% at 55% 38%, black 40%, transparent 75%)",
          }}
        />
        <div className="absolute left-1/3 top-1/3 h-[420px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[100px]" />
        <FloatingParticles />
        <Sparkles />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1640px] flex-col px-10 pb-10 pt-8 lg:px-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_460px]">
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

            {/* equity curve hero + proof cascade */}
            <div className="relative mt-10 h-[420px]">
              <div className="pointer-events-none absolute inset-0">
                <EquityCurve />
              </div>

              <StatCard
                icon={<TargetIcon className="h-[18px] w-[18px]" />}
                label="Prediction Accuracy"
                value={92.4}
                suffix="%"
                decimals={1}
                position={{ left: "0%", top: 18, delay: 200 }}
              />
              <StatCard
                icon={<TrendUpIcon className="h-[18px] w-[18px]" />}
                label="Portfolio Growth"
                value={128}
                suffix="%"
                decimals={0}
                position={{ left: "20%", top: 152, delay: 420 }}
              />
              <StatCard
                icon={<UsersIcon className="h-[18px] w-[18px]" />}
                label="Active Investors"
                value={50}
                suffix="K+"
                decimals={0}
                position={{ left: "min(52%, calc(100% - 200px))", top: 286, delay: 640 }}
              />
            </div>

            {/* headline block */}
            <div className="relative z-10 mt-8 max-w-2xl">
              <div className="mb-3 text-[12.5px] font-semibold tracking-[0.14em] text-emerald-400">
                START YOUR JOURNEY
              </div>
              <h1 className="text-[40px] font-extrabold leading-[1.12] tracking-tight text-white lg:text-[44px]">
                Create Your <span className="text-emerald-400">Investor Edge</span>
              </h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-gray-400">
                Join thousands of investors using AI-powered market intelligence to
                make smarter decisions.
              </p>
            </div>

            {/* signup-moment reassurance: bank-grade trust signals */}
            <div className="relative z-10 mt-9 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-white/10 pt-7">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25">
                  <ShieldCheckIcon className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold text-white">Bank-grade security</div>
                  <div className="text-[12px] text-gray-400">256-bit encryption, always on</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25">
                  <ZapIcon className="h-[16px] w-[16px]" />
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold text-white">Free to start</div>
                  <div className="text-[12px] text-gray-400">No card required</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/25">
                  <ClockIcon className="h-[16px] w-[16px]" />
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold text-white">Ready in 60 seconds</div>
                  <div className="text-[12px] text-gray-400">No paperwork, no delay</div>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------- RIGHT SIDE ----------------------------- */}
          <div className="flex items-start pt-1 lg:pt-2">
            <div
              className="relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0a0f0d]/90 to-black/90 p-8 backdrop-blur-2xl"
              style={{
                boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 30px 80px -20px rgba(0,0,0,0.8)",
              }}
            >
              <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
              <div className="absolute -top-10 left-1/2 h-20 w-2/3 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-2xl" />

              <div className="relative">
                <h2 className="text-center text-[30px] font-extrabold text-white">
                  Create Your <span className="text-emerald-400">Account</span>
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-center text-[14px] leading-relaxed text-gray-400">
                  Set up your account in under a minute and start investing with
                  AI-powered insight.
                </p>

                <div className="mt-6">
                  <FieldLabel>Full name</FieldLabel>
                  <TextInput
                    icon={<UserIcon className="h-[18px] w-[18px]" />}
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={update("name")}
                  />
                </div>

                <div className="mt-4">
                  <FieldLabel>Email address</FieldLabel>
                  <TextInput
                    icon={<MailIcon className="h-[18px] w-[18px]" />}
                    placeholder="Enter your email"
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                  />
                </div>

                <div className="mt-4">
                  <FieldLabel>Password</FieldLabel>
                  <PasswordInput
                    placeholder="Create a password"
                    value={form.password}
                    onChange={update("password")}
                  />
                  <PasswordStrength password={form.password} />
                </div>

                <div className="mt-4">
                  <FieldLabel>Confirm password</FieldLabel>
                  <PasswordInput
                    placeholder="Re-enter your password"
                    value={form.confirm}
                    onChange={update("confirm")}
                  />
                  {confirmMismatch && (
                    <p className="mt-1.5 text-[12px] font-medium text-red-400">
                      Passwords don&apos;t match yet.
                    </p>
                  )}
                </div>

                <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug text-gray-300">
                  <button
                    type="button"
                    onClick={() => setAgree((a) => !a)}
                    className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
                      agree ? "border-emerald-400 bg-emerald-400" : "border-white/25 bg-transparent"
                    }`}
                    aria-pressed={agree}
                    aria-label="I agree to Terms & Conditions"
                  >
                    {agree && <CheckIcon className="h-3 w-3 text-black" />}
                  </button>
                  <span>
                    I agree to the{" "}
                    <a href="#" className="font-medium text-emerald-400 hover:text-emerald-300">
                      Terms &amp; Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="font-medium text-emerald-400 hover:text-emerald-300">
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>

                <div className="mt-5">
                  <ShineButton 
                      variant="primary" 
                      disabled={!agree}
                      onClick={handleSignup}
                  >
                    Create Account
                    <ArrowRightIcon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:translate-x-1" />
                  </ShineButton>
                </div>

                <p className="mt-5 text-center text-[13.5px] text-gray-400">
                  Already have an account?{" "}
                <Link
                    to="/login"
                    className="font-semibold text-emerald-400 hover:text-emerald-300"
                >
                    Sign in
                </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
