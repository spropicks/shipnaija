import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Syncs Clerk users into the Supabase `profiles` table.
// Configure in Clerk Dashboard -> Webhooks -> endpoint: /api/webhooks/clerk
// Subscribe to: user.created, user.updated, user.deleted
export async function POST(req: Request) {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Missing webhook secret" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(secret);

  let evt: { type: string; data: Record<string, unknown> };
  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { type: string; data: Record<string, unknown> };
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const data = evt.data as {
    id: string;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string | null;
    email_addresses?: { email_address: string }[];
  };

  if (evt.type === "user.created" || evt.type === "user.updated") {
    const displayName =
      [data.first_name, data.last_name].filter(Boolean).join(" ") ||
      data.username ||
      "Builder";
    const handle =
      data.username || `builder_${data.id.slice(-8).toLowerCase()}`;

    const { error } = await supabase.from("profiles").upsert(
      {
        clerk_user_id: data.id,
        handle,
        display_name: displayName,
        avatar_url: data.image_url ?? null,
      },
      { onConflict: "clerk_user_id" }
    );
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  if (evt.type === "user.deleted") {
    await supabase.from("profiles").delete().eq("clerk_user_id", data.id);
  }

  return NextResponse.json({ ok: true });
}
