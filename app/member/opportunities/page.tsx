import { OpportunityCard } from "@/components/member/Cards";
import { opportunities } from "@/lib/memberMockData";

const inputClass = "min-h-11 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm outline-none transition focus:border-papaipay-green/50 focus:ring-4 focus:ring-papaipay-green/10";

function FilterFields({ compact = false }: { compact?: boolean }) {
  return (
    <>
      <select className={`${inputClass} ${compact ? "min-w-0 flex-1 px-3" : ""}`}><option>State</option><option>Selangor</option><option>Kuala Lumpur</option><option>Negeri Sembilan</option><option>Perak</option></select>
      <select className={`${inputClass} ${compact ? "min-w-0 flex-1 px-3" : ""}`}><option>Property Type</option><option>Terrace House</option></select>
      <select className={`${inputClass} ${compact ? "min-w-0 flex-1 px-3" : ""}`}><option>Status</option><option>Open</option><option>Closing Soon</option><option>Closed</option></select>
    </>
  );
}

export default function OpportunitiesPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-papaipay-ink sm:text-3xl">Listings</h1>
        <div className="sticky top-[65px] z-10 -mx-4 border-y border-slate-200/70 bg-[#f7f8f5]/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
          <div className="flex gap-2 md:grid md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-3">
            <input className={`${inputClass} min-w-0 flex-1`} placeholder="Search listings" />
            <div className="hidden md:contents">
              <FilterFields />
            </div>
            <details className="group md:hidden">
              <summary className="inline-flex min-h-11 cursor-pointer list-none items-center justify-center rounded-xl border border-slate-200/80 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-papaipay-green/30 hover:text-papaipay-green">Filters</summary>
              <div className="fixed inset-x-0 bottom-0 z-40 rounded-t-3xl border border-slate-200 bg-white p-5 shadow-soft">
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200" />
                <h2 className="text-base font-semibold tracking-tight text-papaipay-ink">Filter Listings</h2>
                <div className="mt-4 grid gap-3">
                  <FilterFields />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <button type="button" className="min-h-11 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700">Reset</button>
                  <button type="button" className="min-h-11 rounded-xl bg-papaipay-green text-sm font-semibold text-white">Apply Filters</button>
                </div>
              </div>
            </details>
          </div>
        </div>
      </header>
      <section className="grid gap-5 xl:grid-cols-3">{opportunities.map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}</section>
    </div>
  );
}
