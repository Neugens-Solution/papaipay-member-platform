import Link from "next/link";
import { OpportunityCard, StatusBadge } from "@/components/member/Cards";
import { completedCampaigns, opportunities, formatRM } from "@/lib/memberMockData";

const inputClass = "min-h-11 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm outline-none transition focus:border-papaipay-green/50 focus:ring-4 focus:ring-papaipay-green/10";
const tabs = ["open", "completed", "all"] as const;

type Tab = (typeof tabs)[number];

function FilterFields({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <select className={`${inputClass} ${compact ? "min-w-0 flex-1 px-3" : ""}`}><option>State</option><option>Selangor</option><option>Kuala Lumpur</option><option>Negeri Sembilan</option><option>Perak</option></select>
      <select className={`${inputClass} ${compact ? "min-w-0 flex-1 px-3" : ""}`}><option>Property Type</option><option>Terrace House</option></select>
      <select className={`${inputClass} ${compact ? "min-w-0 flex-1 px-3" : ""}`}><option>Status</option><option>Open</option><option>Closing Soon</option><option>Closed</option></select>
    </>
  );
}

export default function ListingsPage({ searchParams }: { searchParams?: { tab?: string } }) {
  const activeTab: Tab = tabs.includes(searchParams?.tab as Tab) ? (searchParams?.tab as Tab) : "open";
  const openCampaigns = opportunities.filter((campaign) => campaign.status !== "closed");
  const showOpen = activeTab === "open" || activeTab === "all";
  const showCompleted = activeTab === "completed" || activeTab === "all";

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-papaipay-ink sm:text-3xl">Listings</h1>
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Listing tabs">
          {tabs.map((tab) => {
            const label = tab.replace(/^./, (char) => char.toUpperCase());
            const active = activeTab === tab;
            return <Link key={tab} href={`/member/opportunities?tab=${tab}`} className={`rounded-full px-4 py-2 text-sm font-bold ${active ? "bg-papaipay-green text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{label}</Link>;
          })}
        </div>
        <div className="sticky top-[65px] z-10 -mx-4 border-y border-slate-200/70 bg-[#f7f8f5]/95 px-4 py-3 backdrop-blur sm:top-[73px] sm:mx-0 sm:rounded-2xl sm:border sm:bg-white/90 sm:p-3 sm:shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className="flex gap-2 md:grid md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-3">
            <input className={`${inputClass} min-w-0 flex-1`} placeholder="Search Listings" />
            <div className="hidden md:contents"><FilterFields /></div>
            <details className="group md:hidden">
              <summary className="inline-flex min-h-11 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200/80 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-papaipay-green/30 hover:text-papaipay-green">Filters</summary>
              <div className="fixed inset-x-0 bottom-0 z-40 rounded-t-3xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
                <h2 className="text-base font-semibold tracking-tight text-papaipay-ink">Filter Listings</h2>
                <div className="mt-4 grid gap-3"><FilterFields /></div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button type="button" className="min-h-11 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700">Reset</button>
                  <button type="button" className="min-h-11 rounded-xl bg-papaipay-green text-sm font-semibold text-white">Apply Filters</button>
                </div>
              </div>
            </details>
          </div>
        </div>
      </header>

      {showOpen ? <section className="grid gap-5 xl:grid-cols-3">{openCampaigns.map((campaign) => <OpportunityCard key={campaign.id} opportunity={campaign} />)}</section> : null}

      {showCompleted ? (
        <section className="space-y-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-papaipay-green">Completed</p>
            <h2 className="mt-2 text-xl font-bold">Campaign History</h2>
            <p className="mt-1 text-sm text-slate-600">Review completed campaigns and final distribution outcomes.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {completedCampaigns.map((campaign) => (
              <Link key={campaign.slug} href={`/member/opportunities/${campaign.slug}/outcome`} className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-papaipay-green/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-400">{campaign.campaignId} • {campaign.campaignCode}</p>
                    <h3 className="mt-1 text-lg font-bold">{campaign.campaignName}</h3>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2"><StatusBadge status={campaign.status} /><StatusBadge status="Distributed" /></div>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Summary label="Sale Price" value={formatRM(campaign.salePrice)} />
                  <Summary label="Holding Period" value={campaign.holdingPeriod} />
                  <Summary label="Holding Return" value={campaign.holdingReturn} />
                  <Summary label="Profit Distribution" value={campaign.profitDistribution} />
                  <Summary label="Total Distribution" value={campaign.totalDistribution} />
                  <Summary label="Final Distribution Amount" value={formatRM(campaign.finalDistributionAmount)} />
                  <Summary label="Distribution Date" value={campaign.distributionDate} />
                </dl>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return <div><dt className="text-xs font-bold uppercase text-slate-400">{label}</dt><dd className="mt-1 font-bold text-slate-800">{value}</dd></div>;
}
