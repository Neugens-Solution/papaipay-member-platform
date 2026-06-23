import { db } from "@/lib/db";
import { portfolioRecords } from "@/lib/memberMockData";
import { decimalToNumber, formatDate } from "@/lib/utils/formatters";

const DEMO_MEMBER_REF = process.env.DEMO_MEMBER_REF || "MEM-000001";

type ParticipationWithRelations = Awaited<ReturnType<typeof getMemberParticipationsRaw>>[number];

function statusLabel(status: string) {
  if (status === "PendingPayment") return "Pending Payment";
  return status;
}

async function getMemberParticipationsRaw() {
  if (!process.env.DATABASE_URL) return [];

  return db.participation.findMany({
    where: { member: { memberRef: DEMO_MEMBER_REF } },
    orderBy: { createdAt: "desc" },
    include: {
      campaign: { include: { propertyDetail: true } },
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
      distributions: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}

export async function getMemberParticipations() {
  try {
    const records = await getMemberParticipationsRaw();
    if (records.length === 0 && !process.env.DATABASE_URL) return portfolioRecords;

    return records.map((record: ParticipationWithRelations) => {
      const latestDistribution = record.distributions[0];
      return {
        slug: record.id,
        campaignId: record.campaign.campaignRef,
        campaignCode: record.campaign.campaignCode,
        participationId: record.participationRef,
        propertyName: record.campaign.title,
        location: record.campaign.propertyDetail?.location || record.campaign.propertyDetail?.state || "Malaysia",
        participationAmount: decimalToNumber(record.participationAmount),
        status: statusLabel(record.participationStatus),
        latestUpdate: record.reservedUntil ? `Reserved until ${formatDate(record.reservedUntil)}` : formatDate(record.createdAt),
        distributionStatus: latestDistribution ? latestDistribution.status : "Pending Payment",
        finalDistributionTotal: latestDistribution ? decimalToNumber(latestDistribution.finalDistributionTotal) : 0,
        holdingPeriodMonths: 0,
      };
    });
  } catch (error) {
    console.warn("Falling back to demo portfolio records because database reads are unavailable.", error);
    return portfolioRecords;
  }
}

export async function getMemberParticipationById(id: string) {
  if (!process.env.DATABASE_URL) return null;

  return db.participation.findFirst({
    where: { id, member: { memberRef: DEMO_MEMBER_REF } },
    include: {
      member: true,
      campaign: { include: { propertyDetail: true } },
      payments: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });
}
