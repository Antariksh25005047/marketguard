function BookmarkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M6.5 4.5h11a1 1 0 0 1 1 1V20l-6.5-3.8L5.5 20V5.5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EmptyWatchlistIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      {/* dashed outer ring */}
      <circle
        cx="60"
        cy="60"
        r="46"
        stroke="rgba(34,197,94,0.25)"
        strokeWidth="1.5"
        strokeDasharray="6 7"
      />
      {/* soft glass disc */}
      <circle cx="60" cy="60" r="34" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
      {/* star / bookmark glyph */}
      <path
        d="M60 42l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3L60 65.6l-9.3 4.9 1.8-10.3-7.5-7.3 10.4-1.5L60 42Z"
        fill="rgba(34,197,94,0.18)"
        stroke="#22C55E"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Watchlist
 *
 * Currently renders only the empty state, since the backend isn't
 * connected yet. Once the API exists, this component should:
 *
 * 1. Fetch the user's saved symbols, e.g.:
 *      const { data: watchlist, isLoading } = useWatchlist(userId)
 *
 * 2. If `watchlist.length > 0`, render a grid of stock cards instead of
 *    the empty state below. Each card should display:
 *      - Stock Symbol        e.g. "AAPL"
 *      - Company Name        e.g. "Apple Inc."
 *      - Current Price       e.g. "$211.05"
 *      - Percentage Change   e.g. "+1.18%" (emerald) or "-2.64%" (rose)
 *      - A "Remove from Watchlist" button that calls something like:
 *          removeFromWatchlist(symbol)
 *
 *    A reasonable shape for that future data:
 *      { symbol: string, name: string, price: string, change: string, positive: boolean }
 *
 * 3. Keep the same glassmorphism card styling already established in
 *    RecentSearches.jsx / TrendingStocks.jsx for visual consistency —
 *    populated watchlist cards should look like siblings of those, just
 *    with the extra "Remove" action.
 *
 * 4. If `watchlist.length === 0`, still fall back to this same empty
 *    state, so it isn't only a "loading" placeholder.
 */
export default function Watchlist() {
  const isEmpty = true // BACKEND: replace with `watchlist.length === 0` once wired up

  return (
    <section className="w-full bg-charcoal px-6 py-12 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald/25 bg-emerald/10 text-emerald">
            <BookmarkIcon />
          </span>
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              My Watchlist
            </h2>
            <p className="mt-0.5 font-body text-sm text-white/50">
              Stocks you&apos;ve saved for quick access.
            </p>
          </div>
        </div>

        {/* BACKEND: once `watchlist` has items, swap this whole block for
            a responsive grid of stock cards (see the data shape noted
            in the comment above the component). Keep this empty-state
            branch for when the list is genuinely empty. */}
        {isEmpty ? (
          <div className="relative mt-7 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] px-6 py-16 text-center backdrop-blur-2xl">
            {/* ambient emerald glow */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald/[0.08] blur-[90px]"
              aria-hidden="true"
            />

            <div className="relative flex flex-col items-center">
              <EmptyWatchlistIllustration />

              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-white">
                Your watchlist is empty
              </h3>
              <p className="mt-2.5 max-w-sm font-body text-sm text-white/50">
                Search for a stock and click &lsquo;Add to Watchlist&rsquo; to
                save it here.
              </p>

              {/* <button
                type="button"
                className="mt-7 rounded-full border border-emerald/40 px-6 py-3 font-body text-sm font-semibold text-emerald transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald hover:bg-emerald/10 hover:shadow-[0_0_24px_rgba(34,197,94,0.3)] active:scale-[0.98]"
              >
                Explore Stocks
              </button> */}
            </div>
          </div>
        ) : (
          // BACKEND: populated watchlist grid goes here once data exists.
          null
        )}
      </div>
    </section>
  )
}