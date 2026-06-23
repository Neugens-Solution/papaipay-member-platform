import Link from "next/link";
import { portfolioRecords, type PortfolioStatus } from "@/lib/memberMockData";

const filters = ["All", "Listing Opened", "Active", "Processing", "Completed"];
const formatRM = (value: number) => `RM${value.toLocaleString()}`;

function statusClasses(status: PortfolioStatus) {
  if (status === "Listing Opened") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "Distribution Processing") return "border-purple-200 bg-purple-50 text-purple-700";
  if (status === "Completed") return "border-green-200 bg-green-50 text-green-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default function PortfolioPage() {
  return (
    <div className="space-y-5">
      <header><h1 className="text-2xl font-bold tracking-tight sm:text-[1.7rem]">Portfolio</h1></header>
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[["Total Participation", "RM125,000"], ["Active Properties", "4"], ["Distribution Processing", "RM3,200"], ["Distribution Received", "RM8,500"]].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4"><p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-500">{label}</p><p className="mt-2 text-lg font-bold text-papaipay-ink sm:text-xl">{value}</p></div>
        ))}
      </section>
      <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Portfolio filters">
        {filters.map((filter) => <button key={filter} className="whitespace-nowrap rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 first:border-papaipay-green first:bg-papaipay-green first:text-white hover:border-papaipay-green/40">{filter}</button>)}
      </nav>
      <section className="space-y-3" aria-label="Portfolio records">
        {portfolioRecords.map((record) => (
          <article key={record.slug} className="rounded-lg border border-slate-200 bg-white p-4 sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[1.4fr_2fr_auto] lg:items-center">
              <div><p className="text-xs font-bold text-slate-400">{record.campaignId} • {record.campaignCode} • {record.participationId}</p><h2 className="font-bold text-papaipay-ink">{record.propertyName}</h2><p className="mt-1 text-sm text-slate-500">{record.location}</p></div>
              <dl className="grid grid-cols-2 gap-3 text-sm xl:grid-cols-4">
                <div><dt className="text-xs font-bold uppercase text-slate-400">Participation Amount</dt><dd className="mt-1 font-bold text-slate-800">{formatRM(record.participationAmount)}</dd></div>
                <div><dt className="text-xs font-bold uppercase text-slate-400">Status</dt><dd className="mt-1"><span className={`inline-flex rounded-md border px-2 py-1 text-xs font-bold ${statusClasses(record.status)}`}>{record.status}</span></dd></div>
                <div><dt className="text-xs font-bold uppercase text-slate-400">Latest Update</dt><dd className="mt-1 font-semibold text-slate-700">{record.latestUpdate}</dd></div>
                <div><dt className="text-xs font-bold uppercase text-slate-400">Final Distribution</dt><dd className="mt-1 font-bold text-slate-800">{record.distributionStatus === "Completed" ? formatRM(record.finalDistributionTotal) : record.distributionStatus}</dd><p className="mt-1 text-xs text-slate-500">{record.holdingPeriodMonths} months held</p></div>
              </dl>
              <Link href={`/member/portfolio/${record.slug}`} className="inline-flex min-h-10 items-center justify-center rounded-md border border-papaipay-green px-4 py-2 text-sm font-bold text-papaipay-green hover:bg-papaipay-green hover:text-white">View Details</Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
