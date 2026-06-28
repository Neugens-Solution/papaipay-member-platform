"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ListingWorkspaceEngine, toWorkspaceError } from "@/lib/admin/listings/workspace/engine";
import type { WorkspaceReadinessResult } from "@/lib/admin/listings/workspace/types";

export type ListingFormState = {
  errors: string[];
  fieldErrors?: Record<string, string>;
  readiness?: WorkspaceReadinessResult;
  status?: "not_started" | "unsaved" | "saving" | "saved" | "error";
  message?: string;
};

export async function saveListingWorkspaceAction(
  _prevState: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  const result = await ListingWorkspaceEngine.dispatch(formData).catch(toWorkspaceError);
  if (!result.ok) {
    return {
      errors: [result.message ?? "Unable to save this listing section."],
      fieldErrors: result.fieldErrors,
      readiness: result.readiness,
      status: result.status,
      message: result.message,
    };
  }

  revalidatePath("/admin/listings");
  if (result.redirectTo) redirect(result.redirectTo);

  return {
    errors: [],
    readiness: result.readiness,
    status: result.status,
    message: result.message,
  };
}

export const saveListingAction = saveListingWorkspaceAction;
