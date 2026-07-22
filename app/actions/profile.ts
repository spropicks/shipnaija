"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

function parseStack(raw: FormDataEntryValue | null): string[] {
  return String(raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 12);
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
