import { BackLink, PageHeader } from "@/components/admin/AdminUI";
import { ListingForm } from "@/components/admin/ListingForm";

export default function CreateListingPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <BackLink href="/admin/listings" label="Back to Opportunity Management" />
      <PageHeader
        title="Create Opportunity"
        description="Create the full opportunity data structure used by the Member Portal opportunity detail page."
      />
      <ListingForm mode="create" />
    </div>
  );
}
