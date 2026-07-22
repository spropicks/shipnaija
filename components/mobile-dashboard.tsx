import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Check,
  Clock3,
  Flame,
  FolderKanban,
  Heart,
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

export function MobileDashboard({
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
      icon: Flame,
    },
    {
      label: "Logs this week",
      value: data.logs7d,
      icon: Activity,
    },
    {
      label: "Projects",
      value: data.projects.length,
      icon: FolderKanban,
    },
    {
      label: "Likes earned",
      value: data.likesReceived7d,
      icon: Heart,
    },
  ];

  return (
    <section className="mx-auto w-full max-w-md overflow-x-clip px-3 pb-20 pt-7 md:hidden">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-green-400/75">
            Builder dashboard
          </p>
          <h1 className="mt-3 truncate text-[26px] font-semibold leading-tight tracking-[-0.045em] text-white">
            How far, {firstName}! <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-2 text-[13px] leading-5 text-white/38">
            {data.shippedToday
              ? "You don ship today. Keep the momentum going."
              : "You never ship today. Make one small move."}
          </p>
        </div>
        {data.projects.length > 0 ? (
          <a
            href="#mobile-quick-log"
            aria-label="Log a ship"
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-green-400/20 bg-green-400/[0.08] text-green-300"
          >
            <Plus className="size-4" />
          </a>
        ) : (
          <Link
            href="/projects/new"
            aria-label="Add a project"
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-green-400/20 bg-green-400/[0.08] text-green-300"
          >
            <Plus className="size-4" />
          </Link>
        )}
      </div>

      <div className="mt-7 grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex min-h-[116px] min-w-0 flex-col justify-between rounded-2xl border border-white/[0.09] bg-[#101210] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)]"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-[26px] font-semibold leading-none tracking-[-0.04em]">
                  <NumberTicker value={stat.value} />
                </p>
                <Icon className="size-[18px] shrink-0 text-green-400/70" strokeWidth={1.6} />
              </div>
              <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-white/28">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      <section className="mt-3 rounded-2xl border border-white/[0.09] bg-[#101210] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-medium text-white/75">Shipping activity</h2>
          <span className="text-[10px] text-white/25">Last 14 days</span>
        </div>
        <div
          className="mt-5 flex h-28 items-end gap-1.5"
          role="img"
          aria-label="Build logs over the last 14 days"
        >
          {data.activity14d.map((day) => {
            const height = day.count === 0 ? 8 : Math.max(22, (day.count / maxActivity) * 100);
            return (
              <div
                key={day.date}
                className="flex h-full min-w-0 flex-1 items-end"
                title={`${day.date}: ${day.count} log${day.count === 1 ? "" : "s"}`}
              >
                <span
                  className={`block w-full rounded-t-[4px] ${
                    day.count
                      ? "bg-gradient-to-t from-green-950 via-green-600 to-green-400 shadow-[0_-5px_18px_-10px_rgba(74,222,128,0.8)]"
                      : "bg-white/[0.055]"
                  }`}
                  style={{ height: `${height}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-white/[0.055] pt-3 text-[9px]">
          <span className="text-white/22">
            {data.shippedToday ? "Today is active" : "Nothing logged today"}
          </span>
          <span className="text-green-300/55">
            {data.logs7d} ship{data.logs7d === 1 ? "" : "s"} this week
          </span>
        </div>
      </section>

      <section className="mt-3 overflow-hidden rounded-2xl border border-white/[0.09] bg-[#101210] p-4">
        {data.activeChallenge ? (
          <>
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-yellow-400/15 bg-yellow-400/[0.07] text-yellow-300">
                <Trophy className="size-[18px]" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium text-white/76">
                  {data.activeChallenge.title}
                </p>
                <p className="mt-0.5 text-[10px] text-white/28">
                  {daysUntil(data.activeChallenge.ends_at)} days remaining
                </p>
              </div>
              <Link
                href={`/challenges/${data.activeChallenge.slug}`}
                aria-label="View challenge"
                className="text-green-300/45"
              >
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.055]">
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
            <div className="mt-4 flex items-center gap-2 text-[11px]">
              {data.enteredChallenge ? (
                <>
                  <Check className="size-3.5 text-green-400/70" />
                  <span className="text-green-300/55">You&apos;re in — keep shipping</span>
                </>
              ) : (
                <Link
                  href={`/challenges/${data.activeChallenge.slug}`}
                  className="inline-flex items-center gap-2 font-medium text-green-300/65"
                >
                  Enter this Ship Week <ArrowRight className="size-3.5" />
                </Link>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-white/[0.04] text-white/30">
              <Clock3 className="size-4" />
            </span>
            <div>
              <p className="text-[14px] font-medium text-white/70">Next Ship Week is cooking.</p>
              <p className="mt-1 text-[10px] text-white/28">Keep building while we prepare it.</p>
            </div>
          </div>
        )}
      </section>

      <section className="mt-3 rounded-2xl border border-white/[0.09] bg-[#101210] p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[14px] font-medium text-white/75">Recent build logs</h2>
          <Link
            href="/feed"
            className="inline-flex items-center gap-1 text-[10px] text-green-300/55"
          >
            View feed <ArrowRight className="size-3" />
          </Link>
        </div>

        {data.recentLogs.length > 0 ? (
          <div className="mt-4 space-y-2.5">
            {data.recentLogs.slice(0, 3).map((log, index) => {
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
                    <p className="truncate text-[12px] font-medium text-white/65">
                      {log.content}
                    </p>
                    <p className="mt-1 truncate text-[9px] text-white/24">
                      {log.project.name} · {timeAgo(log.created_at)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-white/[0.08] px-4 py-7 text-center">
            <Rocket className="mx-auto size-4 text-white/20" />
            <p className="mt-2 text-[11px] text-white/30">Your first ship will show up here.</p>
          </div>
        )}
      </section>

      <section
        id="mobile-quick-log"
        className="mt-3 scroll-mt-24 rounded-2xl border border-white/[0.09] bg-[#101210] p-4"
      >
        <div className="mb-4 flex items-center gap-2">
          <Zap className="size-4 text-green-300/70" />
          <div>
            <h2 className="text-[14px] font-medium text-white/75">Quick log</h2>
            <p className="mt-0.5 text-[10px] text-white/26">Wetin you ship today?</p>
          </div>
        </div>
        {data.projects.length > 0 ? (
          <LogComposer projects={data.projects} redirectTo="/dashboard" variant="dashboard" />
        ) : (
          <Link
            href="/projects/new"
            className="flex items-center justify-between rounded-xl bg-white px-4 py-3 text-[12px] font-semibold text-black"
          >
            Add your first project <Plus className="size-4" />
          </Link>
        )}
      </section>

      {data.projects.length > 0 ? (
        <section className="mt-3 rounded-2xl border border-white/[0.09] bg-[#101210] p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-medium text-white/75">Your projects</h2>
            <Link href="/projects/new" className="text-green-300/55" aria-label="Add project">
              <Plus className="size-4" />
            </Link>
          </div>
          <div className="mt-4 space-y-2.5">
            {data.projects.slice(0, 3).map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.06] bg-black/20 p-3"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-green-400/[0.07] text-[12px] font-semibold text-green-300/70">
                  {project.name.slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-medium text-white/65">{project.name}</p>
                  <p className="mt-1 truncate text-[9px] text-white/24">
                    {project.logs_7d} log{project.logs_7d === 1 ? "" : "s"} this week
                  </p>
                </div>
                <ArrowRight className="size-3.5 shrink-0 text-white/18" />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
