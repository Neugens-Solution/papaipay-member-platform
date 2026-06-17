import { OpportunityCard } from "@/components/member/Cards";
import { opportunities } from "@/lib/memberMockData";

export default function OpportunitiesPage() {
  return (
    <div className="space-y-8">
      <header className="grid gap-5 lg:grid-cols-[1fr_minmax(18rem,38rem)] lg:items-end">
        <div><h1 className="text-2xl font-bold tracking-tight sm:text-[1.7rem]">Listings</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">Browse auction property listings with allocation progress and participation details.</p></div>
        <div className="grid gap-3 sm:grid-cols-3"><input className="min-h-11 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-slate-100 sm:col-span-3" placeholder="Search auction listings" /><select className="min-h-11 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-slate-100"><option>All Types</option><option>Terrace House</option><option>Apartment</option><option>Condominium</option><option>Shoplot</option></select><select className="min-h-11 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-slate-100"><option>All Statuses</option><option>Open</option><option>Closing Soon</option></select><select className="min-h-11 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-slate-100"><option>Any Tenure</option><option>Freehold</option><option>Leasehold</option></select></div>
      </header>
      <section className="grid gap-5 xl:grid-cols-3">{opportunities.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}</section>
    </div>
  );
}
