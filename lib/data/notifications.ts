import "server-only";
import { db } from "@/lib/db";
import { ADMIN_AUDIENCE, MEMBER_AUDIENCE } from "@/lib/notifications";

const adminWhere = { audience: ADMIN_AUDIENCE, memberId: null };
const memberWhere = (memberId: string) => ({ audience: MEMBER_AUDIENCE, memberId });

const select = {
  id: true,
  title: true,
  body: true,
  sentAt: true,
  createdAt: true,
  readAt: true,
  campaign: { select: { title: true, slug: true } },
} as const;

// The bell must never break the layout, so counts fall back to 0.
export async function countUnreadAdminNotifications() {
  return db.notification.count({ where: { ...adminWhere, readAt: null } }).catch(() => 0);
}

export async function countUnreadMemberNotifications(memberId: string) {
  return db.notification.count({ where: { ...memberWhere(memberId), readAt: null } }).catch(() => 0);
}

export async function listAdminNotifications(take = 100) {
  return db.notification.findMany({ where: adminWhere, orderBy: { createdAt: "desc" }, take, select });
}

export async function listMemberNotifications(memberId: string, take = 100) {
  return db.notification.findMany({ where: memberWhere(memberId), orderBy: { createdAt: "desc" }, take, select });
}

export type NotificationRow = Awaited<ReturnType<typeof listAdminNotifications>>[number];
