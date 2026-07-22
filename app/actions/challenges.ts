"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function enterChallenge(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/");

  const challengeId = String(formData.get("challenge_id") ?? "");
  const challengeSlug = String(formData.get("challenge_slug") ?? "");
  const projectId = String(formData.get("project_id") ?? "");
  const note = String(formData.get("submission_note") ?? "").trim() || null;
  if (!challengeId || !projectId) throw new Error("Challenge and project are required");

  const supabase = createServiceClient();

  // The challenge must still be open.
  const { data: challenge } = await supabase
    .from("challenges")
    .select("id, ends_at, starts_at")
    .eq("id", challengeId)
    .maybeSingle();
  if (!challenge) throw new Error("Challenge not found");
  const now = new Date().toISOString();
  if (now < challenge.starts_at || now > challenge.ends_at) {
    throw new Error("This challenge is not open for entries");
  }

  // The project must belong to the builder.
  const { data: project } = await supabase
    .from("projects")
    .select("id, owner_id")
    .eq("id", projectId)
    .maybeSingle();
  if (!project || project.owner_id !== profile.id) {
    throw new Error("You can only enter your own projects");
  }

  const { error } = await supabase.from("challenge_entries").insert({
    challenge_id: challengeId,
    project_id: projectId,
    builder_id: profile.id,
    submission_note: note ? note.slice(0, 280) : null,
  });
  if (error) {
    if (error.code === "23505") throw new Error("This project is already entered");
    throw new Error(error.message);
  }

  revalidatePath("/challenges");
  revalidatePath(`/challenges/${challengeSlug}`);
  redirect(`/challenges/${challengeSlug}`);
}
