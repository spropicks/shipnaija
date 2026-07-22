import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { getCurrentProfile } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/feed", label: "Feed" },
  { href: "/projects", label: "Projects" },
  { href: "/builders", label: "Builders" },
  { href: "/trending", label: "Trending" },
  { href: "/challenges", label: "Challenges" },
];

export async function SiteHeader() {
  const profile = await getCurrentProfile();
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#0a0a0a]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 font-bold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-lg border border-green-500/30 bg-green-500/10 text-base shadow-[0_0_20px_-4px_rgba(22,163,74,0.5)]">
            🚢
          </span>
          <span className="text-[15px]">
            Ship<span className="text-green-400">Naija</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 text-sm md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              {l.label}
            </Link>
          ))}
          <SignedIn>
            <Link
              href="/dashboard"
              className="rounded-full px-3.5 py-1.5 text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              Dashboard
            </Link>
          </SignedIn>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2.5 md:flex">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-full px-4 py-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white">
                Sign in
              </button>
            </SignInButton>
            <SignInButton mode="modal">
              <button className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition-all hover:bg-white/85 hover:shadow-[0_0_24px_-6px_rgba(255,255,255,0.6)]">
                Start shipping
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            {profile ? (
              <Link
                href={`/builders/${profile.handle}`}
                className="text-sm text-white/60 transition-colors hover:text-green-400"
              >
                @{profile.handle}
              </Link>
            ) : null}
            <Link
              href="/projects/new"
              className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-black transition-all hover:bg-white/85 hover:shadow-[0_0_24px_-6px_rgba(255,255,255,0.6)]"
            >
              + Project
            </Link>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile nav (no-JS dropdown via <details>) */}
        <div className="flex items-center gap-3 md:hidden">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-black">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <details className="relative">
            <summary className="flex cursor-pointer select-none items-center rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/[0.06] [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <nav className="absolute right-0 z-50 mt-2 flex w-52 flex-col rounded-2xl border border-white/10 bg-[#0d0d0d] p-2 text-sm shadow-2xl shadow-black/60">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-xl px-3 py-2 text-white/70 hover:bg-white/[0.06] hover:text-white"
                >
                  {l.label}
                </Link>
              ))}
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="rounded-xl px-3 py-2 text-white/70 hover:bg-white/[0.06] hover:text-white"
                >
                  Dashboard
                </Link>
                {profile ? (
                  <Link
                    href={`/builders/${profile.handle}`}
                    className="rounded-xl px-3 py-2 text-white/50 hover:bg-white/[0.06] hover:text-white"
                  >
                    @{profile.handle}
                  </Link>
                ) : null}
                <Link
                  href="/projects/new"
                  className="mt-1 rounded-xl bg-white px-3 py-2 text-center font-semibold text-black hover:bg-white/85"
                >
                  + Project
                </Link>
              </SignedIn>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
