import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Flame, FolderKanban, Activity, Trophy } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ProjectCard } from "@/components/project-card";
import { BuildLogCard } from "@/components/build-log-card";
import { Avatar } from "@/components/ui/avatar";
import { PageHeader } from "@/components/ui/page-header";
import { StatTile } from "@/components/ui/stat-tile";
import { getCurrentProfile } from "@/lib/auth";
import { getProfileByHandle, listProjectsByOwner } from "@/lib/queries";
import { listAuthorFeed } from "@/lib/feed";
import { createServiceClient } from "@/lib/supabase/server";
import { safeExternalUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BuilderProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const profile = await getProfileByHandle(handle);
  if (!profile) notFound();

  const [projects, me, supabase] = await Promise.all([
    listProjectsByOwner(profile.id),
    getCurrentProfile(),
    Promise.resolve(createServiceClient()),
  ]);
  const [logs, logCountRes] = await Promise.all([
    listAuthorFeed(profile.id, me?.id ?? null, 10),
    supabase.from("build_logs").select("id", { count: "exact", head: true }).eq("author_id", profile.id),
  ]);
  const isOwner = me?.id === profile.id;
  const path = `/builders/${profile.handle}`;
  const projectCount = projects.length;
  const logCount = logCountRes.count ?? logs.length;

  const xUrl = safeExternalUrl(profile.twitter_url);
  const ghUrl = safeExternalUrl(profile.github_url);
  const webUrl = safeExternalUrl(profile.website_url);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-6 py-10">
        <Link
          href="/builders"
          className="inline-flex items-center gap-1.5 text-xs text-white/40 transition hover:text-white"
        >
          <ArrowLeft className="size-3.5" /> All builders
        </Link>

        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-start">
          <Avatar src={profile.avatar_url} name={profile.display_name} size={96} className="size-24" />
          <div className="min-w-0 flex-1">
            <PageHeader
              eyebrow={`@${profile.handle}`}
              title={profile.display_name}
              subtitle={profile.bio ?? undefined}
            >
              {isOwner ? (
                <Link
                  href="/profile/edit"
                  className="rounded-md border border-white/20 px-3 py-2 text-sm text-white/70 transition hover:border-green-500/50 hover:text-green-400"
                >
                  Edit profile
                </Link>
              ) : null}
            </PageHeader>
            {(profile.location || xUrl || ghUrl || webUrl) ? (
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/55">
                {profile.location ? <span>📍 {profile.location}</span> : null}
                {xUrl ? (
                  <a href={xUrl} className="hover:text-green-400" target="_blank" rel="noreferrer">X / Twitter ↗</a>
                ) : null}
                {ghUrl ? (
                  <a href={ghUrl} className="hover:text-green-400" target="_blank" rel="noreferrer">GitHub ↗</a>
                ) : null}
                {webUrl ? (
                  <a href={webUrl} className="hover:text-green-400" target="_blank" rel="noreferrer">Website ↗</a>
                ) : null}
              </div>
            ) : null}
            {profile.tech_stack?.length ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {profile.tech_stack.map((t) => (
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
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile icon={Flame} label="Streak" value={`${profile.current_streak}d`} tone="warn" />
          <StatTile icon={Trophy} label="Longest" value={`${profile.longest_streak}d`} />
          <StatTile icon={FolderKanban} label="Projects" value={projectCount} />
          <StatTile icon={Activity} label="Build logs" value={logCount} />
        </div>

        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Projects</h2>
            {isOwner ? (
              <Link
                href="/projects/new"
                className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-500"
              >
                + New project
              </Link>
            ) : null}
          </div>
          {projects.length === 0 ? (
            <p className="mt-6 text-white/50">
              Nothing here yet{isOwner ? " — add your first project!" : "."}
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold">Recent build logs</h2>
          {logs.length === 0 ? (
            <p className="mt-6 text-white/50">
              No build logs yet{isOwner ? " — wetin you ship today?" : "."}
            </p>
          ) : (
            <div className="mt-6 flex flex-col gap-4">
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
      </section>
    </main>
  );
}
