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
    <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6">
      <Link href="/" className="shrink-0 font-extrabold tracking-tight">
        Ship<span className="text-green-500">Naija</span>.dev
      </Link>

      {/* Desktop nav */}
      <nav className="hidden items-center gap-4 text-sm md:flex">
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-green-400">
            {l.label}
          </Link>
        ))}
        <SignedIn>
          <Link href="/dashboard" className="hover:text-green-400">
            Dashboard
          </Link>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="rounded-md bg-green-600 px-3 py-1.5 font-medium text-white hover:bg-green-500">
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          {profile ? (
            <Link
              href={`/builders/${profile.handle}`}
              className="text-white/70 hover:text-green-400"
            >
              @{profile.handle}
            </Link>
          ) : null}
          <Link
            href="/projects/new"
            className="rounded-md bg-green-600 px-3 py-1.5 font-medium text-white hover:bg-green-500"
          >
            + Project
          </Link>
          <UserButton />
        </SignedIn>
      </nav>

      {/* Mobile nav (no-JS dropdown via <details>) */}
      <div className="flex items-center gap-3 md:hidden">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-500">
              Sign in
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <details className="relative">
          <summary className="flex cursor-pointer select-none items-center rounded-md border border-white/15 px-3 py-1.5 text-sm text-white/80 [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <nav className="absolute right-0 z-50 mt-2 flex w-48 flex-col rounded-xl border border-white/10 bg-[#111111] p-2 text-sm shadow-2xl">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 hover:bg-white/5 hover:text-green-400"
              >
                {l.label}
              </Link>
            ))}
            <SignedIn>
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 hover:bg-white/5 hover:text-green-400"
              >
                Dashboard
              </Link>
              {profile ? (
                <Link
                  href={`/builders/${profile.handle}`}
                  className="rounded-lg px-3 py-2 text-white/70 hover:bg-white/5 hover:text-green-400"
                >
                  @{profile.handle}
                </Link>
              ) : null}
              <Link
                href="/projects/new"
                className="mt-1 rounded-lg bg-green-600 px-3 py-2 text-center font-medium text-white hover:bg-green-500"
              >
                + Project
              </Link>
            </SignedIn>
          </nav>
        </details>
      </div>
    </header>
  );
}
