import { SiteHeader } from "@/components/site-header";
import { ProjectCard } from "@/components/project-card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { listProjects } from "@/lib/queries";
import { FolderKanban } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const projects = await listProjects();
  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-5xl px-6 py-10">
        <PageHeader
          eyebrow="Showcase"
          title="Projects"
          subtitle="What Naija is shipping right now."
        />
        {projects.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Be the first to put your product on the map."
              actionHref="/projects/new"
              actionLabel="Add your project"
            />
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
