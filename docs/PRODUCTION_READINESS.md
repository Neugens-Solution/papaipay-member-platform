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
- `PRIVATE_BLOB_READ_WRITE_TOKEN`

`AUTH_SESSION_SECRET` is preferred for custom portal sessions. `NEXTAUTH_SECRET` is also supported. Set both session-secret variables to the same strong random value to avoid deployment mistakes.

Use two Blob stores: a Public store for listing media and a separate Private store for member IC documents and payment receipts. Never point both token variables to the same public store.

## Database release

- Review the committed Prisma migration before release.
- Manual receipt migration `20260803000000_add_manual_payment_receipts` was applied and verified on 2026-08-03 against Supabase project `papaipay-portal` (`wljglgkulhibsxvtdvkf`).
- Confirm the `PaymentReceipt` file purpose and manual receipt columns still exist after restoring or cloning the database.
- Run `npx prisma migrate deploy` against `DIRECT_DATABASE_URL` for any future committed migrations before sending live traffic to a new build.
- Do not use `prisma db push` against Production.

## Data safety

- Never use demo seed scripts in production.
- UAT demo data must require an explicit allow flag before it can run.

## Post-deployment smoke test

Run the production readiness check and manually verify these routes after every deployment:

- `/login`
- `/`
- `/member/login`
- `/member/signup`
- `/member/dashboard`
- `/member/opportunities`
- `/member/profile`
- `/member/participations/[known-uat-id]`
- `/admin/login`
- `/admin/dashboard`
- `/admin/listings`
- `/admin/members`
- `/admin/distributions`

## Authentication checks

- Confirm member login works after deployment.
- Confirm admin login works after deployment.
- Confirm an unauthenticated visitor cannot open `/files/[known-private-file-id]`.
- Confirm a member can open only their own IC/receipt documents.
- Confirm an active admin can review the same documents.

## Final manual-flow UAT (after domain activation)

Run this full client UAT on `https://www.kassetventures.com` after DNS and HTTPS are active. Domain activation is not blocked by this UAT; the UAT is the post-domain acceptance gate before normal member use.

- Member uploads IC front and back, and status becomes Pending.
- Admin approves the IC submission or requests resubmission with a reason.
- Unapproved member participation is blocked.
- Approved member creates a participation and receives a Pending Payment record.
- Member uploads a JPG, PNG, or PDF receipt (maximum 5MB) with bank reference.
- Payment becomes Processing and appears in the project workspace review queue.
- Admin opens the receipt before confirming the manual payment.
- Confirmation changes payment to Succeeded and participation to Confirmed.
- No action in the portal initiates a bank transfer, gateway payment, or e-KYC call.

## Domain and SEO

- Point `www.kassetventures.com` after the production deployment, migration, and private Blob store are ready.
- Run the final manual-flow UAT on the live domain before inviting members to use the portal normally.
- Verify `/robots.txt`, `/sitemap.xml`, `/opengraph-image`, canonical metadata, and HTTPS on the final domain.
- Keep the Vercel deployment domain available during DNS propagation and certificate provisioning.
