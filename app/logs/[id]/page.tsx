import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { BuildLogCard } from "@/components/build-log-card";
import { CommentSection } from "@/components/comment-section";
import { getCurrentProfile } from "@/lib/auth";
import { getLog, getComments } from "@/lib/feed";

export const dynamic = "force-dynamic";

export default async function LogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const me = await getCurrentProfile();
  const log = await getLog(id, me?.id ?? null);
  if (!log) notFound();
  const comments = await getComments("build_log", log.id);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
        <BuildLogCard
          log={log}
          path={`/logs/${log.id}`}
          canEngage={Boolean(me)}
          viewerId={me?.id ?? null}
        />
        <h2 className="text-lg font-semibold">Comments</h2>
        <CommentSection
          targetType="build_log"
          targetId={log.id}
          comments={comments}
          viewerProfileId={me?.id ?? null}
          path={`/logs/${log.id}`}
          canEngage={Boolean(me)}
        />
      </section>
    </main>
  );
}
