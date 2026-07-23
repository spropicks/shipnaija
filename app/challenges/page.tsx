import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { PageHeader } from "@/components/ui/page-header";
import { getActiveChallenge, listChallenges } from "@/lib/challenges";

export const dynamic = "force-dynamic";

function fmtRange(startsAt: string, endsAt: string): string {
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  return `${new Date(startsAt).toLocaleDateString("en-NG", opts)} – ${new Date(
    endsAt
  ).toLocaleDateString("en-NG", opts)}`;
}

export const metadata = { title: "Challenges" };

export default async function ChallengesPage() {
  const [active, all] = await Promise.all([getActiveChallenge(), listChallenges()]);
  const now = new Date().toISOString();
  const upcoming = all
    .filter((c) => c.id !== active?.id && c.starts_at > now)
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  // "Past" = anything that has ended and isn't the currently-active one.
  const past = all.filter((c) => c.id !== active?.id && c.ends_at < now);

  return (
    <main className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-6 py-10">
        <PageHeader
          eyebrow="Ship week"
          title="Weekly Ship Challenges"
          subtitle="One week. One theme. Ship something and show the community."
        />

        {active ? (
          <Link
            href={`/challenges/${active.slug}`}
            className="mt-8 block rounded-xl border border-green-500/30 bg-green-500/[0.06] p-6 transition hover:border-green-500/60"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-green-400">
              This week&apos;s challenge · {fmtRange(active.starts_at, active.ends_at)}
            </p>
            <p className="mt-2 text-2xl font-bold">{active.title}</p>
            {active.theme ? <p className="mt-1 text-white/70">{active.theme}</p> : null}
            <p className="mt-4 text-sm font-medium text-green-400">
              Enter your project →
            </p>
          </Link>
        ) : (
          <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-6 text-white/60">
            No live challenge right now — the next one drops soon. 👀
          </div>
        )}

        {upcoming.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-xl font-semibold">Upcoming</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {upcoming.map((c) => (
                <li key={c.id}>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{c.title}</p>
                      {c.theme ? (
                        <p className="truncate text-xs text-white/45">{c.theme}</p>
                      ) : null}
                    </div>
                    <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/50">
                      {fmtRange(c.starts_at, c.ends_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {past.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-xl font-semibold">Past challenges</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {past.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/challenges/${c.slug}`}
                    className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-green-500/40"
                  >
                    <span className="truncate text-sm font-medium">{c.title}</span>
                    <span className="shrink-0 text-xs text-white/50">{fmtRange(c.starts_at, c.ends_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>
    </main>
  );
}
