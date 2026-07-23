import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  Check,
  Code2,
  Flame,
  FolderKanban,
  Heart,
  MessageCircle,
  Rocket,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { SiteHeader } from "@/components/site-header";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Marquee } from "@/components/magicui/marquee";
import { NumberTicker } from "@/components/magicui/number-ticker";
import GradientText from "@/components/reactbits/gradient-text";
import SpotlightCard from "@/components/reactbits/spotlight-card";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const supabase = createServiceClient();
    const [builders, projects, logs] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("projects").select("id", { count: "exact", head: true }),
      supabase.from("build_logs").select("id", { count: "exact", head: true }),
    ]);
    return {
      builders: builders.count ?? 0,
      projects: projects.count ?? 0,
      logs: logs.count ?? 0,
    };
  } catch {
    return { builders: 0, projects: 0, logs: 0 };
  }
}

const TICKER = [
  "Daily build logs",
  "Project launches",
  "Shipping streaks",
  "Weekly challenges",
  "Builder leaderboard",
  "Community feedback",
  "Made in Nigeria",
];

const FEATURES = [
  {
    icon: Flame,
    label: "Build consistently",
    title: "Your shipping streak keeps you honest.",
    body: "One log a day compounds into a body of work. Ship, log it, and watch your activity calendar turn green.",
    className: "md:col-span-2",
    visual: (
      <div className="mt-8 grid grid-cols-7 gap-1.5">
        {Array.from({ length: 28 }, (_, index) => (
          <span
            key={index}
            className={`aspect-square rounded-[4px] ${
              [1, 3, 5, 7, 8, 10, 12, 13, 14, 17, 19, 20, 21, 24, 25, 26, 27].includes(index)
                ? index > 20 ? "bg-green-400" : "bg-green-500/55"
                : "bg-white/[0.05]"
            }`}
          />
        ))}
      </div>
    ),
  },
  {
    icon: Trophy,
    label: "Get discovered",
    title: "The builders who ship rise.",
    body: "Trending rewards consistency, community love, and actual progress—not follower count.",
    className: "",
    visual: (
      <div className="mt-7 space-y-2">
        {[
          ["01", "Adaeze", "124"],
          ["02", "Tobi", "98"],
          ["03", "Chidi", "81"],
        ].map(([rank, name, score]) => (
          <div key={rank} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2.5 text-xs">
            <span className="font-mono text-white/30">{rank}</span>
            <span className="grid size-7 place-items-center rounded-full bg-green-400/10 text-[11px] text-green-300">
              {name[0]}
            </span>
            <span className="flex-1 font-medium text-white/75">{name}</span>
            <span className="text-white/30">{score} pts</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: FolderKanban,
    label: "Show the work",
    title: "Every project deserves a home.",
    body: "Share the story, stack, screenshots, links, milestones, and every build log behind the finished product.",
    className: "",
    visual: (
      <div className="mt-7 rounded-2xl border border-white/[0.07] bg-gradient-to-br from-green-400/[0.08] to-transparent p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-green-400/10 text-lg">⚡</span>
          <div>
            <p className="text-sm font-semibold text-white/85">Paystack Monitor</p>
            <p className="text-xs text-white/35">Next.js · Supabase · AI</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2 text-[10px] text-white/40">
          <span className="rounded-full bg-white/[0.05] px-2 py-1">12 logs</span>
          <span className="rounded-full bg-white/[0.05] px-2 py-1">34 likes</span>
        </div>
      </div>
    ),
  },
  {
    icon: Users,
    label: "Build together",
    title: "Accountability without the noise.",
    body: "Find builders on the same road. Share progress, get useful feedback, and celebrate the small wins.",
    className: "md:col-span-2",
    visual: (
      <div className="mt-8 flex items-center">
        {["A", "T", "C", "F", "E"].map((letter, index) => (
          <span
            key={letter}
            className="-ml-2 grid size-10 place-items-center rounded-full border-2 border-[#111311] bg-[#1a241c] text-xs font-semibold text-green-200 first:ml-0"
            style={{ zIndex: 10 - index }}
          >
            {letter}
          </span>
        ))}
        <span className="ml-3 text-xs text-white/35">Naija builders are shipping now</span>
      </div>
    ),
  },
];

function PrimaryCta({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button
            className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-white font-semibold text-black transition-all hover:bg-green-100 ${
              compact ? "px-5 py-2.5 text-sm" : "px-6 py-3.5 text-sm"
            }`}
          >
            Start shipping free
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Link
          href="/projects/new"
          className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-white font-semibold text-black transition-all hover:bg-green-100 ${
            compact ? "px-5 py-2.5 text-sm" : "px-6 py-3.5 text-sm"
          }`}
        >
          Add your project
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </SignedIn>
    </>
  );
}

function ProductPreview() {
  const days = [2, 3, 1, 4, 2, 5, 3, 2, 4, 1, 5, 4, 3, 5];

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="absolute -inset-12 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.13),transparent_65%)] blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-white/[0.11] bg-[#0c0e0c] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)]">
        <div className="flex h-11 items-center gap-2 border-b border-white/[0.07] px-4">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <div className="mx-auto flex w-52 items-center justify-center rounded-md border border-white/[0.06] bg-white/[0.025] py-1 text-[9px] text-white/25">
            shipnaija.dev/dashboard
          </div>
        </div>

        <div className="grid min-h-[470px] grid-cols-1 md:grid-cols-[180px_1fr]">
          <aside className="hidden border-r border-white/[0.06] p-4 md:block">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="grid size-7 place-items-center rounded-lg bg-green-400/10">🚢</span>
              ShipNaija
            </div>
            <div className="mt-7 space-y-1 text-[11px]">
              {[
                [Activity, "Overview", true],
                [Code2, "Build logs", false],
                [FolderKanban, "Projects", false],
                [Trophy, "Challenges", false],
              ].map(([Icon, label, active]) => {
                const MenuIcon = Icon as typeof Activity;
                return (
                  <div
                    key={label as string}
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 ${
                      active ? "bg-white/[0.06] text-white/80" : "text-white/30"
                    }`}
                  >
                    <MenuIcon className="size-3.5" />
                    {label as string}
                  </div>
                );
              })}
            </div>
          </aside>

          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-green-400/70">Builder dashboard</p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight">How far, Adaeze! 👋</h3>
                <p className="mt-1 text-xs text-white/35">You don ship today. Keep the momentum going.</p>
              </div>
              <span className="hidden rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-[10px] text-white/45 sm:block">
                + New log
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
              {[
                ["14", "day streak", Flame],
                ["38", "total logs", Activity],
                ["06", "projects", FolderKanban],
                ["124", "likes earned", Heart],
              ].map(([value, label, Icon]) => {
                const StatIcon = Icon as typeof Activity;
                return (
                  <div key={label as string} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold tracking-tight">{value as string}</span>
                      <StatIcon className="size-3.5 text-green-400/65" />
                    </div>
                    <p className="mt-1 text-[9px] uppercase tracking-wider text-white/25">{label as string}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-2.5 grid gap-2.5 lg:grid-cols-[1.25fr_.75fr]">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-white/70">Shipping activity</p>
                  <span className="text-[9px] text-white/25">Last 14 days</span>
                </div>
                <div className="mt-7 flex h-24 items-end gap-2">
                  {days.map((height, index) => (
                    <span
                      key={index}
                      className="flex-1 rounded-t-[3px] bg-gradient-to-t from-green-600/35 to-green-400"
                      style={{ height: `${height * 17}%`, opacity: 0.38 + height * 0.12 }}
                    />
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-lg bg-yellow-400/10 text-sm">🏆</span>
                  <div>
                    <p className="text-[11px] font-medium text-white/70">Ship Week #1</p>
                    <p className="text-[9px] text-white/25">3 days remaining</p>
                  </div>
                </div>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                  <div className="h-full w-[72%] rounded-full bg-green-400" />
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[9px] text-green-300/70">
                  <Check className="size-3" />
                  You&apos;re in — keep shipping
                </div>
              </div>
            </div>

            <div className="mt-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-white/70">Recent build logs</p>
                <span className="text-[9px] text-green-400/60">View feed →</span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  ["🚀", "Shipped onboarding v2", "Paystack Monitor · 2h"],
                  ["🛠️", "Fixed webhook retries", "InvoicePilot · Yesterday"],
                ].map(([emoji, title, meta]) => (
                  <div key={title} className="flex items-center gap-3 rounded-lg border border-white/[0.05] bg-black/15 p-2.5">
                    <span className="grid size-8 place-items-center rounded-lg bg-white/[0.04] text-sm">{emoji}</span>
                    <div>
                      <p className="text-[10px] font-medium text-white/65">{title}</p>
                      <p className="mt-0.5 text-[8px] text-white/25">{meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <BorderBeam size={180} duration={12} colorFrom="#22c55e" colorTo="#eab308" />
      </div>
    </div>
  );
}

export default async function Home() {
  const stats = await getStats();

  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader />

      <section className="relative px-5 pb-20 pt-24 sm:pt-32">
        <AnimatedGridPattern
          numSquares={32}
          maxOpacity={0.14}
          duration={3.5}
          className="[mask-image:radial-gradient(700px_circle_at_50%_12%,white,transparent)]"
        />
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[520px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.16),transparent_65%)] blur-2xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <BlurFade delay={0.05}>
            <Link
              href="/challenges"
              className="group inline-flex items-center gap-2 rounded-full border border-green-400/15 bg-green-400/[0.06] px-3.5 py-1.5 text-xs font-medium text-green-200/70 transition-colors hover:border-green-400/30 hover:text-green-100"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-50" />
                <span className="relative inline-flex size-2 rounded-full bg-green-400" />
              </span>
              Ship Week #1 is live
              <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </BlurFade>

          <BlurFade delay={0.12}>
            <h1 className="mt-7 text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.94] tracking-[-0.065em] text-white">
              Build out loud.
              <br />
              <GradientText>Ship without limits.</GradientText>
            </h1>
          </BlurFade>

          <BlurFade delay={0.2}>
            <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/48 sm:text-lg">
              The build-in-public network for Nigerian founders and developers.
              Share the work, grow your streak, and turn today&apos;s progress
              into tomorrow&apos;s launch.
            </p>
          </BlurFade>

          <BlurFade delay={0.28}>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <PrimaryCta />
              <Link
                href="/feed"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.025] px-6 py-3.5 text-sm font-medium text-white/65 transition-all hover:bg-white/[0.06] hover:text-white"
              >
                Explore the community
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <p className="mt-4 text-[11px] text-white/25">
              Free for builders · Google, GitHub or email
            </p>
          </BlurFade>
        </div>

        <BlurFade delay={0.38} className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
          <ProductPreview />
        </BlurFade>
      </section>

      <section className="border-y border-white/[0.06] bg-white/[0.012] py-4">
        <Marquee pauseOnHover className="[--duration:34s]">
          {TICKER.map((item) => (
            <div key={item} className="mx-5 flex items-center gap-5 text-[11px] font-medium uppercase tracking-[0.18em] text-white/28">
              {item}
              <span className="size-1 rounded-full bg-green-400/50" />
            </div>
          ))}
        </Marquee>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
        <BlurFade inView>
          <div className="grid gap-8 border-b border-white/[0.07] pb-12 md:grid-cols-[1fr_1.1fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400/75">Built for momentum</p>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                A home for the journey, not just the launch.
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-white/42 md:justify-self-end">
              Great products are built in hundreds of ordinary days. ShipNaija
              makes those days visible—so you stay accountable, find your
              people, and build a reputation through the work itself.
            </p>
          </div>
        </BlurFade>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <BlurFade key={feature.title} inView delay={index * 0.06} className={feature.className}>
                <SpotlightCard className="h-full rounded-2xl border border-white/[0.075] bg-[#0e100e] p-6 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-green-300">
                      <Icon className="size-4.5" />
                    </span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/25">
                      {feature.label}
                    </span>
                  </div>
                  <h3 className="mt-7 max-w-sm text-xl font-semibold tracking-[-0.025em]">
                    {feature.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
                    {feature.body}
                  </p>
                  {feature.visual}
                </SpotlightCard>
              </BlurFade>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-white/[0.012]">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
          <BlurFade inView>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400/75">How it works</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
                Your next ship starts here.
              </h2>
            </div>
          </BlurFade>

          <div className="relative mt-14 grid gap-3 md:grid-cols-3">
            <div className="absolute left-[16.66%] right-[16.66%] top-7 hidden h-px bg-gradient-to-r from-transparent via-green-400/25 to-transparent md:block" />
            {[
              [Users, "01", "Claim your builder profile", "Tell the community what you build, where you are, and the tools you reach for."],
              [Rocket, "02", "Give your project a home", "Add the product, stack, links and story—even when it is still rough around the edges."],
              [Zap, "03", "Log the work. Keep moving.", "Share one honest update a day, build your streak, and let momentum do the rest."],
            ].map(([Icon, number, title, body], index) => {
              const StepIcon = Icon as typeof Users;
              return (
                <BlurFade key={title as string} inView delay={index * 0.08}>
                  <div className="relative rounded-2xl border border-white/[0.07] bg-[#0d0f0d] p-7">
                    <div className="flex items-center justify-between">
                      <span className="grid size-14 place-items-center rounded-2xl border border-green-400/15 bg-green-400/[0.055] text-green-300">
                        <StepIcon className="size-5" />
                      </span>
                      <span className="font-mono text-xs text-white/20">{number as string}</span>
                    </div>
                    <h3 className="mt-8 text-lg font-semibold tracking-tight">{title as string}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/38">{body as string}</p>
                  </div>
                </BlurFade>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-14 px-5 py-24 sm:py-32 md:grid-cols-[.8fr_1.2fr] md:items-center">
        <BlurFade inView>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-400/75">Community pulse</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">
              Progress feels better when people see it.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/42">
              Every log is a small signal: someone launched, learned, fixed,
              failed, or tried again. That shared momentum is what makes the
              community useful.
            </p>
            <Link href="/feed" className="group mt-7 inline-flex items-center gap-2 text-sm font-medium text-green-300">
              See what shipped today
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </BlurFade>

        <BlurFade inView delay={0.1}>
          <div className="relative space-y-2.5">
            {[
              ["AD", "Adaeze", "Shipped the first onboarding flow", "2 min", "🚀", "24"],
              ["TB", "Tobi", "Fixed payment retries and wrote the postmortem", "18 min", "🛠️", "16"],
              ["ZN", "Zainab", "Hit a 21-day shipping streak", "44 min", "🔥", "31"],
            ].map(([initials, name, message, time, emoji, likes], index) => (
              <div
                key={name}
                className={`rounded-2xl border border-white/[0.075] bg-[#0e100e] p-4 transition-transform hover:-translate-y-0.5 sm:p-5 ${
                  index === 1 ? "md:ml-8" : index === 2 ? "md:ml-16" : ""
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full border border-green-400/15 bg-green-400/[0.07] text-xs font-semibold text-green-200">
                    {initials}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{name}</p>
                      <span className="text-[10px] text-white/22">{time} ago</span>
                    </div>
                    <p className="mt-1.5 text-sm text-white/48">
                      <span className="mr-1.5">{emoji}</span>{message}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-[10px] text-white/25">
                      <span className="flex items-center gap-1.5"><Heart className="size-3" />{likes}</span>
                      <span className="flex items-center gap-1.5"><MessageCircle className="size-3" />Reply</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.09),transparent_68%)] blur-xl" />
          </div>
        </BlurFade>
      </section>

      <section className="border-y border-white/[0.06] bg-white/[0.012]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/[0.06] px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            ["builders", stats.builders, Users],
            ["projects", stats.projects, FolderKanban],
            ["build logs", stats.logs, Activity],
          ].map(([label, value, Icon]) => {
            const StatIcon = Icon as typeof Users;
            return (
              <div key={label as string} className="flex flex-col items-center px-2 py-10 text-center sm:py-14">
                <StatIcon className="mb-4 size-4 text-green-400/50" />
                <NumberTicker value={value as number} className="text-3xl font-semibold tracking-[-0.04em] sm:text-5xl" />
                <p className="mt-2 text-[9px] font-medium uppercase tracking-[0.16em] text-white/25 sm:text-[10px]">
                  {label as string}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-5 py-24 sm:py-32">
        <BlurFade inView>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#0e110e] px-6 py-16 text-center sm:px-12 sm:py-20">
            <AnimatedGridPattern
              numSquares={20}
              maxOpacity={0.1}
              className="[mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
            />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-3/4 -translate-x-1/2 -translate-y-1/2 bg-green-400/[0.08] blur-[100px]" />
            <div className="relative">
              <span className="mx-auto grid size-11 place-items-center rounded-2xl border border-green-400/15 bg-green-400/[0.07] text-green-300">
                <Sparkles className="size-5" />
              </span>
              <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">
                Stop waiting for perfect. <GradientText>Ship it.</GradientText>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/40">
                Your next user, collaborator, or opportunity could be one build
                log away. Join the Nigerian builders doing the work in public.
              </p>
              <div className="mt-8">
                <PrimaryCta />
              </div>
            </div>
            <BorderBeam size={220} duration={13} colorFrom="#22c55e" colorTo="#eab308" />
          </div>
        </BlurFade>
      </section>

      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5 text-sm font-semibold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.webp" alt="ShipNaija" width={36} height={36} className="size-9 shrink-0 object-contain" />
              ShipNaija<span className="-ml-2 text-green-400">.</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/32">
              The build-in-public network for Nigerian founders and developers.
              Made in Naija, built for everywhere.
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">Product</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/42">
              <Link href="/feed" className="hover:text-white">Feed</Link>
              <Link href="/projects" className="hover:text-white">Projects</Link>
              <Link href="/trending" className="hover:text-white">Trending</Link>
              <Link href="/challenges" className="hover:text-white">Challenges</Link>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/25">Community</p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-white/42">
              <Link href="/builders" className="hover:text-white">Builders</Link>
              <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
              <Link href="/profile/edit" className="hover:text-white">Your profile</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/[0.05]">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 px-5 py-6 text-[10px] text-white/20 sm:flex-row">
            <p>© 2026 ShipNaija.dev</p>
            <p>Built in public, from Naija to the world 🇳🇬</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
