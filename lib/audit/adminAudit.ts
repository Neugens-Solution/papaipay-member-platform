export type AdminAuditAction = "create" | "update" | "publish" | "archive" | "delete";

export type AdminAuditContext = {
  actorId?: string | null;
  ipAddress?: string | null;
  deviceInfo?: string | null;
};

export type AdminAuditEntry = AdminAuditContext & {
  action: AdminAuditAction;
  entityType: string;
  entityId: string;
  beforeSnapshot?: unknown;
  afterSnapshot?: unknown;
};

export function createAdminAuditEntry(entry: AdminAuditEntry): AdminAuditEntry {
  return entry;
}
