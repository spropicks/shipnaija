import Link from "next/link";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { SiteHeader } from "@/components/site-header";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { Marquee } from "@/components/magicui/marquee";
import { MagicCard } from "@/components/magicui/magic-card";
import ShinyText from "@/components/reactbits/shiny-text";
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
        <div className="group rounded-full border border-white/10 bg-white/5 text-sm transition-all hover:bg-white/10">
          <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1.5">
            🇳🇬 The home of Naija builders
          </AnimatedShinyText>
        </div>
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          Build in public.{" "}
          <span className="text-green-500">Ship faster.</span>{" "}
          Grow together.
        </h1>
        <div className="max-w-2xl text-lg text-white/60">
          <ShinyText
            text="ShipNaija is where Nigerian solo devs, indie hackers and vibe coders share what they're building every day — and help each other ship."
            speed={4}
          />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <ShimmerButton
                background="rgba(22, 163, 74, 1)"
                shimmerColor="#ffffff"
                className="px-6 py-3 text-base font-semibold"
              >
                Start shipping 🚀
              </ShimmerButton>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/projects/new">
              <ShimmerButton
                background="rgba(22, 163, 74, 1)"
                shimmerColor="#ffffff"
                className="px-6 py-3 text-base font-semibold"
              >
                + Add your project 🚀
              </ShimmerButton>
            </Link>
          </SignedIn>
          <Link
            href="/projects"
            className="rounded-md border border-white/15 px-6 py-3 text-base text-white/80 transition hover:border-green-500/50 hover:text-green-400"
          >
            Browse projects
          </Link>
        </div>

        {/* Live stats */}
        <div className="mt-6 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-extrabold text-green-400">
              <NumberTicker value={stats.builders} className="text-green-400" />
            </p>
            <p className="mt-1 text-sm text-white/50">builders</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-green-400">
              <NumberTicker value={stats.projects} className="text-green-400" />
            </p>
            <p className="mt-1 text-sm text-white/50">projects</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-green-400">
              <NumberTicker value={stats.logs} className="text-green-400" />
            </p>
            <p className="mt-1 text-sm text-white/50">build logs</p>
          </div>
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
      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-6 py-20 sm:grid-cols-3">
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
      </section>

      {/* Bottom CTA */}
      <section className="flex flex-col items-center gap-6 px-6 pb-24 text-center">
        <h2 className="text-3xl font-bold">
          Wetin you dey build? <span className="text-green-500">Show us.</span>
        </h2>
        <SignedOut>
          <SignInButton mode="modal">
            <ShimmerButton
              background="rgba(22, 163, 74, 1)"
              shimmerColor="#ffffff"
              className="px-6 py-3 text-base font-semibold"
            >
              Join the community 💚
            </ShimmerButton>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <Link href="/builders">
            <ShimmerButton
              background="rgba(22, 163, 74, 1)"
              shimmerColor="#ffffff"
              className="px-6 py-3 text-base font-semibold"
            >
              Meet the builders 💚
            </ShimmerButton>
          </Link>
        </SignedIn>
      </section>

      <footer className="px-6 py-8 text-center text-sm text-white/50">
        Made with 🧡 by Nigerian builders, for Nigerian builders.
      </footer>
    </main>
  );
}
