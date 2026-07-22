import { createServiceClient } from "@/lib/supabase/server";

export type Challenge = {
  id: string;
  slug: string;
  title: string;
  theme: string | null;
  starts_at: string;
  ends_at: string;
};

export type ChallengeEntry = {
  id: string;
  submission_note: string | null;
  submitted_at: string;
  is_winner: boolean;
  project: { slug: string; name: string; tagline: string | null } | null;
  builder: { handle: string; display_name: string; avatar_url: string | null } | null;
};

export async function getActiveChallenge(): Promise<Challenge | null> {
  const supabase = createServiceClient();
  const now = new Date().toISOString();
  const { data } = await supabase
    .from("challenges")
    .select("*")
    .lte("starts_at", now)
    .gte("ends_at", now)
    .order("starts_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as Challenge | null) ?? null;
}

export async function listChallenges(): Promise<Challenge[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("challenges")
    .select("*")
    .order("starts_at", { ascending: false })
    .limit(20);
  return (data as Challenge[]) ?? [];
}

export async function getChallengeBySlug(slug: string): Promise<Challenge | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("challenges")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as Challenge | null) ?? null;
}

export async function listEntries(challengeId: string): Promise<ChallengeEntry[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("challenge_entries")
    .select(
      "id, submission_note, submitted_at, is_winner, project:projects!challenge_entries_project_id_fkey(slug, name, tagline), builder:profiles!challenge_entries_builder_id_fkey(handle, display_name, avatar_url)"
    )
    .eq("challenge_id", challengeId)
    .order("submitted_at", { ascending: true });
  return (data as unknown as ChallengeEntry[]) ?? [];
}
