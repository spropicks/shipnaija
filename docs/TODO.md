# ShipNaija.dev — TODO / Backlog

Living backlog of work not yet done. Ordered roughly by priority within each
section. Last updated: 2026-07-23.

Context: MVP (M0–M4) is built and deployed on Vercel (production = `main`).
A hardening pass shipped (security/XSS, crash guards, form UX/a11y, streak
decay fix, project delete, onboarding). Logo (WebP) is live in header/footer.

---

## 🔒 Hardening (highest priority)

- [ ] **Per-user RLS (defense-in-depth)** — *recommended next.*
  Today all writes go through the Supabase **service-role** key with app-level
  ownership checks in server actions (solid, but a single layer). Wire
  **Clerk JWT → Supabase third-party auth** and add real per-user RLS policies
  so the database itself enforces "you can only write your own rows."
  - Configure Clerk JWT template / native Supabase integration
  - Add authenticated Supabase client (uses the Clerk token) alongside the
    service client in `lib/supabase/`
  - Write RLS policies: insert/update/delete gated on
    `auth.jwt()->>'sub' = clerk_user_id` (via a join to `profiles`)
  - New migration: `supabase/migrations/0003_rls_write_policies.sql`
- [ ] **Rate limiting** on build logs & comments (spam vector). Options:
  Upstash Redis, or a simple per-user "N per minute" check in the server action.
- [ ] **Streak cron backstop** — streak decay is already correct on read
  (`lib/streak.ts`), but a scheduled job (Vercel Cron / Supabase scheduled fn)
  to zero out lapsed `current_streak` in the DB would keep stored data honest
  for any future direct queries. Nice-to-have, not urgent.

## 🌱 Content / launch readiness

- [ ] **Seed / test data** — generate ~15 fake Nigerian builders + projects +
  build logs so feed / trending / challenges look alive for demos & testing.
  Plan referenced `lib/nigerian-names.ts` + `supabase/seed.sql`.

## ✨ Features (post-MVP)

- [ ] **Image uploads to Supabase Storage** — so build-log screenshots don't
  rely on pasting a URL. Add a bucket + upload flow in the log composer.
- [ ] **Search** — builders / projects / logs.
- [ ] **Follows + notifications** — follow builders; basic activity notifications.
- [ ] **Real-time feed updates** — Supabase Realtime on `build_logs` so the
  feed live-updates without refresh.

## 🎨 Polish / smaller items

- [ ] Consider `next/image` for the logo (currently a pre-optimized `<img>` +
  `public/logo.webp`, 9.6KB — already fine, so low priority).
- [ ] `components/logo.tsx` (`LogoMark` SVG) is currently unused after the
  switch to the raster logo — keep for reuse or delete.
- [ ] Challenge winner selection UI (mark `is_winner`) — no admin flow yet.
- [ ] Onboarding: only reached when profile self-heal fails; consider a fuller
  first-run experience (avatar, bio prompt).

## ✅ Done (recent)

- [x] Hardening pass: stored-XSS fix (`safeExternalUrl`), null-join crash guard,
  webhook handle stability, challenges past-filter, like-race tolerance,
  form pending/error states + a11y labels, mobile stats grid.
- [x] Streak decay fix (`lib/streak.ts`, normalized at data layer).
- [x] Project delete (owner-checked) + Danger zone UI.
- [x] Onboarding page + `claimProfile` action; redirect profile-less users.
- [x] Logo: transparent WebP in header (logo-only, 44px) + footer; SVG badge
  favicon/OG.

## 📌 Loose ends / reminders

- [ ] **Rotate the GitHub personal access token** that was shared in chat
  (GitHub → Settings → Developer settings → PATs). Use `gh auth login` or a
  git credential helper going forward so tokens never touch chat.
- [ ] Original 1.4MB `public/logo.png` was removed from the tree but remains in
  git history (commit `4fdf93e`) if a full-res source is ever needed.
- [ ] `.env.local` is gitignored — production env vars live in Vercel.
