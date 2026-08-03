import { db } from "@/lib/db";

export async function getAdminDistributions() {
  return db.distribution.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      campaign: { select: { campaignRef: true, campaignCode: true, title: true, slug: true } },
      member: { select: { memberRef: true, fullName: true } },
      participation: { select: { participationRef: true } },
      distributionBatch: { select: { batchRef: true, status: true } },
    },
  });
}

export async function getAdminDistributionById(id: string) {
  return db.distribution.findUnique({
    where: { id },
    include: {
      campaign: { select: { campaignRef: true, campaignCode: true, title: true, slug: true } },
      member: { select: { memberRef: true, fullName: true, bankAccounts: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }], take: 1 } } },
      participation: { select: { participationRef: true, participationAmount: true } },
      distributionBatch: { select: { batchRef: true, status: true, approvedAt: true } },
      markedPaidBy: { select: { email: true } },
      markedProcessingBy: { select: { email: true } },
    },
  });
}
