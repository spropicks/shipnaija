-- 0003: onboarding tracking on profiles
--
-- onboarded_at is null for a fresh user (created via Clerk webhook / self-heal
-- with no profile work done). It gets stamped on:
--   - updateProfile (any meaningful profile edit marks them onboarded)
--   - skipOnboarding (explicit "Skip for now" CTA on the welcome banner/page)
--   - claimProfile (handle-collision fallback path)
-- The dashboard and header read this column to decide whether to surface the
-- Welcome banner / "Complete setup" CTA.

alter table profiles add column if not exists onboarded_at timestamptz;

-- Backfill: existing users who have any real profile content (bio, location,
-- tech stack, or links) are considered onboarded so we don't surprise them
-- with a banner on next login.
update profiles
  set onboarded_at = coalesce(onboarded_at, now())
where onboarded_at is null
  and (
    bio is not null
    or location is not null
    or coalesce(array_length(tech_stack, 1), 0) > 0
    or twitter_url is not null
    or github_url is not null
    or website_url is not null
  );
