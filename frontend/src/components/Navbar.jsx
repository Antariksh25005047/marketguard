import { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import Logo from './Logo'

const LINKS = [
  { name: "Home", id: "home" },
  { name: "Markets", id: "markets" },
  { name: "About", id: "about" },
  { name: "Contact", id: "contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile menu automatically if the viewport grows back to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? 'border-b border-white/[0.08] bg-charcoal/60 shadow-[0_4px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        {/* Left — logo + wordmark */}
        <Link to="/" className="flex items-center gap-2.5">
          <Logo active={scrolled} />
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            MarketGuard <span className="text-emerald">AI</span>
          </span>
        </Link>

        {/* Center — nav links (desktop only) */}
        <div className="hidden items-center gap-10 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className="group relative font-body text-sm text-white/65 transition-colors duration-200 hover:text-white"
            >
              {link.name}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-emerald transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Right — actions (desktop only) */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-full border border-white/20 px-5 py-2 font-body text-sm text-white/85 transition-all duration-200 hover:border-white/40 hover:bg-white/5 hover:text-white"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="relative overflow-hidden rounded-full bg-emerald px-5 py-2 font-body text-sm font-semibold text-charcoal transition-all duration-300 hover:bg-emerald-dark hover:shadow-[0_0_22px_rgba(34,197,94,0.45)] active:scale-[0.97]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-white/15 text-white/85 transition-colors hover:border-white/30 md:hidden"
        >
          <svg width="18" height="13" viewBox="0 0 18 13" fill="none">
            <line
              x1="0" y1="1" x2="18" y2="1"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
              className={`origin-center transition-transform duration-300 ${menuOpen ? 'translate-y-[5.5px] rotate-45' : ''}`}
            />
            <line
              x1="0" y1="6.5" x2="18" y2="6.5"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
              className={`transition-opacity duration-200 ${menuOpen ? 'opacity-0' : 'opacity-100'}`}
            />
            <line
              x1="0" y1="12" x2="18" y2="12"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
              className={`origin-center transition-transform duration-300 ${menuOpen ? '-translate-y-[5.5px] -rotate-45' : ''}`}
            />
          </svg>
        </button>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="animate-menu-in border-t border-white/[0.08] bg-charcoal/95 px-6 pb-6 pt-2 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1 pt-3">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-3 font-body text-base text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.08] pt-4">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="w-full rounded-full border border-white/20 px-5 py-2.5 text-center font-body text-sm text-white/85 transition-colors hover:border-white/40 hover:bg-white/5"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setMenuOpen(false)}
              className="w-full rounded-full bg-emerald px-5 py-2.5 text-center font-body text-sm font-semibold text-charcoal transition-colors duration-300 hover:bg-emerald-dark"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
