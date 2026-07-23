"use client";

import { useActionState } from "react";
import { Link2, ImageIcon, Send } from "lucide-react";
import { createBuildLog } from "@/app/actions/build-logs";
import { SubmitButton } from "@/components/ui/submit-button";
import { IDLE_STATE } from "@/lib/action-state";
import type { Project } from "@/lib/queries";

export function LogComposer({
  projects,
  redirectTo = "/feed",
  variant = "default",
}: {
  projects: Project[];
  redirectTo?: string;
  variant?: "default" | "dashboard";
}) {
  const dashboard = variant === "dashboard";
  const [state, formAction] = useActionState(createBuildLog, IDLE_STATE);

  return (
    <form
      action={formAction}
      className={
        dashboard
          ? "rounded-xl border border-white/[0.065] bg-black/15 p-3 sm:p-4"
          : "flex flex-col gap-3 rounded-xl border border-green-500/20 bg-green-500/[0.04] p-5"
      }
    >
      {!dashboard ? (
        <p className="text-sm font-medium text-green-400">Wetin you ship today? 🚢</p>
      ) : null}
      <input type="hidden" name="redirect_to" value={redirectTo} />
      <textarea
        name="content"
        rows={dashboard ? 4 : 3}
        required
        maxLength={1000}
        aria-label="Build log content"
        placeholder="What changed today? Shipped a feature, fixed a bug, learned something..."
        className={
          dashboard
            ? "w-full resize-none bg-transparent px-1 py-1 text-base leading-6 text-white/75 outline-none placeholder:text-white/20 sm:text-sm"
            : "w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-green-500"
        }
      />
      <div className={dashboard ? "mt-3 grid gap-2 border-t border-white/[0.06] pt-3 lg:grid-cols-[.8fr_1fr_1fr_auto]" : "flex flex-wrap items-center gap-3"}>
        <select
          name="project_id"
          required
          aria-label="Select a project"
          className={
            dashboard
              ? "min-w-0 rounded-lg border border-white/[0.08] bg-[#101210] px-3 py-2.5 text-base text-white/55 outline-none focus:border-green-400/30 sm:text-xs"
              : "rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-green-500"
          }
          defaultValue={projects.length === 1 ? projects[0].id : ""}
        >
          <option value="" disabled>Select project…</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
        <label className={dashboard ? "flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#101210] px-3" : "contents"}>
          {dashboard ? <Link2 className="size-3.5 shrink-0 text-white/20" /> : null}
          <input
            name="link_url"
            type="url"
            aria-label="Link URL (optional)"
            placeholder="Link (optional)"
            className={
              dashboard
                ? "min-w-0 flex-1 bg-transparent py-2.5 text-base text-white/55 outline-none placeholder:text-white/20 sm:text-xs"
                : "min-w-0 flex-1 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-green-500"
            }
          />
        </label>
        <label className={dashboard ? "flex min-w-0 items-center gap-2 rounded-lg border border-white/[0.08] bg-[#101210] px-3" : "contents"}>
          {dashboard ? <ImageIcon className="size-3.5 shrink-0 text-white/20" /> : null}
          <input
            name="image_url"
            type="url"
            aria-label="Screenshot URL (optional)"
            placeholder="Screenshot URL"
            className={
              dashboard
                ? "min-w-0 flex-1 bg-transparent py-2.5 text-base text-white/55 outline-none placeholder:text-white/20 sm:text-xs"
                : "min-w-0 flex-1 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-green-500"
            }
          />
        </label>
        <SubmitButton
          pendingLabel="Posting…"
          className={
            dashboard
              ? "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-green-100 lg:w-auto lg:py-2.5 lg:text-xs"
              : "rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
          }
        >
          {dashboard ? <Send className="size-3.5" /> : null}
          Post log
        </SubmitButton>
      </div>
      {!state.ok && state.message ? (
        <p className="mt-2 text-xs text-red-400" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

