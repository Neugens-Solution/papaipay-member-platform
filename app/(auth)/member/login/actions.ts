"use server";

import { redirect } from "next/navigation";
import { authenticateMember, type AuthFormState } from "@/lib/auth/login";
import { getCurrentMember } from "@/lib/auth/guards";
import { getApplicationStatus } from "@/lib/member/applicationStatus";

export async function memberLoginAction(_state: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const result = await authenticateMember(String(formData.get("email") || ""), String(formData.get("password") || ""));
  if (!result.ok) return { error: result.error };
  const current = await getCurrentMember();
  if (!current || await getApplicationStatus(current.member.id, current.member.verificationStatus) !== "Approved") redirect("/application");
  redirect("/member/dashboard");
}
