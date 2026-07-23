import Link from "next/link";
import { skipOnboarding } from "@/app/actions/profile";

// Green-bordered welcome card shown on /dashboard for users with
// onboarded_at = null. Has two actions: complete the flow (primary) or
// skip (stamps onboarded_at and revalidates).
export function OnboardingBanner() {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-green-500/25 bg-green-500/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-400/70">
          Welcome to ShipNaija 🚢
        </p>
        <p className="mt-1 text-sm text-white/80">
          Set up your builder profile so others can find you and follow your work.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
        <Link
          href="/onboarding"
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-green-100"
        >
          Complete setup →
        </Link>
        <form action={skipOnboarding}>
          <button
            type="submit"
            className="rounded-lg border border-white/10 px-3 py-2 text-xs text-white/50 transition hover:border-white/25 hover:text-white"
          >
            Skip for now
          </button>
        </form>
      </div>
    </div>
  );
}
