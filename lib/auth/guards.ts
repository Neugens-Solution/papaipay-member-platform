import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export const getCurrentUser = cache(async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await db.user.findFirst({
    where: { id: session.userId, status: "Active" },
    include: { member: true, adminProfile: { include: { role: true } } },
  });
  if (!user) return null;
  return { ...user, sessionAccountType: session.accountType };
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function getCurrentMember() {
  const user = await getCurrentUser();
  if (!user?.member || user.sessionAccountType !== "member") return null;
  return { user, member: user.member };
}

export async function requireMember() {
  const current = await getCurrentMember();
  if (!current) redirect("/member/login");
  return current;
}

export async function getCurrentAdmin() {
  const user = await getCurrentUser();
  if (!user?.adminProfile || user.adminProfile.status !== "Active" || user.sessionAccountType !== "admin") return null;
  return { user, admin: user.adminProfile };
}

export async function requireAdmin() {
  const current = await getCurrentAdmin();
  if (!current) redirect("/admin/login");
  return current;
}

export async function requireAdminPermission(permissionKey: string) {
  const current = await requireAdmin();
  if (current.admin.role.name === "Super Admin") return current;

  const permission = await db.rolePermission.findFirst({
    where: { roleId: current.admin.roleId, permission: { key: permissionKey } },
    select: { permissionId: true },
  });
  if (!permission) throw new Error("You do not have permission to perform this admin action.");
  return current;
}
