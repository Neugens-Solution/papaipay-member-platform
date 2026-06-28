import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { buildListingAuditData } from "../audit";
import { decimalOrZero, optionalDate, requiredString, WorkspaceValidationError, type WorkspaceModuleResult } from "../types";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 140);
}

async function makeUniqueSlug(title: string, currentCampaignId?: string) {
  const base = slugify(title) || `listing-${Date.now()}`;
  let candidate = base;
  let suffix = 2;
  while (true) {
    const existing = await db.campaign.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing || existing.id === currentCampaignId) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

function makeCampaignRef() {
  return `CMP-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
}
function makeCampaignCode(title: string) {
  const prefix = title.toUpperCase().replace(/[^A-Z0-9]+/g, "").slice(0, 4).padEnd(4, "X");
  return `${prefix}-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export async function saveOverviewModule(formData: FormData): Promise<WorkspaceModuleResult> {
  const campaignId = requiredString(formData, "campaignId") || undefined;
  const title = requiredString(formData, "title") || "Untitled Listing";
  const aboutCampaign = requiredString(formData, "aboutCampaign");
  const fieldErrors: Record<string, string> = {};
  if (title.trim().length < 3) fieldErrors.title = "Please complete Listing Title.";
  if (aboutCampaign.trim().length < 10) fieldErrors.aboutCampaign = "Please complete Short Description.";
  if (Object.keys(fieldErrors).length) throw new WorkspaceValidationError("Please complete the overview fields.", fieldErrors);

  const slug = await makeUniqueSlug(title, campaignId);
  const openDate = optionalDate(formData, "campaignOpenDate");
  const closeDate = optionalDate(formData, "campaignCloseDate");

  const saved = await db.$transaction(async (tx) => {
    const existing = campaignId ? await tx.campaign.findUnique({ where: { id: campaignId }, include: { content: true } }) : null;
    const campaign = existing
      ? await tx.campaign.update({
          where: { id: existing.id },
          data: { title, slug, campaignOpenDate: openDate, campaignCloseDate: closeDate },
        })
      : await tx.campaign.create({
          data: {
            campaignRef: makeCampaignRef(),
            campaignCode: makeCampaignCode(title),
            title,
            slug,
            lifecycleStatus: "Draft",
            publishStatus: "Draft",
            visibility: "InternalOnly",
            campaignTarget: decimalOrZero(undefined),
            minimumParticipationAmount: decimalOrZero(undefined),
            maximumParticipationAmount: decimalOrZero(undefined),
            campaignOpenDate: openDate,
            campaignCloseDate: closeDate,
            holdingReturnRateMonthly: decimalOrZero(undefined),
            returnType: "Target",
          },
        });

    await tx.campaignContent.upsert({
      where: { campaignId: campaign.id },
      update: { aboutCampaign },
      create: { campaignId: campaign.id, aboutCampaign },
    });

    await tx.auditLog.create({
      data: buildListingAuditData({
        action: "listing.overview.saved",
        entityId: campaign.id,
        beforeSnapshot: existing ?? undefined,
        afterSnapshot: { id: campaign.id, title: campaign.title, slug: campaign.slug },
      }),
    });
    return campaign;
  });

  return { ok: true, status: "saved", message: "Overview saved.", updatedAt: saved.updatedAt.toISOString(), redirectTo: `/admin/listings/${saved.slug}/edit?saved=overview` };
}
