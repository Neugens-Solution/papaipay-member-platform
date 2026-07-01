"use server";

import { revalidatePath } from "next/cache";
import { DistributionBatchStatus, DistributionStatus, SettlementCalculationStatus, type Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guards";
import { calculateDistributionPreview, type DistributionPreviewResult } from "@/lib/distributions/preview";
import { makeAuditRef } from "@/lib/admin/listings/workspace/audit";
import { toJsonValue } from "@/lib/admin/listings/workspace/types";

export type DistributionBatchActionState = {
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

export async function saveDraftDistributionBatchAction(_previousState: DistributionBatchActionState, formData: FormData): Promise<DistributionBatchActionState> {
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
    return { status: "success", message: "Draft distribution batch saved. No payment transfer was approved or executed.", errors: [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Draft distribution batch could not be saved.";
    return { status: "error", message, errors: [message] };
  }
}

function buildApprovalSnapshot(batch: {
  status: unknown;
  lockedStatus: boolean;
  approvedAt: Date | null;
  approvedById: string | null;
  totalMembers: number | null;
  totalFinalDistribution: unknown;
  pendingCount: number | null;
  processingCount: number | null;
  paidCount: number | null;
}, counts: { rowCount: number; pendingCount: number; processingCount: number; paidCount: number }, rowTotal: string) {
  return {
    status: String(batch.status),
    lockedStatus: batch.lockedStatus,
    approvedAt: batch.approvedAt?.toISOString() ?? null,
    approvedById: batch.approvedById,
    counts: {
      totalMembers: batch.totalMembers,
      pendingCount: batch.pendingCount,
      processingCount: batch.processingCount,
      paidCount: batch.paidCount,
      rowCount: counts.rowCount,
      rowPendingCount: counts.pendingCount,
      rowProcessingCount: counts.processingCount,
      rowPaidCount: counts.paidCount,
    },
    totals: {
      batchTotalFinalDistribution: String(batch.totalFinalDistribution ?? "0"),
      rowFinalDistributionTotal: rowTotal,
    },
  };
}

function parseRequiredPaymentDate(formData: FormData) {
  const value = requiredString(formData, "paymentDate");
  if (!value) throw new Error("Payment date is required.");
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) throw new Error("Payment date is invalid.");
  return date;
}

function distributionStatusSummary(rows: Array<{ status: unknown }>) {
  return rows.reduce<Record<string, number>>((summary, row) => {
    const status = String(row.status);
    summary[status] = (summary[status] ?? 0) + 1;
    return summary;
  }, {});
}

function paymentFieldSummary(rows: Array<{ paymentDate: Date | null; paymentReference: string | null; markedPaidById: string | null; markedPaidAt: Date | null; adminNotes: string | null }>) {
  return {
    rowsWithPaymentDate: rows.filter((row) => row.paymentDate).length,
    rowsWithPaymentReference: rows.filter((row) => row.paymentReference).length,
    rowsWithAdminNotes: rows.filter((row) => row.adminNotes).length,
    rowsWithMarkedPaidById: rows.filter((row) => row.markedPaidById).length,
    rowsWithMarkedPaidAt: rows.filter((row) => row.markedPaidAt).length,
  };
}

function buildMarkPaidSnapshot(batch: {
  status: unknown;
  pendingCount: number | null;
  processingCount: number | null;
  paidCount: number | null;
  totalMembers: number | null;
  totalFinalDistribution: unknown;
}, rows: Array<{ status: unknown; finalDistributionTotal: unknown; paymentDate: Date | null; paymentReference: string | null; markedPaidById: string | null; markedPaidAt: Date | null; adminNotes: string | null }>, rowTotal: string) {
  return {
    batch: {
      status: String(batch.status),
      pendingCount: batch.pendingCount,
      processingCount: batch.processingCount,
      paidCount: batch.paidCount,
      totalMembers: batch.totalMembers,
      totalFinalDistribution: String(batch.totalFinalDistribution ?? "0"),
    },
    rowCount: rows.length,
    rowsStatusSummary: distributionStatusSummary(rows),
    existingPaymentFieldSummary: paymentFieldSummary(rows),
    totalFinalDistribution: rowTotal,
  };
}

export async function approveDistributionBatchAction(_previousState: DistributionBatchActionState, formData: FormData): Promise<DistributionBatchActionState> {
  const { user } = await requireAdmin();
  const campaignId = requiredString(formData, "campaignId");
  const settlementId = requiredString(formData, "settlementId");
  const batchId = requiredString(formData, "batchId");
  if (!campaignId || !settlementId || !batchId) return { status: "error", message: "Project, settlement, and batch are required.", errors: ["Project, settlement, and batch are required."] };

  try {
    const slug = await db.$transaction(async (tx) => {
      const campaign = await tx.campaign.findUnique({ where: { id: campaignId }, select: { id: true, slug: true } });
      if (!campaign) throw new Error("Project could not be found.");

      const latestSettlement = await tx.campaignSettlement.findFirst({
        where: { campaignId },
        orderBy: { createdAt: "desc" },
        select: { id: true, calculationStatus: true, finalDistributionPool: true },
      });
      if (!latestSettlement) throw new Error("No settlement exists for this project.");
      if (latestSettlement.id !== settlementId) throw new Error("Submitted settlement is not the latest settlement. Refresh the workspace and try again.");
      if (latestSettlement.calculationStatus !== SettlementCalculationStatus.Locked) throw new Error("Settlement must be locked before approving a distribution batch.");

      const batch = await tx.distributionBatch.findUnique({
        where: { id: batchId },
        include: { distributions: true },
      });
      if (!batch) throw new Error("Distribution batch could not be found.");
      if (batch.campaignId !== campaignId) throw new Error("Distribution batch does not belong to this project.");
      if (batch.settlementId !== settlementId || batch.settlementId !== latestSettlement.id) throw new Error("Distribution batch is not attached to the latest submitted settlement.");
      if (batch.status !== DistributionBatchStatus.Draft) throw new Error("Only Draft distribution batches can be approved.");
      if (batch.distributions.length === 0) throw new Error("Distribution batch has no distribution rows.");

      const duplicateBatch = await tx.distributionBatch.findFirst({
        where: { id: { not: batchId }, campaignId, settlementId, status: { in: [...ACTIVE_BATCH_STATUSES] } },
        select: { batchRef: true, status: true },
      });
      if (duplicateBatch) throw new Error(`Another active distribution batch already exists for this settlement (${duplicateBatch.batchRef}, ${duplicateBatch.status}).`);

      const invalidStatusRow = batch.distributions.find((row) => row.status !== DistributionStatus.Pending);
      if (invalidStatusRow) throw new Error(`Distribution row ${invalidStatusRow.distributionRef} is not Pending.`);
      const payoutFieldRow = batch.distributions.find((row) => row.paymentDate || row.paymentReference || row.markedProcessingById || row.markedProcessingAt || row.markedPaidById || row.markedPaidAt);
      if (payoutFieldRow) throw new Error(`Distribution row ${payoutFieldRow.distributionRef} already has payment or distribution payment fields set.`);

      const rowCount = batch.distributions.length;
      const pendingCount = batch.distributions.filter((row) => row.status === DistributionStatus.Pending).length;
      const processingCount = batch.distributions.filter((row) => row.status === DistributionStatus.Processing).length;
      const paidCount = batch.distributions.filter((row) => row.status === DistributionStatus.Paid).length;
      const rowTotalNumber = batch.distributions.reduce((sum, row) => sum + Number(row.finalDistributionTotal), 0);
      const rowTotal = rowTotalNumber.toFixed(2);

      if (batch.totalMembers !== rowCount) throw new Error("Batch totalMembers does not match distribution row count.");
      if (batch.pendingCount !== rowCount || pendingCount !== rowCount) throw new Error("Batch pending count does not match distribution row count.");
      if ((batch.processingCount ?? 0) !== 0 || processingCount !== 0) throw new Error("Processing distribution count must be zero before approval.");
      if ((batch.paidCount ?? 0) !== 0 || paidCount !== 0) throw new Error("Paid distribution count must be zero before approval.");
      if (!moneyEqual(rowTotal, String(batch.totalFinalDistribution ?? "0"))) throw new Error("Distribution row total does not match batch total final distribution.");
      if (!moneyEqual(rowTotal, String(latestSettlement.finalDistributionPool ?? "0"))) throw new Error("Distribution row total does not match settlement final distribution pool.");

      const beforeSnapshot = buildApprovalSnapshot(batch, { rowCount, pendingCount, processingCount, paidCount }, rowTotal);
      const approvedAt = new Date();
      const updatedBatch = await tx.distributionBatch.update({
        where: { id: batchId },
        data: { status: DistributionBatchStatus.Approved, lockedStatus: true, approvedAt, approvedById: user.id },
      });
      const afterSnapshot = {
        ...buildApprovalSnapshot(updatedBatch, { rowCount, pendingCount, processingCount, paidCount }, rowTotal),
        rowConfirmation: "All distribution rows remain Pending.",
        payoutConfirmation: "No distribution payment fields were set and no payment transfer was executed.",
      };

      await tx.auditLog.create({
        data: {
          auditRef: makeAuditRef(),
          actorId: user.id,
          action: "distribution.batch.approved",
          entityType: "DistributionBatch",
          entityId: batch.id,
          beforeSnapshot: toJsonValue(beforeSnapshot) as Prisma.InputJsonValue,
          afterSnapshot: toJsonValue(afterSnapshot) as Prisma.InputJsonValue,
        },
      });

      return campaign.slug;
    }, { timeout: 10_000 });

    revalidatePath(`/admin/projects/${slug}`);
    return { status: "success", message: "Distribution batch approved for future processing. No payment transfer was executed.", errors: [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Distribution batch could not be approved.";
    return { status: "error", message, errors: [message] };
  }
}

export async function markDistributionBatchPaidAction(_previousState: DistributionBatchActionState, formData: FormData): Promise<DistributionBatchActionState> {
  const { user } = await requireAdmin();
  const campaignId = requiredString(formData, "campaignId");
  const settlementId = requiredString(formData, "settlementId");
  const batchId = requiredString(formData, "batchId");
  const paymentReference = requiredString(formData, "paymentReference");
  const adminNotes = requiredString(formData, "adminNotes");
  const confirmed = formData.get("confirmation") === "on";

  try {
    if (!campaignId || !settlementId || !batchId) throw new Error("Project, settlement, and batch are required.");
    const paymentDate = parseRequiredPaymentDate(formData);
    if (!paymentReference) throw new Error("Payment reference is required.");
    if (!adminNotes) throw new Error("Admin notes are required.");
    if (!confirmed) throw new Error("Confirmation is required before marking the batch paid.");

    const slug = await db.$transaction(async (tx) => {
      const campaign = await tx.campaign.findUnique({ where: { id: campaignId }, select: { id: true, slug: true } });
      if (!campaign) throw new Error("Project could not be found.");

      const latestSettlement = await tx.campaignSettlement.findFirst({
        where: { campaignId },
        orderBy: { createdAt: "desc" },
        select: { id: true, calculationStatus: true, finalDistributionPool: true },
      });
      if (!latestSettlement) throw new Error("No settlement exists for this project.");
      if (latestSettlement.id !== settlementId) throw new Error("Submitted settlement is not the latest settlement. Refresh the workspace and try again.");
      if (latestSettlement.calculationStatus !== SettlementCalculationStatus.Locked) throw new Error("Settlement must be locked before marking a distribution batch paid.");

      const batch = await tx.distributionBatch.findUnique({ where: { id: batchId }, include: { distributions: true } });
      if (!batch) throw new Error("Distribution batch could not be found.");
      if (batch.status === DistributionBatchStatus.Completed) throw new Error("This batch has already been marked paid.");
      if (batch.campaignId !== campaignId) throw new Error("Distribution batch does not belong to this project.");
      if (batch.settlementId !== settlementId || batch.settlementId !== latestSettlement.id) throw new Error("Distribution batch is not attached to the latest submitted settlement.");
      if (batch.status !== DistributionBatchStatus.Approved) throw new Error("Only Approved distribution batches can be marked paid.");
      if (batch.lockedStatus !== true) throw new Error("Distribution batch must be locked before it can be marked paid.");
      if (batch.distributions.length === 0) throw new Error("Distribution batch has no distribution rows.");

      const processingRow = batch.distributions.find((row) => row.status === DistributionStatus.Processing);
      if (processingRow) throw new Error(`Distribution row ${processingRow.distributionRef} is Processing and cannot be marked paid in Phase 1.`);
      const paidRow = batch.distributions.find((row) => row.status === DistributionStatus.Paid);
      if (paidRow) throw new Error("This batch has already been marked paid.");
      const invalidStatusRow = batch.distributions.find((row) => row.status !== DistributionStatus.Pending);
      if (invalidStatusRow) throw new Error(`Distribution row ${invalidStatusRow.distributionRef} is not Pending.`);
      const paymentFieldRow = batch.distributions.find((row) => row.paymentDate || row.paymentReference || row.markedPaidById || row.markedPaidAt);
      if (paymentFieldRow) throw new Error(`Distribution row ${paymentFieldRow.distributionRef} already has payment fields set.`);

      const rowCount = batch.distributions.length;
      const pendingCount = batch.distributions.filter((row) => row.status === DistributionStatus.Pending).length;
      const processingCount = batch.distributions.filter((row) => row.status === DistributionStatus.Processing).length;
      const paidCount = batch.distributions.filter((row) => row.status === DistributionStatus.Paid).length;
      const rowTotal = batch.distributions.reduce((sum, row) => sum + Number(row.finalDistributionTotal), 0).toFixed(2);

      if (batch.totalMembers !== rowCount) throw new Error("Batch totalMembers does not match distribution row count.");
      if (batch.pendingCount !== rowCount || pendingCount !== rowCount) throw new Error("Batch pending count does not match distribution row count.");
      if ((batch.processingCount ?? 0) !== 0 || processingCount !== 0) throw new Error("Processing distribution count must be zero before marking paid.");
      if ((batch.paidCount ?? 0) !== 0 || paidCount !== 0) throw new Error("Paid distribution count must be zero before marking paid.");
      if (!moneyEqual(rowTotal, String(batch.totalFinalDistribution ?? "0"))) throw new Error("Distribution row total does not match batch total final distribution.");
      if (!moneyEqual(rowTotal, String(latestSettlement.finalDistributionPool ?? "0"))) throw new Error("Distribution row total does not match settlement final distribution pool.");

      const beforeSnapshot = buildMarkPaidSnapshot(batch, batch.distributions, rowTotal);
      const markedPaidAt = new Date();

      await tx.distribution.updateMany({
        where: { distributionBatchId: batch.id },
        data: { status: DistributionStatus.Paid, paymentDate, paymentReference, adminNotes, markedPaidById: user.id, markedPaidAt },
      });
      const updatedBatch = await tx.distributionBatch.update({
        where: { id: batch.id },
        data: { status: DistributionBatchStatus.Completed, pendingCount: 0, processingCount: 0, paidCount: rowCount },
      });

      await tx.auditLog.create({
        data: {
          auditRef: makeAuditRef(),
          actorId: user.id,
          action: "distribution.batch.paid",
          entityType: "DistributionBatch",
          entityId: batch.id,
          beforeSnapshot: toJsonValue(beforeSnapshot) as Prisma.InputJsonValue,
          afterSnapshot: toJsonValue({
            batch: { status: String(updatedBatch.status), pendingCount: 0, processingCount: 0, paidCount: rowCount },
            paymentDate: paymentDate.toISOString(),
            paymentReference,
            adminNotes,
            markedPaidById: user.id,
            markedPaidAt: markedPaidAt.toISOString(),
            systemTransferStatement: "PAPAIPAY did not execute a transfer; finance completed the manual payment outside the system.",
            rowCount,
            totalFinalDistribution: rowTotal,
          }) as Prisma.InputJsonValue,
        },
      });

      return campaign.slug;
    }, { timeout: 10_000 });

    revalidatePath(`/admin/projects/${slug}`);
    return { status: "success", message: "Distribution batch completed. Manual payment has been recorded. No transfer was executed by PAPAIPAY.", errors: [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Distribution batch could not be marked paid.";
    return { status: "error", message, errors: [message] };
  }
}
