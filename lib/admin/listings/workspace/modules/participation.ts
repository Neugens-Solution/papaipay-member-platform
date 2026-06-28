import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { buildListingAuditData } from "../audit";
import { decimalOrZero, optionalDate, requiredString, WorkspaceValidationError, type WorkspaceModuleResult } from "../types";

export async function saveParticipationModule(formData: FormData): Promise<WorkspaceModuleResult> {
  const campaignId = requiredString(formData, "campaignId");
  if (!campaignId) throw new WorkspaceValidationError("Save Overview before saving Participation.");
  const fieldErrors: Record<string, string> = {};
  for (const field of ["campaignTarget", "minimumParticipationAmount", "maximumParticipationAmount", "holdingReturnRateMonthly", "maximumHoldingPeriodMonths"]) {
    if (!requiredString(formData, field)) fieldErrors[field] = "Please enter a valid value.";
  }
  if (Object.keys(fieldErrors).length) throw new WorkspaceValidationError("Please complete participation fields.", fieldErrors);
  const saved = await db.$transaction(async (tx) => {
    const campaign = await tx.campaign.update({
      where: { id: campaignId },
      data: {
        campaignTarget: decimalOrZero(requiredString(formData, "campaignTarget")),
        minimumParticipationAmount: decimalOrZero(requiredString(formData, "minimumParticipationAmount")),
        maximumParticipationAmount: decimalOrZero(requiredString(formData, "maximumParticipationAmount")),
        campaignOpenDate: optionalDate(formData, "campaignOpenDate"),
        campaignCloseDate: optionalDate(formData, "campaignCloseDate"),
        holdingReturnRateMonthly: decimalOrZero(requiredString(formData, "holdingReturnRateMonthly")),
        returnType: (requiredString(formData, "returnType") || "Target") as "Fixed" | "Target" | "UpTo",
        maximumHoldingPeriodMonths: Number(requiredString(formData, "maximumHoldingPeriodMonths") || 24),
        principalProtectionEnabled: requiredString(formData, "principalProtectionEnabled") !== "false",
        twentyFourMonthRuleText: requiredString(formData, "lockedRuleText") || undefined,
      },
    });
    await tx.campaignContent.upsert({
      where: { campaignId },
      update: {
        holdingReturnExplanation: requiredString(formData, "holdingReturnExplanation") || null,
        finalDistributionExplanation: requiredString(formData, "finalDistributionExplanation") || null,
      },
      create: {
        campaignId,
        aboutCampaign: "Draft overview pending.",
        holdingReturnExplanation: requiredString(formData, "holdingReturnExplanation") || null,
        finalDistributionExplanation: requiredString(formData, "finalDistributionExplanation") || null,
      },
    });
    await tx.auditLog.create({ data: buildListingAuditData({ action: "listing.participation.saved", entityId: campaignId, afterSnapshot: campaign }) });
    return campaign;
  });
  return { ok: true, status: "saved", message: "Participation saved.", updatedAt: saved.updatedAt.toISOString() };
}
