import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getCurrentProfile } from "@/lib/auth";
import { createProject } from "@/app/actions/projects";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-green-500";

export default async function NewProjectPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/");

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-bold">Add your project</h1>
        <p className="mt-1 text-white/60">Tell Naija what you&apos;re shipping.</p>
        <form action={createProject} className="mt-8 flex flex-col gap-5">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Name *</span>
            <input name="name" className={inputCls} required maxLength={80} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Tagline (one-liner)</span>
            <input name="tagline" className={inputCls} maxLength={140} placeholder="The Stripe of okada logistics" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Description</span>
            <textarea name="description" rows={5} className={inputCls} placeholder="What is it? Who is it for? What's the story?" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Status</span>
            <select name="status" className={inputCls} defaultValue="building">
              <option value="building">Building 🛠️</option>
              <option value="launched">Launched 🚀</option>
              <option value="paused">Paused ⏸️</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Tech stack (comma separated)</span>
            <input name="tech_stack" className={inputCls} placeholder="Next.js, Supabase, Paystack" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Demo / live URL</span>
            <input name="demo_url" type="url" className={inputCls} placeholder="https://myapp.dev" />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Repo URL</span>
            <input name="repo_url" type="url" className={inputCls} placeholder="https://github.com/you/myapp" />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-500"
          >
            Ship it 🚢
          </button>
        </form>
      </section>
    </main>
  );
}
