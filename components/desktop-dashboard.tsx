import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Check,
  Clock3,
  Flame,
  FolderKanban,
  Heart,
  MessageCircle,
  Plus,
  Rocket,
  Trophy,
  Wrench,
  Zap,
} from "lucide-react";
import { LogComposer } from "@/components/log-composer";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BorderBeam } from "@/components/magicui/border-beam";
import { BlurFade } from "@/components/magicui/blur-fade";
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
    {
      label: "Day streak",
      value: me.current_streak,
      detail: data.shippedToday ? "Safe for today" : "Ship before midnight UTC",
      icon: Flame,
    },
    {
      label: "Logs this week",
      value: data.logs7d,
      detail: "Your last 7 days",
      icon: Activity,
    },
    {
      label: "Projects",
      value: data.projects.length,
      detail: "Your workspaces",
      icon: FolderKanban,
    },
    {
      label: "Likes earned",
      value: data.likesReceived7d,
      detail: `${data.commentsReceived7d} comment${data.commentsReceived7d === 1 ? "" : "s"} received`,
      icon: Heart,
    },
  ];

  return (
    <section className="mx-auto hidden w-full max-w-6xl px-5 pb-24 pt-10 lg:block">
      <BlurFade>
        <div className="relative overflow-hidden rounded-[28px] border border-white/[0.085] bg-[#0b0d0b] px-7 py-8 xl:px-9 xl:py-10">
          <div className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-green-400/[0.055] blur-[90px]" />
          <div className="relative flex items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-2">
                <span className={`size-1.5 rounded-full ${data.shippedToday ? "bg-green-400" : "bg-orange-400"}`} />
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-green-400/70">
                  Builder dashboard
                </p>
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] xl:text-[44px]">
                How far, <span className="text-green-300">{firstName}</span>! <span aria-hidden="true">👋</span>
              </h1>
              <p className="mt-3 text-sm text-white/36">
                {data.shippedToday
                  ? "You don ship today. Keep the momentum going."
                  : "You never ship today. Make one honest move and put it on the record."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 py-3 text-xs font-medium text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <Plus className="size-3.5" /> New project
              </Link>
              {data.projects.length > 0 ? (
                <a
                  href="#desktop-quick-log"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-semibold text-black transition-colors hover:bg-green-100"
                >
                  <Rocket className="size-3.5" /> Log a ship
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </BlurFade>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <BlurFade key={stat.label} delay={0.04 + index * 0.03}>
              <article className="relative h-full min-h-[126px] overflow-hidden rounded-2xl border border-white/[0.075] bg-[#0e100e] p-5">
                {index === 0 ? (
                  <BorderBeam size={55} duration={8} colorFrom="#22c55e" colorTo="#eab308" />
                ) : null}
                <div className="flex items-start justify-between gap-3">
                  <p className="text-3xl font-semibold leading-none tracking-[-0.045em]">
                    <NumberTicker value={stat.value} />
                  </p>
                  <span className="grid size-8 place-items-center rounded-xl border border-green-400/10 bg-green-400/[0.055] text-green-300/65">
                    <Icon className="size-4" strokeWidth={1.7} />
                  </span>
                </div>
                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/40">
                  {stat.label}
                </p>
                <p className="mt-1.5 truncate text-[10px] text-white/21">{stat.detail}</p>
              </article>
            </BlurFade>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1.6fr)_minmax(300px,.9fr)] gap-4">
        <BlurFade inView>
          <section className="min-w-0 rounded-2xl border border-white/[0.075] bg-[#0e100e] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white/75">Shipping activity</h2>
                <p className="mt-1 text-[10px] text-white/25">A record of your last 14 UTC days</p>
              </div>
              <span className="rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[9px] text-white/25">
                {data.logs7d} log{data.logs7d === 1 ? "" : "s"} this week
              </span>
            </div>
            <div
              className="mt-7 flex h-44 items-end gap-2.5"
              role="img"
              aria-label="Build logs over the last 14 days"
            >
              {data.activity14d.map((day) => {
                const height = day.count === 0 ? 6 : Math.max(18, (day.count / maxActivity) * 100);
                return (
                  <div
                    key={day.date}
                    className="flex h-full min-w-0 flex-1 items-end"
                    title={`${day.date}: ${day.count} log${day.count === 1 ? "" : "s"}`}
                  >
                    <span
                      className={`block w-full rounded-t-[5px] ${
                        day.count
                          ? "bg-gradient-to-t from-green-950 via-green-700 to-green-400 shadow-[0_-6px_20px_-13px_rgba(74,222,128,0.9)]"
                          : "bg-white/[0.04]"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-4 text-[9px]">
              <span className="text-white/20">Older</span>
              <span className={data.shippedToday ? "text-green-300/55" : "text-orange-300/55"}>
                {data.shippedToday ? "Today is active" : "Nothing logged today"}
              </span>
            </div>
          </section>
        </BlurFade>

        <BlurFade inView delay={0.05}>
          <section className="relative h-full overflow-hidden rounded-2xl border border-white/[0.075] bg-[#0e100e] p-6">
            <div className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-yellow-400/[0.035] blur-[55px]" />
            {data.activeChallenge ? (
              <div className="relative flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <span className="grid size-10 place-items-center rounded-xl border border-yellow-400/15 bg-yellow-400/[0.065] text-yellow-300">
                    <Trophy className="size-[18px]" />
                  </span>
                  <span className="rounded-full border border-white/[0.06] px-2.5 py-1 text-[9px] uppercase tracking-[0.1em] text-white/25">
                    {daysUntil(data.activeChallenge.ends_at)}d left
                  </span>
                </div>
                <p className="mt-7 text-[9px] font-semibold uppercase tracking-[0.17em] text-white/23">
                  Weekly challenge
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-white/82">
                  {data.activeChallenge.title}
                </h2>
                {data.activeChallenge.theme ? (
                  <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-white/30">
                    {data.activeChallenge.theme}
                  </p>
                ) : null}
                <div className="mt-auto pt-7">
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
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
                  <div className="mt-5">
                    <Link
                      href={`/challenges/${data.activeChallenge.slug}`}
                      className="inline-flex items-center gap-2 text-[10px] font-medium text-green-300/60 hover:text-green-200"
                    >
                      {data.enteredChallenge ? (
                        <>
                          <Check className="size-3.5" /> You&apos;re in — keep shipping
                        </>
                      ) : (
                        <>
                          Enter Ship Week <ArrowRight className="size-3.5" />
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-64 items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-white/[0.04] text-white/25">
                  <Clock3 className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white/65">Next Ship Week is cooking.</p>
                  <p className="mt-1 text-[10px] text-white/25">Keep building while we prepare it.</p>
                </div>
              </div>
            )}
          </section>
        </BlurFade>
      </div>

      <BlurFade inView>
        <section id="recent-build-logs" className="mt-4 scroll-mt-24 rounded-2xl border border-white/[0.075] bg-[#0e100e] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white/75">Recent build logs</h2>
              <p className="mt-1 text-[10px] text-white/25">Your latest public progress</p>
            </div>
            <Link href="/feed" className="inline-flex items-center gap-1.5 text-[10px] text-green-300/55 hover:text-green-200">
              View feed <ArrowRight className="size-3" />
            </Link>
          </div>
          {data.recentLogs.length > 0 ? (
            <div className="mt-5 grid grid-cols-2 gap-3">
              {data.recentLogs.slice(0, 4).map((log, index) => {
                const LogIcon = index % 2 === 0 ? Rocket : Wrench;
                return (
                  <Link
                    key={log.id}
                    href={`/logs/${log.id}`}
                    className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.055] bg-black/15 p-4 transition-colors hover:border-green-400/15 hover:bg-green-400/[0.02]"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.035] text-green-300/60">
                      <LogIcon className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-white/60 group-hover:text-white/80">
                        {log.content}
                      </p>
                      <p className="mt-1 truncate text-[9px] text-white/22">
                        {log.project.name} · {timeAgo(log.created_at)}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-white/[0.07] py-10 text-center">
              <p className="text-[10px] text-white/27">Your first ship will show up here.</p>
            </div>
          )}
        </section>
      </BlurFade>

      <div className="mt-4 grid grid-cols-[minmax(0,1.45fr)_minmax(300px,.75fr)] gap-4">
        <BlurFade inView>
          <section id="desktop-quick-log" className="scroll-mt-24 rounded-2xl border border-white/[0.075] bg-[#0e100e] p-6">
            <div className="mb-5 flex items-center gap-2">
              <Zap className="size-4 text-green-300/70" />
              <div>
                <h2 className="text-sm font-semibold text-white/75">Quick log</h2>
                <p className="mt-1 text-[10px] text-white/25">Small progress still counts. Put it on the record.</p>
              </div>
            </div>
            {data.projects.length > 0 ? (
              <LogComposer projects={data.projects} redirectTo="/dashboard" variant="dashboard" />
            ) : (
              <Link
                href="/projects/new"
                className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-xs font-semibold text-black"
              >
                Add your first project <Plus className="size-4" />
              </Link>
            )}
          </section>
        </BlurFade>

        <BlurFade inView delay={0.05}>
          <section className="h-full rounded-2xl border border-white/[0.075] bg-[#0e100e] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white/75">Your projects</h2>
                <p className="mt-1 text-[10px] text-white/25">{data.projects.length} workspace{data.projects.length === 1 ? "" : "s"}</p>
              </div>
              <Link href="/projects/new" aria-label="Add project" className="grid size-8 place-items-center rounded-lg border border-white/[0.07] text-white/35 hover:text-white">
                <Plus className="size-3.5" />
              </Link>
            </div>
            {data.projects.length > 0 ? (
              <div className="mt-5 space-y-2">
                {data.projects.slice(0, 4).map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.slug}`}
                    className="group flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.055] bg-black/15 p-3"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-green-400/[0.065] text-[11px] font-semibold text-green-300/65">
                      {project.name.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[11px] font-medium text-white/55 group-hover:text-white/75">{project.name}</p>
                      <p className="mt-0.5 text-[8px] text-white/20">
                        {project.logs_7d} log{project.logs_7d === 1 ? "" : "s"} this week
                      </p>
                    </div>
                    <ArrowRight className="size-3 shrink-0 text-white/15" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-white/[0.07] py-8 text-center">
                <p className="text-[10px] text-white/27">No projects yet.</p>
              </div>
            )}
          </section>
        </BlurFade>
      </div>

      <div className="mt-5 flex items-center justify-between px-1 text-[9px] text-white/18">
        <span>ShipNaija builder workspace</span>
        <span className="inline-flex items-center gap-1.5">
          <MessageCircle className="size-3" /> Keep building in public
        </span>
      </div>
    </section>
  );
}
