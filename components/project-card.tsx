import Link from "next/link";
import type { Project } from "@/lib/queries";

const STATUS_STYLES: Record<Project["status"], string> = {
  building: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  launched: "bg-green-500/15 text-green-400 border-green-500/30",
  paused: "bg-white/10 text-white/50 border-white/20",
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-green-500/50 hover:bg-white/[0.05]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold">{project.name}</p>
          {project.tagline ? (
            <p className="line-clamp-2 text-sm text-white/60">{project.tagline}</p>
          ) : null}
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${STATUS_STYLES[project.status]}`}
        >
          {project.status}
        </span>
      </div>
      {project.tech_stack?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {project.tech_stack.slice(0, 5).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/60"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
      {project.owner ? (
        <p className="mt-auto text-xs text-white/50">
          by <span className="text-white/70">@{project.owner.handle}</span>
        </p>
      ) : null}
    </Link>
  );
}
