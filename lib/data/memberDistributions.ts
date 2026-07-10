import { DistributionBatchStatus, DistributionStatus } from "@prisma/client";
import { requireMember } from "@/lib/auth/guards";
import { db } from "@/lib/db";
import { decimalToNumber, formatDate } from "@/lib/utils/formatters";

export type MemberDistributionRecord = {
  id: string;
  slug: string;
  distributionRef: string;
  batchRef: string;
  batchStatus: string;
  campaignRef: string;
  campaignCode: string;
  campaignSlug: string;
  projectTitle: string;
  location: string;
  propertySummary: string;
  participationRef: string;
  participationAmount: number;
  principalReturn: number;
  holdingReturn: number;
  profitDistribution: number;
  finalDistributionTotal: number;
  status: string;
  paidDate: string;
  paymentDate: Date | null;
  paymentReference: string;
  adminNotes: string;
  createdAt: Date;
};

type DistributionWithRelations = Awaited<ReturnType<typeof getPaidMemberDistributionRows>>[number];

function assertProductionDatabaseConfigured() {
  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be configured for member distribution data in production.");
  }
}

const paidCompletedWhere = (memberId: string) => ({
  memberId,
  participation: { memberId },
  status: DistributionStatus.Paid,
  distributionBatch: { status: DistributionBatchStatus.Completed },
});

async function getPaidMemberDistributionRows(memberId: string) {
  if (!process.env.DATABASE_URL) {
    assertProductionDatabaseConfigured();
    return [];
  }

  return db.distribution.findMany({
    where: paidCompletedWhere(memberId),
    orderBy: [{ paymentDate: "desc" }, { createdAt: "desc" }],
    include: {
      distributionBatch: true,
      participation: true,
      campaign: { include: { propertyDetail: true } },
    },
  });
}

function mapDistribution(row: DistributionWithRelations): MemberDistributionRecord {
  const property = row.campaign.propertyDetail;
  const propertySummary = [property?.propertyType, property?.assetCategory, property?.tenure]
    .filter(Boolean)
    .join(" • ");

  return {
    id: row.id,
    slug: row.distributionRef || row.id,
    distributionRef: row.distributionRef,
    batchRef: row.distributionBatch.batchRef,
    batchStatus: row.distributionBatch.status,
    campaignRef: row.campaign.campaignRef,
    campaignCode: row.campaign.campaignCode,
    campaignSlug: row.campaign.slug,
    projectTitle: row.campaign.title,
    location: property?.location || property?.state || "Malaysia",
    propertySummary: propertySummary || "Property details to be confirmed",
    participationRef: row.participation.participationRef,
    participationAmount: decimalToNumber(row.participation.participationAmount),
    principalReturn: decimalToNumber(row.principalReturn),
    holdingReturn: decimalToNumber(row.holdingReturn),
    profitDistribution: decimalToNumber(row.profitDistribution),
    finalDistributionTotal: decimalToNumber(row.finalDistributionTotal),
    status: row.status,
    paidDate: formatDate(row.paymentDate || row.createdAt),
    paymentDate: row.paymentDate,
    paymentReference: row.paymentReference || "Not provided",
    adminNotes: row.adminNotes || "Manual payment has been recorded by PAPAIPAY.",
    createdAt: row.createdAt,
  };
}

export async function getMemberDistributions() {
  try {
    const { member } = await requireMember();
    const rows = await getPaidMemberDistributionRows(member.id);
    const records = rows.map(mapDistribution);

    return {
      records,
      totalCount: records.length,
      totalFinalDistributionReceived: records.reduce((sum, record) => sum + record.finalDistributionTotal, 0),
      unavailable: false,
    };
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
    console.warn("Unable to load member distributions from the database.", error);
    return { records: [], totalCount: 0, totalFinalDistributionReceived: 0, unavailable: true };
  }
}

export async function getMemberDistributionByRefOrSlug(params: { slug: string }) {
  const { member } = await requireMember();
  if (!process.env.DATABASE_URL) {
    assertProductionDatabaseConfigured();
    return null;
  }

  const row = await db.distribution.findFirst({
    where: {
      ...paidCompletedWhere(member.id),
      OR: [{ distributionRef: params.slug }, { id: params.slug }],
    },
    include: {
      distributionBatch: true,
      participation: true,
      campaign: { include: { propertyDetail: true } },
    },
  });

  return row ? mapDistribution(row) : null;
}

export function formatDistributionAmount(value: number) {
  return `RM${value.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
