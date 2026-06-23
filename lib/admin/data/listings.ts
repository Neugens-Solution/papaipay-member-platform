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
  return db.campaign.findUnique({
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
}
