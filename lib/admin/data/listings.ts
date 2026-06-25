import { db } from "@/lib/db";
import { listings as demoListings } from "@/lib/adminMockData";

function demoAdminListingSummaries() {
  return demoListings.map((listing) => ({
    id: listing.id,
    campaignRef: listing.campaignId,
    campaignCode: listing.campaignCode,
    title: listing.campaignTitle,
    slug: listing.slug,
    lifecycleStatus: listing.status.replaceAll(" ", ""),
    campaignTarget: listing.campaignTarget,
    collectedAmountSnapshot: listing.collectedAmount,
    propertyDetail: {
      propertyType: listing.propertyType,
      tenure: listing.tenure,
      tenureAlias: listing.tenureAlias,
      bumiStatus: listing.bumiStatus,
      isLaca: listing.isLaca,
      location: listing.location,
      state: listing.state,
    },
    _count: {
      participations: listing.participants,
    },
  }));
}

function demoAdminListingDetail(slug: string) {
  const listing = demoListings.find((item) => item.slug === slug);
  if (!listing) return null;
  return {
    id: listing.id,
    campaignRef: listing.campaignId,
    campaignCode: listing.campaignCode,
    title: listing.campaignTitle,
    slug: listing.slug,
    lifecycleStatus: listing.status.replaceAll(" ", ""),
    publishStatus: listing.status === "Draft" ? "Draft" : "Published",
    visibility: "MemberVisible",
    campaignTarget: listing.campaignTarget,
    minimumParticipationAmount: listing.minimumParticipationAmount,
    maximumParticipationAmount: listing.maximumParticipationAmount,
    campaignOpenDate: new Date(listing.campaignOpenDate),
    campaignCloseDate: new Date(listing.campaignCloseDate),
    holdingReturnRateMonthly: Number.parseFloat(listing.holdingReturnRate),
    returnType: listing.returnType,
    maximumHoldingPeriodMonths: listing.maximumHoldingPeriodMonths,
    principalProtectionEnabled: listing.principalProtectionEnabled,
    collectedAmountSnapshot: listing.collectedAmount,
    reservedAmountSnapshot: 0,
    propertyDetail: {
      propertyType: listing.propertyType,
      tenure: listing.tenure,
      tenureAlias: listing.tenureAlias,
      isLaca: listing.isLaca,
      bumiStatus: listing.bumiStatus,
      builtUpArea: listing.builtUpArea,
      landArea: listing.landArea,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      auctionDate: new Date(listing.auctionDate),
      reservePrice: listing.reservePrice,
      state: listing.state,
      location: listing.location,
      fullAddress: listing.fullAddress,
      yearBuilt: listing.yearBuilt,
    },
    content: {
      aboutCampaign: listing.aboutCampaign,
      importantInformation: listing.importantInformation,
      riskDisclaimer: listing.riskDisclaimer,
      holdingReturnExplanation: listing.holdingReturnExplanation,
      finalDistributionExplanation: listing.finalDistributionExplanation,
    },
    media: [
      {
        id: `${listing.id}-hero`,
        mediaType: "PrimaryImage",
        caption: listing.imageCaptions[0],
        altText: listing.campaignTitle,
        sortOrder: 0,
        fileAsset: {
          originalFilename: "hero-image.jpg",
          objectKey: listing.primaryImage,
        },
      },
      ...listing.gallery.slice(1).map((image, index) => ({
        id: `${listing.id}-gallery-${index + 1}`,
        mediaType: "GalleryImage",
        caption: listing.imageCaptions[index + 1] ?? "Gallery image",
        altText: listing.campaignTitle,
        sortOrder: index + 1,
        fileAsset: {
          originalFilename: `gallery-${index + 1}.jpg`,
          objectKey: image,
        },
      })),
    ],
    documents: listing.documents.map((document, index) => ({
      id: `${listing.id}-doc-${index + 1}`,
      title: document.category,
      visibility: "MemberVisible",
      documentStatus: "Ready",
      category: document.category.replaceAll(" ", ""),
      fileAsset: {
        originalFilename: document.fileName ?? `${document.category}.pdf`,
        objectKey: "#",
      },
    })),
    updates: [],
    faqs: [],
    participations: [],
    settlements: [],
    distributions: [],
    _count: { participations: listing.participants },
  };
}

export async function getAdminListingSummaries() {
  if (!process.env.DATABASE_URL) return demoAdminListingSummaries();

  try {
    return await db.campaign.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        propertyDetail: true,
        _count: {
          select: {
            participations: true,
          },
        },
      },
    });
  } catch (error) {
    console.warn(
      "Falling back to demo admin listings because database reads are unavailable.",
      error,
    );
    return demoAdminListingSummaries();
  }
}

export async function getAdminListingBySlug(slug: string) {
  if (!process.env.DATABASE_URL) return demoAdminListingDetail(slug);

  try {
    return await db.campaign.findUnique({
      where: {
        slug,
      },
      include: {
        propertyDetail: true,
        documents: {
          include: {
            fileAsset: true,
          },
        },
        media: {
          include: {
            fileAsset: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
        updates: true,
        content: true,
        faqs: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        participations: {
          include: {
            member: {
              include: {
                user: true,
              },
            },
            payments: true,
            distributions: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        settlements: {
          orderBy: {
            createdAt: "desc",
          },
        },
        distributions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  } catch (error) {
    console.warn(
      "Falling back to demo admin listing because database reads are unavailable.",
      error,
    );
    return demoAdminListingDetail(slug);
  }
}
