# PAPAIPAY Portal V1

PAPAIPAY Portal is a property participation campaign platform. This repository contains the V1 interface implementation using local sample data for member and admin screens covering campaign listings, portfolio records, participation records, manual distribution review, announcements, reports and profiles.

## Implementation limits

- Local sample data only.
- No backend services.
- No database schema or migrations.
- No real authentication.
- No payment gateway.
- No automated payout or production payment logic.

## Core terminology

Members join Campaigns for Malaysian property Listings using a Participation Amount in RM. Participation is based on RM amount only. The member joined-campaign area is Portfolio and `/member/portfolio` is the canonical Portfolio route.

Required reference IDs are displayed in relevant screens:

- Member ID: `MEM-000001`
- Campaign ID: `CAM-000001`
- Campaign Code: `PP-KL-2026-001`
- Participation ID: `PAR-000001`
- Distribution ID: `DIS-000001`
- Distribution Batch ID: `DBT-000001`
- Payment Reference: `PAY-000001`

## Campaign model

Admin campaign setup includes Campaign Target, Minimum Participation Amount, Maximum Participation Amount, Holding Return Rate, Return Type (Fixed / Target / Up To), Maximum Holding Period, Principal Protection and Manual Distribution Process notes.

Holding Return accrues during the holding period and is paid once during final distribution only. If the asset is not sold after 24 months, the rule returns principal / Participation Amount only with no Holding Return or Profit Distribution.

## Distribution model

Distribution screens show Principal Return, Holding Return, Profit Distribution, Final Distribution Total, Distribution Status, Payment Date, Payment Reference, Distribution Batch and Admin Notes. Admin screens represent a manual process: review calculation, check bank details, transfer outside the system, enter reference/date/notes and mark Paid.

## Development

```bash
npm install
npm run build
```
