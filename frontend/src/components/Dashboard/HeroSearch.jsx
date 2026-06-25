import { useState } from 'react'

const TRENDING_STOCKS = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'TCS', 'RELIANCE']

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M20 20l-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function WaveIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 14c1-3 3-3 4 0s3 3 4 0 3-3 4 0 3 3 4 0"
        stroke="#22C55E"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"
        fill="#22C55E"
      />
    </svg>
  )
}

export default function HeroSearch() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const handleAnalyze = (e) => {
    e.preventDefault()
    // UI only — wire up real stock analysis here.
  }

  return (
    <section className="relative w-full overflow-hidden bg-charcoal px-6 py-20 md:px-10">
      {/* ambient glow, consistent with the rest of the dark theme */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[50rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-emerald/[0.08] blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <h1 className="flex items-center gap-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Welcome Back
            <WaveIcon />
          </h1>
          <p className="mt-3 max-w-xl font-body text-base text-white/55 sm:text-lg">
            Search any stock and get AI-powered market insights in seconds.
          </p>
        </div>

        {/* Main search card */}
        <form
          onSubmit={handleAnalyze}
          className={`mt-10 rounded-3xl border bg-white/[0.03] p-3 backdrop-blur-2xl transition-all duration-300 sm:p-4 ${
            focused
              ? 'border-emerald/50 shadow-[0_0_40px_rgba(34,197,94,0.2)]'
              : 'border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
          }`}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <span
                className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
                  focused ? 'text-emerald' : 'text-white/40'
                }`}
              >
                <SearchIcon />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="Search AAPL, TSLA, NVDA, TCS, RELIANCE..."
                className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-4 font-body text-base text-white placeholder:text-white/35 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="shrink-0 rounded-2xl bg-emerald px-7 py-4 font-body text-sm font-semibold text-charcoal transition-all duration-300 hover:bg-emerald-dark hover:shadow-[0_0_28px_rgba(34,197,94,0.45)] active:scale-[0.98]"
            >
              Analyze Stock
            </button>
          </div>
        </form>

        {/* Trending stock chips */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {TRENDING_STOCKS.map((symbol) => (
            <button
              key={symbol}
              type="button"
              onClick={() => setQuery(symbol)}
              className="rounded-full border border-white/[0.1] bg-white/[0.03] px-4 py-2 font-body text-sm text-white/75 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald/40 hover:bg-emerald/10 hover:text-emerald hover:shadow-[0_0_18px_rgba(34,197,94,0.3)]"
            >
              {symbol}
            </button>
          ))}
        </div>

        {/* Extra info */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <SparkIcon />
          <p className="font-body text-sm text-white/45">
            Powered by AI-driven market intelligence
          </p>
        </div>
      </div>
    </section>
  )
}