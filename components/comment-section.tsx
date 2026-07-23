"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { addComment, deleteComment } from "@/app/actions/engagement";
import { SubmitButton } from "@/components/ui/submit-button";
import { IDLE_STATE } from "@/lib/action-state";
import type { LogComment } from "@/lib/feed";

export function CommentSection({
  targetType,
  targetId,
  comments,
  viewerProfileId,
  path,
  canEngage,
}: {
  targetType: string;
  targetId: string;
  comments: LogComment[];
  viewerProfileId: string | null;
  path: string;
  canEngage: boolean;
}) {
  const [state, formAction] = useActionState(addComment, IDLE_STATE);
  const [content, setContent] = useState("");

  // Clear the input after a successful post.
  useEffect(() => {
    if (state.ok) setContent("");
  }, [state]);

  return (
    <div className="flex flex-col gap-4">
      {canEngage ? (
        <form action={formAction} className="flex flex-col gap-1.5">
          <div className="flex gap-2">
            <input type="hidden" name="target_type" value={targetType} />
            <input type="hidden" name="target_id" value={targetId} />
            <input type="hidden" name="path" value={path} />
            <input
              name="content"
              required
              maxLength={500}
              aria-label="Write a comment"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Drop feedback for this builder…"
              className="min-w-0 flex-1 rounded-md border border-white/15 bg-black/30 px-3 py-2 text-sm outline-none focus:border-green-500"
            />
            <SubmitButton
              pendingLabel="Posting…"
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
            >
              Reply
            </SubmitButton>
          </div>
          {!state.ok && state.message ? (
            <p className="text-xs text-red-400" role="alert">
              {state.message}
            </p>
          ) : null}
        </form>
      ) : (
        <p className="text-sm text-white/40">Sign in to join the conversation.</p>
      )}
      {comments.length === 0 ? (
        <p className="text-sm text-white/40">No comments yet — be the first! 💬</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {comments.map((c) => (
            <li key={c.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-white/50">
                  <Link href={`/builders/${c.author.handle}`} className="font-medium text-white/80 hover:text-green-400">
                    {c.author.display_name}
                  </Link>{" "}
                  @{c.author.handle}
                </p>
                {viewerProfileId === c.author_id ? (
                  <form action={deleteComment}>
                    <input type="hidden" name="id" value={c.id} />
                    <input type="hidden" name="path" value={path} />
                    <button type="submit" className="text-xs text-white/30 hover:text-red-400">
                      delete
                    </button>
                  </form>
                ) : null}
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-white/85">{c.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
