"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  createAdminAuditEntry,
  type AdminAuditAction,
} from "@/lib/audit/adminAudit";
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
function makeCampaignRef() {
  return `CMP-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
}
function makeCampaignCode(title: string) {
  const prefix = title
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "")
    .slice(0, 4)
    .padEnd(4, "X");
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}
function makeAuditRef() {
  return `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}
function buildInput(
  formData: FormData,
  action: string,
  generated: { campaignCode: string; slug: string },
) {
  return listingDraftSchema.parse({
    title: requiredString(formData, "title"),
    campaignCode: generated.campaignCode,
    slug: generated.slug,
    lifecycleStatus: action === "publish" ? "Open" : "Draft",
    publishStatus: action === "publish" ? "Published" : "Draft",
    visibility:
      action === "publish"
        ? "MemberVisible"
        : requiredString(formData, "visibility") || "InternalOnly",
    campaignTarget: formData.get("campaignTarget"),
    minimumParticipationAmount: formData.get("minimumParticipationAmount"),
    maximumParticipationAmount: formData.get("maximumParticipationAmount"),
    campaignOpenDate: optionalDate(formData, "campaignOpenDate"),
    campaignCloseDate: optionalDate(formData, "campaignCloseDate"),
    holdingReturnRateMonthly: formData.get("holdingReturnRateMonthly"),
    returnType: requiredString(formData, "returnType"),
    maximumHoldingPeriodMonths: formData.get("maximumHoldingPeriodMonths"),
    principalProtectionEnabled: checkboxBoolean(
      formData,
      "principalProtectionEnabled",
    ),
    property: {
      propertyType: requiredString(formData, "propertyType"),
      tenure: requiredString(formData, "tenure"),
      tenureAlias:
        requiredString(formData, "tenure") === "Freehold" ? "FH" : "LH",
      isLaca: checkboxBoolean(formData, "isLaca"),
      bumiStatus: requiredString(formData, "bumiStatus"),
      builtUpArea: requiredString(formData, "builtUpArea"),
      landArea: requiredString(formData, "landArea"),
      bedrooms: formData.get("bedrooms") || undefined,
      bathrooms: formData.get("bathrooms") || undefined,
      auctionDate: optionalDate(formData, "auctionDate"),
      reservePrice: formData.get("reservePrice") || undefined,
      state: requiredString(formData, "state"),
      location: requiredString(formData, "location"),
      fullAddress: requiredString(formData, "fullAddress"),
      yearBuilt: requiredString(formData, "yearBuilt"),
    },
    content: {
      aboutCampaign: requiredString(formData, "aboutCampaign"),
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
export async function saveListingAction(formData: FormData) {
  const action = requiredString(formData, "intent");
  const campaignId = requiredString(formData, "campaignId") || undefined;
  const existing = campaignId
    ? await db.campaign.findUnique({
        where: { id: campaignId },
        include: { propertyDetail: true, content: true },
      })
    : null;
  const input = buildInput(formData, action, {
    campaignCode:
      existing?.campaignCode ||
      makeCampaignCode(requiredString(formData, "title")),
    slug: await makeUniqueSlug(requiredString(formData, "title"), campaignId),
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
            campaignRef: makeCampaignRef(),
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
    await tx.auditLog.create({
      data: {
        ...createAdminAuditEntry({
          action: auditAction,
          entityType: "Campaign",
          entityId: campaign.id,
          beforeSnapshot: existing as Prisma.InputJsonValue,
          afterSnapshot: campaign as Prisma.InputJsonValue,
        }),
        auditRef: makeAuditRef(),
      },
    });
    return campaign;
  });
  revalidatePath("/admin/listings");
  revalidatePath(`/admin/listings/${saved.slug}`);
  revalidatePath("/member/opportunities");
  redirect(`/admin/listings/${saved.slug}`);
}
