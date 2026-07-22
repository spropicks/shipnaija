import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { getCurrentProfile } from "@/lib/auth";

export async function SiteHeader() {
  const profile = await getCurrentProfile();
  return (
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
      <Link href="/" className="font-extrabold tracking-tight">
        Ship<span className="text-green-500">Naija</span>.dev
      </Link>
      <nav className="flex items-center gap-4 text-sm">
        <Link href="/feed" className="hover:text-green-400">Feed</Link>
        <Link href="/projects" className="hover:text-green-400">Projects</Link>
        <Link href="/builders" className="hover:text-green-400">Builders</Link>
        <Link href="/challenges" className="hover:text-green-400">Challenges</Link>
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
    </header>
  );
}
