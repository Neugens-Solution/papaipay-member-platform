"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { setSession, clearSession } from "@/lib/auth/session";

export type LoginState = { error?: string };
const GENERIC_ERROR = "Invalid email or password.";

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) return { error: GENERIC_ERROR };

  const user = await db.user.findUnique({
    where: { email },
    include: { member: true, adminProfile: true },
  });

  if (!user || user.status !== "Active" || !(await verifyPassword(user.passwordHash, password))) {
    return { error: GENERIC_ERROR };
  }

  if (user.adminProfile?.status === "Active") {
    await setSession({ userId: user.id, accountType: "admin" });
    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    redirect("/admin/dashboard");
  }

  if (user.member) {
    await setSession({ userId: user.id, accountType: "member" });
    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    redirect("/member/dashboard");
  }

  return { error: "Your account does not have portal access yet." };
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}
