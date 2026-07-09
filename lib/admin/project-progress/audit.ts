import type { Prisma } from "@prisma/client";
import { makeAuditRef } from "@/lib/admin/listings/workspace/audit";
import { toJsonValue } from "@/lib/admin/listings/workspace/types";

export type ProjectProgressAuditAction =
  | "project_progress.status.updated"
  | "project_progress.update.created"
  | "project_progress.update.published"
  | "project_progress.update.drafted";

export function buildProjectProgressAuditData({
  action,
  entityId,
  entityType = "Campaign",
  beforeSnapshot,
  afterSnapshot,
  actorId,
}: {
  action: ProjectProgressAuditAction;
  entityId: string;
  entityType?: string;
  beforeSnapshot?: unknown;
  afterSnapshot?: unknown;
  actorId?: string;
}): Prisma.AuditLogUncheckedCreateInput {
  return {
    auditRef: makeAuditRef(),
    action,
    entityType,
    entityId,
    ...(actorId ? { actorId } : {}),
    ...(beforeSnapshot !== undefined ? { beforeSnapshot: toJsonValue(beforeSnapshot) } : {}),
    ...(afterSnapshot !== undefined ? { afterSnapshot: toJsonValue(afterSnapshot) } : {}),
  };
}
