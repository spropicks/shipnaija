"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/lib/queries";

const STATUSES = ["all", "building", "launched", "paused"] as const;
type Status = (typeof STATUSES)[number];
type Sort = "newest" | "oldest" | "name";

const controlCls =
  "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 outline-none transition focus:border-green-500/40";

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<Status>("all");
  const [sort, setSort] = useState<Sort>("newest");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = projects.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (!term) return true;
      return (
        p.name.toLowerCase().includes(term) ||
        (p.tagline ?? "").toLowerCase().includes(term) ||
        (p.tech_stack ?? []).some((t) => t.toLowerCase().includes(term))
      );
    });
    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "oldest") sorted.sort((a, b) => a.created_at.localeCompare(b.created_at));
    else sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
    return sorted;
  }, [projects, q, status, sort]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search projects, taglines, tech…"
          aria-label="Search projects"
          className={`${controlCls} sm:flex-1`}
        />
        <div className="flex gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            aria-label="Filter by status"
            className={controlCls}
          >
            <option value="all">All statuses</option>
            <option value="building">Building</option>
            <option value="launched">Launched</option>
            <option value="paused">Paused</option>
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label="Sort projects"
            className={controlCls}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="name">A–Z</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-white/45">No projects match your filters.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
      <p className="mt-4 text-xs text-white/30">
        Showing {filtered.length} of {projects.length}
      </p>
    </div>
  );
}
