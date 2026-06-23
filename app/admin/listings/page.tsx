import Link from "next/link";
import { Badge, PageHeader, ProgressBar, SearchFilter, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { db } from "@/lib/db";

function decimalToNumber(value: unknown): number {
  if (
    value &&
    typeof value === "object" &&
    "toNumber" in value &&
    typeof value.toNumber === "function"
  ) {
    return value.toNumber();
  }

  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);

  return 0;
}

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

function formatStatus(status: string) {
  return status.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export default async function ListingsPage() {
  const listings = await db.campaign.findMany({
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

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Listings"
        description="Manage campaign listing records and monitor collection progress."
        action={
          <Link
            className="rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white"
            href="/admin/listings/create"
          >
            Create Listing
          </Link>
        }
      />
      <SearchFilter placeholder="Search listings" />
      <TableWrap>
        <thead>
          <tr>
            <Th>Campaign ID</Th>
            <Th>Campaign Code</Th>
            <Th>Listing Name</Th>
            <Th>Location</Th>
            <Th>Property</Th>
            <Th>Status</Th>
            <Th>Campaign Target</Th>
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
                  <Badge>{formatStatus(listing.lifecycleStatus)}</Badge>
                </Td>
                <Td>RM{target.toLocaleString()}</Td>
                <Td>RM{collected.toLocaleString()}</Td>
                <Td>
                  <ProgressBar value={progress} />
                </Td>
                <Td>{listing._count.participations}</Td>
                <Td>
                  <div className="flex gap-3">
                    <Link
                      className="font-bold text-papaipay-green"
                      href={`/admin/listings/${listing.slug}`}
                    >
                      View
                    </Link>
                    <Link
                      className="font-bold text-papaipay-green"
                      href={`/admin/listings/${listing.slug}/edit`}
                    >
                      Edit
                    </Link>
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