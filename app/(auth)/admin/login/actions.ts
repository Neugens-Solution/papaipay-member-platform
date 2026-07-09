"use server";

import { redirect } from "next/navigation";
import { authenticateAdmin, type AuthFormState } from "@/lib/auth/login";

export async function adminLoginAction(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const result = await authenticateAdmin(String(formData.get("email") || ""), String(formData.get("password") || ""));
  if (!result.ok) return { error: result.error };
  redirect("/admin/dashboard");
}
