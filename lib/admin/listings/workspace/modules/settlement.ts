import { db } from "@/lib/db";
import { requireAdminPermission } from "@/lib/auth/guards";
import { buildListingAuditData } from "../audit";
import { optionalDecimal, requiredString, WorkspaceValidationError, type WorkspaceModuleResult } from "../types";

const defaultSettlementNotes = "Settlement and fee details are prepared during the final campaign review. Any final distribution calculations, approved costs and platform fee allocations will be confirmed before member distributions are processed.";

export async function saveSettlementModule(formData: FormData): Promise<WorkspaceModuleResult> {
  await requireAdminPermission("listing.manage");
  const campaignId = requiredString(formData, "campaignId");
  if (!campaignId) throw new WorkspaceValidationError("Save Overview before saving Settlement.");
  const member = Number(requiredString(formData, "memberProfitDistributionPercentagePlanned") || 0);
  const platform = Number(requiredString(formData, "platformProfitSharePercentagePlanned") || 0);
  if (Math.abs(member + platform - 100) > 0.01) throw new WorkspaceValidationError("Member and platform final return percentages must total 100%.", { memberProfitDistributionPercentagePlanned: "Percentages must total 100%." });
  const saved = await db.$transaction(async (tx) => {
    const campaign = await tx.campaign.update({ where: { id: campaignId }, data: { memberProfitDistributionPercentagePlanned: optionalDecimal(String(member)), platformProfitSharePercentagePlanned: optionalDecimal(String(platform)) } });
    await tx.campaignContent.upsert({ where: { campaignId }, update: { finalDistributionExplanation: requiredString(formData, "settlementFeeNotes") || defaultSettlementNotes }, create: { campaignId, aboutCampaign: "Draft overview pending.", finalDistributionExplanation: requiredString(formData, "settlementFeeNotes") || defaultSettlementNotes } });
    await tx.auditLog.create({ data: buildListingAuditData({ action: "listing.settlement.saved", entityId: campaignId, afterSnapshot: { member, platform } }) });
    return campaign;
  });
  return { ok: true, status: "saved", message: "Settlement saved.", updatedAt: saved.updatedAt.toISOString() };
}
