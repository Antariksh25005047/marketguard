import { motion } from "framer-motion";
import { useEffect, useState } from "react";
// const INDICES = [
//   {
//     symbol: 'NIFTY 50',
//     exchange: 'NSE · India',
//     value: '24,013.10',
//     change: '-0.64%',
//     delta: '-155.00',
//     positive: false,
//   },
//   {
//     symbol: 'SENSEX',
//     exchange: 'BSE · India',
//     value: '76,802.90',
//     change: '-0.78%',
//     delta: '-608.00',
//     positive: false,
//   },
//   {
//     symbol: 'NASDAQ',
//     exchange: 'Composite · US',
//     value: '26,830.96',
//     change: '-0.09%',
//     delta: '-24.18',
//     positive: false,
//   },
//   {
//     symbol: 'S&P 500',
//     exchange: 'SPX · US',
//     value: '7,584.31',
//     change: '+0.41%',
//     delta: '+31.05',
//     positive: true,
//   },
// ]

function IndexCard({ index }) {
  const symbol = index.symbol;

const exchange = index.exchange;

const value = Number(index.value).toLocaleString();

const change =
  `${index.change > 0 ? "+" : ""}${Number(index.change).toFixed(2)}%`;

const delta =
  `${index.delta > 0 ? "+" : ""}${Number(index.delta).toFixed(2)}`;

const positive = index.change >= 0;

  return (
    <div className="group relative overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] p-10 min-h-[200px] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:border-white/[0.16] hover:bg-white/[0.05] hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
      {/* corner glow, colored by direction, intensifies on hover */}
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
          <p className="mt-0.5 font-body text-xs text-white/45">{exchange}</p>
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

      <p className="relative mt-5 font-display text-3xl font-semibold text-white">
        {value}
      </p>

      <p
        className={`relative mt-2 font-body text-sm ${
          positive ? 'text-emerald/80' : 'text-rose/80'
        }`}
      >
        {delta} pts today
      </p>
    </div>
  )
}

export default function MarketOverview() {
  const [indices, setIndices] = useState([]);

useEffect(() => {
  async function fetchMarketOverview() {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/stocks/market-overview"
      );

      const data = await res.json();

      setIndices(data);
    } catch (err) {
      console.error(err);
    }
  }

  fetchMarketOverview();
}, []);
  return (
    <section className="relative w-full bg-charcoal px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col items-start gap-2">
          <span className="font-body text-xs uppercase tracking-widest text-emerald/80">
            Global Market Pulse
          </span>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Market Overview
          </h2>
          <p className="max-w-md font-body text-sm text-white/50">
            A quick read on the benchmark indices shaping today's session,
            across India and the US.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
  {indices.map((index, i) => (
    <motion.div
  key={index.symbol}
  initial={{
    opacity: 0,
    x: i % 2 === 0 ? -200 : 200,
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
    delay: i * 0.1,
  }}
>
  <IndexCard index={index} />
</motion.div>
  ))}
</div>

        <p className="mt-6 font-body text-xs text-white/30">
          Closing levels as of June 18–19, 2026. For demonstration —
          connect a live market data feed for real-time figures.
        </p>
      </div>
    </section>
  )
}
