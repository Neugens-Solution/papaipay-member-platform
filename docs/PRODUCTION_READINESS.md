# Production Readiness Checklist

Use this checklist before merging release work and after every production or preview deployment.

## Platform health

- Supabase project is active and not paused.
- Supabase database health has been confirmed before UAT or demo sessions.
- CI is green before merge.

## Required Vercel environment variables

Configure these variables in Production and Preview environments:

- `DATABASE_URL`
- `DIRECT_DATABASE_URL`
- `AUTH_SESSION_SECRET`
- `NEXTAUTH_SECRET`
- `BLOB_READ_WRITE_TOKEN`

`AUTH_SESSION_SECRET` is preferred for custom portal sessions. `NEXTAUTH_SECRET` is also supported. Set both session-secret variables to the same strong random value to avoid deployment mistakes.

## Data safety

- Never use demo seed scripts in production.
- UAT demo data must require an explicit allow flag before it can run.

## Post-deployment smoke test

Run the production readiness check and manually verify these routes after every deployment:

- `/login`
- `/member/login`
- `/member/signup`
- `/member/dashboard`
- `/member/opportunities`
- `/admin/login`
- `/admin/dashboard`
- `/admin/listings`

## Authentication checks

- Confirm member login works after deployment.
- Confirm admin login works after deployment.
