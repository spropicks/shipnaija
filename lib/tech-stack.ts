// Shared curated tech-stack quick-pick list + merge helper. Single source
// of truth for the onboarding form and the profile-edit form.

export const TECH_STACK_PILLS: { category: string; tags: string[] }[] = [
  {
    category: "Frontend",
    tags: ["TypeScript", "JavaScript", "Next.js", "React", "Vue", "Svelte", "Tailwind"],
  },
  {
    category: "Backend",
    tags: ["Node.js", "Python", "Go", "Rust", "PHP", "Laravel"],
  },
  {
    category: "Mobile",
    tags: ["React Native", "Flutter", "Swift", "Kotlin"],
  },
  {
    category: "Infra / Data",
    tags: ["Postgres", "Supabase", "Firebase", "AWS", "Vercel", "Docker", "GraphQL"],
  },
];

// Merge the set of pills the user has toggled with their free-text input.
// Dedupes case-insensitively, preserves the first-seen casing, and caps at
// `cap` items. Returns an array of normalized tag strings ready to submit.
export function mergeStack(
  picked: Iterable<string>,
  freeText: string,
  cap = 12
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (raw: string) => {
    const v = raw.trim();
    if (!v) return;
    const k = v.toLowerCase();
    if (seen.has(k)) return;
    seen.add(k);
    out.push(v);
  };
  for (const p of picked) push(p);
  for (const t of freeText.split(",")) push(t);
  return out.slice(0, cap);
}
