import { ArrowUpRight, Clock } from "lucide-react";

function formatTimeAgo(dateInput) {
  const publishedDate = new Date(dateInput);
  if (Number.isNaN(publishedDate.getTime())) return "";

  const diffMs = Date.now() - publishedDate.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24)
    return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}

export default function DashboardNewsCard({ article }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-xl border border-white/10
                 bg-white/[0.03] p-4 transition-all duration-300
                 hover:border-emerald-500/40 hover:bg-white/[0.05]"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 text-xl">📰</div>

        <div>
          <h3 className="font-medium text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
            {article.title}
          </h3>

          <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
            <span>{article.source}</span>

            <span className="flex items-center gap-1">
              <Clock size={14} />
              {formatTimeAgo(article.publishedAt)}
            </span>
          </div>
        </div>
      </div>

      <ArrowUpRight
        size={18}
        className="text-gray-500 group-hover:text-emerald-400 transition"
      />
    </a>
  );
}