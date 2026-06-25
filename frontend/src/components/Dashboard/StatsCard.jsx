function WalletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 7.5A2.5 2.5 0 0 1 5.5 5h11A2.5 2.5 0 0 1 19 7.5V8H5.5A2.5 2.5 0 0 1 3 5.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="3"
        y="8"
        width="18"
        height="11"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="16" cy="13.5" r="1.4" fill="currentColor" />
    </svg>
  )
}

function BrainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 4.5a3 3 0 0 0-3 3v.2A3 3 0 0 0 4.5 10v1a3 3 0 0 0 1.2 2.4A3 3 0 0 0 7.5 19h1.2M15 4.5a3 3 0 0 1 3 3v.2a3 3 0 0 1 1.5 2.8v1a3 3 0 0 1-1.2 2.4 3 3 0 0 1-1.8 5.6h-1.2M9 4.5h6M9 19.5h6M12 4.5v15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TrendUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 16l6-6 4 4 8-8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 6h7v7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 12h17M12 3.5c2.2 2.2 3.3 5.2 3.3 8.5s-1.1 6.3-3.3 8.5c-2.2-2.2-3.3-5.2-3.3-8.5s1.1-6.3 3.3-8.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function SmallTrendArrow({ positive }) {
  return positive ? (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 18L18 6M18 6H9M18 6v9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 18H9M18 18V9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const STATS = [
  {
    id: 'sentiment',
    label: 'Market sentiment',
    value: 'Bullish',
    subtitle: 'Positive News',
    icon: GlobeIcon,
    live: true,
  },
  {
    id: 'confidence',
    label: 'AI Confidence',
    value: '94%',
    subtitle: 'Strong Buy',
    icon: BrainIcon,
  },
  {
    id: 'pl',
    label: "Today's P/L",
    value: '+$3,280',
    trend: '+1.34%',
    positive: true,
    icon: TrendUpIcon,
  },
  {
    id: 'market',
    label: 'Market Status',
    value: 'OPEN',
    subtitle: 'Live Trading',
    icon: GlobeIcon,
    live: true,
  },
]

function StatCard({ stat }) {
  const { label, value, trend, positive, subtitle, icon: Icon, live } = stat

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-emerald/30 hover:bg-white/[0.05] hover:shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
      {/* emerald glow that appears on hover */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="relative flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald/25 bg-emerald/10 text-emerald">
          <Icon />
        </span>

        {live && (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald/30 bg-emerald/10 px-2.5 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald" />
            </span>
            <span className="font-body text-[10px] font-medium uppercase tracking-wider text-emerald/90">
              Live
            </span>
          </span>
        )}

        {trend && (
          <span
            className={`flex items-center gap-1 rounded-full border px-2.5 py-1 font-body text-xs font-medium ${
              positive
                ? 'border-emerald/30 bg-emerald/10 text-emerald'
                : 'border-rose/30 bg-rose/10 text-rose'
            }`}
          >
            <SmallTrendArrow positive={positive} />
            {trend}
          </span>
        )}
      </div>

      <p className="relative mt-5 font-display text-3xl font-semibold tracking-tight text-white">
        {value}
      </p>

      <p className="relative mt-1.5 font-body text-sm text-white/45">
        {subtitle ?? label}
      </p>

      {subtitle && (
        <p className="relative mt-0.5 font-body text-xs uppercase tracking-wider text-white/30">
          {label}
        </p>
      )}
    </div>
  )
}

export default function StatsCards() {
  return (
    <section className="w-full bg-charcoal px-6 py-4 md:px-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
    </section>
  )
}