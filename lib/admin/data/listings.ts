import { db } from "@/lib/db";

export async function getAdminListingSummaries() {
  return db.campaign.findMany({
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
