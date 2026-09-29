"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin, requireMember } from "@/lib/auth/guards";
import { ADMIN_AUDIENCE, MEMBER_AUDIENCE } from "@/lib/notifications";

export async function markAdminNotificationsReadAction() {
  await requireAdmin();
  await db.notification.updateMany({
    where: { audience: ADMIN_AUDIENCE, memberId: null, readAt: null },
    data: { readAt: new Date(), status: "Read" },
  });
  revalidatePath("/admin", "layout");
}

export async function markMemberNotificationsReadAction() {
  const { member } = await requireMember();
  await db.notification.updateMany({
    where: { audience: MEMBER_AUDIENCE, memberId: member.id, readAt: null },
    data: { readAt: new Date(), status: "Read" },
  });
  revalidatePath("/member", "layout");
}
