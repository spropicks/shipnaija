import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { enterChallenge } from "@/app/actions/challenges";
import { getChallengeBySlug, listEntries } from "@/lib/challenges";
import { getCurrentProfile } from "@/lib/auth";
import { listProjectsByOwner } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const challenge = await getChallengeBySlug(slug);
  if (!challenge) notFound();

  const me = await getCurrentProfile();
  const [entries, myProjects] = await Promise.all([
    listEntries(challenge.id),
    me ? listProjectsByOwner(me.id) : Promise.resolve([]),
  ]);

  const now = new Date().toISOString();
  const isOpen = now >= challenge.starts_at && now <= challenge.ends_at;
  const alreadyEntered = Boolean(
    me && entries.some((e) => e.builder?.id === me.id)
  );

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-xs font-medium uppercase tracking-wide text-green-400">
          {isOpen ? "Live challenge 🟢" : "Challenge closed"}
        </p>
        <h1 className="mt-1 text-3xl font-bold">{challenge.title}</h1>
        {challenge.theme ? <p className="mt-2 text-white/70">{challenge.theme}</p> : null}

        {isOpen && me && myProjects.length > 0 && !alreadyEntered ? (
          <form
            action={enterChallenge}
            className="mt-8 flex flex-col gap-3 rounded-xl border border-green-500/20 bg-green-500/[0.04] p-5"
          >
            <p className="text-sm font-medium text-green-400">Enter this challenge 🚢</p>
            <input type="hidden" name="challenge_id" value={challenge.id} />
            <input type="hidden" name="challenge_slug" value={challenge.slug} />
            <div className="flex flex-wrap items-center gap-3">
              <select
                name="project_id"
                required
                defaultValue=""
                aria-label="Select a project to enter"
                className="rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-green-500"
              >
                <option value="" disabled>
                  Select project…
                </option>
                {myProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <input
                name="submission_note"
                maxLength={280}
                aria-label="Submission note (optional)"
                placeholder="What will you ship this week? (optional)"
                className="min-w-0 flex-1 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-green-500"
              />
              <button
                type="submit"
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
              >
                Enter
              </button>
            </div>
          </form>
        ) : null}
        {isOpen && me && myProjects.length === 0 && !alreadyEntered ? (
          <p className="mt-8 text-sm text-white/60">
            <Link href="/projects/new" className="text-green-400 hover:underline">
              Add a project
            </Link>{" "}
            first, then enter the challenge.
          </p>
        ) : null}
        {isOpen && me && alreadyEntered ? (
          <div className="mt-8 rounded-xl border border-green-500/30 bg-green-500/[0.06] p-5">
            <p className="text-sm font-medium text-green-400">
              You&apos;ve entered this challenge ✅
            </p>
            <p className="mt-1 text-sm text-white/60">
              Keep shipping and posting build logs — winners are picked when the week closes.
            </p>
          </div>
        ) : null}
        {isOpen && !me ? (
          <p className="mt-8 text-sm text-white/60">Sign in to enter this challenge.</p>
        ) : null}

        <div className="mt-12">
          <h2 className="text-xl font-semibold">
            Entries <span className="text-white/40">({entries.length})</span>
          </h2>
          {entries.length === 0 ? (
            <p className="mt-4 text-sm text-white/50">No entries yet — be the first! 🚀</p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {entries.map((e) => (
                <li
                  key={e.id}
                  className={`rounded-lg border p-4 ${
                    e.is_winner
                      ? "border-yellow-500/40 bg-yellow-500/[0.05]"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {e.is_winner ? <span title="Winner">🏆</span> : null}
                    {e.project ? (
                      <Link
                        href={`/projects/${e.project.slug}`}
                        className="font-medium hover:text-green-400"
                      >
                        {e.project.name}
                      </Link>
                    ) : null}
                    {e.builder ? (
                      <Link
                        href={`/builders/${e.builder.handle}`}
                        className="text-sm text-white/50 hover:text-green-400"
                      >
                        by @{e.builder.handle}
                      </Link>
                    ) : null}
                  </div>
                  {e.submission_note ? (
                    <p className="mt-2 text-sm text-white/75">{e.submission_note}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
