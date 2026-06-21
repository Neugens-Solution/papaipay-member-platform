# PAPAIPAY Portal V1 Database Schema Proposal

This document proposes the production database schema for the backend transition. It is documentation only. No migrations are introduced by this document.

## Schema principles

- PostgreSQL is the recommended database.
- Internal primary keys should be UUIDs.
- Public references should use the ID standards defined in `id-standard-catalogue-v1.md`.
- Sensitive fields must be encrypted or tokenized.
- Derived values should be calculated from source records unless explicitly stored as approved snapshots.
- Settlement and distribution values must be snapshotted when approved/locked.
- All sensitive admin actions require audit logs.

## Identity and access

### `users`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid pk | Internal auth identity. |
| `email` | text unique | Login/contact. |
| `phone` | text | Optional. |
| `password_hash` | text | Only if password auth is used. |
| `auth_provider` | text | Credentials or managed provider. |
| `status` | enum | Active/Suspended/Closed. |
| `last_login_at` | timestamptz | Last login. |
| `created_at` | timestamptz | Created timestamp. |
| `updated_at` | timestamptz | Updated timestamp. |

### `members`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid pk | Internal member key. |
| `user_id` | uuid fk | FK users. |
| `member_ref` | text unique | `MEM-000001`. |
| `full_name` | text | Member name. |
| `ic_number_encrypted` | text | Encrypted sensitive value. |
| `date_of_birth` | date | Optional. |
| `nationality` | text | Optional. |
| `verification_status` | enum | e-KYC/member verification state. |
| `profile_completed_at` | timestamptz | Nullable. |
| `created_at` | timestamptz | Created timestamp. |
| `updated_at` | timestamptz | Updated timestamp. |

### `member_contacts`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid pk |  |
| `member_id` | uuid fk | FK members. |
| `email` | text | Contact email. |
| `phone` | text | Contact phone. |
| `preferred_contact_method` | text | Optional. |
| `is_primary` | boolean | Primary contact flag. |

### `member_addresses`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid pk |  |
| `member_id` | uuid fk | FK members. |
| `address_line_1` | text |  |
| `address_line_2` | text | Optional. |
| `city` | text |  |
| `state` | text |  |
| `postcode` | text |  |
| `country` | text |  |
| `is_primary` | boolean | Primary address flag. |

### `member_bank_accounts`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid pk |  |
| `member_id` | uuid fk | FK members. |
| `bank_name` | text | Restricted data. |
| `account_holder_name` | text | Restricted data. |
| `account_number_encrypted` | text | Encrypted. |
| `account_number_last4` | text | Display helper. |
| `verification_status` | enum | Pending/Verified/Rejected. |
| `verified_at` | timestamptz | Nullable. |
| `created_at` | timestamptz | Created timestamp. |
| `updated_at` | timestamptz | Updated timestamp. |

### `member_nominees`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid pk |  |
| `member_id` | uuid fk | FK members. |
| `nominee_name` | text |  |
| `relationship` | text |  |
| `phone` | text |  |
| `email` | text | Optional. |
| `address` | text | Optional. |
| `created_at` | timestamptz | Created timestamp. |
| `updated_at` | timestamptz | Updated timestamp. |

### `admin_profiles`, `roles`, `permissions`, `role_permissions`

| Table | Purpose |
| --- | --- |
| `admin_profiles` | Admin account profile linked to `users`. |
| `roles` | Role names and descriptions. |
| `permissions` | Permission keys for protected actions. |
| `role_permissions` | Role-to-permission mapping. |

## Campaign and listing schema

### `campaigns`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid pk | Internal key. |
| `campaign_ref` | text unique | `CAM-000001`. |
| `campaign_code` | text unique | `PP-SGR-2026-001`. |
| `title` | text | Campaign title. |
| `slug` | text unique | URL slug. |
| `lifecycle_status` | enum | V1 lifecycle. |
| `publish_status` | enum | Draft/Published/Archived. |
| `visibility` | enum | Internal/Member visible. |
| `campaign_target` | numeric(14,2) | RM amount. |
| `minimum_participation_amount` | numeric(14,2) | RM amount. |
| `maximum_participation_amount` | numeric(14,2) | RM amount. |
| `campaign_open_date` | timestamptz | Nullable. |
| `campaign_close_date` | timestamptz | Nullable. |
| `holding_return_rate_monthly` | numeric(8,4) | Percent per month. |
| `return_type` | enum | Fixed/Target/Up To. |
| `maximum_holding_period_months` | integer | Default 24. |
| `principal_protection_enabled` | boolean |  |
| `twenty_four_month_rule_text` | text | Approved rule text. |
| `created_by` | uuid fk | Admin. |
| `updated_by` | uuid fk | Admin. |
| `published_at` | timestamptz | Nullable. |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

Derived campaign values should be calculated in queries/services: collected amount, remaining amount, progress percentage, days remaining, and gallery count.

### `property_details`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid pk |  |
| `campaign_id` | uuid fk | FK campaigns. |
| `property_type` | text |  |
| `tenure` | enum | Freehold/Leasehold. |
| `tenure_alias` | enum | FH/LH. |
| `is_laca` | boolean |  |
| `bumi_status` | enum | Bumi/Non-Bumi/Open Market. |
| `built_up_area` | text | Display convention. |
| `land_area` | text | Display convention. |
| `bedrooms` | integer |  |
| `bathrooms` | integer |  |
| `auction_date` | date |  |
| `reserve_price` | numeric(14,2) | RM amount. |
| `state` | text |  |
| `location` | text |  |
| `full_address` | text |  |
| `year_built` | text | Optional. |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

### `campaign_media`, `campaign_documents`, `files`

| Table | Purpose |
| --- | --- |
| `files` | Storage metadata for uploaded files. |
| `campaign_media` | Primary image and gallery image records. |
| `campaign_documents` | Campaign document records with category, status, and visibility. |

### `campaign_content`, `campaign_updates`, `campaign_faqs`, `campaign_timeline_events`

| Table | Purpose |
| --- | --- |
| `campaign_content` | About This Campaign, Important Information, risk/disclaimer, return explanations. |
| `campaign_updates` | Repeatable update entries. |
| `campaign_faqs` | Repeatable FAQ entries. |
| `campaign_timeline_events` | Member/Admin timeline records. |

## Participation and payment schema

### `participations`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid pk |  |
| `participation_ref` | text unique | `PAR-000001`. |
| `member_id` | uuid fk | FK members. |
| `campaign_id` | uuid fk | FK campaigns. |
| `participation_amount` | numeric(14,2) | RM amount. |
| `participation_status` | enum | Pending Payment/Confirmed/etc. |
| `payment_id` | uuid fk | Nullable until created. |
| `confirmed_at` | timestamptz | Nullable. |
| `cancelled_at` | timestamptz | Nullable. |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

### `payments` and `payment_webhook_events`

| Table | Purpose |
| --- | --- |
| `payments` | Portal payment reference, amount, gateway, status, provider transaction ID, reconciliation fields. |
| `payment_webhook_events` | Raw callback event log, signature result, processing status, and failure reason. |

## e-KYC schema

| Table | Purpose |
| --- | --- |
| `ekyc_checks` | Provider session/check status for a member. |
| `ekyc_webhook_events` | Provider callback event log. |

## Settlement and distribution schema

### `campaign_settlements`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid pk |  |
| `campaign_id` | uuid fk | FK campaigns. |
| `purchase_price` | numeric(14,2) | RM amount. |
| `sale_price` | numeric(14,2) | RM amount. |
| `acquisition_costs` | jsonb | Cost category detail. |
| `holding_costs` | jsonb | Cost category detail. |
| `renovation_costs` | jsonb | Cost category detail. |
| `disposal_costs` | jsonb | Cost category detail. |
| `platform_costs` | jsonb | Cost category detail. |
| `member_profit_distribution_percentage` | numeric(8,4) | Rule value. |
| `platform_profit_share_percentage` | numeric(8,4) | Rule value. |
| `calculation_status` | enum | Draft/Reviewed/Approved/Locked. |
| `calculation_remarks` | text | Admin notes. |
| `principal_return_pool` | numeric(14,2) | Snapshot at approval/lock. |
| `holding_return_pool` | numeric(14,2) | Snapshot at approval/lock. |
| `profit_distribution_pool` | numeric(14,2) | Snapshot at approval/lock. |
| `platform_share` | numeric(14,2) | Snapshot at approval/lock. |
| `final_distribution_pool` | numeric(14,2) | Snapshot at approval/lock. |
| `reviewed_by` | uuid fk | Admin. |
| `reviewed_at` | timestamptz | Nullable. |
| `approved_by` | uuid fk | Admin. |
| `approved_at` | timestamptz | Nullable. |
| `locked_by` | uuid fk | Admin. |
| `locked_at` | timestamptz | Nullable. |

Gross Profit, Total Costs, and Net Profit are derived values until stored as approved snapshots.

### `distribution_batches`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid pk |  |
| `batch_ref` | text unique | `DBT-000001`. |
| `campaign_id` | uuid fk | FK campaigns. |
| `settlement_id` | uuid fk | FK campaign_settlements. |
| `total_members` | integer | Snapshot. |
| `total_final_distribution` | numeric(14,2) | Snapshot. |
| `pending_count` | integer | Snapshot/derived. |
| `processing_count` | integer | Snapshot/derived. |
| `paid_count` | integer | Snapshot/derived. |
| `status` | enum | Draft/Approved/Processing/Completed/Cancelled. |
| `locked_status` | boolean | Lock flag. |
| `approved_by` | uuid fk | Admin. |
| `approved_at` | timestamptz | Nullable. |
| `created_by` | uuid fk | Admin. |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

### `distributions`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid pk |  |
| `distribution_ref` | text unique | `DIS-000001`. |
| `distribution_batch_id` | uuid fk | FK distribution_batches. |
| `campaign_id` | uuid fk | FK campaigns. |
| `member_id` | uuid fk | FK members. |
| `participation_id` | uuid fk | FK participations. |
| `principal_return` | numeric(14,2) | Snapshot. |
| `holding_return` | numeric(14,2) | Snapshot. |
| `profit_distribution` | numeric(14,2) | Snapshot. |
| `final_distribution_total` | numeric(14,2) | Snapshot. |
| `status` | enum | Pending/Processing/Paid. |
| `payment_date` | date | Manual payout date. |
| `payment_reference` | text | Manual payment reference. |
| `admin_notes` | text | Admin notes. |
| `marked_processing_by` | uuid fk | Admin. |
| `marked_processing_at` | timestamptz | Nullable. |
| `marked_paid_by` | uuid fk | Admin. |
| `marked_paid_at` | timestamptz | Nullable. |
| `created_at` | timestamptz |  |
| `updated_at` | timestamptz |  |

## Audit, reports, notifications

| Table | Purpose |
| --- | --- |
| `audit_logs` | Actor, action, entity, before/after snapshot, IP/device metadata. |
| `reports` | Report generation metadata and file reference. |
| `notifications` | Member/Admin notification records. |
| `announcements` | Admin-created announcements. |
