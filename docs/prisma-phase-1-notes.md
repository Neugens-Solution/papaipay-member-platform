# PAPAIPAY Portal V1 Prisma Phase 1 Notes

This Phase 1 pass adds the database and ORM foundation only.

## Scope

- Prisma schema foundation is added for future Supabase PostgreSQL usage.
- Prisma client package references and scripts are added for future local setup.
- Seed data is provided for local development once dependencies and a database URL are available.
- Member and Admin UI pages continue reading existing local sample data.
- No auth flow is implemented.
- No payment gateway is connected.
- No e-KYC provider is connected.
- No file upload flow is implemented.
- No server actions or API routes are added.

## Connection templates

Supabase PostgreSQL credentials should be configured later using:

- `DATABASE_URL`
- `DIRECT_DATABASE_URL`

Real secrets must never be committed.

## Schema notes

- Internal model IDs use UUID strings.
- Public searchable references use the Phase 0 ID standard catalogue.
- RM amount fields use Prisma `Decimal`.
- Sensitive values are represented as encrypted string columns, but encryption logic is not implemented in this phase.
- Provider responses and callback payloads use redacted `Json` fields plus encrypted full-payload fields when retention is required.
- Settlement cost categories use `Json` fields for the first schema draft.
- Derived campaign values such as remaining amount, progress percentage, days remaining, and gallery count are not primary stored fields.
- Locked settlement and distribution values are stored as snapshots for future reporting and audit consistency.

## Validation expectations

`npx prisma validate` and `npx prisma generate` should run after Prisma packages are available in the environment. These commands do not require a live production database connection.

## Phase 1.1 hardening notes

### Payment retry relationship

Participation now owns a one-to-many relationship with Payment records. This allows one Participation to retain multiple payment attempts for future checkout retry, cancellation, expiry, and reconciliation workflows. A successful payment can confirm the Participation later in a service layer.

```text
Member 1 ── * Participation * ── 1 Campaign
Participation 1 ── * Payment
Payment 1 ── * PaymentWebhookEvent
```

### Provider payload storage policy

Provider payload storage uses a two-field policy:

- Redacted Json payload/response fields are available for operational review.
- Encrypted full payload/response fields retain provider data only when retention is required.

This applies to payment provider responses, payment webhook events, e-KYC provider responses, and e-KYC webhook events. The encryption implementation is intentionally deferred to a later backend phase.

### Referential actions and indexes

Financial and audit-linked records use restrictive referential actions where deletion would risk losing payment, participation, settlement, distribution, or audit context. Optional admin/user action references use `SetNull` so historical records remain available if an admin account is removed.

Lookup indexes are added for common filtering paths such as public statuses, campaign/member foreign keys, distribution processing fields, provider event processing, and audit entity lookup.
