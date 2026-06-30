import type { Prisma } from "@prisma/client";
import { makeAuditRef } from "@/lib/admin/listings/workspace/audit";
import { toJsonValue } from "@/lib/admin/listings/workspace/types";

export type ProjectFinancialsAuditAction =
  | "project.financials.created"
  | "project.financials.updated"
  | "project.financials.reviewed"
  | "project.financials.approved"
  | "project.financials.locked";

export function buildProjectFinancialsAuditData({
  action,
  entityId,
  beforeSnapshot,
  afterSnapshot,
  actorId,
}: {
  action: ProjectFinancialsAuditAction;
  entityId: string;
  beforeSnapshot?: unknown;
  afterSnapshot?: unknown;
  actorId?: string;
}): Prisma.AuditLogUncheckedCreateInput {
  return {
    auditRef: makeAuditRef(),
    action,
    entityType: "CampaignSettlement",
    entityId,
    ...(actorId ? { actorId } : {}),
    ...(beforeSnapshot !== undefined ? { beforeSnapshot: toJsonValue(beforeSnapshot) } : {}),
    ...(afterSnapshot !== undefined ? { afterSnapshot: toJsonValue(afterSnapshot) } : {}),
  };
}
