import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getCurrentProfile } from "@/lib/auth";
import { getProjectBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  building: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  launched: "bg-green-500/15 text-green-400 border-green-500/30",
  paused: "bg-white/10 text-white/50 border-white/20",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, me] = await Promise.all([getProjectBySlug(slug), getCurrentProfile()]);
  if (!project) notFound();
  const isOwner = me?.id === project.owner_id;

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <span
            className={`rounded-full border px-2 py-0.5 text-xs ${STATUS_STYLES[project.status] ?? ""}`}
          >
            {project.status}
          </span>
          {isOwner ? (
            <Link
              href={`/projects/${project.slug}/edit`}
              className="rounded-md border border-white/20 px-3 py-1 text-sm text-white/70 hover:border-green-500/50 hover:text-green-400"
            >
              Edit
            </Link>
          ) : null}
        </div>
        {project.tagline ? (
          <p className="mt-2 text-lg text-white/70">{project.tagline}</p>
        ) : null}
        {project.owner ? (
          <p className="mt-2 text-sm text-white/50">
            by{" "}
            <Link href={`/builders/${project.owner.handle}`} className="text-green-400 hover:underline">
              @{project.owner.handle}
            </Link>
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          {project.demo_url ? (
            <a href={project.demo_url} className="text-green-400 hover:underline" target="_blank" rel="noreferrer">
              Live demo ↗
            </a>
          ) : null}
          {project.repo_url ? (
            <a href={project.repo_url} className="text-green-400 hover:underline" target="_blank" rel="noreferrer">
              Repo ↗
            </a>
          ) : null}
        </div>
        {project.tech_stack?.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech_stack.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/60"
              >
                {t}
              </span>
            ))}
          </div>
        ) : null}
        {project.description ? (
          <div className="mt-8 whitespace-pre-wrap text-white/80">{project.description}</div>
        ) : null}
        <div className="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center text-white/50">
          Build logs land here in M2 🚧
        </div>
      </section>
    </main>
  );
}
