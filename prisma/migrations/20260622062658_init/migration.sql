-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('Active', 'Suspended', 'Closed');

-- CreateEnum
CREATE TYPE "MemberVerificationStatus" AS ENUM ('NotStarted', 'Pending', 'Approved', 'Rejected', 'ManualReview', 'Expired', 'Cancelled');

-- CreateEnum
CREATE TYPE "BankAccountVerificationStatus" AS ENUM ('Pending', 'Verified', 'Rejected');

-- CreateEnum
CREATE TYPE "ManualKycStatus" AS ENUM ('NotSubmitted', 'Submitted', 'UnderReview', 'Approved', 'Rejected', 'ResubmissionRequired');

-- CreateEnum
CREATE TYPE "ManualKycDocumentType" AS ENUM ('IcFront', 'IcBack', 'SelfieHoldingIc', 'BankStatement');

-- CreateEnum
CREATE TYPE "ManualKycDocumentStatus" AS ENUM ('Pending', 'Accepted', 'Rejected');

-- CreateEnum
CREATE TYPE "AdminAccountStatus" AS ENUM ('Invited', 'Active', 'Suspended');

-- CreateEnum
CREATE TYPE "CampaignLifecycleStatus" AS ENUM ('Draft', 'Open', 'Funded', 'Holding', 'Sold', 'DistributionProcessing', 'Distributed', 'Cancelled');

-- CreateEnum
CREATE TYPE "PublishStatus" AS ENUM ('Draft', 'Published', 'Archived');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('InternalOnly', 'MemberVisible', 'ParticipantsOnly');

-- CreateEnum
CREATE TYPE "Tenure" AS ENUM ('Freehold', 'Leasehold');

-- CreateEnum
CREATE TYPE "TenureAlias" AS ENUM ('FH', 'LH');

-- CreateEnum
CREATE TYPE "BumiStatus" AS ENUM ('Bumi', 'NonBumi', 'OpenMarket');

-- CreateEnum
CREATE TYPE "ReturnType" AS ENUM ('Fixed', 'Target', 'UpTo');

-- CreateEnum
CREATE TYPE "ParticipationStatus" AS ENUM ('PendingPayment', 'Confirmed', 'Cancelled', 'Refunded');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Processing', 'Succeeded', 'Failed', 'Cancelled', 'Expired', 'Refunded');

-- CreateEnum
CREATE TYPE "ProviderEventProcessingStatus" AS ENUM ('Received', 'Processed', 'Ignored', 'Failed');

-- CreateEnum
CREATE TYPE "EkycStatus" AS ENUM ('NotStarted', 'Pending', 'Approved', 'Rejected', 'ManualReview', 'Expired', 'Cancelled');

-- CreateEnum
CREATE TYPE "SettlementCalculationStatus" AS ENUM ('Draft', 'Reviewed', 'Approved', 'Locked');

-- CreateEnum
CREATE TYPE "SettlementScenario" AS ENUM ('SuccessfulExit', 'PrincipalOnlyAfterMaxHoldingPeriod');

-- CreateEnum
CREATE TYPE "DistributionStatus" AS ENUM ('Pending', 'Processing', 'Paid');

-- CreateEnum
CREATE TYPE "DistributionBatchStatus" AS ENUM ('Draft', 'Approved', 'Processing', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('ProclamationOfSale', 'ConditionsOfSale', 'TitleSearch', 'ValuationReport', 'PropertyPhotos', 'LocationMap', 'LegalDocuments', 'OtherDocuments');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('Draft', 'Ready', 'Published', 'Archived');

-- CreateEnum
CREATE TYPE "FileVisibility" AS ENUM ('Public', 'Authenticated', 'InternalOnly', 'ParticipantsOnly');

-- CreateEnum
CREATE TYPE "FilePurpose" AS ENUM ('CampaignImage', 'CampaignDocument', 'MemberDocument', 'ManualKycDocument', 'ExternalEkycDocument', 'ReportExport');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('PrimaryImage', 'GalleryImage');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('Queued', 'Processing', 'Generated', 'Failed');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('Draft', 'Sent', 'Read', 'Archived');

-- CreateEnum
CREATE TYPE "AnnouncementStatus" AS ENUM ('Draft', 'Published', 'Archived');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT,
    "authProvider" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'Active',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "memberRef" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "icNumberEncrypted" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "nationality" TEXT,
    "verificationStatus" "MemberVerificationStatus" NOT NULL DEFAULT 'NotStarted',
    "profileCompletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberContact" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "preferredContactMethod" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberAddress" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Malaysia',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberBankAccount" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "accountNumberEncrypted" TEXT NOT NULL,
    "accountNumberLast4" TEXT,
    "verificationStatus" "BankAccountVerificationStatus" NOT NULL DEFAULT 'Pending',
    "verifiedById" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "rejectedReason" TEXT,
    "adminNotes" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberNominee" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "icNumberEncrypted" TEXT,
    "allocationPercentage" DECIMAL(8,4),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberNominee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "adminRef" TEXT,
    "displayName" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "status" "AdminAccountStatus" NOT NULL DEFAULT 'Invited',
    "invitedAt" TIMESTAMP(3),
    "activatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "campaignRef" TEXT NOT NULL,
    "campaignCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "lifecycleStatus" "CampaignLifecycleStatus" NOT NULL DEFAULT 'Draft',
    "publishStatus" "PublishStatus" NOT NULL DEFAULT 'Draft',
    "visibility" "Visibility" NOT NULL DEFAULT 'InternalOnly',
    "campaignTarget" DECIMAL(14,2) NOT NULL,
    "collectedAmountSnapshot" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "reservedAmountSnapshot" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "minimumParticipationAmount" DECIMAL(14,2) NOT NULL,
    "maximumParticipationAmount" DECIMAL(14,2) NOT NULL,
    "campaignOpenDate" TIMESTAMP(3),
    "campaignCloseDate" TIMESTAMP(3),
    "holdingReturnRateMonthly" DECIMAL(8,4) NOT NULL,
    "returnType" "ReturnType" NOT NULL,
    "maximumHoldingPeriodMonths" INTEGER NOT NULL DEFAULT 24,
    "principalProtectionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "memberProfitDistributionPercentagePlanned" DECIMAL(8,4),
    "platformProfitSharePercentagePlanned" DECIMAL(8,4),
    "twentyFourMonthRuleText" TEXT NOT NULL DEFAULT 'If not sold within 24 months, Participation Amount only will be returned.',
    "createdById" TEXT,
    "updatedById" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyDetail" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "tenure" "Tenure" NOT NULL,
    "tenureAlias" "TenureAlias" NOT NULL,
    "isLaca" BOOLEAN NOT NULL DEFAULT false,
    "bumiStatus" "BumiStatus" NOT NULL,
    "builtUpArea" TEXT,
    "landArea" TEXT,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "auctionDate" TIMESTAMP(3),
    "reservePrice" DECIMAL(14,2),
    "state" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "fullAddress" TEXT NOT NULL,
    "yearBuilt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileAsset" (
    "id" TEXT NOT NULL,
    "fileRef" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "objectKey" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "sizeBytes" INTEGER,
    "checksum" TEXT,
    "visibility" "FileVisibility" NOT NULL DEFAULT 'InternalOnly',
    "purpose" "FilePurpose" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignMedia" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "fileAssetId" TEXT,
    "mediaType" "MediaType" NOT NULL,
    "caption" TEXT,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignDocument" (
    "id" TEXT NOT NULL,
    "documentRef" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "fileAssetId" TEXT,
    "category" "DocumentCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "visibility" "Visibility" NOT NULL DEFAULT 'InternalOnly',
    "documentStatus" "DocumentStatus" NOT NULL DEFAULT 'Draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignContent" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "aboutCampaign" TEXT NOT NULL,
    "importantInformation" TEXT,
    "riskDisclaimer" TEXT,
    "holdingReturnExplanation" TEXT,
    "finalDistributionExplanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignUpdate" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "visibility" "Visibility" NOT NULL DEFAULT 'MemberVisible',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignFaq" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignFaq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignTimelineEvent" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "eventDate" TIMESTAMP(3),
    "visibility" "Visibility" NOT NULL DEFAULT 'MemberVisible',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignTimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participation" (
    "id" TEXT NOT NULL,
    "participationRef" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "participationAmount" DECIMAL(14,2) NOT NULL,
    "participationStatus" "ParticipationStatus" NOT NULL DEFAULT 'PendingPayment',
    "reservedAt" TIMESTAMP(3),
    "reservedUntil" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "confirmedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "paymentRef" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "participationId" TEXT,
    "gateway" TEXT NOT NULL,
    "gatewayTransactionId" TEXT,
    "amount" DECIMAL(14,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'Pending',
    "providerResponse" JSONB,
    "providerResponseEncrypted" TEXT,
    "failureReason" TEXT,
    "reconciliationReference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentWebhookEvent" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT,
    "providerEventId" TEXT,
    "payload" JSONB NOT NULL,
    "payloadEncrypted" TEXT,
    "signatureValid" BOOLEAN NOT NULL DEFAULT false,
    "processingStatus" "ProviderEventProcessingStatus" NOT NULL DEFAULT 'Received',
    "failureReason" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "PaymentWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManualKycSubmission" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "status" "ManualKycStatus" NOT NULL DEFAULT 'NotSubmitted',
    "submittedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManualKycSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManualKycDocument" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "fileAssetId" TEXT NOT NULL,
    "documentType" "ManualKycDocumentType" NOT NULL,
    "documentStatus" "ManualKycDocumentStatus" NOT NULL DEFAULT 'Pending',
    "rejectionReason" TEXT,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManualKycDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EkycCheck" (
    "id" TEXT NOT NULL,
    "ekycRef" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerReferenceId" TEXT,
    "status" "EkycStatus" NOT NULL DEFAULT 'NotStarted',
    "documentCheckStatus" TEXT,
    "livenessStatus" TEXT,
    "faceMatchStatus" TEXT,
    "providerResponse" JSONB,
    "providerResponseEncrypted" TEXT,
    "reviewedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EkycCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EkycWebhookEvent" (
    "id" TEXT NOT NULL,
    "ekycCheckId" TEXT,
    "providerEventId" TEXT,
    "payload" JSONB NOT NULL,
    "payloadEncrypted" TEXT,
    "signatureValid" BOOLEAN NOT NULL DEFAULT false,
    "processingStatus" "ProviderEventProcessingStatus" NOT NULL DEFAULT 'Received',
    "failureReason" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "EkycWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignSettlement" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "purchasePrice" DECIMAL(14,2),
    "salePrice" DECIMAL(14,2),
    "acquisitionCosts" JSONB,
    "holdingCosts" JSONB,
    "renovationCosts" JSONB,
    "disposalCosts" JSONB,
    "platformCosts" JSONB,
    "settlementScenario" "SettlementScenario" NOT NULL DEFAULT 'SuccessfulExit',
    "principalOnlyReason" TEXT,
    "principalOnlyTriggeredAt" TIMESTAMP(3),
    "holdingPeriodMonths" INTEGER,
    "holdingStartDate" TIMESTAMP(3),
    "saleCompletedAt" TIMESTAMP(3),
    "distributionCalculationDate" TIMESTAMP(3),
    "memberProfitDistributionPercentage" DECIMAL(8,4),
    "platformProfitSharePercentage" DECIMAL(8,4),
    "grossProfitSnapshot" DECIMAL(14,2),
    "totalCostsSnapshot" DECIMAL(14,2),
    "netProfitSnapshot" DECIMAL(14,2),
    "calculationStatus" "SettlementCalculationStatus" NOT NULL DEFAULT 'Draft',
    "calculationRemarks" TEXT,
    "principalReturnPool" DECIMAL(14,2),
    "holdingReturnPool" DECIMAL(14,2),
    "profitDistributionPool" DECIMAL(14,2),
    "platformShare" DECIMAL(14,2),
    "finalDistributionPool" DECIMAL(14,2),
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "lockedById" TEXT,
    "lockedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignSettlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DistributionBatch" (
    "id" TEXT NOT NULL,
    "batchRef" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "settlementId" TEXT,
    "totalMembers" INTEGER,
    "totalFinalDistribution" DECIMAL(14,2),
    "pendingCount" INTEGER,
    "processingCount" INTEGER,
    "paidCount" INTEGER,
    "status" "DistributionBatchStatus" NOT NULL DEFAULT 'Draft',
    "lockedStatus" BOOLEAN NOT NULL DEFAULT false,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DistributionBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distribution" (
    "id" TEXT NOT NULL,
    "distributionRef" TEXT NOT NULL,
    "distributionBatchId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "participationId" TEXT NOT NULL,
    "principalReturn" DECIMAL(14,2) NOT NULL,
    "holdingReturn" DECIMAL(14,2) NOT NULL,
    "profitDistribution" DECIMAL(14,2) NOT NULL,
    "finalDistributionTotal" DECIMAL(14,2) NOT NULL,
    "status" "DistributionStatus" NOT NULL DEFAULT 'Pending',
    "paymentDate" TIMESTAMP(3),
    "paymentReference" TEXT,
    "adminNotes" TEXT,
    "markedProcessingById" TEXT,
    "markedProcessingAt" TIMESTAMP(3),
    "markedPaidById" TEXT,
    "markedPaidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Distribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "auditRef" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "beforeSnapshot" JSONB,
    "afterSnapshot" JSONB,
    "ipAddress" TEXT,
    "deviceInfo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reportRef" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "filters" JSONB,
    "status" "ReportStatus" NOT NULL DEFAULT 'Queued',
    "fileAssetId" TEXT,
    "generatedById" TEXT,
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "notificationRef" TEXT NOT NULL,
    "memberId" TEXT,
    "campaignId" TEXT,
    "audience" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'Draft',
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "announcementRef" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "AnnouncementStatus" NOT NULL DEFAULT 'Draft',
    "publishedAt" TIMESTAMP(3),
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_key" ON "Member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_memberRef_key" ON "Member"("memberRef");

-- CreateIndex
CREATE INDEX "MemberContact_memberId_idx" ON "MemberContact"("memberId");

-- CreateIndex
CREATE INDEX "MemberContact_isPrimary_idx" ON "MemberContact"("isPrimary");

-- CreateIndex
CREATE INDEX "MemberAddress_memberId_idx" ON "MemberAddress"("memberId");

-- CreateIndex
CREATE INDEX "MemberAddress_state_idx" ON "MemberAddress"("state");

-- CreateIndex
CREATE INDEX "MemberAddress_isPrimary_idx" ON "MemberAddress"("isPrimary");

-- CreateIndex
CREATE INDEX "MemberBankAccount_memberId_idx" ON "MemberBankAccount"("memberId");

-- CreateIndex
CREATE INDEX "MemberBankAccount_verificationStatus_idx" ON "MemberBankAccount"("verificationStatus");

-- CreateIndex
CREATE INDEX "MemberBankAccount_verifiedById_idx" ON "MemberBankAccount"("verifiedById");

-- CreateIndex
CREATE INDEX "MemberBankAccount_isPrimary_idx" ON "MemberBankAccount"("isPrimary");

-- CreateIndex
CREATE INDEX "MemberNominee_memberId_idx" ON "MemberNominee"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_userId_key" ON "AdminProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminProfile_adminRef_key" ON "AdminProfile"("adminRef");

-- CreateIndex
CREATE INDEX "AdminProfile_roleId_idx" ON "AdminProfile"("roleId");

-- CreateIndex
CREATE INDEX "AdminProfile_status_idx" ON "AdminProfile"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "Permission"("key");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_campaignRef_key" ON "Campaign"("campaignRef");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_campaignCode_key" ON "Campaign"("campaignCode");

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_slug_key" ON "Campaign"("slug");

-- CreateIndex
CREATE INDEX "Campaign_lifecycleStatus_idx" ON "Campaign"("lifecycleStatus");

-- CreateIndex
CREATE INDEX "Campaign_publishStatus_idx" ON "Campaign"("publishStatus");

-- CreateIndex
CREATE INDEX "Campaign_visibility_idx" ON "Campaign"("visibility");

-- CreateIndex
CREATE INDEX "Campaign_campaignOpenDate_idx" ON "Campaign"("campaignOpenDate");

-- CreateIndex
CREATE INDEX "Campaign_campaignCloseDate_idx" ON "Campaign"("campaignCloseDate");

-- CreateIndex
CREATE INDEX "Campaign_createdAt_idx" ON "Campaign"("createdAt");

-- CreateIndex
CREATE INDEX "Campaign_createdById_idx" ON "Campaign"("createdById");

-- CreateIndex
CREATE INDEX "Campaign_updatedById_idx" ON "Campaign"("updatedById");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyDetail_campaignId_key" ON "PropertyDetail"("campaignId");

-- CreateIndex
CREATE INDEX "PropertyDetail_state_idx" ON "PropertyDetail"("state");

-- CreateIndex
CREATE INDEX "PropertyDetail_location_idx" ON "PropertyDetail"("location");

-- CreateIndex
CREATE INDEX "PropertyDetail_propertyType_idx" ON "PropertyDetail"("propertyType");

-- CreateIndex
CREATE INDEX "PropertyDetail_tenure_idx" ON "PropertyDetail"("tenure");

-- CreateIndex
CREATE INDEX "PropertyDetail_bumiStatus_idx" ON "PropertyDetail"("bumiStatus");

-- CreateIndex
CREATE UNIQUE INDEX "FileAsset_fileRef_key" ON "FileAsset"("fileRef");

-- CreateIndex
CREATE UNIQUE INDEX "FileAsset_objectKey_key" ON "FileAsset"("objectKey");

-- CreateIndex
CREATE INDEX "FileAsset_visibility_idx" ON "FileAsset"("visibility");

-- CreateIndex
CREATE INDEX "FileAsset_purpose_idx" ON "FileAsset"("purpose");

-- CreateIndex
CREATE INDEX "FileAsset_createdAt_idx" ON "FileAsset"("createdAt");

-- CreateIndex
CREATE INDEX "CampaignMedia_campaignId_idx" ON "CampaignMedia"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignMedia_fileAssetId_idx" ON "CampaignMedia"("fileAssetId");

-- CreateIndex
CREATE INDEX "CampaignMedia_mediaType_idx" ON "CampaignMedia"("mediaType");

-- CreateIndex
CREATE INDEX "CampaignMedia_sortOrder_idx" ON "CampaignMedia"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignDocument_documentRef_key" ON "CampaignDocument"("documentRef");

-- CreateIndex
CREATE INDEX "CampaignDocument_campaignId_idx" ON "CampaignDocument"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignDocument_fileAssetId_idx" ON "CampaignDocument"("fileAssetId");

-- CreateIndex
CREATE INDEX "CampaignDocument_category_idx" ON "CampaignDocument"("category");

-- CreateIndex
CREATE INDEX "CampaignDocument_visibility_idx" ON "CampaignDocument"("visibility");

-- CreateIndex
CREATE INDEX "CampaignDocument_documentStatus_idx" ON "CampaignDocument"("documentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignContent_campaignId_key" ON "CampaignContent"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignUpdate_campaignId_idx" ON "CampaignUpdate"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignUpdate_publishedAt_idx" ON "CampaignUpdate"("publishedAt");

-- CreateIndex
CREATE INDEX "CampaignUpdate_visibility_idx" ON "CampaignUpdate"("visibility");

-- CreateIndex
CREATE INDEX "CampaignFaq_campaignId_idx" ON "CampaignFaq"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignFaq_sortOrder_idx" ON "CampaignFaq"("sortOrder");

-- CreateIndex
CREATE INDEX "CampaignTimelineEvent_campaignId_idx" ON "CampaignTimelineEvent"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignTimelineEvent_eventDate_idx" ON "CampaignTimelineEvent"("eventDate");

-- CreateIndex
CREATE INDEX "CampaignTimelineEvent_visibility_idx" ON "CampaignTimelineEvent"("visibility");

-- CreateIndex
CREATE UNIQUE INDEX "Participation_participationRef_key" ON "Participation"("participationRef");

-- CreateIndex
CREATE INDEX "Participation_memberId_idx" ON "Participation"("memberId");

-- CreateIndex
CREATE INDEX "Participation_campaignId_idx" ON "Participation"("campaignId");

-- CreateIndex
CREATE INDEX "Participation_participationStatus_idx" ON "Participation"("participationStatus");

-- CreateIndex
CREATE INDEX "Participation_reservedUntil_idx" ON "Participation"("reservedUntil");

-- CreateIndex
CREATE INDEX "Participation_expiresAt_idx" ON "Participation"("expiresAt");

-- CreateIndex
CREATE INDEX "Participation_createdAt_idx" ON "Participation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentRef_key" ON "Payment"("paymentRef");

-- CreateIndex
CREATE INDEX "Payment_memberId_idx" ON "Payment"("memberId");

-- CreateIndex
CREATE INDEX "Payment_campaignId_idx" ON "Payment"("campaignId");

-- CreateIndex
CREATE INDEX "Payment_participationId_idx" ON "Payment"("participationId");

-- CreateIndex
CREATE INDEX "Payment_gatewayTransactionId_idx" ON "Payment"("gatewayTransactionId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_createdAt_idx" ON "Payment"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentWebhookEvent_providerEventId_key" ON "PaymentWebhookEvent"("providerEventId");

-- CreateIndex
CREATE INDEX "PaymentWebhookEvent_paymentId_idx" ON "PaymentWebhookEvent"("paymentId");

-- CreateIndex
CREATE INDEX "PaymentWebhookEvent_processingStatus_idx" ON "PaymentWebhookEvent"("processingStatus");

-- CreateIndex
CREATE INDEX "PaymentWebhookEvent_receivedAt_idx" ON "PaymentWebhookEvent"("receivedAt");

-- CreateIndex
CREATE INDEX "ManualKycSubmission_memberId_idx" ON "ManualKycSubmission"("memberId");

-- CreateIndex
CREATE INDEX "ManualKycSubmission_status_idx" ON "ManualKycSubmission"("status");

-- CreateIndex
CREATE INDEX "ManualKycSubmission_reviewedById_idx" ON "ManualKycSubmission"("reviewedById");

-- CreateIndex
CREATE INDEX "ManualKycSubmission_submittedAt_idx" ON "ManualKycSubmission"("submittedAt");

-- CreateIndex
CREATE INDEX "ManualKycDocument_submissionId_idx" ON "ManualKycDocument"("submissionId");

-- CreateIndex
CREATE INDEX "ManualKycDocument_fileAssetId_idx" ON "ManualKycDocument"("fileAssetId");

-- CreateIndex
CREATE INDEX "ManualKycDocument_documentType_idx" ON "ManualKycDocument"("documentType");

-- CreateIndex
CREATE INDEX "ManualKycDocument_documentStatus_idx" ON "ManualKycDocument"("documentStatus");

-- CreateIndex
CREATE UNIQUE INDEX "EkycCheck_ekycRef_key" ON "EkycCheck"("ekycRef");

-- CreateIndex
CREATE INDEX "EkycCheck_memberId_idx" ON "EkycCheck"("memberId");

-- CreateIndex
CREATE INDEX "EkycCheck_providerReferenceId_idx" ON "EkycCheck"("providerReferenceId");

-- CreateIndex
CREATE INDEX "EkycCheck_status_idx" ON "EkycCheck"("status");

-- CreateIndex
CREATE INDEX "EkycCheck_reviewedById_idx" ON "EkycCheck"("reviewedById");

-- CreateIndex
CREATE UNIQUE INDEX "EkycWebhookEvent_providerEventId_key" ON "EkycWebhookEvent"("providerEventId");

-- CreateIndex
CREATE INDEX "EkycWebhookEvent_ekycCheckId_idx" ON "EkycWebhookEvent"("ekycCheckId");

-- CreateIndex
CREATE INDEX "EkycWebhookEvent_processingStatus_idx" ON "EkycWebhookEvent"("processingStatus");

-- CreateIndex
CREATE INDEX "EkycWebhookEvent_receivedAt_idx" ON "EkycWebhookEvent"("receivedAt");

-- CreateIndex
CREATE INDEX "CampaignSettlement_campaignId_idx" ON "CampaignSettlement"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignSettlement_settlementScenario_idx" ON "CampaignSettlement"("settlementScenario");

-- CreateIndex
CREATE INDEX "CampaignSettlement_calculationStatus_idx" ON "CampaignSettlement"("calculationStatus");

-- CreateIndex
CREATE INDEX "CampaignSettlement_reviewedById_idx" ON "CampaignSettlement"("reviewedById");

-- CreateIndex
CREATE INDEX "CampaignSettlement_approvedById_idx" ON "CampaignSettlement"("approvedById");

-- CreateIndex
CREATE INDEX "CampaignSettlement_lockedById_idx" ON "CampaignSettlement"("lockedById");

-- CreateIndex
CREATE UNIQUE INDEX "DistributionBatch_batchRef_key" ON "DistributionBatch"("batchRef");

-- CreateIndex
CREATE INDEX "DistributionBatch_campaignId_idx" ON "DistributionBatch"("campaignId");

-- CreateIndex
CREATE INDEX "DistributionBatch_settlementId_idx" ON "DistributionBatch"("settlementId");

-- CreateIndex
CREATE INDEX "DistributionBatch_status_idx" ON "DistributionBatch"("status");

-- CreateIndex
CREATE INDEX "DistributionBatch_approvedById_idx" ON "DistributionBatch"("approvedById");

-- CreateIndex
CREATE INDEX "DistributionBatch_createdById_idx" ON "DistributionBatch"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "Distribution_distributionRef_key" ON "Distribution"("distributionRef");

-- CreateIndex
CREATE INDEX "Distribution_distributionBatchId_idx" ON "Distribution"("distributionBatchId");

-- CreateIndex
CREATE INDEX "Distribution_campaignId_idx" ON "Distribution"("campaignId");

-- CreateIndex
CREATE INDEX "Distribution_memberId_idx" ON "Distribution"("memberId");

-- CreateIndex
CREATE INDEX "Distribution_participationId_idx" ON "Distribution"("participationId");

-- CreateIndex
CREATE INDEX "Distribution_status_idx" ON "Distribution"("status");

-- CreateIndex
CREATE INDEX "Distribution_paymentReference_idx" ON "Distribution"("paymentReference");

-- CreateIndex
CREATE INDEX "Distribution_paymentDate_idx" ON "Distribution"("paymentDate");

-- CreateIndex
CREATE INDEX "Distribution_markedProcessingById_idx" ON "Distribution"("markedProcessingById");

-- CreateIndex
CREATE INDEX "Distribution_markedPaidById_idx" ON "Distribution"("markedPaidById");

-- CreateIndex
CREATE UNIQUE INDEX "AuditLog_auditRef_key" ON "AuditLog"("auditRef");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Report_reportRef_key" ON "Report"("reportRef");

-- CreateIndex
CREATE INDEX "Report_reportType_idx" ON "Report"("reportType");

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_generatedById_idx" ON "Report"("generatedById");

-- CreateIndex
CREATE INDEX "Report_generatedAt_idx" ON "Report"("generatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_notificationRef_key" ON "Notification"("notificationRef");

-- CreateIndex
CREATE INDEX "Notification_memberId_idx" ON "Notification"("memberId");

-- CreateIndex
CREATE INDEX "Notification_campaignId_idx" ON "Notification"("campaignId");

-- CreateIndex
CREATE INDEX "Notification_status_idx" ON "Notification"("status");

-- CreateIndex
CREATE INDEX "Notification_sentAt_idx" ON "Notification"("sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "Announcement_announcementRef_key" ON "Announcement"("announcementRef");

-- CreateIndex
CREATE INDEX "Announcement_status_idx" ON "Announcement"("status");

-- CreateIndex
CREATE INDEX "Announcement_publishedAt_idx" ON "Announcement"("publishedAt");

-- CreateIndex
CREATE INDEX "Announcement_createdById_idx" ON "Announcement"("createdById");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberContact" ADD CONSTRAINT "MemberContact_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberAddress" ADD CONSTRAINT "MemberAddress_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberBankAccount" ADD CONSTRAINT "MemberBankAccount_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberBankAccount" ADD CONSTRAINT "MemberBankAccount_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberNominee" ADD CONSTRAINT "MemberNominee_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProfile" ADD CONSTRAINT "AdminProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminProfile" ADD CONSTRAINT "AdminProfile_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyDetail" ADD CONSTRAINT "PropertyDetail_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignMedia" ADD CONSTRAINT "CampaignMedia_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignMedia" ADD CONSTRAINT "CampaignMedia_fileAssetId_fkey" FOREIGN KEY ("fileAssetId") REFERENCES "FileAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignDocument" ADD CONSTRAINT "CampaignDocument_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignDocument" ADD CONSTRAINT "CampaignDocument_fileAssetId_fkey" FOREIGN KEY ("fileAssetId") REFERENCES "FileAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignContent" ADD CONSTRAINT "CampaignContent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignUpdate" ADD CONSTRAINT "CampaignUpdate_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignFaq" ADD CONSTRAINT "CampaignFaq_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignTimelineEvent" ADD CONSTRAINT "CampaignTimelineEvent_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "Participation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentWebhookEvent" ADD CONSTRAINT "PaymentWebhookEvent_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualKycSubmission" ADD CONSTRAINT "ManualKycSubmission_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualKycSubmission" ADD CONSTRAINT "ManualKycSubmission_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualKycDocument" ADD CONSTRAINT "ManualKycDocument_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ManualKycSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualKycDocument" ADD CONSTRAINT "ManualKycDocument_fileAssetId_fkey" FOREIGN KEY ("fileAssetId") REFERENCES "FileAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EkycCheck" ADD CONSTRAINT "EkycCheck_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EkycCheck" ADD CONSTRAINT "EkycCheck_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EkycWebhookEvent" ADD CONSTRAINT "EkycWebhookEvent_ekycCheckId_fkey" FOREIGN KEY ("ekycCheckId") REFERENCES "EkycCheck"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignSettlement" ADD CONSTRAINT "CampaignSettlement_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignSettlement" ADD CONSTRAINT "CampaignSettlement_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignSettlement" ADD CONSTRAINT "CampaignSettlement_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignSettlement" ADD CONSTRAINT "CampaignSettlement_lockedById_fkey" FOREIGN KEY ("lockedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributionBatch" ADD CONSTRAINT "DistributionBatch_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributionBatch" ADD CONSTRAINT "DistributionBatch_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "CampaignSettlement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributionBatch" ADD CONSTRAINT "DistributionBatch_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistributionBatch" ADD CONSTRAINT "DistributionBatch_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distribution" ADD CONSTRAINT "Distribution_distributionBatchId_fkey" FOREIGN KEY ("distributionBatchId") REFERENCES "DistributionBatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distribution" ADD CONSTRAINT "Distribution_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distribution" ADD CONSTRAINT "Distribution_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distribution" ADD CONSTRAINT "Distribution_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "Participation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distribution" ADD CONSTRAINT "Distribution_markedProcessingById_fkey" FOREIGN KEY ("markedProcessingById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distribution" ADD CONSTRAINT "Distribution_markedPaidById_fkey" FOREIGN KEY ("markedPaidById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_fileAssetId_fkey" FOREIGN KEY ("fileAssetId") REFERENCES "FileAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
