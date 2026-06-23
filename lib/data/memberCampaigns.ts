import { db } from "@/lib/db";
import {
  opportunities as demoOpportunities,
  type Opportunity,
} from "@/lib/memberMockData";
import {
  calculateDaysRemaining,
  decimalToNumber,
  formatDate,
} from "@/lib/utils/formatters";

type CampaignWithRelations = Awaited<
  ReturnType<typeof getMemberCampaignsRaw>
>[number];

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

const fallbackImageUrl =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

function fileAssetUrl(
  fileAsset?: CampaignWithRelations["media"][number]["fileAsset"] | null,
): string | null {
  if (!fileAsset) return null;
  return fileAsset.objectKey.startsWith("/")
    ? fileAsset.objectKey
    : `/${fileAsset.objectKey}`;
}

function getPrimaryImageUrl(campaign: CampaignWithRelations): string {
  return (
    fileAssetUrl(
      campaign.media.find((media) => media.mediaType === "PrimaryImage")
        ?.fileAsset,
    ) ||
    fileAssetUrl(
      campaign.media.find((media) => media.mediaType === "GalleryImage")
        ?.fileAsset,
    ) ||
    fallbackImageUrl
  );
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
    gallery: [
      imageUrl,
      ...campaign.media
        .filter((media) => media.mediaType === "GalleryImage")
        .map((media) => fileAssetUrl(media.fileAsset))
        .filter((url): url is string => Boolean(url)),
    ],
    galleryCount:
      1 +
      campaign.media.filter(
        (media) => media.mediaType === "GalleryImage" && media.fileAsset,
      ).length,
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
    reservedAmount: decimalToNumber(campaign.reservedAmountSnapshot),
    participants: campaign._count?.participations ?? 0,
    closeDate: formatDate(closeDate),
    auctionPrice: reservePrice,
    marketValue: campaignTarget || reservePrice,
    valuationDate: "To be confirmed",
    valuationReport: "To be uploaded",
    daysRemaining: calculateDaysRemaining(closeDate),
    principalProtectionEnabled: campaign.principalProtectionEnabled,
    aboutCampaign:
      campaign.content?.aboutCampaign ||
      "Listing details will be updated soon.",
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
  if (!process.env.DATABASE_URL) return [];

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
      _count: { select: { participations: true } },
    },
  });
}

function demoCampaignBySlug(slug: string) {
  return demoOpportunities.find((campaign) => campaign.slug === slug) ?? null;
}

export async function getMemberCampaigns() {
  try {
    const campaigns = await getMemberCampaignsRaw();

    if (campaigns.length === 0 && !process.env.DATABASE_URL) {
      return demoOpportunities;
    }

    return campaigns.map(toOpportunity);
  } catch (error) {
    console.warn(
      "Falling back to demo member campaigns because database reads are unavailable.",
      error,
    );
    return demoOpportunities;
  }
}

export async function getMemberCampaignBySlug(slug: string) {
  if (!process.env.DATABASE_URL) return demoCampaignBySlug(slug);

  try {
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
        _count: { select: { participations: true } },
      },
    });

    if (!campaign) return null;

    return toOpportunity(campaign);
  } catch (error) {
    console.warn(
      "Falling back to demo member campaign because database reads are unavailable.",
      error,
    );
    return demoCampaignBySlug(slug);
  }
}
