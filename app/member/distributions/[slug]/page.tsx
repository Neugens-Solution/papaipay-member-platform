import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard, Info, StatusBadge } from "@/components/member/Cards";
import { formatDistributionAmount, getMemberDistributionByRefOrSlug } from "@/lib/data/memberDistributions";

export default async function Page({ params }: { params: { slug: string } }) {
  const record = await getMemberDistributionByRefOrSlug({ slug: params.slug });
  if (!record) notFound();

  return (
    <div className="space-y-6">
      <Link href="/member/distributions" className="inline-flex items-center rounded-md text-sm font-bold text-papaipay-green hover:text-papaipay-ink">← Back to Distributions</Link>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Paid Distribution</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-[1.7rem]">{record.projectTitle}</h1>
          <p className="mt-2 text-sm text-slate-600">{record.location}</p>
        </div>
        <StatusBadge status="Paid" />
      </header>

      <ContentCard>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Info label="Distribution Ref" value={record.distributionRef} />
          <Info label="Distribution Batch" value={record.batchRef} />
          <Info label="Batch Status" value={record.batchStatus} />
          <Info label="Campaign Ref" value={record.campaignRef} />
          <Info label="Campaign Code" value={record.campaignCode} />
          <Info label="Participation Ref" value={record.participationRef} />
          <Info label="Project / Listing" value={record.projectTitle} />
          <Info label="Property Summary" value={record.propertySummary} />
          <Info label="Original Participation Amount" value={formatDistributionAmount(record.participationAmount)} />
          <Info label="Principal Return" value={formatDistributionAmount(record.principalReturn)} />
          <Info label="Holding Return" value={formatDistributionAmount(record.holdingReturn)} />
          <Info label="Profit Distribution" value={formatDistributionAmount(record.profitDistribution)} />
          <Info label="Final Distribution Total" value={formatDistributionAmount(record.finalDistributionTotal)} />
          <Info label="Paid Date" value={record.paidDate} />
          <Info label="Payment Reference" value={record.paymentReference} />
          <Info label="Distribution Status" value="Paid" />
        </div>
        <div className="mt-4 rounded-md border border-slate-100 bg-slate-50/80 p-3">
          <p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-400">Manual payment recorded</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{record.adminNotes}</p>
        </div>
        <div className="mt-4 rounded-md border border-amber-100 bg-amber-50/70 p-3">
          <p className="text-sm leading-6 text-amber-900">This record confirms that manual payment has been recorded by PAPAIPAY. It does not represent an automated transfer executed by the platform.</p>
        </div>
      </ContentCard>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button disabled className="min-h-10 cursor-not-allowed rounded-md bg-slate-100 px-4 py-2 text-sm font-bold text-slate-400">Receipt unavailable in this UAT build</button>
        <Link href="/member/distributions" className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-papaipay-green hover:text-papaipay-green">Back to Distributions</Link>
      </div>
    </div>
  );
}
