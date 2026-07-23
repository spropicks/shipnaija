"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { safeExternalUrl } from "@/lib/utils";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function parseStack(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 12);
}

const STATUSES = ["building", "launched", "paused"] as const;

export async function createProject(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Project name is required");

  const supabase = createServiceClient();
  let slug = slugify(name);

  // Ensure slug uniqueness with a small suffix if taken.
  const { data: existing } = await supabase
    .from("projects")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

  const status = String(formData.get("status") ?? "building");
  const { error } = await supabase.from("projects").insert({
    owner_id: profile.id,
    slug,
    name,
    tagline: String(formData.get("tagline") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    demo_url: safeExternalUrl(formData.get("demo_url") as string | null),
    repo_url: safeExternalUrl(formData.get("repo_url") as string | null),
    tech_stack: parseStack(formData.get("tech_stack")),
    status: (STATUSES as readonly string[]).includes(status) ? status : "building",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/projects");
  redirect(`/projects/${slug}`);
}

export async function updateProject(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/");

  const id = String(formData.get("id") ?? "");
  const supabase = createServiceClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, slug, owner_id")
    .eq("id", id)
    .maybeSingle();
  if (!project || project.owner_id !== profile.id) redirect("/projects");

  const status = String(formData.get("status") ?? "building");
  const { error } = await supabase
    .from("projects")
    .update({
      name: String(formData.get("name") ?? "").trim() || undefined,
      tagline: String(formData.get("tagline") ?? "").trim() || null,
      description: String(formData.get("description") ?? "").trim() || null,
      demo_url: safeExternalUrl(formData.get("demo_url") as string | null),
      repo_url: safeExternalUrl(formData.get("repo_url") as string | null),
      tech_stack: parseStack(formData.get("tech_stack")),
      status: (STATUSES as readonly string[]).includes(status) ? status : "building",
    })
    .eq("id", project.id);

  if (error) throw new Error(error.message);

  revalidatePath("/projects");
  revalidatePath(`/projects/${project.slug}`);
  redirect(`/projects/${project.slug}`);
}

export async function deleteProject(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/");

  const id = String(formData.get("id") ?? "");
  const supabase = createServiceClient();

  const { data: project } = await supabase
    .from("projects")
    .select("id, owner_id")
    .eq("id", id)
    .maybeSingle();
  if (!project || project.owner_id !== profile.id) redirect("/projects");

  // Likes and comments are polymorphic (target_type/target_id) so they don't
  // cascade via FK — remove them explicitly. Build logs cascade via their FK,
  // but any likes/comments ON those logs are also polymorphic; clear them too.
  const { data: logs } = await supabase
    .from("build_logs")
    .select("id")
    .eq("project_id", project.id);
  const logIds = (logs ?? []).map((l) => l.id);

  const targetIds = [project.id, ...logIds];
  await supabase.from("likes").delete().in("target_id", targetIds);
  await supabase.from("comments").delete().in("target_id", targetIds);

  // Deletes build_logs (cascade) and challenge_entries (cascade) via FK.
  const { error } = await supabase.from("projects").delete().eq("id", project.id);
  if (error) throw new Error(error.message);

  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect("/projects");
}
