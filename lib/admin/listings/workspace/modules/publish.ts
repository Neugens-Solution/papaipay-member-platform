import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { buildListingAuditData } from "../audit";
import { getWorkspaceReadiness } from "../readiness";
import { requiredString, WorkspaceValidationError, type WorkspaceModuleResult } from "../types";

export async function publishListingModule(formData: FormData): Promise<WorkspaceModuleResult> {
  const campaignId = requiredString(formData, "campaignId");
  if (!campaignId) throw new WorkspaceValidationError("Save Overview before publishing.");
  const readiness = await getWorkspaceReadiness(campaignId);
  if (!readiness.ready) {
    await db.auditLog.create({ data: buildListingAuditData({ action: "listing.publish.blocked", entityId: campaignId, afterSnapshot: readiness }) });
    return { ok: false, status: "error", message: "Listing is not ready to publish.", readiness };
  }
  const saved = await db.$transaction(async (tx) => {
    const campaign = await tx.campaign.update({ where: { id: campaignId }, data: { lifecycleStatus: "Open", publishStatus: "Published", visibility: "MemberVisible", publishedAt: new Date() } });
    await tx.auditLog.create({ data: buildListingAuditData({ action: "listing.published", entityId: campaignId, afterSnapshot: { publishStatus: campaign.publishStatus, lifecycleStatus: campaign.lifecycleStatus, visibility: campaign.visibility, publishedAt: campaign.publishedAt } }) });
    return campaign;
  });
  revalidatePath("/admin/listings");
  revalidatePath(`/admin/listings/${saved.slug}`);
  revalidatePath("/member/opportunities");
  return { ok: true, status: "saved", message: "Listing published.", updatedAt: saved.updatedAt.toISOString(), readiness, redirectTo: `/admin/listings/${saved.slug}?saved=publish` };
}

export async function unpublishListingModule(formData: FormData): Promise<WorkspaceModuleResult> {
  const campaignId = requiredString(formData, "campaignId");
  if (!campaignId) throw new WorkspaceValidationError("Listing shell was not found.");
  const saved = await db.$transaction(async (tx) => {
    const campaign = await tx.campaign.update({ where: { id: campaignId }, data: { lifecycleStatus: "Draft", publishStatus: "Draft", visibility: "InternalOnly", publishedAt: null } });
    await tx.auditLog.create({ data: buildListingAuditData({ action: "listing.unpublished", entityId: campaignId, afterSnapshot: { publishStatus: campaign.publishStatus, lifecycleStatus: campaign.lifecycleStatus, visibility: campaign.visibility } }) });
    return campaign;
  });
  revalidatePath("/admin/listings");
  revalidatePath(`/admin/listings/${saved.slug}`);
  revalidatePath("/member/opportunities");
  return { ok: true, status: "saved", message: "Listing unpublished.", updatedAt: saved.updatedAt.toISOString(), redirectTo: `/admin/listings/${saved.slug}/edit?saved=unpublish` };
}
