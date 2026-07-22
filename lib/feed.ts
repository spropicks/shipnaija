import { createServiceClient } from "@/lib/supabase/server";

export type FeedLog = {
  id: string;
  content: string;
  link_url: string | null;
  image_url: string | null;
  created_at: string;
  author_id: string;
  author: { handle: string; display_name: string; avatar_url: string | null; current_streak: number };
  project: { slug: string; name: string };
  like_count: number;
  comment_count: number;
  liked_by_me: boolean;
};

export type LogComment = {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  author: { handle: string; display_name: string; avatar_url: string | null };
};

const LOG_SELECT =
  "id, content, link_url, image_url, created_at, author_id, author:profiles!build_logs_author_id_fkey(handle, display_name, avatar_url, current_streak), project:projects!build_logs_project_id_fkey(slug, name)";

type RawLog = Omit<FeedLog, "like_count" | "comment_count" | "liked_by_me">;

async function hydrateLogs(logs: RawLog[], viewerId: string | null): Promise<FeedLog[]> {
  if (!logs.length) return [];
  const supabase = createServiceClient();
  const ids = logs.map((l) => l.id);
  const [likesRes, commentsRes, myLikesRes] = await Promise.all([
    supabase.from("likes").select("target_id").eq("target_type", "build_log").in("target_id", ids),
    supabase.from("comments").select("target_id").eq("target_type", "build_log").in("target_id", ids),
    viewerId
      ? supabase
          .from("likes")
          .select("target_id")
          .eq("target_type", "build_log")
          .eq("user_id", viewerId)
          .in("target_id", ids)
      : Promise.resolve({ data: [] as { target_id: string }[] }),
  ]);

  const likeCounts = new Map<string, number>();
  for (const row of likesRes.data ?? []) {
    likeCounts.set(row.target_id, (likeCounts.get(row.target_id) ?? 0) + 1);
  }
  const commentCounts = new Map<string, number>();
  for (const row of commentsRes.data ?? []) {
    commentCounts.set(row.target_id, (commentCounts.get(row.target_id) ?? 0) + 1);
  }
  const mine = new Set((myLikesRes.data ?? []).map((r) => r.target_id));

  return logs.map((l) => ({
    ...l,
    like_count: likeCounts.get(l.id) ?? 0,
    comment_count: commentCounts.get(l.id) ?? 0,
    liked_by_me: mine.has(l.id),
  }));
}

export async function listFeed(viewerId: string | null, limit = 50): Promise<FeedLog[]> {
  const supabase = createServiceClient();
  const { data: logs } = await supabase
    .from("build_logs")
    .select(LOG_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);
  return hydrateLogs(((logs ?? []) as unknown) as RawLog[], viewerId);
}

export async function listProjectFeed(
  projectId: string,
  viewerId: string | null,
  limit = 30
): Promise<FeedLog[]> {
  const supabase = createServiceClient();
  const { data: logs } = await supabase
    .from("build_logs")
    .select(LOG_SELECT)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return hydrateLogs(((logs ?? []) as unknown) as RawLog[], viewerId);
}

export async function listAuthorFeed(
  authorId: string,
  viewerId: string | null,
  limit = 10
): Promise<FeedLog[]> {
  const supabase = createServiceClient();
  const { data: logs } = await supabase
    .from("build_logs")
    .select(LOG_SELECT)
    .eq("author_id", authorId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return hydrateLogs(((logs ?? []) as unknown) as RawLog[], viewerId);
}

export async function getLog(id: string, viewerId: string | null): Promise<FeedLog | null> {
  const supabase = createServiceClient();
  const { data: log } = await supabase
    .from("build_logs")
    .select(LOG_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (!log) return null;
  const [hydrated] = await hydrateLogs([(log as unknown) as RawLog], viewerId);
  return hydrated ?? null;
}

export async function getProjectEngagement(
  projectId: string,
  viewerId: string | null
): Promise<{ like_count: number; liked_by_me: boolean }> {
  const supabase = createServiceClient();
  const [likesRes, myLikeRes] = await Promise.all([
    supabase
      .from("likes")
      .select("id", { count: "exact", head: true })
      .eq("target_type", "project")
      .eq("target_id", projectId),
    viewerId
      ? supabase
          .from("likes")
          .select("id")
          .eq("target_type", "project")
          .eq("target_id", projectId)
          .eq("user_id", viewerId)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);
  return {
    like_count: likesRes.count ?? 0,
    liked_by_me: Boolean(myLikeRes.data),
  };
}

export async function getComments(targetType: string, targetId: string): Promise<LogComment[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("comments")
    .select(
      "id, content, created_at, author_id, author:profiles!comments_author_id_fkey(handle, display_name, avatar_url)"
    )
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .order("created_at", { ascending: true });
  return (data as unknown as LogComment[]) ?? [];
}
