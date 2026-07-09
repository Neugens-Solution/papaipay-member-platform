import { db } from "@/lib/db";
import { requireAdminPermission } from "@/lib/auth/guards";
import { buildListingAuditData } from "../audit";
import { requiredString, WorkspaceValidationError, type WorkspaceModuleResult } from "../types";

export async function saveMemberInfoModule(formData: FormData): Promise<WorkspaceModuleResult> {
  await requireAdminPermission("listing.manage");
  const campaignId = requiredString(formData, "campaignId");
  if (!campaignId) throw new WorkspaceValidationError("Save Overview before saving Member Info.");
  const importantInformation = requiredString(formData, "importantInformation");
  const riskDisclaimer = requiredString(formData, "riskDisclaimer");
  const faqQuestions = formData.getAll("faqQuestion").map(String);
  const faqAnswers = formData.getAll("faqAnswer").map(String);
  const faqRows = faqQuestions.map((question, index) => ({ question: question.trim(), answer: (faqAnswers[index] ?? "").trim(), sortOrder: index })).filter((faq) => faq.question || faq.answer).filter((faq) => faq.question && faq.answer);
  const saved = await db.$transaction(async (tx) => {
    await tx.campaignContent.upsert({ where: { campaignId }, update: { importantInformation: importantInformation || null, riskDisclaimer: riskDisclaimer || null }, create: { campaignId, aboutCampaign: "Draft overview pending.", importantInformation: importantInformation || null, riskDisclaimer: riskDisclaimer || null } });
    await tx.campaignFaq.deleteMany({ where: { campaignId } });
    if (faqRows.length) await tx.campaignFaq.createMany({ data: faqRows.map((faq) => ({ campaignId, ...faq })) });
    await tx.auditLog.create({ data: buildListingAuditData({ action: "listing.member_info.saved", entityId: campaignId, afterSnapshot: { faqCount: faqRows.length, hasImportantInformation: Boolean(importantInformation), hasRiskDisclaimer: Boolean(riskDisclaimer) } }) });
    return tx.campaign.findUniqueOrThrow({ where: { id: campaignId }, select: { updatedAt: true } });
  });
  return { ok: true, status: "saved", message: "Member Info saved.", updatedAt: saved.updatedAt.toISOString() };
}
