import { notFound } from "next/navigation";
import Link from "next/link";
import { BackLink, Badge, Card, InfoGrid, PageHeader, ProgressBar, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

function DocumentIcon() {
  return <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-sm font-black text-papaipay-green ring-1 ring-emerald-100">PDF</span>;
}

function decimalToNumber(value: unknown): number {
  if (value && typeof value === "object" && "toNumber" in value && typeof value.toNumber === "function") {
    return value.toNumber();
  }

  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);

  return 0;
}

function formatStatus(status: string) {
  return status.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function formatTenure(value: string | null | undefined) {
  if (value === "FH" || value === "Freehold") return "Freehold";
  if (value === "LH" || value === "Leasehold") return "Leasehold";

  return "To be confirmed";
}

function formatDate(value: Date | null | undefined) {
  if (!value) return "To be confirmed";

  return new Intl.DateTimeFormat("en-MY", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(value);
}

export default async function ListingDetailPage({ params }: { params: { slug: string } }) {
  const listing = await db.campaign.findUnique({
    where: {
      slug: params.slug,
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

  if (!listing) notFound();

  const property = listing.propertyDetail;
  const target = decimalToNumber(listing.campaignTarget);
  const collected = decimalToNumber(listing.collectedAmountSnapshot);
  const reservePrice = decimalToNumber(property?.reservePrice);
  const marketValue = target || reservePrice;
  const estimatedAnnualYield = decimalToNumber(listing.holdingReturnRateMonthly) * 12;
  const progress = target > 0 ? (collected / target) * 100 : 0;

  const latestSettlement = listing.settlements[0];
  const salePrice = decimalToNumber(latestSettlement?.salePrice) || reservePrice;
  const purchasePrice =
    decimalToNumber(latestSettlement?.purchasePrice) || reservePrice;
  const totalCosts = decimalToNumber(latestSettlement?.totalCostsSnapshot);
  const netProfit =
    decimalToNumber(latestSettlement?.netProfitSnapshot) ||
    salePrice - purchasePrice - totalCosts;
  const principalTotal =
    decimalToNumber(latestSettlement?.principalReturnPool) || collected;
  const holdingTotal = decimalToNumber(latestSettlement?.holdingReturnPool);
  const profitPool = decimalToNumber(latestSettlement?.profitDistributionPool);
  const platformShare = decimalToNumber(latestSettlement?.platformShare);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <BackLink href="/admin/listings" label="Back to Listings" />
      <PageHeader
        eyebrow={`${listing.campaignRef} • ${listing.campaignCode}`}
        title={listing.title}
        description="Overview, participants, property details, documents, settlement / fees and manual distribution workflow."
        action={
          <Link
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600"
            href={`/admin/listings/${listing.slug}/edit`}
          >
            Edit Listing
          </Link>
        }
      />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {["Overview", "Participants", "Property Details", "Documents", "Updates", "Settlement / Fees", "Distribution"].map((tab) => (
          <span key={tab} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
            {tab}
          </span>
        ))}
      </div>

      <section className="grid gap-4 lg:grid-cols-[1fr_.8fr]">
        <Card>
          <h2 className="font-bold">Overview</h2>
          <InfoGrid
            items={[
              { label: "Campaign ID", value: listing.campaignRef },
              { label: "Campaign Code", value: listing.campaignCode },
              { label: "Location", value: property?.location || property?.state || "To be confirmed" },
              { label: "Asset Category", value: property?.propertyType || "Residential Property" },
              { label: "Market Value", value: marketValue ? `RM${marketValue.toLocaleString()}` : "To be confirmed" },
              { label: "Estimated Yield", value: estimatedAnnualYield ? `${estimatedAnnualYield.toFixed(2)}% p.a.` : "To be confirmed" },
              { label: "Occupancy Status", value: "To be confirmed" },
              { label: "Status", value: formatStatus(listing.lifecycleStatus) },
              { label: "Campaign Target", value: `RM${target.toLocaleString()}` },
              { label: "Collected Amount", value: `RM${collected.toLocaleString()}` },
              { label: "Holding Return Rate", value: `${decimalToNumber(listing.holdingReturnRateMonthly)}% per month` },
              { label: "Return Type", value: formatStatus(listing.returnType) },
              { label: "Maximum Holding Period", value: `${listing.maximumHoldingPeriodMonths} months` },
              { label: "Principal Protection", value: listing.principalProtectionEnabled ? "Enabled" : "Disabled" },
              { label: "24-Month Rule", value: "After 24 months: Participation Amount only" },
            ]}
          />
        </Card>
        <Card>
          <h2 className="font-bold">Campaign Progress</h2>
          <p className="my-4 text-3xl font-semibold tracking-tight">{Math.round(progress)}%</p>
          <ProgressBar value={progress} />
        </Card>
      </section>

      <Card>
        <h2 className="font-bold">Participants</h2>
        <TableWrap>
          <thead>
            <tr>
              <Th>Participation ID</Th>
              <Th>Member ID</Th>
              <Th>Campaign ID</Th>
              <Th>Member Name</Th>
              <Th>Email</Th>
              <Th>Participation Amount</Th>
              <Th>Date</Th>
              <Th>Payment Status</Th>
              <Th>Distribution Status</Th>
            </tr>
          </thead>
          <tbody>
            {listing.participations.map((participation) => {
              const latestPayment = participation.payments[0];
              const latestDistribution = participation.distributions[0];

              return (
                <tr key={participation.id} className="border-t border-slate-100">
                  <Td>{participation.participationRef}</Td>
                  <Td>{participation.member.memberRef}</Td>
                  <Td>{listing.campaignRef}</Td>
                  <Td>{participation.member.fullName}</Td>
                  <Td>{participation.member.user.email}</Td>
                  <Td>RM{decimalToNumber(participation.participationAmount).toLocaleString()}</Td>
                  <Td>{formatDate(participation.createdAt)}</Td>
                  <Td><Badge>{latestPayment?.status || "Pending"}</Badge></Td>
                  <Td><Badge>{latestDistribution?.status || "Pending"}</Badge></Td>
                </tr>
              );
            })}
          </tbody>
        </TableWrap>
      </Card>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card>
          <h2 className="font-bold">Property Details</h2>
          <InfoGrid
            items={[
              { label: "Asset Category", value: property?.propertyType || "Residential Property" },
              { label: "Property Type", value: property?.propertyType || "To be confirmed" },
              {
                label: "Tenure",
                value: formatTenure(property?.tenure || property?.tenureAlias),
              },
              { label: "Bumi Status", value: property?.bumiStatus || "To be confirmed" },
              { label: "Built-up", value: property?.builtUpArea || "To be confirmed" },
              { label: "Land Area", value: property?.landArea || "To be confirmed" },
              { label: "Bedrooms / Bathrooms", value: `${property?.bedrooms || 0} / ${property?.bathrooms || 0}` },
              { label: "Full Address", value: property?.fullAddress || "To be confirmed" },
              { label: "Year Built", value: property?.yearBuilt || "To be confirmed" },
            ]}
          />
        </Card>
        <Card>
          <h2 className="font-bold">Media Gallery</h2>
          <div className="mt-4 space-y-3">
            {listing.media.length > 0 ? (
              listing.media.map((media) => (
                <div key={media.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <p className="text-sm font-bold text-papaipay-ink">{media.caption || media.fileAsset?.originalFilename || "Campaign image"}</p>
                  <p className="mt-1 text-xs text-slate-500">{media.mediaType} • {media.altText || "Alt text not set"}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No media gallery items uploaded yet.</p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="font-bold">Documents</h2>
          <div className="mt-4 space-y-3">
            {listing.documents.length > 0 ? (
              listing.documents.map((document) => (
                <div key={document.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <DocumentIcon />
                  <div>
                    <p className="text-sm font-bold text-papaipay-ink">{document.fileAsset?.originalFilename || document.category}</p>
                    <p className="text-xs text-slate-500">Campaign document</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No documents uploaded yet.</p>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="font-bold">Updates</h2>
          {listing.updates.length > 0 ? (
            listing.updates.map((update) => (
              <p key={update.id} className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-600">
                {update.title}
              </p>
            ))
          ) : (
            <p className="mt-3 text-sm text-slate-500">No updates yet.</p>
          )}
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-bold">Important Information</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {listing.content?.importantInformation || "No important information recorded yet."}
          </p>
        </Card>
        <Card>
          <h2 className="font-bold">Risk Disclaimer</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {listing.content?.riskDisclaimer || "No risk disclaimer recorded yet."}
          </p>
        </Card>
      </section>

      <Card>
        <h2 className="font-bold">FAQ</h2>
        {listing.faqs.length > 0 ? (
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {listing.faqs.map((faq) => (
              <div key={faq.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="text-sm font-bold text-papaipay-ink">{faq.question}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No FAQ entries recorded yet.</p>
        )}
      </Card>

      <Card>
        <h2 className="font-bold">Settlement / Fees</h2>
        <InfoGrid
          items={[
            { label: "Sale Price", value: `RM${salePrice.toLocaleString()}` },
            { label: "Purchase Price", value: `RM${purchasePrice.toLocaleString()}` },
            { label: "Total Costs", value: `RM${totalCosts.toLocaleString()}` },
            { label: "Net Profit", value: `RM${netProfit.toLocaleString()}` },
            { label: "Principal Return Total", value: `RM${principalTotal.toLocaleString()}` },
            { label: "Holding Return Total", value: `RM${holdingTotal.toLocaleString()}` },
            { label: "Profit Distribution Pool", value: `RM${profitPool.toLocaleString()}` },
            { label: "Platform Share", value: `RM${platformShare.toLocaleString()}` },
            { label: "Final Distribution Total", value: `RM${(principalTotal + holdingTotal + profitPool).toLocaleString()}` },
            { label: "Calculation Remarks", value: latestSettlement?.calculationRemarks || "No settlement calculation recorded yet." },
          ]}
        />
      </Card>

      <Card>
        <h2 className="font-bold">Distribution</h2>
        <p className="mt-2 text-sm text-slate-600">
          Manual process: review final calculation, check member bank details, transfer outside the system, enter payment reference number, payment date and notes, then mark distribution as Paid.
        </p>
        {listing.distributions.slice(0, 3).map((distribution) => (
          <p key={distribution.id} className="mt-3 text-sm text-slate-600">
            {distribution.distributionRef} • RM{decimalToNumber(distribution.finalDistributionTotal).toLocaleString()} • {distribution.status}
          </p>
        ))}
      </Card>
    </div>
  );
}
