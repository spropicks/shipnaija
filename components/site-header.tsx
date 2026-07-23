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

function Brand() {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="ShipNaija home">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt="ShipNaija"
        width={32}
        height={32}
        className="size-8 shrink-0 object-contain transition-transform group-hover:scale-105"
      />
      <span className="text-[15px] font-semibold tracking-[-0.02em] text-white">
        ShipNaija<span className="text-green-400">.</span>
      </span>
    </Link>
  );
}

export async function SiteHeader() {
  const profile = await getCurrentProfile();

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between rounded-2xl border border-white/[0.09] bg-[#0a0b0a]/80 px-3 shadow-[0_12px_50px_-18px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:px-4">
        <Brand />

        <nav className="hidden items-center rounded-full border border-white/[0.06] bg-white/[0.025] p-1 text-[13px] lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-1.5 text-white/55 transition-all hover:bg-white/[0.06] hover:text-white"
            >
              {link.label}
            </Link>
          ))}
          <SignedIn>
            <Link
              href="/dashboard"
              className="rounded-full px-3.5 py-1.5 text-white/55 transition-all hover:bg-white/[0.06] hover:text-white"
            >
              Dashboard
            </Link>
          </SignedIn>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-full px-3.5 py-2 text-[13px] font-medium text-white/60 transition-colors hover:text-white">
                Sign in
              </button>
            </SignInButton>
            <SignInButton mode="modal">
              <button className="group inline-flex items-center gap-1.5 rounded-[10px] bg-white px-4 py-2 text-[13px] font-semibold text-black transition-all hover:bg-green-100">
                Start shipping
                <span className="transition-transform group-hover:translate-x-0.5">↗</span>
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            {profile ? (
              <Link
                href={`/builders/${profile.handle}`}
                className="rounded-full px-3 py-2 text-[13px] text-white/55 hover:text-white"
              >
                @{profile.handle}
              </Link>
            ) : null}
            <Link
              href="/projects/new"
              className="rounded-[10px] bg-white px-4 py-2 text-[13px] font-semibold text-black transition-colors hover:bg-green-100"
            >
              + New project
            </Link>
            <UserButton />
          </SignedIn>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-[9px] bg-white px-3.5 py-2 text-xs font-semibold text-black">
                Join free
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

          <details className="group relative">
            <summary
              aria-label="Open navigation"
              className="grid size-9 cursor-pointer list-none place-items-center rounded-[9px] border border-white/10 text-white/70 transition-colors hover:bg-white/[0.06] [&::-webkit-details-marker]:hidden"
            >
              <span className="flex w-4 flex-col gap-1">
                <span className="h-px w-4 bg-current" />
                <span className="h-px w-4 bg-current" />
                <span className="h-px w-4 bg-current" />
              </span>
            </summary>
            <nav className="absolute right-0 mt-2 flex w-60 flex-col rounded-2xl border border-white/10 bg-[#0d0e0d]/95 p-2 text-sm shadow-2xl backdrop-blur-xl">
              <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                Explore ShipNaija
              </p>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-2.5 text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <SignedIn>
                <Link href="/dashboard" className="rounded-xl px-3 py-2.5 text-white/65 hover:bg-white/[0.06] hover:text-white">
                  Dashboard
                </Link>
                {profile ? (
                  <Link href={`/builders/${profile.handle}`} className="rounded-xl px-3 py-2.5 text-white/45 hover:bg-white/[0.06] hover:text-white">
                    @{profile.handle}
                  </Link>
                ) : null}
                <Link href="/projects/new" className="mt-1 rounded-xl bg-white px-3 py-2.5 text-center font-semibold text-black">
                  + New project
                </Link>
              </SignedIn>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
