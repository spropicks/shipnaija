import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client using the service role key.
// ONLY use in server code (route handlers, server actions). Never import in client components.
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
