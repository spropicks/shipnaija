import { SiteHeader } from "@/components/site-header";
import { LogComposer } from "@/components/log-composer";
import { BuildLogCard } from "@/components/build-log-card";
import { FeedSidebar } from "@/components/feed-sidebar";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { getCurrentProfile } from "@/lib/auth";
import { listFeed } from "@/lib/feed";
import { listProjectsByOwner } from "@/lib/queries";
import { getActiveChallenge } from "@/lib/challenges";
import { getTrending } from "@/lib/trending";
import { Rss } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = { title: "Feed" };

export default async function FeedPage() {
  const me = await getCurrentProfile();
  const [logs, myProjects, activeChallenge, trending] = await Promise.all([
    listFeed(me?.id ?? null),
    me ? listProjectsByOwner(me.id) : Promise.resolve([]),
    getActiveChallenge(),
    getTrending(),
  ]);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-6xl px-6 py-10">
        <PageHeader
          eyebrow="Today on ShipNaija"
          title="The Feed"
          subtitle="What Naija builders shipped today."
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-6">
            {me ? (
              myProjects.length > 0 ? (
                <LogComposer projects={myProjects} redirectTo="/feed" />
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/60">
                  Add a project first, then start posting build logs.{" "}
                  <Link href="/projects/new" className="text-green-400 hover:underline">
                    + Add your project
                  </Link>
                </div>
              )
            ) : null}

            {logs.length === 0 ? (
              <EmptyState
                icon={Rss}
                title="No build logs yet"
                description="Be the first to ship something and start the conversation."
                actionHref={me ? "/projects/new" : undefined}
                actionLabel={me ? "Add your project" : undefined}
              />
            ) : (
              logs.map((log) => (
                <BuildLogCard
                  key={log.id}
                  log={log}
                  path="/feed"
                  canEngage={Boolean(me)}
                  viewerId={me?.id ?? null}
                />
              ))
            )}
          </div>

          <aside className="hidden lg:block">
            <FeedSidebar
              activeChallenge={activeChallenge}
              topBuilders={trending.builders.slice(0, 5)}
              topProjects={trending.projects.slice(0, 4)}
            />
          </aside>
        </div>
      </section>
    </main>
  );
}
