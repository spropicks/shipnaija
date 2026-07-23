import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import type { Profile } from "@/lib/auth";

export function BuilderCard({ profile }: { profile: Profile }) {
  return (
    <Link
      href={`/builders/${profile.handle}`}
      className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-green-500/50 hover:bg-white/[0.05]"
    >
      <div className="flex items-center gap-3">
        <Avatar src={profile.avatar_url} name={profile.display_name} size={48} />
        <div className="min-w-0">
          <p className="truncate font-semibold">{profile.display_name}</p>
          <p className="truncate text-sm text-white/50">@{profile.handle}</p>
        </div>
      </div>
      {profile.bio ? (
        <p className="line-clamp-2 text-sm text-white/70">{profile.bio}</p>
      ) : null}
      <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-white/50">
        {profile.location ? <span>📍 {profile.location}</span> : null}
        {profile.current_streak > 0 ? (
          <span className="text-orange-400">🔥 {profile.current_streak}-day streak</span>
        ) : null}
      </div>
      {profile.tech_stack?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {profile.tech_stack.slice(0, 5).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/60"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
