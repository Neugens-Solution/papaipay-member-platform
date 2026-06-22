import { notFound } from "next/navigation";
import { BackLink, Badge, Card, InfoGrid, PageHeader, ProgressBar, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { db } from "@/lib/db";

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
      updates: true,
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
  const progress = target > 0 ? (collected / target) * 100 : 0;

  const latestSettlement = listing.settlements[0];
  const salePrice = decimalToNumber(latestSettlement?.salePrice) || reservePrice;
  const purchasePrice = decimalToNumber(latestSettlement?.purchasePrice) || reservePrice;
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
      <BackLink href="/admin/listings" />
      <PageHeader
        eyebrow={`${listing.campaignRef} • ${listing.campaignCode}`}
        title={listing.title}
        description="Overview, participants, property details, documents, settlement / fees and manual distribution workflow."
        action={
          <a
            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600"
            href={`/admin/listings/${listing.slug}/edit`}
          >
            Edit Listing
          </a>
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
              { label: "Property Type", value: property?.propertyType || "To be confirmed" },
              { label: "Tenure", value: property?.tenureAlias || property?.tenure || "To be confirmed" },
              { label: "LACA", value: property?.isLaca ? "Yes" : "No" },
              { label: "Bumi Status", value: property?.bumiStatus || "To be confirmed" },
              { label: "Built-up", value: property?.builtUpArea || "To be confirmed" },
              { label: "Bedrooms / Bathrooms", value: `${property?.bedrooms || 0} / ${property?.bathrooms || 0}` },
              { label: "Auction Date", value: formatDate(property?.auctionDate) },
              { label: "Reserve Price", value: `RM${reservePrice.toLocaleString()}` },
            ]}
          />
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