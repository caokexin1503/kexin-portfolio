# Kexin Cao — Portfolio

A production-ready personal portfolio and project-management platform, built with Next.js. Projects, experience, education, skills, and site settings all live in a database and are edited through a private admin dashboard — no code changes needed to add a new project.

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Auth.js v5 (NextAuth), single-admin credentials login, JWT sessions, bcrypt password hashing
- **Media storage:** Supabase Storage (production) with a local-filesystem fallback for development
- **Validation:** Zod
- **Forms:** react-hook-form
- **Markdown/rich content:** react-markdown + remark-gfm + remark-math + rehype-katex (LaTeX support)
- **Deployment target:** Vercel

## Architecture Notes

A few deliberate deviations from a "textbook" CMS schema, worth knowing about:

- **`technologies` is a native Postgres `String[]`** on `Project`/`Experience`, not a join table. Simpler CRUD for a single-admin CMS; trivial to normalize into its own table later if you ever need per-technology pages.
- **`ProjectResource` and `ProjectMedia` are flexible join tables** instead of fixed `githubUrl`/`liveDemoUrl`/... columns on `Project`. Not every project has a live demo, and some projects need more than one link of the same kind.
- **Contact form submissions are stored in Postgres** (`ContactMessage`), not emailed. This means no SMTP/email-provider credentials exist anywhere in the app — read messages from `/admin/messages`.
- **Large file uploads (video, zip builds) go directly from the browser to Supabase Storage** via a short-lived signed URL, bypassing the Next.js server entirely. Vercel Serverless Functions cap request bodies well below what a screen recording or Unity build needs; this sidesteps that limit. See `lib/actions/upload.ts` and `lib/upload-client.ts`.
- **Content pages are rendered dynamically** (`export const dynamic = "force-dynamic"`), not statically cached, so admin edits show up immediately without a redeploy.

## Philosophy / Meaning-of-Life Timeline

`/projects/philosophy` is a narrative entry point nested under Projects: a timeline of philosophers (Socrates → Camus) where most render as plain historical markers, and a couple are clickable — posing a core question, a personal interpretation, and a link to the real project that interpretation connects to. It's reachable via an intro teaser at the top of `/projects` ("Explore the Timeline →") and does not add a new top-level nav item.

- **Data:** `data/philosophers.ts` — add a philosopher by adding one object to the array; no component changes needed. Set `clickable: true` and a `projectSlug` (a real `Project.slug`) to make one explorable with a project card; leave `clickable: false` for a plain timeline marker.
- **Map regions/era colors:** `lib/philosophy-visuals.ts` — pin coordinates and color washes are deliberately non-literal (a stylized backdrop, not a real map tile service), so adding a new region just means adding one coordinate pair.
- **Components:** `components/Philosophy/*` — `PhilosophyIntro` (teaser), `PhilosophyTimeline`/`TimelineNode` (the list), `PhilosopherScene`/`HistoricalMap`/`PhilosopherPanel` (the immersive detail view), `PhilosophyProjectCard` (pulls real project data by slug — never duplicates project content).
- Project cards fetch title/description/technologies live from Postgres by slug (`app/(site)/projects/philosophy/page.tsx`), so editing a project's copy in `/admin/projects` updates its philosophy-panel card too.
- Uses `framer-motion` (the only new dependency this feature added) and a `Fraunces` serif display font loaded in `app/layout.tsx`, scoped to this section via the `.font-serif-display` class so the rest of the site's typography is unchanged.

## Folder Structure

```
app/
  (site)/            Public pages (home, about, projects, experience, contact)
  admin/
    login/           Public login page (no sidebar)
    (dashboard)/     Everything else under /admin — protected by proxy.ts
  api/auth/          Auth.js route handler
  sitemap.ts         Dynamic sitemap (published projects only)
  robots.ts
components/
  ui/                Small hand-rolled primitives (Button, Input, Card, ...)
  layout/            Header, Footer, theme toggle, mobile nav
  projects/          Project card/grid/gallery/markdown renderer/resources
  admin/             Admin-only forms, upload widgets, confirm dialogs
lib/
  actions/           Server Actions (all mutations) — each starts with requireAdmin()
  auth.ts / auth.config.ts   Auth.js config (split so middleware stays Edge-safe)
  storage.ts         Supabase Storage helpers (server-only)
  upload-client.ts   Browser-side upload orchestration
  validation.ts      Zod schemas
prisma/
  schema.prisma
  seed.ts            Seeds the admin user + real résumé-sourced content
```

`proxy.ts` (Next.js 16's renamed `middleware.ts`) protects every `/admin/*` route except `/admin/login`.

## Local Setup

```bash
npm install
```

Copy `.env.example` to `.env` and fill in the values (see below). Then:

```bash
npm run db:migrate   # applies the Prisma schema to your database
npm run db:seed      # creates the admin user + seeds résumé-sourced content
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login` for the dashboard.

### Environment variables

See `.env.example` for the full list with inline explanations. Summary:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` / `DIRECT_URL` | Postgres connection (pooled / direct-for-migrations) |
| `AUTH_SECRET` | Session encryption secret — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Base URL of the deployment |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Consumed once by `npm run db:seed` to create the single admin user |
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project + public anon key (safe to expose — it's the standard client-side key) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only.** Used to mint signed upload URLs and manage storage. Never expose to the client. |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL used by the sitemap, robots.txt, and Open Graph tags |

**Local development without Supabase:** leave the three `SUPABASE_*` variables blank and uploads automatically fall back to writing into `public/uploads/` on disk. This is dev-only — configure Supabase before deploying.

### Database setup

Any Postgres works. This project was built and tested against a local PostgreSQL 16 instance (installed via `brew install postgresql@16`, matching `.env`'s `DATABASE_URL`). It's *not* registered as a `brew services` login item, so after a reboot start it with:

```bash
LC_ALL="en_US.UTF-8" /opt/homebrew/opt/postgresql@16/bin/pg_ctl -D /opt/homebrew/var/postgresql@16 -l /tmp/pg16.log start
```

(or run `brew services start postgresql@16` if you'd rather it start automatically at login).

For production, [Supabase](https://supabase.com) is recommended since it gives you Postgres *and* object storage from one account:

1. Create a Supabase project.
2. In **Project Settings → Database**, copy the **Transaction pooler** connection string (port 6543) into `DATABASE_URL`, and the **Session** connection string (port 5432) into `DIRECT_URL`.
3. In **Project Settings → API**, copy the **Project URL** into `NEXT_PUBLIC_SUPABASE_URL`, the **anon public** key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and the **service_role** key into `SUPABASE_SERVICE_ROLE_KEY`.
4. Run `npm run db:migrate` (or `npm run db:deploy` in CI/production — see below) against that database.
5. The storage bucket (`portfolio-media`) is created automatically on first upload; see `ensureBucketExists()` in `lib/storage.ts` if you want to create it manually in the Supabase dashboard first (set it **public**, since served images/PDFs/downloads need public read access — writes still require the service role key).

### Prisma commands

```bash
npm run db:migrate    # create + apply a new migration (dev)
npm run db:deploy     # apply existing migrations (production/CI)
npm run db:generate   # regenerate the Prisma client
npm run db:seed       # (re)seed the admin user + starter content
npm run db:studio     # open Prisma Studio to browse data
```

### Creating the admin account

There is no sign-up page anywhere in this app by design. The single admin user is created by `npm run db:seed`, which reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` from the environment and upserts that one `User` row. To change the password later, either re-run the seed with new values or update it directly (hash it with bcrypt first — never store a plaintext password).

## Development

```bash
npm run dev         # start the dev server
npm run typecheck   # tsc --noEmit
npm run lint         # eslint
npm run build        # production build
npm run start        # run the production build locally
```

## Deployment (Vercel)

1. Push this repository to GitHub.
2. Import it into Vercel.
3. Add all the environment variables from `.env.example` in the Vercel project settings (use your Supabase production values, a freshly generated `AUTH_SECRET`, and set `NEXTAUTH_URL` / `NEXT_PUBLIC_SITE_URL` to your production domain).
4. Add a **Build Command** override if you want migrations to run automatically on deploy: `npm run db:deploy && next build`. Otherwise run `npm run db:deploy` manually against production before the first deploy.
5. Deploy. Run `npm run db:seed` once (locally, pointed at the production `DATABASE_URL`, or via a one-off Vercel CLI invocation) to create the admin user.

### Custom domain

Add the domain in Vercel's project settings and follow its DNS instructions. Afterwards, update `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` to the new domain and redeploy — these two variables drive the sitemap, canonical URLs, Open Graph tags, and Auth.js callback URLs.

## Content Workflows

### Add a project

1. Log in at `/admin/login`.
2. **Projects → New Project.**
3. Fill in the title (the slug auto-fills — edit it if you want a different URL), short description, category, status, technologies, and dates.
4. Upload a cover image, write the case-study body in Markdown (headings like `## Overview`, `## Approach`, `## Results` are just conventions — use whatever structure fits), add quantitative **Results** cards, **Resources** (GitHub / live demo / video / docs / download links), and gallery screenshots.
5. **Save Draft** to keep working on it privately, **Preview** to see the real page (visible only to you while unpublished), or **Publish** to make it public.

### Edit or unpublish a project

**Projects** list → click a title to edit, or use the row actions to toggle **Featured**, toggle **Published**, **Duplicate**, or **Delete** (with confirmation) without opening the editor.

### Upload files

Every upload button in the admin (cover images, gallery items, resource files, favicon) goes through the same flow: if Supabase is configured, the file is validated then uploaded directly from your browser to Supabase Storage via a signed URL; a public URL is returned immediately for the field it belongs to. In local dev without Supabase, files are written to `public/uploads/`. Downloadable files are only ever stored and linked — nothing uploaded is ever executed by the server.

For very large files (big Unity builds, long videos), consider hosting them externally (GitHub Releases, itch.io) and pasting that URL into a **Download** or **Video** resource instead of uploading — the resource system doesn't care where the URL points.

### Update social links / bio / SEO defaults

All of it lives on **Settings** — name, headline, bio, email, GitHub/LinkedIn/X/website URLs, profile photo, SEO title/description, and favicon. These are read from one place and used everywhere (header, footer, homepage, metadata), so there's nothing hardcoded to update in multiple components.

## Security

- No public registration route exists anywhere in the codebase.
- Every `/admin/*` route is gated by `proxy.ts` (Edge middleware); every mutating Server Action independently re-checks the session via `requireAdmin()` as defense in depth.
- Passwords are hashed with bcrypt; sessions are signed JWTs.
- Uploads are validated by MIME type and size on the server before a signed URL is ever issued; uploaded files are stored and served, never executed.
- Draft projects return a real `404` to unauthenticated visitors (verified — see note below) and are excluded from the sitemap and from search-engine indexing (`noindex` metadata).
- `trustHost: true` is set in the Auth.js config, which is required for `next start` outside Vercel (Vercel sets host trust automatically). If you self-host behind your own reverse proxy, make sure that proxy sets `X-Forwarded-Host` correctly, since Auth.js trusts it.

**A note on `notFound()` and `loading.tsx`:** Next.js's App Router streams a route's HTML, and a parent segment's `loading.tsx` creates a Suspense boundary around everything beneath it. If a deeper page later calls `notFound()`, the *shell* (and its 200 status) may already have been flushed, so the correct not-found UI renders but the HTTP status can end up `200` instead of `404` (a "soft 404"). This was caught and fixed during development by removing the `/projects` segment's `loading.tsx` — `/projects/[slug]` now correctly returns `404` for drafts and nonexistent slugs. Keep this in mind if you add a `loading.tsx` anywhere upstream of a route that calls `notFound()`.

### Known upstream advisory (informational, no action needed)

`npm audit` reports a handful of high-severity advisories inside `@prisma/config`'s own dependency tree (a `deepmerge-ts` transitive dependency used by Prisma's CLI config loader). This affects only local CLI tooling (`prisma migrate`, `prisma studio`), not the deployed application's runtime — it isn't reachable by anything the deployed site does. It's a known issue across current Prisma releases as of this writing; the schema was pinned to Prisma `6.19.3` (rather than the `8.0.0-rc` tagged `latest`) specifically to avoid a *worse* set of vulnerable dev-only dependencies (`alchemy`/`hono`) that ship with Prisma's newer release-candidate CLI tooling.

## Testing Performed

- Full CRUD verified end-to-end for projects (create → results/resources → save draft → publish → feature toggle → duplicate → delete), experience, education, skills, and settings, including checking the underlying database rows.
- Draft/publish visibility verified via direct HTTP requests (no session cookie): drafts and nonexistent slugs return `404`; published projects return `200`.
- Auth flow verified: login, protected `/admin/*` redirect when logged out, logout.
- Contact form verified end-to-end (submission → database row → visible in `/admin/messages`).
- Dark mode, responsive mobile layout, and admin mobile drawer verified visually.
- `npm run build`, `npm run typecheck`, and `npm run lint` all pass cleanly.

## Remaining TODOs / Future Extensibility

These were intentionally left as extension points rather than guessed at:

- **Expected graduation date** on the seeded Education entry — add it in `/admin/education` once known.
- **GitHub repo links** for the Minichess/Social-Network-Analysis/Text-Based-Game projects — add via `/admin/projects` once the repos are public.
- **Analytics** (Vercel Analytics / Plausible / GA) — not wired up; nothing in the architecture blocks adding it to `app/layout.tsx`.
- **GitHub API integration** (auto-pulling stars/last-commit) — `ProjectResource` already stores the repo URL; this would be an additive feature.
- **Multiple administrators** — the `User` model has no `role` field yet; adding one and updating `authorize()` in `lib/auth.ts` would be enough.
- **Blog / publications / awards** — not implemented; nothing in the schema or routing prevents adding new top-level models and routes later.
