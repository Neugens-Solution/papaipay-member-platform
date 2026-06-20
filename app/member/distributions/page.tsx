import Link from "next/link";
import { ContentCard, MetricCard, StatusBadge } from "@/components/member/Cards";
import { distributionRecords, formatRM } from "@/lib/memberMockData";

const distributionStats = [
  { label: "Distribution Received", value: formatRM(8500), helper: "Paid records" },
  { label: "Distribution Processing", value: formatRM(3200), helper: "In payment review" },
  { label: "Pending Distribution", value: formatRM(5000), helper: "Awaiting processing" },
  { label: "Completed Payments", value: "4", helper: "Recorded payments" },
];

export default function Page() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-[1.7rem]">Distributions</h1>
      </header>

      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {distributionStats.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </section>

      <ContentCard className="p-0">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <h2 className="text-base font-bold">Distribution List</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {distributionRecords.map((record) => (
            <div key={record.slug} className="grid gap-3 px-4 py-4 sm:px-5 lg:grid-cols-[1.4fr_1fr_1fr_0.9fr_0.9fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-bold text-slate-400">{record.distributionId} • {record.campaignId} • {record.participationId}</p><p className="text-sm font-bold text-papaipay-ink">{record.propertyName}</p>
                <p className="mt-1 text-xs text-slate-500">Participation Amount: {formatRM(record.participationAmount)}</p>
              </div>
              <ListField label="Participation Amount" value={formatRM(record.participationAmount)} className="hidden lg:block" />
              <ListField label="Principal Return" value={formatRM(record.principalReturn)} /><ListField label="Holding Return" value={formatRM(record.holdingReturn)} /><ListField label="Profit Distribution" value={formatRM(record.profitDistribution)} /><ListField label="Final Distribution Total" value={formatRM(record.distributionAmount)} />
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400 lg:hidden">Distribution Status</p>
                <StatusBadge status={record.status} />
              </div>
              <ListField label="Paid Date" value={record.paidDate} />
              <Link href={`/member/distributions/${record.slug}`} className="inline-flex min-h-10 items-center justify-center rounded-md border border-papaipay-green px-4 py-2 text-sm font-bold text-papaipay-green transition hover:bg-papaipay-green hover:text-white">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </ContentCard>
    </div>
  );
}

function ListField({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return <div className={className}><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-700">{value}</p></div>;
}
