import "server-only";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await db.user.findFirst({
    where: { id: session.userId, status: "Active" },
    include: { member: true, adminProfile: { include: { role: true } } },
  });
  if (!user) return null;
  return { ...user, sessionAccountType: session.accountType };
}

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
  // TODO: Enforce granular permissionKey checks once seeded role permissions are finalized.
  // This PR intentionally fails closed at the active admin boundary for every admin mutation.
  void permissionKey;
  return current;
}
