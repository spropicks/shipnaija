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
};

export async function listBuilders(): Promise<Profile[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  return ((data as Profile[]) ?? []).map(normalizeProfile);
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
  return (data as Project[]) ?? [];
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
