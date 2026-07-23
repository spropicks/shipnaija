import Link from "next/link";
import { Trophy, TrendingUp } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import type { Challenge } from "@/lib/challenges";
import type { TrendingBuilder, TrendingProject } from "@/lib/trending";

function fmtRange(startsAt: string, endsAt: string): string {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return `${new Date(startsAt).toLocaleDateString("en-NG", opts)} – ${new Date(
    endsAt
  ).toLocaleDateString("en-NG", opts)}`;
}

const cardCls = "rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4";
const headingCls =
  "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40";

export function FeedSidebar({
  activeChallenge,
  topBuilders,
  topProjects,
}: {
  activeChallenge: Challenge | null;
  topBuilders: TrendingBuilder[];
  topProjects: TrendingProject[];
}) {
  return (
    <div className="flex flex-col gap-5 lg:sticky lg:top-24">
      {activeChallenge ? (
        <Link
          href={`/challenges/${activeChallenge.slug}`}
          className="block rounded-2xl border border-green-500/25 bg-green-500/[0.06] p-4 transition hover:border-green-500/50"
        >
          <p className={headingCls}>
            <Trophy className="size-3.5 text-green-400" /> This week&apos;s challenge
          </p>
          <p className="mt-2 font-semibold leading-snug">{activeChallenge.title}</p>
          <p className="mt-1 text-xs text-white/45">
            {fmtRange(activeChallenge.starts_at, activeChallenge.ends_at)}
          </p>
          <p className="mt-3 text-xs font-medium text-green-400">Enter your project →</p>
        </Link>
      ) : null}

      {topBuilders.length > 0 ? (
        <div className={cardCls}>
          <p className={headingCls}>
            <TrendingUp className="size-3.5 text-green-400" /> Top builders this week
          </p>
          <ol className="mt-3 flex flex-col gap-1">
            {topBuilders.map((b, i) => (
              <li key={b.id}>
                <Link
                  href={`/builders/${b.handle}`}
                  className="flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 transition hover:bg-white/[0.04]"
                >
                  <span className="w-4 shrink-0 text-center text-xs text-white/35">{i + 1}</span>
                  <Avatar src={b.avatar_url} name={b.display_name} size={28} />
                  <span className="min-w-0 flex-1 truncate text-sm text-white/80">
                    {b.display_name}
                  </span>
                  <span className="shrink-0 text-xs text-white/40">{b.logs_7d} logs</span>
                </Link>
              </li>
            ))}
          </ol>
          <Link
            href="/trending"
            className="mt-2 block px-1.5 text-xs text-white/40 transition hover:text-green-400"
          >
            See full leaderboard →
          </Link>
        </div>
      ) : null}

      {topProjects.length > 0 ? (
        <div className={cardCls}>
          <p className={headingCls}>🚀 Trending projects</p>
          <ul className="mt-3 flex flex-col gap-1">
            {topProjects.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-1.5 py-1.5 transition hover:bg-white/[0.04]"
                >
                  <span className="min-w-0 truncate text-sm text-white/80">{p.name}</span>
                  <span className="shrink-0 text-xs text-white/40">{p.logs_7d} logs</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
