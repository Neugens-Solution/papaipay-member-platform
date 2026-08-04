# K Asset Ventures Member Portal

K Asset Ventures is a property participation platform brand owned and operated by PICM Sdn Bhd. The public landing page is intended for `https://www.kassetventures.com`; authenticated member and admin workspaces live in the same Next.js application.

## Supported production flow

1. A member creates an account and completes their profile.
2. The member uploads IC front and back for manual identity review.
3. An active admin reviews the private documents and approves the member or requests resubmission.
4. An approved member joins a published opportunity and receives a pending manual-payment record.
5. The member transfers funds outside the portal, then uploads a receipt and bank reference.
6. An admin verifies the receipt and records the manual payment as received.
7. The participation is confirmed and appears in the member portfolio.
8. Distribution calculations and external transfers remain admin-controlled manual operations; the portal records their status and references.

There is no payment gateway, automated payout, or third-party e-KYC integration. The portal records and verifies manual operational steps only.

## Architecture

- Next.js 15 App Router and React 19
- Prisma 6 with PostgreSQL / Supabase
- Signed, HTTP-only custom session cookies with member/admin role guards
- Public Vercel Blob store for listing media
- Separate private Vercel Blob store for IC documents and payment receipts
- Server actions for participation, manual KYC, receipt submission, and admin review

Private file downloads are authorized through `/files/[id]`; raw private Blob URLs are never exposed to members.

## Required environment variables

Copy `.env.example` and configure:

- `DATABASE_URL` — pooled application connection
- `DIRECT_DATABASE_URL` — direct connection used for Prisma migrations
- `AUTH_SESSION_SECRET` and `NEXTAUTH_SECRET` — set both to the same strong random value
- `BLOB_READ_WRITE_TOKEN` — public listing-media Blob store
- `PRIVATE_BLOB_READ_WRITE_TOKEN` — separate private IC/receipt Blob store

## Local checks

Use Node.js 20, matching `.nvmrc` and the production engine.

```bash
npm ci
npx prisma validate
npm run lint
npm test
npm run build
```

Apply committed production migrations with the direct database connection:

```bash
npx prisma migrate deploy
```

See `docs/PRODUCTION_READINESS.md` for the release gate and `docs/uat-demo-script.md` for the final UAT sequence.

## Core references

The portal generates durable references for members, campaigns, participations, payments, distributions, and audit events. A member's Participation Amount is denominated in RM. Holding Return is presented as projected and is not guaranteed; manual distributions are recorded only after the external finance process is complete.
