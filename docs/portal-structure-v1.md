# PAPAIPAY Portal Prototype Documentation

This document is aligned to the latest PAPAIPAY Portal model: a property participation campaign platform prototype using mock data only.

## Scope limits

- Prototype only.
- Mock data only.
- No backend services.
- No database schema or migrations.
- No real authentication.
- No payment gateway.
- No automated payout or production payment logic.

## Language and model

Members join property Campaigns / Listings with an RM Participation Amount. Participation is based on RM amount only. The member joined-campaign area remains Portfolio, with `/member/portfolio` as the canonical route.

Use these labels: Member, Campaign, Listing, Participation, Participation Amount, Minimum Participation Amount, Maximum Participation Amount, Campaign Target, Portfolio, Distribution, Principal Return, Holding Return, Profit Distribution and Final Distribution.

## Reference IDs

Every relevant record has a prototype reference ID:

- Member ID: `MEM-000001`
- Campaign ID: `CAM-000001`
- Participation ID: `PAR-000001`
- Distribution ID: `DIS-000001`
- Payment Reference: `PAY-000001`

IDs should be visible, searchable in admin tables, copyable from detail pages, and included in reports / exports.

## Campaign and listing fields

Listings include Malaysian property conventions: FH / LH, LACA, Bumi / Non-Bumi / Open Market, property type, built-up, land area, bedrooms, bathrooms, auction date, reserve price, location, state, full address, documents, campaign status badge, progress, Campaign Target, collected amount, remaining amount and min / max Participation Amount.

Admin configuration includes Holding Return Rate, Return Type, Maximum Holding Period Months, Principal Protection Rule, Final Distribution Notes, Member Profit Distribution Percentage, Platform Profit Share Percentage, Platform Fee, Management Fee and Other Fee Notes.

## Distribution and settlement

Holding Return accrues during the holding period and is paid once during final distribution only. Example: Participation Amount RM10,000, Holding Return Rate 1.5% per month, Holding Period 15 months, Accrued Holding Return RM2,250, paid upon final distribution only.

If the asset is not sold after 24 months, the prototype rule returns principal / Participation Amount only with no Holding Return or Profit Distribution.

Admin settlement mock fields cover acquisition costs, holding costs, renovation / preparation costs, disposal / sale costs and platform / management costs. Prototype calculations show Gross Profit, Total Costs, Net Profit, Profit Distribution Pool, Platform Share and Final Distribution Total.

Manual distribution process: review final calculation, check member bank details, manually transfer outside the system, enter payment reference number, payment date and notes, then mark distribution as Paid.
