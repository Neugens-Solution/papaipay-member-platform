import { db } from "@/lib/db";
import type { Opportunity } from "@/lib/memberMockData";

type CampaignWithRelations = Awaited<ReturnType<typeof getMemberCampaignsRaw>>[number];

function decimalToNumber(value: unknown): number {
  if (
    value &&
    typeof value === "object" &&
    "toNumber" in value &&
    typeof value.toNumber === "function"
  ) {
    return value.toNumber();
  }

  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);

  return 0;
}

function formatDate(value: Date | null | undefined): string {
  if (!value) return "To be confirmed";

  return new Intl.DateTimeFormat("en-MY", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(value);
}

function statusToMemberStatus(status: string): Opportunity["status"] {
  if (status === "Distributed") return "closed";
  if (status === "Cancelled") return "closed";
  if (status === "Open") return "open";

  return "open";
}

function formatReturnType(returnType: string): Opportunity["returnType"] {
  if (returnType === "UpTo") return "Up To";
  if (returnType === "Fixed") return "Fixed";

  return "Target";
}

function getPrimaryImageUrl(campaign: CampaignWithRelations): string {
  const firstMedia = campaign.media[0]?.fileAsset;

  if (firstMedia) {
    return "/placeholder-property.jpg";
  }

  return "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";
}

function calculateDaysRemaining(value: Date | null | undefined): number {
  if (!value) return 0;

  const diff = value.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function toOpportunity(campaign: CampaignWithRelations): Opportunity {
  const property = campaign.propertyDetail;
  const imageUrl = getPrimaryImageUrl(campaign);
  const reservePrice = decimalToNumber(property?.reservePrice);
  const campaignTarget = decimalToNumber(campaign.campaignTarget);
  const closeDate = campaign.campaignCloseDate;

  return {
    id: campaign.id,
    slug: campaign.slug,
    title: campaign.title,
    campaignId: campaign.campaignRef,
    campaignCode: campaign.campaignCode,
    status: statusToMemberStatus(campaign.lifecycleStatus),
    imageUrl,
    gallery:
      campaign.media.length > 0
        ? campaign.media.map(() => imageUrl)
        : [imageUrl],
    galleryCount: campaign.media.length > 0 ? campaign.media.length : 1,
    location: property?.location || property?.state || "Malaysia",
    state: property?.state || "Malaysia",
    propertyType: property?.propertyType || "Property",
    assetCategory: property?.propertyType || "Residential Property",
    occupancyStatus: "To be confirmed",
    estimatedYield: `${(decimalToNumber(campaign.holdingReturnRateMonthly) * 12).toFixed(2)}% p.a.`,
    tenure: property?.tenure || "To be confirmed",
    tenureAlias: property?.tenureAlias || "N/A",
    isLaca: property?.isLaca || false,
    bumiStatus: property?.bumiStatus || "To be confirmed",
    builtUpArea: property?.builtUpArea || "To be confirmed",
    landArea: property?.landArea || "To be confirmed",
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    auctionDate: formatDate(property?.auctionDate),
    reservePrice,
    yearBuilt: "To be confirmed",
    fullAddress: property?.fullAddress || "To be confirmed",
    minimumParticipation: decimalToNumber(campaign.minimumParticipationAmount),
    maximumParticipation: decimalToNumber(campaign.maximumParticipationAmount),
    targetAmount: campaignTarget,
    collectedAmount: decimalToNumber(campaign.collectedAmountSnapshot),
    participants: 0,
    closeDate: formatDate(closeDate),
    auctionPrice: reservePrice,
    marketValue: campaignTarget || reservePrice,
    valuationDate: "To be confirmed",
    valuationReport: "To be uploaded",
    daysRemaining: calculateDaysRemaining(closeDate),
    principalProtectionEnabled: campaign.principalProtectionEnabled,
    aboutCampaign:
      campaign.content?.aboutCampaign || "Listing details will be updated soon.",
    importantInformation:
      campaign.content?.importantInformation ||
      "Please review the listing documents before participating.",
    updates: campaign.updates.map((update) => ({
      date: formatDate(update.createdAt),
      title: update.title,
      body: update.body,
    })),
    faqs: campaign.faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
    holdingReturnRate: `${decimalToNumber(campaign.holdingReturnRateMonthly)}% Monthly`,
    returnType: formatReturnType(campaign.returnType),
    maximumHoldingPeriodMonths: campaign.maximumHoldingPeriodMonths,
    principalProtectionRule:
      "If the property is not sold within 24 months, Participation Amount only will be returned.",
    documents: campaign.documents
      .map((document) => document.fileAsset?.originalFilename)
      .filter((filename): filename is string => Boolean(filename)),
    riskSummary:
      campaign.content?.riskDisclaimer ||
      "Please review all listing information before participating.",
  };
}

async function getMemberCampaignsRaw() {
  return db.campaign.findMany({
    where: {
      publishStatus: "Published",
      visibility: "MemberVisible",
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      propertyDetail: true,
      media: {
        include: {
          fileAsset: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
      content: true,
      documents: {
        include: {
          fileAsset: true,
        },
      },
      updates: true,
      faqs: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });
}

export async function getMemberCampaigns() {
  const campaigns = await getMemberCampaignsRaw();

  return campaigns.map(toOpportunity);
}

export async function getMemberCampaignBySlug(slug: string) {
  const campaign = await db.campaign.findFirst({
    where: {
      slug,
      publishStatus: "Published",
      visibility: "MemberVisible",
    },
    include: {
      propertyDetail: true,
      media: {
        include: {
          fileAsset: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
      content: true,
      documents: {
        include: {
          fileAsset: true,
        },
      },
      updates: true,
      faqs: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!campaign) return null;

  return toOpportunity(campaign);
}
