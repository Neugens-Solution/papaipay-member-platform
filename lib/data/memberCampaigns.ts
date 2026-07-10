import { DocumentStatus, FileVisibility, Visibility } from "@prisma/client";
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
import { fileAssetPublicUrl } from "@/lib/storage/fileAssetUrl";

type CampaignWithRelations = Awaited<
  ReturnType<typeof getMemberCampaignsRaw>
>[number];

type MemberFileAsset = {
  bucket?: string | null;
  objectKey?: string | null;
  visibility?: string | null;
} | null | undefined;

const MEMBER_ACCESSIBLE_FILE_VISIBILITIES = [FileVisibility.Public, FileVisibility.Authenticated] as const;
const MEMBER_DOCUMENT_STATUSES = [DocumentStatus.Published, DocumentStatus.Ready] as const;

function shouldUseDemoDataFallback() {
  return process.env.NODE_ENV !== "production" && !process.env.DATABASE_URL;
}

function assertProductionDatabaseConfigured() {
  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be configured for member listing data in production.");
  }
}

function memberAccessibleDocumentWhere() {
  return {
    visibility: Visibility.MemberVisible,
    documentStatus: { in: [...MEMBER_DOCUMENT_STATUSES] },
    fileAsset: { is: { visibility: { in: [...MEMBER_ACCESSIBLE_FILE_VISIBILITIES] } } },
  };
}

function canMemberAccessFileAsset(fileAsset: MemberFileAsset) {
  return Boolean(
    fileAsset?.visibility &&
      MEMBER_ACCESSIBLE_FILE_VISIBILITIES.includes(
        fileAsset.visibility as (typeof MEMBER_ACCESSIBLE_FILE_VISIBILITIES)[number],
      ),
  );
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

function fileAssetUrl(fileAsset?: MemberFileAsset): string | null {
  if (!canMemberAccessFileAsset(fileAsset)) return null;
  return fileAssetPublicUrl(fileAsset);
}

function getPrimaryImageUrl(campaign: CampaignWithRelations): string | null {
  return (
    fileAssetUrl(
      campaign.media.find((media) => media.mediaType === "PrimaryImage")
        ?.fileAsset,
    ) ||
    fileAssetUrl(
      campaign.media.find((media) => media.mediaType === "GalleryImage")
        ?.fileAsset,
    )
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
    ].filter((url): url is string => Boolean(url)),
    galleryCount: [
      imageUrl,
      ...campaign.media
        .filter((media) => media.mediaType === "GalleryImage")
        .map((media) => fileAssetUrl(media.fileAsset)),
    ].filter(Boolean).length,
    location: property?.location || property?.state || "Malaysia",
    state: property?.state || "Malaysia",
    propertyType: property?.propertyType || "Asset",
    assetCategory:
      property?.assetCategory || property?.propertyType || "Residential Asset",
    occupancyStatus: property?.occupancyStatus || "To be confirmed",
    estimatedYield: `${(decimalToNumber(campaign.holdingReturnRateMonthly) * 12).toFixed(2)}% p.a.`,
    tenure: property?.tenure || "To be confirmed",
    tenureAlias: property?.tenureAlias || "N/A",
    isLaca: property?.isLaca || false,
    bumiStatus: property?.bumiStatus || "To be confirmed",
    builtUpArea: property?.builtUpArea || "To be confirmed",
    landArea: property?.landArea || "To be confirmed",
    bedrooms: property?.bedrooms || 0,
    bathrooms: property?.bathrooms || 0,
    auctionDate: "To be confirmed",
    reservePrice,
    yearBuilt: property?.yearBuilt || "To be confirmed",
    fullAddress: property?.fullAddress || "To be confirmed",
    minimumParticipation: decimalToNumber(campaign.minimumParticipationAmount),
    maximumParticipation: decimalToNumber(campaign.maximumParticipationAmount),
    targetAmount: campaignTarget,
    collectedAmount: decimalToNumber(campaign.collectedAmountSnapshot),
    reservedAmount: decimalToNumber(campaign.reservedAmountSnapshot),
    participants: campaign._count?.participations ?? 0,
    closeDate: formatDate(closeDate),
    auctionPrice: 0,
    marketValue: reservePrice || campaignTarget,
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
    updates: (campaign.updates ?? []).map((update) => ({
      date: formatDate(update.createdAt),
      title: update.title,
      body: update.body,
    })),
    faqs: (campaign.faqs ?? []).map((faq) => ({
      question: faq.question,
      answer: faq.answer,
    })),
    holdingReturnRate: `${decimalToNumber(campaign.holdingReturnRateMonthly)}% Monthly`,
    returnType: formatReturnType(campaign.returnType),
    maximumHoldingPeriodMonths: campaign.maximumHoldingPeriodMonths,
    principalProtectionRule:
      "If the property is not successfully disposed of within the maximum holding period, members will receive their original Participation Amount back according to the listing terms.",
    documents: (campaign.documents ?? []).flatMap((document) => {
      if (
        document.visibility !== Visibility.MemberVisible ||
        !MEMBER_DOCUMENT_STATUSES.includes(document.documentStatus as (typeof MEMBER_DOCUMENT_STATUSES)[number]) ||
        !document.fileAsset
      ) {
        return [];
      }

      const url = fileAssetUrl(document.fileAsset);
      if (!url) return [];

      return [{
        title: document.title,
        filename: document.fileAsset.originalFilename ?? document.title,
        url,
      }];
    }),
    riskSummary:
      campaign.content?.riskDisclaimer ||
      "Please review all listing information before participating.",
  };
}

async function getMemberCampaignsRaw() {
  if (!process.env.DATABASE_URL) {
    assertProductionDatabaseConfigured();
    return [];
  }

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
        where: memberAccessibleDocumentWhere(),
        include: {
          fileAsset: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      updates: {
        where: {
          publishedAt: { not: null },
          visibility: "MemberVisible",
        },
        orderBy: {
          publishedAt: "desc",
        },
      },
      faqs: {
        orderBy: {
          sortOrder: "asc",
        },
      },
      _count: { select: { participations: true } },
    },
  });
}

async function getMemberCampaignSummariesRaw() {
  if (!process.env.DATABASE_URL) {
    assertProductionDatabaseConfigured();
    return [];
  }

  return db.campaign.findMany({
    where: {
      publishStatus: "Published",
      visibility: "MemberVisible",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      slug: true,
      title: true,
      campaignRef: true,
      campaignCode: true,
      lifecycleStatus: true,
      campaignTarget: true,
      minimumParticipationAmount: true,
      maximumParticipationAmount: true,
      collectedAmountSnapshot: true,
      reservedAmountSnapshot: true,
      campaignCloseDate: true,
      holdingReturnRateMonthly: true,
      returnType: true,
      maximumHoldingPeriodMonths: true,
      principalProtectionEnabled: true,
      propertyDetail: true,
      media: {
        where: { mediaType: { in: ["PrimaryImage", "GalleryImage"] } },
        include: { fileAsset: true },
        orderBy: { sortOrder: "asc" },
      },
      _count: { select: { participations: true } },
    },
  });
}

export async function getMemberCampaignSummaries() {
  try {
    const campaigns = await getMemberCampaignSummariesRaw();

    if (campaigns.length === 0 && shouldUseDemoDataFallback()) {
      return demoOpportunities;
    }

    return campaigns.map((campaign) => ({
      ...toOpportunity(campaign as CampaignWithRelations),
      aboutCampaign: "",
      importantInformation: "",
      updates: [],
      faqs: [],
      documents: [],
      riskSummary: "",
    }));
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
    console.warn(
      "Falling back to demo member campaigns because database reads are unavailable.",
      error,
    );
    return demoOpportunities;
  }
}

function demoCampaignBySlug(slug: string) {
  return demoOpportunities.find((campaign) => campaign.slug === slug) ?? null;
}

export async function getMemberCampaigns() {
  try {
    const campaigns = await getMemberCampaignsRaw();

    if (campaigns.length === 0 && shouldUseDemoDataFallback()) {
      return demoOpportunities;
    }

    return campaigns.map(toOpportunity);
  } catch (error) {
    if (process.env.NODE_ENV === "production") throw error;
    console.warn(
      "Falling back to demo member campaigns because database reads are unavailable.",
      error,
    );
    return demoOpportunities;
  }
}

export async function getRealMemberCampaignBySlug(slug: string) {
  if (!process.env.DATABASE_URL) {
    assertProductionDatabaseConfigured();
    return null;
  }

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
          where: memberAccessibleDocumentWhere(),
          include: {
            fileAsset: true,
          },
        },
        updates: {
          where: {
            publishedAt: { not: null },
            visibility: "MemberVisible",
          },
          orderBy: {
            publishedAt: "desc",
          },
        },
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
    if (process.env.NODE_ENV === "production") throw error;
    console.warn(
      "Member participation is unavailable because the real campaign could not be loaded.",
      error,
    );
    return null;
  }
}

export async function getMemberCampaignBySlug(slug: string) {
  if (!process.env.DATABASE_URL) {
    assertProductionDatabaseConfigured();
    return demoCampaignBySlug(slug);
  }

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
          where: memberAccessibleDocumentWhere(),
          include: {
            fileAsset: true,
          },
        },
        updates: {
          where: {
            publishedAt: { not: null },
            visibility: "MemberVisible",
          },
          orderBy: {
            publishedAt: "desc",
          },
        },
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
    if (process.env.NODE_ENV === "production") throw error;
    console.warn(
      "Falling back to demo member campaign because database reads are unavailable.",
      error,
    );
    return demoCampaignBySlug(slug);
  }
}
