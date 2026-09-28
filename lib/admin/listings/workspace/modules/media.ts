import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdminPermission } from "@/lib/auth/guards";
import { verifyUploadedListingImage, type StoredMediaObject } from "@/lib/storage/mediaStorage";
import type { UploadedListingImage } from "@/lib/storage/listingImagePath";
import { buildListingAuditData, makeFileRef } from "../audit";
import { requiredString, WorkspaceValidationError, type WorkspaceModuleResult } from "../types";

const maxGalleryImages = 12;
const maxAltTextLength = 180;

function uploadsFromForm(formData: FormData, key: string): UploadedListingImage[] {
  return formData
    .getAll(key)
    .map(String)
    .filter(Boolean)
    .map((value) => {
      try {
        const parsed = JSON.parse(value) as Partial<UploadedListingImage>;
        if (typeof parsed.url === "string" && typeof parsed.pathname === "string") {
          return { url: parsed.url, pathname: parsed.pathname, originalFilename: String(parsed.originalFilename ?? "").slice(0, 255) || "image" };
        }
      } catch {}
      throw new WorkspaceValidationError("Uploaded image reference is invalid. Please upload the image again.");
    });
}

async function createImageFileAsset(tx: Prisma.TransactionClient, file: UploadedListingImage, stored: StoredMediaObject) {
  return tx.fileAsset.create({
    data: {
      fileRef: makeFileRef("IMG"),
      bucket: new URL(stored.url).origin,
      objectKey: stored.objectKey,
      originalFilename: file.originalFilename,
      contentType: stored.contentType,
      sizeBytes: stored.sizeBytes,
      visibility: "Public",
      purpose: "CampaignImage",
    },
  });
}

export async function saveMediaModule(formData: FormData): Promise<WorkspaceModuleResult> {
  await requireAdminPermission("listing.manage");
  const campaignId = requiredString(formData, "campaignId");
  if (!campaignId) throw new WorkspaceValidationError("Save Overview before saving Media.");
  const campaign = await db.campaign.findUnique({ where: { id: campaignId }, select: { slug: true } });
  if (!campaign) throw new WorkspaceValidationError("Listing shell was not found.");

  if (requiredString(formData, "mediaUploadPending") === "true") {
    throw new WorkspaceValidationError("Images are still uploading. Wait for uploads to finish, then save again.", { heroImage: "Images are still uploading." });
  }
  const heroFile = uploadsFromForm(formData, "heroImageUpload")[0] ?? null;
  const galleryFiles = uploadsFromForm(formData, "galleryImageUpload");
  const existingGalleryIds = formData.getAll("galleryMediaId").map(String).filter(Boolean);
  const deletedGalleryIds = new Set(formData.getAll("deleteGalleryMediaId").map(String));
  if (galleryFiles.length + existingGalleryIds.filter((id) => !deletedGalleryIds.has(id)).length > maxGalleryImages) throw new WorkspaceValidationError(`Gallery images cannot exceed ${maxGalleryImages}.`, { heroImage: `Gallery images cannot exceed ${maxGalleryImages}.` });

  const verify = async (file: UploadedListingImage) => {
    try {
      return await verifyUploadedListingImage(file, campaign.slug);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Uploaded image is invalid.";
      throw new WorkspaceValidationError(message, { heroImage: message });
    }
  };
  const uploadedHero = heroFile ? await verify(heroFile) : null;
  const uploadedGallery = await Promise.all(galleryFiles.map(async (file) => ({ file, stored: await verify(file) })));

  try {
    const saved = await db.$transaction(async (tx) => {
      const auditSnapshots: unknown[] = [];
      const heroMediaId = requiredString(formData, "heroMediaId");
      if (requiredString(formData, "deleteHeroImage") === "true" && heroMediaId) {
        await tx.campaignMedia.delete({ where: { id: heroMediaId } });
        auditSnapshots.push({ deletedHeroMediaId: heroMediaId });
      }
      const heroAltText = requiredString(formData, "heroAltText");
      if (heroAltText.length > maxAltTextLength) throw new WorkspaceValidationError("Hero image alt text is too long.", { heroAltText: "Hero image alt text is too long." });
      if (heroFile && uploadedHero) {
        if (heroMediaId) await tx.campaignMedia.delete({ where: { id: heroMediaId } });
        const asset = await createImageFileAsset(tx, heroFile, uploadedHero);
        const media = await tx.campaignMedia.create({ data: { campaignId, fileAssetId: asset.id, mediaType: "PrimaryImage", altText: heroAltText || heroFile.originalFilename, sortOrder: 0 } });
        auditSnapshots.push({ heroMediaId: media.id, fileAssetId: asset.id });
      } else if (heroMediaId) {
        await tx.campaignMedia.update({ where: { id: heroMediaId }, data: { altText: heroAltText || null, sortOrder: 0 } });
      }

      for (const mediaId of existingGalleryIds) {
        if (deletedGalleryIds.has(mediaId)) {
          await tx.campaignMedia.delete({ where: { id: mediaId } });
          auditSnapshots.push({ deletedGalleryMediaId: mediaId });
          continue;
        }
        await tx.campaignMedia.update({ where: { id: mediaId }, data: { altText: requiredString(formData, `galleryAltText:${mediaId}`) || null, sortOrder: Number(formData.get(`gallerySortOrder:${mediaId}`) ?? 0) } });
      }
      let sortOrder = existingGalleryIds.filter((id) => !deletedGalleryIds.has(id)).length + 1;
      for (const { file, stored } of uploadedGallery) {
        const asset = await createImageFileAsset(tx, file, stored);
        const media = await tx.campaignMedia.create({ data: { campaignId, fileAssetId: asset.id, mediaType: "GalleryImage", altText: file.originalFilename, sortOrder: sortOrder++ } });
        auditSnapshots.push({ galleryMediaId: media.id, fileAssetId: asset.id });
      }
      await tx.auditLog.create({ data: buildListingAuditData({ action: "listing.media.saved", entityId: campaignId, afterSnapshot: auditSnapshots }) });
      return tx.campaign.findUniqueOrThrow({ where: { id: campaignId }, select: { updatedAt: true } });
    }, { maxWait: 10_000, timeout: 30_000 }); // one FileAsset + CampaignMedia per image; default 5s is too short for a full gallery
    return { ok: true, status: "saved", message: "Media saved.", updatedAt: saved.updatedAt.toISOString() };
  } catch (error) {
    if (uploadedHero || uploadedGallery.length) console.error("Listing media upload succeeded but database write failed; storage cleanup is required.", { campaignId, uploadedHero, uploadedGallery: uploadedGallery.map((item) => item.stored.objectKey), error });
    throw error;
  }
}
