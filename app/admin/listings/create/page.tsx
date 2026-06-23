import { BackLink, PageHeader } from "@/components/admin/AdminUI";
import { ListingForm } from "@/components/admin/ListingForm";

export default function CreateListingPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <BackLink href="/admin/listings" />
      <PageHeader
        title="Create Listing"
        description="Create the full listing data structure used by the Member Portal listing detail page."
      />
      <ListingForm mode="create" />
    </div>
  );
}
