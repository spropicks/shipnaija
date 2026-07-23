"use client";

import { useActionState, useState } from "react";
import { completeOnboarding, skipOnboarding } from "@/app/actions/profile";
import { SubmitButton } from "@/components/ui/submit-button";
import { IDLE_STATE } from "@/lib/action-state";
import { TECH_STACK_PILLS, mergeStack } from "@/lib/tech-stack";

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
  // Track the *canonical* (cased) form of each picked tag so we submit the
  // right casing rather than the lowercased lookup key.
  const [picked, setPicked] = useState<string[]>(() => {
    // Drop the defaultStack values that aren't in the curated list (free-form
    // entries) — they aren't pills, so they don't need to be in `picked`.
    const inPills = new Set(
      TECH_STACK_PILLS.flatMap((g) => g.tags.map((t) => t.toLowerCase()))
    );
    return defaultStack.filter((t) => inPills.has(t.toLowerCase()));
  });
  const [stackInput, setStackInput] = useState(
    // Pre-fill the free-text input with any defaultStack tags that aren't pills
    // so the user sees their existing custom stack.
    defaultStack
      .filter(
        (t) =>
          !TECH_STACK_PILLS.flatMap((g) => g.tags)
            .map((p) => p.toLowerCase())
            .includes(t.toLowerCase())
      )
      .join(", ")
  );

  function toggle(tag: string) {
    setPicked((prev) => {
      const k = tag.toLowerCase();
      const idx = prev.findIndex((p) => p.toLowerCase() === k);
      if (idx >= 0) return prev.filter((_, i) => i !== idx);
      return [...prev, tag];
    });
  }

  const mergedStack = mergeStack(picked, stackInput);

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
          {TECH_STACK_PILLS.map((group) => (
            <div key={group.category}>
              <p className="text-xs font-medium text-white/40">{group.category}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {group.tags.map((tag) => {
                  const on = picked.some((p) => p.toLowerCase() === tag.toLowerCase());
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
