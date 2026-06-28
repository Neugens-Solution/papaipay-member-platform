import type { Prisma } from "@prisma/client";
import { makeAuditRef } from "@/lib/admin/listings/workspace/audit";
import { toJsonValue } from "@/lib/admin/listings/workspace/types";

export type ProjectFinancialsAuditAction = "project.financials.created" | "project.financials.updated";

export function buildProjectFinancialsAuditData({
  action,
  entityId,
  beforeSnapshot,
  afterSnapshot,
}: {
  action: ProjectFinancialsAuditAction;
  entityId: string;
  beforeSnapshot?: unknown;
  afterSnapshot?: unknown;
}): Prisma.AuditLogUncheckedCreateInput {
  return {
    auditRef: makeAuditRef(),
    action,
    entityType: "CampaignSettlement",
    entityId,
    ...(beforeSnapshot !== undefined ? { beforeSnapshot: toJsonValue(beforeSnapshot) } : {}),
    ...(afterSnapshot !== undefined ? { afterSnapshot: toJsonValue(afterSnapshot) } : {}),
  };
}
