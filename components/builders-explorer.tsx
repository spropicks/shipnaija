"use client";

import { useMemo, useState } from "react";
import { BuilderCard } from "@/components/builder-card";
import type { Profile } from "@/lib/auth";

type Sort = "newest" | "streak" | "name";

const controlCls =
  "rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white/80 outline-none transition focus:border-green-500/40";

export function BuildersExplorer({ builders }: { builders: Profile[] }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = builders.filter((b) => {
      if (!term) return true;
      return (
        b.display_name.toLowerCase().includes(term) ||
        b.handle.toLowerCase().includes(term) ||
        (b.bio ?? "").toLowerCase().includes(term) ||
        (b.location ?? "").toLowerCase().includes(term) ||
        (b.tech_stack ?? []).some((t) => t.toLowerCase().includes(term))
      );
    });
    const sorted = [...list];
    if (sort === "name") sorted.sort((a, b) => a.display_name.localeCompare(b.display_name));
    else if (sort === "streak")
      sorted.sort((a, b) => (b.current_streak ?? 0) - (a.current_streak ?? 0));
    else sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
    return sorted;
  }, [builders, q, sort]);

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search builders, handles, tech, location…"
          aria-label="Search builders"
          className={`${controlCls} sm:flex-1`}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          aria-label="Sort builders"
          className={controlCls}
        >
          <option value="newest">Newest</option>
          <option value="streak">Top streak</option>
          <option value="name">A–Z</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-sm text-white/45">No builders match your search.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <BuilderCard key={b.id} profile={b} />
          ))}
        </div>
      )}
      <p className="mt-4 text-xs text-white/30">
        Showing {filtered.length} of {builders.length}
      </p>
    </div>
  );
}
