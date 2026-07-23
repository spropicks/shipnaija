// Unified avatar: renders the image if present, else initials on a green tint.
// `size` is the pixel dimension (default 40). Consistent across feed, cards,
// leaderboards — replaces the ad-hoc h-8/w-8 / size-9 / h-12 markup.
export function Avatar({
  src,
  name,
  size = 40,
  className = "",
}: {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}) {
  const dim = { width: size, height: size };

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        style={dim}
        className={`shrink-0 rounded-full border border-white/10 object-cover ${className}`}
      />
    );
  }

  return (
    <div
      style={{ ...dim, fontSize: Math.round(size * 0.4) }}
      className={`grid shrink-0 place-items-center rounded-full border border-white/10 bg-green-500/15 font-semibold text-green-300 ${className}`}
      aria-hidden="true"
    >
      {(name || "?").slice(0, 1).toUpperCase()}
    </div>
  );
}
