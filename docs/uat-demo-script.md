# PAPAIPAY UAT / Controlled Client Demo Script

## Demo positioning

This script is for internal UAT and controlled client demos only. The supported demo path is a scripted manual-payment lifecycle from member participation through admin review, locked financial summary, distribution batch approval, manual payment recording, and member distribution visibility.

Current decision status:

- Internal UAT: GO
- Controlled client demo: GO, scripted path only
- Production: NO-GO

## What is ready

The following scripted lifecycle is ready for controlled demonstration:

1. Member participates in an opportunity.
2. Participation enters Payment Pending status.
3. Admin confirms manual payment received outside PAPAIPAY.
4. Participation becomes confirmed.
5. Admin reviews the financial summary.
6. Admin approves the financial summary.
7. Admin locks the financial summary.
8. Admin validates the distribution preview.
9. Admin saves a draft distribution batch.
10. Admin approves the distribution batch.
11. Admin records completed manual payment and marks the batch paid.
12. Distribution batch becomes Completed.
13. Distribution rows become Paid.
14. Member views the paid distribution from DB-backed member distributions pages.

## What is not production-ready yet

The platform is not cleared for production launch. Do not position this demo as a production-ready payment or payout system.

Not production-ready areas include:

- Unscripted operational paths outside the controlled UAT flow.
- Live bank transfer execution or payment gateway payouts.
- Broad production user onboarding.
- Non-demo payment operations.
- Any workflow that has not been explicitly validated in the final UAT script.

## Required environment variables

Set the application environment before running the demo. Required variables include:

- `DATABASE_URL`
- `DIRECT_DATABASE_URL`
- `AUTH_SESSION_SECRET` or `NEXTAUTH_SECRET`
- `BLOB_READ_WRITE_TOKEN` if media/upload is shown

Only show media or upload screens when `BLOB_READ_WRITE_TOKEN` is configured and the path has been tested in the target environment.

## Demo user setup commands

Create or refresh demo users with the default demo password only in a safe demo environment:

```bash
ALLOW_AUTH_DEMO_USERS=true npm run auth:demo-users
```

Create or refresh demo users with an explicit secure demo password:

```bash
ALLOW_AUTH_DEMO_USERS=true AUTH_DEMO_PASSWORD='replace-with-secure-demo-password' npm run auth:demo-users
```

## UAT data seed/cleanup commands

Clean up demo data before reseeding when the environment needs a fresh scripted state:

```bash
ALLOW_UAT_DEMO_DATA=true UAT_DEMO_MODE=cleanup npm run uat:demo-data
```

Seed controlled UAT demo data:

```bash
ALLOW_UAT_DEMO_DATA=true UAT_DEMO_MODE=seed npm run uat:demo-data
```

Recommended order for a fresh controlled demo environment:

1. Run cleanup.
2. Run seed.
3. Create or refresh demo users.
4. Log in as admin and verify the target opportunity is visible.
5. Log in as member and verify the target opportunity is visible.

## Admin demo flow

1. Log in as the demo admin.
2. Open the target project workspace.
3. Confirm that a member participation is pending manual payment.
4. Confirm manual payment received outside PAPAIPAY.
5. Verify the participation status moves to confirmed.
6. Open the financial summary area.
7. Review the financial summary.
8. Approve the financial summary.
9. Lock the financial summary.
10. Open the distribution preview.
11. Confirm the preview is valid for the scripted data.
12. Save a draft distribution batch.
13. Approve the distribution batch.
14. Record completed manual payment and mark the batch paid.
15. Verify the distribution batch status is Completed and distribution rows are Paid.

## Member demo flow

1. Log in as the demo member.
2. Open the target opportunity.
3. Review opportunity details and the Projected Holding Return wording.
4. Start participation.
5. Enter the scripted participation amount.
6. Review the participation details.
7. Accept the required declarations.
8. Confirm participation.
9. Verify the participation is pending manual payment confirmation.
10. After admin completes the scripted admin flow, open member distributions.
11. Verify the paid distribution is visible from the DB-backed member distributions pages.

## Important wording notes

- Use “Projected Holding Return” for member-facing projected return/yield labels.
- Use “manual payment” language for payment and distribution completion steps.
- The platform records manual payment outcomes only. It does not execute bank transfers or payment gateway payouts.
- Do not say “Pay Now,” “Process Payment,” “Send Payment,” or “payout executed” unless explicitly describing what the platform does not do.
- When describing paid distributions, say the admin recorded the completed manual payment after external finance completion.

## Caveats / do not show unscripted sections

For controlled client demos, stay on the scripted path. Do not show or improvise around:

- Production onboarding flows.
- Real payment gateway collection.
- Real bank transfer or payout execution.
- Unseeded projects, unvalidated member accounts, or ad hoc data.
- Media/upload areas unless explicitly configured and tested.
- Admin actions outside the approved UAT lifecycle.
- Any section that could imply PAPAIPAY executes transfers directly.

## Final demo checklist

Before the demo:

- Confirm environment variables are set.
- Confirm demo users can log in.
- Confirm UAT data is seeded.
- Confirm the scripted project is visible to admin.
- Confirm the scripted opportunity is visible to member.
- Confirm member-facing labels say “Projected Holding Return.”
- Confirm distribution copy says manual payment is recorded only.
- Confirm no presenter language implies PAPAIPAY executes bank transfers or payment gateway payouts.
- Confirm production status is described as NO-GO.
