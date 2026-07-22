"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

// Posting a build log also updates the author's shipping streak.
export async function createBuildLog(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/");

  const content = String(formData.get("content") ?? "").trim();
  const projectId = String(formData.get("project_id") ?? "").trim();
  const linkUrl = String(formData.get("link_url") ?? "").trim() || null;
  if (!content || !projectId) throw new Error("Content and project are required");

  const supabase = createServiceClient();

  // Ensure the project belongs to the author.
  const { data: project } = await supabase
    .from("projects")
    .select("id, owner_id, slug")
    .eq("id", projectId)
    .maybeSingle();
  if (!project || project.owner_id !== profile.id) {
    throw new Error("You can only post logs to your own projects");
  }

  const { error } = await supabase.from("build_logs").insert({
    project_id: project.id,
    author_id: profile.id,
    content: content.slice(0, 1000),
    link_url: linkUrl,
  });
  if (error) throw new Error(error.message);

  await updateStreak(profile.id);

  revalidatePath("/feed");
  revalidatePath(`/projects/${project.slug}`);
  redirect("/feed");
}

export async function deleteBuildLog(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/");
  const id = String(formData.get("id") ?? "");
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("build_logs")
    .delete()
    .eq("id", id)
    .eq("author_id", profile.id);
  if (error) throw new Error(error.message);
  revalidatePath("/feed");
}

// Streak rule: consecutive calendar days (UTC) with >= 1 build log.
async function updateStreak(profileId: string) {
  const supabase = createServiceClient();
  const since = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recent } = await supabase
    .from("build_logs")
    .select("created_at")
    .eq("author_id", profileId)
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  const days = new Set(
    (recent ?? []).map((r) => new Date(r.created_at).toISOString().slice(0, 10))
  );
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const { data: prof } = await supabase
    .from("profiles")
    .select("current_streak, longest_streak, last_log_date")
    .eq("id", profileId)
    .maybeSingle();
  if (!prof) return;

  let current = prof.current_streak ?? 0;
  if (prof.last_log_date === today) {
    // already logged today — streak unchanged
  } else if (prof.last_log_date === yesterday || days.has(yesterday)) {
    current = current + 1;
  } else {
    current = 1;
  }
  const longest = Math.max(current, prof.longest_streak ?? 0);

  await supabase
    .from("profiles")
    .update({ current_streak: current, longest_streak: longest, last_log_date: today })
    .eq("id", profileId);
}
