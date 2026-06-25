function HistoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7.5V12l3.2 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ---- DUMMY DATA ----
// Replace this array with a real fetch later, e.g.:
//   const { data } = useRecentSearches(userId)
// Each item should resolve to the same shape: symbol, name, price, change, positive.
const RECENT_SEARCHES = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: '$211.05',
    change: '+1.18%',
    positive: true,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: '$256.40',
    change: '-2.64%',
    positive: false,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: '$142.87',
    change: '+4.32%',
    positive: true,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    price: '$487.92',
    change: '+0.74%',
    positive: true,
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    price: '₹4,128.60',
    change: '+0.52%',
    positive: true,
  },
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries Ltd.',
    price: '₹1,486.25',
    change: '-0.38%',
    positive: false,
  },
]

function StockCard({ stock }) {
  const { symbol, name, price, change, positive } = stock

  const handleClick = () => {
    // FUTURE NAVIGATION: replace with real routing once stock detail
    // pages exist, e.g. with react-router-dom:
    //   navigate(`/stock/${symbol}`)
    // or with Next.js:
    //   router.push(`/stock/${symbol}`)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-emerald/30 hover:bg-white/[0.05] hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
    >
      {/* emerald glow that appears on hover */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-display text-base font-semibold tracking-tight text-white">
            {symbol}
          </p>
          <p className="mt-0.5 truncate font-body text-xs text-white/45">{name}</p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 font-body text-xs font-medium ${
            positive
              ? 'border-emerald/30 bg-emerald/10 text-emerald'
              : 'border-rose/30 bg-rose/10 text-rose'
          }`}
        >
          {change}
        </span>
      </div>

      <p className="relative mt-4 font-display text-xl font-semibold text-white">
        {price}
      </p>
    </button>
  )
}

export default function RecentSearches() {
  return (
    <section className="w-full bg-charcoal px-6 py-12 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald/25 bg-emerald/10 text-emerald">
            <HistoryIcon />
          </span>
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Recent Searches
            </h2>
            <p className="mt-0.5 font-body text-sm text-white/50">
              Quickly reopen stocks you&apos;ve analyzed recently.
            </p>
          </div>
        </div>

        {/* Cards grid */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {RECENT_SEARCHES.map((stock) => (
            <StockCard key={stock.symbol} stock={stock} />
          ))}
        </div>
      </div>
    </section>
  )
}