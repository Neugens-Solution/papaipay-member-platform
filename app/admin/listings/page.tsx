import { PendingLink } from "@/components/common/PendingLink";
import { Badge, PageHeader, ProgressBar, SearchFilter, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { getAdminListingSummaries } from "@/lib/admin/data/listings";
import { decimalToNumber, formatCurrency, formatEnumLabel } from "@/lib/utils/formatters";

function formatTenureBadge(tenure: string | null, tenureAlias: string | null) {
  if (tenure === "Freehold" || tenureAlias === "FH") return "FH";
  if (tenure === "Leasehold" || tenureAlias === "LH") return "LH";

  return null;
}

function formatProperty(property: {
  propertyType: string;
  tenure: string | null;
  tenureAlias: string | null;
  bumiStatus: string;
  isLaca: boolean;
} | null) {
  if (!property) return "To be confirmed";

  return [
    property.propertyType,
    formatTenureBadge(property.tenure, property.tenureAlias),
    property.bumiStatus,
    property.isLaca ? "LACA" : null,
  ]
    .filter(Boolean)
    .join(" • ");
}

export default async function ListingsPage() {
  const listings = await getAdminListingSummaries();

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        eyebrow="Admin Portal"
        title="Listing Management"
        description="Manage listing records, publishing readiness, and collection progress. Campaign references remain internal identifiers."
        action={
          <PendingLink
            className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white"
            href="/admin/listings/create"
            pendingLabel="Opening..."
          >
            Create Listing
          </PendingLink>
        }
      />
      <SearchFilter placeholder="Search listings" />
      <TableWrap>
        <thead>
          <tr>
            <Th>Listing ID</Th>
            <Th>Listing Code</Th>
            <Th>Listing Name</Th>
            <Th>Location</Th>
            <Th>Asset</Th>
            <Th>Status</Th>
            <Th>Listing Target</Th>
            <Th>Collected Amount</Th>
            <Th>Progress</Th>
            <Th>Participants</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => {
            const target = decimalToNumber(listing.campaignTarget);
            const collected = decimalToNumber(listing.collectedAmountSnapshot);
            const progress = target > 0 ? (collected / target) * 100 : 0;

            return (
              <tr key={listing.slug} className="border-t border-slate-100">
                <Td>{listing.campaignRef}</Td>
                <Td>{listing.campaignCode}</Td>
                <Td>
                  <b className="text-papaipay-ink">{listing.title}</b>
                </Td>
                <Td>
                  {listing.propertyDetail?.location ||
                    listing.propertyDetail?.state ||
                    "To be confirmed"}
                </Td>
                <Td>{formatProperty(listing.propertyDetail)}</Td>
                <Td>
                  <Badge>{formatEnumLabel(listing.lifecycleStatus)}</Badge>
                </Td>
                <Td>{formatCurrency(target)}</Td>
                <Td>{formatCurrency(collected)}</Td>
                <Td>
                  <ProgressBar value={progress} />
                </Td>
                <Td>{listing._count.participations}</Td>
                <Td>
                  <div className="flex gap-3">
                    <PendingLink
                      className="font-bold text-papaipay-green"
                      href={`/admin/listings/${listing.slug}`}
                      pendingLabel="Opening..."
                    >
                      View
                    </PendingLink>
                    <PendingLink
                      className="font-bold text-papaipay-green"
                      href={`/admin/listings/${listing.slug}/edit`}
                      pendingLabel="Loading Workspace..."
                    >
                      Edit
                    </PendingLink>
                    <PendingLink
                      className="font-bold text-papaipay-green"
                      href={`/admin/projects/${listing.slug}`}
                      pendingLabel="Opening Project..."
                    >
                      Manage Project
                    </PendingLink>
                  </div>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </TableWrap>
    </div>
  );
}
