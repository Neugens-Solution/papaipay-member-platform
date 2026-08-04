# K Asset Ventures UAT / Controlled Client Demo Script

## Demo positioning

This script is for internal UAT and controlled client demos only. The supported demo path is a scripted manual-payment lifecycle from member participation through admin review, locked financial summary, distribution batch approval, manual payment recording, and member distribution visibility.

Current decision status:

- Internal UAT: GO
- Controlled client demo: GO, scripted path only
- Production: GO only after migration, private Blob setup, and the final checklist pass

## What is ready

The following scripted lifecycle is ready for controlled demonstration:

1. Member uploads IC front and back for manual review.
2. Admin approves the manual KYC submission.
3. Member participates in an opportunity.
4. Participation enters Payment Pending status.
5. Member transfers outside the portal and uploads a receipt and bank reference.
6. Payment enters Processing status for admin review.
7. Admin opens the receipt and confirms manual payment received outside K Asset Ventures.
8. Participation becomes confirmed.
9. Admin reviews, approves, and locks the financial summary.
10. Admin validates and approves the distribution batch.
11. Admin records the externally completed distribution payment.
12. Member views the paid distribution from DB-backed member distributions pages.

## Remaining production gates

The application is ready for the final release gate. Complete the production deployment, migration, private storage, DNS, and HTTPS setup first, then run this full UAT sequence on `https://www.kassetventures.com` before normal member use. Do not position the portal as a payment or payout execution system.

Out-of-scope areas remain:

- Live bank transfer execution or payment gateway payouts.
- Automated e-KYC or third-party identity verification.
- Any workflow that has not been validated in the target production environment.

## Required environment variables

Set the application environment before running the demo. Required variables include:

- `DATABASE_URL`
- `DIRECT_DATABASE_URL`
- `AUTH_SESSION_SECRET` or `NEXTAUTH_SECRET`
- `BLOB_READ_WRITE_TOKEN` if media/upload is shown
- `PRIVATE_BLOB_READ_WRITE_TOKEN` for IC and receipt uploads

Only show upload screens after both the Public listing-media store and separate Private document store have been tested in the target environment.

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
4. Open the member receipt and reference.
5. Confirm manual payment received outside K Asset Ventures.
6. Verify the participation status moves to confirmed.
7. Open the financial summary area, review, approve, and lock it.
8. Validate and approve the distribution batch.
9. Record the externally completed distribution payment.
10. Verify the distribution batch status is Completed and distribution rows are Paid.

## Member demo flow

1. Log in as the demo member and upload IC front and back from Profile.
2. Log in as admin, review the private files, and approve the member.
3. Return as the member and open the target opportunity.
4. Review opportunity details and the Projected Holding Return wording.
5. Start participation, review the declaration, and confirm.
6. Verify the participation is pending manual payment.
7. Complete the scripted external transfer and upload the receipt plus bank reference.
8. Verify the payment is Processing until admin review.
9. After admin completes the scripted admin flow, open member distributions.
10. Verify the paid distribution is visible from the DB-backed member distributions pages.

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
- Any section that could imply K Asset Ventures executes transfers directly.

## Final demo checklist

Before the demo:

- Confirm environment variables are set.
- Confirm demo users can log in.
- Confirm UAT data is seeded.
- Confirm the scripted project is visible to admin.
- Confirm the scripted opportunity is visible to member.
- Confirm member-facing labels say “Projected Holding Return.”
- Confirm distribution copy says manual payment is recorded only.
- Confirm no presenter language implies K Asset Ventures executes bank transfers or payment gateway payouts.
- Confirm production status is described as conditional GO only after the release checklist passes.
