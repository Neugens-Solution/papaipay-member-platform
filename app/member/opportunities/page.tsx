import { OpportunityCard } from "@/components/member/Cards";
import { opportunities } from "@/lib/memberMockData";

export default function OpportunitiesPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-2xl font-bold tracking-tight sm:text-[1.7rem]">Listings</h1>
        <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_1fr]"><input className="min-h-11 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-slate-100" placeholder="Search" /><select className="min-h-11 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-slate-100"><option>State</option><option>Selangor</option><option>Kuala Lumpur</option><option>Negeri Sembilan</option><option>Perak</option></select><select className="min-h-11 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-slate-100"><option>Property Type</option><option>Terrace House</option></select><select className="min-h-11 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-papaipay-green focus:ring-4 focus:ring-slate-100"><option>Status</option><option>Open</option><option>Closing Soon</option><option>Closed</option></select></div>
      </header>
      <section className="grid gap-5 xl:grid-cols-3">{opportunities.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}</section>
    </div>
  );
}
