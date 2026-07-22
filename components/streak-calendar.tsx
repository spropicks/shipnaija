import { cn } from "@/lib/utils";
import type { DayActivity } from "@/lib/dashboard";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function intensity(count: number): string {
  if (count === 0) return "bg-white/[0.06]";
  if (count === 1) return "bg-green-900";
  if (count === 2) return "bg-green-700";
  return "bg-green-500";
}

export function StreakCalendar({ days }: { days: DayActivity[] }) {
  return (
    <div className="flex items-end gap-1.5">
      {days.map((d) => {
        const date = new Date(d.date + "T00:00:00Z");
        const label = WEEKDAYS[date.getUTCDay()];
        return (
          <div key={d.date} className="flex flex-col items-center gap-1">
            <div
              title={`${d.date}: ${d.count} log${d.count === 1 ? "" : "s"}`}
              className={cn("h-7 w-7 rounded-md sm:h-8 sm:w-8", intensity(d.count))}
            />
            <span className="text-[9px] text-white/30">{label.slice(0, 1)}</span>
          </div>
        );
      })}
    </div>
  );
}
