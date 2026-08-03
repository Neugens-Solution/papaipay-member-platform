import { db } from "@/lib/db";

export async function getAdminActivityLog({ query = "", entityType = "" }: { query?: string; entityType?: string } = {}) {
  const normalizedQuery = query.trim();
  const normalizedEntityType = entityType.trim();

  return db.auditLog.findMany({
    where: {
      ...(normalizedEntityType ? { entityType: normalizedEntityType } : {}),
      ...(normalizedQuery
        ? {
            OR: [
              { auditRef: { contains: normalizedQuery, mode: "insensitive" } },
              { action: { contains: normalizedQuery, mode: "insensitive" } },
              { entityType: { contains: normalizedQuery, mode: "insensitive" } },
              { entityId: { contains: normalizedQuery, mode: "insensitive" } },
              { actor: { email: { contains: normalizedQuery, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      auditRef: true,
      action: true,
      entityType: true,
      entityId: true,
      createdAt: true,
      actor: { select: { email: true, member: { select: { fullName: true } }, adminProfile: { select: { displayName: true } } } },
    },
  });
}
