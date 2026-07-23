// Shipping-streak helpers.
//
// A builder's `current_streak` is only recomputed when they POST a build log
// (see updateStreak in app/actions/build-logs.ts). Between posts the stored
// value goes stale — someone who logged 10 days straight and then stopped keeps
// showing "🔥 10" forever. Rather than run a scheduled job to zero out stale
// streaks, we compute the *effective* streak on read from `last_log_date`.

const DAY_MS = 24 * 60 * 60 * 1000;

function utcDay(offsetDays = 0): string {
  return new Date(Date.now() - offsetDays * DAY_MS).toISOString().slice(0, 10);
}

// A streak is still alive only if the last log was today or yesterday (UTC).
export function isStreakAlive(lastLogDate: string | null | undefined): boolean {
  if (!lastLogDate) return false;
  return lastLogDate === utcDay(0) || lastLogDate === utcDay(1);
}

// The streak to display: the stored value if still alive, otherwise 0.
export function effectiveStreak(
  currentStreak: number | null | undefined,
  lastLogDate: string | null | undefined
): number {
  return isStreakAlive(lastLogDate) ? currentStreak ?? 0 : 0;
}
