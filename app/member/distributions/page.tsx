import Link from "next/link";
import { ContentCard, MetricCard, StatusBadge } from "@/components/member/Cards";
import { formatDistributionAmount, getMemberDistributions, type MemberDistributionRecord } from "@/lib/data/memberDistributions";

export default async function Page() {
  const { records, totalCount, totalFinalDistributionReceived, unavailable } = await getMemberDistributions();

  const distributionStats = [
    { label: "Paid Distributions", value: totalCount.toLocaleString("en-MY"), helper: "Completed manual payments" },
    { label: "Distribution Received", value: formatDistributionAmount(totalFinalDistributionReceived), helper: "Total final distribution received" },
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-[1.7rem]">Distributions</h1>
        <p className="mt-2 text-sm text-slate-600">Paid Distribution records appear after manual payment has been recorded for a completed distribution batch.</p>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {distributionStats.map((stat) => <MetricCard key={stat.label} {...stat} />)}
      </section>

      {unavailable ? (
        <ContentCard>
          <h2 className="text-base font-bold">Distributions unavailable</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">We could not load paid distributions from the database right now. No distribution records are shown while distribution data is unavailable.</p>
        </ContentCard>
      ) : null}

      <ContentCard className="p-0">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <h2 className="text-base font-bold">Paid Distribution List</h2>
        </div>
        {records.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {records.map((record) => <DistributionRow key={record.id} record={record} />)}
          </div>
        ) : (
          <div className="px-4 py-8 sm:px-5">
            <p className="text-sm leading-6 text-slate-600">Paid distributions will appear here after a project distribution has been completed and manual payment has been recorded.</p>
          </div>
        )}
      </ContentCard>
    </div>
  );
}

function DistributionRow({ record }: { record: MemberDistributionRecord }) {
  return (
    <div className="grid gap-3 px-4 py-4 sm:px-5 lg:grid-cols-[1.4fr_1fr_1fr_1fr_0.9fr_auto] lg:items-center">
      <div>
        <p className="text-xs font-bold text-slate-400">{record.distributionRef} • Batch {record.batchRef}</p>
        <p className="text-sm font-bold text-papaipay-ink">{record.projectTitle}</p>
        <p className="mt-1 text-xs text-slate-500">{record.campaignCode} • {record.propertySummary}</p>
      </div>
      <ListField label="Final Distribution Total" value={formatDistributionAmount(record.finalDistributionTotal)} />
      <ListField label="Principal Return" value={formatDistributionAmount(record.principalReturn)} />
      <ListField label="Holding Return" value={formatDistributionAmount(record.holdingReturn)} />
      <ListField label="Profit Distribution" value={formatDistributionAmount(record.profitDistribution)} />
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400 lg:hidden">Distribution Status</p>
        <StatusBadge status="Paid" />
      </div>
      <ListField label="Paid Date" value={record.paidDate} />
      <ListField label="Payment Reference" value={record.paymentReference} />
      <Link href={`/member/distributions/${record.slug}`} className="inline-flex min-h-10 items-center justify-center rounded-md border border-papaipay-green px-4 py-2 text-sm font-bold text-papaipay-green transition hover:bg-papaipay-green hover:text-white">
        View Details
      </Link>
    </div>
  );
}

function ListField({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return <div className={className}><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-700">{value}</p></div>;
}
