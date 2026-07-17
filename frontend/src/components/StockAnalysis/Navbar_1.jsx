import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart2,
  Bookmark,
  Newspaper,
  Bell,
  ChevronDown,
  X,
  Menu,
  TrendingUp,
  User,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Analyze", icon: BarChart2, href: "#" },
  { label: "Watchlist", icon: Bookmark, href: "/dashboard" },
  { label: "News", icon: Newspaper, href: "#" },
];

export default function Navbar() {

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const userName = user.name || "MarketGuard User";

  const initials = userName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Analyze");

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
      if (!e.target.closest("#profile-menu")) setProfileOpen(false);
      if (!e.target.closest("#mobile-nav") && !e.target.closest("#hamburger"))
        setMobileOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * { font-family: 'Inter', sans-serif; box-sizing: border-box; }

        .mg-navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          transition: background 300ms ease, box-shadow 300ms ease;
          background: ${scrolled ? "rgba(3,3,3,0.94)" : "rgba(5,5,5,0.78)"};
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(34,197,94,0.07);
          box-shadow: ${scrolled ? "0 1px 24px rgba(0,0,0,0.55)" : "none"};
        }

        /* Logo */
        .mg-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #16a34a, #22c55e);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .mg-brand { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; white-space: nowrap; }
        .mg-brand span { color: #22c55e; }

        /* Nav links */
        .mg-nav-link {
          position: relative;
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 13.5px; font-weight: 500;
          color: #9ca3af;
          cursor: pointer;
          transition: color 250ms, background 250ms, border-color 250ms;
          white-space: nowrap;
          border: 1px solid transparent;
          background: transparent;
          text-decoration: none;
        }
        .mg-nav-link:hover {
          color: #e5e7eb;
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.05);
        }
        .mg-nav-link.active {
          color: #22c55e;
          background: rgba(34,197,94,0.06);
          border-color: rgba(34,197,94,0.12);
        }

        /* Bell */
        .mg-bell-btn {
          position: relative;
          width: 38px; height: 38px; border-radius: 50%;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 250ms, border-color 250ms;
          flex-shrink: 0;
        }
        .mg-bell-btn:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.14);
        }
        .mg-bell-badge {
          position: absolute; top: 8px; right: 8px;
          width: 7px; height: 7px; border-radius: 50%;
          background: #22c55e;
          border: 1.5px solid #050505;
        }

        /* Profile */
        .mg-profile-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 5px 12px 5px 5px;
          border-radius: 999px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
          transition: background 250ms, border-color 250ms;
          flex-shrink: 0;
        }
        .mg-profile-btn:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.14);
        }
        .mg-avatar {
          width: 30px; height: 30px; border-radius: 50%;
          background: linear-gradient(135deg, #065f46, #22c55e);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #fff;
          flex-shrink: 0;
        }
        .mg-profile-name { font-size: 13px; font-weight: 600; color: #e5e7eb; }
        .mg-profile-role { font-size: 11px; color: #6b7280; margin-top: 1px; }
        .mg-chevron { color: #9ca3af; transition: transform 300ms; }
        .mg-chevron.open { transform: rotate(180deg); }

        /* Dropdown */
        .mg-dropdown {
          position: absolute; top: calc(100% + 10px); right: 0;
          min-width: 180px;
          background: rgba(10,10,10,0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 6px;
          box-shadow: 0 12px 36px rgba(0,0,0,0.6);
          animation: mg-dropIn 180ms ease;
          z-index: 100;
        }
        @keyframes mg-dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        .mg-dropdown-item {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 12px; border-radius: 9px;
          font-size: 13.5px; color: #d1d5db; cursor: pointer;
          transition: background 180ms, color 180ms;
        }
        .mg-dropdown-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .mg-dropdown-item.danger:hover { background: rgba(239,68,68,0.08); color: #f87171; }
        .mg-dropdown-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 4px 0; }

        /* Hamburger */
        .mg-hamburger {
          display: none; width: 38px; height: 38px; border-radius: 9px;
          background: transparent; border: 1px solid rgba(255,255,255,0.08);
          align-items: center; justify-content: center; cursor: pointer;
          transition: background 250ms, border-color 250ms;
          flex-shrink: 0;
        }
        .mg-hamburger:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.14); }

        /* Mobile drawer */
        .mg-mobile-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.55);
          z-index: 60; backdrop-filter: blur(4px);
          animation: mg-fadeIn 200ms ease;
        }
        @keyframes mg-fadeIn { from { opacity: 0 } to { opacity: 1 } }
        .mg-mobile-drawer {
          position: fixed; top: 0; left: 0; bottom: 0; width: 272px;
          background: rgba(8,8,8,0.98);
          backdrop-filter: blur(24px);
          border-right: 1px solid rgba(255,255,255,0.07);
          z-index: 70;
          animation: mg-slideIn 260ms cubic-bezier(0.22,1,0.36,1);
          display: flex; flex-direction: column;
        }
        @keyframes mg-slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        .mg-mobile-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .mg-mobile-links { padding: 12px; flex: 1; }
        .mg-mobile-link {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 14px; border-radius: 10px;
          font-size: 14px; font-weight: 500; color: #9ca3af; cursor: pointer;
          transition: background 200ms, color 200ms; margin-bottom: 2px;
          border: 1px solid transparent; background: transparent;
          text-align: left; width: 100%;
        }
        .mg-mobile-link:hover { background: rgba(255,255,255,0.05); color: #e5e7eb; }
        .mg-mobile-link.active {
          background: rgba(34,197,94,0.10);
          color: #22c55e;
          border-color: rgba(34,197,94,0.18);
        }
        .mg-mobile-footer {
          padding: 12px 12px 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .mg-mobile-user {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; border-radius: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 8px;
        }
        .mg-mobile-user-name  { font-size: 13.5px; font-weight: 600; color: #e5e7eb; }
        .mg-mobile-user-email { font-size: 11.5px; color: #6b7280; margin-top: 2px; }

        /* Responsive */
        @media (max-width: 900px) {
          .mg-nav-links { display: none !important; }
          .mg-hamburger { display: flex !important; }
        }
        @media (max-width: 640px) {
          .mg-navbar { padding: 0 16px; }
          .mg-profile-name, .mg-profile-role, .mg-chevron { display: none !important; }
          .mg-profile-btn { padding: 5px; }
          .mg-bell-btn { display: none; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="mg-navbar">

        {/* LEFT: Logo + Brand */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}>
          <div className="mg-logo-icon">
            <Shield size={18} color="#fff" strokeWidth={2.5} />
          </div>
          <span className="mg-brand">
            Market<span>Guard</span> AI
          </span>
        </a>

        {/* CENTER: Nav links */}
        <nav className="mg-nav-links" style={{ display: "flex", alignItems: "center", gap: "2px", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          {NAV_LINKS.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              className={`mg-nav-link${activeLink === label ? " active" : ""}`}
              onClick={async (e) => {
  e.preventDefault();

  setActiveLink(label);

  if (label === "Watchlist") {
    try {
      const currentSymbol =
        window.location.pathname.split("/").pop();
        console.log("Path:", window.location.pathname);
        console.log("Current Symbol:", currentSymbol);

      await fetch(
        `http://127.0.0.1:8000/api/watchlist/add?user_id=1&symbol=${currentSymbol}`,
        {
          method: "POST",
        }
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  } else {
    navigate(href);
  }
}}
            >
              <Icon size={14} strokeWidth={2} />
              {label}
            </a>
          ))}
        </nav>

        {/* RIGHT: Bell + Profile + Hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>

          {/* <button className="mg-bell-btn" aria-label="Notifications">
            <Bell size={16} color="#9ca3af" strokeWidth={2} />
            <span className="mg-bell-badge" />
          </button> */}

          <div id="profile-menu" style={{ position: "relative" }}>
            <button
              className="mg-profile-btn"
              onClick={() => setProfileOpen((v) => !v)}
              aria-expanded={profileOpen}
            >
              <div className="mg-avatar">{initials}</div>
              <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                <span className="mg-profile-name">
                  {userName}
                </span>
                <span className="mg-profile-role">MarketGuard User</span>
              </div>
              <ChevronDown
                size={14}
                className={`mg-chevron${profileOpen ? " open" : ""}`}
                strokeWidth={2.5}
              />
            </button>

            {profileOpen && (
              <div className="mg-dropdown">
              <Link
                to="/profile"
                className="mg-dropdown-item"
                style={{ textDecoration: "none" }}
                onClick={() => setProfileOpen(false)}
              >
                <User size={14} />
                Profile
              </Link>
                {/* <div className="mg-dropdown-item">
                  <Settings size={14} /> Settings
                </div> */}
                <div className="mg-dropdown-divider" />
                <div
                  className="mg-dropdown-item danger"
                  onClick={handleLogout}
                >
                  <LogOut size={14} />
                  Logout
                </div>
              </div>
            )}
          </div>

          <button
            id="hamburger"
            className="mg-hamburger"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={17} color="#d1d5db" strokeWidth={2} />
          </button>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      {mobileOpen && (
        <>
          <div className="mg-mobile-overlay" onClick={() => setMobileOpen(false)} />
          <div id="mobile-nav" className="mg-mobile-drawer">

            <div className="mg-mobile-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="mg-logo-icon" style={{ width: 30, height: 30, borderRadius: 8 }}>
                  <Shield size={15} color="#fff" strokeWidth={2.5} />
                </div>
                <span className="mg-brand" style={{ fontSize: 15 }}>
                  Market<span>Guard</span> AI
                </span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} color="#9ca3af" />
              </button>
            </div>

            <div className="mg-mobile-links">
              <div style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 14px 8px" }}>Navigation</div>
              {NAV_LINKS.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  className={`mg-mobile-link${activeLink === label ? " active" : ""}`}
                  onClick={() => { setActiveLink(label); setMobileOpen(false); }}
                >
                  <Icon size={16} strokeWidth={2} />
                  {label}
                  {label === "Watchlist" && (
                    <span style={{ marginLeft: "auto", background: "rgba(34,197,94,0.12)", color: "#22c55e", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999 }}>4</span>
                  )}
                </button>
              ))}

              <div style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", letterSpacing: "0.08em", textTransform: "uppercase", padding: "16px 14px 8px" }}>Markets</div>
              <button className="mg-mobile-link" onClick={() => setMobileOpen(false)}>
                <TrendingUp size={16} strokeWidth={2} />
                Market Overview
              </button>
            </div>

            <div className="mg-mobile-footer">
              <div className="mg-mobile-user">
                <div className="mg-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>AG</div>
                <div>
                  <div className="mg-mobile-user-name">Anuj Guptta</div>
                  <div className="mg-mobile-user-email">gganujgupta18@gmail.com</div>
                </div>
              </div>
              <button className="mg-mobile-link" onClick={() => setMobileOpen(false)}>
                <User size={16} strokeWidth={2} /> Profile
              </button>
              <button className="mg-mobile-link" onClick={() => setMobileOpen(false)}>
                <Settings size={16} strokeWidth={2} /> Settings
              </button>
              <button className="mg-mobile-link" style={{ color: "#f87171" }} onClick={() => setMobileOpen(false)}>
                <LogOut size={16} strokeWidth={2} /> Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
