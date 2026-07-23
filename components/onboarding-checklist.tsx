import Link from "next/link";
import { Check } from "lucide-react";
import type { Profile } from "@/lib/auth";

type Step = {
  key: "profile" | "project" | "log" | "engage";
  label: string;
  hint: string;
  href: string;
  cta: string;
  done: boolean;
};

// 4-step activation card on /dashboard. Each step auto-checks based on
// current data; if all 4 are done, this component is not rendered by the
// parent (clean dashboard for active users).
export function OnboardingChecklist({
  profile,
  projectCount,
  logCount,
  hasEngaged,
}: {
  profile: Profile;
  projectCount: number;
  logCount: number;
  hasEngaged: boolean;
}) {
  const steps: Step[] = [
    {
      key: "profile",
      label: "Set up your builder profile",
      hint: "Bio, location, tech stack — so others can find you.",
      href: "/onboarding",
      cta: profile.onboarded_at ? "Edit profile" : "Set up profile",
      done: profile.onboarded_at !== null,
    },
    {
      key: "project",
      label: "Add your first project",
      hint: "Show the community what you're shipping.",
      href: "/projects/new",
      cta: "Add project",
      done: projectCount > 0,
    },
    {
      key: "log",
      label: "Post your first build log",
      hint: "What did you ship or learn today?",
      href: projectCount > 0 ? "/feed" : "/projects/new",
      cta: logCount > 0 ? "Post another" : "Post log",
      done: logCount > 0,
    },
    {
      key: "engage",
      label: "Engage with the community",
      hint: "Like or comment on another builder's work.",
      href: "/feed",
      cta: "Browse feed",
      done: hasEngaged,
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;
  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-400/70">
            Get started
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.01em]">
            {doneCount} of {steps.length} done
          </h2>
        </div>
        <p className="text-xs text-white/40">{pct}% there</p>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-green-500/70 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ol className="mt-5 flex flex-col gap-3">
        {steps.map((s) => (
          <li key={s.key} className="flex items-start gap-3">
            <span
              className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border ${
                s.done
                  ? "border-green-500/50 bg-green-500/15 text-green-300"
                  : "border-white/15 text-white/35"
              }`}
              aria-hidden="true"
            >
              {s.done ? <Check className="size-3.5" /> : null}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm ${s.done ? "text-white/45 line-through" : "text-white/85"}`}
              >
                {s.label}
              </p>
              <p className="text-xs text-white/40">{s.hint}</p>
            </div>
            {!s.done ? (
              <Link
                href={s.href}
                className="shrink-0 self-center rounded-md border border-white/10 px-2.5 py-1 text-xs text-white/65 transition hover:border-green-500/40 hover:text-green-400"
              >
                {s.cta} →
              </Link>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
