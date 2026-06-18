import { MetricCard } from "@/components/member/Cards";
import { dashboardMetrics } from "@/lib/memberMockData";

export default function MemberDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-papaipay-ink sm:text-3xl">Dashboard</h1>
      </header>

      <section aria-label="Member performance summary" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {dashboardMetrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>
    </div>
  );
}
