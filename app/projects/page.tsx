import { SiteHeader } from "@/components/site-header";
import { ProjectCard } from "@/components/project-card";
import { listProjects } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await listProjects();
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold">Project Showcase</h1>
        <p className="mt-1 text-white/60">What Naija is shipping right now.</p>
        {projects.length === 0 ? (
          <div className="mt-16 text-center text-white/50">
            <p className="text-lg">No projects yet — be the first to ship! 🚢</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
