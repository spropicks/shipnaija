import { createServiceClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/auth";
import type { Project } from "@/lib/queries";
import type { FeedLog } from "@/lib/feed";
import type { Challenge } from "@/lib/challenges";

const DAY_MS = 24 * 60 * 60 * 1000;

export type DayActivity = {
  date: string; // YYYY-MM-DD (UTC)
  count: number;
};

export type ProjectWithActivity = Project & { logs_7d: number };

export type DashboardData = {
  shippedToday: boolean;
  logs7d: number;
  likesReceived7d: number;
  commentsReceived7d: number;
  activity14d: DayActivity[];
  projects: ProjectWithActivity[];
  recentLogs: FeedLog[];
  activeChallenge: Challenge | null;
  enteredChallenge: boolean;
};

function utcDay(iso: string): string {
  return iso.slice(0, 10);
}

export async function getDashboardData(me: Profile): Promise<DashboardData> {
  const supabase = createServiceClient();
  const now = Date.now();
  const since7d = new Date(now - 7 * DAY_MS).toISOString();
  const since14d = new Date(now - 14 * DAY_MS).toISOString();
  const todayUtc = new Date(now).toISOString().slice(0, 10);

  // My logs over the last 14 days (covers activity strip + 7d stats)
  const [logs14Res, projectsRes, activeChallengeRes] = await Promise.all([
    supabase
      .from("build_logs")
      .select("id, created_at")
      .eq("author_id", me.id)
      .gte("created_at", since14d),
    supabase
      .from("projects")
      .select("*")
      .eq("owner_id", me.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("challenges")
      .select("*")
      .lte("starts_at", new Date(now).toISOString())
      .gte("ends_at", new Date(now).toISOString())
      .order("starts_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const logs14 = logs14Res.data ?? [];
  const projects = (projectsRes.data as Project[]) ?? [];
  const activeChallenge = (activeChallengeRes.data as Challenge | null) ?? null;

  const logs7 = logs14.filter((l) => l.created_at >= since7d);
  const log7Ids = logs7.map((l) => l.id);

  // Engagement received on my last-7d logs + challenge entry check
  const [likesRes, commentsRes, entryRes, myProjectLogs7Res] = await Promise.all([
    log7Ids.length
      ? supabase
          .from("likes")
          .select("id", { count: "exact", head: true })
          .eq("target_type", "build_log")
          .in("target_id", log7Ids)
      : Promise.resolve({ count: 0 }),
    log7Ids.length
      ? supabase
          .from("comments")
          .select("id", { count: "exact", head: true })
          .eq("target_type", "build_log")
          .in("target_id", log7Ids)
      : Promise.resolve({ count: 0 }),
    activeChallenge
      ? supabase
          .from("challenge_entries")
          .select("id")
          .eq("challenge_id", activeChallenge.id)
          .eq("builder_id", me.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    projects.length
      ? supabase
          .from("build_logs")
          .select("id, project_id")
          .in("project_id", projects.map((p) => p.id))
          .gte("created_at", since7d)
      : Promise.resolve({ data: [] as { id: string; project_id: string }[] }),
  ]);

  // Activity strip: last 14 UTC days, oldest → newest
  const perDay = new Map<string, number>();
  for (const log of logs14) {
    const d = utcDay(log.created_at);
    perDay.set(d, (perDay.get(d) ?? 0) + 1);
  }
  const activity14d: DayActivity[] = [];
  for (let i = 13; i >= 0; i--) {
    const date = new Date(now - i * DAY_MS).toISOString().slice(0, 10);
    activity14d.push({ date, count: perDay.get(date) ?? 0 });
  }

  const projectLogCounts = new Map<string, number>();
  for (const row of myProjectLogs7Res.data ?? []) {
    projectLogCounts.set(row.project_id, (projectLogCounts.get(row.project_id) ?? 0) + 1);
  }

  // Recent logs with engagement counts (FeedLog shape, for BuildLogCard)
  const { data: recentRaw } = await supabase
    .from("build_logs")
    .select(
      "id, content, link_url, image_url, created_at, author_id, author:profiles!build_logs_author_id_fkey(handle, display_name, avatar_url, current_streak), project:projects!build_logs_project_id_fkey(slug, name)"
    )
    .eq("author_id", me.id)
    .order("created_at", { ascending: false })
    .limit(5);
  const recentIds = (recentRaw ?? []).map((l) => l.id);
  const [rLikes, rComments, rMine] = await Promise.all([
    recentIds.length
      ? supabase.from("likes").select("target_id").eq("target_type", "build_log").in("target_id", recentIds)
      : Promise.resolve({ data: [] as { target_id: string }[] }),
    recentIds.length
      ? supabase.from("comments").select("target_id").eq("target_type", "build_log").in("target_id", recentIds)
      : Promise.resolve({ data: [] as { target_id: string }[] }),
    recentIds.length
      ? supabase
          .from("likes")
          .select("target_id")
          .eq("target_type", "build_log")
          .eq("user_id", me.id)
          .in("target_id", recentIds)
      : Promise.resolve({ data: [] as { target_id: string }[] }),
  ]);
  const likeCounts = new Map<string, number>();
  for (const row of rLikes.data ?? []) {
    likeCounts.set(row.target_id, (likeCounts.get(row.target_id) ?? 0) + 1);
  }
  const commentCounts = new Map<string, number>();
  for (const row of rComments.data ?? []) {
    commentCounts.set(row.target_id, (commentCounts.get(row.target_id) ?? 0) + 1);
  }
  const mineSet = new Set((rMine.data ?? []).map((r) => r.target_id));
  const recentLogs: FeedLog[] = ((recentRaw ?? []) as unknown as Omit<
    FeedLog,
    "like_count" | "comment_count" | "liked_by_me"
  >[]).map((l) => ({
    ...l,
    like_count: likeCounts.get(l.id) ?? 0,
    comment_count: commentCounts.get(l.id) ?? 0,
    liked_by_me: mineSet.has(l.id),
  }));

  return {
    shippedToday: logs14.some((l) => utcDay(l.created_at) === todayUtc),
    logs7d: logs7.length,
    likesReceived7d: likesRes.count ?? 0,
    commentsReceived7d: commentsRes.count ?? 0,
    activity14d,
    projects: projects.map((p) => ({ ...p, logs_7d: projectLogCounts.get(p.id) ?? 0 })),
    recentLogs,
    activeChallenge,
    enteredChallenge: Boolean(entryRes.data),
  };
}
