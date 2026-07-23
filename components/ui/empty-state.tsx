import Link from "next/link";

// Polished empty state: optional lucide icon, title, description, and CTA —
// replaces the plain "No X yet 🚢" one-liners across interior pages.
export function EmptyState({
  icon: Icon,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-16 text-center">
      {Icon ? (
        <span className="mb-4 grid size-12 place-items-center rounded-xl border border-green-400/15 bg-green-400/[0.07] text-green-300">
          <Icon className="size-5" />
        </span>
      ) : null}
      <p className="text-base font-medium text-white/80">{title}</p>
      {description ? (
        <p className="mt-1 max-w-sm text-sm leading-6 text-white/45">{description}</p>
      ) : null}
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-6 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-green-100"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
