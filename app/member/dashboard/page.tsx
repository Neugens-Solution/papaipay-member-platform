import Link from "next/link";
import { MetricCard, ProgressBar, StatusBadge } from "@/components/member/Cards";
import { memberProfile } from "@/lib/memberMockData";
import { getMemberParticipations } from "@/lib/data/memberParticipations";
import { formatRMCompact, getAssetCategory, getPortfolioAllocation, getPortfolioSummary, getRecentActivities } from "@/lib/data/memberPortfolio";

const quickActions = [
  { label: "Browse Opportunities", href: "/member/opportunities", helper: "Review available property participations" },
  { label: "Portfolio", href: "/member/portfolio", helper: "Track active and submitted records" },
  { label: "Transactions", href: null, helper: "Coming soon in a future sprint" },
  { label: "Profile", href: "/member/profile", helper: "Manage member details" },
  { label: "Wallet", href: null, helper: "Coming soon in a future sprint" },
];

export default async function MemberDashboardPage() {
  const portfolioRecords = await getMemberParticipations();
  const summary = getPortfolioSummary(portfolioRecords);
  const allocation = getPortfolioAllocation(portfolioRecords);
  const activities = getRecentActivities(portfolioRecords);

  const metrics = [
    { label: "Total Portfolio Value", value: summary.totalParticipationLabel, helper: "Based on current participation records", trend: summary.currentStatus },
    { label: "Projected Holding Return", value: summary.estimatedAnnualYield, helper: "Projected holding return based on current participation records", trend: "Projected holding return based on current participation records" },
    { label: "Active Opportunities", value: String(summary.activeCount), helper: "Opportunities currently active or progressing", trend: `${portfolioRecords.length} total records` },
    { label: "Pending Review", value: String(summary.pendingReviewCount), helper: "Submitted items awaiting review", trend: summary.pendingReviewCount ? "Action may be required" : "No pending items" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 sm:space-y-10">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-papaipay-green">Good Morning, {memberProfile.firstName}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.045em] text-papaipay-ink sm:text-5xl">Welcome back.</h1>
          <p className="mt-4 text-base leading-7 text-slate-500 sm:text-lg">Here&apos;s your participation overview.</p>
        </div>
      </section>

      <section aria-label="Portfolio summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.4fr]">
        <section className="rounded-2xl border border-slate-200/70 bg-white p-5 sm:p-6" aria-label="Portfolio allocation">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Portfolio Allocation</p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-papaipay-ink">By asset category</h2>
            </div>
          </div>
          <div className="mt-6 space-y-5">
            {allocation.map((item) => (
              <div key={item.category}>
                <div className="mb-2 flex items-center justify-between text-sm font-semibold"><span>{item.category}</span><span>{item.percentage}%</span></div>
                <ProgressBar value={item.percentage} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/70 bg-white p-5 sm:p-6" aria-label="My opportunities">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">My Opportunities</p><h2 className="mt-2 text-xl font-semibold tracking-tight text-papaipay-ink">Participated opportunities</h2></div>
            <Link href="/member/portfolio" className="text-sm font-bold text-papaipay-green">View all</Link>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {portfolioRecords.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center"><h3 className="font-semibold">Your portfolio is ready.</h3><p className="mt-2 text-sm text-slate-500">Browse opportunities to submit your first participation.</p></div> : portfolioRecords.slice(0, 4).map((record) => (
              <article key={record.slug} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold text-slate-400">{getAssetCategory(record)}</p><h3 className="mt-1 font-semibold text-papaipay-ink">{record.propertyName}</h3></div><StatusBadge status={String(record.status)} /></div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-slate-500">Participation</dt><dd className="font-semibold">{formatRMCompact(record.participationAmount)}</dd></div><div><dt className="text-slate-500">Projected Return</dt><dd className="font-semibold">{record.estimatedYield}</dd></div><div><dt className="text-slate-500">Submitted</dt><dd className="font-semibold">{record.dateSubmitted}</dd></div></dl>
                <Link href={record.slug.startsWith("par-") || record.slug.length > 20 ? `/member/participations/${record.slug}` : `/member/portfolio/${record.slug}`} className="mt-4 inline-flex text-sm font-bold text-papaipay-green">View Details →</Link>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200/70 bg-white p-5 sm:p-6" aria-label="Recent activity"><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Recent Activity</p><div className="mt-6 space-y-5">{activities.map((activity, index) => <div key={`${activity.title}-${index}`} className="flex gap-4"><span className="mt-1 h-2.5 w-2.5 rounded-full bg-papaipay-green ring-4 ring-emerald-50" /><div><h3 className="font-semibold text-papaipay-ink">{activity.title}</h3><p className="text-sm text-slate-500">{activity.body}</p><p className="mt-1 text-xs font-semibold text-slate-400">{activity.date}</p></div></div>)}</div></section>
        <section className="rounded-2xl border border-slate-200/70 bg-white p-5 sm:p-6" aria-label="Quick actions"><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Quick Actions</p><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">{quickActions.map((action) => action.href ? <Link key={action.label} href={action.href} className="rounded-2xl border border-slate-200 p-4 transition hover:border-papaipay-green/40 hover:bg-emerald-50/40"><span className="font-semibold">{action.label}</span><p className="mt-1 text-sm text-slate-500">{action.helper}</p></Link> : <button key={action.label} type="button" disabled className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-left opacity-70"><span className="font-semibold">{action.label}</span><p className="mt-1 text-sm text-slate-500">{action.helper}</p></button>)}</div></section>
      </div>
    </div>
  );
}
