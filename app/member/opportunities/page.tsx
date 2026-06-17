import { OpportunityCard } from "@/components/member/Cards";
import { opportunities } from "@/lib/memberMockData";

export default function OpportunitiesPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 rounded-[2.5rem] bg-white p-6 shadow-soft lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-sm font-semibold uppercase tracking-[0.3em] text-papaipay-green">Discover</p><h2 className="mt-3 text-4xl font-bold">Open Opportunities</h2><p className="mt-3 max-w-2xl text-slate-600">Browse realistic mock opportunities with campaign status, allocation progress, and participation details.</p></div>
        <div className="grid gap-3 sm:grid-cols-3 lg:w-[38rem]"><input className="rounded-2xl border border-slate-200 px-4 py-3 sm:col-span-3" placeholder="Search properties, cities, or types" /><select className="rounded-2xl border border-slate-200 px-4 py-3"><option>All Types</option><option>Multifamily</option><option>Logistics</option></select><select className="rounded-2xl border border-slate-200 px-4 py-3"><option>All Statuses</option><option>Open</option><option>Closing Soon</option></select><select className="rounded-2xl border border-slate-200 px-4 py-3"><option>Any Tenure</option><option>30-36 months</option><option>48 months</option></select></div>
      </section>
      <section className="grid gap-6 xl:grid-cols-3">{opportunities.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}</section>
    </div>
  );
}
