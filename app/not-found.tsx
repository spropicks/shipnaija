import Link from "next/link";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <DotPattern
        className={cn(
          "opacity-40",
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
        )}
      />
      <p className="text-7xl">🧭</p>
      <h1 className="mt-6 text-5xl font-extrabold tracking-tight">
        4<span className="text-green-500">0</span>4
      </h1>
      <p className="mt-3 max-w-md text-white/60">
        Ah! This page never ship o. It might have been moved, deleted, or never
        existed in the first place.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
        <Link
          href="/"
          className="rounded-md bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-500"
        >
          Back home
        </Link>
        <Link
          href="/feed"
          className="rounded-md border border-white/15 px-4 py-2 font-medium text-white/80 transition hover:border-green-500/40 hover:text-white"
        >
          See what builders are shipping →
        </Link>
      </div>
    </main>
  );
}
