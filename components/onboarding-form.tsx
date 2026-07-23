"use client";

import { useActionState, useState } from "react";
import { completeOnboarding, skipOnboarding } from "@/app/actions/profile";
import { SubmitButton } from "@/components/ui/submit-button";
import { IDLE_STATE } from "@/lib/action-state";

// Curated quick-pick tech stack. Reused from profile-edit later if desired.
const STACK_PILLS: { category: string; tags: string[] }[] = [
  {
    category: "Frontend",
    tags: ["TypeScript", "JavaScript", "Next.js", "React", "Vue", "Svelte", "Tailwind"],
  },
  {
    category: "Backend",
    tags: ["Node.js", "Python", "Go", "Rust", "PHP", "Laravel"],
  },
  {
    category: "Mobile",
    tags: ["React Native", "Flutter", "Swift", "Kotlin"],
  },
  {
    category: "Infra / Data",
    tags: ["Postgres", "Supabase", "Firebase", "AWS", "Vercel", "Docker", "GraphQL"],
  },
];

const inputCls =
  "w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-green-500";
const labelCls = "flex flex-col gap-1.5 text-sm";

export function OnboardingForm({
  defaultName = "",
  defaultBio = "",
  defaultLocation = "",
  defaultStack = [] as string[],
}: {
  defaultName?: string;
  defaultBio?: string;
  defaultLocation?: string;
  defaultStack?: string[];
}) {
  const [state, formAction] = useActionState(completeOnboarding, IDLE_STATE);
  const [picked, setPicked] = useState<Set<string>>(
    () => new Set(defaultStack.map((s) => s.toLowerCase()))
  );
  const [stackInput, setStackInput] = useState("");

  function toggle(tag: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      const k = tag.toLowerCase();
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  // Merge picked pills + free-text, deduped (case-insensitive), capped at 12.
  const mergedStack = (() => {
    const all = new Set(picked);
    for (const t of stackInput.split(",").map((s) => s.trim()).filter(Boolean)) {
      all.add(t.toLowerCase());
    }
    return Array.from(all).slice(0, 12);
  })();

  return (
    <form action={formAction} className="mt-10 flex flex-col gap-10">
      {/* Hidden field mirrors the merged stack for the action to read. */}
      <input type="hidden" name="tech_stack" value={mergedStack.join(", ")} />

      {/* Section 1: About you */}
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-400/70">
          About you
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          <label className={labelCls}>
            <span className="text-white/70">Display name</span>
            <input
              name="display_name"
              defaultValue={defaultName}
              maxLength={80}
              aria-label="Display name"
              className={inputCls}
              placeholder="Ada Lovelace"
            />
          </label>
          <label className={labelCls}>
            <span className="text-white/70">Bio</span>
            <textarea
              name="bio"
              defaultValue={defaultBio}
              maxLength={280}
              rows={3}
              aria-label="Short bio"
              className={inputCls}
              placeholder="One sentence on what you're building."
            />
          </label>
          <label className={labelCls}>
            <span className="text-white/70">Location</span>
            <input
              name="location"
              defaultValue={defaultLocation}
              maxLength={80}
              aria-label="Location"
              className={inputCls}
              placeholder="Lagos, Nigeria"
            />
          </label>
        </div>
      </section>

      {/* Section 2: What you build */}
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-400/70">
          What you build
        </h2>
        <p className="mt-2 text-sm text-white/45">
          Pick a few quick tags. You can add custom ones below.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          {STACK_PILLS.map((group) => (
            <div key={group.category}>
              <p className="text-xs font-medium text-white/40">{group.category}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {group.tags.map((tag) => {
                  const on = picked.has(tag.toLowerCase());
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggle(tag)}
                      aria-pressed={on}
                      className={`rounded-full border px-3 py-1 text-xs transition ${
                        on
                          ? "border-green-500/60 bg-green-500/10 text-green-300"
                          : "border-white/10 text-white/55 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <input
          value={stackInput}
          onChange={(e) => setStackInput(e.target.value)}
          aria-label="Additional tech tags"
          placeholder="Others (comma separated)"
          className={`${inputCls} mt-4`}
        />
        {mergedStack.length > 0 ? (
          <p className="mt-2 text-xs text-white/40">
            {mergedStack.length} tag{mergedStack.length === 1 ? "" : "s"} selected
          </p>
        ) : null}
      </section>

      {/* Section 3: Links */}
      <section>
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-400/70">
          Links
        </h2>
        <div className="mt-4 flex flex-col gap-4">
          <label className={labelCls}>
            <span className="text-white/70">X / Twitter</span>
            <input
              name="twitter_url"
              type="url"
              aria-label="X / Twitter URL"
              className={inputCls}
              placeholder="https://x.com/you"
            />
          </label>
          <label className={labelCls}>
            <span className="text-white/70">GitHub</span>
            <input
              name="github_url"
              type="url"
              aria-label="GitHub URL"
              className={inputCls}
              placeholder="https://github.com/you"
            />
          </label>
          <label className={labelCls}>
            <span className="text-white/70">Website</span>
            <input
              name="website_url"
              type="url"
              aria-label="Website URL"
              className={inputCls}
              placeholder="https://you.dev"
            />
          </label>
        </div>
      </section>

      {!state.ok && state.message ? (
        <p className="text-sm text-red-400" role="alert">
          {state.message}
        </p>
      ) : null}

      {/* Action row */}
      <div className="flex flex-col items-stretch gap-3 border-t border-white/[0.07] pt-8 sm:flex-row sm:items-center sm:justify-between">
        <SubmitButton
          pendingLabel="Saving…"
          className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-green-100"
        >
          Save & ship my first project 🚢
        </SubmitButton>
        <form action={skipOnboarding}>
          <button
            type="submit"
            className="text-sm text-white/45 transition hover:text-white"
          >
            Skip for now →
          </button>
        </form>
      </div>
    </form>
  );
}
