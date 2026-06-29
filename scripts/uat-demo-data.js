#!/usr/bin/env node

let prisma

function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = require('@prisma/client')
    prisma = new PrismaClient()
  }
  return prisma
}

const UAT = {
  campaignRef: 'CAM-UAT-000001',
  campaignCode: 'PP-UAT-2026-001',
  campaignTitle: 'UAT Demo — Shah Alam Exit Preview',
  campaignSlug: 'uat-demo-shah-alam-exit-preview',
  memberRef: 'MEM-UAT-000001',
  participationRef: 'PAR-UAT-000001',
  paymentRef: 'PAY-UAT-000001',
  documentRef: 'DOC-UAT-000001',
  userEmail: 'uat-demo-member@example.local',
  userPhone: '+60120000999',
  gatewayTransactionId: 'UAT-DEMO-GATEWAY-000001',
}

const DEMO_REMARKS =
  'UAT demo settlement values. Principal plus holding plus member profit reconcile to final distribution pool.'

function assertSafeManualRun() {
  if (process.env.ALLOW_UAT_DEMO_DATA !== 'true') {
    console.error('Refusing to run UAT demo data helper. Set ALLOW_UAT_DEMO_DATA=true to run manually.')
    printUsage()
    process.exit(1)
  }

  if (process.env.NODE_ENV === 'production') {
    console.error('Refusing to run UAT demo data helper when NODE_ENV=production.')
    process.exit(1)
  }

  if (!['seed', 'cleanup'].includes(process.env.UAT_DEMO_MODE || '')) {
    console.error('Missing or invalid UAT_DEMO_MODE. No data was changed.')
    printUsage()
    process.exit(1)
  }
}

function printUsage() {
  console.error('\nUsage:')
  console.error('  ALLOW_UAT_DEMO_DATA=true UAT_DEMO_MODE=seed node scripts/uat-demo-data.js')
  console.error('  ALLOW_UAT_DEMO_DATA=true UAT_DEMO_MODE=cleanup node scripts/uat-demo-data.js')
}


async function removeUatDistributionArtifacts(tx, campaignId) {
  await tx.distribution.deleteMany({
    where: {
      OR: [
        { distributionRef: { startsWith: 'DIS-UAT-' } },
        ...(campaignId ? [{ campaignId, participation: { participationRef: { startsWith: 'PAR-UAT-' } } }] : []),
      ],
    },
  })

  await tx.distributionBatch.deleteMany({
    where: {
      OR: [
        { batchRef: { startsWith: 'DBT-UAT-' } },
        ...(campaignId ? [{ campaignId, distributions: { none: {} } }] : []),
      ],
    },
  })
}

async function cleanupUatDemoData(tx = getPrisma()) {
  const campaign = await tx.campaign.findUnique({ where: { campaignRef: UAT.campaignRef } })
  const member = await tx.member.findUnique({ where: { memberRef: UAT.memberRef } })

  const deletedWebhookEvents = await tx.paymentWebhookEvent.deleteMany({
    where: { payment: { paymentRef: { startsWith: 'PAY-UAT-' } } },
  })
  const deletedPayments = await tx.payment.deleteMany({ where: { paymentRef: { startsWith: 'PAY-UAT-' } } })

  const deletedDistributions = await tx.distribution.deleteMany({
    where: {
      OR: [
        { distributionRef: { startsWith: 'DIS-UAT-' } },
        ...(campaign ? [{ campaignId: campaign.id, participation: { participationRef: { startsWith: 'PAR-UAT-' } } }] : []),
      ],
    },
  })

  const deletedDistributionBatches = await tx.distributionBatch.deleteMany({
    where: {
      OR: [
        { batchRef: { startsWith: 'DBT-UAT-' } },
        ...(campaign ? [{ campaignId: campaign.id, distributions: { none: {} } }] : []),
      ],
    },
  })

  const deletedParticipations = await tx.participation.deleteMany({
    where: { participationRef: { startsWith: 'PAR-UAT-' } },
  })

  const deletedSettlements = campaign
    ? await tx.campaignSettlement.deleteMany({ where: { campaignId: campaign.id, calculationRemarks: DEMO_REMARKS } })
    : { count: 0 }

  const deletedDocuments = await tx.campaignDocument.deleteMany({ where: { documentRef: { startsWith: 'DOC-UAT-' } } })

  if (campaign) {
    await tx.campaignContent.deleteMany({ where: { campaignId: campaign.id } })
    await tx.campaignMedia.deleteMany({ where: { campaignId: campaign.id } })
    await tx.campaignTimelineEvent.deleteMany({ where: { campaignId: campaign.id } })
    await tx.campaignFaq.deleteMany({ where: { campaignId: campaign.id } })
    await tx.campaignUpdate.deleteMany({ where: { campaignId: campaign.id } })
    await tx.propertyDetail.deleteMany({ where: { campaignId: campaign.id } })
  }

  const deletedCampaigns = await tx.campaign.deleteMany({
    where: { campaignRef: { startsWith: 'CAM-UAT-' }, campaignCode: { startsWith: 'PP-UAT-' } },
  })

  if (member) {
    await tx.memberContact.deleteMany({ where: { memberId: member.id, email: UAT.userEmail } })
    await tx.memberAddress.deleteMany({ where: { memberId: member.id, addressLine1: { startsWith: 'UAT demo' } } })
    await tx.memberBankAccount.deleteMany({ where: { memberId: member.id, adminNotes: { startsWith: 'UAT demo' } } })
  }

  const deletedMembers = await tx.member.deleteMany({ where: { memberRef: { startsWith: 'MEM-UAT-' } } })
  const deletedUsers = await tx.user.deleteMany({ where: { email: UAT.userEmail } })

  return {
    paymentWebhookEvents: deletedWebhookEvents.count,
    payments: deletedPayments.count,
    distributions: deletedDistributions.count,
    distributionBatches: deletedDistributionBatches.count,
    participations: deletedParticipations.count,
    settlements: deletedSettlements.count,
    documents: deletedDocuments.count,
    campaigns: deletedCampaigns.count,
    members: deletedMembers.count,
    users: deletedUsers.count,
  }
}

async function seedUatDemoData() {
  return getPrisma().$transaction(async (tx) => {
    const now = new Date()
    const existingCampaign = await tx.campaign.findUnique({ where: { campaignRef: UAT.campaignRef } })
    await removeUatDistributionArtifacts(tx, existingCampaign?.id)

    const user = await tx.user.upsert({
      where: { email: UAT.userEmail },
      update: { phone: UAT.userPhone, status: 'Active', authProvider: 'uat-demo-helper' },
      create: { email: UAT.userEmail, phone: UAT.userPhone, status: 'Active', authProvider: 'uat-demo-helper' },
    })

    const member = await tx.member.upsert({
      where: { memberRef: UAT.memberRef },
      update: { fullName: 'UAT Demo Member', verificationStatus: 'Approved', profileCompletedAt: now },
      create: {
        userId: user.id,
        memberRef: UAT.memberRef,
        fullName: 'UAT Demo Member',
        nationality: 'Malaysian',
        verificationStatus: 'Approved',
        profileCompletedAt: now,
      },
    })

    await tx.memberContact.deleteMany({ where: { memberId: member.id, email: UAT.userEmail } })
    await tx.memberContact.create({
      data: { memberId: member.id, email: UAT.userEmail, phone: UAT.userPhone, preferredContactMethod: 'Email', isPrimary: true },
    })

    await tx.memberAddress.deleteMany({ where: { memberId: member.id, addressLine1: { startsWith: 'UAT demo' } } })
    await tx.memberAddress.create({
      data: {
        memberId: member.id,
        addressLine1: 'UAT demo address line 1',
        city: 'Shah Alam',
        state: 'Selangor',
        postcode: '40000',
        country: 'Malaysia',
        isPrimary: true,
      },
    })

    const campaign = await tx.campaign.upsert({
      where: { campaignRef: UAT.campaignRef },
      update: campaignData(now),
      create: campaignData(now),
    })

    await tx.propertyDetail.upsert({
      where: { campaignId: campaign.id },
      update: propertyData(),
      create: { campaignId: campaign.id, ...propertyData() },
    })

    await tx.campaignContent.upsert({
      where: { campaignId: campaign.id },
      update: contentData(),
      create: { campaignId: campaign.id, ...contentData() },
    })

    await tx.campaignDocument.upsert({
      where: { documentRef: UAT.documentRef },
      update: { campaignId: campaign.id, title: 'UAT Demo Proclamation of Sale', visibility: 'MemberVisible', documentStatus: 'Ready' },
      create: {
        documentRef: UAT.documentRef,
        campaignId: campaign.id,
        category: 'ProclamationOfSale',
        title: 'UAT Demo Proclamation of Sale',
        visibility: 'MemberVisible',
        documentStatus: 'Ready',
      },
    })

    const participation = await tx.participation.upsert({
      where: { participationRef: UAT.participationRef },
      update: {
        memberId: member.id,
        campaignId: campaign.id,
        participationAmount: '150000',
        participationStatus: 'Confirmed',
        confirmedAt: now,
      },
      create: {
        participationRef: UAT.participationRef,
        memberId: member.id,
        campaignId: campaign.id,
        participationAmount: '150000',
        participationStatus: 'Confirmed',
        reservedAt: now,
        reservedUntil: now,
        expiresAt: now,
        confirmedAt: now,
      },
    })

    const payment = await tx.payment.upsert({
      where: { paymentRef: UAT.paymentRef },
      update: {
        memberId: member.id,
        campaignId: campaign.id,
        participationId: participation.id,
        amount: '150000',
        status: 'Succeeded',
      },
      create: {
        paymentRef: UAT.paymentRef,
        memberId: member.id,
        campaignId: campaign.id,
        participationId: participation.id,
        gateway: 'uat-demo-manual-succeeded-payment',
        gatewayTransactionId: UAT.gatewayTransactionId,
        amount: '150000',
        status: 'Succeeded',
        providerResponse: { status: 'succeeded', environment: 'uat-demo', helper: 'scripts/uat-demo-data.js' },
      },
    })

    const existingSettlement = await tx.campaignSettlement.findFirst({
      where: { campaignId: campaign.id },
      orderBy: { createdAt: 'desc' },
    })

    const settlementData = {
      campaignId: campaign.id,
      purchasePrice: '140000',
      salePrice: '300000',
      acquisitionCosts: { uatDemoTotalApprovedCosts: 10000 },
      holdingCosts: {},
      renovationCosts: {},
      disposalCosts: {},
      platformCosts: {},
      settlementScenario: 'SuccessfulExit',
      holdingPeriodMonths: 0,
      holdingStartDate: new Date('2026-01-01T00:00:00.000Z'),
      saleCompletedAt: now,
      distributionCalculationDate: now,
      memberProfitDistributionPercentage: '90',
      platformProfitSharePercentage: '10',
      grossProfitSnapshot: '160000',
      totalCostsSnapshot: '10000',
      netProfitSnapshot: '150000',
      calculationStatus: 'Locked',
      calculationRemarks: DEMO_REMARKS,
      principalReturnPool: '150000',
      holdingReturnPool: '0',
      profitDistributionPool: '135000',
      platformShare: '15000',
      finalDistributionPool: '285000',
      reviewedAt: now,
      approvedAt: now,
      lockedAt: now,
    }

    const settlement = existingSettlement
      ? await tx.campaignSettlement.update({ where: { id: existingSettlement.id }, data: settlementData })
      : await tx.campaignSettlement.create({ data: settlementData })

    const distributionBatchCount = await tx.distributionBatch.count({ where: { campaignId: campaign.id } })
    const distributionCount = await tx.distribution.count({ where: { campaignId: campaign.id } })

    return { campaign, member, participation, payment, settlement, distributionBatchCount, distributionCount }
  })
}

function campaignData(now) {
  return {
    campaignRef: UAT.campaignRef,
    campaignCode: UAT.campaignCode,
    title: UAT.campaignTitle,
    slug: UAT.campaignSlug,
    lifecycleStatus: 'Sold',
    publishStatus: 'Published',
    visibility: 'MemberVisible',
    campaignTarget: '150000',
    collectedAmountSnapshot: '150000',
    reservedAmountSnapshot: '0',
    minimumParticipationAmount: '500',
    maximumParticipationAmount: '150000',
    campaignOpenDate: new Date('2026-01-01T00:00:00.000Z'),
    campaignCloseDate: new Date('2026-02-01T00:00:00.000Z'),
    holdingReturnRateMonthly: '0',
    returnType: 'Target',
    maximumHoldingPeriodMonths: 24,
    principalProtectionEnabled: true,
    memberProfitDistributionPercentagePlanned: '90',
    platformProfitSharePercentagePlanned: '10',
    publishedAt: now,
  }
}

function propertyData() {
  return {
    propertyType: 'Serviced Apartment',
    assetCategory: 'Residential',
    occupancyStatus: 'Vacant Possession',
    tenure: 'Freehold',
    tenureAlias: 'FH',
    isLaca: false,
    bumiStatus: 'NonBumi',
    builtUpArea: '950 sq.ft',
    landArea: 'N/A',
    bedrooms: 3,
    bathrooms: 2,
    auctionDate: new Date('2026-01-15T00:00:00.000Z'),
    reservePrice: '140000',
    state: 'Selangor',
    location: 'Shah Alam',
    fullAddress: 'UAT Demo Residence, Shah Alam, Selangor',
    yearBuilt: '2018',
  }
}

function contentData() {
  return {
    aboutCampaign: 'UAT-only demo campaign for validating admin listing, member listing, project workspace, financial summary, and distribution preview screens.',
    importantInformation: 'This record is namespaced for UAT demo preparation only and must not be used for production payouts.',
    riskDisclaimer: 'UAT demo data only. No real payout, wallet, KYC, DistributionBatch, or Distribution records are created.',
    holdingReturnExplanation: 'Holding return is RM0 for this UAT demo settlement.',
    finalDistributionExplanation: 'Final distribution preview should reconcile RM150,000 principal plus RM135,000 member profit for RM285,000 total.',
  }
}

function printSeedSummary(result) {
  console.log('\nUAT demo data seeded successfully.')
  console.log(`Campaign title: ${result.campaign.title}`)
  console.log(`Campaign slug: ${result.campaign.slug}`)
  console.log(`Member ref: ${result.member.memberRef}`)
  console.log(`Participation ref: ${result.participation.participationRef}`)
  console.log(`Payment ref: ${result.payment.paymentRef}`)
  console.log(`Settlement status: ${result.settlement.calculationStatus}`)
  console.log('\nExpected distribution preview result:')
  console.log('  Eligible Participants: 1')
  console.log('  Excluded Participants: 0')
  console.log('  Total Eligible Participation Amount: RM150,000')
  console.log('  Succeeded Payment Coverage: RM150,000')
  console.log('  Principal Return: RM150,000')
  console.log('  Holding Return: RM0')
  console.log('  Profit Distribution: RM135,000')
  console.log('  Final Distribution Total: RM285,000')
  console.log(`\nDistributionBatch records for UAT campaign: ${result.distributionBatchCount}`)
  console.log(`Distribution records for UAT campaign: ${result.distributionCount}`)
}

async function main() {
  assertSafeManualRun()

  if (process.env.UAT_DEMO_MODE === 'seed') {
    const result = await seedUatDemoData()
    printSeedSummary(result)
  } else {
    const result = await getPrisma().$transaction((tx) => cleanupUatDemoData(tx))
    console.log('\nUAT demo data cleanup completed safely.')
    console.table(result)
  }
}

main()
  .then(async () => {
    if (prisma) {
      await prisma.$disconnect()
    }
  })
  .catch(async (error) => {
    console.error(error)
    if (prisma) {
      await prisma.$disconnect()
    }
    process.exit(1)
  })
