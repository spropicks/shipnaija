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

// Shape compatible with useActionState (the onboarding/profile-edit forms
// call it via useActionState; the direct form-action path on /profile/edit
// also still works because redirect() throws, so the return is ignored).
export async function updateProfile(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const profile = await getCurrentProfile();
  if (!profile) return { ok: false, message: "Sign in to update your profile." };

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
      // Anyone who meaningfully edits their profile is considered onboarded.
      // Drives the welcome banner + header "Complete setup" CTA.
      onboarded_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (error) return { ok: false, message: "Couldn't save your changes. Try again." };

  revalidatePath("/builders");
  revalidatePath(`/builders/${profile.handle}`);
  revalidatePath("/dashboard");
  redirect(`/builders/${profile.handle}`);
}

// Like updateProfile, but for the first-run /onboarding flow. Saves the
// profile, stamps onboarded_at, and routes the user to /projects/new so the
// activation loop continues (profile → first project → first build log).
export async function completeOnboarding(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const profile = await getCurrentProfile();
  if (!profile) return { ok: false, message: "Sign in to set up your profile." };

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
      onboarded_at: new Date().toISOString(),
    })
    .eq("id", profile.id);

  if (error) return { ok: false, message: "Couldn't save your profile. Try again." };

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  redirect("/projects/new");
}

// Stamp onboarded_at without touching any other fields. Used by the
// "Skip for now" CTA on the welcome banner and the onboarding page.
export async function skipOnboarding() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/");

  const supabase = createServiceClient();
  await supabase
    .from("profiles")
    .update({ onboarded_at: new Date().toISOString() })
    .eq("id", profile.id);

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");
  redirect("/dashboard");
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
      onboarded_at: new Date().toISOString(),
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
