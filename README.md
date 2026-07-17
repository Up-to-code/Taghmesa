# Taghmesa Store

Next.js App Router storefront with a Hono API, Neon PostgreSQL, Drizzle ORM, Better Auth, and Vercel Blob product media.

## Repository layout

The repository root is the only production application and Vercel deploys it with the Next.js framework adapter. Active code is organized under `app/`, `domains/`, `components/`, `hooks/`, `lib/`, and `scripts/`; runtime assets live under `public/`.

The previous PHP storefront, static prototypes, conversion tools, and source assets are preserved under `legacy/` for reference. Vercel excludes that directory through `.vercelignore`.

## Local setup

1. Copy `.env.example` to `.env.local` and configure `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `BLOB_READ_WRITE_TOKEN`.
2. Install dependencies with `npm install`.
3. Create the schema with `npm run db:migrate`.
4. Set `INITIAL_ADMIN_EMAIL`, `INITIAL_ADMIN_NAME`, and `INITIAL_ADMIN_PASSWORD`, then run `npm run db:seed`.
5. Start with `npm run dev` and open `http://localhost:3000`.

The public storefront uses the bundled catalog and local `/public/products` images when `DATABASE_URL` is absent. Authentication, checkout, account, and admin requests require PostgreSQL and report a configuration error until it is configured.

## Authentication and authorization

Better Auth owns the shared `user`, `session`, `account`, and `verification` tables. Customers can create an email/password account at `/register` and sign in at `/login`. The Better Auth admin plugin adds role, ban, and impersonation support; storefront accounts receive the `user` role and only users with the `admin` role can access `/admin/*` pages or `/api/admin/*` endpoints.

The seed command creates the configured admin through Better Auth, or promotes an existing account with the same email. The old `admin_users` and `admin_sessions` tables remain in the database for a non-destructive transition but are no longer consulted by the application. Existing username-only administrators must use the configured `INITIAL_ADMIN_EMAIL` and rerun the seed once after applying migration `0001`.

## Existing MySQL migration

After applying the PostgreSQL migration, set both `SOURCE_DATABASE_URL` and `DATABASE_URL`, then run `npm run db:import-mysql`. Product and order IDs, items, and timestamps are preserved. Legacy admin records are retained only for transition safety; run `npm run db:seed` afterward to create the Better Auth administrator configured by `INITIAL_ADMIN_EMAIL`. Upload replacement product images through the admin interface to move them to Vercel Blob.

## Vercel deployment

The included `vercel.json` explicitly selects Next.js; do not configure a custom output directory or a rewrite for `/`. Connect a Neon database and public Vercel Blob store to the project. Add `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `BETTER_AUTH_URL`, and a strong `BETTER_AUTH_SECRET` to all required Vercel environments, then redeploy so the deployment receives them. Run migrations and the seed/import command once against production before enabling authentication or checkout.

A Vercel-branded `404: NOT_FOUND` for a deployment-specific URL means that deployment is unavailable or failed. It is not the application's `/` route. Open the latest successful deployment or the project's production domain after redeploying.

Cash on delivery is the only enabled payment method. Card, Apple Pay, and contact delivery are deliberately non-functional parity placeholders.

## Quality gates

Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e`, and `npm run build` before deployment. The Playwright suite uses local Chrome; set `E2E_ADMIN_EMAIL` and `E2E_ADMIN_PASSWORD` to enable the database-dependent login scenario. Legacy PHP and generated HTML files remain in the repository for parity comparison and can be archived after preview acceptance.
