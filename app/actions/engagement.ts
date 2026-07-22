"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

const LIKE_TARGETS = new Set(["build_log", "project", "comment"]);
const COMMENT_TARGETS = new Set(["build_log", "project"]);

export async function toggleLike(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/");

  const targetType = String(formData.get("target_type") ?? "");
  const targetId = String(formData.get("target_id") ?? "");
  const path = String(formData.get("path") ?? "/feed");
  if (!LIKE_TARGETS.has(targetType) || !targetId) throw new Error("Bad target");

  const supabase = createServiceClient();
  const { data: existing } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", profile.id)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .maybeSingle();

  if (existing) {
    await supabase.from("likes").delete().eq("id", existing.id);
  } else {
    await supabase.from("likes").insert({
      user_id: profile.id,
      target_type: targetType,
      target_id: targetId,
    });
  }
  revalidatePath(path);
}

export async function addComment(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/");

  const targetType = String(formData.get("target_type") ?? "");
  const targetId = String(formData.get("target_id") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  const path = String(formData.get("path") ?? "/feed");
  if (!COMMENT_TARGETS.has(targetType) || !targetId || !content) {
    throw new Error("Bad comment");
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("comments").insert({
    author_id: profile.id,
    target_type: targetType,
    target_id: targetId,
    content: content.slice(0, 500),
  });
  if (error) throw new Error(error.message);
  revalidatePath(path);
}

export async function deleteComment(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/");
  const id = String(formData.get("id") ?? "");
  const path = String(formData.get("path") ?? "/feed");
  const supabase = createServiceClient();
  await supabase.from("comments").delete().eq("id", id).eq("author_id", profile.id);
  revalidatePath(path);
}
