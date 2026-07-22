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
    body: "Post what you shipped today. Keep your streak alive and let the community hold you accountable.",
  },
  {
    emoji: "🚢",
    title: "Project showcase",
    body: "Give your product a home. Share your stack, your story, and your launch with builders who get it.",
  },
  {
    emoji: "🏆",
    title: "Weekly ship challenges",
    body: "Ship something every week with the community. Climb the leaderboard. Win bragging rights.",
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
      <section className="relative flex flex-col items-center gap-8 overflow-hidden px-6 pb-24 pt-24 text-center">
        <DotPattern
          className={cn(
            "text-green-500/20",
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
          )}
        />
        <Meteors number={12} angle={215} className="text-green-200" />

        <div className="group z-10 rounded-full border border-white/10 bg-white/5 text-sm transition-all hover:bg-white/10">
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1.5">
            🇳🇬 The home of Naija builders
          </AnimatedShinyText>
        </div>

        <h1 className="z-10 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          <SplitText
            text="Build in public."
            tag="span"
            splitType="chars"
            delay={35}
            duration={0.8}
          />{" "}
          <AuroraText colors={["#16a34a", "#4ade80", "#eab308", "#22d3ee"]}>
            Ship faster.
          </AuroraText>{" "}
          <span className="text-white/90">Grow together.</span>
        </h1>

        <div className="z-10 max-w-2xl text-lg text-white/60">
          <ShinyText
            text="ShipNaija is where Nigerian solo devs, indie hackers and vibe coders share what they're building every day — and help each other ship."
            speed={4}
          />
        </div>

        <div className="z-10 flex flex-wrap items-center justify-center gap-4">
          <SignedOut>
            <Magnet padding={80} magnetStrength={4}>
              <SignInButton mode="modal">
                <ShimmerButton
                  background="rgba(22, 163, 74, 1)"
                  shimmerColor="#ffffff"
                  className="px-6 py-3 text-base font-semibold"
                >
                  Start shipping 🚀
                </ShimmerButton>
              </SignInButton>
            </Magnet>
          </SignedOut>
          <SignedIn>
            <Magnet padding={80} magnetStrength={4}>
              <Link href="/projects/new">
                <ShimmerButton
                  background="rgba(22, 163, 74, 1)"
                  shimmerColor="#ffffff"
                  className="px-6 py-3 text-base font-semibold"
                >
                  + Add your project 🚀
                </ShimmerButton>
              </Link>
            </Magnet>
          </SignedIn>
          <Link
            href="/feed"
            className="rounded-full border border-white/15 px-6 py-3 text-base font-semibold text-white/80 transition-colors hover:bg-white/10"
          >
            See the feed →
          </Link>
        </div>

        {/* Stats with border beams */}
        <div className="z-10 mt-8 grid w-full max-w-2xl grid-cols-3 gap-4">
          {STATS.map((s) => (
            <div
              key={s.key}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-6"
            >
              <p className="text-3xl font-extrabold text-green-400">
                <NumberTicker value={stats[s.key]} className="text-green-400" />
              </p>
              <p className="mt-1 text-sm text-white/50">{s.label}</p>
              <BorderBeam
                size={70}
                duration={7}
                colorFrom="#16a34a"
                colorTo="#eab308"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Vibes marquee */}
      <section className="border-y border-white/10 py-4">
        <Marquee pauseOnHover className="[--duration:30s]">
          {VIBES.map((v) => (
            <span key={v} className="mx-6 text-sm text-white/60">
              {v}
            </span>
          ))}
        </Marquee>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold">
          Everything you need to{" "}
          <AuroraText colors={["#16a34a", "#4ade80", "#eab308"]}>
            just ship am
          </AuroraText>
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <MagicCard
              key={f.title}
              className="rounded-xl border border-white/10 p-6"
              gradientColor="#16a34a22"
            >
              <div className="text-3xl">{f.emoji}</div>
              <h3 className="mt-3 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-white/60">{f.body}</p>
            </MagicCard>
          ))}
        </div>
      </section>

      {/* Live feed preview */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-6 py-20 sm:flex-row">
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-3xl font-bold">
            The ship never stops <span className="text-green-500">🚢</span>
          </h2>
          <p className="mt-4 text-white/60">
            Every day, builders across Nigeria post what they shipped — wins,
            bugs, launches and lessons. Your daily log keeps your streak alive
            and puts your work in front of the community.
          </p>
          <Link
            href="/feed"
            className="mt-6 inline-block text-sm font-semibold text-green-400 hover:text-green-300"
          >
            Jump into the feed →
          </Link>
        </div>
        <div className="w-full flex-1">
          <LiveFeed />
        </div>
      </section>

      {/* Community / stacks */}
      <section className="mx-auto flex w-full max-w-5xl flex-col-reverse items-center gap-10 px-6 py-20 sm:flex-row">
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
          <h2 className="text-3xl font-bold">
            One community.{" "}
            <AuroraText colors={["#16a34a", "#22d3ee", "#eab308"]}>
              Every stack.
            </AuroraText>
          </h2>
          <p className="mt-4 text-white/60">
            Next.js, Laravel, Flutter, plain PHP on shared hosting — nobody
            judges the stack. If you dey ship, you belong here. Meet builders
            from Lagos, Abuja, PH, Enugu, and everywhere the diaspora reaches.
          </p>
          <Link
            href="/builders"
            className="mt-6 inline-block text-sm font-semibold text-green-400 hover:text-green-300"
          >
            Meet the builders →
          </Link>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="flex flex-col items-center gap-6 px-6 pb-24 text-center">
        <SparklesText
          className="text-3xl font-bold sm:text-4xl"
          sparklesCount={8}
          colors={{ first: "#16a34a", second: "#eab308" }}
        >
          Wetin you dey build? Show us.
        </SparklesText>
        <SignedOut>
          <Magnet padding={80} magnetStrength={4}>
            <SignInButton mode="modal">
              <ShimmerButton
                background="rgba(22, 163, 74, 1)"
                shimmerColor="#ffffff"
                className="px-6 py-3 text-base font-semibold"
              >
                Join the community 💚
              </ShimmerButton>
            </SignInButton>
          </Magnet>
        </SignedOut>
        <SignedIn>
          <Magnet padding={80} magnetStrength={4}>
            <Link href="/builders">
              <ShimmerButton
                background="rgba(22, 163, 74, 1)"
                shimmerColor="#ffffff"
                className="px-6 py-3 text-base font-semibold"
              >
                Meet the builders 💚
              </ShimmerButton>
            </Link>
          </Magnet>
        </SignedIn>
      </section>

      <footer className="px-6 py-8 text-center text-sm text-white/50">
        Made with 🧡 by Nigerian builders, for Nigerian builders.
      </footer>
    </main>
  );
}
