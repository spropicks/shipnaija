import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
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
  const path = `/logs/${log.id}`;

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-10">
        <div>
          <Link
            href={`/projects/${log.project?.slug ?? ""}`}
            className="inline-flex items-center gap-1.5 text-xs text-white/40 transition hover:text-white"
          >
            <ArrowLeft className="size-3.5" /> Back to project
          </Link>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-green-400/70">
            Build log
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.02em]">
            {log.project?.name ?? "Project"}
          </h1>
        </div>

        <BuildLogCard
          log={log}
          path={path}
          canEngage={Boolean(me)}
          viewerId={me?.id ?? null}
        />

        <h2 className="mt-2 flex items-center gap-2 text-lg font-semibold">
          <MessageCircle className="size-4 text-white/40" />
          Comments <span className="text-white/40">({comments.length})</span>
        </h2>
        <CommentSection
          targetType="build_log"
          targetId={log.id}
          comments={comments}
          viewerProfileId={me?.id ?? null}
          path={path}
          canEngage={Boolean(me)}
        />
      </section>
    </main>
  );
}
