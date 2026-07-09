import { db } from "@/lib/db";
import { requireAdminPermission } from "@/lib/auth/guards";
import { buildListingAuditData, makeFileRef } from "../audit";
import { fileFromForm, requiredString, WorkspaceValidationError, type WorkspaceModuleResult } from "../types";

const allowedDocumentTypes = new Set(["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png", "image/webp"]);
function normalizeVisibility(value: string) { return value === "Member Visible" ? "MemberVisible" : "InternalOnly"; }
function normalizeDocumentCategory(value: string) { return value.replaceAll(" ", "") || "OtherDocuments"; }

export async function saveDocumentsModule(formData: FormData): Promise<WorkspaceModuleResult> {
  await requireAdminPermission("listing.manage");
  const campaignId = requiredString(formData, "campaignId");
  if (!campaignId) throw new WorkspaceValidationError("Save Overview before saving Documents.");
  const saved = await db.$transaction(async (tx) => {
    const snapshots: unknown[] = [];
    for (const documentId of formData.getAll("documentId").map(String)) {
      if (formData.getAll("deleteDocumentId").includes(documentId)) {
        await tx.campaignDocument.delete({ where: { id: documentId } });
        snapshots.push({ deletedDocumentId: documentId });
        continue;
      }
      const document = await tx.campaignDocument.update({ where: { id: documentId }, data: { title: requiredString(formData, `documentTitle:${documentId}`), visibility: normalizeVisibility(requiredString(formData, `documentVisibility:${documentId}`)) as any, documentStatus: requiredString(formData, `documentStatus:${documentId}`) as any, category: requiredString(formData, `documentCategory:${documentId}`) as any } });
      snapshots.push({ documentId: document.id, updated: true });
    }
    const file = fileFromForm(formData, "documentFile:Other Documents");
    if (file) {
      if (!allowedDocumentTypes.has(file.type)) throw new WorkspaceValidationError("Campaign documents must be PDF, DOCX, JPG, PNG, or WEBP.");
      const extension = file.name.match(/\.[a-zA-Z0-9]+$/)?.[0]?.toLowerCase() ?? "";
      const asset = await tx.fileAsset.create({ data: { fileRef: makeFileRef("FILE"), bucket: "pending-object-storage", objectKey: `listings/${campaignId}/document-${Date.now()}-${Math.random().toString(36).slice(2, 10)}${extension}`, originalFilename: file.name, contentType: file.type || "application/octet-stream", sizeBytes: file.size, visibility: "InternalOnly", purpose: "CampaignDocument" } });
      const document = await tx.campaignDocument.create({ data: { documentRef: makeFileRef("DOC"), campaignId, fileAssetId: asset.id, category: normalizeDocumentCategory(requiredString(formData, "newDocumentCategory") || "Other Documents") as any, title: file.name, visibility: normalizeVisibility(requiredString(formData, "newDocumentVisibility")) as any, documentStatus: (requiredString(formData, "newDocumentStatus") || "Draft") as any } });
      snapshots.push({ documentId: document.id, fileAssetId: asset.id });
    }
    await tx.auditLog.create({ data: buildListingAuditData({ action: "listing.documents.saved", entityId: campaignId, afterSnapshot: snapshots }) });
    return tx.campaign.findUniqueOrThrow({ where: { id: campaignId }, select: { updatedAt: true } });
  });
  return { ok: true, status: "saved", message: "Documents saved.", updatedAt: saved.updatedAt.toISOString() };
}
