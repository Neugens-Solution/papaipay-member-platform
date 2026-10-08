"use server";

import { requestMemberPasswordReset } from "@/lib/auth/passwordReset";

export async function forgotPasswordAction(_state: { sent: boolean }, formData: FormData) {
  await requestMemberPasswordReset(String(formData.get("email") || ""));
  return { sent: true };
}
