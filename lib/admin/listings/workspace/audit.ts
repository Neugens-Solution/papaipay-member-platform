import type { Prisma } from "@prisma/client";
import { toJsonValue } from "./types";

export type ListingWorkspaceAuditAction =
  | "listing.overview.saved"
  | "listing.property.saved"
  | "listing.participation.saved"
  | "listing.settlement.saved"
  | "listing.media.saved"
  | "listing.documents.saved"
  | "listing.member_info.saved"
  | "listing.publish.blocked"
  | "listing.published"
  | "listing.unpublished";

export function makeAuditRef() {
  return `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function makeFileRef(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function buildListingAuditData({
  action,
  entityId,
  entityType = "Campaign",
  beforeSnapshot,
  afterSnapshot,
}: {
  action: ListingWorkspaceAuditAction;
  entityId: string;
  entityType?: string;
  beforeSnapshot?: unknown;
  afterSnapshot?: unknown;
}): Prisma.AuditLogUncheckedCreateInput {
  return {
    auditRef: makeAuditRef(),
    action,
    entityType,
    entityId,
    ...(beforeSnapshot !== undefined ? { beforeSnapshot: toJsonValue(beforeSnapshot) } : {}),
    ...(afterSnapshot !== undefined ? { afterSnapshot: toJsonValue(afterSnapshot) } : {}),
  };
}
