import { cn } from "@/lib/utils";
import type { DayActivity } from "@/lib/dashboard";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function intensity(count: number): string {
  if (count === 0) return "border-white/[0.04] bg-white/[0.045]";
  if (count === 1) return "border-green-800/30 bg-green-900";
  if (count === 2) return "border-green-600/30 bg-green-700";
  return "border-green-300/25 bg-green-400 shadow-[0_0_14px_-5px_rgba(74,222,128,0.75)]";
}

export function StreakCalendar({ days }: { days: DayActivity[] }) {
  return (
    <div className="grid w-full grid-cols-7 gap-x-1.5 gap-y-3 min-[380px]:gap-x-2 sm:grid-cols-14 sm:gap-2">
      {days.map((day) => {
        const date = new Date(day.date + "T00:00:00Z");
        const weekday = WEEKDAYS[date.getUTCDay()];
        const dayNumber = date.getUTCDate();

        return (
          <div key={day.date} className="group flex min-w-0 flex-col items-center gap-1.5 sm:gap-2">
            <div
              title={`${day.date}: ${day.count} log${day.count === 1 ? "" : "s"}`}
              className={cn(
                "relative flex aspect-square w-full min-w-0 items-center justify-center rounded-md border transition-transform group-hover:-translate-y-0.5 sm:rounded-lg",
                intensity(day.count)
              )}
            >
              <span className={`text-[9px] font-medium ${day.count ? "text-white/70" : "text-white/18"}`}>
                {day.count || dayNumber}
              </span>
            </div>
            <span className="text-[8px] uppercase tracking-wider text-white/20">
              {weekday.slice(0, 1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
