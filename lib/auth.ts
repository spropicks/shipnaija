import { auth, currentUser } from "@clerk/nextjs/server";
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
// Self-healing: if the user is signed in with Clerk but has no profile row
// (e.g. the Clerk webhook wasn't configured when they signed up), we create
// the profile on the fly from Clerk's user data. The webhook remains the
// primary sync path; this is the safety net.
export async function getCurrentProfile(): Promise<Profile | null> {
  const { userId } = await auth();
  if (!userId) return null;
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();
  if (data) return data as Profile;

  // No row yet — sync from Clerk now.
  return syncProfileFromClerk(userId);
}

async function syncProfileFromClerk(clerkUserId: string): Promise<Profile | null> {
  const user = await currentUser();
  if (!user || user.id !== clerkUserId) return null;

  const supabase = createServiceClient();
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "Builder";
  const baseHandle = (user.username || `builder_${user.id.slice(-8)}`)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 30) || `builder_${user.id.slice(-8).toLowerCase()}`;

  // Handle collisions: try base handle, then suffix.
  for (const handle of [baseHandle, `${baseHandle}-${user.id.slice(-4).toLowerCase()}`]) {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          clerk_user_id: user.id,
          handle,
          display_name: displayName,
          avatar_url: user.imageUrl ?? null,
        },
        { onConflict: "clerk_user_id" }
      )
      .select("*")
      .maybeSingle();
    if (data) return data as Profile;
    // 23505 = unique violation on `handle` (taken by someone else) — retry with suffix
    if (error && !error.message.toLowerCase().includes("duplicate")) {
      console.error("Profile self-heal failed:", error.message);
      return null;
    }
  }
  return null;
}
