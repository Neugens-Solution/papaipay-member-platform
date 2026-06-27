import { notFound } from "next/navigation";
import Link from "next/link";
import { BackLink, Badge, Card, InfoGrid, PageHeader, ProgressBar, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { getAdminListingBySlug } from "@/lib/admin/data/listings";
import { decimalToNumber, formatCurrency, formatDate, formatEnumLabel } from "@/lib/utils/formatters";

function DocumentIcon() {
  return <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-sm font-black text-papaipay-green ring-1 ring-emerald-100">PDF</span>;
}

function isRenderableAssetUrl(value: string | null | undefined) {
  return Boolean(value && (/^(\/|https?:\/\/|data:image\/)/.test(value)));
}

function formatTenure(value: string | null | undefined) {
  if (value === "FH" || value === "Freehold") return "Freehold";
  if (value === "LH" || value === "Leasehold") return "Leasehold";

  return "To be confirmed";
}

export default async function ListingDetailPage({ params }: { params: { slug: string } }) {
  const listing = await getAdminListingBySlug(params.slug);

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
  const renderableMedia = listing.media.filter((media) =>
    isRenderableAssetUrl(media.fileAsset?.objectKey),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <BackLink href="/admin/listings" label="Back to Listing Management" />
      <PageHeader
        eyebrow={`${listing.campaignRef} • ${listing.campaignCode}`}
        title={listing.title}
        description="Overview, members, asset details, documents, settlement / fees and manual return workflow."
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
        {["Overview", "Members", "Asset Details", "Documents", "Updates", "Settlement / Fees", "Distribution"].map((tab) => (
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
              { label: "City", value: property?.location || property?.state || "To be confirmed" },
              { label: "Asset Category", value: property?.assetCategory || property?.propertyType || "Residential Asset" },
              { label: "Market Value", value: marketValue ? formatCurrency(marketValue) : "To be confirmed" },
              { label: "Holding Return", value: estimatedAnnualYield ? `${estimatedAnnualYield.toFixed(2)}% p.a.` : "To be confirmed" },
              { label: "Occupancy Status", value: property?.occupancyStatus || "To be confirmed" },
              { label: "Status", value: formatEnumLabel(listing.lifecycleStatus) },
              { label: "Participation Target", value: formatCurrency(target) },
              { label: "Collected Amount", value: formatCurrency(collected) },
              { label: "Holding Return Rate", value: `${decimalToNumber(listing.holdingReturnRateMonthly)}% per month` },
              { label: "Return Type", value: formatEnumLabel(listing.returnType) },
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
        <h2 className="font-bold">Members</h2>
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
                  <Td>{formatCurrency(decimalToNumber(participation.participationAmount))}</Td>
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
          <h2 className="font-bold">Asset Details</h2>
          <InfoGrid
            items={[
              { label: "Asset Category", value: "Residential Asset" },
              { label: "Asset Type", value: property?.propertyType || "To be confirmed" },
              {
                label: "Tenure",
                value: formatTenure(property?.tenure || property?.tenureAlias),
              },
              { label: "Bumi Status", value: property?.bumiStatus || "To be confirmed" },
              { label: "Built-Up", value: property?.builtUpArea || "To be confirmed" },
              { label: "Land Area", value: property?.landArea || "To be confirmed" },
              { label: "Bedrooms", value: property?.bedrooms ? String(property.bedrooms) : "To be confirmed" },
              { label: "Bathrooms", value: property?.bathrooms ? String(property.bathrooms) : "To be confirmed" },
              { label: "Full Address", value: property?.fullAddress || "To be confirmed" },
              { label: "Year Built", value: property?.yearBuilt || "To be confirmed" },
            ]}
          />
        </Card>
        <Card>
          <h2 className="font-bold">Media Gallery</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {renderableMedia.length > 0 ? (
              renderableMedia.map((media) => (
                <div key={media.id} className="min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50/60">
                  {isRenderableAssetUrl(media.fileAsset?.objectKey) ? (
                    <div
                      className="h-36 bg-slate-100 bg-cover bg-center"
                      style={{ backgroundImage: `url(${media.fileAsset?.objectKey})` }}
                      role="img"
                      aria-label={media.altText || media.fileAsset?.originalFilename || "Listing image"}
                    />
                  ) : null}
                  <div className="p-3">
                    <p className="truncate text-sm font-bold text-papaipay-ink">{media.fileAsset?.originalFilename || "Listing image"}</p>
                    <p className="mt-1 text-xs text-slate-500">{media.mediaType === "PrimaryImage" ? "Main / Hero Image" : "Gallery Image"} • {media.altText || "Alt text not set"}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No media uploaded yet.</p>
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
                    <p className="text-xs text-slate-500">Listing document</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No documents added yet.</p>
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
            <p className="mt-3 text-sm text-slate-500">No updates added yet.</p>
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
            { label: "Sale Price", value: formatCurrency(salePrice) },
            { label: "Acquisition Price", value: formatCurrency(purchasePrice) },
            { label: "Total Costs", value: formatCurrency(totalCosts) },
            { label: "Net Return", value: formatCurrency(netProfit) },
            { label: "Principal Return Total", value: formatCurrency(principalTotal) },
            { label: "Holding Return Total", value: formatCurrency(holdingTotal) },
            { label: "Return Distribution Pool", value: formatCurrency(profitPool) },
            { label: "Platform Share", value: formatCurrency(platformShare) },
            { label: "Final Return Total", value: formatCurrency((principalTotal + holdingTotal + profitPool)) },
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
            {distribution.distributionRef} • {formatCurrency(decimalToNumber(distribution.finalDistributionTotal))} • {distribution.status}
          </p>
        ))}
      </Card>
    </div>
  );
}
