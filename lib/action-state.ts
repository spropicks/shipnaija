// Shared result shape for server actions wired to React's useActionState.
// Lets forms surface inline error feedback instead of throwing to the
// nearest error boundary (which would blank the whole route).
export type ActionState = { ok: boolean; message?: string };

export const IDLE_STATE: ActionState = { ok: true };
