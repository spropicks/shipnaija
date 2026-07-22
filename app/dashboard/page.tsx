import Link from "next/link";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import { SiteHeader } from "@/components/site-header";
import { LogComposer } from "@/components/log-composer";
import { BuildLogCard } from "@/components/build-log-card";
import { StreakCalendar } from "@/components/streak-calendar";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { MagicCard } from "@/components/magicui/magic-card";
import { BorderBeam } from "@/components/magicui/border-beam";
import { getCurrentProfile } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dashboard" };

const STATUS_STYLES: Record<string, string> = {
  building: "bg-yellow-500/15 text-yellow-400",
  launched: "bg-green-500/15 text-green-400",
  paused: "bg-white/10 text-white/50",
};

export default async function DashboardPage() {
  const me = await getCurrentProfile();

  if (!me) {
    return (
      <main className="min-h-screen">
        <SiteHeader />
        <section className="mx-auto flex max-w-xl flex-col items-center px-6 py-24 text-center">
          <p className="text-6xl">📊</p>
          <h1 className="mt-6 text-3xl font-bold">Your builder dashboard</h1>
          <p className="mt-3 text-white/60">
            Streaks, stats, your projects and challenges — all in one place.
            Sign in to see yours.
          </p>
          <div className="mt-8">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="rounded-md bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-500">
                  Sign in to continue
                </button>
              </SignInButton>
            </SignedOut>
            <p className="mt-4 text-xs text-white/40">
              Just signed up? Your profile syncs in a few seconds — refresh if
              you don&apos;t see it yet.
            </p>
          </div>
        </section>
      </main>
    );
  }

  const data = await getDashboardData(me);

  const stats = [
    { label: "Current streak", value: me.current_streak, suffix: " 🔥", beam: true },
    { label: "Longest streak", value: me.longest_streak, suffix: "", beam: false },
    { label: "Logs (7d)", value: data.logs7d, suffix: "", beam: false },
    { label: "💚 received (7d)", value: data.likesReceived7d, suffix: "", beam: false },
  ];

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold">
          How far, <span className="text-green-400">{me.display_name}</span>! 👋
        </h1>
        <p className="mt-1 text-white/60">Your shipping HQ.</p>

        {/* Ship-today banner */}
        <div
          className={
            data.shippedToday
              ? "mt-6 rounded-xl border border-green-500/30 bg-green-500/10 px-5 py-4"
              : "mt-6 rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-4"
          }
        >
          {data.shippedToday ? (
            <p className="text-sm">
              ✅ <span className="font-semibold text-green-400">You don ship today!</span>{" "}
              <span className="text-white/60">
                Streak safe. Come back tomorrow to keep the fire burning 🔥
              </span>
            </p>
          ) : (
            <p className="text-sm">
              ⏳ <span className="font-semibold text-orange-400">You never ship today o.</span>{" "}
              <span className="text-white/60">
                Post a build log before midnight (UTC) to keep your streak alive.
              </span>
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-5"
            >
              {s.beam ? <BorderBeam size={70} duration={7} colorFrom="#16a34a" colorTo="#eab308" /> : null}
              <p className="text-3xl font-bold">
                {s.value > 0 ? <NumberTicker value={s.value} /> : <span>0</span>}
                {s.suffix}
              </p>
              <p className="mt-1 text-xs text-white/50">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Activity + challenge */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
            <h2 className="text-sm font-semibold text-white/70">Last 14 days</h2>
            <div className="mt-4 overflow-x-auto">
              <StreakCalendar days={data.activity14d} />
            </div>
            <p className="mt-3 text-xs text-white/40">
              One square per UTC day. Ship daily to keep them green.
            </p>
          </div>

          <MagicCard className="rounded-xl p-5" gradientColor="#16a34a20">
            <h2 className="text-sm font-semibold text-white/70">Weekly challenge</h2>
            {data.activeChallenge ? (
              <div className="mt-3">
                <p className="text-lg font-bold">{data.activeChallenge.title}</p>
                {data.activeChallenge.theme ? (
                  <p className="mt-1 text-sm text-white/60">{data.activeChallenge.theme}</p>
                ) : null}
                <p className="mt-2 text-xs text-white/40">
                  Ends {new Date(data.activeChallenge.ends_at).toUTCString().slice(0, 16)}
                </p>
                <div className="mt-4">
                  {data.enteredChallenge ? (
                    <span className="rounded-md bg-green-500/15 px-3 py-1.5 text-sm font-medium text-green-400">
                      ✅ You&apos;re in! Good luck 🚀
                    </span>
                  ) : (
                    <Link
                      href={`/challenges/${data.activeChallenge.slug}`}
                      className="inline-block rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-500"
                    >
                      Enter this week&apos;s challenge →
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-white/50">
                No active challenge right now — a new Ship Week drops soon. 👀
              </p>
            )}
          </MagicCard>
        </div>

        {/* Quick composer */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold">Ship something now</h2>
          <div className="mt-4">
            {data.projects.length > 0 ? (
              <LogComposer projects={data.projects} />
            ) : (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/60">
                You need a project before you can post build logs.{" "}
                <Link href="/projects/new" className="text-green-400 hover:underline">
                  + Add your first project
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* My projects */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">My projects</h2>
            <Link href="/projects/new" className="text-sm text-green-400 hover:underline">
              + Add project
            </Link>
          </div>
          {data.projects.length === 0 ? (
            <p className="mt-4 text-sm text-white/50">Nothing here yet — your next big thing starts with one click.</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {data.projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-green-500/40"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate font-semibold group-hover:text-green-400">{p.name}</p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${STATUS_STYLES[p.status] ?? STATUS_STYLES.paused}`}
                    >
                      {p.status}
                    </span>
                  </div>
                  {p.tagline ? (
                    <p className="mt-1 truncate text-sm text-white/60">{p.tagline}</p>
                  ) : null}
                  <p className="mt-3 text-xs text-white/40">
                    {p.logs_7d} log{p.logs_7d === 1 ? "" : "s"} this week
                    {p.logs_7d === 0 ? " — give am small love 🥺" : " 💪"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent logs */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold">Your recent logs</h2>
          {data.recentLogs.length === 0 ? (
            <p className="mt-4 text-sm text-white/50">
              No build logs yet. Your first ship is the hardest — post it above! 🚢
            </p>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {data.recentLogs.map((log) => (
                <BuildLogCard key={log.id} log={log} path="/dashboard" canEngage={true} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
