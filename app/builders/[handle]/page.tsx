import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ProjectCard } from "@/components/project-card";
import { getCurrentProfile } from "@/lib/auth";
import { getProfileByHandle, listProjectsByOwner } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function BuilderProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const profile = await getProfileByHandle(handle);
  if (!profile) notFound();

  const [projects, me] = await Promise.all([
    listProjectsByOwner(profile.id),
    getCurrentProfile(),
  ]);
  const isOwner = me?.id === profile.id;

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.display_name}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-600/30 text-3xl font-bold text-green-400">
              {profile.display_name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold">{profile.display_name}</h1>
              <span className="text-white/50">@{profile.handle}</span>
              {isOwner ? (
                <Link
                  href="/profile/edit"
                  className="rounded-md border border-white/20 px-3 py-1 text-sm text-white/70 hover:border-green-500/50 hover:text-green-400"
                >
                  Edit profile
                </Link>
              ) : null}
            </div>
            {profile.bio ? <p className="mt-2 text-white/80">{profile.bio}</p> : null}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/60">
              {profile.location ? <span>📍 {profile.location}</span> : null}
              <span className="text-orange-400">
                🔥 {profile.current_streak}-day streak
              </span>
              <span>🏆 longest: {profile.longest_streak}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              {profile.twitter_url ? (
                <a href={profile.twitter_url} className="text-green-400 hover:underline" target="_blank" rel="noreferrer">
                  X / Twitter
                </a>
              ) : null}
              {profile.github_url ? (
                <a href={profile.github_url} className="text-green-400 hover:underline" target="_blank" rel="noreferrer">
                  GitHub
                </a>
              ) : null}
              {profile.website_url ? (
                <a href={profile.website_url} className="text-green-400 hover:underline" target="_blank" rel="noreferrer">
                  Website
                </a>
              ) : null}
            </div>
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
      </section>
    </main>
  );
}
