import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { DeleteProjectForm } from "@/components/delete-project-button";
import { getCurrentProfile } from "@/lib/auth";
import { getProjectBySlug } from "@/lib/queries";
import { updateProject } from "@/app/actions/projects";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-sm outline-none focus:border-green-500";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, me] = await Promise.all([getProjectBySlug(slug), getCurrentProfile()]);
  if (!project) notFound();
  if (!me || me.id !== project.owner_id) redirect(`/projects/${slug}`);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-bold">Edit project</h1>
        <form action={updateProject} className="mt-8 flex flex-col gap-5">
          <input type="hidden" name="id" value={project.id} />
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Name *</span>
            <input name="name" defaultValue={project.name} className={inputCls} required maxLength={80} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Tagline</span>
            <input name="tagline" defaultValue={project.tagline ?? ""} className={inputCls} maxLength={140} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Description</span>
            <textarea name="description" defaultValue={project.description ?? ""} rows={5} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Status</span>
            <select name="status" className={inputCls} defaultValue={project.status}>
              <option value="building">Building 🛠️</option>
              <option value="launched">Launched 🚀</option>
              <option value="paused">Paused ⏸️</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Tech stack (comma separated)</span>
            <input name="tech_stack" defaultValue={project.tech_stack?.join(", ") ?? ""} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Demo / live URL</span>
            <input name="demo_url" type="url" defaultValue={project.demo_url ?? ""} className={inputCls} />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-white/70">Repo URL</span>
            <input name="repo_url" type="url" defaultValue={project.repo_url ?? ""} className={inputCls} />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-md bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-500"
          >
            Save changes
          </button>
        </form>

        <div className="mt-12 rounded-xl border border-red-500/20 bg-red-500/[0.03] p-5">
          <h2 className="text-sm font-semibold text-red-400">Danger zone</h2>
          <p className="mt-1 text-sm text-white/50">
            Deleting a project permanently removes it along with all its build logs, likes, and comments.
          </p>
          <div className="mt-4">
            <DeleteProjectForm projectId={project.id} projectName={project.name} />
          </div>
        </div>
      </section>
    </main>
  );
}
