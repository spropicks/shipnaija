import Link from "next/link";
import { LikeButton } from "@/components/like-button";
import type { FeedLog } from "@/lib/feed";

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export function BuildLogCard({
  log,
  path,
  canEngage,
}: {
  log: FeedLog;
  path: string;
  canEngage: boolean;
}) {
  return (
    <article className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-3">
        {log.author.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={log.author.avatar_url}
            alt=""
            className="h-9 w-9 rounded-full border border-white/10"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm">
            {log.author.display_name.slice(0, 1)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm">
            <Link href={`/builders/${log.author.handle}`} className="font-medium hover:text-green-400">
              {log.author.display_name}
            </Link>{" "}
            <span className="text-white/40">@{log.author.handle}</span>
            {log.author.current_streak > 1 ? (
              <span className="ml-1.5 text-xs text-orange-400">🔥 {log.author.current_streak}</span>
            ) : null}
          </p>
          <p className="text-xs text-white/40">
            shipping{" "}
            <Link href={`/projects/${log.project.slug}`} className="text-green-400/80 hover:underline">
              {log.project.name}
            </Link>{" "}
            · {timeAgo(log.created_at)}
          </p>
        </div>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-white/85">
        {log.content}
      </p>
      {log.link_url ? (
        <a
          href={log.link_url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block text-sm text-green-400 hover:underline"
        >
          {log.link_url.replace(/^https?:\/\//, "").slice(0, 60)} ↗
        </a>
      ) : null}
      <div className="mt-4 flex items-center gap-3">
        <LikeButton
          targetType="build_log"
          targetId={log.id}
          count={log.like_count}
          liked={log.liked_by_me}
          path={path}
          disabled={!canEngage}
        />
        <Link
          href={`/logs/${log.id}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1 text-xs text-white/60 transition hover:border-green-500/40 hover:text-green-400"
        >
          💬 {log.comment_count}
        </Link>
      </div>
    </article>
  );
}
