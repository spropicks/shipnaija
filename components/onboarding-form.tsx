"use client";

import { useActionState } from "react";
import { claimProfile } from "@/app/actions/profile";
import { SubmitButton } from "@/components/ui/submit-button";
import { IDLE_STATE } from "@/lib/action-state";

const inputCls =
  "w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-green-500";

export function OnboardingForm({
  defaultHandle,
  defaultName,
}: {
  defaultHandle: string;
  defaultName: string;
}) {
  const [state, formAction] = useActionState(claimProfile, IDLE_STATE);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-white/70">Handle *</span>
        <div className="flex items-center gap-2">
          <span className="text-white/40">@</span>
          <input
            name="handle"
            defaultValue={defaultHandle}
            required
            minLength={3}
            maxLength={30}
            pattern="[A-Za-z0-9_-]+"
            aria-label="Choose your handle"
            placeholder="your_handle"
            className={inputCls}
          />
        </div>
        <span className="text-xs text-white/40">Letters, numbers, dashes and underscores.</span>
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="text-white/70">Display name</span>
        <input
          name="display_name"
          defaultValue={defaultName}
          maxLength={80}
          aria-label="Your display name"
          className={inputCls}
        />
      </label>
      {!state.ok && state.message ? (
        <p className="text-sm text-red-400" role="alert">
          {state.message}
        </p>
      ) : null}
      <SubmitButton
        pendingLabel="Creating…"
        className="mt-2 rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-500"
      >
        Create my profile 🚀
      </SubmitButton>
    </form>
  );
}
