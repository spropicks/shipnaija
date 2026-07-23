// ShipNaija logo mark: a code sail (</>) riding a wave. Stroke uses
// currentColor so it inherits the surrounding text color; pass a size via
// className (e.g. "size-5 text-green-300"). Pure SVG — safe in server
// components. For the full green badge (favicon), see app/icon.svg.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* </> code sail */}
      <path d="M27 22 L19 32 L27 42" />
      <path d="M37 22 L45 32 L37 42" />
      <path d="M34 20 L30 44" />
      {/* wave */}
      <path d="M13 51 q6 5 12 0 t12 0 t12 0" />
    </svg>
  );
}
