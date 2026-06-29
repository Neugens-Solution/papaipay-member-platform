"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { buildProjectFinancialsAuditData } from "./audit";
import { financialSummaryToPrismaData, validateFinancialSummaryForm } from "./validation";

export type ProjectFinancialSummaryState = {
  status: "idle" | "success" | "error";
  message: string | null;
  errors: string[];
};

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function saveProjectFinancialSummaryAction(_previousState: ProjectFinancialSummaryState, formData: FormData): Promise<ProjectFinancialSummaryState> {
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
    return { status: "success", message: "Financial summary updated.", errors: [] };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Financial summary could not be saved.";
    return { status: "error", message, errors: [message] };
  }
}
