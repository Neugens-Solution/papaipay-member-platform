"use server";

import { Visibility } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminPermission } from "@/lib/auth/guards";
import { buildProjectProgressAuditData } from "./audit";
import { isProjectProgressStatus, progressForProjectStatus } from "./statuses";

export type ProjectProgressActionState = {
  ok?: boolean;
  message?: string;
  errors?: string[];
};

function requiredString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalString(formData: FormData, key: string) {
  const value = requiredString(formData, key);
  return value.length > 0 ? value : undefined;
}

function updateVisibility(value: string): Visibility {
  if (value === "MemberVisible") return Visibility.MemberVisible;
  if (value === "ParticipantsOnly") return Visibility.ParticipantsOnly;
  return Visibility.InternalOnly;
}

async function campaignSlug(campaignId: string) {
  const campaign = await db.campaign.findUnique({ where: { id: campaignId }, select: { slug: true } });
  return campaign?.slug;
}

export async function updateProjectStatusAction(
  _prevState: ProjectProgressActionState,
  formData: FormData,
): Promise<ProjectProgressActionState> {
  const { user } = await requireAdminPermission("campaign.manage");
  const campaignId = requiredString(formData, "campaignId");
  const status = requiredString(formData, "status");
  const note = optionalString(formData, "note");

  if (!campaignId) return { ok: false, errors: ["Campaign is required."] };
  if (!isProjectProgressStatus(status)) return { ok: false, errors: ["Choose an approved project status."] };

  const description = note ?? `Project status updated to ${status}.`;

  try {
    const result = await db.$transaction(async (tx) => {
      const event = await tx.campaignTimelineEvent.create({
        data: {
          campaignId,
          title: status,
          description,
          eventDate: new Date(),
          visibility: Visibility.InternalOnly,
        },
      });

      await tx.auditLog.create({
        data: buildProjectProgressAuditData({
          actorId: user.id,
          action: "project_progress.status.updated",
          entityId: campaignId,
          afterSnapshot: {
            timelineEventId: event.id,
            status,
            progress: progressForProjectStatus(status),
            visibility: Visibility.InternalOnly,
          },
        }),
      });

      return event;
    });

    const slug = await campaignSlug(campaignId);
    if (slug) revalidatePath(`/admin/projects/${slug}`);
    return { ok: true, message: `Project status updated to ${result.title}.` };
  } catch (error) {
    console.error("Unable to update project status", error);
    return { ok: false, errors: ["Unable to update project status. Please try again."] };
  }
}

export async function createProjectUpdateAction(
  _prevState: ProjectProgressActionState,
  formData: FormData,
): Promise<ProjectProgressActionState> {
  const { user } = await requireAdminPermission("campaign.manage");
  const campaignId = requiredString(formData, "campaignId");
  const title = requiredString(formData, "title");
  const body = requiredString(formData, "body");
  const visibility = updateVisibility(requiredString(formData, "visibility"));
  const publishMode = requiredString(formData, "publishMode");
  const publishedAt = publishMode === "publish" ? new Date() : null;

  const errors = [];
  if (!campaignId) errors.push("Campaign is required.");
  if (!title) errors.push("Update title is required.");
  if (!body) errors.push("Update body is required.");
  if (errors.length > 0) return { ok: false, errors };

  try {
    const update = await db.$transaction(async (tx) => {
      const created = await tx.campaignUpdate.create({
        data: { campaignId, title, body, visibility, publishedAt },
      });

      await tx.auditLog.create({
        data: buildProjectProgressAuditData({
          actorId: user.id,
          action: "project_progress.update.created",
          entityId: created.id,
          entityType: "CampaignUpdate",
          afterSnapshot: { campaignId, title, visibility, published: Boolean(publishedAt) },
        }),
      });

      await tx.auditLog.create({
        data: buildProjectProgressAuditData({
          actorId: user.id,
          action: publishedAt ? "project_progress.update.published" : "project_progress.update.drafted",
          entityId: created.id,
          entityType: "CampaignUpdate",
          afterSnapshot: { campaignId, title, visibility, publishedAt },
        }),
      });

      return created;
    });

    const slug = await campaignSlug(campaignId);
    if (slug) revalidatePath(`/admin/projects/${slug}`);
    return { ok: true, message: publishedAt ? `Published update “${update.title}”.` : `Saved draft “${update.title}”.` };
  } catch (error) {
    console.error("Unable to create project update", error);
    return { ok: false, errors: ["Unable to create project update. Please try again."] };
  }
}
