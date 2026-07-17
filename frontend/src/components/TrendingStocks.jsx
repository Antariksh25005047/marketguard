import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// const STOCKS = [
//   {
//     symbol: 'NVDA',
//     name: 'NVIDIA Corporation',
//     price: '$142.87',
//     change: '+4.32%',
//     positive: true,
//     points: [22, 26, 24, 30, 28, 36, 34, 42, 40, 48],
//   },
//   {
//     symbol: 'AAPL',
//     name: 'Apple Inc.',
//     price: '$211.05',
//     change: '+1.18%',
//     positive: true,
//     points: [30, 32, 29, 33, 31, 35, 33, 37, 36, 39],
//   },
//   {
//     symbol: 'TSLA',
//     name: 'Tesla, Inc.',
//     price: '$256.40',
//     change: '-2.64%',
//     positive: false,
//     points: [40, 37, 39, 33, 35, 29, 31, 25, 27, 21],
//   },
//   {
//     symbol: 'MSFT',
//     name: 'Microsoft Corp.',
//     price: '$487.92',
//     change: '+0.74%',
//     positive: true,
//     points: [28, 30, 28, 31, 30, 33, 31, 34, 33, 36],
//   },
// ]

function Sparkline({ points, positive }) {
  const width = 160
  const height = 56
  const max = Math.max(...points)
  const min = Math.min(...points)
  const range = max - min || 1
  const stepX = width / (points.length - 1)

  const coords = points.map((p, i) => {
    const x = i * stepX
    const y = height - ((p - min) / range) * (height - 8) - 4
    return [x, y]
  })

  const linePath = coords
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(' ')

  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`

  const color = positive ? '#22C55E' : '#EF4444'
  const gradId = `spark-grad-${positive ? 'up' : 'down'}-${points[0]}`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-14 w-full overflow-visible"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradId})`} stroke="none" />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={coords[coords.length - 1][0]}
        cy={coords[coords.length - 1][1]}
        r="2.6"
        fill={color}
      />
    </svg>
  )
}

function StockCard({ stock, index }) {
  const symbol = stock.symbol.replace(".NS", "");

const name = stock.companyName;

const price = `₹${stock.price}`;

const change =
  `${stock.change > 0 ? "+" : ""}${stock.change}%`;

const positive = stock.change >= 0;

const points = positive
  ? [22,25,24,28,31,34,35,37,40,42]
  : [42,40,38,35,34,31,28,25,23,20];

  return (
    <div
      className="animate-card-fade-up group relative overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] p-10 min-h-[200px] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:border-white/[0.16] hover:bg-white/[0.05] hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* glow accent that intensifies on hover */}
      <div
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${
          positive ? 'bg-emerald/20' : 'bg-rose/20'
        }`}
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-display text-lg font-semibold tracking-tight text-white">
            {symbol}
          </p>
          <p className="mt-0.5 font-body text-xs text-white/45">{name}</p>
        </div>

        <span
          className={`rounded-full border px-2.5 py-1 font-body text-xs font-medium ${
           positive
             ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
             : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}
        >
          {change}
        </span>
      </div>

      <p className="relative mt-4 font-display text-2xl font-semibold text-white">
        {price}
      </p>

      <div className="relative mt-5">
        <Sparkline points={points} positive={positive} />
      </div>
    </div>
  )
}

export default function TrendingStocks() {

  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    async function fetchMovers() {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/stocks/movers"
        );

        const data = await res.json();

        const merged = [
          ...data.gainers,
          ...data.losers,
        ];

      merged.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

      setStocks(merged.slice(0, 4));
        console.log("Live Stocks:", merged);
      } catch (err) {
        console.error(err);
      }
    }

    fetchMovers();
  }, []);

  return (
    <section className="relative w-full bg-charcoal px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start gap-2">
          <span className="font-body text-xs uppercase tracking-widest text-emerald/80">
            Live Market Pulse
          </span>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Trending Stocks
          </h2>
          <p className="max-w-md font-body text-sm text-white/50">
            A snapshot of the names moving the market right now, ranked by
            momentum and signal strength.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
  {stocks.map((stock, index) => (
    <motion.div
      key={stock.symbol}
      initial={{
        opacity: 0,
        x: index % 2 === 0 ? -200 : 200,
        scale: 0.9,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        scale: 1,
      }}
      viewport={{
        once: false,
        amount: 0.2,
      }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
      }}
    >
      <StockCard stock={stock} index={index} />
    </motion.div>
  ))}
</div>
      </div>
    </section>
  )
}
