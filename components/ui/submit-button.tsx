"use client";

import { useFormStatus } from "react-dom";

// Submit button that disables itself while its enclosing <form> is pending,
// preventing double-submits (duplicate comments/logs, double streak bumps).
// Must be rendered inside a <form>.
export function SubmitButton({
  children,
  pendingLabel,
  className,
  disabled,
}: {
  children: React.ReactNode;
  pendingLabel?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className={`${className ?? ""} ${pending || disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      {pending ? pendingLabel ?? children : children}
    </button>
  );
}
