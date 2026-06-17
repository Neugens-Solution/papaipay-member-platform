import Link from "next/link";
import { ContentCard, MetricCard, OpportunityCard } from "@/components/member/Cards";
import { announcements, dashboardMetrics, opportunities, recentUpdates } from "@/lib/memberMockData";

export default function MemberDashboardPage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{dashboardMetrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</section>
      <section>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-2xl font-bold">Auction Opportunities</h2><Link href="/member/opportunities" className="min-h-11 rounded-md px-1 py-2 text-sm font-bold text-papaipay-green">View all</Link></div>
        <div className="grid gap-6 xl:grid-cols-3">{opportunities.slice(0, 3).map((opportunity) => <OpportunityCard key={opportunity.id} opportunity={opportunity} />)}</div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        <ContentCard><h2 className="text-2xl font-bold">Recent Updates</h2><div className="mt-5 space-y-4">{recentUpdates.map((item) => <article key={item.title} className="rounded-lg border border-slate-100 bg-slate-50/80 p-4"><p className="text-sm font-semibold text-papaipay-green">{item.date}</p><h3 className="mt-1 font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p></article>)}</div></ContentCard>
        <ContentCard><h2 className="text-2xl font-bold">Announcements</h2><div className="mt-5 space-y-4">{announcements.map((item) => <article key={item.title} className="rounded-lg border border-slate-100 bg-slate-50/80 p-4"><p className="text-sm font-semibold text-papaipay-green">{item.date}</p><h3 className="mt-1 font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p></article>)}</div></ContentCard>
      </section>
    </div>
  );
}
