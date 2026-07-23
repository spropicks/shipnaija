import Link from "next/link";
import { LikeButton } from "@/components/like-button";
import { deleteBuildLog } from "@/app/actions/build-logs";
import { safeExternalUrl } from "@/lib/utils";
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
  viewerId = null,
}: {
  log: FeedLog;
  path: string;
  canEngage: boolean;
  viewerId?: string | null;
}) {
  const isAuthor = Boolean(viewerId && viewerId === log.author_id);
  const linkUrl = safeExternalUrl(log.link_url);

  return (
    <article className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        {log.author.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={log.author.avatar_url}
            alt=""
            className="size-9 shrink-0 rounded-full border border-white/10"
          />
        ) : (
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm">
            {log.author.display_name.slice(0, 1)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm">
            <Link href={`/builders/${log.author.handle}`} className="font-medium hover:text-green-400">
              {log.author.display_name}
            </Link>{" "}
            <span className="text-white/40">@{log.author.handle}</span>
            {log.author.current_streak > 1 ? (
              <span className="ml-1.5 text-xs text-orange-400">🔥 {log.author.current_streak}</span>
            ) : null}
          </p>
          <p className="truncate text-xs text-white/40">
            shipping{" "}
            <Link href={`/projects/${log.project.slug}`} className="text-green-400/80 hover:underline">
              {log.project.name}
            </Link>{" "}
            · {timeAgo(log.created_at)}
          </p>
        </div>
      </div>

      <p className="mt-3 break-words whitespace-pre-wrap text-sm leading-relaxed text-white/80 sm:text-[15px]">
        {log.content}
      </p>

      {log.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={log.image_url}
          alt="Build log screenshot"
          className="mt-3 max-h-96 w-full rounded-lg border border-white/10 object-cover"
        />
      ) : null}

      {linkUrl ? (
        <a
          href={linkUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block max-w-full truncate text-sm text-green-400 hover:underline"
          title={linkUrl}
        >
          {linkUrl.replace(/^https?:\/\//, "").slice(0, 60)} ↗
        </a>
      ) : null}

      <div className="mt-4 flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
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
        {isAuthor ? (
          <form action={deleteBuildLog} className="ml-auto inline">
            <input type="hidden" name="id" value={log.id} />
            <input type="hidden" name="path" value={path} />
            <button type="submit" className="px-1 text-xs text-white/25 transition hover:text-red-400">
              delete
            </button>
          </form>
        ) : null}
      </div>
    </article>
  );
}
