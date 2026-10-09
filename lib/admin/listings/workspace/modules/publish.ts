import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminPermission } from "@/lib/auth/guards";
import { buildListingAuditData } from "../audit";
import { getWorkspaceReadiness } from "../readiness";
import {
  requiredString,
  WorkspaceValidationError,
  type WorkspaceModuleResult,
} from "../types";

export async function publishListingModule(
  formData: FormData,
): Promise<WorkspaceModuleResult> {
  const { user } = await requireAdminPermission("listing.manage");
  const campaignId = requiredString(formData, "campaignId");
  if (!campaignId)
    throw new WorkspaceValidationError("Save Overview before publishing.");
  const readiness = await getWorkspaceReadiness(campaignId);
  if (!readiness.ready) {
    await db.auditLog.create({
      data: buildListingAuditData({
        actorId: user.id,
        action: "listing.publish.blocked",
        entityId: campaignId,
        afterSnapshot: readiness,
      }),
    });
    return {
      ok: false,
      status: "error",
      message: "Listing is not ready to publish.",
      readiness,
    };
  }
  const saved = await db.$transaction(async (tx) => {
    const campaign = await tx.campaign.update({
      where: { id: campaignId },
      data: {
        lifecycleStatus: "Open",
        publishStatus: "Published",
        visibility: "MemberVisible",
        publishedAt: new Date(),
      },
    });
    await tx.auditLog.create({
      data: buildListingAuditData({
        actorId: user.id,
        action: "listing.published",
        entityId: campaignId,
        afterSnapshot: {
          publishStatus: campaign.publishStatus,
          lifecycleStatus: campaign.lifecycleStatus,
          visibility: campaign.visibility,
          publishedAt: campaign.publishedAt,
        },
      }),
    });
    return campaign;
  });
  revalidatePath("/admin/listings");
  revalidatePath(`/admin/listings/${saved.slug}`);
  revalidatePath("/member/opportunities");
  return {
    ok: true,
    status: "saved",
    message: "Listing published.",
    updatedAt: saved.updatedAt.toISOString(),
    readiness,
    redirectTo: `/admin/listings/${saved.slug}?saved=publish`,
  };
}

export async function unpublishListingModule(
  formData: FormData,
): Promise<WorkspaceModuleResult> {
  const { user } = await requireAdminPermission("listing.manage");
  const campaignId = requiredString(formData, "campaignId");
  if (!campaignId)
    throw new WorkspaceValidationError("Listing shell was not found.");
  const saved = await db.$transaction(async (tx) => {
    const campaign = await tx.campaign.update({
      where: { id: campaignId },
      data: {
        lifecycleStatus: "Draft",
        publishStatus: "Draft",
        visibility: "InternalOnly",
        publishedAt: null,
      },
    });
    await tx.auditLog.create({
      data: buildListingAuditData({
        actorId: user.id,
        action: "listing.unpublished",
        entityId: campaignId,
        afterSnapshot: {
          publishStatus: campaign.publishStatus,
          lifecycleStatus: campaign.lifecycleStatus,
          visibility: campaign.visibility,
        },
      }),
    });
    return campaign;
  });
  revalidatePath("/admin/listings");
  revalidatePath(`/admin/listings/${saved.slug}`);
  revalidatePath("/member/opportunities");
  return {
    ok: true,
    status: "saved",
    message: "Listing unpublished.",
    updatedAt: saved.updatedAt.toISOString(),
    redirectTo: `/admin/listings/${saved.slug}?saved=unpublish`,
  };
}

/**
 * On Hold: hides a published listing from members (visibility → InternalOnly)
 * without touching its publish status, publish date, lifecycle or data, so
 * Resume can restore it instantly. Existing participants keep their portfolio
 * and can still upload receipts for pending payments.
 */
async function setListingHold(formData: FormData, onHold: boolean): Promise<WorkspaceModuleResult> {
  const { user } = await requireAdminPermission("listing.manage");
  const campaignId = requiredString(formData, "campaignId");
  if (!campaignId) throw new WorkspaceValidationError("Listing shell was not found.");
  const saved = await db.$transaction(async (tx) => {
    const existing = await tx.campaign.findUnique({
      where: { id: campaignId },
      select: { publishStatus: true, visibility: true },
    });
    if (!existing) throw new WorkspaceValidationError("Listing shell was not found.");
    if (existing.publishStatus !== "Published") {
      throw new WorkspaceValidationError("Only published listings can be put on hold or resumed.");
    }
    const target = onHold ? "InternalOnly" : "MemberVisible";
    if (existing.visibility === target) {
      throw new WorkspaceValidationError(onHold ? "Listing is already on hold." : "Listing is already visible to members.");
    }
    const campaign = await tx.campaign.update({ where: { id: campaignId }, data: { visibility: target, updatedById: user.id } });
    await tx.auditLog.create({
      data: buildListingAuditData({
        actorId: user.id,
        action: onHold ? "listing.paused" : "listing.resumed",
        entityId: campaignId,
        beforeSnapshot: { visibility: existing.visibility },
        afterSnapshot: { visibility: campaign.visibility, publishStatus: campaign.publishStatus },
      }),
    });
    return campaign;
  });
  revalidatePath("/admin/listings");
  revalidatePath(`/admin/listings/${saved.slug}`);
  revalidatePath("/member/opportunities");
  revalidatePath(`/member/opportunities/${saved.slug}`);
  return {
    ok: true,
    status: "saved",
    message: onHold ? "Listing is on hold. Members can no longer see it." : "Listing resumed. Members can see it again.",
    updatedAt: saved.updatedAt.toISOString(),
    redirectTo: `/admin/listings/${saved.slug}/edit?saved=${onHold ? "pause" : "resume"}`,
  };
}

export function pauseListingModule(formData: FormData) {
  return setListingHold(formData, true);
}

export function resumeListingModule(formData: FormData) {
  return setListingHold(formData, false);
}
