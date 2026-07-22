"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-7xl">🔧</p>
      <h1 className="mt-6 text-3xl font-bold">Something went wrong</h1>
      <p className="mt-3 max-w-md text-white/60">
        No wahala — it&apos;s us, not you. Try again, and if it keeps
        happening, check back in a few minutes.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs text-white/30">Error ref: {error.digest}</p>
      ) : null}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm">
        <button
          onClick={reset}
          className="rounded-md bg-green-600 px-4 py-2 font-medium text-white transition hover:bg-green-500"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-md border border-white/15 px-4 py-2 font-medium text-white/80 transition hover:border-green-500/40 hover:text-white"
        >
          Back home
        </Link>
      </div>
    </main>
  );
}
