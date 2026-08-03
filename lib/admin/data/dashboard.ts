import { db } from "@/lib/db";
import { decimalToNumber } from "@/lib/utils/formatters";

export async function getAdminDashboardData() {
  const [
    memberCount,
    listingCount,
    openListingCount,
    pendingKycCount,
    pendingReceiptCount,
    confirmedParticipation,
    paidDistribution,
    recentListings,
    recentMembers,
    pendingReceipts,
  ] = await Promise.all([
    db.member.count(),
    db.campaign.count(),
    db.campaign.count({ where: { lifecycleStatus: "Open", publishStatus: "Published" } }),
    db.manualKycSubmission.count({ where: { status: { in: ["Submitted", "UnderReview"] } } }),
    db.payment.count({ where: { status: "Processing", receiptFileAssetId: { not: null } } }),
    db.participation.aggregate({ where: { participationStatus: "Confirmed" }, _sum: { participationAmount: true } }),
    db.distribution.aggregate({ where: { status: "Paid", distributionBatch: { status: "Completed" } }, _sum: { finalDistributionTotal: true } }),
    db.campaign.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { id: true, title: true, slug: true, lifecycleStatus: true, campaignTarget: true, collectedAmountSnapshot: true, _count: { select: { participations: true } } },
    }),
    db.member.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, memberRef: true, fullName: true, verificationStatus: true, createdAt: true, user: { select: { email: true } }, manualKycSubmissions: { orderBy: { createdAt: "desc" }, take: 1, select: { status: true } } },
    }),
    db.payment.findMany({
      where: { status: "Processing", receiptFileAssetId: { not: null } },
      orderBy: { submittedAt: "asc" },
      take: 8,
      select: {
        id: true,
        paymentRef: true,
        amount: true,
        submittedAt: true,
        submittedReference: true,
        member: { select: { memberRef: true, fullName: true } },
        campaign: { select: { title: true, slug: true } },
        participation: { select: { participationRef: true } },
      },
    }),
  ]);

  return {
    memberCount,
    listingCount,
    openListingCount,
    pendingKycCount,
    pendingReceiptCount,
    totalConfirmedParticipation: decimalToNumber(confirmedParticipation._sum.participationAmount),
    totalPaidDistribution: decimalToNumber(paidDistribution._sum.finalDistributionTotal),
    recentListings,
    recentMembers,
    pendingReceipts,
  };
}
