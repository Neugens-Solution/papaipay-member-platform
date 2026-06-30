"use server";

import { revalidatePath } from "next/cache";
import { DistributionBatchStatus, DistributionStatus, SettlementCalculationStatus, type Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guards";
import { calculateDistributionPreview, type DistributionPreviewResult } from "@/lib/distributions/preview";
import { makeAuditRef } from "@/lib/admin/listings/workspace/audit";
import { toJsonValue } from "@/lib/admin/listings/workspace/types";

export type SaveDraftDistributionBatchState = {
  status: "idle" | "success" | "error";
  message: string | null;
  errors: string[];
};

const ACTIVE_BATCH_STATUSES = [DistributionBatchStatus.Draft, DistributionBatchStatus.Approved, DistributionBatchStatus.Processing, DistributionBatchStatus.Completed] as const;
const ACTIVE_DISTRIBUTION_STATUSES = [DistributionStatus.Pending, DistributionStatus.Processing, DistributionStatus.Paid] as const;

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function makeRef(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function moneyEqual(left?: string | null, right?: string | null) {
  return Math.round(Number(left ?? NaN) * 100) === Math.round(Number(right ?? NaN) * 100);
}

function allReconciled(preview: DistributionPreviewResult) {
  return Object.values(preview.summary.reconciliationDifferences).every((difference) => moneyEqual(difference, "0"));
}

function buildAuditSnapshot(preview: DistributionPreviewResult, settlement: { id: string; calculationStatus: unknown; lockedAt: Date | null; updatedAt: Date }, batch: { id: string; batchRef: string; status: unknown; totalMembers: number | null; totalFinalDistribution: unknown; pendingCount: number | null; createdById: string | null }) {
  return {
    batch: {
      id: batch.id,
      batchRef: batch.batchRef,
      status: String(batch.status),
      totalMembers: batch.totalMembers,
      totalFinalDistribution: String(batch.totalFinalDistribution ?? "0"),
      pendingCount: batch.pendingCount,
      createdById: batch.createdById,
    },
    settlement: {
      id: settlement.id,
      status: String(settlement.calculationStatus),
      lockedAt: settlement.lockedAt?.toISOString() ?? null,
      updatedAt: settlement.updatedAt.toISOString(),
    },
    formula: {
      profile: preview.summary.formulaProfile,
      version: preview.summary.formulaVersion,
    },
    sourcePools: preview.summary.sourcePools,
    allocatedTotals: preview.summary.allocatedTotals,
    reconciliation: preview.summary.reconciliationDifferences,
    counts: {
      eligible: preview.summary.eligibleParticipantCount,
      excluded: preview.summary.excludedParticipantCount,
      findings: preview.findings.length,
    },
    findings: preview.findings.map((finding) => ({ code: finding.code, severity: finding.severity, message: finding.message })),
    rows: preview.rows.map((row) => ({
      participationId: row.participationId,
      memberId: row.memberId,
      principalReturn: row.principalReturn,
      holdingReturn: row.holdingReturn,
      profitDistribution: row.profitDistribution,
      finalDistributionTotal: row.finalDistributionTotal,
    })),
  };
}

export async function saveDraftDistributionBatchAction(_previousState: SaveDraftDistributionBatchState, formData: FormData): Promise<SaveDraftDistributionBatchState> {
  const { user } = await requireAdmin();
  const campaignId = requiredString(formData, "campaignId");
  const settlementId = requiredString(formData, "settlementId");
  if (!campaignId || !settlementId) return { status: "error", message: "Project and settlement are required.", errors: ["Project and settlement are required."] };

  try {
    const campaign = await db.campaign.findUnique({
      where: { id: campaignId },
      select: {
        id: true,
        title: true,
        slug: true,
        settlements: { orderBy: { createdAt: "desc" }, take: 1 },
        participations: {
          select: {
            id: true,
            memberId: true,
            participationAmount: true,
            participationStatus: true,
            confirmedAt: true,
            member: { select: { id: true, memberRef: true, fullName: true, user: { select: { email: true } } } },
            payments: { select: { id: true, amount: true, status: true } },
            distributions: { select: { id: true, status: true } },
          },
        },
      },
    });
    if (!campaign) throw new Error("Project could not be found.");
    const latestSettlement = campaign.settlements[0];
    if (!latestSettlement) throw new Error("No settlement exists for this project.");
    if (latestSettlement.id !== settlementId) throw new Error("Submitted settlement is not the latest settlement. Refresh the workspace and try again.");
    if (latestSettlement.calculationStatus !== SettlementCalculationStatus.Locked) throw new Error("Settlement must be locked before saving a draft distribution batch.");

    const preview = calculateDistributionPreview({
      campaign: { id: campaign.id, title: campaign.title, currency: "MYR" },
      settlement: {
        id: latestSettlement.id,
        campaignId: campaign.id,
        calculationStatus: String(latestSettlement.calculationStatus),
        settlementScenario: String(latestSettlement.settlementScenario),
        principalReturnPool: latestSettlement.principalReturnPool,
        holdingReturnPool: latestSettlement.holdingReturnPool,
        profitDistributionPool: latestSettlement.profitDistributionPool,
        finalDistributionPool: latestSettlement.finalDistributionPool,
        calculationRemarks: latestSettlement.calculationRemarks,
      },
      participations: campaign.participations.map((participation) => ({
        id: participation.id,
        memberId: participation.memberId,
        participationAmount: participation.participationAmount,
        participationStatus: String(participation.participationStatus),
        confirmedAt: participation.confirmedAt,
        member: { id: participation.member.id, memberRef: participation.member.memberRef, fullName: participation.member.fullName, user: { email: participation.member.user.email } },
        payments: participation.payments.map((payment) => ({ id: payment.id, amount: payment.amount, status: String(payment.status) })),
        distributions: participation.distributions.map((distribution) => ({ id: distribution.id, status: String(distribution.status) })),
      })),
      formulaProfile: "STANDARD_FINAL_DISTRIBUTION_V1",
    });

    if (!preview.summary.isPreviewValid) throw new Error("Distribution preview is not valid.");
    if (preview.summary.blockerCount > 0) throw new Error("Distribution preview has blockers that must be resolved before saving.");
    if (preview.rows.length === 0) throw new Error("No eligible participants are available for draft distribution.");
    if (latestSettlement.finalDistributionPool === null || latestSettlement.finalDistributionPool === undefined) throw new Error("Final distribution pool is required before saving a draft batch.");
    if (!allReconciled(preview)) throw new Error("Distribution preview reconciliation must have zero differences before saving.");
    if (!moneyEqual(preview.summary.allocatedTotals.finalDistributionTotal, preview.summary.sourcePools.finalDistributionPool)) throw new Error("Allocated final total must equal the final distribution pool.");

    const targetParticipationIds = preview.rows.map((row) => row.participationId);

    const slug = await db.$transaction(async (tx) => {
      const currentLatestSettlement = await tx.campaignSettlement.findFirst({
        where: { campaignId },
        orderBy: { createdAt: "desc" },
        select: { id: true, calculationStatus: true },
      });
      if (!currentLatestSettlement) throw new Error("No settlement exists for this project.");
      if (currentLatestSettlement.id !== settlementId) throw new Error("Submitted settlement is not the latest settlement. Refresh the workspace and try again.");
      if (currentLatestSettlement.calculationStatus !== SettlementCalculationStatus.Locked) throw new Error("Settlement must be locked before saving a draft distribution batch.");

      const existingBatch = await tx.distributionBatch.findFirst({ where: { campaignId, settlementId, status: { in: [...ACTIVE_BATCH_STATUSES] } }, select: { batchRef: true, status: true } });
      if (existingBatch) throw new Error(`An active distribution batch already exists for this settlement (${existingBatch.batchRef}, ${existingBatch.status}). Cancelled batches are treated as inactive for this Phase 1 duplicate check.`);

      const existingDistribution = await tx.distribution.findFirst({
        where: { participationId: { in: targetParticipationIds }, status: { in: [...ACTIVE_DISTRIBUTION_STATUSES] }, distributionBatch: { status: { in: [...ACTIVE_BATCH_STATUSES] } } },
        select: { distributionRef: true, participationId: true },
      });
      if (existingDistribution) throw new Error(`An active distribution already exists for one of the target participations (${existingDistribution.distributionRef}).`);

      const batch = await tx.distributionBatch.create({
        data: {
          batchRef: makeRef("DBT"),
          campaignId,
          settlementId,
          status: DistributionBatchStatus.Draft,
          lockedStatus: false,
          totalMembers: preview.rows.length,
          totalFinalDistribution: preview.summary.allocatedTotals.finalDistributionTotal,
          pendingCount: preview.rows.length,
          processingCount: 0,
          paidCount: 0,
          createdById: user.id,
        },
      });

      const distributionRows = preview.rows.map((row) => ({
        distributionRef: makeRef("DIS"),
        distributionBatchId: batch.id,
        campaignId,
        memberId: row.memberId,
        participationId: row.participationId,
        principalReturn: row.principalReturn,
        holdingReturn: row.holdingReturn,
        profitDistribution: row.profitDistribution,
        finalDistributionTotal: row.finalDistributionTotal,
        status: DistributionStatus.Pending,
      }));

      await tx.distribution.createMany({ data: distributionRows });

      const auditData: Prisma.AuditLogUncheckedCreateInput = {
        auditRef: makeAuditRef(),
        actorId: user.id,
        action: "distribution.batch.draft_created",
        entityType: "DistributionBatch",
        entityId: batch.id,
        afterSnapshot: toJsonValue(buildAuditSnapshot(preview, latestSettlement, batch)) as Prisma.InputJsonValue,
      };
      await tx.auditLog.create({ data: auditData });

      return campaign.slug;
    }, { timeout: 10_000 });

    revalidatePath(`/admin/projects/${slug}`);
    return { status: "success", message: "Draft distribution batch saved. No payout was approved or executed.", errors: [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Draft distribution batch could not be saved.";
    return { status: "error", message, errors: [message] };
  }
}
