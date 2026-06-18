import { BackLink, PageHeader } from "@/components/admin/AdminUI";
import { ListingForm } from "@/components/admin/ListingForm";

export default function EditListingPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <BackLink href="/admin/listings/kajang-terrace-house" />
      <PageHeader title="Edit Listing" description="Edit all member-facing property, campaign, valuation, timeline, update, FAQ, risk, document and image fields." />
      <ListingForm mode="edit" />
    </div>
  );
}
