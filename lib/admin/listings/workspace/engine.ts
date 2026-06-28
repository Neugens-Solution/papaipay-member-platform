import { Prisma } from "@prisma/client";
import { getWorkspaceReadiness } from "./readiness";
import { WorkspaceValidationError, requiredString, type WorkspaceIntent, type WorkspaceModuleResult } from "./types";
import { saveDocumentsModule } from "./modules/documents";
import { saveMediaModule } from "./modules/media";
import { saveMemberInfoModule } from "./modules/memberInfo";
import { saveOverviewModule } from "./modules/overview";
import { saveParticipationModule } from "./modules/participation";
import { publishListingModule, unpublishListingModule } from "./modules/publish";
import { savePropertyModule } from "./modules/property";
import { saveSettlementModule } from "./modules/settlement";

function normalizeIntent(intent: string): WorkspaceIntent {
  if (intent === "draft") return "save-overview";
  if (intent === "save-step") return "save-overview";
  const allowed = new Set<WorkspaceIntent>(["save-overview", "save-property", "save-participation", "save-settlement", "save-media", "save-documents", "save-member-info", "publish", "unpublish"]);
  if (allowed.has(intent as WorkspaceIntent)) return intent as WorkspaceIntent;
  return "save-overview";
}

export class ListingWorkspaceEngine {
  static async dispatch(formData: FormData): Promise<WorkspaceModuleResult> {
    const intent = normalizeIntent(requiredString(formData, "intent"));
    let result: WorkspaceModuleResult;
    switch (intent) {
      case "save-overview":
        result = await saveOverviewModule(formData);
        break;
      case "save-property":
        result = await savePropertyModule(formData);
        break;
      case "save-participation":
        result = await saveParticipationModule(formData);
        break;
      case "save-settlement":
        result = await saveSettlementModule(formData);
        break;
      case "save-media":
        result = await saveMediaModule(formData);
        break;
      case "save-documents":
        result = await saveDocumentsModule(formData);
        break;
      case "save-member-info":
        result = await saveMemberInfoModule(formData);
        break;
      case "publish":
        return publishListingModule(formData);
      case "unpublish":
        return unpublishListingModule(formData);
    }

    const campaignId = requiredString(formData, "campaignId");
    if (campaignId) result.readiness = await getWorkspaceReadiness(campaignId);
    return result;
  }
}

export function toWorkspaceError(error: unknown): WorkspaceModuleResult {
  if (error instanceof WorkspaceValidationError) return { ok: false, status: "error", message: error.message, fieldErrors: error.fieldErrors };
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2028") return { ok: false, status: "error", message: "Save failed because the operation took too long. Please retry this section." };
    if (error.code === "P2002") return { ok: false, status: "error", message: "This listing could not be saved because one or more values already exist.", fieldErrors: { title: "Please choose a unique value." } };
    return { ok: false, status: "error", message: "This listing could not be saved because the database rejected one or more values." };
  }
  if (error instanceof Error && /^(Images must|Image storage is not configured|Unable to upload image|Vercel Blob upload)/.test(error.message)) return { ok: false, status: "error", message: error.message };
  console.error("Unexpected listing workspace error", error);
  return { ok: false, status: "error", message: "Unable to save this listing section. Please try again or contact support if it repeats." };
}
