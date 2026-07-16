import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BarChart2,
  Bookmark,
  Newspaper,
  Bell,
  ChevronDown,
  Menu,
  X,
  Shield,
  User,
  Settings,
  LogOut,
  Search,
  Heart,
  TrendingUp,
  PieChart,
  Mail,
  AtSign,
  Globe,
  Calendar,
  Pencil,
  AlertTriangle,
} from "lucide-react";

// ─── Nav config ─────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Analyze", icon: BarChart2 },
  { label: "Watchlist", icon: Bookmark },
  { label: "News", icon: Newspaper },
];

// ─── Dummy profile data ─────────────────────────────────────────────────────

const user = JSON.parse(localStorage.getItem("user"));

const USER = {
  fullName: user?.name || "Unknown User",
  email: user?.email || "",
  username: user?.email?.split("@")[0] || "",
  country: "India",
  joined: "2026",
  initials: user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U",
};

const STATS = [
  { id: "searched", label: "Stocks Searched", value: "1,284", icon: Search, color: "emerald" },
  { id: "watchlist", label: "Watchlist Stocks", value: "32", icon: Heart, color: "red" },
  { id: "total", label: "Total Searches", value: "4,902", icon: TrendingUp, color: "blue" },
  { id: "sector", label: "Favorite Sector", value: "Tech", icon: PieChart, color: "purple" },
];

const ACCOUNT_FIELDS = [
  { label: "Full Name", value: USER.fullName, icon: User },
  { label: "Email", value: USER.email, icon: Mail },
  { label: "Username", value: USER.username, icon: AtSign },
  { label: "Country", value: USER.country, icon: Globe },
  { label: "Member Since", value: USER.joined, icon: Calendar },
];

const COLOR_MAP = {
  emerald: { icon: "#22C55E", bg: "rgba(34,197,94,0.10)", border: "rgba(34,197,94,0.18)" },
  red:     { icon: "#F87171", bg: "rgba(248,113,113,0.10)", border: "rgba(248,113,113,0.18)" },
  blue:    { icon: "#60A5FA", bg: "rgba(96,165,250,0.10)", border: "rgba(96,165,250,0.18)" },
  purple:  { icon: "#A78BFA", bg: "rgba(167,139,250,0.10)", border: "rgba(167,139,250,0.18)" },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Dashboard");

  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/login");
  };


    

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handle = (e) => {
      if (!e.target.closest("#pp-profile-menu")) setProfileOpen(false);
      if (!e.target.closest("#pp-mobile-nav") && !e.target.closest("#pp-hamburger"))
        setMobileOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

        .pp-root {
          min-height: 100vh;
          background: #050505;
          background-image:
            radial-gradient(ellipse 55% 35% at 15% 0%, rgba(34,197,94,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 90% 20%, rgba(34,197,94,0.03) 0%, transparent 55%);
        }

        /* ── Navbar ── */
        .pp-navbar {
          position: sticky; top: 0; z-index: 50;
          width: 100%; height: 72px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px;
          transition: background 300ms ease, box-shadow 300ms ease;
          background: ${scrolled ? "rgba(3,3,3,0.94)" : "rgba(5,5,5,0.78)"};
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(34,197,94,0.07);
          box-shadow: ${scrolled ? "0 1px 24px rgba(0,0,0,0.55)" : "none"};
        }
        .pp-logo-icon {
          width: 36px; height: 36px; border-radius: 10px;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .pp-brand { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; white-space: nowrap; }
        .pp-brand span { color: #22c55e; }
        .pp-nav-links { display: flex; align-items: center; gap: 2px; position: absolute; left: 50%; transform: translateX(-50%); }
        .pp-nav-link {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 999px;
          font-size: 13.5px; font-weight: 500; color: #9ca3af;
          cursor: pointer; transition: color 250ms, background 250ms, border-color 250ms;
          white-space: nowrap; border: 1px solid transparent; background: transparent; text-decoration: none;
        }
        .pp-nav-link:hover { color: #e5e7eb; background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.07); }
        .pp-nav-link.active { color: #22c55e; background: rgba(34,197,94,0.10); border-color: rgba(34,197,94,0.20); }
        .pp-bell-btn {
          position: relative; width: 38px; height: 38px; border-radius: 50%;
          background: transparent; border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 250ms, border-color 250ms; flex-shrink: 0;
        }
        .pp-bell-btn:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.14); }
        .pp-bell-badge { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; border-radius: 50%; background: #22c55e; border: 1.5px solid #050505; }
        .pp-profile-btn {
          display: flex; align-items: center; gap: 10px; padding: 5px 12px 5px 5px;
          border-radius: 999px; background: transparent; border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer; transition: background 250ms, border-color 250ms; flex-shrink: 0; position: relative;
        }
        .pp-profile-btn:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.14); }
        .pp-avatar-sm {
          width: 30px; height: 30px; border-radius: 50%;
          background: linear-gradient(135deg, #065f46, #22c55e);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
        }
        .pp-profile-name { font-size: 13px; font-weight: 600; color: #e5e7eb; }
        .pp-chevron { color: #9ca3af; transition: transform 300ms; }
        .pp-chevron.open { transform: rotate(180deg); }
        .pp-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0; min-width: 180px;
          background: rgba(10,10,10,0.96); backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 6px;
          box-shadow: 0 12px 36px rgba(0,0,0,0.6); animation: pp-dropIn 180ms ease; z-index: 100;
        }
        @keyframes pp-dropIn { from { opacity: 0; transform: translateY(-6px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .pp-dropdown-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 9px; font-size: 13.5px; color: #d1d5db; cursor: pointer; transition: background 180ms, color 180ms; }
        .pp-dropdown-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .pp-dropdown-item.danger:hover { background: rgba(239,68,68,0.08); color: #f87171; }
        .pp-dropdown-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0; }
        .pp-hamburger { display: none; width: 38px; height: 38px; border-radius: 9px; background: transparent; border: 1px solid rgba(255,255,255,0.08); align-items: center; justify-content: center; cursor: pointer; transition: background 250ms, border-color 250ms; flex-shrink: 0; }
        .pp-hamburger:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.14); }

        @media (max-width: 900px) { .pp-nav-links { display: none !important; } .pp-hamburger { display: flex !important; } }
        @media (max-width: 640px) {
          .pp-navbar { padding: 0 16px; }
          .pp-profile-name, .pp-chevron { display: none !important; }
          .pp-profile-btn { padding: 5px; }
          .pp-bell-btn { display: none; }
        }

        /* Mobile drawer */
        .pp-mobile-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 60; backdrop-filter: blur(4px); animation: pp-fadeIn 200ms ease; }
        @keyframes pp-fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .pp-mobile-drawer {
          position: fixed; top: 0; left: 0; bottom: 0; width: 272px;
          background: rgba(8,8,8,0.98); backdrop-filter: blur(24px);
          border-right: 1px solid rgba(255,255,255,0.07); z-index: 70;
          animation: pp-slideIn 260ms cubic-bezier(0.22,1,0.36,1);
          display: flex; flex-direction: column;
        }
        @keyframes pp-slideIn { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .pp-mobile-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .pp-mobile-links { padding: 12px; flex: 1; }
        .pp-mobile-link {
          display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 10px;
          font-size: 14px; font-weight: 500; color: #9ca3af; cursor: pointer;
          transition: background 200ms, color 200ms; margin-bottom: 2px;
          border: 1px solid transparent; background: transparent; text-align: left; width: 100%;
        }
        .pp-mobile-link:hover { background: rgba(255,255,255,0.05); color: #e5e7eb; }
        .pp-mobile-link.active { background: rgba(34,197,94,0.10); color: #22c55e; border-color: rgba(34,197,94,0.18); }

        /* ── Page content ── */
        .pp-content { max-width: 1080px; margin: 0 auto; padding: 48px 28px 80px; }

        /* Profile card */
        .pp-profile-card {
          display: flex; flex-direction: column; align-items: center; text-align: center;
          gap: 14px; padding: 44px 32px;
          border-radius: 24px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          margin-bottom: 28px;
          position: relative;
          overflow: hidden;
        }
        .pp-profile-card::before {
          content: ""; position: absolute; top: -40%; left: 50%; transform: translateX(-50%);
          width: 60%; height: 200px;
          background: radial-gradient(ellipse, rgba(34,197,94,0.10) 0%, transparent 70%);
          pointer-events: none;
        }
        .pp-avatar-lg {
          width: 96px; height: 96px; border-radius: 50%;
          background: linear-gradient(135deg, #065f46, #22c55e);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; font-weight: 700; color: #fff;
          border: 3px solid rgba(34,197,94,0.25);
          box-shadow: 0 0 0 6px rgba(34,197,94,0.06);
          position: relative; z-index: 1;
        }
        .pp-fullname { font-size: 24px; font-weight: 700; color: #fff; letter-spacing: -0.4px; position: relative; z-index: 1; }
        .pp-email { font-size: 13.5px; color: #6b7280; font-weight: 400; position: relative; z-index: 1; }
        .pp-badge-row { display: flex; align-items: center; gap: 10px; margin-top: 4px; position: relative; z-index: 1; flex-wrap: wrap; justify-content: center; }
        .pp-user-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11.5px; font-weight: 600; color: #22C55E;
          background: rgba(34,197,94,0.10); border: 1px solid rgba(34,197,94,0.20);
          padding: 5px 12px; border-radius: 999px; letter-spacing: 0.2px;
        }
        .pp-joined-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 11.5px; font-weight: 500; color: #9ca3af;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          padding: 5px 12px; border-radius: 999px;
        }

        /* Stat cards */
        .pp-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
        @media (max-width: 900px) { .pp-stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .pp-stats-grid { grid-template-columns: 1fr; } }
        .pp-stat-card {
          display: flex; flex-direction: column; gap: 12px;
          padding: 20px; border-radius: 16px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          transition: transform 250ms ease, border-color 250ms ease, background 250ms ease, box-shadow 250ms ease;
          cursor: default;
        }
        .pp-stat-card:hover {
          transform: translateY(-3px);
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.12);
          box-shadow: 0 8px 28px rgba(0,0,0,0.36);
        }
        .pp-stat-icon-wrap { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pp-stat-value { font-size: 26px; font-weight: 700; color: #fff; letter-spacing: -0.5px; line-height: 1; }
        .pp-stat-label { font-size: 12px; color: #6b7280; font-weight: 500; }

        /* Section heading */
        .pp-section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 12px; }
        .pp-section-title { font-size: 18px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
        .pp-section-sub { font-size: 12.5px; color: #6b7280; margin-top: 3px; }

        /* Edit button */
        .pp-edit-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 13px; font-weight: 600; color: #050505;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          border: none; padding: 9px 18px; border-radius: 10px;
          cursor: pointer; transition: transform 250ms ease, box-shadow 250ms ease;
        }
        .pp-edit-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 18px rgba(34,197,94,0.28); }

        /* Account info cards */
        .pp-account-card {
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px; padding: 6px; backdrop-filter: blur(16px); margin-bottom: 28px;
        }
        .pp-account-row {
          display: flex; align-items: center; gap: 14px;
          padding: 16px 14px; border-radius: 14px;
          transition: background 200ms ease;
        }
        .pp-account-row:hover { background: rgba(255,255,255,0.03); }
        .pp-account-row + .pp-account-row { border-top: 1px solid rgba(255,255,255,0.05); }
        .pp-account-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(34,197,94,0.08); border: 1px solid rgba(34,197,94,0.16); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pp-account-text { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
        .pp-account-label { font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.3px; }
        .pp-account-value { font-size: 14px; font-weight: 600; color: #e5e7eb; word-break: break-word; }

        /* Danger zone */
        .pp-danger-card {
          padding: 24px; border-radius: 20px;
          background: rgba(248,113,113,0.03);
          border: 1px solid rgba(248,113,113,0.16);
          display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap;
        }
        .pp-danger-text-wrap { display: flex; align-items: flex-start; gap: 12px; }
        .pp-danger-icon-wrap { width: 38px; height: 38px; border-radius: 10px; background: rgba(248,113,113,0.10); border: 1px solid rgba(248,113,113,0.20); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pp-danger-title { font-size: 14.5px; font-weight: 700; color: #f87171; margin-bottom: 3px; }
        .pp-danger-sub { font-size: 12.5px; color: #6b7280; max-width: 380px; line-height: 1.5; }
        .pp-logout-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 13.5px; font-weight: 600; color: #f87171;
          background: transparent; border: 1.5px solid rgba(248,113,113,0.4);
          padding: 10px 20px; border-radius: 10px; cursor: pointer;
          transition: background 250ms ease, border-color 250ms ease, transform 250ms ease;
          white-space: nowrap; flex-shrink: 0;
        }
        .pp-logout-btn:hover { background: rgba(248,113,113,0.10); border-color: rgba(248,113,113,0.6); transform: translateY(-1px); }
      `}</style>

      <div className="pp-root">
        {/* ── NAVBAR ── */}
        <nav className="pp-navbar">
          <Link
            to="/dashboard"
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                flexShrink: 0,
            }}
            >
            <div className="pp-logo-icon">
                <Shield size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="pp-brand">
                Market<span>Guard</span> AI
            </span>
            </Link>

          <nav className="pp-nav-links">
            {NAV_LINKS.map(({ label, icon: Icon }) => (
            <Link
                key={label}
                to={
                label === "Dashboard"
                    ? "/dashboard"
                    : label === "Analyze"
                    ? "/"
                    : label === "Watchlist"
                    ? "/watchlist"
                    : "/news"
                }
                className={`pp-nav-link${activeLink === label ? " active" : ""}`}
                onClick={() => setActiveLink(label)}
            >
                <Icon size={14} strokeWidth={2} />
                {label}
            </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <button className="pp-bell-btn" aria-label="Notifications">
              <Bell size={16} color="#9ca3af" strokeWidth={2} />
              <span className="pp-bell-badge" />
            </button>

            <div id="pp-profile-menu" style={{ position: "relative" }}>
              <button className="pp-profile-btn" onClick={() => setProfileOpen((v) => !v)} aria-expanded={profileOpen}>
                <div className="pp-avatar-sm">{USER.initials}</div>
                <span className="pp-profile-name">{USER.fullName}</span>
                <ChevronDown size={14} className={`pp-chevron${profileOpen ? " open" : ""}`} strokeWidth={2.5} />
              </button>
              {profileOpen && (
                <div className="pp-dropdown">
                  <Link
                    to="/profile"
                    className="pp-dropdown-item"
                    style={{ textDecoration: "none" }}
                    >
                    <User size={14} />
                    Profile
                    </Link>
                  {/* <div className="pp-dropdown-item"><Settings size={14} /> Settings</div> */}
                  <div className="pp-dropdown-divider" />
                  <div
                    className="pp-dropdown-item danger"
                    onClick={handleLogout}
                    >
                    <LogOut size={14} />
                    Logout
                  </div>
                </div>
              )}
            </div>

            <button id="pp-hamburger" className="pp-hamburger" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <Menu size={17} color="#d1d5db" strokeWidth={2} />
            </button>
          </div>
        </nav>

        {/* ── MOBILE DRAWER ── */}
        {mobileOpen && (
          <>
            <div className="pp-mobile-overlay" onClick={() => setMobileOpen(false)} />
            <div id="pp-mobile-nav" className="pp-mobile-drawer">
              <div className="pp-mobile-header">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div className="pp-logo-icon" style={{ width: 30, height: 30, borderRadius: 8 }}>
                    <Shield size={15} color="#fff" strokeWidth={2.5} />
                  </div>
                  <span className="pp-brand" style={{ fontSize: 15 }}>Market<span>Guard</span> AI</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <X size={16} color="#9ca3af" />
                </button>
              </div>
              <div className="pp-mobile-links">
                {NAV_LINKS.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    className={`pp-mobile-link${activeLink === label ? " active" : ""}`}
                    onClick={() => { setActiveLink(label); setMobileOpen(false); }}
                  >
                    <Icon size={16} strokeWidth={2} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── PAGE CONTENT ── */}
        <div className="pp-content">

          {/* Profile card */}
          <div className="pp-profile-card">
            <div className="pp-avatar-lg">{USER.initials}</div>
            <div className="pp-fullname">{USER.fullName}</div>
            <div className="pp-email">{USER.email}</div>
            <div className="pp-badge-row">
              <span className="pp-user-badge"><Shield size={12} strokeWidth={2.5} /> MarketGuard AI User</span>
              <span className="pp-joined-badge"><Calendar size={12} strokeWidth={2} /> Joined {USER.joined}</span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="pp-stats-grid">
            {STATS.map(({ id, label, value, icon: Icon, color }) => {
              const c = COLOR_MAP[color];
              return (
                <div className="pp-stat-card" key={id}>
                  <div className="pp-stat-icon-wrap" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                    <Icon size={16} color={c.icon} strokeWidth={2} />
                  </div>
                  <div className="pp-stat-value">{value}</div>
                  <div className="pp-stat-label">{label}</div>
                </div>
              );
            })}
          </div>

          {/* Account information */}
          <div className="pp-section-head">
            <div>
              <div className="pp-section-title">Account Information</div>
              <div className="pp-section-sub">Your personal details and account settings.</div>
            </div>
            <button className="pp-edit-btn"><Pencil size={13} strokeWidth={2.5} /> Edit Profile</button>
          </div>

          <div className="pp-account-card">
            {ACCOUNT_FIELDS.map(({ label, value, icon: Icon }) => (
              <div className="pp-account-row" key={label}>
                <div className="pp-account-icon"><Icon size={16} color="#22C55E" strokeWidth={2} /></div>
                <div className="pp-account-text">
                  <span className="pp-account-label">{label}</span>
                  <span className="pp-account-value">{value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Danger zone */}
          <div className="pp-section-head">
            <div>
              <div className="pp-section-title">Danger Zone</div>
              <div className="pp-section-sub">Manage your session and account access.</div>
            </div>
          </div>

          <div className="pp-danger-card">
            <div className="pp-danger-text-wrap">
              <div className="pp-danger-icon-wrap"><AlertTriangle size={16} color="#f87171" strokeWidth={2} /></div>
              <div>
                <div className="pp-danger-title">Log out of MarketGuard AI</div>
                <div className="pp-danger-sub">You'll be signed out of this device and returned to the login screen.</div>
              </div>
            </div>
            <button
            className="pp-logout-btn"
            onClick={handleLogout}
            >
            <LogOut size={15} />
            Logout
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
