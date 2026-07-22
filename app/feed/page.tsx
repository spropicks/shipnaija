import { SiteHeader } from "@/components/site-header";
import { LogComposer } from "@/components/log-composer";
import { BuildLogCard } from "@/components/build-log-card";
import { getCurrentProfile } from "@/lib/auth";
import { listFeed } from "@/lib/feed";
import { listProjectsByOwner } from "@/lib/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const me = await getCurrentProfile();
  const [logs, myProjects] = await Promise.all([
    listFeed(me?.id ?? null),
    me ? listProjectsByOwner(me.id) : Promise.resolve([]),
  ]);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-3xl font-bold">The Feed</h1>
        <p className="mt-1 text-white/60">What Naija builders shipped today.</p>

        <div className="mt-8 flex flex-col gap-6">
          {me ? (
            myProjects.length > 0 ? (
              <LogComposer projects={myProjects} />
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
            <div className="py-16 text-center text-white/50">
              No build logs yet. Be the first to ship something! 🚢
            </div>
          ) : (
            logs.map((log) => (
              <BuildLogCard key={log.id} log={log} path="/feed" canEngage={Boolean(me)} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}
