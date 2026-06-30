import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard, Info } from "@/components/member/Cards";
import { portfolioRecords, type PortfolioStatus } from "@/lib/memberMockData";

const timeline = ["Listing Opened", "Property Secured", "Renovation In Progress", "Listed For Sale", "Under Offer", "Sold", "Distribution Processing", "Completed"];
const formatRM = (value: number) => `RM${value.toLocaleString()}`;

function statusClasses(status: PortfolioStatus) {
  if (status === "Listing Opened") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "Distribution Processing") return "border-purple-200 bg-purple-50 text-purple-700";
  if (status === "Completed") return "border-green-200 bg-green-50 text-green-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

export function generateStaticParams() { return portfolioRecords.map((record) => ({ slug: record.slug })); }

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const record = portfolioRecords.find((item) => item.slug === params.slug);
  if (!record) notFound();
  const currentIndex = timeline.findIndex((item) => item === record.status);
  const canShowDistributionSummary = record.distributionStatus === "Paid" && record.distributionBatchStatus === "Completed";
  return (
    <div className="space-y-5">
      <Link href="/member/portfolio" className="inline-flex items-center rounded-md text-sm font-bold text-papaipay-green hover:text-papaipay-ink">← Back to Portfolio</Link>
      <header className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div><p className="text-xs font-bold text-slate-400">{record.campaignId} • {record.campaignCode} • {record.participationId}</p><h1 className="text-2xl font-bold tracking-tight sm:text-[1.7rem]">{record.propertyName}</h1><p className="mt-1 text-sm text-slate-500">{record.location}</p></div>
          <span className={`inline-flex w-fit rounded-md border px-3 py-1 text-xs font-bold ${statusClasses(record.status)}`}>{record.status}</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3"><Info label="Participation Amount" value={formatRM(record.participationAmount)} /><Info label="Holding Period So Far" value={`${record.holdingPeriodMonths} months`} /><Info label="Accrued Holding Return" value={formatRM(record.accruedHoldingReturn)} /><Info label="Current Status" value={record.status} /><Info label="Distribution Status" value={record.distributionStatus} /><Info label="24-Month Rule" value="After 24 months: principal only" /></div>
      </header>
      <section className="grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <div className="space-y-5">
          <ContentCard><h2 className="text-lg font-bold">Timeline</h2><ol className="mt-4 space-y-3">{timeline.map((item, index) => { const state = index < currentIndex ? "completed" : index === currentIndex ? "current" : "upcoming"; return <li key={item} className={`flex items-center justify-between rounded-xl border p-3 text-sm font-semibold ${state === "completed" ? "border-emerald-200 bg-emerald-50 text-papaipay-green" : state === "current" ? "border-papaipay-green/40 bg-white text-papaipay-ink shadow-[0_0_0_3px_rgba(70,148,85,0.10)]" : "border-slate-100 bg-slate-50 text-slate-400"}`}><span>{item}</span><span className={`grid h-6 w-6 place-items-center rounded-full text-xs ${state === "completed" ? "bg-papaipay-green text-white" : state === "current" ? "bg-papaipay-ink text-white" : "bg-slate-200 text-slate-400"}`}>{state === "completed" ? "✓" : index + 1}</span></li>; })}</ol></ContentCard>
          <ContentCard><h2 className="text-lg font-bold">Latest Updates</h2><div className="mt-4 space-y-3">{record.updates.map((update) => <article key={`${update.date}-${update.title}`} className="rounded-md border border-slate-100 bg-slate-50/70 p-4"><p className="text-sm font-bold text-papaipay-green">{update.date}</p><p className="mt-1 text-sm font-semibold text-slate-700">{update.title}</p></article>)}</div></ContentCard>
        </div>
        <aside className="space-y-5">
          {canShowDistributionSummary ? <ContentCard><h2 className="text-lg font-bold">Distribution Summary</h2><div className="mt-4 space-y-3"><Info label="Distribution ID" value={record.distributionId} /><Info label="Distribution Batch" value={record.distributionBatchId} /><Info label="Payment Reference" value={record.paymentReference} /><Info label="Status" value={record.distributionStatus} /><Info label="Principal Return" value={formatRM(record.principalReturn)} /><Info label="Holding Return" value={formatRM(record.holdingReturn)} /><Info label="Profit Distribution" value={formatRM(record.profitDistribution)} /><Info label="Final Distribution Total" value={formatRM(record.finalDistributionTotal)} /><Info label="Paid Date" value={record.paidDate ?? "Pending"} /><Info label="Admin Notes" value={record.adminNotes} /></div></ContentCard> : <ContentCard><h2 className="text-lg font-bold">Distribution Summary</h2><p className="mt-3 text-sm leading-6 text-slate-600">Distribution details are not available until payment completion.</p></ContentCard>}
          <ContentCard><h2 className="text-lg font-bold">Property Summary</h2><div className="mt-4 grid gap-3"><Info label="Property Type" value={record.property.propertyType} /><Info label="Tenure" value={record.property.tenure} /><Info label="Bumi Status" value={record.property.bumiStatus} /><Info label="Target Amount" value={formatRM(record.property.targetAmount)} /><Info label="Collected Amount" value={formatRM(record.property.collectedAmount)} /><Info label="Current Participants" value={`${record.property.currentParticipants}`} /></div><Link href="/member/opportunities" className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white hover:bg-papaipay-green/90">View Original Listing</Link><Link href="/member/portfolio" className="mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-papaipay-green hover:text-papaipay-green">Back to Portfolio</Link></ContentCard>
        </aside>
      </section>
    </div>
  );
}
