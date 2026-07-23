"use client";

import { useFormStatus } from "react-dom";
import { deleteProject } from "@/app/actions/projects";

function DeleteButton({ projectName }: { projectName: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (
          !confirm(
            `Delete "${projectName}"? This permanently removes the project and all its build logs, likes, and comments. This cannot be undone.`
          )
        ) {
          e.preventDefault();
        }
      }}
      className={`rounded-md border border-red-500/40 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 ${
        pending ? "cursor-not-allowed opacity-60" : ""
      }`}
    >
      {pending ? "Deleting…" : "Delete project"}
    </button>
  );
}

export function DeleteProjectForm({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  return (
    <form action={deleteProject}>
      <input type="hidden" name="id" value={projectId} />
      <DeleteButton projectName={projectName} />
    </form>
  );
}
