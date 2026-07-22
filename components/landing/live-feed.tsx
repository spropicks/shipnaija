"use client";

import { AnimatedList } from "@/components/magicui/animated-list";
import { cn } from "@/lib/utils";

interface LogItem {
  name: string;
  emoji: string;
  action: string;
  time: string;
  color: string;
}

const SAMPLE_LOGS: LogItem[] = [
  {
    name: "Adaeze",
    emoji: "🚀",
    action: "shipped v1 of her fintech dashboard",
    time: "2m ago",
    color: "#16a34a",
  },
  {
    name: "Tobi",
    emoji: "🔥",
    action: "hit a 14-day shipping streak",
    time: "10m ago",
    color: "#eab308",
  },
  {
    name: "Chidi",
    emoji: "🛠️",
    action: "logged: fixed Paystack webhooks, omo!",
    time: "25m ago",
    color: "#06b6d4",
  },
  {
    name: "Funke",
    emoji: "🏆",
    action: "entered Ship Week #1: Just Ship Am",
    time: "41m ago",
    color: "#a855f7",
  },
  {
    name: "Emeka",
    emoji: "💚",
    action: "launched his AI study buddy on ShipNaija",
    time: "1h ago",
    color: "#f97316",
  },
  {
    name: "Zainab",
    emoji: "📈",
    action: "is trending #1 this week",
    time: "2h ago",
    color: "#ef4444",
  },
];

function LogCard({ name, emoji, action, time, color }: LogItem) {
  return (
    <figure
      className={cn(
        "relative mx-auto w-full max-w-md cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4",
        "transition-all duration-200 ease-in-out hover:bg-white/10"
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-2xl text-lg"
          style={{ backgroundColor: `${color}33` }}
        >
          {emoji}
        </div>
        <div className="flex flex-col overflow-hidden text-left">
          <figcaption className="flex items-center gap-2 whitespace-pre text-sm font-medium text-white">
            {name} <span className="text-xs text-white/40">{time}</span>
          </figcaption>
          <p className="truncate text-sm text-white/60">{action}</p>
        </div>
      </div>
    </figure>
  );
}

export function LiveFeed() {
  return (
    <div className="relative flex max-h-[420px] w-full flex-col overflow-hidden p-2">
      <AnimatedList delay={2000}>
        {SAMPLE_LOGS.map((log, idx) => (
          <LogCard key={idx} {...log} />
        ))}
      </AnimatedList>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0a0a0a]" />
    </div>
  );
}
