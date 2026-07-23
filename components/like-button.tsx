"use client";

import { useOptimistic, useTransition } from "react";
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
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic({ liked, count });

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          setOptimistic({
            liked: !optimistic.liked,
            count: optimistic.count + (optimistic.liked ? -1 : 1),
          });
          await toggleLike(formData);
        });
      }}
      className="inline"
    >
      <input type="hidden" name="target_type" value={targetType} />
      <input type="hidden" name="target_id" value={targetId} />
      <input type="hidden" name="path" value={path} />
      <button
        type="submit"
        disabled={disabled || isPending}
        aria-pressed={optimistic.liked}
        aria-label={optimistic.liked ? "Unlike" : "Like"}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${
          optimistic.liked
            ? "border-green-500/50 bg-green-500/10 text-green-400"
            : "border-white/15 text-white/60 hover:border-green-500/40 hover:text-green-400"
        } ${disabled || isPending ? "cursor-not-allowed opacity-50" : ""}`}
      >
        {optimistic.liked ? "💚" : "🤍"} {optimistic.count}
      </button>
    </form>
  );
}
