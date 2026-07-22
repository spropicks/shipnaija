import { toggleLike } from "@/app/actions/engagement";

export function LikeButton({
  targetType,
  targetId,
  count,
  liked,
  path,
  disabled,
}: {
  targetType: string;
  targetId: string;
  count: number;
  liked: boolean;
  path: string;
  disabled?: boolean;
}) {
  return (
    <form action={toggleLike} className="inline">
      <input type="hidden" name="target_type" value={targetType} />
      <input type="hidden" name="target_id" value={targetId} />
      <input type="hidden" name="path" value={path} />
      <button
        type="submit"
        disabled={disabled}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
          liked
            ? "border-green-500/50 bg-green-500/10 text-green-400"
            : "border-white/15 text-white/60 hover:border-green-500/40 hover:text-green-400"
        } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
      >
        {liked ? "💚" : "🤍"} {count}
      </button>
    </form>
  );
}
