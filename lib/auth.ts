import { auth } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  clerk_user_id: string;
  handle: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  tech_stack: string[];
  twitter_url: string | null;
  github_url: string | null;
  website_url: string | null;
  current_streak: number;
  longest_streak: number;
  created_at: string;
};

// Returns the Supabase profile for the signed-in Clerk user, or null.
export async function getCurrentProfile(): Promise<Profile | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();
  return (data as Profile | null) ?? null;
}
