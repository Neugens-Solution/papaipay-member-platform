const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const permissions = [
    { key: 'campaign.read', description: 'View campaign records' },
    { key: 'campaign.manage', description: 'Manage campaign setup records' },
    { key: 'settlement.manage', description: 'Manage settlement calculation records' },
    { key: 'distribution.manage', description: 'Manage distribution processing records' },
    { key: 'report.read', description: 'View reports' },
  ]

  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: permission,
      create: permission,
    })
  }

  const superAdminRole = await prisma.role.upsert({
    where: { name: 'Super Admin' },
    update: { description: 'Full platform governance' },
    create: { name: 'Super Admin', description: 'Full platform governance' },
  })

  const allPermissions = await prisma.permission.findMany()
  for (const permission of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: superAdminRole.id, permissionId: permission.id } },
      update: {},
      create: { roleId: superAdminRole.id, permissionId: permission.id },
    })
  }

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.local' },
    update: { status: 'Active' },
    create: { email: 'admin@example.local', status: 'Active', authProvider: 'future-auth-provider' },
  })

  await prisma.adminProfile.upsert({
    where: { userId: adminUser.id },
    update: { displayName: 'Operations Admin', roleId: superAdminRole.id, status: 'Active' },
    create: {
      userId: adminUser.id,
      adminRef: 'ADM-000001',
      displayName: 'Operations Admin',
      roleId: superAdminRole.id,
      status: 'Active',
      activatedAt: new Date('2026-01-01T00:00:00.000Z'),
    },
  })

  const memberUser = await prisma.user.upsert({
    where: { email: 'member@example.local' },
    update: { status: 'Active' },
    create: { email: 'member@example.local', phone: '+60120000001', status: 'Active', authProvider: 'future-auth-provider' },
  })

  const member = await prisma.member.upsert({
    where: { memberRef: 'MEM-000001' },
    update: { fullName: 'Sample Member', verificationStatus: 'Approved' },
    create: {
      userId: memberUser.id,
      memberRef: 'MEM-000001',
      fullName: 'Sample Member',
      icNumberEncrypted: 'encrypted-sample-ic',
      nationality: 'Malaysian',
      verificationStatus: 'Approved',
      profileCompletedAt: new Date('2026-01-02T00:00:00.000Z'),
    },
  })

  await prisma.memberContact.upsert({
    where: { id: '00000000-0000-0000-0000-000000000101' },
    update: { email: 'member@example.local', phone: '+60120000001' },
    create: { id: '00000000-0000-0000-0000-000000000101', memberId: member.id, email: 'member@example.local', phone: '+60120000001', isPrimary: true },
  })

  await prisma.memberAddress.upsert({
    where: { id: '00000000-0000-0000-0000-000000000102' },
    update: { city: 'Kuala Lumpur', state: 'Kuala Lumpur' },
    create: {
      id: '00000000-0000-0000-0000-000000000102',
      memberId: member.id,
      addressLine1: 'Sample address line 1',
      city: 'Kuala Lumpur',
      state: 'Kuala Lumpur',
      postcode: '50000',
      country: 'Malaysia',
      isPrimary: true,
    },
  })

  await prisma.memberBankAccount.upsert({
    where: { id: '00000000-0000-0000-0000-000000000103' },
    update: { bankName: 'Sample Bank', accountHolderName: 'Sample Member', verificationStatus: 'Verified', verifiedById: adminUser.id, verifiedAt: new Date('2026-01-03T00:00:00.000Z'), adminNotes: 'Bank account verified against submitted bank statement.' },
    create: {
      id: '00000000-0000-0000-0000-000000000103',
      memberId: member.id,
      bankName: 'Sample Bank',
      accountHolderName: 'Sample Member',
      accountNumberEncrypted: 'encrypted-sample-account-number',
      accountNumberLast4: '0001',
      verificationStatus: 'Verified',
      verifiedById: adminUser.id,
      verifiedAt: new Date('2026-01-03T00:00:00.000Z'),
      adminNotes: 'Bank account verified against submitted bank statement.',
      isPrimary: true,
    },
  })

  const manualKycFiles = [
    ['00000000-0000-0000-0000-000000000301', 'FIL-000001', 'ic-front.pdf'],
    ['00000000-0000-0000-0000-000000000302', 'FIL-000002', 'ic-back.pdf'],
    ['00000000-0000-0000-0000-000000000303', 'FIL-000003', 'selfie-holding-ic.jpg'],
    ['00000000-0000-0000-0000-000000000304', 'FIL-000004', 'bank-statement.pdf'],
  ]

  for (const [id, fileRef, fileName] of manualKycFiles) {
    await prisma.fileAsset.upsert({
      where: { fileRef },
      update: { originalFilename: fileName, objectKey: `member-verification/sample/${fileName}` },
      create: {
        id,
        fileRef,
        bucket: 'member-verification',
        objectKey: `member-verification/sample/${fileName}`,
        originalFilename: fileName,
        contentType: fileName.endsWith('.jpg') ? 'image/jpeg' : 'application/pdf',
        sizeBytes: 1024,
        visibility: 'InternalOnly',
        purpose: 'ManualKycDocument',
      },
    })
  }

  const manualKycSubmission = await prisma.manualKycSubmission.upsert({
    where: { id: '00000000-0000-0000-0000-000000000305' },
    update: { status: 'Approved', reviewedById: adminUser.id, reviewedAt: new Date('2026-01-03T00:00:00.000Z') },
    create: {
      id: '00000000-0000-0000-0000-000000000305',
      memberId: member.id,
      status: 'Approved',
      submittedAt: new Date('2026-01-02T12:00:00.000Z'),
      reviewedById: adminUser.id,
      reviewedAt: new Date('2026-01-03T00:00:00.000Z'),
      adminNotes: 'Manual verification approved using the submitted IC, selfie, and bank statement.',
    },
  })

  for (const [id, fileRef, , ] of manualKycFiles) {
    const fileAsset = await prisma.fileAsset.findUniqueOrThrow({ where: { fileRef } })
    const documentType = fileRef === 'FIL-000001' ? 'IcFront' : fileRef === 'FIL-000002' ? 'IcBack' : fileRef === 'FIL-000003' ? 'SelfieHoldingIc' : 'BankStatement'
    await prisma.manualKycDocument.upsert({
      where: { id: id.replace('00000000030', '00000000031') },
      update: { documentStatus: 'Accepted' },
      create: {
        id: id.replace('00000000030', '00000000031'),
        submissionId: manualKycSubmission.id,
        fileAssetId: fileAsset.id,
        documentType,
        documentStatus: 'Accepted',
      },
    })
  }

  const openCampaign = await prisma.campaign.upsert({
    where: { campaignRef: 'CAM-000001' },
    update: { lifecycleStatus: 'Open', publishStatus: 'Published', visibility: 'MemberVisible' },
    create: {
      campaignRef: 'CAM-000001',
      campaignCode: 'PP-SGR-2026-001',
      title: 'Ampang Terrace House',
      slug: 'ampang-terrace-house',
      lifecycleStatus: 'Open',
      publishStatus: 'Published',
      visibility: 'MemberVisible',
      campaignTarget: '560000',
      collectedAmountSnapshot: '420000',
      reservedAmountSnapshot: '25000',
      minimumParticipationAmount: '500',
      maximumParticipationAmount: '60000',
      campaignOpenDate: new Date('2026-06-01T00:00:00.000Z'),
      campaignCloseDate: new Date('2026-07-15T00:00:00.000Z'),
      holdingReturnRateMonthly: '1.5',
      returnType: 'UpTo',
      principalProtectionEnabled: true,
      memberProfitDistributionPercentagePlanned: '70',
      platformProfitSharePercentagePlanned: '30',
      createdById: adminUser.id,
      updatedById: adminUser.id,
    },
  })

  const distributedCampaign = await prisma.campaign.upsert({
    where: { campaignRef: 'CAM-000002' },
    update: { lifecycleStatus: 'Distributed', publishStatus: 'Published', visibility: 'MemberVisible' },
    create: {
      campaignRef: 'CAM-000002',
      campaignCode: 'PP-KL-2025-001',
      title: 'Bangi Terrace House',
      slug: 'bangi-terrace-house',
      lifecycleStatus: 'Distributed',
      publishStatus: 'Published',
      visibility: 'MemberVisible',
      campaignTarget: '500000',
      collectedAmountSnapshot: '500000',
      reservedAmountSnapshot: '0',
      minimumParticipationAmount: '500',
      maximumParticipationAmount: '50000',
      campaignOpenDate: new Date('2025-01-15T00:00:00.000Z'),
      campaignCloseDate: new Date('2025-02-15T00:00:00.000Z'),
      holdingReturnRateMonthly: '1.5',
      returnType: 'Fixed',
      principalProtectionEnabled: true,
      memberProfitDistributionPercentagePlanned: '70',
      platformProfitSharePercentagePlanned: '30',
      createdById: adminUser.id,
      updatedById: adminUser.id,
    },
  })

  for (const [campaign, property] of [
    [openCampaign, { propertyType: 'Terrace House', state: 'Selangor', location: 'Ampang', fullAddress: 'Sample address, Ampang, Selangor', reservePrice: '828900' }],
    [distributedCampaign, { propertyType: 'Terrace House', state: 'Selangor', location: 'Bangi', fullAddress: 'Sample address, Bangi, Selangor', reservePrice: '720000' }],
  ]) {
    await prisma.propertyDetail.upsert({
      where: { campaignId: campaign.id },
      update: property,
      create: {
        campaignId: campaign.id,
        tenure: 'Freehold',
        tenureAlias: 'FH',
        isLaca: true,
        bumiStatus: 'NonBumi',
        builtUpArea: '2,039 sq.ft',
        landArea: '2,200 sq.ft',
        bedrooms: 4,
        bathrooms: 3,
        auctionDate: new Date('2026-06-25T00:00:00.000Z'),
        ...property,
      },
    })

    await prisma.campaignContent.upsert({
      where: { campaignId: campaign.id },
      update: { aboutCampaign: `${campaign.title} campaign overview for member display.` },
      create: {
        campaignId: campaign.id,
        aboutCampaign: `${campaign.title} campaign overview for member display.`,
        importantInformation: 'Participation is subject to campaign documents and terms.',
        riskDisclaimer: 'Members should review all campaign information before participating.',
        holdingReturnExplanation: 'Holding Return accrues during the holding period and is paid once during final distribution when applicable.',
        finalDistributionExplanation: 'Final Distribution combines Principal Return, Holding Return, and Profit Distribution when applicable.',
      },
    })

    await prisma.campaignDocument.upsert({
      where: { documentRef: campaign.campaignRef === 'CAM-000001' ? 'DOC-000001' : 'DOC-000002' },
      update: { title: 'Proclamation of Sale' },
      create: {
        documentRef: campaign.campaignRef === 'CAM-000001' ? 'DOC-000001' : 'DOC-000002',
        campaignId: campaign.id,
        category: 'ProclamationOfSale',
        title: 'Proclamation of Sale',
        visibility: 'MemberVisible',
        documentStatus: 'Ready',
      },
    })
  }

  const participation = await prisma.participation.upsert({
    where: { participationRef: 'PAR-000001' },
    update: { participationStatus: 'Confirmed' },
    create: {
      participationRef: 'PAR-000001',
      memberId: member.id,
      campaignId: distributedCampaign.id,
      participationAmount: '10000',
      participationStatus: 'Confirmed',
      reservedAt: new Date('2025-02-10T00:00:00.000Z'),
      reservedUntil: new Date('2025-02-10T00:30:00.000Z'),
      expiresAt: new Date('2025-02-10T00:30:00.000Z'),
      confirmedAt: new Date('2025-02-10T00:00:00.000Z'),
    },
  })

  const payment = await prisma.payment.upsert({
    where: { paymentRef: 'PAY-000001' },
    update: { status: 'Succeeded' },
    create: {
      paymentRef: 'PAY-000001',
      memberId: member.id,
      campaignId: distributedCampaign.id,
      participationId: participation.id,
      gateway: 'future-payment-gateway',
      gatewayTransactionId: 'gateway-sample-transaction',
      amount: '10000',
      status: 'Succeeded',
      providerResponse: { status: 'succeeded', environment: 'sample' },
      providerResponseEncrypted: 'encrypted-full-provider-response',
    },
  })

  const settlement = await prisma.campaignSettlement.upsert({
    where: { id: '00000000-0000-0000-0000-000000000201' },
    update: { calculationStatus: 'Locked' },
    create: {
      id: '00000000-0000-0000-0000-000000000201',
      campaignId: distributedCampaign.id,
      purchasePrice: '720000',
      salePrice: '950000',
      acquisitionCosts: { legalFee: 12000, stampDuty: 18000 },
      holdingCosts: { maintenanceFee: 4500, insurance: 1200 },
      renovationCosts: { renovation: 35000, cleaning: 1200 },
      disposalCosts: { agentFee: 18000, documentation: 900 },
      platformCosts: { platformFee: 8000, managementFee: 6500 },
      settlementScenario: 'SuccessfulExit',
      holdingPeriodMonths: 15,
      holdingStartDate: new Date('2025-02-15T00:00:00.000Z'),
      saleCompletedAt: new Date('2025-10-30T00:00:00.000Z'),
      distributionCalculationDate: new Date('2025-11-03T00:00:00.000Z'),
      memberProfitDistributionPercentage: '70',
      platformProfitSharePercentage: '30',
      grossProfitSnapshot: '230000',
      totalCostsSnapshot: '105300',
      netProfitSnapshot: '124700',
      calculationStatus: 'Locked',
      calculationRemarks: 'Sample locked settlement for distributed campaign.',
      principalReturnPool: '500000',
      holdingReturnPool: '112500',
      profitDistributionPool: '87290',
      platformShare: '37410',
      finalDistributionPool: '699790',
      reviewedById: adminUser.id,
      reviewedAt: new Date('2025-11-01T00:00:00.000Z'),
      approvedById: adminUser.id,
      approvedAt: new Date('2025-11-02T00:00:00.000Z'),
      lockedById: adminUser.id,
      lockedAt: new Date('2025-11-03T00:00:00.000Z'),
    },
  })

  const batch = await prisma.distributionBatch.upsert({
    where: { batchRef: 'DBT-000001' },
    update: { status: 'Completed' },
    create: {
      batchRef: 'DBT-000001',
      campaignId: distributedCampaign.id,
      settlementId: settlement.id,
      totalMembers: 1,
      totalFinalDistribution: '13995.80',
      pendingCount: 0,
      processingCount: 0,
      paidCount: 1,
      status: 'Completed',
      lockedStatus: true,
      approvedById: adminUser.id,
      approvedAt: new Date('2025-11-04T00:00:00.000Z'),
      createdById: adminUser.id,
    },
  })

  await prisma.distribution.upsert({
    where: { distributionRef: 'DIS-000001' },
    update: { status: 'Paid' },
    create: {
      distributionRef: 'DIS-000001',
      distributionBatchId: batch.id,
      campaignId: distributedCampaign.id,
      memberId: member.id,
      participationId: participation.id,
      principalReturn: '10000',
      holdingReturn: '2250',
      profitDistribution: '1745.80',
      finalDistributionTotal: '13995.80',
      status: 'Paid',
      paymentDate: new Date('2025-11-15T00:00:00.000Z'),
      paymentReference: 'PAY-OUT-000001',
      adminNotes: 'Manual transfer recorded for sample distribution.',
      markedPaidById: adminUser.id,
      markedPaidAt: new Date('2025-11-15T00:00:00.000Z'),
    },
  })

  await prisma.auditLog.upsert({
    where: { auditRef: 'AUD-000001' },
    update: { action: 'Seeded Phase 1 data foundation' },
    create: {
      auditRef: 'AUD-000001',
      actorId: adminUser.id,
      action: 'Seeded Phase 1 data foundation',
      entityType: 'Campaign',
      entityId: distributedCampaign.id,
      afterSnapshot: { campaignRef: distributedCampaign.campaignRef, lifecycleStatus: distributedCampaign.lifecycleStatus },
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
