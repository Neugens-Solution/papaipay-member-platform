import Link from "next/link";
import { ContentCard, OpportunityCard } from "@/components/member/Cards";
import { announcements, opportunities, recentUpdates } from "@/lib/memberMockData";

export default function MemberDashboardPage() {
  return (
    <div className="space-y-10">
      <header className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-[1.7rem]">Dashboard</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">A clean snapshot of your auction participation activity.</p>
      </header>
      <section>
        <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl font-bold">Listings</h2><Link href="/member/opportunities" className="min-h-11 rounded-md px-2 py-2 text-sm font-bold text-papaipay-green">View all</Link></div>
        <div className="grid gap-5 xl:grid-cols-3">{opportunities.slice(0, 3).map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}</div>
      </section>
      <section className="grid gap-5 lg:grid-cols-2">
        <ContentCard><h2 className="text-xl font-bold">Recent Updates</h2><div className="mt-4 space-y-3">{recentUpdates.map((item) => <article key={item.title} className="rounded-md border border-slate-100 bg-slate-50/70 p-4"><p className="text-sm font-semibold text-papaipay-green">{item.date}</p><h3 className="mt-1 font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p></article>)}</div></ContentCard>
        <ContentCard><h2 className="text-xl font-bold">Announcements</h2><div className="mt-4 space-y-3">{announcements.map((item) => <article key={item.title} className="rounded-md border border-slate-100 bg-slate-50/70 p-4"><p className="text-sm font-semibold text-papaipay-green">{item.date}</p><h3 className="mt-1 font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p></article>)}</div></ContentCard>
      </section>
    </div>
  );
}
