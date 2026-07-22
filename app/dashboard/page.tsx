import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  FolderKanban,
  Heart,
  MessageCircle,
  Plus,
  Rocket,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { SignedOut, SignInButton } from "@clerk/nextjs";
import { SiteHeader } from "@/components/site-header";
import { MobileDashboard } from "@/components/mobile-dashboard";
import { LogComposer } from "@/components/log-composer";
import { BuildLogCard } from "@/components/build-log-card";
import { StreakCalendar } from "@/components/streak-calendar";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { NumberTicker } from "@/components/magicui/number-ticker";
import SpotlightCard from "@/components/reactbits/spotlight-card";
import { getCurrentProfile } from "@/lib/auth";
import { getDashboardData } from "@/lib/dashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

const STATUS_STYLES: Record<string, string> = {
  building: "border-yellow-400/15 bg-yellow-400/[0.07] text-yellow-200/70",
  launched: "border-green-400/15 bg-green-400/[0.07] text-green-200/70",
  paused: "border-white/[0.08] bg-white/[0.035] text-white/35",
};

function daysUntil(date: string) {
  return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000));
}

export default async function DashboardPage() {
  const me = await getCurrentProfile();

  if (!me) {
    return (
      <main className="min-h-screen">
        <SiteHeader />
        <section className="relative mx-auto flex min-h-[75vh] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center">
          <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-green-400/[0.08] blur-[100px]" />
          <BlurFade className="relative">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-green-400/15 bg-green-400/[0.07] text-green-300">
              <Activity className="size-6" />
            </span>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-green-400/70">
              Builder command center
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Your work. Your momentum.
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/42">
              Track your streak, log what you shipped, follow your projects, and
              stay on top of the current Ship Week.
            </p>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-green-100">
                  Sign in to your dashboard
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </SignInButton>
            </SignedOut>
          </BlurFade>
        </section>
      </main>
    );
  }

  const data = await getDashboardData(me);
  const firstName = me.display_name.trim().split(/\s+/)[0] || me.handle;
  const challengeDays = data.activeChallenge ? daysUntil(data.activeChallenge.ends_at) : 0;

  const stats = [
    {
      label: "Current streak",
      value: me.current_streak,
      detail: data.shippedToday ? "Safe for today" : "Ship before UTC midnight",
      icon: Flame,
      accent: "text-orange-300",
      beam: true,
    },
    {
      label: "Longest streak",
      value: me.longest_streak,
      detail: "Personal best",
      icon: Trophy,
      accent: "text-yellow-300",
      beam: false,
    },
    {
      label: "Logs this week",
      value: data.logs7d,
      detail: "Last 7 days",
      icon: Activity,
      accent: "text-green-300",
      beam: false,
    },
    {
      label: "Likes received",
      value: data.likesReceived7d,
      detail: "Last 7 days",
      icon: Heart,
      accent: "text-pink-300",
      beam: false,
    },
    {
      label: "Comments",
      value: data.commentsReceived7d,
      detail: "Last 7 days",
      icon: MessageCircle,
      accent: "text-cyan-300",
      beam: false,
    },
  ];

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <MobileDashboard me={me} data={data} />

      <section className="mx-auto hidden w-full max-w-6xl px-5 pb-24 pt-14 md:block">
        <BlurFade>
          <div className="flex flex-col gap-6 border-b border-white/[0.07] pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-white/30">
                <Link href="/" className="transition-colors hover:text-white/60">ShipNaija</Link>
                <ChevronRight className="size-3" />
                <span className="text-white/50">Dashboard</span>
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-[-0.045em] min-[380px]:text-4xl sm:mt-5 sm:text-5xl">
                How far, <span className="text-green-300">{firstName}</span>?
              </h1>
              <p className="mt-3 text-sm text-white/40">
                Here&apos;s the state of your shipping journey today.
              </p>
            </div>
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center">
              <Link
                href="/projects/new"
                className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl border border-white/[0.09] bg-white/[0.025] px-3 py-2.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white sm:gap-2 sm:px-4 sm:text-sm"
              >
                <Plus className="size-4" />
                New project
              </Link>
              {data.projects.length > 0 ? (
                <a
                  href="#quick-log"
                  className="inline-flex min-w-0 items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-green-100 sm:gap-2 sm:px-4 sm:text-sm"
                >
                  <Rocket className="size-4" />
                  Log a ship
                </a>
              ) : null}
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.06}>
          <div
            className={`mt-6 flex flex-col gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${
              data.shippedToday
                ? "border-green-400/15 bg-green-400/[0.055]"
                : "border-orange-400/15 bg-orange-400/[0.055]"
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-xl ${
                  data.shippedToday
                    ? "bg-green-400/10 text-green-300"
                    : "bg-orange-400/10 text-orange-300"
                }`}
              >
                {data.shippedToday ? <Check className="size-4" /> : <Clock3 className="size-4" />}
              </span>
              <div>
                <p className="text-sm font-semibold text-white/80">
                  {data.shippedToday ? "You don ship today." : "You never ship today o."}
                </p>
                <p className="mt-1 text-xs leading-5 text-white/38">
                  {data.shippedToday
                    ? "Your streak is safe. Tomorrow, we go again."
                    : "Post one honest build log before midnight UTC to keep the fire alive."}
                </p>
              </div>
            </div>
            {!data.shippedToday && data.projects.length > 0 ? (
              <a href="#quick-log" className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-200/70 hover:text-orange-100">
                Protect my streak <ArrowRight className="size-3.5" />
              </a>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-green-200/55">
                <Flame className="size-3.5" /> {me.current_streak} day streak
              </span>
            )}
          </div>
        </BlurFade>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <BlurFade
                key={stat.label}
                delay={0.08 + index * 0.035}
                className={index === stats.length - 1 ? "col-span-2 sm:col-span-1" : ""}
              >
                <div className="relative h-full overflow-hidden rounded-2xl border border-white/[0.075] bg-[#0e100e] p-3.5 sm:p-5">
                  {stat.beam ? (
                    <BorderBeam size={65} duration={8} colorFrom="#22c55e" colorTo="#eab308" />
                  ) : null}
                  <div className="flex items-center justify-between">
                    <Icon className={`size-4 ${stat.accent}`} />
                    <span className="text-[9px] uppercase tracking-[0.14em] text-white/20">7d</span>
                  </div>
                  <p className="mt-4 text-2xl font-semibold tracking-[-0.045em] min-[380px]:text-3xl sm:mt-5">
                    {stat.value > 0 ? <NumberTicker value={stat.value} /> : "0"}
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-white/52">{stat.label}</p>
                  <p className="mt-1 text-[10px] text-white/23">{stat.detail}</p>
                </div>
              </BlurFade>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.45fr_.75fr]">
          <BlurFade inView>
            <section className="rounded-2xl border border-white/[0.075] bg-[#0e100e] p-5 sm:p-6">
              <div className="flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-start min-[420px]:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-green-300" />
                    <h2 className="text-sm font-semibold">Shipping activity</h2>
                  </div>
                  <p className="mt-1.5 text-xs text-white/30">Your last 14 UTC days</p>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-white/25">
                  <span>Less</span>
                  {["bg-white/[0.06]", "bg-green-900", "bg-green-700", "bg-green-400"].map((color) => (
                    <span key={color} className={`size-2.5 rounded-[3px] ${color}`} />
                  ))}
                  <span>More</span>
                </div>
              </div>
              <div className="mt-6">
                <StreakCalendar days={data.activity14d} />
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4 text-[10px]">
                <span className="text-white/25">One square per day</span>
                <span className="text-green-300/55">
                  {data.logs7d} log{data.logs7d === 1 ? "" : "s"} in the last week
                </span>
              </div>
            </section>
          </BlurFade>

          <BlurFade inView delay={0.06}>
            <SpotlightCard className="h-full rounded-2xl border border-white/[0.075] bg-[#0e100e] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <span className="grid size-9 place-items-center rounded-xl border border-yellow-400/15 bg-yellow-400/[0.06] text-yellow-200">
                  <Trophy className="size-4" />
                </span>
                {data.activeChallenge ? (
                  <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-white/30">
                    {challengeDays}d left
                  </span>
                ) : null}
              </div>
              <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.17em] text-white/25">
                Weekly challenge
              </p>
              {data.activeChallenge ? (
                <>
                  <h2 className="mt-2 text-xl font-semibold tracking-[-0.025em]">
                    {data.activeChallenge.title}
                  </h2>
                  {data.activeChallenge.theme ? (
                    <p className="mt-2 text-xs leading-5 text-white/35">{data.activeChallenge.theme}</p>
                  ) : null}
                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-green-600 to-green-300" />
                  </div>
                  <div className="mt-5">
                    {data.enteredChallenge ? (
                      <Link
                        href={`/challenges/${data.activeChallenge.slug}`}
                        className="group inline-flex items-center gap-2 text-xs font-semibold text-green-300/70 hover:text-green-200"
                      >
                        <Check className="size-3.5" />
                        You&apos;re in — view challenge
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    ) : (
                      <Link
                        href={`/challenges/${data.activeChallenge.slug}`}
                        className="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black hover:bg-green-100"
                      >
                        Enter Ship Week
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="mt-2 text-lg font-semibold">The next Ship Week is cooking.</h2>
                  <p className="mt-2 text-xs leading-5 text-white/35">
                    Keep building. A new community challenge drops soon.
                  </p>
                </>
              )}
            </SpotlightCard>
          </BlurFade>
        </div>

        <BlurFade inView>
          <section id="quick-log" className="mt-4 scroll-mt-24 rounded-2xl border border-white/[0.075] bg-[#0e100e] p-4 sm:p-6">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Zap className="size-4 text-green-300" />
                  <h2 className="text-lg font-semibold tracking-[-0.02em]">Quick log</h2>
                </div>
                <p className="mt-1.5 text-xs text-white/30">Small progress still counts. Put it on the record.</p>
              </div>
              <span className="text-[10px] text-white/20">Maximum 1,000 characters</span>
            </div>
            {data.projects.length > 0 ? (
              <LogComposer projects={data.projects} redirectTo="/dashboard" variant="dashboard" />
            ) : (
              <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-dashed border-white/[0.1] bg-black/15 p-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-medium text-white/65">Every build log needs a project.</p>
                  <p className="mt-1 text-xs text-white/30">Create the home for what you&apos;re building first.</p>
                </div>
                <Link href="/projects/new" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-black hover:bg-green-100">
                  <Plus className="size-3.5" /> Add first project
                </Link>
              </div>
            )}
          </section>
        </BlurFade>

        <div className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[.9fr_1.1fr]">
          <BlurFade inView>
            <section className="h-full min-w-0 rounded-2xl border border-white/[0.075] bg-[#0e100e] p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <FolderKanban className="size-4 text-green-300" />
                    <h2 className="text-sm font-semibold">Your projects</h2>
                  </div>
                  <p className="mt-1.5 text-xs text-white/30">{data.projects.length} active workspace{data.projects.length === 1 ? "" : "s"}</p>
                </div>
                <Link href="/projects/new" aria-label="Add project" className="grid size-8 place-items-center rounded-lg border border-white/[0.08] text-white/40 hover:bg-white/[0.05] hover:text-white">
                  <Plus className="size-3.5" />
                </Link>
              </div>

              {data.projects.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-white/[0.09] px-4 py-10 text-center">
                  <Rocket className="mx-auto size-5 text-white/20" />
                  <p className="mt-3 text-xs text-white/35">Your next big thing starts here.</p>
                </div>
              ) : (
                <div className="mt-5 space-y-2">
                  {data.projects.slice(0, 5).map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.slug}`}
                      className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/15 p-3.5 transition-colors hover:border-green-400/15 hover:bg-green-400/[0.025]"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-sm">
                        {project.name.slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white/70 group-hover:text-white">{project.name}</p>
                        <p className="mt-0.5 truncate text-[10px] text-white/25">
                          {project.logs_7d} log{project.logs_7d === 1 ? "" : "s"} this week
                          {project.tagline ? ` · ${project.tagline}` : ""}
                        </p>
                      </div>
                      <span className={`hidden rounded-full border px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] sm:block ${STATUS_STYLES[project.status] ?? STATUS_STYLES.paused}`}>
                        {project.status}
                      </span>
                      <ChevronRight className="size-3.5 text-white/15 transition-transform group-hover:translate-x-0.5 group-hover:text-white/40" />
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </BlurFade>

          <BlurFade inView delay={0.06}>
            <section className="h-full min-w-0 rounded-2xl border border-white/[0.075] bg-[#0e100e] p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-green-300" />
                    <h2 className="text-sm font-semibold">Recent ships</h2>
                  </div>
                  <p className="mt-1.5 text-xs text-white/30">Your latest build-in-public updates</p>
                </div>
                <Link href="/feed" className="group flex items-center gap-1 text-[10px] font-medium text-green-300/55 hover:text-green-200">
                  All activity <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {data.recentLogs.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-white/[0.09] px-4 py-10 text-center">
                  <Target className="mx-auto size-5 text-white/20" />
                  <p className="mt-3 text-xs text-white/35">Your first ship is the hardest. Log it above.</p>
                </div>
              ) : (
                <div className="mt-5 min-w-0 space-y-3 [&>article]:min-w-0 [&>article]:border-white/[0.06] [&>article]:bg-black/15 [&>article]:p-3.5 sm:[&>article]:p-4">
                  {data.recentLogs.slice(0, 3).map((log) => (
                    <BuildLogCard key={log.id} log={log} path="/dashboard" canEngage viewerId={me.id} />
                  ))}
                </div>
              )}
            </section>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
