import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { uploadListingImage, validateImageFile, type StoredMediaObject } from "@/lib/storage/mediaStorage";
import { buildListingAuditData, makeFileRef } from "../audit";
import { fileFromForm, filesFromForm, requiredString, WorkspaceValidationError, type WorkspaceModuleResult } from "../types";

const maxGalleryImages = 12;
const maxAltTextLength = 180;

async function createImageFileAsset(tx: Prisma.TransactionClient, file: File, stored: StoredMediaObject) {
  return tx.fileAsset.create({
    data: {
      fileRef: makeFileRef("IMG"),
      bucket: new URL(stored.url).origin,
      objectKey: stored.objectKey,
      originalFilename: file.name,
      contentType: stored.contentType,
      sizeBytes: stored.sizeBytes,
      visibility: "Public",
      purpose: "CampaignImage",
    },
  });
}

export async function saveMediaModule(formData: FormData): Promise<WorkspaceModuleResult> {
  const campaignId = requiredString(formData, "campaignId");
  if (!campaignId) throw new WorkspaceValidationError("Save Overview before saving Media.");
  const campaign = await db.campaign.findUnique({ where: { id: campaignId }, select: { slug: true } });
  if (!campaign) throw new WorkspaceValidationError("Listing shell was not found.");

  const heroFile = fileFromForm(formData, "heroImage");
  if (heroFile) validateImageFile(heroFile);
  const galleryFiles = filesFromForm(formData, "galleryImages");
  const existingGalleryIds = formData.getAll("galleryMediaId").map(String).filter(Boolean);
  const deletedGalleryIds = new Set(formData.getAll("deleteGalleryMediaId").map(String));
  if (galleryFiles.length + existingGalleryIds.filter((id) => !deletedGalleryIds.has(id)).length > maxGalleryImages) throw new WorkspaceValidationError(`Gallery images cannot exceed ${maxGalleryImages}.`, { heroImage: `Gallery images cannot exceed ${maxGalleryImages}.` });
  for (const file of galleryFiles) validateImageFile(file);

  const uploadedHero = heroFile ? await uploadListingImage(heroFile, campaign.slug) : null;
  const uploadedGallery = await Promise.all(galleryFiles.map(async (file) => ({ file, stored: await uploadListingImage(file, campaign.slug) })));

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
        const media = await tx.campaignMedia.create({ data: { campaignId, fileAssetId: asset.id, mediaType: "PrimaryImage", altText: heroAltText || heroFile.name, sortOrder: 0 } });
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
        const media = await tx.campaignMedia.create({ data: { campaignId, fileAssetId: asset.id, mediaType: "GalleryImage", altText: file.name, sortOrder: sortOrder++ } });
        auditSnapshots.push({ galleryMediaId: media.id, fileAssetId: asset.id });
      }
      await tx.auditLog.create({ data: buildListingAuditData({ action: "listing.media.saved", entityId: campaignId, afterSnapshot: auditSnapshots }) });
      return tx.campaign.findUniqueOrThrow({ where: { id: campaignId }, select: { updatedAt: true } });
    });
    return { ok: true, status: "saved", message: "Media saved.", updatedAt: saved.updatedAt.toISOString() };
  } catch (error) {
    if (uploadedHero || uploadedGallery.length) console.error("Listing media upload succeeded but database write failed; storage cleanup is required.", { campaignId, uploadedHero, uploadedGallery: uploadedGallery.map((item) => item.stored.objectKey), error });
    throw error;
  }
}
