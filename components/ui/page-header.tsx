// Consistent page title block for interior pages. Matches the homepage's
// refined type (uppercase eyebrow, tight tracking). Optional `children` render
// as a right-aligned toolbar slot (filters, actions).
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-green-400/70">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{title}</h1>
        {subtitle ? (
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">{subtitle}</p>
        ) : null}
      </div>
      {children ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>
      ) : null}
    </div>
  );
}
