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
    select: {
      campaignRef: true,
      campaignCode: true,
    },
  });

  if (!campaign) notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <BackLink href={`/admin/listings/${params.slug}`} label="Back to Listing Detail" />
      <PageHeader
        title="Edit Listing"
        description="Edit all member-facing property, campaign, valuation, timeline, update, FAQ, risk, document and image fields."
      />
      <ListingForm
        mode="edit"
        slug={params.slug}
        initialValues={{
          campaignRef: campaign.campaignRef,
          campaignCode: campaign.campaignCode,
        }}
      />
    </div>
  );
}
