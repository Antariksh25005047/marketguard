import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock } from "lucide-react";

/**
 * Category → accent color mapping.
 * Each category gets a distinct tint so the grid stays scannable at a glance,
 * while the emerald accent (#22c55e) remains the platform's dominant color
 * everywhere else (borders, glow, CTA).
 */
const CATEGORY_STYLES = {
  Markets: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  AI: "text-violet-400 bg-violet-500/10 border-violet-500/30",
  Stocks: "text-sky-400 bg-sky-500/10 border-sky-500/30",
  Economy: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  Crypto: "text-orange-400 bg-orange-500/10 border-orange-500/30",
  Earnings: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  Technology: "text-pink-400 bg-pink-500/10 border-pink-500/30",
};

// Fallback style for any category not explicitly mapped above.
const DEFAULT_CATEGORY_STYLE =
  "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";

/**
 * Converts an ISO timestamp (or Date) into a short relative-time string,
 * e.g. "2 hours ago", "5 min ago", "3 days ago".
 */
function formatTimeAgo(dateInput) {
  const publishedDate = new Date(dateInput);
  if (Number.isNaN(publishedDate.getTime())) return "";

  const diffMs = Date.now() - publishedDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return publishedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Card-entry animation. Cards fade + rise into view, staggered by their
 * index (passed in from the parent grid) so the section feels orchestrated
 * rather than everything popping in at once.
 */
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: index * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/**
 * MarketNewsCard
 * Renders a single news article as a glassmorphism card.
 *
 * Expected `article` shape:
 * {
 *   id: string | number,
 *   title: string,
 *   description: string,
 *   image: string,
 *   publisher: string,
 *   publishedAt: string (ISO date),
 *   category: 'Markets' | 'AI' | 'Stocks' | 'Economy' | 'Crypto' | 'Earnings' | 'Technology',
 *   url: string,
 * }
 */
export default function MarketNewsCard({ article, index = 0 }) {
  const {
    title,
    description,
    image,
    publisher,
    publishedAt,
    category,
    url,
  } = article;

  const categoryStyle = CATEGORY_STYLES[category] || DEFAULT_CATEGORY_STYLE;

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10
                 bg-white/[0.03] backdrop-blur-xl transition-all duration-300 ease-out
                 hover:-translate-y-1.5 hover:border-emerald-500/40
                 hover:shadow-[0_0_35px_-8px_rgba(34,197,94,0.35)]"
    >
      {/* Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out
                     group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src =
              "https://placehold.co/600x400/0a0a0a/22c55e?text=MarketGuard+AI";
          }}
        />
        {/* Subtle gradient so the category badge stays legible over any image */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Category badge */}
        <span
          className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[11px]
                      font-medium backdrop-blur-md ${categoryStyle}`}
        >
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-white/90 transition-colors duration-300 group-hover:text-emerald-400">
          {title}
        </h3>

        <p className="line-clamp-3 text-sm leading-relaxed text-white/50">
          {description}
        </p>

        {/* Meta row: publisher + time */}
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-white/40">
          <span className="font-medium text-white/60">{publisher}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimeAgo(publishedAt)}
          </span>
        </div>

        {/* Read More CTA */}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/btn mt-3 flex items-center justify-center gap-1.5 rounded-lg
                     border border-emerald-500/30 bg-emerald-500/10 py-2 text-sm font-medium
                     text-emerald-400 transition-all duration-300
                     hover:border-emerald-500/60 hover:bg-emerald-500/20 hover:text-emerald-300"
        >
          Read More
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </a>
      </div>
    </motion.article>
  );
}
