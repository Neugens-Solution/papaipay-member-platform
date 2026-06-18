import Link from "next/link";
import { ContentCard, MetricCard, StatusBadge } from "@/components/member/Cards";
import { announcements, dashboardMetrics, myProperties, recentUpdates } from "@/lib/memberMockData";

export default function MemberDashboardPage() {
  return (
    <div className="space-y-6">
      <header className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-[1.7rem]">Dashboard</h1>
      </header>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
        {dashboardMetrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </section>

      <ContentCard>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold sm:text-xl">My Properties</h2>
          <Link href="/member/opportunities" className="rounded-md px-2 py-2 text-sm font-bold text-papaipay-green">View Listings</Link>
        </div>
        <div className="space-y-3">
          {myProperties.map((item) => (
            <article key={item.name} className="rounded-md border border-slate-100 bg-slate-50/70 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{item.location}</p>
                </div>
                <StatusBadge status={item.status} />
              </div>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <p><span className="font-semibold text-slate-500">Participation Amount:</span> {item.amount}</p>
                <p><span className="font-semibold text-slate-500">Latest Update:</span> {item.latestUpdate}</p>
              </div>
            </article>
          ))}
        </div>
      </ContentCard>

      <section className="grid gap-5 lg:grid-cols-2">
        <ContentCard><h2 className="text-lg font-bold sm:text-xl">Recent Updates</h2><div className="mt-4 space-y-3">{recentUpdates.map((item) => <article key={item.title} className="rounded-md border border-slate-100 bg-slate-50/70 p-4"><p className="text-sm font-semibold text-papaipay-green">{item.date}</p><h3 className="mt-1 font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p></article>)}</div></ContentCard>
        <ContentCard><h2 className="text-lg font-bold sm:text-xl">Announcements</h2><div className="mt-4 space-y-3">{announcements.map((item) => <article key={item.title} className="rounded-md border border-slate-100 bg-slate-50/70 p-4"><p className="text-sm font-semibold text-papaipay-green">{item.date}</p><h3 className="mt-1 font-bold">{item.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p></article>)}</div></ContentCard>
      </section>
    </div>
  );
}
