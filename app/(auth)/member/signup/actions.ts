"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { setSession } from "@/lib/auth/session";

export type SignupState = { error?: string; fieldErrors?: Record<string, string> };

function validatePassword(password: string) {
  if (password.length < 12) return "Password must be at least 12 characters.";
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) return "Password must include uppercase, lowercase and a number.";
  return null;
}

function memberRef() {
  return `MBR-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function memberSignupAction(_state: SignupState, formData: FormData): Promise<SignupState> {
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const fieldErrors: Record<string, string> = {};

  if (fullName.length < 2) fieldErrors.fullName = "Full name is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Enter a valid email address.";
  const passwordError = validatePassword(password);
  if (passwordError) fieldErrors.password = passwordError;
  if (password !== confirmPassword) fieldErrors.confirmPassword = "Passwords do not match.";
  if (Object.keys(fieldErrors).length > 0) return { fieldErrors };

  const existing = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) return { fieldErrors: { email: "An account already exists for this email." } };

  const user = await db.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      status: "Active",
      member: { create: { fullName, memberRef: memberRef(), verificationStatus: "NotStarted" } },
    },
    select: { id: true },
  });

  await setSession({ userId: user.id, accountType: "member" });
  redirect("/member/dashboard");
}
