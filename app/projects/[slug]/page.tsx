import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { BuildLogCard } from "@/components/build-log-card";
import { CommentSection } from "@/components/comment-section";
import { LikeButton } from "@/components/like-button";
import { LogComposer } from "@/components/log-composer";
import { getCurrentProfile } from "@/lib/auth";
import { getProjectBySlug } from "@/lib/queries";
import { listProjectFeed, getProjectEngagement, getComments } from "@/lib/feed";

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
  const path = `/projects/${project.slug}`;

  const [logs, engagement, comments] = await Promise.all([
    listProjectFeed(project.id, me?.id ?? null),
    getProjectEngagement(project.id, me?.id ?? null),
    getComments("project", project.id),
  ]);

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
          <LikeButton
            targetType="project"
            targetId={project.id}
            count={engagement.like_count}
            liked={engagement.liked_by_me}
            path={path}
            disabled={!me}
          />
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

        {/* Build logs */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold">
            Build logs <span className="text-white/40">({logs.length})</span>
          </h2>
          {isOwner ? (
            <div className="mt-4">
              <LogComposer projects={[project]} redirectTo={path} />
            </div>
          ) : null}
          {logs.length === 0 ? (
            <p className="mt-4 text-sm text-white/50">
              No build logs yet{isOwner ? " — ship the first update! 🚢" : " — check back soon."}
            </p>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              {logs.map((log) => (
                <BuildLogCard
                  key={log.id}
                  log={log}
                  path={path}
                  canEngage={Boolean(me)}
                  viewerId={me?.id ?? null}
                />
              ))}
            </div>
          )}
        </div>

        {/* Project comments */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold">
            Feedback <span className="text-white/40">({comments.length})</span>
          </h2>
          <div className="mt-4">
            <CommentSection
              targetType="project"
              targetId={project.id}
              comments={comments}
              viewerProfileId={me?.id ?? null}
              path={path}
              canEngage={Boolean(me)}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
