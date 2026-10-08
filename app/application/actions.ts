"use server";

import { redirect } from "next/navigation";
import { updateMemberProfileAction, type MemberProfileFormState } from "@/lib/member/actions/profile";

export async function saveApplicationProfileAction(state: MemberProfileFormState, formData: FormData): Promise<MemberProfileFormState> {
  const result = await updateMemberProfileAction(state, formData);
  if (result.success?.startsWith("Profile saved.")) redirect("/application/documents");
  return result;
}
