import { OpportunityCard } from "@/components/member/Cards";
import { opportunities } from "@/lib/memberMockData";

export default function OpportunitiesPage() {
  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.26em] text-papaipay-green">Discover</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Auction Opportunities</h2><p className="mt-3 max-w-2xl text-slate-600">Browse auction property examples with campaign status, allocation progress, and participation details.</p></div>
        <div className="grid gap-3 sm:grid-cols-3 lg:w-[38rem]"><input className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-slate-100 sm:col-span-3" placeholder="Search auction properties, cities, or types" /><select className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-slate-100"><option>All Types</option><option>Serviced Residence</option><option>Shoplot</option><option>Industrial Lot</option></select><select className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-slate-100"><option>All Statuses</option><option>Open</option><option>Closing Soon</option></select><select className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-slate-100"><option>Any Tenure</option><option>Freehold</option><option>Leasehold</option></select></div>
      </section>
      <section className="grid gap-6 xl:grid-cols-3">{opportunities.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}</section>
    </div>
  );
}
