import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Returns a normalized http(s) URL, or null if the input is empty, malformed,
// or uses an unsafe scheme (javascript:, data:, etc.). Use for ANY user-supplied
// URL before storing it or rendering it into an href — prevents stored XSS.
export function safeExternalUrl(raw: string | null | undefined): string | null {
  const value = String(raw ?? "").trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
}
