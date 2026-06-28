"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { buildProjectFinancialsAuditData } from "./audit";
import { financialSummaryToPrismaData, validateFinancialSummaryForm } from "./validation";

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function saveProjectFinancialSummaryAction(formData: FormData): Promise<void> {
  const campaignId = requiredString(formData, "campaignId");
  if (!campaignId) throw new Error("Campaign is required.");

  const validation = validateFinancialSummaryForm(formData);
  if (!validation.data) throw new Error(validation.errors.join(" "));

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

    const data = financialSummaryToPrismaData(validation.data);

    if (latestSettlement) {
      const updated = await tx.campaignSettlement.update({
        where: { id: latestSettlement.id },
        data,
      });
      await tx.auditLog.create({
        data: buildProjectFinancialsAuditData({
          action: "project.financials.updated",
          entityId: updated.id,
          beforeSnapshot: latestSettlement,
          afterSnapshot: updated,
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
        }),
      });
    }

    return campaign.slug;
  });

  revalidatePath(`/admin/projects/${savedSlug}`);
}
