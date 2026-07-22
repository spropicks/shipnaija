import { createServiceClient } from "@/lib/supabase/server";

export type TrendingBuilder = {
  id: string;
  handle: string;
  display_name: string;
  avatar_url: string | null;
  current_streak: number;
  logs_7d: number;
  likes_7d: number;
  score: number;
};

export type TrendingProject = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  status: string;
  owner: { handle: string; display_name: string } | null;
  logs_7d: number;
  likes_7d: number;
  score: number;
};

const WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

// Trending score (last 7 days):
//   builders: logs*2 + likes received*1 + current_streak*3
//   projects: logs*2 + likes received*1
export async function getTrending(): Promise<{
  builders: TrendingBuilder[];
  projects: TrendingProject[];
}> {
  const supabase = createServiceClient();
  const since = new Date(Date.now() - WINDOW_MS).toISOString();

  const { data: logs } = await supabase
    .from("build_logs")
    .select("id, author_id, project_id")
    .gte("created_at", since);

  const logIds = (logs ?? []).map((l) => l.id);
  const { data: likes } = logIds.length
    ? await supabase
        .from("likes")
        .select("target_id")
        .eq("target_type", "build_log")
        .in("target_id", logIds)
        .gte("created_at", since)
    : { data: [] as { target_id: string }[] };

  const likesPerLog = new Map<string, number>();
  for (const row of likes ?? []) {
    likesPerLog.set(row.target_id, (likesPerLog.get(row.target_id) ?? 0) + 1);
  }

  const builderStats = new Map<string, { logs: number; likes: number }>();
  const projectStats = new Map<string, { logs: number; likes: number }>();
  for (const log of logs ?? []) {
    const likeCount = likesPerLog.get(log.id) ?? 0;
    const b = builderStats.get(log.author_id) ?? { logs: 0, likes: 0 };
    b.logs += 1;
    b.likes += likeCount;
    builderStats.set(log.author_id, b);
    const p = projectStats.get(log.project_id) ?? { logs: 0, likes: 0 };
    p.logs += 1;
    p.likes += likeCount;
    projectStats.set(log.project_id, p);
  }

  const [profilesRes, projectsRes] = await Promise.all([
    builderStats.size
      ? supabase
          .from("profiles")
          .select("id, handle, display_name, avatar_url, current_streak")
          .in("id", [...builderStats.keys()])
      : Promise.resolve({ data: [] }),
    projectStats.size
      ? supabase
          .from("projects")
          .select(
            "id, slug, name, tagline, status, owner:profiles!projects_owner_id_fkey(handle, display_name)"
          )
          .in("id", [...projectStats.keys()])
      : Promise.resolve({ data: [] }),
  ]);

  const builders: TrendingBuilder[] = ((profilesRes.data ?? []) as {
    id: string;
    handle: string;
    display_name: string;
    avatar_url: string | null;
    current_streak: number;
  }[])
    .map((p) => {
      const s = builderStats.get(p.id) ?? { logs: 0, likes: 0 };
      return {
        ...p,
        logs_7d: s.logs,
        likes_7d: s.likes,
        score: s.logs * 2 + s.likes + (p.current_streak ?? 0) * 3,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  const projects: TrendingProject[] = ((projectsRes.data ?? []) as unknown as {
    id: string;
    slug: string;
    name: string;
    tagline: string | null;
    status: string;
    owner: { handle: string; display_name: string } | null;
  }[])
    .map((p) => {
      const s = projectStats.get(p.id) ?? { logs: 0, likes: 0 };
      return { ...p, logs_7d: s.logs, likes_7d: s.likes, score: s.logs * 2 + s.likes };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);

  return { builders, projects };
}
