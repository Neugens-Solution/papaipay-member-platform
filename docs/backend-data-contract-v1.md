# PAPAIPAY Portal V1 Backend Data Contract

This is the Phase 0 backend data contract. It freezes core entity boundaries, field ownership, ID formats, enums, and migration principles before any database, auth, payment gateway, or e-KYC implementation begins.

## Scope

This document is planning documentation only.

- No packages are installed.
- No ORM is added.
- No database connection is added.
- No migrations are created.
- No auth, payment gateway, or e-KYC connection is added.
- No runtime behavior changes are introduced.

## Source UI model

The current UI already models these product areas:

- Member profile
- Member Listings / Campaign detail
- Portfolio
- Member Distributions
- Admin Listings
- Admin Listing Form
- Admin Distributions
- Admin Reports
- Activity Log

The backend data contract should preserve the approved terminology: Member, Campaign, Listing, Participation, Participation Amount, Portfolio, Distribution, Principal Return, Holding Return, Profit Distribution, and Final Distribution.

## Required companion documents

- `enum-catalogue-v1.md`
- `id-standard-catalogue-v1.md`
- `field-classification-matrix-v1.md`
- `database-schema-v1.md`

## Entity boundaries

| Domain | Main entities |
| --- | --- |
| Identity | users, members, admin_profiles, roles, permissions |
| Member profile | member_contacts, member_addresses, member_bank_accounts, member_nominees |
| Campaign | campaigns, property_details, campaign_content, campaign_updates, campaign_faqs, campaign_timeline_events |
| Files | files, campaign_media, campaign_documents |
| Participation | participations, payments, payment_webhook_events |
| e-KYC | ekyc_checks, ekyc_webhook_events |
| Settlement | campaign_settlements |
| Distribution | distribution_batches, distributions |
| Operations | audit_logs, reports, notifications, announcements |

## Field ownership rules

### Database fields

Database fields are primary source values entered by users/admins or returned by approved provider flows. Examples:

- Campaign Target
- Minimum Participation Amount
- Maximum Participation Amount
- Campaign Lifecycle Status
- Property Type
- Tenure
- Participation Amount
- Distribution Status
- Payment Reference
- Payment Date

### Derived fields

Derived fields should be calculated by services or queries, not treated as primary source values. Examples:

- Remaining Amount
- Progress Percentage
- Days Remaining
- Gallery Count
- Gross Profit
- Total Costs
- Net Profit

### Snapshot fields

Snapshot fields are calculated values stored after approval/lock so future display and reports remain stable. Examples:

- Principal Return Pool
- Holding Return Pool
- Profit Distribution Pool
- Platform Share
- Final Distribution Pool
- Principal Return
- Holding Return
- Profit Distribution
- Final Distribution Total

### Encrypted fields

Encrypted fields contain sensitive personal or bank data. Examples:

- IC/passport number
- Full bank account number
- e-KYC documents if stored
- sensitive provider callback content where applicable

### File metadata fields

File metadata fields describe storage objects, not file contents. Examples:

- bucket
- object key
- original filename
- content type
- size
- checksum

### Provider callback fields

Provider callback fields are values returned by payment gateway or e-KYC provider callbacks. Examples:

- gateway transaction ID
- provider reference ID
- provider payload
- callback event ID
- signature validation status
- provider status mapping

### Display-only fields

Display-only fields should be assembled, masked, or computed before rendering. Examples:

- masked bank account number
- formatted RM values
- status badge labels
- progress labels

## Core business rules

### Participation amount model

- Members participate using RM amount only.
- Participation must be validated against campaign minimum and maximum Participation Amount.
- Participation must not exceed remaining campaign capacity.
- Participation is confirmed only after payment gateway success is verified server-side.

### Holding Return model

- Holding Return accrues during the holding period.
- Holding Return is not paid monthly.
- Holding Return is paid once during final distribution if the campaign exits successfully.

### 24-month rule

Approved rule text:

> If not sold within 24 months, Participation Amount only will be returned.

If this scenario applies:

- Principal Return equals Participation Amount.
- Holding Return is RM0.
- Profit Distribution is RM0.
- Final Distribution Total equals Participation Amount.

### Manual distribution model

V1 distribution payout is manual:

1. Admin reviews final calculation.
2. Admin checks member bank details.
3. Admin performs manual transfer outside the system.
4. Admin records payment reference.
5. Admin records payment date.
6. Admin adds notes if needed.
7. Admin marks distribution as Paid.

## Data contract acceptance criteria

Before Phase 1 database work starts:

- Public ID formats are approved.
- Enums are approved.
- Field classification matrix is approved.
- Database schema proposal is approved.
- Sensitive fields are identified.
- Derived fields are identified.
- Snapshot fields are identified.
- Provider callback boundaries are identified.
- File metadata boundaries are identified.
- No UI terminology conflicts remain in data labels.

## First implementation after this contract

The safest next technical phase is database + ORM setup after approval of this contract:

1. Add database package and ORM package.
2. Create initial schema based on `database-schema-v1.md`.
3. Add migrations.
4. Seed database with data matching current local sample records.
5. Keep UI behavior unchanged while introducing database reads in a later phase.

## Phase 1.2 capacity, verification, and settlement contract

### Participation capacity rule

Before a member can proceed to payment, the service layer must validate all of the following:

1. Participation Amount is greater than or equal to the campaign minimum.
2. Participation Amount is less than or equal to the campaign maximum.
3. Participation Amount is less than or equal to available campaign capacity.
4. Campaign lifecycle status is `Open`.
5. Member verification status is `Approved`.

Available campaign capacity is derived as:

```text
available_amount = campaign_target - collected_amount_snapshot - reserved_amount_snapshot
```

`collected_amount_snapshot` and `reserved_amount_snapshot` are cached operational snapshots. Confirmed participation and active reservation records remain the reconciliation source.

### Participation reservation contract

A pending Participation may reserve capacity while payment is attempted. The reservation fields are:

- `reserved_at`
- `reserved_until`
- `expires_at`
- `confirmed_at`
- `cancelled_at`

Future payment services must release reservations when checkout expires, payment fails, or the member cancels before confirmation.

### Manual KYC V1 contract

Manual KYC is the V1 verification path. External e-KYC remains available in the schema for a later provider integration.

Required manual KYC uploads are:

- IC front
- IC back
- Selfie holding IC
- Bank statement showing the member name for bank review

Admin review is tracked by `manual_kyc_submissions` and `manual_kyc_documents`, including document type, document status, reviewed-by user, review timestamp, rejection reason, and internal notes.

### Bank account verification contract

Member bank accounts must support `Pending`, `Verified`, and `Rejected` verification states. Verification stores the reviewing admin, review timestamp, rejection reason, internal notes, and primary-account flag. Payment distribution operations should use a verified primary bank account.

### Principal-only settlement contract

Campaign settlement must explicitly store the settlement scenario:

- `SuccessfulExit`
- `PrincipalOnlyAfterMaxHoldingPeriod`

For the principal-only scenario, settlement stores the reason and triggered timestamp. Distribution calculation must return Participation Amount only, with no Holding Return and no Profit Distribution.

### Holding-period snapshot contract

Campaign settlement stores `holding_period_months`, `holding_start_date`, `sale_completed_at`, and `distribution_calculation_date` so Holding Return and final distribution decisions can be audited after approval and lock.

### Planned versus locked profit sharing

Campaign records store planned member/platform profit sharing percentages for pre-publication configuration. Campaign settlement records store final approved percentages as locked snapshots for distribution calculation and reporting.

## Phase 1.2 cleanup decisions

- Campaign capacity snapshots default to zero: `collected_amount_snapshot = 0` and `reserved_amount_snapshot = 0`.
- `available_amount` is always derived as `campaign_target - collected_amount_snapshot - reserved_amount_snapshot`.
- `ManualKycDocument` file purpose is for member-uploaded V1 verification files.
- `ExternalEkycDocument` file purpose is reserved for future provider-based verification files.
