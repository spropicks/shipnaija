import { Resend } from "resend";

// Server-only email helpers. No-op (with a log) when RESEND_API_KEY is
// not configured, so the app deploys and works before the user sets the
// env var on Vercel. Drop the key into Vercel and welcome emails start
// flowing without any code change.

const FROM = "ShipNaija <onboarding@resend.dev>";

let resend: Resend | null = null;
function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  resend ??= new Resend(key);
  return resend;
}

export async function sendWelcomeEmail(
  to: string | null | undefined,
  displayName: string
): Promise<void> {
  if (!to) {
    console.log("[email] no recipient address, skipping welcome email");
    return;
  }
  const client = getClient();
  if (!client) {
    console.log(
      "[email] RESEND_API_KEY not set, skipping welcome email to " + to
    );
    return;
  }

  const html = renderWelcomeHtml(displayName);
  const text = renderWelcomeText(displayName);

  try {
    const { error } = await client.emails.send({
      from: FROM,
      to,
      subject: "Welcome to ShipNaija 🚢",
      html,
      text,
    });
    if (error) {
      console.error("[email] Resend returned an error:", error);
    }
  } catch (err) {
    // Never let email failure bubble out of the webhook.
    console.error("[email] sendWelcomeEmail failed:", err);
  }
}

function renderWelcomeText(name: string) {
  return [
    `Hi ${name},`,
    "",
    "Welcome to ShipNaija 🚢 — a build-in-public community for Nigerian developers and indie hackers.",
    "",
    "Here's what to do in your first 5 minutes:",
    "1. Complete your builder profile (bio, location, tech stack)",
    "2. Ship your first project",
    "3. Post your first build log — what did you ship or learn today?",
    "",
    "Get started: https://shipnaija.dev/onboarding",
    "See what others are shipping: https://shipnaija.dev/feed",
    "",
    "Made in Naija, built for everywhere.",
    "— The ShipNaija team",
  ].join("\n");
}

function renderWelcomeHtml(name: string) {
  // Inline-styled HTML, no template engine. Kept compact for deliverability.
  return `<!doctype html>
<html><body style="margin:0;background:#0a0a0a;font-family:ui-sans-serif,system-ui,-apple-system,sans-serif;color:#e5e5e5">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px">
    <p style="font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#22c55e;margin:0">Welcome to ShipNaija 🚢</p>
    <h1 style="font-size:28px;line-height:1.2;letter-spacing:-0.02em;margin:8px 0 16px;color:#ffffff">Hi ${escapeHtml(name)},</h1>
    <p style="font-size:15px;line-height:1.6;color:#a3a3a3;margin:0 0 20px">
      A build-in-public community for Nigerian developers and indie hackers.
      Here's what to do in your first 5 minutes:
    </p>
    <ol style="font-size:15px;line-height:1.7;color:#d4d4d4;padding-left:20px;margin:0 0 24px">
      <li>Complete your builder profile (bio, location, tech stack)</li>
      <li>Ship your first project</li>
      <li>Post your first build log — what did you ship or learn today?</li>
    </ol>
    <p style="margin:0 0 12px">
      <a href="https://shipnaija.dev/onboarding" style="display:inline-block;background:#ffffff;color:#000000;font-weight:600;font-size:14px;padding:10px 18px;border-radius:8px;text-decoration:none">Set up your profile →</a>
    </p>
    <p style="margin:0 0 24px">
      <a href="https://shipnaija.dev/feed" style="color:#22c55e;font-size:14px;text-decoration:underline">See what others are shipping →</a>
    </p>
    <p style="font-size:12px;color:#525252;margin:32px 0 0">
      Made in Naija, built for everywhere.
    </p>
  </div>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
