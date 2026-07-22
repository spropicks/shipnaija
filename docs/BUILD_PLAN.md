# ShipNaija.dev — Build Plan v1

**One-liner:** A Nigerian build-in-public community where solo developers share what they're building every day and help each other ship products faster.

**Positioning:** Indie Hackers + Product Hunt + build-in-public Twitter — for the Nigerian ecosystem.

---

## 1. MVP Scope

| Feature | Description | Priority |
|---|---|---|
| Auth (Clerk) | Google, GitHub, email sign-in | P0 |
| Builder profiles | Handle, bio, avatar, location, stack, links (X/GitHub/site), streak stats | P0 |
| Project showcase | Project page: name, tagline, description, logo, link, tech stack, status | P0 |
| Daily build logs | Short updates (text + optional image/link) attached to a project | P0 |
| Likes & comments | On build logs and projects | P0 |
| Trending / leaderboard | Trending projects + top builders (streaks, engagement) | P1 |
| Weekly ship challenge | Challenge page: theme, participants, submissions, winners | P1 |

Explicitly **out of MVP**: DMs, teams/collabs matching, notifications beyond basics, mobile app, monetization.

---

## 2. Tech Stack

- **Next.js 15 (App Router)** — RSC-first, server actions for mutations
- **Supabase** — Postgres + Realtime (live feed/likes) + Storage (avatars, log images)
- **Clerk** — auth (Google, GitHub, email); Clerk webhook syncs users into Supabase
- **Tailwind CSS + shadcn/ui** — base UI system
- **React Bits + Magic UI (via MCP)** — animated components, hero effects, motion blocks for a premium feel
- **Vercel** — deployment + analytics

### Clerk ↔ Supabase integration pattern
- Clerk is the source of truth for identity. A Clerk webhook (`user.created` / `user.updated`) upserts into `profiles`.
- Supabase RLS uses Clerk JWTs (Clerk's native Supabase integration — third-party auth, `auth.jwt()->>'sub'` = Clerk user id).

---

## 3. Data Model (Supabase / Postgres)

```sql
-- profiles: synced from Clerk
profiles (
  id uuid pk default gen_random_uuid(),
  clerk_user_id text unique not null,
  handle text unique not null,          -- @username
  display_name text not null,
  bio text,
  avatar_url text,
  location text,                        -- e.g. Lagos, Abuja, remote
  tech_stack text[],
  twitter_url text, github_url text, website_url text,
  current_streak int default 0,
  longest_streak int default 0,
  created_at timestamptz default now()
)

projects (
  id uuid pk,
  owner_id uuid fk -> profiles.id,
  slug text unique not null,
  name text not null,
  tagline text,                         -- one-liner
  description text,                     -- markdown
  logo_url text,
  demo_url text, repo_url text,
  tech_stack text[],
  status text check (status in ('building','launched','paused')) default 'building',
  created_at timestamptz default now()
)

build_logs (
  id uuid pk,
  project_id uuid fk -> projects.id,
  author_id uuid fk -> profiles.id,
  content text not null,                -- short update, markdown-lite
  image_url text,
  link_url text,
  created_at timestamptz default now()
)

likes (
  id uuid pk,
  user_id uuid fk -> profiles.id,
  target_type text check (target_type in ('build_log','project','comment')),
  target_id uuid not null,
  created_at timestamptz default now(),
  unique (user_id, target_type, target_id)
)

comments (
  id uuid pk,
  author_id uuid fk -> profiles.id,
  target_type text check (target_type in ('build_log','project')),
  target_id uuid not null,
  content text not null,
  parent_comment_id uuid null fk -> comments.id,   -- 1-level replies
  created_at timestamptz default now()
)

challenges (
  id uuid pk,
  slug text unique,
  title text not null,                  -- e.g. "Ship a landing page week"
  theme text,
  starts_at timestamptz, ends_at timestamptz,
  created_at timestamptz default now()
)

challenge_entries (
  id uuid pk,
  challenge_id uuid fk -> challenges.id,
  project_id uuid fk -> projects.id,
  builder_id uuid fk -> profiles.id,
  submission_note text,
  submitted_at timestamptz,
  is_winner boolean default false,
  unique (challenge_id, project_id)
)
```

**Derived/leaderboard logic** (SQL views or scheduled function):
- `trending_projects`: engagement score = likes + 2×comments + 3×log_frequency over trailing 7 days
- `top_builders`: streak length + engagement received
- Streaks recomputed on each build log insert (server action or Postgres trigger).

---

## 4. App Structure (Next.js App Router)

```
app/
  (marketing)/page.tsx            # landing page — hero w/ Magic UI effects
  feed/page.tsx                   # main build-log feed (realtime)
  builders/page.tsx               # directory + leaderboard
  builders/[handle]/page.tsx      # profile
  projects/page.tsx               # showcase grid
  projects/[slug]/page.tsx        # project page + its build logs
  challenges/page.tsx             # current + past challenges
  challenges/[slug]/page.tsx      # challenge detail + entries
  new/ (project, log)             # creation flows
  api/webhooks/clerk/route.ts     # Clerk -> Supabase sync
lib/ (supabase clients, queries, scoring)
components/ (ui/, feed/, profile/, ...)
```

---

## 5. Milestones

1. **M0 — Foundation (repo + scaffold):** Next.js 15 + Tailwind + shadcn/ui + Clerk wired, Supabase project + schema + RLS, Clerk webhook sync, deploy skeleton to Vercel.
2. **M1 — Identity & projects:** profiles, project CRUD + showcase grid, project pages.
3. **M2 — Build-in-public core:** build logs, feed (with Supabase Realtime), likes, comments.
4. **M3 — Community energy:** trending/leaderboard, streaks, weekly challenge pages.
5. **M4 — Polish & launch:** Magic UI/React Bits pass on landing + key pages, OG images, SEO, empty states, launch on X + Nigerian dev communities.

---

## 6. How we'll build it from PromptQL

- **Planning, specs, schema, reviews, tracking** — here in this project.
- **Actual coding** — delegate to a coding agent (Claude Code / Codex) connected via a Secure Computer Agent Server (SCAS) running on your machine. That agent will also be able to use the React Bits and Magic UI MCP servers directly for component generation.
- **GitHub** — your `github` integration is connected (account `spropicks`); I can create the `shipnaija` repo and seed it with this plan, schema SQL, and scaffold config.
