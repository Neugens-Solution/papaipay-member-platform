-- AddEnumValue
ALTER TYPE "FilePurpose" ADD VALUE 'PaymentReceipt';

-- AlterTable
ALTER TABLE "Payment"
ADD COLUMN "receiptFileAssetId" TEXT,
ADD COLUMN "submittedReference" TEXT,
ADD COLUMN "memberNotes" TEXT,
ADD COLUMN "submittedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Payment_receiptFileAssetId_idx" ON "Payment"("receiptFileAssetId");

-- CreateIndex
CREATE INDEX "Payment_submittedAt_idx" ON "Payment"("submittedAt");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_receiptFileAssetId_fkey" FOREIGN KEY ("receiptFileAssetId") REFERENCES "FileAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- SeedPermission
INSERT INTO "Permission" ("id", "key", "description", "createdAt", "updatedAt")
VALUES
  (gen_random_uuid()::text, 'listing.manage', 'Manage listing workspace records', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (gen_random_uuid()::text, 'members.review-kyc', 'Review manual member identity submissions', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("key") DO UPDATE SET
  "description" = EXCLUDED."description",
  "updatedAt" = CURRENT_TIMESTAMP;

-- Preserve the previous active-admin capability for existing roles while enabling permission enforcement.
INSERT INTO "RolePermission" ("roleId", "permissionId", "createdAt")
SELECT role."id", permission."id", CURRENT_TIMESTAMP
FROM "Role" AS role
CROSS JOIN "Permission" AS permission
WHERE permission."key" IN ('listing.manage', 'members.review-kyc')
ON CONFLICT ("roleId", "permissionId") DO NOTHING;
