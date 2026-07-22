import { createClient } from "@supabase/supabase-js";

// Browser Supabase client (anon key). RLS policies protect data access.
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
