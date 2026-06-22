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

## Phase 1.2 refinement notes

### Capacity reservation support

Campaign capacity now separates confirmed and reserved totals using `collectedAmountSnapshot` and `reservedAmountSnapshot`. Available amount is derived as campaign target minus those two snapshots. Participation records include reservation and expiry timestamps so future payment checkout logic can hold and release capacity safely.

### Manual KYC V1

Manual KYC is modeled as the V1 verification path through `ManualKycSubmission` and `ManualKycDocument`. Documents link to `FileAsset` so file access controls can be handled by storage policy later. The external `EkycCheck` models remain for a future provider path only.

### Bank account verification

Member bank accounts now include verification status, reviewer, review timestamp, rejection reason, internal notes, and primary-account selection. This supports manual distribution review before a payment record is marked paid.

### Settlement scenarios and holding snapshots

`CampaignSettlement` now records whether a campaign exits successfully or follows the principal-only 24-month scenario. Holding period, holding start, sale completion, and distribution calculation timestamps are stored as settlement snapshots for audit and reporting.

### Planned and locked profit sharing

Campaign records hold planned member/platform percentage settings. Settlement records continue to hold final approved percentages as locked calculation snapshots.

## Phase 1.2 cleanup

Capacity snapshots are non-null Decimal fields with zero defaults, and available amount remains derived from campaign target minus collected and reserved snapshots.

File purposes now distinguish member-uploaded V1 verification files (`ManualKycDocument`) from future provider-based verification files (`ExternalEkycDocument`).
