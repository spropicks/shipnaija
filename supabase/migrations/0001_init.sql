-- ShipNaija.dev — initial schema (M0)
-- Run in Supabase SQL editor or via supabase db push.

-- =========================================================
-- profiles: synced from Clerk via /api/webhooks/clerk
-- =========================================================
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text unique not null,
  handle text unique not null,
  display_name text not null,
  bio text,
  avatar_url text,
  location text,
  tech_stack text[] default '{}',
  twitter_url text,
  github_url text,
  website_url text,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  created_at timestamptz not null default now()
);

-- =========================================================
-- projects
-- =========================================================
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  slug text unique not null,
  name text not null,
  tagline text,
  description text,
  logo_url text,
  demo_url text,
  repo_url text,
  tech_stack text[] default '{}',
  status text not null default 'building'
    check (status in ('building', 'launched', 'paused')),
  created_at timestamptz not null default now()
);

-- =========================================================
-- build_logs: daily build-in-public updates
-- =========================================================
create table if not exists build_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  author_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  image_url text,
  link_url text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- likes: polymorphic over build_log / project / comment
-- =========================================================
create table if not exists likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  target_type text not null
    check (target_type in ('build_log', 'project', 'comment')),
  target_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, target_type, target_id)
);

-- =========================================================
-- comments: polymorphic over build_log / project, 1-level replies
-- =========================================================
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  target_type text not null
    check (target_type in ('build_log', 'project')),
  target_id uuid not null,
  content text not null,
  parent_comment_id uuid references comments(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- =========================================================
-- weekly ship challenges
-- =========================================================
create table if not exists challenges (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  theme text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists challenge_entries (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references challenges(id) on delete cascade,
  project_id uuid not null references projects(id) on delete cascade,
  builder_id uuid not null references profiles(id) on delete cascade,
  submission_note text,
  submitted_at timestamptz not null default now(),
  is_winner boolean not null default false,
  unique (challenge_id, project_id)
);

-- =========================================================
-- Indexes
-- =========================================================
create index if not exists idx_build_logs_project on build_logs(project_id, created_at desc);
create index if not exists idx_build_logs_author on build_logs(author_id, created_at desc);
create index if not exists idx_build_logs_created on build_logs(created_at desc);
create index if not exists idx_likes_target on likes(target_type, target_id);
create index if not exists idx_comments_target on comments(target_type, target_id, created_at);
create index if not exists idx_projects_owner on projects(owner_id);

-- =========================================================
-- RLS: everything publicly readable (build in public!),
-- writes only through the app's service role for M0.
-- (Per-user RLS with Clerk JWTs comes in M1.)
-- =========================================================
alter table profiles enable row level security;
alter table projects enable row level security;
alter table build_logs enable row level security;
alter table likes enable row level security;
alter table comments enable row level security;
alter table challenges enable row level security;
alter table challenge_entries enable row level security;

create policy "public read profiles" on profiles for select using (true);
create policy "public read projects" on projects for select using (true);
create policy "public read build_logs" on build_logs for select using (true);
create policy "public read likes" on likes for select using (true);
create policy "public read comments" on comments for select using (true);
create policy "public read challenges" on challenges for select using (true);
create policy "public read challenge_entries" on challenge_entries for select using (true);
