import { BackLink, PageHeader } from "@/components/admin/AdminUI";
import { ListingImportPanel } from "@/components/admin/ListingImportPanel";
import { requireAdminPermission } from "@/lib/auth/guards";
import { serviceAccountEmail } from "@/lib/google/sheets";

export default async function ImportListingsPage() {
  await requireAdminPermission("listing.manage");
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <BackLink href="/admin/listings" label="Back to Listing Management" />
      <PageHeader
        title="Import Listings from Google Sheet"
        description="Reads the Import Listings, Campaign FAQ and Campaign Timeline tabs. Every imported listing is created as a Draft for review before publishing."
      />
      <ListingImportPanel serviceAccountEmail={serviceAccountEmail()} />
    </div>
  );
}
