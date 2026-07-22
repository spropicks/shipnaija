import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { SiteHeader } from "@/components/site-header";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { Meteors } from "@/components/magicui/meteors";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { AuroraText } from "@/components/magicui/aurora-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Marquee } from "@/components/magicui/marquee";
import { MagicCard } from "@/components/magicui/magic-card";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { OrbitingCircles } from "@/components/magicui/orbiting-circles";
import ShinyText from "@/components/reactbits/shiny-text";
import SplitText from "@/components/reactbits/split-text";
import Magnet from "@/components/reactbits/magnet";
import { LiveFeed } from "@/components/landing/live-feed";
import { createServiceClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

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

const VIBES = [
  "Ship am! 🚢",
  "Build in public 🛠️",
  "Naija to the world 🌍",
  "From Yaba to YC 🚀",
  "Omo, just ship it 💚",
  "Debug like a champion 🐛",
  "No dey sleep on your dreams ⚡",
  "Lagos → Abuja → PH → everywhere 📍",
];

const FEATURES = [
  {
    emoji: "🔥",
    title: "Daily build logs",
    body: "Post what you shipped today. Text, links or screenshots — keep it raw, keep it real.",
  },
  {
    emoji: "⚡",
    title: "Streaks",
    body: "Ship every day and watch your streak grow. Miss a day and start over — accountability, Naija style.",
  },
  {
    emoji: "🚢",
    title: "Project showcase",
    body: "Give your product a home. Share your stack, your story, and your launch with builders who get it.",
  },
  {
    emoji: "📈",
    title: "Trending leaderboard",
    body: "The most consistent shippers rise to the top every week. Your work gets seen.",
  },
  {
    emoji: "🏆",
    title: "Weekly ship challenges",
    body: "Ship something every week with the community. Climb the board. Win bragging rights.",
  },
  {
    emoji: "🎛️",
    title: "Builder dashboard",
    body: "Your streak, your activity calendar, your projects — one command center for your shipping life.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create your profile",
    body: "Sign in with Google or GitHub. Tell the community who you are and what you build with.",
  },
  {
    number: "02",
    title: "Add your project",
    body: "Fintech app, AI tool, agro-tech platform — give it a page and a story.",
  },
  {
    number: "03",
    title: "Ship & log it daily",
    body: "Post build logs, grow your streak, climb the leaderboard, and win ship challenges.",
  },
];

const STATS = [
  { key: "builders", label: "builders" },
  { key: "projects", label: "projects" },
  { key: "logs", label: "build logs" },
] as const;

export default async function Home() {
  const stats = await getStats();
  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pb-24 pt-24 sm:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-64 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-green-500/[0.13] blur-[140px]"
        />
        <DotPattern
          className={cn(
            "text-white/[0.15]",
            "[mask-image:radial-gradient(600px_circle_at_top,white,transparent)]"
          )}
        />
        <Meteors number={10} angle={215} className="text-green-200" />

        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-7 text-center">
          <Link
            href="/challenges"
            className="group rounded-full border border-white/10 bg-white/[0.04] text-sm transition-all hover:border-green-500/30 hover:bg-white/[0.08]"
          >
            <AnimatedShinyText className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5">
              <span className="inline-block size-1.5 rounded-full bg-green-400 shadow-[0_0_8px_2px_rgba(74,222,128,0.6)]" />
              Ship Week #1 is live — join the challenge
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </AnimatedShinyText>
          </Link>

          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.04] tracking-tighter sm:text-7xl">
            <SplitText
              text="Build in public."
              tag="span"
              splitType="chars"
              delay={30}
              duration={0.7}
            />
            <br />
            <AuroraText colors={["#16a34a", "#4ade80", "#eab308", "#22d3ee"]}>
              Ship faster.
            </AuroraText>{" "}
            <span className="text-white/35">Grow together.</span>
          </h1>

          <div className="max-w-xl text-lg leading-relaxed text-white/55">
            <ShinyText
              text="The build-in-public home for Nigerian solo devs, indie hackers and vibe coders. Log what you ship, every day — and grow with people who get it."
              speed={4}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <SignedOut>
              <Magnet padding={70} magnetStrength={4}>
                <SignInButton mode="modal">
                  <ShimmerButton
                    background="rgba(22, 163, 74, 1)"
                    shimmerColor="#ffffff"
                    className="px-7 py-3 text-base font-semibold"
                  >
                    Start shipping — it&apos;s free 🚀
                  </ShimmerButton>
                </SignInButton>
              </Magnet>
            </SignedOut>
            <SignedIn>
              <Magnet padding={70} magnetStrength={4}>
                <Link href="/projects/new">
                  <ShimmerButton
                    background="rgba(22, 163, 74, 1)"
                    shimmerColor="#ffffff"
                    className="px-7 py-3 text-base font-semibold"
                  >
                    + Add your project 🚀
                  </ShimmerButton>
                </Link>
              </Magnet>
            </SignedIn>
            <Link
              href="/feed"
              className="rounded-full border border-white/12 bg-white/[0.02] px-6 py-3 text-base font-medium text-white/75 transition-all hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
            >
              See the live feed
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-10 grid w-full max-w-2xl grid-cols-3 gap-3 sm:gap-4">
            {STATS.map((s) => (
              <div
                key={s.key}
                className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-6 backdrop-blur-sm"
              >
                <p className="text-3xl font-extrabold tracking-tight text-green-400">
                  <NumberTicker value={stats[s.key]} className="text-green-400" />
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-white/40">
                  {s.label}
                </p>
                <BorderBeam size={70} duration={7} colorFrom="#16a34a" colorTo="#eab308" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vibes marquee */}
      <section className="border-y border-white/[0.06] bg-white/[0.015] py-4">
        <Marquee pauseOnHover className="[--duration:30s]">
          {VIBES.map((v) => (
            <span key={v} className="mx-7 text-sm font-medium text-white/40">
              {v}
            </span>
          ))}
        </Marquee>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-green-400">
          The toolkit
        </p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to{" "}
          <AuroraText colors={["#16a34a", "#4ade80", "#eab308"]}>just ship am</AuroraText>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-white/50">
          No investors to impress. No gatekeepers. Just you, your product, and a
          community that keeps you shipping.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <MagicCard
              key={f.title}
              className="rounded-2xl border border-white/[0.08] p-6 transition-colors hover:border-white/[0.16]"
              gradientColor="#16a34a22"
            >
              <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-2xl">
                {f.emoji}
              </div>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{f.body}</p>
            </MagicCard>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-white/[0.06] bg-white/[0.015]">
        <div className="mx-auto w-full max-w-6xl px-6 py-24">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-green-400">
            How it works
          </p>
          <h2 className="mt-3 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            From lurker to shipper in 5 minutes
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.number} className="relative">
                <span className="font-mono text-5xl font-bold text-white/[0.08]">
                  {s.number}
                </span>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live feed preview */}
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-24 sm:flex-row">
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-400">
            The feed
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            The ship never stops <span className="text-green-500">🚢</span>
          </h2>
          <p className="mt-4 leading-relaxed text-white/55">
            Every day, builders across Nigeria post what they shipped — wins,
            bugs, launches and lessons. Your daily log keeps your streak alive
            and puts your work in front of the community.
          </p>
          <Link
            href="/feed"
            className="mt-6 inline-block text-sm font-semibold text-green-400 transition-colors hover:text-green-300"
          >
            Jump into the feed →
          </Link>
        </div>
        <div className="w-full flex-1">
          <LiveFeed />
        </div>
      </section>

      {/* Community / stacks */}
      <section className="mx-auto flex w-full max-w-6xl flex-col-reverse items-center gap-12 px-6 pb-24 sm:flex-row">
        <div className="relative flex h-[320px] w-full max-w-[320px] items-center justify-center">
          <span className="text-5xl">🚢</span>
          <OrbitingCircles iconSize={40} radius={130}>
            <span className="text-2xl">⚛️</span>
            <span className="text-2xl">🗄️</span>
            <span className="text-2xl">🔐</span>
            <span className="text-2xl">🎨</span>
          </OrbitingCircles>
          <OrbitingCircles iconSize={32} radius={75} reverse speed={1.5}>
            <span className="text-xl">💚</span>
            <span className="text-xl">🛠️</span>
            <span className="text-xl">⚡</span>
          </OrbitingCircles>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-green-400">
            The community
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            One community.{" "}
            <AuroraText colors={["#16a34a", "#22d3ee", "#eab308"]}>Every stack.</AuroraText>
          </h2>
          <p className="mt-4 leading-relaxed text-white/55">
            Next.js, Laravel, Flutter, plain PHP on shared hosting — nobody
            judges the stack. If you dey ship, you belong here. Meet builders
            from Lagos, Abuja, PH, Enugu, and everywhere the diaspora reaches.
          </p>
          <Link
            href="/builders"
            className="mt-6 inline-block text-sm font-semibold text-green-400 transition-colors hover:text-green-300"
          >
            Meet the builders →
          </Link>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 pb-24">
        <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center gap-6 overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-green-500/[0.15] blur-[100px]"
          />
          <BorderBeam size={200} duration={10} colorFrom="#16a34a" colorTo="#eab308" />
          <SparklesText
            className="relative z-10 text-3xl font-bold tracking-tight sm:text-4xl"
            sparklesCount={8}
            colors={{ first: "#16a34a", second: "#eab308" }}
          >
            Wetin you dey build? Show us.
          </SparklesText>
          <p className="relative z-10 max-w-md text-white/55">
            Join the builders shipping in public from Naija to the world. Free
            forever for builders.
          </p>
          <div className="relative z-10">
            <SignedOut>
              <Magnet padding={70} magnetStrength={4}>
                <SignInButton mode="modal">
                  <ShimmerButton
                    background="rgba(22, 163, 74, 1)"
                    shimmerColor="#ffffff"
                    className="px-7 py-3 text-base font-semibold"
                  >
                    Join the community 💚
                  </ShimmerButton>
                </SignInButton>
              </Magnet>
            </SignedOut>
            <SignedIn>
              <Magnet padding={70} magnetStrength={4}>
                <Link href="/builders">
                  <ShimmerButton
                    background="rgba(22, 163, 74, 1)"
                    shimmerColor="#ffffff"
                    className="px-7 py-3 text-base font-semibold"
                  >
                    Meet the builders 💚
                  </ShimmerButton>
                </Link>
              </Magnet>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06]">
        <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-14 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5 font-bold tracking-tight">
              <span className="flex size-8 items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 text-base">
                🚢
              </span>
              Ship<span className="-ml-1.5 text-green-400">Naija</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/45">
              The build-in-public community for Nigerian makers. Ship daily,
              grow your streak, and take Naija to the world.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Product
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/feed" className="text-white/60 transition-colors hover:text-white">Feed</Link></li>
              <li><Link href="/projects" className="text-white/60 transition-colors hover:text-white">Projects</Link></li>
              <li><Link href="/trending" className="text-white/60 transition-colors hover:text-white">Trending</Link></li>
              <li><Link href="/challenges" className="text-white/60 transition-colors hover:text-white">Challenges</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
              Community
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/builders" className="text-white/60 transition-colors hover:text-white">Builders</Link></li>
              <li><Link href="/dashboard" className="text-white/60 transition-colors hover:text-white">Dashboard</Link></li>
              <li><Link href="/profile/edit" className="text-white/60 transition-colors hover:text-white">Your profile</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.06]">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-white/35 sm:flex-row">
            <p>© 2026 ShipNaija.dev — built in public, from Naija to the world.</p>
            <p>Made with 🧡 by Nigerian builders, for Nigerian builders.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
