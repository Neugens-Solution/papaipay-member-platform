import Link from "next/link";
import { type PortfolioStatus } from "@/lib/memberMockData";
import { getMemberParticipations } from "@/lib/data/memberParticipations";
import { formatRMCompact, getAssetCategory, getOccupancyStatus, getPortfolioAllocation, getPortfolioSummary } from "@/lib/data/memberPortfolio";
import { ProgressBar } from "@/components/member/Cards";

const filters = ["All", "Submitted", "Pending Review", "Active"];

function statusClasses(status: PortfolioStatus | string) {
  if (status === "Submitted") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "Pending Review") return "border-amber-200 bg-amber-50 text-amber-700";
  if (status === "Active") return "border-green-200 bg-green-50 text-green-700";
  if (status === "Distribution Processing") return "border-purple-200 bg-purple-50 text-purple-700";
  if (status === "Completed") return "border-green-200 bg-green-50 text-green-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export default async function PortfolioPage() {
  const portfolioRecords = await getMemberParticipations();
  const summary = getPortfolioSummary(portfolioRecords);
  const allocation = getPortfolioAllocation(portfolioRecords);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <header className="rounded-[2rem] border border-slate-200/70 bg-white p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-papaipay-green">Portfolio</p>
        <div className="mt-3 max-w-3xl"><h1 className="text-3xl font-semibold tracking-[-0.045em] text-papaipay-ink sm:text-5xl">Your participation portfolio.</h1><p className="mt-4 text-base leading-7 text-slate-500">A consolidated view of participation amount, status, projected holding return details, property category, occupancy and submission history.</p></div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Portfolio summary">
        {[
          ["Total Participation", summary.totalParticipationLabel, "Across all submitted records"],
          ["Projected Holding Return", summary.estimatedAnnualYield, "Projected holding return based on current participation records"],
          ["Current Status", summary.currentStatus, "Most relevant portfolio state"],
          ["Pending Review", String(summary.pendingReviewCount), "Items awaiting review"],
        ].map(([label, value, helper]) => <div key={label} className="rounded-2xl border border-slate-200/70 bg-white p-5"><p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p><p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-papaipay-ink">{value}</p><p className="mt-2 text-sm text-slate-500">{helper}</p></div>)}
      </section>

      <section className="rounded-2xl border border-slate-200/70 bg-white p-5 sm:p-6" aria-label="Portfolio allocation">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Allocation</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-papaipay-ink">Asset category breakdown</h2></div><p className="text-sm text-slate-500">Grouped by portfolio participation amount.</p></div>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">{allocation.map((item) => <div key={item.category} className="rounded-2xl bg-slate-50 p-4"><div className="mb-3 flex items-center justify-between text-sm font-semibold"><span>{item.category}</span><span>{item.percentage}%</span></div><ProgressBar value={item.percentage} /><p className="mt-3 text-sm text-slate-500">{formatRMCompact(item.amount)}</p></div>)}</div>
      </section>

      <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Portfolio filters">
        {filters.map((filter) => <button key={filter} className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 first:border-papaipay-green first:bg-papaipay-green first:text-white hover:border-papaipay-green/40">{filter}</button>)}
      </nav>

      <section className="grid gap-4 lg:grid-cols-2" aria-label="Portfolio records">
        {portfolioRecords.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center lg:col-span-2"><h2 className="text-xl font-semibold text-papaipay-ink">No participation records yet.</h2><p className="mt-2 text-sm text-slate-500">Browse opportunities and submit a participation to begin building your portfolio.</p><Link href="/member/opportunities" className="mt-5 inline-flex rounded-full bg-papaipay-green px-5 py-3 text-sm font-bold text-white">Browse Opportunities</Link></div>
        ) : portfolioRecords.map((record) => (
          <article key={record.slug} className="rounded-[1.5rem] border border-slate-200/80 bg-white p-5 shadow-[0_10px_40px_rgba(15,23,42,0.04)] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{record.campaignCode} • {record.participationId}</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-papaipay-ink">{record.propertyName}</h2><p className="mt-1 text-sm text-slate-500">{record.location}</p></div><span className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-bold ${statusClasses(record.status)}`}>{record.status}</span></div>
            <dl className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
              <Info label="Total participation" value={formatRMCompact(record.participationAmount)} />
              <Info label="Projected Holding Return" value={record.estimatedYield ?? summary.estimatedAnnualYield} />
              <Info label="Current status" value={String(record.status)} />
              <Info label="Asset category" value={getAssetCategory(record)} />
              <Info label="Occupancy status" value={getOccupancyStatus(record)} />
              <Info label="Submission date" value={record.dateSubmitted ?? record.latestUpdate} />
            </dl>
            <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-500">Latest: <span className="font-semibold text-slate-700">{record.latestUpdate}</span></p><Link href={record.slug.startsWith("par-") || record.slug.length > 20 ? `/member/participations/${record.slug}` : `/member/portfolio/${record.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-full border border-papaipay-green px-5 py-2 text-sm font-bold text-papaipay-green transition hover:bg-papaipay-green hover:text-white">View Details</Link></div>
          </article>
        ))}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 p-3"><dt className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-400">{label}</dt><dd className="mt-1 font-semibold text-slate-800">{value}</dd></div>;
}
