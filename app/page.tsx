import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <span className="font-bold text-lg">
          Ship<span className="text-green-500">Naija</span>.dev
        </span>
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
            <UserButton />
          </SignedIn>
        </nav>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl">
          Build in public. <span className="text-green-500">Ship faster.</span>{" "}
          Naija style. 🇳🇬
        </h1>
        <p className="max-w-xl text-lg text-white/70">
          ShipNaija.dev is a community where Nigerian solo developers, indie
          hackers, and vibe coders share what they&apos;re building every day —
          and help each other ship.
        </p>
        <div className="flex gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-md bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-500">
                Start building in public
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/feed"
              className="rounded-md bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-500"
            >
              Go to the feed
            </Link>
          </SignedIn>
          <Link
            href="/projects"
            className="rounded-md border border-white/20 px-5 py-2.5 font-semibold hover:bg-white/10"
          >
            Explore projects
          </Link>
        </div>
      </section>

      <footer className="px-6 py-4 text-center text-sm text-white/50">
        Made with 🧡 by Nigerian builders, for Nigerian builders.
      </footer>
    </main>
  );
}
