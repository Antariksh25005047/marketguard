import { useState, useMemo } from 'react'

const TIME_RANGES = ['1D', '1W', '1M', '6M', '1Y']

// Deterministic pseudo-random so the chart shape is stable across renders.
// Swap this entire generator out for a real API response when ready —
// see the "LIVE DATA" comment near the bottom of the component.
function seeded(seed) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function seedFromLabel(label) {
  let seed = 0
  for (let i = 0; i < label.length; i++) {
    seed += label.charCodeAt(i) * (i + 11)
  }
  return seed
}

function generateSeries(seed, count = 40, base = 178) {
  const rand = seeded(seed)
  let price = base
  const points = []
  for (let i = 0; i < count; i++) {
    price += (rand() - 0.42) * 3.2
    points.push(Number(price.toFixed(2)))
  }
  return points
}

function StockChart({ points }) {
  const width = 1000
  const height = 320
  const padding = 24

  const { linePath, areaPath, coords } = useMemo(() => {
    const max = Math.max(...points)
    const min = Math.min(...points)
    const range = max - min || 1
    const stepX = (width - padding * 2) / (points.length - 1)

    const coords = points.map((p, i) => {
      const x = padding + i * stepX
      const y = padding + (height - padding * 2) * (1 - (p - min) / range)
      return [x, y]
    })

    const linePath = coords
      .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`)
      .join(' ')

    const areaPath = `${linePath} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`

    return { linePath, areaPath, coords }
  }, [points])

  const gridLines = 5
  const lastCoord = coords[coords.length - 1]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full overflow-visible"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#16A34A" />
          <stop offset="55%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#6EE7B7" />
        </linearGradient>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
        </linearGradient>
        <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
          </feMerge>
        </filter>
      </defs>

      {/* soft horizontal grid lines */}
      {Array.from({ length: gridLines }).map((_, i) => {
        const y = padding + (i * (height - padding * 2)) / (gridLines - 1)
        return (
          <line
            key={i}
            x1={padding}
            x2={width - padding}
            y1={y}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        )
      })}

      {/* area fill under the line */}
      <path d={areaPath} fill="url(#chartFill)" stroke="none" />

      {/* blurred duplicate of the line for the glow effect */}
      <path
        d={linePath}
        fill="none"
        stroke="#22C55E"
        strokeWidth="3"
        strokeOpacity="0.55"
        filter="url(#chartGlow)"
      />

      {/* crisp gradient line on top */}
      <path
        d={linePath}
        fill="none"
        stroke="url(#chartStroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* current price marker */}
      <circle cx={lastCoord[0]} cy={lastCoord[1]} r="5" fill="#22C55E" />
      <circle
        cx={lastCoord[0]}
        cy={lastCoord[1]}
        r="9"
        fill="none"
        stroke="#22C55E"
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />
    </svg>
  )
}

export default function ChartSection() {
  const [activeRange, setActiveRange] = useState('1D')

  // ---- LIVE DATA: replace this static series with a real fetch, e.g. ----
  // const { data } = useStockChart(symbol, activeRange)
  // and pass `data.prices` into <StockChart points={...} /> below.
  const points = useMemo(() => generateSeries(seedFromLabel(activeRange)), [activeRange])

  const high = Math.max(...points).toFixed(2)
  const low = Math.min(...points).toFixed(2)
  const current = points[points.length - 1].toFixed(2)

  return (
    <section className="w-full bg-charcoal px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Header + time range controls */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Stock Performance
            </h2>
            <p className="mt-1.5 font-body text-sm text-white/50">
              Real-time AI-powered market visualization
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start rounded-full border border-white/[0.08] bg-white/[0.03] p-1.5 backdrop-blur-xl sm:self-auto">
            {TIME_RANGES.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setActiveRange(range)}
                className={`rounded-full px-3.5 py-1.5 font-body text-xs font-medium transition-all duration-300 ${
                  activeRange === range
                    ? 'bg-emerald text-charcoal shadow-[0_0_16px_rgba(34,197,94,0.4)]'
                    : 'text-white/55 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Main chart card */}
        <div className="relative mt-7 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-shadow duration-500 hover:shadow-[0_25px_90px_rgba(34,197,94,0.1)] sm:p-8">
          {/* faint animated glow behind the chart */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[80%] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-emerald/[0.06] blur-[100px]"
            aria-hidden="true"
            style={{ animationDuration: '4s' }}
          />

          {/* High / Low / Current labels */}
          <div className="relative flex flex-wrap items-center gap-x-8 gap-y-2">
            <div>
              <p className="font-body text-xs uppercase tracking-wider text-white/40">High</p>
              <p className="font-display text-lg font-semibold text-emerald">${high}</p>
            </div>
            <div>
              <p className="font-body text-xs uppercase tracking-wider text-white/40">Low</p>
              <p className="font-display text-lg font-semibold text-rose">${low}</p>
            </div>
            <div>
              <p className="font-body text-xs uppercase tracking-wider text-white/40">
                Current Price
              </p>
              <p className="font-display text-lg font-semibold text-white">${current}</p>
            </div>
          </div>

          {/* Chart canvas */}
          <div className="relative mt-6 h-[420px] w-full">
            <StockChart points={points} />
          </div>
        </div>

        {/* Bottom summary cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: 'Open', value: '$182.30' },
            { label: 'High', value: '$186.10' },
            { label: 'Volume', value: '24.8M' },
          ].map((item) => (
            <div
              key={item.label}
              className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald/30 hover:bg-white/[0.05] hover:shadow-[0_15px_40px_rgba(0,0,0,0.4)]"
            >
              <p className="font-body text-xs uppercase tracking-wider text-white/40">
                {item.label}
              </p>
              <p className="mt-1.5 font-display text-xl font-semibold text-white transition-colors duration-300 group-hover:text-emerald">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}