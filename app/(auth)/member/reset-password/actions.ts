"use server";

import { completeMemberPasswordReset } from "@/lib/auth/passwordReset";

export async function resetPasswordAction(_state: { success?: boolean; error?: string }, formData: FormData): Promise<{ success?: boolean; error?: string }> {
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");
  const token = String(formData.get("token") || "");
  if (password.length < 12 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) return { error: "Use at least 12 characters with uppercase, lowercase and a number." };
  if (password !== confirm) return { error: "Passwords do not match." };
  if (!await completeMemberPasswordReset(token, password)) return { error: "This link is invalid or expired. Request a new link." };
  return { success: true };
}
