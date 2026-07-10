import "server-only";

import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { setSession } from "@/lib/auth/session";

export type AuthFormState = { error?: string };
export const INVALID_CREDENTIALS_ERROR = "Invalid email or password.";

export async function authenticateMember(emailInput: string, password: string) {
  const email = emailInput.trim().toLowerCase();
  if (!email || !password) return { ok: false as const, error: INVALID_CREDENTIALS_ERROR };

  const user = await db.user.findUnique({ where: { email }, include: { member: true } });
  if (!user || user.status !== "Active" || !user.member || !(await verifyPassword(user.passwordHash, password))) {
    return { ok: false as const, error: INVALID_CREDENTIALS_ERROR };
  }

  await setSession({ userId: user.id, accountType: "member" });
  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  return { ok: true as const };
}

export async function authenticateAdmin(emailInput: string, password: string) {
  const email = emailInput.trim().toLowerCase();
  if (!email || !password) return { ok: false as const, error: INVALID_CREDENTIALS_ERROR };

  const user = await db.user.findUnique({ where: { email }, include: { adminProfile: true } });
  if (
    !user ||
    user.status !== "Active" ||
    !user.adminProfile ||
    user.adminProfile.status !== "Active" ||
    !(await verifyPassword(user.passwordHash, password))
  ) {
    return { ok: false as const, error: "Invalid credentials or non-admin account." };
  }

  await setSession({ userId: user.id, accountType: "admin" });
  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  return { ok: true as const };
}
