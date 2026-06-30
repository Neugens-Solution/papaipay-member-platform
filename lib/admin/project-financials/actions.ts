"use server";

import { revalidatePath } from "next/cache";
import { SettlementCalculationStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guards";
import { buildProjectFinancialsAuditData } from "./audit";
import { financialSummaryToPrismaData, validateFinancialSummaryForm } from "./validation";

export type ProjectFinancialSummaryState = {
  status: "idle" | "success" | "error";
  message: string | null;
  errors: string[];
};

export type ProjectFinancialStatusActionState = ProjectFinancialSummaryState;

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function saveProjectFinancialSummaryAction(_previousState: ProjectFinancialSummaryState, formData: FormData): Promise<ProjectFinancialSummaryState> {
  const { user } = await requireAdmin();
  const campaignId = requiredString(formData, "campaignId");
  if (!campaignId) return { status: "error", message: "Campaign is required.", errors: ["Campaign is required."] };

  const validation = validateFinancialSummaryForm(formData);
  if (!validation.success) return { status: "error", message: "Please fix the highlighted financial summary values.", errors: validation.errors };

  const data = financialSummaryToPrismaData(validation.data);

  try {
    const savedSlug = await db.$transaction(async (tx) => {
      const campaign = await tx.campaign.findUnique({
        where: { id: campaignId },
        select: { id: true, slug: true },
      });
      if (!campaign) throw new Error("Project could not be found.");

      const latestSettlement = await tx.campaignSettlement.findFirst({
        where: { campaignId },
        orderBy: { createdAt: "desc" },
      });

      if (latestSettlement) {
        if (latestSettlement.calculationStatus === SettlementCalculationStatus.Locked) throw new Error("Financials are locked and cannot be edited.");
        if (latestSettlement.calculationStatus === SettlementCalculationStatus.Approved) throw new Error("Financials are approved. Future changes will require a reopen/revision workflow.");

        const updated = await tx.campaignSettlement.update({
          where: { id: latestSettlement.id },
          data: {
            ...data,
            calculationStatus: latestSettlement.calculationStatus,
          },
        });
        await tx.auditLog.create({
          data: buildProjectFinancialsAuditData({
            action: "project.financials.updated",
            entityId: updated.id,
            beforeSnapshot: latestSettlement,
            afterSnapshot: updated,
            actorId: user.id,
          }),
        });
      } else {
        const created = await tx.campaignSettlement.create({
          data: {
            campaignId,
            ...data,
          },
        });
        await tx.auditLog.create({
          data: buildProjectFinancialsAuditData({
            action: "project.financials.created",
            entityId: created.id,
            afterSnapshot: created,
            actorId: user.id,
          }),
        });
      }

      return campaign.slug;
    });

    revalidatePath(`/admin/projects/${savedSlug}`);
    return { status: "success", message: "Financial summary updated.", errors: [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Financial summary could not be saved.";
    return { status: "error", message, errors: [message] };
  }
}


type FinancialStatusTransition = {
  expectedStatus: SettlementCalculationStatus;
  nextStatus: SettlementCalculationStatus;
  action: "project.financials.reviewed" | "project.financials.approved" | "project.financials.locked";
  timestampField: "reviewedAt" | "approvedAt" | "lockedAt";
  actorField: "reviewedById" | "approvedById" | "lockedById";
};

function isMissingPoolValue(value: unknown) {
  return value === null || value === undefined;
}

function poolValueToNumber(value: unknown) {
  if (isMissingPoolValue(value)) return null;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  if (typeof value === "object" && value !== null && "toString" in value) {
    const stringified = Number(value.toString());
    if (Number.isFinite(stringified)) return stringified;
  }
  return Number.NaN;
}

function validatePoolsForApproval(settlement: {
  principalReturnPool: unknown;
  holdingReturnPool: unknown;
  profitDistributionPool: unknown;
  finalDistributionPool: unknown;
}) {
  const requiredPools = [
    ["Principal return pool", settlement.principalReturnPool],
    ["Holding return pool", settlement.holdingReturnPool],
    ["Member profit distribution pool", settlement.profitDistributionPool],
    ["Final distribution pool", settlement.finalDistributionPool],
  ] as const;

  const values = requiredPools.map(([label, value]) => {
    const numeric = poolValueToNumber(value);
    if (numeric === null) throw new Error(`${label} is required before approval or locking.`);
    if (!Number.isFinite(numeric)) throw new Error(`${label} must be a valid amount.`);
    if (numeric < 0) throw new Error(`${label} cannot be negative.`);
    return numeric;
  });

  const componentTotal = values[0] + values[1] + values[2];
  if (Math.round(componentTotal * 100) !== Math.round(values[3] * 100)) {
    throw new Error("Principal, holding, and profit distribution pools must equal the final distribution pool.");
  }
}

async function transitionProjectFinancialsAction(formData: FormData, transition: FinancialStatusTransition): Promise<string> {
  const { user } = await requireAdmin();
  const campaignId = requiredString(formData, "campaignId");

  const slug = await db.$transaction(async (tx) => {
    const campaign = await tx.campaign.findUnique({ where: { id: campaignId }, select: { id: true, slug: true } });
    if (!campaign) throw new Error("Project could not be found.");

    const latestSettlement = await tx.campaignSettlement.findFirst({ where: { campaignId }, orderBy: { createdAt: "desc" } });
    if (!latestSettlement) throw new Error("Financial summary must exist before changing approval status.");
    if (latestSettlement.calculationStatus !== transition.expectedStatus) {
      throw new Error(`Financials must be ${transition.expectedStatus} before they can be ${transition.nextStatus}.`);
    }

    if (transition.nextStatus === SettlementCalculationStatus.Approved || transition.nextStatus === SettlementCalculationStatus.Locked) {
      validatePoolsForApproval(latestSettlement);
    }

    const now = new Date();
    const updated = await tx.campaignSettlement.update({
      where: { id: latestSettlement.id },
      data: {
        calculationStatus: transition.nextStatus,
        [transition.timestampField]: now,
        [transition.actorField]: user.id,
      },
    });

    await tx.auditLog.create({
      data: buildProjectFinancialsAuditData({
        action: transition.action,
        entityId: updated.id,
        beforeSnapshot: latestSettlement,
        afterSnapshot: updated,
        actorId: user.id,
      }),
    });

    return campaign.slug;
  });

  revalidatePath(`/admin/projects/${slug}`);
  return slug;
}

async function runFinancialStatusTransition(
  formData: FormData,
  transition: FinancialStatusTransition,
  successMessage: string,
): Promise<ProjectFinancialStatusActionState> {
  try {
    await transitionProjectFinancialsAction(formData, transition);
    return { status: "success", message: successMessage, errors: [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Financial approval status could not be updated.";
    return { status: "error", message, errors: [message] };
  }
}

export async function markProjectFinancialsReviewedAction(
  _previousState: ProjectFinancialStatusActionState,
  formData: FormData,
): Promise<ProjectFinancialStatusActionState> {
  return runFinancialStatusTransition(
    formData,
    {
      expectedStatus: SettlementCalculationStatus.Draft,
      nextStatus: SettlementCalculationStatus.Reviewed,
      action: "project.financials.reviewed",
      timestampField: "reviewedAt",
      actorField: "reviewedById",
    },
    "Financials marked as reviewed.",
  );
}

export async function approveProjectFinancialsAction(
  _previousState: ProjectFinancialStatusActionState,
  formData: FormData,
): Promise<ProjectFinancialStatusActionState> {
  return runFinancialStatusTransition(
    formData,
    {
      expectedStatus: SettlementCalculationStatus.Reviewed,
      nextStatus: SettlementCalculationStatus.Approved,
      action: "project.financials.approved",
      timestampField: "approvedAt",
      actorField: "approvedById",
    },
    "Financials approved.",
  );
}

export async function lockProjectFinancialsAction(
  _previousState: ProjectFinancialStatusActionState,
  formData: FormData,
): Promise<ProjectFinancialStatusActionState> {
  return runFinancialStatusTransition(
    formData,
    {
      expectedStatus: SettlementCalculationStatus.Approved,
      nextStatus: SettlementCalculationStatus.Locked,
      action: "project.financials.locked",
      timestampField: "lockedAt",
      actorField: "lockedById",
    },
    "Financials locked.",
  );
}
