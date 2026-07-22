import { createBuildLog } from "@/app/actions/build-logs";
import type { Project } from "@/lib/queries";

export function LogComposer({
  projects,
  redirectTo = "/feed",
}: {
  projects: Project[];
  redirectTo?: string;
}) {
  return (
    <form
      action={createBuildLog}
      className="flex flex-col gap-3 rounded-xl border border-green-500/20 bg-green-500/[0.04] p-5"
    >
      <p className="text-sm font-medium text-green-400">Wetin you ship today? 🚢</p>
      <input type="hidden" name="redirect_to" value={redirectTo} />
      <textarea
        name="content"
        rows={3}
        required
        maxLength={1000}
        placeholder="Shipped dark mode, fixed the auth bug, deployed v0.2..."
        className="w-full rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-green-500"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select
          name="project_id"
          required
          className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-green-500"
          defaultValue={projects.length === 1 ? projects[0].id : ""}
        >
          <option value="" disabled>
            Select project…
          </option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          name="link_url"
          type="url"
          placeholder="Link (optional)"
          className="min-w-0 flex-1 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-green-500"
        />
        <input
          name="image_url"
          type="url"
          placeholder="Screenshot URL (optional)"
          className="min-w-0 flex-1 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-green-500"
        />
        <button
          type="submit"
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
        >
          Post log
        </button>
      </div>
    </form>
  );
}
