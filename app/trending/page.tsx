import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { getTrending } from "@/lib/trending";

export const dynamic = "force-dynamic";

const MEDALS = ["🥇", "🥈", "🥉"];

export default async function TrendingPage() {
  const { builders, projects } = await getTrending();

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold">Trending</h1>
        <p className="mt-1 text-white/60">
          Who&apos;s shipping the hardest this week? Ranked by build logs, likes and streaks over the last 7 days.
        </p>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">🔥 Builders</h2>
            {builders.length === 0 ? (
              <p className="mt-6 text-sm text-white/50">
                No activity yet this week. Post a build log to claim the top spot! 🚢
              </p>
            ) : (
              <ol className="mt-4 flex flex-col gap-2">
                {builders.map((b, i) => (
                  <li key={b.id}>
                    <Link
                      href={`/builders/${b.handle}`}
                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-green-500/40"
                    >
                      <span className="w-7 shrink-0 text-center text-sm text-white/50">
                        {MEDALS[i] ?? `#${i + 1}`}
                      </span>
                      {b.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={b.avatar_url} alt="" className="h-8 w-8 rounded-full border border-white/10" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600/30 text-xs font-bold text-green-400">
                          {b.display_name.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{b.display_name}</p>
                        <p className="truncate text-xs text-white/50">@{b.handle}</p>
                      </div>
                      <div className="shrink-0 text-right text-xs text-white/50">
                        <p>{b.logs_7d} logs · 💚 {b.likes_7d}</p>
                        {b.current_streak > 1 ? (
                          <p className="text-orange-400">🔥 {b.current_streak}-day streak</p>
                        ) : null}
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold">🚀 Projects</h2>
            {projects.length === 0 ? (
              <p className="mt-6 text-sm text-white/50">
                No project activity yet this week. Ship something!
              </p>
            ) : (
              <ol className="mt-4 flex flex-col gap-2">
                {projects.map((p, i) => (
                  <li key={p.id}>
                    <Link
                      href={`/projects/${p.slug}`}
                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-green-500/40"
                    >
                      <span className="w-7 shrink-0 text-center text-sm text-white/50">
                        {MEDALS[i] ?? `#${i + 1}`}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="truncate text-xs text-white/50">
                          {p.owner ? `by @${p.owner.handle}` : ""}
                          {p.tagline ? ` — ${p.tagline}` : ""}
                        </p>
                      </div>
                      <div className="shrink-0 text-right text-xs text-white/50">
                        <p>{p.logs_7d} logs · 💚 {p.likes_7d}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
