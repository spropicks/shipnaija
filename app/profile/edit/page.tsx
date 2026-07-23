import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getCurrentProfile } from "@/lib/auth";
import { updateProfile } from "@/app/actions/profile";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-green-500";

export default async function EditProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/onboarding");

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-bold">Edit profile</h1>
        <form action={updateProfile} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Display name</span>
            <input name="display_name" defaultValue={profile.display_name} className={inputCls} required />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Bio</span>
            <textarea name="bio" defaultValue={profile.bio ?? ""} rows={3} className={inputCls} placeholder="What are you building?" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Location</span>
            <input name="location" defaultValue={profile.location ?? ""} className={inputCls} placeholder="Lagos, Abuja, remote..." />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Tech stack (comma separated)</span>
            <input name="tech_stack" defaultValue={profile.tech_stack?.join(", ") ?? ""} className={inputCls} placeholder="Next.js, Supabase, Flutter" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">X / Twitter URL</span>
            <input name="twitter_url" type="url" defaultValue={profile.twitter_url ?? ""} className={inputCls} placeholder="https://x.com/you" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">GitHub URL</span>
            <input name="github_url" type="url" defaultValue={profile.github_url ?? ""} className={inputCls} placeholder="https://github.com/you" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Website URL</span>
            <input name="website_url" type="url" defaultValue={profile.website_url ?? ""} className={inputCls} placeholder="https://yoursite.dev" />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-500"
          >
            Save changes
          </button>
        </form>
      </section>
    </main>
  );
}
