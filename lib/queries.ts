import { createServiceClient } from "@/lib/supabase/server";
import { normalizeProfile } from "@/lib/auth";
import type { Profile } from "@/lib/auth";

export type Project = {
  id: string;
  owner_id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  tech_stack: string[];
  status: "building" | "launched" | "paused";
  created_at: string;
  owner?: Pick<Profile, "handle" | "display_name" | "avatar_url">;
  log_count?: number;
  like_count?: number;
};

export async function listBuilders(): Promise<Profile[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const builders = ((data as Profile[]) ?? []).map(normalizeProfile);
  if (!builders.length) return builders;

  const ids = builders.map((b) => b.id);
  const [projRes, logRes] = await Promise.all([
    supabase.from("projects").select("owner_id").in("owner_id", ids),
    supabase.from("build_logs").select("author_id").in("author_id", ids),
  ]);
  const projectCount = new Map<string, number>();
  for (const r of projRes.data ?? [])
    projectCount.set(r.owner_id, (projectCount.get(r.owner_id) ?? 0) + 1);
  const logCount = new Map<string, number>();
  for (const r of logRes.data ?? [])
    logCount.set(r.author_id, (logCount.get(r.author_id) ?? 0) + 1);

  return builders.map((b) => ({
    ...b,
    project_count: projectCount.get(b.id) ?? 0,
    log_count: logCount.get(b.id) ?? 0,
  }));
}

export async function getProfileByHandle(handle: string): Promise<Profile | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("handle", handle)
    .maybeSingle();
  return data ? normalizeProfile(data as Profile) : null;
}

export async function listProjects(): Promise<Project[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("projects")
    .select("*, owner:profiles!projects_owner_id_fkey(handle, display_name, avatar_url)")
    .order("created_at", { ascending: false })
    .limit(100);
  const projects = (data as Project[]) ?? [];
  if (!projects.length) return projects;

  const ids = projects.map((p) => p.id);
  const [logsRes, likesRes] = await Promise.all([
    supabase.from("build_logs").select("project_id").in("project_id", ids),
    supabase.from("likes").select("target_id").eq("target_type", "project").in("target_id", ids),
  ]);
  const logCount = new Map<string, number>();
  for (const r of logsRes.data ?? [])
    logCount.set(r.project_id, (logCount.get(r.project_id) ?? 0) + 1);
  const likeCount = new Map<string, number>();
  for (const r of likesRes.data ?? [])
    likeCount.set(r.target_id, (likeCount.get(r.target_id) ?? 0) + 1);

  return projects.map((p) => ({
    ...p,
    log_count: logCount.get(p.id) ?? 0,
    like_count: likeCount.get(p.id) ?? 0,
  }));
}

export async function listProjectsByOwner(ownerId: string): Promise<Project[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  return (data as Project[]) ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("projects")
    .select("*, owner:profiles!projects_owner_id_fkey(handle, display_name, avatar_url)")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Project | null) ?? null;
}
