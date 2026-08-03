import { PendingLink } from "@/components/common/PendingLink";
import { OpportunityCard } from "@/components/member/Cards";
import { getMemberCampaignSummaries } from "@/lib/data/memberCampaigns";

const inputClass = "min-h-11 min-w-0 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm outline-none transition focus:border-papaipay-green/50 focus:ring-4 focus:ring-papaipay-green/10";
const tabs = ["open", "completed", "all"] as const;
type Tab = (typeof tabs)[number];

export default async function InvestmentOpportunitiesPage({ searchParams }: { searchParams?: Promise<{ tab?: string; q?: string; state?: string; asset?: string }> }) {
  const filters = await searchParams;
  const activeTab: Tab = tabs.includes(filters?.tab as Tab) ? (filters?.tab as Tab) : "open";
  const opportunities = await getMemberCampaignSummaries();
  const query = filters?.q?.trim().toLowerCase() || "";
  const selectedState = filters?.state || "";
  const selectedAsset = filters?.asset || "";
  const states = Array.from(new Set(opportunities.map((campaign) => campaign.state).filter(Boolean))).sort();
  const assets = Array.from(new Set(opportunities.map((campaign) => campaign.propertyType).filter(Boolean))).sort();
  const filtered = opportunities.filter((campaign) =>
    (!query || `${campaign.title} ${campaign.location} ${campaign.campaignCode}`.toLowerCase().includes(query)) &&
    (!selectedState || campaign.state === selectedState) &&
    (!selectedAsset || campaign.propertyType === selectedAsset),
  );
  const openCampaigns = filtered.filter((campaign) => campaign.status !== "closed");
  const completedCampaigns = filtered.filter((campaign) => campaign.status === "closed");
  const showOpen = activeTab === "open" || activeTab === "all";
  const showCompleted = activeTab === "completed" || activeTab === "all";

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-papaipay-green">Member Portal</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-papaipay-ink sm:text-3xl">Opportunities</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Browse property participation opportunities available to members.</p>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Opportunity tabs">
          {tabs.map((tab) => {
            const active = activeTab === tab;
            return <PendingLink key={tab} href={`/member/opportunities?tab=${tab}`} pendingLabel="Loading…" className={`rounded-full px-4 py-2 text-sm font-bold ${active ? "bg-papaipay-green text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{tab.replace(/^./, (character) => character.toUpperCase())}</PendingLink>;
          })}
        </nav>
        <form method="get" className="sticky top-[65px] z-10 -mx-4 grid gap-2 border-y border-slate-200/70 bg-[#f7f8f5]/95 px-4 py-3 backdrop-blur sm:top-[73px] sm:mx-0 sm:rounded-2xl sm:border sm:bg-white/90 sm:p-3 sm:shadow-[0_1px_2px_rgba(15,23,42,0.03)] md:grid-cols-[1.5fr_1fr_1fr_auto_auto]">
          <input type="hidden" name="tab" value={activeTab} />
          <input name="q" defaultValue={filters?.q || ""} className={inputClass} placeholder="Search name, location or code" aria-label="Search opportunities" />
          <select name="state" defaultValue={selectedState} className={inputClass} aria-label="Filter by state"><option value="">All states</option>{states.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          <select name="asset" defaultValue={selectedAsset} className={inputClass} aria-label="Filter by asset type"><option value="">All asset types</option>{assets.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          <button type="submit" className="min-h-11 rounded-xl bg-papaipay-green px-5 text-sm font-bold text-white">Apply</button>
          <PendingLink href={`/member/opportunities?tab=${activeTab}`} pendingLabel="Resetting…" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600">Reset</PendingLink>
        </form>
      </header>

      {showOpen ? <CampaignGrid title="Open Opportunities" campaigns={openCampaigns} empty="No open opportunities match the current filters." /> : null}
      {showCompleted ? <CampaignGrid title="Completed Opportunities" campaigns={completedCampaigns} empty="No completed opportunities match the current filters." /> : null}
    </div>
  );
}

function CampaignGrid({ title, campaigns, empty }: { title: string; campaigns: Awaited<ReturnType<typeof getMemberCampaignSummaries>>; empty: string }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-papaipay-ink">{title}</h2>
      {campaigns.length ? <div className="grid gap-5 xl:grid-cols-3">{campaigns.map((campaign) => <OpportunityCard key={campaign.id} opportunity={campaign} />)}</div> : <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">{empty}</p>}
    </section>
  );
}
