// Small KPI tile for detail-page stat rows (streak, projects, likes, etc).
// Pass an icon to brand the tile; renders a fallback rounded bg if omitted.
export function StatTile({
  icon: Icon,
  label,
  value,
  tone = "default",
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  tone?: "default" | "warn" | "accent";
}) {
  const toneCls =
    tone === "warn"
      ? "text-orange-400"
      : tone === "accent"
      ? "text-green-400"
      : "text-white";
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">
      {Icon ? (
        <span className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/50">
          <Icon className="size-4" />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">{label}</p>
        <p className={`truncate text-base font-semibold ${toneCls}`}>{value}</p>
      </div>
    </div>
  );
}
