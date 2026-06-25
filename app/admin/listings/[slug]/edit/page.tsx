import { notFound } from "next/navigation";
import { BackLink, PageHeader } from "@/components/admin/AdminUI";
import { ListingForm } from "@/components/admin/ListingForm";
import { getAdminListingBySlug } from "@/lib/admin/data/listings";

export default async function EditListingPage({
  params,
}: {
  params: { slug: string };
}) {
  const campaign = await getAdminListingBySlug(params.slug);

  if (!campaign) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <BackLink
        href={`/admin/listings/${params.slug}`}
        label="Back to Opportunity Detail"
      />
      <PageHeader
        title="Edit Opportunity"
        description="Edit all member-facing asset, campaign, valuation, timeline, update, FAQ, risk, document and image fields."
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
          publishStatus: campaign.publishStatus,
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
          faqs: campaign.faqs,
        }}
      />
    </div>
  );
}
