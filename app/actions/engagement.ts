"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/action-state";

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
    const { error } = await supabase.from("likes").insert({
      user_id: profile.id,
      target_type: targetType,
      target_id: targetId,
    });
    // 23505 = the row was inserted by a concurrent double-submit. Already liked;
    // treat as success rather than throwing to the route error boundary.
    if (error && error.code !== "23505") throw new Error(error.message);
  }
  revalidatePath(path);
}

export async function addComment(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const profile = await getCurrentProfile();
  if (!profile) return { ok: false, message: "Sign in to comment." };

  const targetType = String(formData.get("target_type") ?? "");
  const targetId = String(formData.get("target_id") ?? "");
  const content = String(formData.get("content") ?? "").trim();
  const path = String(formData.get("path") ?? "/feed");
  if (!COMMENT_TARGETS.has(targetType) || !targetId) {
    return { ok: false, message: "Invalid comment target." };
  }
  if (!content) return { ok: false, message: "Write something first." };

  const supabase = createServiceClient();
  const { error } = await supabase.from("comments").insert({
    author_id: profile.id,
    target_type: targetType,
    target_id: targetId,
    content: content.slice(0, 500),
  });
  if (error) return { ok: false, message: "Couldn't post your comment. Try again." };
  revalidatePath(path);
  return { ok: true };
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
