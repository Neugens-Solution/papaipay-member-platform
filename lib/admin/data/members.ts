import { MemberVerificationStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { decimalToNumber } from "@/lib/utils/formatters";

const allowedVerificationStatuses = new Set<MemberVerificationStatus>(Object.values(MemberVerificationStatus));

export async function getAdminMemberSummaries({ query = "", status = "" }: { query?: string; status?: string } = {}) {
  const normalizedQuery = query.trim();
  const normalizedStatus = allowedVerificationStatuses.has(status as MemberVerificationStatus)
    ? status as MemberVerificationStatus
    : undefined;
  const rows = await db.member.findMany({
    where: {
      ...(normalizedStatus ? { verificationStatus: normalizedStatus } : {}),
      ...(normalizedQuery
        ? {
            OR: [
              { memberRef: { contains: normalizedQuery, mode: "insensitive" } },
              { fullName: { contains: normalizedQuery, mode: "insensitive" } },
              { user: { email: { contains: normalizedQuery, mode: "insensitive" } } },
              { user: { phone: { contains: normalizedQuery, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      memberRef: true,
      fullName: true,
      verificationStatus: true,
      createdAt: true,
      user: { select: { email: true, phone: true } },
      manualKycSubmissions: { orderBy: { createdAt: "desc" }, take: 1, select: { status: true } },
      _count: { select: { participations: true } },
    },
  });

  const memberIds = rows.map((row) => row.id);
  const [participationTotals, distributionTotals, activeCampaignPairs] = memberIds.length
    ? await Promise.all([
        db.participation.groupBy({
          by: ["memberId"],
          where: { memberId: { in: memberIds }, participationStatus: "Confirmed" },
          _sum: { participationAmount: true },
        }),
        db.distribution.groupBy({
          by: ["memberId"],
          where: { memberId: { in: memberIds }, status: "Paid", distributionBatch: { status: "Completed" } },
          _sum: { finalDistributionTotal: true },
        }),
        db.participation.groupBy({
          by: ["memberId", "campaignId"],
          where: { memberId: { in: memberIds }, participationStatus: "Confirmed", campaign: { lifecycleStatus: { in: ["Open", "Funded", "Holding", "Sold", "DistributionProcessing"] } } },
        }),
      ])
    : [[], [], []];

  const participationByMember = new Map(participationTotals.map((row) => [row.memberId, decimalToNumber(row._sum.participationAmount)]));
  const distributionByMember = new Map(distributionTotals.map((row) => [row.memberId, decimalToNumber(row._sum.finalDistributionTotal)]));
  const activeByMember = activeCampaignPairs.reduce((map, row) => map.set(row.memberId, (map.get(row.memberId) || 0) + 1), new Map<string, number>());

  return rows.map((row) => ({
    ...row,
    displayVerificationStatus: row.manualKycSubmissions[0]?.status || row.verificationStatus,
    totalParticipation: participationByMember.get(row.id) || 0,
    totalDistribution: distributionByMember.get(row.id) || 0,
    activeCampaigns: activeByMember.get(row.id) || 0,
  }));
}

export async function getAdminMemberById(id: string) {
  return db.member.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, phone: true, status: true, lastLoginAt: true, createdAt: true } },
      contacts: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] },
      addresses: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] },
      bankAccounts: { orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }] },
      nominees: { orderBy: { createdAt: "asc" } },
      manualKycSubmissions: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          reviewedBy: { select: { email: true } },
          documents: { orderBy: { createdAt: "asc" }, include: { fileAsset: true } },
        },
      },
      participations: {
        orderBy: { createdAt: "desc" },
        take: 50,
        include: {
          campaign: { select: { title: true, slug: true, campaignRef: true } },
          payments: { orderBy: { updatedAt: "desc" }, take: 1, include: { receiptFileAsset: true } },
        },
      },
      distributions: {
        where: { status: "Paid", distributionBatch: { status: "Completed" } },
        orderBy: { createdAt: "desc" },
        take: 50,
        include: { campaign: { select: { title: true, campaignRef: true } } },
      },
    },
  });
}
