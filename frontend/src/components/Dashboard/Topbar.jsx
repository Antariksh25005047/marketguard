import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Logo from '../Logo'

function BellIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
      <path
        d="M18 8.5c0-3.31-2.69-6-6-6s-6 2.69-6 6c0 2.6-.7 4.4-1.8 5.9-.3.4 0 1 .5 1h14.6c.5 0 .8-.6.5-1-1.1-1.5-1.8-3.3-1.8-5.9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 18.5a2.5 2.5 0 0 0 5 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function TopBar() {

  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const userName =
    user.name ||
    user.username ||
    user.full_name ||
    "User";

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest("#profile-menu")) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-charcoal/70 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 md:px-10">
        {/* Left — logo + wordmark, links to "/" */}
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <Logo />
          <span className="hidden font-display text-lg font-semibold tracking-tight text-white sm:inline">
            MarketGuard <span className="text-emerald">AI</span>
          </span>
        </Link>

        {/* Center — intentionally empty for premium breathing room */}
        <div className="flex-1" />

        {/* Right — live market pill, notifications, avatar */}
        <div className="flex shrink-0 items-center gap-3">
          {/* Live Market pill */}
          <div className="hidden items-center gap-2 rounded-full border border-emerald/25 bg-emerald/[0.06] px-3.5 py-1.5 sm:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
            </span>
            <span className="font-body text-xs font-medium text-emerald/90">
              Live Market
            </span>
          </div>

          {/* Notification bell */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03] text-white/60 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:border-emerald/40 hover:bg-emerald/10 hover:text-emerald"
          >
            <BellIcon />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald shadow-[0_0_6px_#22C55E]" />
          </button>

          {/* Avatar + dropdown */}
          <div id="profile-menu" className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="Open profile menu"
            className="group flex items-center gap-1.5 rounded-full border border-transparent py-1 pl-1 pr-2 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.04]"
          >
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] bg-emerald/10 font-display text-sm font-semibold text-emerald shadow-sm transition-transform duration-300 hover:scale-105">
              {initials}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-charcoal bg-emerald" />
            </span>
            <span className="text-white/40 transition-colors duration-200 group-hover:text-white/70">
              <ChevronDownIcon />
            </span>
          </button>
          {profileOpen && (
  <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-[#111] shadow-xl z-50">

    <Link
      to="/profile"
      className="block px-4 py-3 text-sm text-white hover:bg-white/10"
      onClick={() => setProfileOpen(false)}
    >
      👤 Profile
    </Link>

    <button
      onClick={handleLogout}
      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
    >
      🚪 Logout
    </button>

  </div>
)}
        </div>
        </div>
      </div>
    </header>
  )
}