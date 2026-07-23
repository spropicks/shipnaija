"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getCurrentProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/action-state";

function parseStack(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function normalizeHandle(raw: FormDataEntryValue | null): string {
  return String(raw ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 30);
}

export async function updateProfile(formData: FormData) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/");

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: String(formData.get("display_name") ?? "").trim() || profile.display_name,
      bio: String(formData.get("bio") ?? "").trim() || null,
      location: String(formData.get("location") ?? "").trim() || null,
      tech_stack: parseStack(formData.get("tech_stack")),
      twitter_url: String(formData.get("twitter_url") ?? "").trim() || null,
      github_url: String(formData.get("github_url") ?? "").trim() || null,
      website_url: String(formData.get("website_url") ?? "").trim() || null,
    })
    .eq("id", profile.id);

  if (error) throw new Error(error.message);

  revalidatePath("/builders");
  revalidatePath(`/builders/${profile.handle}`);
  redirect(`/builders/${profile.handle}`);
}

// Onboarding fallback: creates a profile for a signed-in Clerk user whose
// automatic sync (webhook + self-heal) failed — typically because their chosen
// handle collided. Lets them pick an available handle explicitly.
export async function claimProfile(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) redirect("/");

  // Already has a profile — nothing to claim.
  const existing = await getCurrentProfile();
  if (existing) redirect("/dashboard");

  const user = await currentUser();
  if (!user || user.id !== userId) redirect("/");

  const handle = normalizeHandle(formData.get("handle"));
  if (handle.length < 3) {
    return { ok: false, message: "Handle must be at least 3 characters (letters, numbers, - or _)." };
  }

  const displayName =
    String(formData.get("display_name") ?? "").trim() ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "Builder";

  const supabase = createServiceClient();

  // Reject a handle already taken by someone else.
  const { data: taken } = await supabase
    .from("profiles")
    .select("id")
    .eq("handle", handle)
    .maybeSingle();
  if (taken) return { ok: false, message: "That handle is taken — try another." };

  const { error } = await supabase.from("profiles").upsert(
    {
      clerk_user_id: userId,
      handle,
      display_name: displayName,
      avatar_url: user.imageUrl ?? null,
    },
    { onConflict: "clerk_user_id" }
  );
  if (error) {
    // Unique violation = a concurrent claim grabbed the handle first.
    if (error.code === "23505") return { ok: false, message: "That handle is taken — try another." };
    return { ok: false, message: "Couldn't create your profile. Try again." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
