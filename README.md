# ShipNaija.dev 🇳🇬🚢

**A Nigerian build-in-public community where solo developers share what they're building every day and help each other ship products faster.**

Think **Indie Hackers + Product Hunt + build-in-public Twitter** — focused on the Nigerian ecosystem.

## What builders can do

- Create a profile
- Add the project they're building
- Post short daily updates (build logs)
- Get likes, comments, and feedback from other builders
- Join weekly shipping challenges
- Appear on a trending builders/projects leaderboard

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router)
- [Supabase](https://supabase.com) — Postgres + Realtime + Storage
- [Clerk](https://clerk.com) — authentication (Google, GitHub, email)
- [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- [React Bits](https://reactbits.dev) + [Magic UI](https://magicui.design) — animated components & effects
- [Vercel](https://vercel.com) — deployment

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up environment** — copy `.env.example` to `.env.local` and fill in:
   - Clerk keys from the [Clerk dashboard](https://dashboard.clerk.com)
   - Supabase URL + keys from your [Supabase project settings](https://supabase.com/dashboard)

3. **Set up the database** — run `supabase/migrations/0001_init.sql` in the Supabase SQL editor.

4. **Set up the Clerk webhook** — in Clerk Dashboard → Webhooks, add an endpoint pointing to
   `https://<your-domain>/api/webhooks/clerk` subscribed to `user.created`, `user.updated`,
   `user.deleted`, and put its signing secret in `CLERK_WEBHOOK_SIGNING_SECRET`.

5. **Run the dev server**

   ```bash
   npm run dev
   ```

## Roadmap

See [docs/BUILD_PLAN.md](docs/BUILD_PLAN.md) for the full build plan and milestones.

| Milestone | Focus |
|---|---|
| M0 | Foundation: scaffold, auth, schema, deploy |
| M1 | Identity & projects: profiles, project showcase |
| M2 | Build-in-public core: build logs, feed, likes, comments |
| M3 | Community energy: trending, streaks, weekly challenges |
| M4 | Polish & launch |

---

Made with 🧡 by Nigerian builders, for Nigerian builders.
