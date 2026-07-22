import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Check,
  Clock3,
  Code2,
  Flame,
  FolderKanban,
  Heart,
  LayoutDashboard,
  Plus,
  Rocket,
  Trophy,
  Wrench,
  Zap,
} from "lucide-react";
import { LogComposer } from "@/components/log-composer";
import { NumberTicker } from "@/components/magicui/number-ticker";
import type { Profile } from "@/lib/auth";
import type { DashboardData } from "@/lib/dashboard";

function daysUntil(date: string) {
  return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000));
}

function challengeProgress(startsAt: string, endsAt: string) {
  const start = new Date(startsAt).getTime();
  const end = new Date(endsAt).getTime();
  const total = Math.max(1, end - start);
  return Math.max(8, Math.min(100, ((Date.now() - start) / total) * 100));
}

function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export function DesktopDashboard({
  me,
  data,
}: {
  me: Profile;
  data: DashboardData;
}) {
  const firstName = me.display_name.trim().split(/\s+/)[0] || me.handle;
  const maxActivity = Math.max(1, ...data.activity14d.map((day) => day.count));
  const stats = [
    { label: "Day streak", value: me.current_streak, icon: Flame },
    { label: "Logs this week", value: data.logs7d, icon: Activity },
    { label: "Projects", value: data.projects.length, icon: FolderKanban },
    { label: "Likes earned", value: data.likesReceived7d, icon: Heart },
  ];
  const navItems = [
    { href: "#overview", label: "Overview", icon: LayoutDashboard, active: true },
    { href: "#recent-build-logs", label: "Build logs", icon: Code2, active: false },
    { href: "#desktop-projects", label: "Projects", icon: FolderKanban, active: false },
    { href: "/challenges", label: "Challenges", icon: Trophy, active: false },
  ];

  return (
    <section className="hidden min-h-screen p-4 lg:block xl:p-5">
      <div className="relative mx-auto min-h-[calc(100vh-2.5rem)] max-w-[1500px] overflow-hidden rounded-[24px] border border-white/[0.11] bg-[#0a0c0a] shadow-[0_30px_100px_-35px_rgba(0,0,0,0.95)]">
        <div className="absolute right-8 top-0 h-px w-44 bg-gradient-to-r from-transparent via-yellow-300 to-green-400" />

        <header className="relative flex h-[58px] items-center border-b border-white/[0.075] px-5">
          <div className="flex items-center gap-2.5">
            <span className="size-3 rounded-full bg-red-400" />
            <span className="size-3 rounded-full bg-yellow-400" />
            <span className="size-3 rounded-full bg-green-500" />
          </div>
          <div className="absolute left-1/2 top-1/2 flex h-8 w-72 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-white/[0.075] bg-white/[0.018] text-[10px] text-white/22">
            shipnaija.dev/dashboard
          </div>
        </header>

        <div className="grid min-h-[calc(100vh-6.2rem)] grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="border-r border-white/[0.075] px-4 py-6 xl:px-5">
            <Link href="/" className="flex items-center gap-3 px-1">
              <span className="grid size-9 place-items-center rounded-xl border border-green-400/15 bg-green-400/[0.08] text-[15px]">
                🚢
              </span>
              <span className="text-[14px] font-semibold tracking-[-0.02em]">
                ShipNaija<span className="text-green-400">.</span>
              </span>
            </Link>

            <nav className="mt-8 space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-[12px] transition-colors ${
                      item.active
                        ? "bg-white/[0.065] text-white/80"
                        : "text-white/30 hover:bg-white/[0.035] hover:text-white/60"
                    }`}
                  >
                    <Icon className="size-4" strokeWidth={1.7} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-8 border-t border-white/[0.06] pt-5">
              <Link
                href="/feed"
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[11px] text-white/28 hover:bg-white/[0.035] hover:text-white/55"
              >
                Community feed
                <ArrowRight className="size-3" />
              </Link>
              <Link
                href={`/builders/${me.handle}`}
                className="mt-1 block truncate rounded-xl px-3 py-2.5 text-[11px] text-white/28 hover:bg-white/[0.035] hover:text-white/55"
              >
                @{me.handle}
              </Link>
            </div>
          </aside>

          <div className="min-w-0 px-7 py-8 xl:px-8 xl:py-9 2xl:px-10">
            <div id="overview" className="scroll-mt-6">
              <div className="flex items-start justify-between gap-8">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-green-400/75">
                    Builder dashboard
                  </p>
                  <h1 className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.045em] xl:text-[30px]">
                    How far, {firstName}! <span aria-hidden="true">👋</span>
                  </h1>
                  <p className="mt-2 text-[13px] text-white/32">
                    {data.shippedToday
                      ? "You don ship today. Keep the momentum going."
                      : "You never ship today. Make one small move."}
                  </p>
                </div>
                {data.projects.length > 0 ? (
                  <a
                    href="#desktop-quick-log"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-3 text-[11px] font-medium text-white/50 transition-colors hover:bg-white/[0.07] hover:text-white"
                  >
                    <Plus className="size-3.5" /> New log
                  </a>
                ) : (
                  <Link
                    href="/projects/new"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-3 text-[11px] font-medium text-white/50 transition-colors hover:bg-white/[0.07] hover:text-white"
                  >
                    <Plus className="size-3.5" /> New project
                  </Link>
                )}
              </div>

              <div className="mt-7 grid grid-cols-4 gap-3">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="flex min-h-[96px] min-w-0 flex-col justify-between rounded-2xl border border-white/[0.09] bg-[#101210] p-4 xl:min-h-[104px]"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-[24px] font-semibold leading-none tracking-[-0.04em]">
                          <NumberTicker value={stat.value} />
                        </p>
                        <Icon className="size-[17px] text-green-400/70" strokeWidth={1.6} />
                      </div>
                      <p className="text-[9px] font-medium uppercase tracking-[0.12em] text-white/25">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 grid grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)] gap-3">
                <section className="min-w-0 rounded-2xl border border-white/[0.09] bg-[#101210] p-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[13px] font-medium text-white/68">Shipping activity</h2>
                    <span className="text-[9px] text-white/23">Last 14 days</span>
                  </div>
                  <div
                    className="mt-5 flex h-36 items-end gap-2"
                    role="img"
                    aria-label="Build logs over the last 14 days"
                  >
                    {data.activity14d.map((day) => {
                      const height = day.count === 0 ? 8 : Math.max(20, (day.count / maxActivity) * 100);
                      return (
                        <div
                          key={day.date}
                          className="flex h-full min-w-0 flex-1 items-end"
                          title={`${day.date}: ${day.count} log${day.count === 1 ? "" : "s"}`}
                        >
                          <span
                            className={`block w-full rounded-t-[4px] ${
                              day.count
                                ? "bg-gradient-to-t from-green-950 via-green-700 to-green-400"
                                : "bg-white/[0.045]"
                            }`}
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="rounded-2xl border border-white/[0.09] bg-[#101210] p-5">
                  {data.activeChallenge ? (
                    <>
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-yellow-400/15 bg-yellow-400/[0.07] text-yellow-300">
                          <Trophy className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-white/70">
                            {data.activeChallenge.title}
                          </p>
                          <p className="mt-0.5 text-[9px] text-white/25">
                            {daysUntil(data.activeChallenge.ends_at)} days remaining
                          </p>
                        </div>
                      </div>
                      <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-300"
                          style={{
                            width: `${challengeProgress(
                              data.activeChallenge.starts_at,
                              data.activeChallenge.ends_at
                            )}%`,
                          }}
                        />
                      </div>
                      <div className="mt-5 text-[10px]">
                        {data.enteredChallenge ? (
                          <Link
                            href={`/challenges/${data.activeChallenge.slug}`}
                            className="inline-flex items-center gap-2 text-green-300/60 hover:text-green-200"
                          >
                            <Check className="size-3.5" /> You&apos;re in — keep shipping
                          </Link>
                        ) : (
                          <Link
                            href={`/challenges/${data.activeChallenge.slug}`}
                            className="inline-flex items-center gap-2 text-green-300/60 hover:text-green-200"
                          >
                            Enter Ship Week <ArrowRight className="size-3.5" />
                          </Link>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full min-h-40 items-center gap-3">
                      <span className="grid size-9 place-items-center rounded-xl bg-white/[0.04] text-white/25">
                        <Clock3 className="size-4" />
                      </span>
                      <div>
                        <p className="text-[13px] font-medium text-white/65">Next Ship Week is cooking.</p>
                        <p className="mt-1 text-[9px] text-white/25">Keep building while we prepare it.</p>
                      </div>
                    </div>
                  )}
                </section>
              </div>

              <section
                id="recent-build-logs"
                className="mt-3 scroll-mt-6 rounded-2xl border border-white/[0.09] bg-[#101210] p-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-[13px] font-medium text-white/68">Recent build logs</h2>
                  <Link
                    href="/feed"
                    className="inline-flex items-center gap-1 text-[9px] text-green-300/55 hover:text-green-200"
                  >
                    View feed <ArrowRight className="size-3" />
                  </Link>
                </div>
                {data.recentLogs.length > 0 ? (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {data.recentLogs.slice(0, 2).map((log, index) => {
                      const LogIcon = index % 2 === 0 ? Rocket : Wrench;
                      return (
                        <Link
                          key={log.id}
                          href={`/logs/${log.id}`}
                          className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.06] bg-black/20 p-3"
                        >
                          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-green-300/65">
                            <LogIcon className="size-4" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[11px] font-medium text-white/65">{log.content}</p>
                            <p className="mt-1 truncate text-[9px] text-white/23">
                              {log.project.name} · {timeAgo(log.created_at)}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-dashed border-white/[0.07] py-8 text-center">
                    <p className="text-[10px] text-white/28">Your first ship will show up here.</p>
                  </div>
                )}
              </section>
            </div>

            <div className="mt-8 grid grid-cols-[minmax(0,1.4fr)_minmax(280px,.8fr)] gap-3 border-t border-white/[0.07] pt-8">
              <section
                id="desktop-quick-log"
                className="scroll-mt-6 rounded-2xl border border-white/[0.09] bg-[#101210] p-5"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Zap className="size-4 text-green-300/70" />
                  <div>
                    <h2 className="text-[13px] font-medium text-white/70">Quick log</h2>
                    <p className="mt-0.5 text-[9px] text-white/24">Small progress still counts.</p>
                  </div>
                </div>
                {data.projects.length > 0 ? (
                  <LogComposer projects={data.projects} redirectTo="/dashboard" variant="dashboard" />
                ) : (
                  <Link
                    href="/projects/new"
                    className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-[11px] font-semibold text-black"
                  >
                    Add your first project <Plus className="size-4" />
                  </Link>
                )}
              </section>

              <section
                id="desktop-projects"
                className="scroll-mt-6 rounded-2xl border border-white/[0.09] bg-[#101210] p-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-[13px] font-medium text-white/70">Your projects</h2>
                  <Link href="/projects/new" className="text-green-300/55" aria-label="Add project">
                    <Plus className="size-4" />
                  </Link>
                </div>
                {data.projects.length > 0 ? (
                  <div className="mt-4 space-y-2">
                    {data.projects.slice(0, 4).map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.06] bg-black/20 p-3"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-green-400/[0.07] text-[11px] font-semibold text-green-300/70">
                          {project.name.slice(0, 1).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-medium text-white/60">{project.name}</p>
                          <p className="mt-0.5 text-[8px] text-white/22">
                            {project.logs_7d} log{project.logs_7d === 1 ? "" : "s"} this week
                          </p>
                        </div>
                        <ArrowRight className="size-3 text-white/16" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 rounded-xl border border-dashed border-white/[0.07] py-8 text-center">
                    <p className="text-[10px] text-white/28">No projects yet.</p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
