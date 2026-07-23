import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Activity, Heart, FolderKanban } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { BuildLogCard } from "@/components/build-log-card";
import { CommentSection } from "@/components/comment-section";
import { LikeButton } from "@/components/like-button";
import { LogComposer } from "@/components/log-composer";
import { PageHeader } from "@/components/ui/page-header";
import { StatTile } from "@/components/ui/stat-tile";
import { getCurrentProfile } from "@/lib/auth";
import { getProjectBySlug } from "@/lib/queries";
import { listProjectFeed, getProjectEngagement, getComments } from "@/lib/feed";
import { createServiceClient } from "@/lib/supabase/server";
import { safeExternalUrl } from "@/lib/utils";

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

  const supabase = createServiceClient();
  const [logs, engagement, comments, logCountRes] = await Promise.all([
    listProjectFeed(project.id, me?.id ?? null),
    getProjectEngagement(project.id, me?.id ?? null),
    getComments("project", project.id),
    supabase.from("build_logs").select("id", { count: "exact", head: true }).eq("project_id", project.id),
  ]);
  const logCount = logCountRes.count ?? logs.length;

  const demo = safeExternalUrl(project.demo_url);
  const repo = safeExternalUrl(project.repo_url);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-white/40 transition hover:text-white"
        >
          <ArrowLeft className="size-3.5" /> All projects
        </Link>

        <div className="mt-5">
          <PageHeader
            eyebrow={project.owner ? `by @${project.owner.handle}` : "Project"}
            title={project.name}
            subtitle={project.tagline ?? undefined}
          >
            <span
              className={`rounded-full border px-2.5 py-1 text-xs ${STATUS_STYLES[project.status] ?? ""}`}
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
                className="rounded-md border border-white/20 px-3 py-2 text-sm text-white/70 transition hover:border-green-500/50 hover:text-green-400"
              >
                Edit
              </Link>
            ) : null}
          </PageHeader>

          {(demo || repo || project.tech_stack?.length) ? (
            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/55">
              {demo ? (
                <a href={demo} className="text-green-400 hover:underline" target="_blank" rel="noreferrer">
                  Live demo ↗
                </a>
              ) : null}
              {repo ? (
                <a href={repo} className="text-green-400 hover:underline" target="_blank" rel="noreferrer">
                  Repo ↗
                </a>
              ) : null}
            </div>
          ) : null}
          {project.tech_stack?.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
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
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <StatTile icon={Activity} label="Build logs" value={logCount} />
          <StatTile icon={Heart} label="Likes" value={engagement.like_count} tone="accent" />
          <StatTile icon={FolderKanban} label="Comments" value={comments.length} />
        </div>

        {project.description ? (
          <div className="mt-10 whitespace-pre-wrap text-white/80">{project.description}</div>
        ) : null}

        {/* Build logs */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold">
            Build logs <span className="text-white/40">({logCount})</span>
          </h2>
          {isOwner ? (
            <div className="mt-4">
              <LogComposer projects={[project]} redirectTo={path} />
            </div>
          ) : null}
          {logs.length === 0 ? (
            <p className="mt-4 text-sm text-white/50">
              No build logs yet{isOwner ? " — ship the first update!" : " — check back soon."}
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
