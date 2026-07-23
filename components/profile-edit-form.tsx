"use client";

import { useActionState, useState } from "react";
import { updateProfile } from "@/app/actions/profile";
import { SubmitButton } from "@/components/ui/submit-button";
import { IDLE_STATE } from "@/lib/action-state";
import { TECH_STACK_PILLS, mergeStack } from "@/lib/tech-stack";
import type { Profile } from "@/lib/auth";

const inputCls =
  "w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-green-500";
const labelCls = "flex flex-col gap-1.5 text-sm";

// Client form for /profile/edit. Mirrors the previous server-rendered form
// field-for-field, but uses the shared tech-stack pill picker (same UX as
// the onboarding form) and the typed-action pending/error pattern.
export function ProfileEditForm({ profile }: { profile: Profile }) {
  const [state, formAction] = useActionState(updateProfile, IDLE_STATE);
  const inPills = new Set(TECH_STACK_PILLS.flatMap((g) => g.tags.map((t) => t.toLowerCase())));
  const existingPicked = (profile.tech_stack ?? []).filter((t) => inPills.has(t.toLowerCase()));
  const existingCustom = (profile.tech_stack ?? []).filter((t) => !inPills.has(t.toLowerCase()));

  const [picked, setPicked] = useState<string[]>(existingPicked);
  const [stackInput, setStackInput] = useState(existingCustom.join(", "));

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
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <input type="hidden" name="tech_stack" value={mergedStack.join(", ")} />

      <label className={labelCls}>
        <span className="text-white/70">Display name *</span>
        <input
          name="display_name"
          defaultValue={profile.display_name}
          required
          maxLength={80}
          className={inputCls}
        />
      </label>

      <label className={labelCls}>
        <span className="text-white/70">Bio</span>
        <textarea
          name="bio"
          defaultValue={profile.bio ?? ""}
          maxLength={280}
          rows={3}
          className={inputCls}
        />
      </label>

      <label className={labelCls}>
        <span className="text-white/70">Location</span>
        <input
          name="location"
          defaultValue={profile.location ?? ""}
          maxLength={80}
          className={inputCls}
          placeholder="Lagos, Nigeria"
        />
      </label>

      {/* Tech stack — quick-pick pills + custom merge */}
      <div className={labelCls}>
        <span className="text-white/70">Tech stack</span>
        <div className="mt-2 flex flex-col gap-3">
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
          className={`${inputCls} mt-3`}
        />
        {mergedStack.length > 0 ? (
          <p className="mt-2 text-xs text-white/40">
            {mergedStack.length} tag{mergedStack.length === 1 ? "" : "s"} selected
          </p>
        ) : null}
      </div>

      <label className={labelCls}>
        <span className="text-white/70">X / Twitter</span>
        <input
          name="twitter_url"
          type="url"
          defaultValue={profile.twitter_url ?? ""}
          className={inputCls}
        />
      </label>

      <label className={labelCls}>
        <span className="text-white/70">GitHub</span>
        <input
          name="github_url"
          type="url"
          defaultValue={profile.github_url ?? ""}
          className={inputCls}
        />
      </label>

      <label className={labelCls}>
        <span className="text-white/70">Website</span>
        <input
          name="website_url"
          type="url"
          defaultValue={profile.website_url ?? ""}
          className={inputCls}
        />
      </label>

      {!state.ok && state.message ? (
        <p className="text-sm text-red-400" role="alert">
          {state.message}
        </p>
      ) : null}

      <SubmitButton
        pendingLabel="Saving…"
        className="mt-2 rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-500 disabled:opacity-60"
      >
        Save changes
      </SubmitButton>
    </form>
  );
}
