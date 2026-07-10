"use server";

import { redirect } from "next/navigation";
import { authenticateMember, type AuthFormState } from "@/lib/auth/login";

export async function memberLoginAction(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const result = await authenticateMember(String(formData.get("email") || ""), String(formData.get("password") || ""));
  if (!result.ok) return { error: result.error };
  redirect("/member/dashboard");
}
