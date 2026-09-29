/**
 * Turns the "K Asset Ventures - Listing Import Template" Google Sheet into
 * validated listing drafts. Pure functions: no database or network access.
 */

export const IMPORT_TABS = {
  listings: "Import Listings",
  faqs: "Campaign FAQ",
  timeline: "Campaign Timeline",
} as const;

export type ImportedFaq = { question: string; answer: string; sortOrder: number };
export type ImportedTimelineEvent = {
  title: string;
  description: string | null;
  eventDate: string | null; // yyyy-mm-dd
  visibility: "InternalOnly" | "MemberVisible" | "ParticipantsOnly";
  sortOrder: number;
};

export type ImportedListing = {
  rowNumber: number;
  sourcePdf: string | null;
  campaignCode: string | null;
  title: string;
  campaign: {
    campaignTarget: number;
    minimumParticipationAmount: number;
    maximumParticipationAmount: number;
    campaignOpenDate: string | null;
    campaignCloseDate: string | null;
    holdingReturnRateMonthly: number;
    returnType: "Fixed" | "Target" | "UpTo";
    maximumHoldingPeriodMonths: number;
    principalProtectionEnabled: boolean;
    memberProfitDistributionPercentagePlanned: number | null;
    platformProfitSharePercentagePlanned: number | null;
  };
  property: {
    propertyType: string;
    assetCategory: string | null;
    occupancyStatus: string | null;
    tenure: "Freehold" | "Leasehold";
    tenureAlias: "FH" | "LH";
    isLaca: boolean;
    bumiStatus: "Bumi" | "NonBumi" | "OpenMarket";
    builtUpArea: string | null;
    bedrooms: number | null;
    bathrooms: number | null;
    auctionDate: string | null; // ISO
    reservePrice: number | null;
    state: string;
    location: string;
    fullAddress: string;
    yearBuilt: string | null;
  } | null;
  content: {
    aboutCampaign: string;
    importantInformation: string | null;
    riskDisclaimer: string | null;
    holdingReturnExplanation: string | null;
    finalDistributionExplanation: string | null;
  };
  faqs: ImportedFaq[];
  timeline: ImportedTimelineEvent[];
  /** Links that must be uploaded manually (Drive files are not downloaded). */
  manualAssets: string[];
  errors: string[];
  warnings: string[];
};

// Placeholders and spreadsheet errors are treated as "not provided".
const EMPTY_MARKERS = /^(belum disediakan|auto[- ]?generate|auto|tbc|tba|n\/a|na|-|—|#value!|#ref!|#n\/a|#name\?|#div\/0!|#error!|#num!|#null!)$/i;

function clean(value: string | undefined) {
  const text = (value ?? "").trim();
  return EMPTY_MARKERS.test(text) ? "" : text;
}

function isSpreadsheetError(value: string | undefined) {
  return /^#(value!|ref!|n\/a|name\?|div\/0!|error!|num!|null!)$/i.test((value ?? "").trim());
}

/** Finds the header row (the first row containing `marker`) and maps later rows by header name. */
export function rowsByHeader(values: string[][] | null | undefined, marker: string) {
  if (!values) return [];
  const headerIndex = values.findIndex((row) => row.some((cell) => cell.trim() === marker));
  if (headerIndex < 0) return [];
  const headers = values[headerIndex].map((cell) => cell.trim());
  return values.slice(headerIndex + 1).map((row, offset) => {
    const record: Record<string, string> = {};
    headers.forEach((header, column) => {
      if (header) record[header] = row[column] ?? "";
    });
    return { rowNumber: headerIndex + offset + 2, record };
  });
}

function parseMoney(raw: string | undefined) {
  const text = clean(raw).replace(/^rm\s*/i, "").replace(/[,\s]/g, "");
  if (!text) return null;
  const numeric = Number(text);
  return Number.isFinite(numeric) ? numeric : Number.NaN;
}

function parsePercent(raw: string | undefined) {
  const text = clean(raw).replace(/%$/, "").trim();
  if (!text) return null;
  const numeric = Number(text.replace(/,/g, ""));
  return Number.isFinite(numeric) ? numeric : Number.NaN;
}

function parseInteger(raw: string | undefined) {
  const text = clean(raw).replace(/,/g, "");
  if (!text) return null;
  const match = text.match(/^\d+/);
  return match ? Number(match[0]) : Number.NaN;
}

const MONTHS: Record<string, number> = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, mei: 5, jun: 6, jul: 7, aug: 8, ogo: 8, sep: 9, oct: 10, okt: 10, nov: 11, dec: 12, dis: 12 };

/** Accepts yyyy-mm-dd, dd/mm/yyyy, dd-mm-yyyy and "26 Aug 2026"; returns yyyy-mm-dd. */
export function parseDate(raw: string | undefined): string | null | "invalid" {
  const text = clean(raw);
  if (!text) return null;
  let y: number, m: number, d: number;
  let match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (match) [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  else if ((match = text.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/))) [d, m, y] = [Number(match[1]), Number(match[2]), Number(match[3])];
  else if ((match = text.match(/^(\d{1,2})\s+([a-zA-Z]{3})[a-zA-Z]*\s+(\d{4})/)) && MONTHS[match[2].toLowerCase()]) {
    [d, m, y] = [Number(match[1]), MONTHS[match[2].toLowerCase()], Number(match[3])];
  } else return "invalid";
  const date = new Date(Date.UTC(y, m - 1, d));
  if (date.getUTCFullYear() !== y || date.getUTCMonth() !== m - 1 || date.getUTCDate() !== d) return "invalid";
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/** Date plus optional "HH:mm" (Malaysia time) → ISO string. */
function parseDateTime(raw: string | undefined): string | null | "invalid" {
  const date = parseDate(raw);
  if (date === null || date === "invalid") return date;
  const time = clean(raw).match(/(\d{1,2}):(\d{2})/);
  const hours = time ? Number(time[1]) : 0;
  const minutes = time ? Number(time[2]) : 0;
  return new Date(`${date}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+08:00`).toISOString();
}

function parseBoolean(raw: string | undefined) {
  const text = clean(raw).toLowerCase();
  if (!text) return null;
  if (["yes", "ya", "y", "true", "1", "enabled"].includes(text)) return true;
  if (["no", "tidak", "n", "false", "0", "disabled"].includes(text)) return false;
  return undefined;
}

function parseTenure(raw: string | undefined) {
  const text = clean(raw).toLowerCase();
  if (!text) return null;
  if (text.startsWith("free") || text === "fh" || text.includes("kekal")) return "Freehold" as const;
  if (text.startsWith("lease") || text === "lh" || text.includes("pajak")) return "Leasehold" as const;
  return undefined;
}

function parseBumi(raw: string | undefined) {
  const text = clean(raw).toLowerCase().replace(/[\s_-]/g, "");
  if (!text) return null;
  if (text.startsWith("non")) return "NonBumi" as const;
  if (text.startsWith("bumi")) return "Bumi" as const;
  if (text.startsWith("open")) return "OpenMarket" as const;
  return undefined;
}

function parseReturnType(raw: string | undefined) {
  const text = clean(raw).toLowerCase().replace(/[\s_-]/g, "");
  if (!text) return null;
  if (text === "fixed") return "Fixed" as const;
  if (text === "target") return "Target" as const;
  if (text === "upto") return "UpTo" as const;
  return undefined;
}

function parseVisibility(raw: string | undefined) {
  const text = clean(raw).toLowerCase().replace(/[\s_-]/g, "");
  if (text === "internalonly") return "InternalOnly" as const;
  if (text === "participantsonly") return "ParticipantsOnly" as const;
  return "MemberVisible" as const;
}

function normalizeTitle(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function parseListingImport(tabs: Record<string, string[][] | null>): { listings: ImportedListing[]; notices: string[] } {
  const notices: string[] = [];
  if (!tabs[IMPORT_TABS.listings]) {
    return { listings: [], notices: [`Tab "${IMPORT_TABS.listings}" was not found in this Google Sheet.`] };
  }
  const listingRows = rowsByHeader(tabs[IMPORT_TABS.listings], "campaign_code");
  if (!listingRows.length) notices.push(`Tab "${IMPORT_TABS.listings}" has no header row with "campaign_code".`);
  if (!tabs[IMPORT_TABS.faqs]) notices.push(`Tab "${IMPORT_TABS.faqs}" not found — FAQs will not be imported.`);
  if (!tabs[IMPORT_TABS.timeline]) notices.push(`Tab "${IMPORT_TABS.timeline}" not found — timeline will not be imported.`);

  const faqsByTitle = new Map<string, ImportedFaq[]>();
  for (const { record } of rowsByHeader(tabs[IMPORT_TABS.faqs], "question")) {
    const question = clean(record.question);
    const answer = clean(record.answer);
    const key = normalizeTitle(clean(record.campaign_title));
    if (!key || !question || !answer) continue; // unanswered FAQs are skipped
    const list = faqsByTitle.get(key) ?? [];
    list.push({ question, answer, sortOrder: parseInteger(record.sort_order) || list.length + 1 });
    faqsByTitle.set(key, list);
  }

  const timelineByTitle = new Map<string, ImportedTimelineEvent[]>();
  for (const { record } of rowsByHeader(tabs[IMPORT_TABS.timeline], "milestone_title")) {
    const title = clean(record.milestone_title);
    const key = normalizeTitle(clean(record.campaign_title));
    if (!key || !title) continue;
    const eventDate = parseDate(record.event_date);
    const list = timelineByTitle.get(key) ?? [];
    list.push({
      title,
      description: clean(record.description) || null,
      eventDate: eventDate === "invalid" ? null : eventDate,
      visibility: parseVisibility(record.visibility),
      sortOrder: parseInteger(record.sort_order) || list.length + 1,
    });
    timelineByTitle.set(key, list);
  }

  const listings: ImportedListing[] = [];
  const seenTitles = new Set<string>();
  const seenCodes = new Set<string>();

  for (const { rowNumber, record } of listingRows) {
    const title = clean(record.title);
    if (!title) continue; // blank row
    const errors: string[] = [];
    const warnings: string[] = [];

    const titleKey = normalizeTitle(title);
    if (seenTitles.has(titleKey)) errors.push("Duplicate title in this sheet.");
    seenTitles.add(titleKey);
    const campaignCode = clean(record.campaign_code) || null;
    if (campaignCode) {
      if (seenCodes.has(campaignCode.toUpperCase())) errors.push("Duplicate campaign_code in this sheet.");
      seenCodes.add(campaignCode.toUpperCase());
    }

    for (const [column, value] of Object.entries(record)) {
      if (isSpreadsheetError(value)) warnings.push(`${column} shows a spreadsheet error (${value.trim()}); treated as empty.`);
    }

    const money = (column: string, label: string, required: boolean) => {
      const value = parseMoney(record[column]);
      if (Number.isNaN(value)) {
        errors.push(`${label} (${column}) is not a valid amount: "${record[column]}".`);
        return 0;
      }
      if (value === null) {
        if (required) warnings.push(`${label} (${column}) is empty — set it before publishing.`);
        return required ? 0 : null;
      }
      if (value < 0) errors.push(`${label} (${column}) cannot be negative.`);
      return value;
    };
    const percent = (column: string, label: string) => {
      const value = parsePercent(record[column]);
      if (Number.isNaN(value)) {
        errors.push(`${label} (${column}) is not a valid percentage: "${record[column]}".`);
        return null;
      }
      if (value !== null && (value < 0 || value > 100)) errors.push(`${label} (${column}) must be between 0 and 100.`);
      return value;
    };
    const date = (column: string, label: string) => {
      const value = parseDate(record[column]);
      if (value === "invalid") {
        errors.push(`${label} (${column}) is not a valid date: "${record[column]}". Use yyyy-mm-dd.`);
        return null;
      }
      return value;
    };

    const campaignTarget = money("campaign_target_rm", "Campaign target", true) ?? 0;
    const minimumParticipationAmount = money("minimum_participation_rm", "Minimum participation", true) ?? 0;
    const maximumParticipationAmount = money("maximum_participation_rm", "Maximum participation", true) ?? 0;
    if (minimumParticipationAmount && maximumParticipationAmount && minimumParticipationAmount > maximumParticipationAmount) {
      errors.push("Minimum participation is greater than maximum participation.");
    }
    const campaignOpenDate = date("campaign_open_date", "Open date");
    const campaignCloseDate = date("campaign_close_date", "Close date");
    if (campaignOpenDate && campaignCloseDate && campaignOpenDate > campaignCloseDate) errors.push("Open date is after close date.");

    const holdingRate = percent("holding_return_rate_monthly", "Holding return rate");
    if (holdingRate === null) warnings.push("Holding return rate is empty — set it before publishing.");
    const returnType = parseReturnType(record.return_type);
    if (returnType === undefined) errors.push(`return_type must be Fixed, Target or Up To (got "${record.return_type}").`);
    const maxMonths = parseInteger(record.maximum_holding_period_months);
    if (Number.isNaN(maxMonths)) errors.push("maximum_holding_period_months must be a whole number.");
    const protection = parseBoolean(record.principal_protection_enabled);
    if (protection === undefined) errors.push("principal_protection_enabled must be Yes or No.");
    const memberPct = percent("member_profit_distribution_pct", "Member profit %");
    let platformPct = percent("platform_profit_share_pct", "Platform profit %");
    if (memberPct !== null && platformPct === null) platformPct = Math.round((100 - memberPct) * 10000) / 10000;
    if (memberPct !== null && platformPct !== null && Math.abs(memberPct + platformPct - 100) > 0.0001) {
      errors.push(`Member % (${memberPct}) and platform % (${platformPct}) must add up to 100.`);
    }

    const sheetStatus = [clean(record.lifecycle_status), clean(record.publish_status)].filter(Boolean).join(" / ");
    if (sheetStatus && !/^draft( \/ draft)?$/i.test(sheetStatus)) {
      warnings.push(`Sheet status "${sheetStatus}" ignored — imported listings always start as Draft.`);
    }

    // Property
    const tenure = parseTenure(record.tenure) ?? parseTenure(record.tenure_alias);
    if (tenure === undefined) errors.push(`tenure must be Freehold or Leasehold (got "${record.tenure}").`);
    const bumiStatus = parseBumi(record.bumi_status);
    if (bumiStatus === undefined) errors.push(`bumi_status must be Bumi, Non Bumi or Open Market (got "${record.bumi_status}").`);
    const isLaca = parseBoolean(record.is_laca);
    if (isLaca === undefined) errors.push("is_laca must be Yes or No.");
    const bedrooms = parseInteger(record.bedrooms);
    const bathrooms = parseInteger(record.bathrooms);
    if (Number.isNaN(bedrooms)) errors.push("bedrooms must be a number.");
    if (Number.isNaN(bathrooms)) errors.push("bathrooms must be a number.");
    const auctionDate = parseDateTime(record.auction_date_time);
    if (auctionDate === "invalid") errors.push(`auction_date_time is not a valid date: "${record.auction_date_time}".`);
    const reservePrice = money("reserve_price_rm", "Reserve price", false);
    const builtUp = clean(record.built_up_sq_ft);

    const propertyType = clean(record.property_type);
    const state = clean(record.state);
    const location = clean(record.location);
    const fullAddress = clean(record.full_address);
    const missingProperty = Object.entries({ property_type: propertyType, state, location, full_address: fullAddress })
      .filter(([, value]) => !value)
      .map(([key]) => key);
    let property: ImportedListing["property"] = null;
    if (missingProperty.length) {
      warnings.push(`Property step skipped — missing ${missingProperty.join(", ")}. Complete it in the listing form.`);
    } else {
      const resolvedTenure = tenure ?? "Freehold";
      if (!tenure) warnings.push("tenure is empty — defaulted to Freehold.");
      if (!bumiStatus) warnings.push("bumi_status is empty — defaulted to Open Market.");
      property = {
        propertyType,
        assetCategory: clean(record.asset_category) || null,
        occupancyStatus: clean(record.occupancy_status) || null,
        tenure: resolvedTenure,
        tenureAlias: resolvedTenure === "Freehold" ? "FH" : "LH",
        isLaca: isLaca ?? false,
        bumiStatus: bumiStatus ?? "OpenMarket",
        builtUpArea: builtUp ? (/sq/i.test(builtUp) ? builtUp : `${builtUp} sq ft`) : null,
        bedrooms: Number.isNaN(bedrooms) ? null : bedrooms,
        bathrooms: Number.isNaN(bathrooms) ? null : bathrooms,
        auctionDate: auctionDate === "invalid" ? null : auctionDate,
        reservePrice: typeof reservePrice === "number" ? reservePrice : null,
        state,
        location,
        fullAddress,
        yearBuilt: clean(record.year_built) || null,
      };
    }

    const aboutCampaign = clean(record.about_campaign);
    if (aboutCampaign.length < 10) warnings.push("about_campaign is empty or too short — complete the Overview description.");
    const bedroomNote = clean(record.bedroom_note);

    const manualAssets = [
      ["Images folder", record.image_drive_folder_url],
      ["Primary image", record.primary_image],
      ["Gallery images", record.gallery_images],
      ["Floor plan", record.floor_plan_drive_url],
      ["Property video", record.property_video_url],
      ["Proclamation of sale PDF", record.pos_pdf_drive_url],
      ["Valuation report", record.valuation_report_drive_url],
      ["Title search", record.title_search_drive_url],
      ["Supporting documents", record.supporting_documents],
    ]
      .map(([label, value]) => [label, clean(value)] as const)
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`);

    const importantInformation = [clean(record.important_information), bedroomNote ? `Bedrooms: ${bedroomNote}` : ""].filter(Boolean).join("\n\n");

    listings.push({
      rowNumber,
      sourcePdf: clean(record.source_pdf) || null,
      campaignCode,
      title,
      campaign: {
        campaignTarget,
        minimumParticipationAmount,
        maximumParticipationAmount,
        campaignOpenDate,
        campaignCloseDate,
        holdingReturnRateMonthly: holdingRate && !Number.isNaN(holdingRate) ? holdingRate : 0,
        returnType: returnType ?? "Target",
        maximumHoldingPeriodMonths: maxMonths && !Number.isNaN(maxMonths) ? maxMonths : 24,
        principalProtectionEnabled: protection ?? true,
        memberProfitDistributionPercentagePlanned: memberPct,
        platformProfitSharePercentagePlanned: platformPct,
      },
      property,
      content: {
        aboutCampaign,
        importantInformation: importantInformation || null,
        riskDisclaimer: clean(record.risk_disclaimer) || null,
        holdingReturnExplanation: clean(record.holding_return_explanation) || null,
        finalDistributionExplanation: clean(record.final_distribution_explanation) || null,
      },
      faqs: faqsByTitle.get(titleKey) ?? [],
      timeline: timelineByTitle.get(titleKey) ?? [],
      manualAssets,
      errors,
      warnings,
    });
  }

  if (listingRows.length && !listings.length) notices.push("No listing rows with a title were found.");
  return { listings, notices };
}
