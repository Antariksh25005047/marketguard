import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
// const RECENT_SEARCHES = [
//   {
//     symbol: 'AAPL',
//     name: 'Apple Inc.',
//     price: '$211.05',
//     change: '+1.18%',
//     positive: true,
//   },
//   {
//     symbol: 'TSLA',
//     name: 'Tesla, Inc.',
//     price: '$256.40',
//     change: '-2.64%',
//     positive: false,
//   },
//   {
//     symbol: 'NVDA',
//     name: 'NVIDIA Corporation',
//     price: '$142.87',
//     change: '+4.32%',
//     positive: true,
//   },
//   {
//     symbol: 'MSFT',
//     name: 'Microsoft Corp.',
//     price: '$487.92',
//     change: '+0.74%',
//     positive: true,
//   },
//   {
//     symbol: 'TCS',
//     name: 'Tata Consultancy Services',
//     price: '₹4,128.60',
//     change: '+0.52%',
//     positive: true,
//   },
//   {
//     symbol: 'RELIANCE',
//     name: 'Reliance Industries Ltd.',
//     price: '₹1,486.25',
//     change: '-0.38%',
//     positive: false,
//   },
// ]

function StockCard({ stock }) {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/stock-analysis/${stock.symbol}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-left backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-emerald/30 hover:bg-white/[0.05] hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
    >
      <div className="relative flex items-start justify-between">

        <div>
          <p className="font-display text-base font-semibold text-white">
            {stock.symbol}
          </p>

          <p className="mt-1 text-xs text-white/50">
            {stock.company_name}
          </p>
        </div>

      </div>
    </button>
  );
}

export default function RecentSearches() {

  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {

    async function loadRecentSearches() {

      try {

        const res = await fetch(
          "http://127.0.0.1:8000/api/search/recent?user_email=test@gmail.com"
        );

        const data = await res.json();

        setRecentSearches(data.recent_searches);

      } catch (err) {

        console.log(err);

      }

    }

    loadRecentSearches();

  }, []);

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
              Quickly reopen stocks you've analyzed recently.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {recentSearches.length > 0 ? (

            recentSearches.map((stock) => (
              <StockCard
                key={stock.symbol}
                stock={stock}
              />
            ))

          ) : (

            <p className="text-white/50">
              No recent searches yet.
            </p>

          )}

        </div>

      </div>
    </section>
  );
}