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
  if (!user?.member) return null;
  return { user, member: user.member };
}

export async function requireMember() {
  const current = await getCurrentMember();
  if (!current) redirect("/login");
  return current;
}

export async function getCurrentAdmin() {
  const user = await getCurrentUser();
  if (!user?.adminProfile || user.adminProfile.status !== "Active") return null;
  return { user, admin: user.adminProfile };
}

export async function requireAdmin() {
  const current = await getCurrentAdmin();
  if (!current) redirect("/login");
  return current;
}
