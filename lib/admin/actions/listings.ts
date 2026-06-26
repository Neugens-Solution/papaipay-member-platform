"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { db } from "@/lib/db";
import { type AdminAuditAction } from "@/lib/audit/adminAudit";
import {
  listingDraftSchema,
  type ListingDraftInput,
} from "@/lib/validation/listingDraft";

function requiredString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}
function optionalDate(formData: FormData, key: string) {
  const value = requiredString(formData, key);
  return value ? value : undefined;
}
function draftString(formData: FormData, key: string, fallback: string) {
  return requiredString(formData, key) || fallback;
}
function draftNumber(formData: FormData, key: string, fallback: string) {
  return requiredString(formData, key) || fallback;
}
function checkboxBoolean(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true";
}
function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140);
}
async function makeUniqueSlug(title: string, currentCampaignId?: string) {
  const base = slugify(title) || `listing-${Date.now()}`;
  let candidate = base;
  let suffix = 2;
  while (true) {
    const existing = await db.campaign.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === currentCampaignId) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}
function makeCampaignRefCandidate() {
  return `CMP-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
}
async function makeUniqueCampaignRef() {
  let candidate = makeCampaignRefCandidate();
  let suffix = 2;
  while (
    await db.campaign.findUnique({
      where: { campaignRef: candidate },
      select: { id: true },
    })
  ) {
    candidate = `${makeCampaignRefCandidate()}-${suffix++}`;
  }
  return candidate;
}
function makeCampaignCodeCandidate(title: string) {
  const prefix = title
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 4)
    .padEnd(4, "X");
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}
async function makeUniqueCampaignCode(
  title: string,
  currentCampaignId?: string,
) {
  let candidate = makeCampaignCodeCandidate(title);
  let suffix = 2;
  while (true) {
    const existing = await db.campaign.findUnique({
      where: { campaignCode: candidate },
      select: { id: true },
    });
    if (!existing || existing.id === currentCampaignId) return candidate;
    candidate = `${makeCampaignCodeCandidate(title)}-${suffix++}`;
  }
}
function makeAuditRef() {
  return `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
function makeFileRef(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
const allowedImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;
const allowedImageTypes = new Set<string>(allowedImageMimeTypes);
const allowedDocumentTypes = new Set<string>([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ...allowedImageMimeTypes,
]);
const maxGalleryImages = 12;
const maxCaptionLength = 160;
const maxAltTextLength = 180;

function fileFromForm(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}
function filesFromForm(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0);
}
class ListingFormValidationError extends Error {
  constructor(
    public readonly errors: string[],
    public readonly fieldErrors?: Record<string, string>,
  ) {
    super(errors.join(" "));
  }
}

export type ListingFormState = {
  errors: string[];
  fieldErrors?: Record<string, string>;
};

function validationError(message: string): never {
  throw new ListingFormValidationError([message]);
}

const friendlyFieldLabels: Record<string, { label: string; field: string }> = {
  title: { label: "Listing Title", field: "title" },
  campaignTarget: { label: "Campaign Target", field: "campaignTarget" },
  minimumParticipationAmount: {
    label: "Minimum Participation Amount",
    field: "minimumParticipationAmount",
  },
  maximumParticipationAmount: {
    label: "Maximum Participation Amount",
    field: "maximumParticipationAmount",
  },
  campaignOpenDate: { label: "Campaign Open Date", field: "campaignOpenDate" },
  campaignCloseDate: {
    label: "Campaign Close Date",
    field: "campaignCloseDate",
  },
  holdingReturnRateMonthly: {
    label: "Monthly Holding Return",
    field: "holdingReturnRateMonthly",
  },
  returnType: { label: "Return Type", field: "returnType" },
  maximumHoldingPeriodMonths: {
    label: "Maximum Holding Period",
    field: "maximumHoldingPeriodMonths",
  },
  "property.propertyType": { label: "Asset Type", field: "propertyType" },
  "property.assetCategory": { label: "Asset Category", field: "assetCategory" },
  "property.occupancyStatus": {
    label: "Occupancy Status",
    field: "occupancyStatus",
  },
  "property.tenure": { label: "Tenure", field: "tenure" },
  "property.bumiStatus": { label: "Bumi Status", field: "bumiStatus" },
  "property.builtUpArea": { label: "Built-Up", field: "builtUpArea" },
  "property.landArea": { label: "Land Area", field: "landArea" },
  "property.bedrooms": { label: "Bedrooms", field: "bedrooms" },
  "property.bathrooms": { label: "Bathrooms", field: "bathrooms" },
  "property.state": { label: "State", field: "state" },
  "property.location": { label: "City", field: "location" },
  "property.fullAddress": { label: "Full Address", field: "fullAddress" },
  "property.yearBuilt": { label: "Year Built", field: "yearBuilt" },
  "property.reservePrice": { label: "Market Value", field: "reservePrice" },
  "content.aboutCampaign": {
    label: "About This Listing",
    field: "aboutCampaign",
  },
  "content.importantInformation": {
    label: "Important Information",
    field: "importantInformation",
  },
  "content.riskDisclaimer": {
    label: "Risk Disclaimer",
    field: "riskDisclaimer",
  },
  "content.holdingReturnExplanation": {
    label: "Holding Return Explanation",
    field: "holdingReturnExplanation",
  },
  "content.finalDistributionExplanation": {
    label: "Final Return Explanation",
    field: "finalDistributionExplanation",
  },
};

function friendlyZodErrors(error: ZodError): ListingFormState {
  const fieldErrors: Record<string, string> = {};
  const errors = error.issues.map((issue) => {
    const path = issue.path.join(".");
    const field = friendlyFieldLabels[path] ?? {
      label: "Listing details",
      field: "",
    };
    const lowerMessage = issue.message.toLowerCase();
    const message =
      lowerMessage.includes("invalid") ||
      lowerMessage.includes("number") ||
      lowerMessage.includes("date")
        ? `Please enter a valid ${field.label}.`
        : `Please complete ${field.label}.`;
    if (field.field) fieldErrors[field.field] = message;
    return message;
  });
  return { errors: Array.from(new Set(errors)), fieldErrors };
}

function assertLength(value: string, max: number, label: string) {
  if (value.length > max)
    validationError(`${label} must be ${max} characters or fewer.`);
}
function normalizeVisibility(value: string) {
  return value === "Member Visible" ? "MemberVisible" : "InternalOnly";
}
function normalizeDocumentCategory(value: string) {
  return value.replaceAll(" ", "") || "OtherDocuments";
}
async function createFileAsset(
  tx: Prisma.TransactionClient,
  file: File,
  purpose: "CampaignImage" | "CampaignDocument",
) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const objectKey = `campaign-assets/${Date.now()}-${Math.random().toString(36).slice(2)}-${safeName}`;
  // Temporary Phase 2B storage: local public/uploads keeps FileAsset persistence
  // unblocked for demo/admin workflows. Vercel/serverless file systems are not
  // durable, so replace this with object storage (S3/R2/Vercel Blob/etc.) before
  // production media retention is required.
  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "campaign-assets",
  );
  await mkdir(uploadDir, { recursive: true });
  await writeFile(
    path.join(process.cwd(), "public", "uploads", objectKey),
    Buffer.from(await file.arrayBuffer()),
  );
  return tx.fileAsset.create({
    data: {
      fileRef: makeFileRef("FILE"),
      bucket: "public/uploads",
      objectKey: `/uploads/${objectKey}`,
      originalFilename: file.name,
      contentType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      visibility: purpose === "CampaignImage" ? "Public" : "InternalOnly",
      purpose,
    },
  });
}
function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
function buildAuditData({
  action,
  entityId,
  beforeSnapshot,
  afterSnapshot,
}: {
  action: AdminAuditAction;
  entityId: string;
  beforeSnapshot?: unknown;
  afterSnapshot?: unknown;
}): Prisma.AuditLogUncheckedCreateInput {
  return {
    auditRef: makeAuditRef(),
    action,
    entityType: "Campaign",
    entityId,
    ...(beforeSnapshot !== undefined
      ? { beforeSnapshot: toJsonValue(beforeSnapshot) }
      : {}),
    ...(afterSnapshot !== undefined
      ? { afterSnapshot: toJsonValue(afterSnapshot) }
      : {}),
  };
}
function buildInput(
  formData: FormData,
  action: string,
  generated: { campaignCode: string; slug: string },
) {
  const isPublish = action === "publish";
  const title = isPublish
    ? requiredString(formData, "title")
    : draftString(formData, "title", "Untitled Listing Draft");
  const tenure = draftString(formData, "tenure", "Freehold");
  const parsed = listingDraftSchema.safeParse({
    title,
    campaignCode: generated.campaignCode,
    slug: generated.slug,
    lifecycleStatus: isPublish ? "Open" : "Draft",
    publishStatus: isPublish ? "Published" : "Draft",
    visibility: isPublish
      ? "MemberVisible"
      : requiredString(formData, "visibility") || "InternalOnly",
    campaignTarget: draftNumber(formData, "campaignTarget", "0"),
    minimumParticipationAmount: draftNumber(
      formData,
      "minimumParticipationAmount",
      "0",
    ),
    maximumParticipationAmount: draftNumber(
      formData,
      "maximumParticipationAmount",
      "0",
    ),
    campaignOpenDate: optionalDate(formData, "campaignOpenDate"),
    campaignCloseDate: optionalDate(formData, "campaignCloseDate"),
    memberProfitDistributionPercentagePlanned:
      formData.get("memberProfitDistributionPercentagePlanned") || undefined,
    platformProfitSharePercentagePlanned:
      formData.get("platformProfitSharePercentagePlanned") || undefined,
    holdingReturnRateMonthly: draftNumber(
      formData,
      "holdingReturnRateMonthly",
      "0",
    ),
    returnType: draftString(formData, "returnType", "Target"),
    maximumHoldingPeriodMonths: draftNumber(
      formData,
      "maximumHoldingPeriodMonths",
      "24",
    ),
    principalProtectionEnabled: checkboxBoolean(
      formData,
      "principalProtectionEnabled",
    ),
    property: {
      propertyType: isPublish
        ? requiredString(formData, "propertyType")
        : draftString(formData, "propertyType", "To be confirmed"),
      assetCategory: isPublish
        ? requiredString(formData, "assetCategory")
        : draftString(formData, "assetCategory", "Residential Asset"),
      occupancyStatus: isPublish
        ? requiredString(formData, "occupancyStatus")
        : draftString(formData, "occupancyStatus", "To be confirmed"),
      tenure,
      tenureAlias: tenure === "Freehold" ? "FH" : "LH",
      isLaca: checkboxBoolean(formData, "isLaca"),
      bumiStatus: draftString(formData, "bumiStatus", "OpenMarket"),
      builtUpArea: requiredString(formData, "builtUpArea"),
      landArea: requiredString(formData, "landArea"),
      bedrooms: formData.get("bedrooms") || undefined,
      bathrooms: formData.get("bathrooms") || undefined,
      reservePrice: formData.get("reservePrice") || undefined,
      state: isPublish
        ? requiredString(formData, "state")
        : draftString(formData, "state", "To be confirmed"),
      location: isPublish
        ? requiredString(formData, "location")
        : draftString(formData, "location", "To be confirmed"),
      fullAddress: isPublish
        ? requiredString(formData, "fullAddress")
        : draftString(formData, "fullAddress", "To be confirmed"),
      yearBuilt: requiredString(formData, "yearBuilt"),
    },
    content: {
      aboutCampaign: isPublish
        ? requiredString(formData, "aboutCampaign")
        : draftString(
            formData,
            "aboutCampaign",
            "Draft content to be completed.",
          ),
      importantInformation: requiredString(formData, "importantInformation"),
      riskDisclaimer: requiredString(formData, "riskDisclaimer"),
      holdingReturnExplanation: requiredString(
        formData,
        "holdingReturnExplanation",
      ),
      finalDistributionExplanation: requiredString(
        formData,
        "finalDistributionExplanation",
      ),
    },
  });
  if (!parsed.success) {
    const friendly = friendlyZodErrors(parsed.error);
    throw new ListingFormValidationError(friendly.errors, friendly.fieldErrors);
  }
  return parsed.data;
}
function campaignData(input: ListingDraftInput, action: string) {
  return {
    campaignCode: input.campaignCode,
    title: input.title,
    slug: input.slug,
    lifecycleStatus: input.lifecycleStatus,
    publishStatus: input.publishStatus,
    visibility: input.visibility,
    campaignTarget: new Prisma.Decimal(input.campaignTarget),
    minimumParticipationAmount: new Prisma.Decimal(
      input.minimumParticipationAmount,
    ),
    maximumParticipationAmount: new Prisma.Decimal(
      input.maximumParticipationAmount,
    ),
    campaignOpenDate: input.campaignOpenDate,
    campaignCloseDate: input.campaignCloseDate,
    memberProfitDistributionPercentagePlanned:
      input.memberProfitDistributionPercentagePlanned == null
        ? null
        : new Prisma.Decimal(input.memberProfitDistributionPercentagePlanned),
    platformProfitSharePercentagePlanned:
      input.platformProfitSharePercentagePlanned == null
        ? null
        : new Prisma.Decimal(input.platformProfitSharePercentagePlanned),
    holdingReturnRateMonthly: new Prisma.Decimal(
      input.holdingReturnRateMonthly,
    ),
    returnType: input.returnType,
    maximumHoldingPeriodMonths: input.maximumHoldingPeriodMonths,
    principalProtectionEnabled: input.principalProtectionEnabled,
    publishedAt: action === "publish" ? new Date() : null,
  };
}
function propertyData(input: ListingDraftInput) {
  return {
    ...input.property,
    reservePrice:
      input.property.reservePrice == null
        ? null
        : new Prisma.Decimal(input.property.reservePrice),
  };
}
export async function saveListingAction(
  _prevState: ListingFormState,
  formData: FormData,
): Promise<ListingFormState> {
  let redirectSlug: string | null = null;
  let savedAction = "draft";
  try {
    const action = requiredString(formData, "intent");
    savedAction = action;
    const campaignId = requiredString(formData, "campaignId") || undefined;
    const existing = campaignId
      ? await db.campaign.findUnique({
          where: { id: campaignId },
          include: {
            propertyDetail: true,
            content: true,
            media: { include: { fileAsset: true } },
            documents: { include: { fileAsset: true } },
            faqs: true,
          },
        })
      : null;
    const heroFile = fileFromForm(formData, "heroImage");
    const galleryFiles = filesFromForm(formData, "galleryImages");
    const heroCaption = requiredString(formData, "heroCaption");
    const heroAltText = requiredString(formData, "heroAltText");
    assertLength(heroCaption, maxCaptionLength, "Hero image caption");
    assertLength(heroAltText, maxAltTextLength, "Hero image alt text");
    if (heroFile && !allowedImageTypes.has(heroFile.type))
      validationError("Hero image must be JPG, PNG, or WEBP.");
    for (const file of galleryFiles) {
      if (!allowedImageTypes.has(file.type))
        validationError("Gallery images must be JPG, PNG, or WEBP.");
    }
    const existingGalleryCount =
      existing?.media.filter(
        (media) =>
          media.mediaType === "GalleryImage" &&
          !formData.getAll("deleteGalleryMediaId").includes(media.id),
      ).length ?? 0;
    if (existingGalleryCount + galleryFiles.length > maxGalleryImages)
      validationError(
        `A listing can have a maximum of ${maxGalleryImages} gallery images.`,
      );
    const hasExistingHero =
      Boolean(
        existing?.media.some((media) => media.mediaType === "PrimaryImage"),
      ) && requiredString(formData, "deleteHeroImage") !== "true";
    if (action === "publish" && !heroFile && !hasExistingHero)
      throw new ListingFormValidationError(
        ["Please add a Hero Image before publishing."],
        { heroImage: "Please add a Hero Image before publishing." },
      );
    const draftTitle = draftString(formData, "title", "Untitled Listing Draft");
    const input = buildInput(formData, action, {
      campaignCode:
        existing?.campaignCode ||
        (await makeUniqueCampaignCode(draftTitle, campaignId)),
      slug: await makeUniqueSlug(draftTitle, campaignId),
    });
    const auditAction: AdminAuditAction = !existing
      ? "create"
      : action === "publish"
        ? "publish"
        : action === "unpublish"
          ? "archive"
          : "update";
    const saved = await db.$transaction(async (tx) => {
      const campaign = existing
        ? await tx.campaign.update({
            where: { id: existing.id },
            data: campaignData(input, action),
          })
        : await tx.campaign.create({
            data: {
              campaignRef: await makeUniqueCampaignRef(),
              ...campaignData(input, action),
            },
          });
      await tx.propertyDetail.upsert({
        where: { campaignId: campaign.id },
        update: propertyData(input),
        create: { campaignId: campaign.id, ...propertyData(input) },
      });
      await tx.campaignContent.upsert({
        where: { campaignId: campaign.id },
        update: input.content,
        create: { campaignId: campaign.id, ...input.content },
      });
      const mediaAuditEvents: Prisma.AuditLogUncheckedCreateInput[] = [];
      const heroMediaId = requiredString(formData, "heroMediaId");
      if (
        requiredString(formData, "deleteHeroImage") === "true" &&
        heroMediaId
      ) {
        await tx.campaignMedia.delete({ where: { id: heroMediaId } });
        mediaAuditEvents.push(
          buildAuditData({
            action: "update",
            entityId: campaign.id,
            beforeSnapshot: { heroMediaId },
            afterSnapshot: { deleted: true },
          }),
        );
      }
      if (heroFile) {
        const asset = await createFileAsset(tx, heroFile, "CampaignImage");
        await tx.campaignMedia.deleteMany({
          where: { campaignId: campaign.id, mediaType: "PrimaryImage" },
        });
        const hero = await tx.campaignMedia.create({
          data: {
            campaignId: campaign.id,
            fileAssetId: asset.id,
            mediaType: "PrimaryImage",
            caption: heroCaption || null,
            altText: heroAltText || null,
            sortOrder: 0,
          },
        });
        mediaAuditEvents.push(
          buildAuditData({
            action: "update",
            entityId: campaign.id,
            afterSnapshot: { heroMediaId: hero.id, fileAssetId: asset.id },
          }),
        );
      } else if (heroMediaId) {
        await tx.campaignMedia.update({
          where: { id: heroMediaId },
          data: {
            caption: heroCaption || null,
            altText: heroAltText || null,
            sortOrder: 0,
          },
        });
      }
      for (const mediaId of formData.getAll("galleryMediaId").map(String)) {
        if (formData.getAll("deleteGalleryMediaId").includes(mediaId)) {
          await tx.campaignMedia.delete({ where: { id: mediaId } });
          mediaAuditEvents.push(
            buildAuditData({
              action: "update",
              entityId: campaign.id,
              beforeSnapshot: { galleryMediaId: mediaId },
              afterSnapshot: { deleted: true },
            }),
          );
          continue;
        }
        const caption = requiredString(formData, `galleryCaption:${mediaId}`);
        const altText = requiredString(formData, `galleryAltText:${mediaId}`);
        assertLength(caption, maxCaptionLength, "Gallery image caption");
        assertLength(altText, maxAltTextLength, "Gallery image alt text");
        await tx.campaignMedia.update({
          where: { id: mediaId },
          data: {
            caption: caption || null,
            altText: altText || null,
            sortOrder: Number(formData.get(`gallerySortOrder:${mediaId}`) ?? 0),
          },
        });
      }
      let nextSortOrder = existingGalleryCount;
      for (const file of galleryFiles) {
        const asset = await createFileAsset(tx, file, "CampaignImage");
        const media = await tx.campaignMedia.create({
          data: {
            campaignId: campaign.id,
            fileAssetId: asset.id,
            mediaType: "GalleryImage",
            sortOrder: nextSortOrder++,
          },
        });
        mediaAuditEvents.push(
          buildAuditData({
            action: "update",
            entityId: campaign.id,
            afterSnapshot: { galleryMediaId: media.id, fileAssetId: asset.id },
          }),
        );
      }
      for (const documentId of formData.getAll("documentId").map(String)) {
        if (formData.getAll("deleteDocumentId").includes(documentId)) {
          await tx.campaignDocument.delete({ where: { id: documentId } });
          mediaAuditEvents.push(
            buildAuditData({
              action: "update",
              entityId: campaign.id,
              beforeSnapshot: { documentId },
              afterSnapshot: { deleted: true },
            }),
          );
          continue;
        }
        await tx.campaignDocument.update({
          where: { id: documentId },
          data: {
            title: requiredString(formData, `documentTitle:${documentId}`),
            visibility: normalizeVisibility(
              requiredString(formData, `documentVisibility:${documentId}`),
            ) as any,
            documentStatus: requiredString(
              formData,
              `documentStatus:${documentId}`,
            ) as any,
            category: requiredString(
              formData,
              `documentCategory:${documentId}`,
            ) as any,
          },
        });
      }
      for (const category of [
        "Proclamation of Sale",
        "Conditions of Sale",
        "Title Search",
        "Valuation Report",
        "Property Photos",
        "Location Map",
        "Legal Documents",
        "Other Documents",
      ]) {
        const file = fileFromForm(formData, `documentFile:${category}`);
        if (!file) continue;
        if (!allowedDocumentTypes.has(file.type))
          validationError(
            "Campaign documents must be PDF, DOCX, JPG, PNG, or WEBP.",
          );
        const asset = await createFileAsset(tx, file, "CampaignDocument");
        const document = await tx.campaignDocument.create({
          data: {
            documentRef: makeFileRef("DOC"),
            campaignId: campaign.id,
            fileAssetId: asset.id,
            category: normalizeDocumentCategory(category) as any,
            title: file.name,
            visibility: normalizeVisibility(
              requiredString(formData, "newDocumentVisibility"),
            ) as any,
            documentStatus: requiredString(
              formData,
              "newDocumentStatus",
            ) as any,
          },
        });
        mediaAuditEvents.push(
          buildAuditData({
            action: "update",
            entityId: campaign.id,
            afterSnapshot: { documentId: document.id, fileAssetId: asset.id },
          }),
        );
      }
      for (const faqId of formData.getAll("deleteFaqId").map(String)) {
        await tx.campaignFaq.delete({ where: { id: faqId } });
      }
      for (let index = 0; index < 10; index += 1) {
        const faqQuestion = requiredString(formData, `faqQuestion:${index}`);
        const faqAnswer = requiredString(formData, `faqAnswer:${index}`);
        const faqId = requiredString(formData, `faqId:${index}`);
        const sortOrder = Number(
          formData.get(`faqSortOrder:${index}`) ?? index,
        );
        if (!faqQuestion && !faqAnswer) continue;
        if (faqId && !formData.getAll("deleteFaqId").includes(faqId)) {
          await tx.campaignFaq.update({
            where: { id: faqId },
            data: { question: faqQuestion, answer: faqAnswer, sortOrder },
          });
        } else if (!faqId) {
          await tx.campaignFaq.create({
            data: {
              campaignId: campaign.id,
              question: faqQuestion,
              answer: faqAnswer,
              sortOrder,
            },
          });
        }
      }
      if (mediaAuditEvents.length > 0)
        await tx.auditLog.createMany({ data: mediaAuditEvents });
      await tx.auditLog.create({
        data: buildAuditData({
          action: auditAction,
          entityId: campaign.id,
          beforeSnapshot: existing ?? undefined,
          afterSnapshot: campaign,
        }),
      });
      return campaign;
    });
    revalidatePath("/admin/listings");
    revalidatePath(`/admin/listings/${saved.slug}`);
    revalidatePath("/member/opportunities");
    redirectSlug = saved.slug;
  } catch (error) {
    if (error instanceof ListingFormValidationError) {
      return { errors: error.errors, fieldErrors: error.fieldErrors };
    }
    if (error instanceof ZodError) {
      return friendlyZodErrors(error);
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma listing save error", {
        code: error.code,
        meta: error.meta,
        target: error.meta?.target,
        message: error.message,
        stack: error.stack,
      });
      return {
        errors: [
          `Prisma error ${error.code}: ${error.message}`,
          `Prisma meta: ${JSON.stringify(error.meta ?? {})}`,
          `Prisma target: ${JSON.stringify(error.meta?.target ?? null)}`,
        ],
      };
    }
    console.error("Unexpected listing save error", error);
    return {
      errors: [
        "We could not save this listing right now. Please review the required fields and try again.",
      ],
    };
  }
  redirect(`/admin/listings/${redirectSlug}?saved=${savedAction}`);
}
