import { notFound } from "next/navigation";
import { BackLink, PageHeader } from "@/components/admin/AdminUI";
import { ListingForm } from "@/components/admin/ListingForm";
import { db } from "@/lib/db";

export default async function EditListingPage({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = await db.campaign.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      propertyDetail: true,
      content: true,
      media: {
        include: { fileAsset: true },
        orderBy: { sortOrder: "asc" },
      },
      documents: {
        include: { fileAsset: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!campaign) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <BackLink
        href={`/admin/listings/${params.slug}`}
        label="Back to Listing Detail"
      />
      <PageHeader
        title="Edit Listing"
        description="Edit all member-facing property, campaign, valuation, timeline, update, FAQ, risk, document and image fields."
      />
      <ListingForm
        mode="edit"
        slug={params.slug}
        initialValues={{
          id: campaign.id,
          campaignRef: campaign.campaignRef,
          campaignCode: campaign.campaignCode,
          title: campaign.title,
          visibility: campaign.visibility,
          campaignTarget: campaign.campaignTarget.toString(),
          minimumParticipationAmount:
            campaign.minimumParticipationAmount.toString(),
          maximumParticipationAmount:
            campaign.maximumParticipationAmount.toString(),
          campaignOpenDate: campaign.campaignOpenDate
            ?.toISOString()
            .slice(0, 10),
          campaignCloseDate: campaign.campaignCloseDate
            ?.toISOString()
            .slice(0, 10),
          holdingReturnRateMonthly:
            campaign.holdingReturnRateMonthly.toString(),
          returnType: campaign.returnType,
          maximumHoldingPeriodMonths: campaign.maximumHoldingPeriodMonths,
          principalProtectionEnabled: campaign.principalProtectionEnabled,
          propertyDetail: campaign.propertyDetail
            ? {
                ...campaign.propertyDetail,
                reservePrice: campaign.propertyDetail.reservePrice?.toString(),
                auctionDate: campaign.propertyDetail.auctionDate
                  ?.toISOString()
                  .slice(0, 10),
              }
            : undefined,
          content: campaign.content,
          media: campaign.media,
          documents: campaign.documents,
        }}
      />
    </div>
  );
}
