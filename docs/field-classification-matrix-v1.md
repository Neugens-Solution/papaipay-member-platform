# PAPAIPAY Portal V1 Field Classification Matrix

This matrix classifies major fields before backend implementation. Classifications guide schema design, encryption, calculated values, snapshots, file storage, provider callbacks, and display-only data.

## Classification definitions

| Classification | Meaning |
| --- | --- |
| Database Field | Persist directly as a normal database field. |
| Derived Field | Calculate from stored fields; do not treat as primary source. |
| Snapshot Field | Store a point-in-time value after approval/lock/report generation. |
| Encrypted Field | Persist encrypted or tokenized with strict access controls. |
| File Metadata Field | Store metadata for an object in file storage. |
| Provider Callback Field | Store event/status/payload received from payment or e-KYC provider. |
| Display Only Field | Rendered for users but should be computed, masked, or assembled from other fields. |

## Member and profile fields

| Entity | Field | Classification | Notes |
| --- | --- | --- | --- |
| users | id | Database Field | Internal UUID. |
| users | email | Database Field | Unique login/contact field. |
| users | phone | Database Field | Optional login/contact field. |
| users | password_hash | Encrypted Field | Store only hash if password auth is used. |
| users | status | Database Field | Account status enum. |
| members | member_ref | Database Field | Public Member ID. |
| members | full_name | Database Field | Member profile. |
| members | ic_number | Encrypted Field | Store encrypted; display masked only. |
| members | verification_status | Database Field | e-KYC/member verification state. |
| member_addresses | address fields | Database Field | Personal data with access control. |
| member_bank_accounts | bank_name | Database Field | Restricted access. |
| member_bank_accounts | account_holder_name | Database Field | Restricted access. |
| member_bank_accounts | account_number | Encrypted Field | Store encrypted; never display full value broadly. |
| member_bank_accounts | account_number_last4 | Display Only Field | Display helper generated from encrypted source. |
| member_nominees | nominee fields | Database Field | Personal data with access control. |

## Admin and permissions fields

| Entity | Field | Classification | Notes |
| --- | --- | --- | --- |
| admin_profiles | admin_ref | Database Field | Optional public Admin ID. |
| admin_profiles | display_name | Database Field | Admin profile. |
| admin_profiles | role_id | Database Field | FK to roles. |
| roles | name | Database Field | Role name. |
| permissions | key | Database Field | Permission key. |
| role_permissions | role_id / permission_id | Database Field | Permission mapping. |

## Campaign fields

| Entity | Field | Classification | Notes |
| --- | --- | --- | --- |
| campaigns | campaign_ref | Database Field | Public Campaign ID. |
| campaigns | campaign_code | Database Field | Business code. |
| campaigns | title | Database Field | Campaign title. |
| campaigns | slug | Database Field | URL slug. |
| campaigns | lifecycle_status | Database Field | V1 lifecycle enum. |
| campaigns | publish_status | Database Field | Draft/Published/Archived. |
| campaigns | visibility | Database Field | Internal/Member visible. |
| campaigns | campaign_target | Database Field | RM target. |
| campaigns | collected_amount | Derived Field | Derive from confirmed participations; optional cached value. |
| campaigns | remaining_amount | Derived Field | Campaign Target minus collected amount. |
| campaigns | progress_percentage | Derived Field | Collected amount / Campaign Target. |
| campaigns | minimum_participation_amount | Database Field | Campaign rule. |
| campaigns | maximum_participation_amount | Database Field | Campaign rule. |
| campaigns | campaign_open_date | Database Field | Publish/participation date. |
| campaigns | campaign_close_date | Database Field | Closing date. |
| campaigns | days_remaining | Derived Field | Calculated from close date. |
| campaigns | holding_return_rate_monthly | Database Field | Return configuration. |
| campaigns | return_type | Database Field | Fixed/Target/Up To. |
| campaigns | maximum_holding_period_months | Database Field | Default 24. |
| campaigns | principal_protection_enabled | Database Field | Boolean. |
| campaigns | twenty_four_month_rule_text | Database Field | Locked approved text. |

## Property fields

| Entity | Field | Classification | Notes |
| --- | --- | --- | --- |
| property_details | property_type | Database Field | Property category. |
| property_details | tenure | Database Field | Freehold/Leasehold. |
| property_details | tenure_alias | Database Field | FH/LH badge alias. |
| property_details | is_laca | Database Field | Boolean. |
| property_details | bumi_status | Database Field | Bumi/Non-Bumi/Open Market. |
| property_details | built_up_area | Database Field | Text value for property convention. |
| property_details | land_area | Database Field | Text value for property convention. |
| property_details | bedrooms | Database Field | Integer. |
| property_details | bathrooms | Database Field | Integer. |
| property_details | auction_date | Database Field | Date. |
| property_details | reserve_price | Database Field | RM amount. |
| property_details | state | Database Field | State. |
| property_details | location | Database Field | Area/city display. |
| property_details | full_address | Database Field | Full address. |
| property_details | year_built | Database Field | Optional. |

## Media and document fields

| Entity | Field | Classification | Notes |
| --- | --- | --- | --- |
| files | bucket | File Metadata Field | Storage bucket. |
| files | object_key | File Metadata Field | Storage object key. |
| files | original_filename | File Metadata Field | Original name. |
| files | content_type | File Metadata Field | MIME type. |
| files | size_bytes | File Metadata Field | File size. |
| files | checksum | File Metadata Field | Integrity check. |
| campaign_media | media_type | Database Field | Primary/Gallery. |
| campaign_media | caption | Database Field | Optional. |
| campaign_media | alt_text | Database Field | Accessibility. |
| campaign_media | sort_order | Database Field | Display order. |
| campaign_media | gallery_count | Derived Field | Count campaign media records. |
| campaign_documents | category | Database Field | Approved document category. |
| campaign_documents | visibility | Database Field | Internal/Member visible. |
| campaign_documents | document_status | Database Field | Draft/Ready/Published/Archived. |

## Campaign content fields

| Entity | Field | Classification | Notes |
| --- | --- | --- | --- |
| campaign_content | about_campaign | Database Field | Member-facing campaign overview. |
| campaign_content | important_information | Database Field | Key participation information. |
| campaign_content | risk_disclaimer | Database Field | Approved disclaimer. |
| campaign_content | holding_return_explanation | Database Field | Member-facing explanation. |
| campaign_content | final_distribution_explanation | Database Field | Member-facing explanation. |
| campaign_updates | title/body/date | Database Field | Campaign update records. |
| campaign_faqs | question/answer | Database Field | FAQ records. |
| campaign_timeline_events | event fields | Database Field | Timeline records. |

## Participation and payment fields

| Entity | Field | Classification | Notes |
| --- | --- | --- | --- |
| participations | participation_ref | Database Field | Public Participation ID. |
| participations | member_id | Database Field | FK member. |
| participations | campaign_id | Database Field | FK campaign. |
| participations | participation_amount | Database Field | RM amount. |
| participations | participation_status | Database Field | Pending Payment/Confirmed/etc. |
| participations | payment_status | Derived Field | Can derive from payment, may cache. |
| payments | payment_ref | Database Field | Portal payment reference. |
| payments | gateway | Database Field | Provider name. |
| payments | gateway_transaction_id | Provider Callback Field | Provider transaction reference. |
| payments | amount | Database Field | RM amount. |
| payments | status | Provider Callback Field | Mapped from provider. |
| payments | provider_response | Provider Callback Field | Store redacted JSON where possible. |
| payments | failure_reason | Provider Callback Field | Provider/system failure reason. |
| payment_webhook_events | payload | Provider Callback Field | Raw event payload with security controls. |
| payment_webhook_events | signature_valid | Provider Callback Field | Verification result. |

## e-KYC fields

| Entity | Field | Classification | Notes |
| --- | --- | --- | --- |
| ekyc_checks | provider | Database Field | Provider name. |
| ekyc_checks | provider_reference_id | Provider Callback Field | Provider reference. |
| ekyc_checks | status | Provider Callback Field | Mapped verification status. |
| ekyc_checks | document_check_status | Provider Callback Field | Provider result. |
| ekyc_checks | liveness_status | Provider Callback Field | Provider result if supplied. |
| ekyc_checks | face_match_status | Provider Callback Field | Provider result if supplied. |
| ekyc_checks | provider_response | Provider Callback Field | Redact where possible. |
| ekyc_webhook_events | payload | Provider Callback Field | Store with restricted access. |
| e-KYC documents | document files | Encrypted Field | Store only if required; private storage. |

## Settlement and distribution fields

| Entity | Field | Classification | Notes |
| --- | --- | --- | --- |
| campaign_settlements | purchase_price | Database Field | Entered by Admin. |
| campaign_settlements | sale_price | Database Field | Entered after sale. |
| campaign_settlements | acquisition_costs | Database Field | JSONB or child table. |
| campaign_settlements | holding_costs | Database Field | JSONB or child table. |
| campaign_settlements | renovation_costs | Database Field | JSONB or child table. |
| campaign_settlements | disposal_costs | Database Field | JSONB or child table. |
| campaign_settlements | platform_costs | Database Field | JSONB or child table. |
| campaign_settlements | gross_profit | Derived Field | Sale Price minus Purchase Price. |
| campaign_settlements | total_costs | Derived Field | Sum cost categories. |
| campaign_settlements | net_profit | Derived Field | Sale Price minus Purchase Price minus Total Costs. |
| campaign_settlements | calculation_status | Database Field | Draft/Reviewed/Approved/Locked. |
| campaign_settlements | calculation_remarks | Database Field | Admin notes. |
| campaign_settlements | principal_return_pool | Snapshot Field | Store at approval/lock. |
| campaign_settlements | holding_return_pool | Snapshot Field | Store at approval/lock. |
| campaign_settlements | profit_distribution_pool | Snapshot Field | Store at approval/lock. |
| campaign_settlements | platform_share | Snapshot Field | Store at approval/lock. |
| campaign_settlements | final_distribution_pool | Snapshot Field | Store at approval/lock. |
| distribution_batches | batch_ref | Database Field | Public batch ID. |
| distribution_batches | total_members | Snapshot Field | Count at batch generation. |
| distribution_batches | total_final_distribution | Snapshot Field | Total at batch generation. |
| distributions | distribution_ref | Database Field | Public Distribution ID. |
| distributions | principal_return | Snapshot Field | Locked per member record. |
| distributions | holding_return | Snapshot Field | Locked per member record. |
| distributions | profit_distribution | Snapshot Field | Locked per member record. |
| distributions | final_distribution_total | Snapshot Field | Locked per member record. |
| distributions | payment_date | Database Field | Manual payout date. |
| distributions | payment_reference | Database Field | Manual payment reference. |
| distributions | admin_notes | Database Field | Admin payout notes. |

## Audit, report, and notification fields

| Entity | Field | Classification | Notes |
| --- | --- | --- | --- |
| audit_logs | actor/action/entity fields | Database Field | Immutable audit trail. |
| audit_logs | before_snapshot | Snapshot Field | Snapshot before change. |
| audit_logs | after_snapshot | Snapshot Field | Snapshot after change. |
| reports | report fields | Database Field | Report metadata. |
| reports | file link | File Metadata Field | Stored report file. |
| notifications | title/body/status | Database Field | Notification content. |
| notifications | read_at | Database Field | Member read timestamp. |

## Phase 1.2 additional classifications

| Entity | Field | Classification | Notes |
| --- | --- | --- | --- |
| campaigns | collected_amount_snapshot | Snapshot Field | Cached confirmed Participation Amount total; reconcile against confirmed participation records. |
| campaigns | reserved_amount_snapshot | Snapshot Field | Cached active reserved Participation Amount total. |
| campaigns | available_amount | Derived Field | Campaign Target minus collected and reserved snapshots. |
| campaigns | member_profit_distribution_percentage_planned | Database Field | Planned campaign configuration before settlement lock. |
| campaigns | platform_profit_share_percentage_planned | Database Field | Planned platform share before settlement lock. |
| participations | reserved_at | Database Field | Reservation timestamp. |
| participations | reserved_until | Database Field | Reservation deadline. |
| participations | expires_at | Database Field | Pending participation expiry. |
| participations | confirmed_at | Database Field | Confirmation timestamp after successful payment verification. |
| participations | cancelled_at | Database Field | Cancellation or expiry timestamp. |
| manual_kyc_submissions | status | Database Field | Manual KYC review state. |
| manual_kyc_submissions | reviewed_by_id | Database Field | Admin reviewer FK. |
| manual_kyc_submissions | rejection_reason | Database Field | Review reason when rejected. |
| manual_kyc_submissions | admin_notes | Database Field | Internal review notes. |
| manual_kyc_documents | file_asset_id | File Metadata Field | Links to stored file metadata. |
| manual_kyc_documents | document_type | Database Field | Required manual KYC document type. |
| manual_kyc_documents | document_status | Database Field | Document review status. |
| member_bank_accounts | verification_status | Database Field | Pending/Verified/Rejected bank account review state. |
| member_bank_accounts | verified_by_id | Database Field | Admin reviewer FK. |
| member_bank_accounts | verified_at | Database Field | Verification timestamp. |
| member_bank_accounts | rejected_reason | Database Field | Reason when rejected. |
| member_bank_accounts | admin_notes | Database Field | Internal bank review notes. |
| member_bank_accounts | is_primary | Database Field | Primary account selection. |
| campaign_settlements | settlement_scenario | Snapshot Field | Successful exit or principal-only settlement scenario. |
| campaign_settlements | principal_only_reason | Snapshot Field | Principal-only audit reason. |
| campaign_settlements | principal_only_triggered_at | Snapshot Field | Principal-only trigger timestamp. |
| campaign_settlements | holding_period_months | Snapshot Field | Holding period used for locked calculation. |
| campaign_settlements | holding_start_date | Snapshot Field | Holding period start used for audit. |
| campaign_settlements | sale_completed_at | Snapshot Field | Sale completion date when applicable. |
| campaign_settlements | distribution_calculation_date | Snapshot Field | Calculation preparation date. |

## Phase 1.2 cleanup classifications

| Entity | Field | Classification | Notes |
| --- | --- | --- | --- |
| campaigns | collected_amount_snapshot default | Snapshot Field | Defaults to zero for capacity calculation safety. |
| campaigns | reserved_amount_snapshot default | Snapshot Field | Defaults to zero for reservation calculation safety. |
| file_assets | purpose: ManualKycDocument | File Metadata Field | Member-uploaded V1 verification file purpose. |
| file_assets | purpose: ExternalEkycDocument | File Metadata Field | Reserved for future provider-based verification file purpose. |
