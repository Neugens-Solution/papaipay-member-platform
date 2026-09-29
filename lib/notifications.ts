import type { Prisma, PrismaClient } from "@prisma/client";
import { db } from "@/lib/db";

/**
 * In-app notifications, stored in the Notification table.
 *  - audience "Admin": shown to every admin (memberId is null); read state is shared.
 *  - audience "Member": shown to one member (memberId set).
 * Notifications are best-effort: a failure here must never block the action
 * that triggered it, so callers use these helpers after their main write
 * (or inside the same transaction when they want both to succeed together).
 */

export const ADMIN_AUDIENCE = "Admin";
export const MEMBER_AUDIENCE = "Member";

type Client = PrismaClient | Prisma.TransactionClient;

type NotificationInput = { title: string; body: string; campaignId?: string | null };

function makeNotificationRef() {
  return `NTF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function create(client: Client, audience: string, memberId: string | null, input: NotificationInput) {
  await client.notification.create({
    data: {
      notificationRef: makeNotificationRef(),
      audience,
      memberId,
      campaignId: input.campaignId ?? null,
      title: input.title.slice(0, 200),
      body: input.body.slice(0, 2000),
      status: "Sent",
      sentAt: new Date(),
    },
  });
}

export async function notifyAdmins(input: NotificationInput, client: Client = db) {
  try {
    await create(client, ADMIN_AUDIENCE, null, input);
  } catch (error) {
    if (client !== db) throw error; // inside a transaction, let the caller decide
    console.error("Admin notification failed", { title: input.title, error });
  }
}

export async function notifyMember(memberId: string, input: NotificationInput, client: Client = db) {
  try {
    await create(client, MEMBER_AUDIENCE, memberId, input);
  } catch (error) {
    if (client !== db) throw error;
    console.error("Member notification failed", { memberId, title: input.title, error });
  }
}

export function formatRinggit(value: unknown) {
  const amount = Number(value ?? 0);
  return `RM${amount.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
