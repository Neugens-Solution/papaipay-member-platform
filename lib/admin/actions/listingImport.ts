"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdminPermission } from "@/lib/auth/guards";
import { GoogleSheetsError, parseSpreadsheetId, readSheetTabs, serviceAccountEmail } from "@/lib/google/sheets";
import { IMPORT_TABS, parseListingImport, type ImportedListing } from "@/lib/admin/listing-import/parse";
import { buildListingAuditData } from "@/lib/admin/listings/workspace/audit";
import { makeCampaignCode, makeCampaignRef, makeUniqueSlug } from "@/lib/admin/listings/workspace/modules/overview";

export type ListingImportPreviewRow = ImportedListing & { existingSlug: string | null };

export type ListingImportState = {
  status: "idle" | "preview" | "imported" | "error";
  message: string | null;
  sheetUrl: string;
  notices: string[];
  rows: ListingImportPreviewRow[];
  results: { rowNumber: number; title: string; ok: boolean; message: string; slug?: string }[];
  serviceAccountEmail: string | null;
};

function baseState(sheetUrl: string): ListingImportState {
  return { status: "idle", message: null, sheetUrl, notices: [], rows: [], results: [], serviceAccountEmail: serviceAccountEmail() };
}

async function loadRows(sheetUrl: string) {
  const spreadsheetId = parseSpreadsheetId(sheetUrl);
  if (!spreadsheetId) throw new GoogleSheetsError("Paste a Google Sheets link (https://docs.google.com/spreadsheets/d/...).");
  const tabs = await readSheetTabs(spreadsheetId, Object.values(IMPORT_TABS));
  const { listings, notices } = parseListingImport(tabs);

  // Flag rows that already exist so they are not imported twice.
  const existing = await db.campaign.findMany({
    where: {
      OR: [
        { title: { in: listings.map((row) => row.title), mode: "insensitive" } },
        { campaignCode: { in: listings.map((row) => row.campaignCode).filter((code): code is string => Boolean(code)) } },
      ],
    },
    select: { title: true, campaignCode: true, slug: true },
  });
  const rows: ListingImportPreviewRow[] = listings.map((row) => {
    const match = existing.find(
      (campaign) =>
        campaign.title.trim().toLowerCase() === row.title.trim().toLowerCase() ||
        (row.campaignCode && campaign.campaignCode === row.campaignCode),
    );
    return match
      ? { ...row, existingSlug: match.slug, errors: [...row.errors, `A listing with this title or code already exists (${match.slug}).`] }
      : { ...row, existingSlug: null };
  });
  return { rows, notices };
}

function errorState(sheetUrl: string, error: unknown): ListingImportState {
  const message =
    error instanceof GoogleSheetsError
      ? error.message
      : "Could not read the Google Sheet. Check the link and try again.";
  if (!(error instanceof GoogleSheetsError)) console.error("Listing import failed", error);
  return { ...baseState(sheetUrl), status: "error", message };
}

export async function previewListingImportAction(_previous: ListingImportState, formData: FormData): Promise<ListingImportState> {
  await requireAdminPermission("listing.manage");
  const sheetUrl = String(formData.get("sheetUrl") ?? "").trim();
  try {
    const { rows, notices } = await loadRows(sheetUrl);
    const importable = rows.filter((row) => !row.errors.length).length;
    return {
      ...baseState(sheetUrl),
      status: "preview",
      message: `${rows.length} listing row(s) found, ${importable} ready to import.`,
      notices,
      rows,
    };
  } catch (error) {
    return errorState(sheetUrl, error);
  }
}

function toDate(value: string | null) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

async function createListing(row: ImportedListing, actorId: string) {
  const slug = await makeUniqueSlug(row.title);
  return db.$transaction(async (tx) => {
    const campaign = await tx.campaign.create({
      data: {
        campaignRef: makeCampaignRef(),
        campaignCode: row.campaignCode || makeCampaignCode(row.title),
        title: row.title,
        slug,
        lifecycleStatus: "Draft",
        publishStatus: "Draft",
        visibility: "InternalOnly",
        campaignTarget: new Prisma.Decimal(row.campaign.campaignTarget),
        minimumParticipationAmount: new Prisma.Decimal(row.campaign.minimumParticipationAmount),
        maximumParticipationAmount: new Prisma.Decimal(row.campaign.maximumParticipationAmount),
        campaignOpenDate: toDate(row.campaign.campaignOpenDate),
        campaignCloseDate: toDate(row.campaign.campaignCloseDate),
        holdingReturnRateMonthly: new Prisma.Decimal(row.campaign.holdingReturnRateMonthly),
        returnType: row.campaign.returnType,
        maximumHoldingPeriodMonths: row.campaign.maximumHoldingPeriodMonths,
        principalProtectionEnabled: row.campaign.principalProtectionEnabled,
        memberProfitDistributionPercentagePlanned:
          row.campaign.memberProfitDistributionPercentagePlanned === null ? null : new Prisma.Decimal(row.campaign.memberProfitDistributionPercentagePlanned),
        platformProfitSharePercentagePlanned:
          row.campaign.platformProfitSharePercentagePlanned === null ? null : new Prisma.Decimal(row.campaign.platformProfitSharePercentagePlanned),
        createdById: actorId,
        updatedById: actorId,
      },
    });

    await tx.campaignContent.create({ data: { campaignId: campaign.id, ...row.content } });

    if (row.property) {
      await tx.propertyDetail.create({
        data: {
          campaignId: campaign.id,
          ...row.property,
          auctionDate: row.property.auctionDate ? new Date(row.property.auctionDate) : null,
          reservePrice: row.property.reservePrice === null ? null : new Prisma.Decimal(row.property.reservePrice),
          resalePrice: row.property.resalePrice === null ? null : new Prisma.Decimal(row.property.resalePrice),
        },
      });
    }

    if (row.faqs.length) {
      await tx.campaignFaq.createMany({
        data: row.faqs.map((faq) => ({ campaignId: campaign.id, question: faq.question, answer: faq.answer, sortOrder: faq.sortOrder })),
      });
    }
    if (row.timeline.length) {
      await tx.campaignTimelineEvent.createMany({
        data: row.timeline.map((event) => ({
          campaignId: campaign.id,
          title: event.title,
          description: event.description,
          eventDate: toDate(event.eventDate),
          visibility: event.visibility,
        })),
      });
    }

    await tx.auditLog.create({
      data: buildListingAuditData({
        action: "listing.imported",
        entityId: campaign.id,
        actorId,
        afterSnapshot: { source: "google-sheet", rowNumber: row.rowNumber, sourcePdf: row.sourcePdf, slug, warnings: row.warnings },
      }),
    });
    return campaign;
  });
}

export async function importListingsAction(_previous: ListingImportState, formData: FormData): Promise<ListingImportState> {
  const { user } = await requireAdminPermission("listing.manage");
  const sheetUrl = String(formData.get("sheetUrl") ?? "").trim();
  const selected = new Set(formData.getAll("rowNumber").map((value) => Number(value)));
  if (!selected.size) return { ...baseState(sheetUrl), status: "error", message: "Select at least one row to import." };

  try {
    // Re-read the sheet on the server; never trust row data posted from the browser.
    const { rows, notices } = await loadRows(sheetUrl);
    const results: ListingImportState["results"] = [];
    for (const row of rows.filter((candidate) => selected.has(candidate.rowNumber))) {
      if (row.errors.length) {
        results.push({ rowNumber: row.rowNumber, title: row.title, ok: false, message: row.errors.join(" ") });
        continue;
      }
      try {
        const campaign = await createListing(row, user.id);
        results.push({ rowNumber: row.rowNumber, title: row.title, ok: true, message: "Created as Draft.", slug: campaign.slug });
      } catch (error) {
        console.error("Listing import row failed", { rowNumber: row.rowNumber, error });
        const duplicate = error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
        results.push({
          rowNumber: row.rowNumber,
          title: row.title,
          ok: false,
          message: duplicate ? "campaign_code or slug already exists." : "Could not save this listing.",
        });
      }
    }
    revalidatePath("/admin/listings");
    const created = results.filter((result) => result.ok).length;
    return {
      ...baseState(sheetUrl),
      status: "imported",
      message: `${created} of ${results.length} listing(s) created as Draft.`,
      notices,
      rows: await loadRows(sheetUrl).then((fresh) => fresh.rows).catch(() => rows),
      results,
    };
  } catch (error) {
    return errorState(sheetUrl, error);
  }
}

/** Single entry point for the import page: `intent` is "preview" or "import". */
export async function listingImportAction(previous: ListingImportState, formData: FormData): Promise<ListingImportState> {
  return formData.get("intent") === "import" ? importListingsAction(previous, formData) : previewListingImportAction(previous, formData);
}
