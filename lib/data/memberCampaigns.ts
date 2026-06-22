import { db } from "@/lib/db";

export async function getMemberCampaigns() {
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

export async function getMemberCampaignBySlug(slug: string) {
  return db.campaign.findFirst({
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
}
