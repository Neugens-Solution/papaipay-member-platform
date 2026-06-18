import { Badge, Card, KpiCard, PageHeader, ProgressBar, TableWrap, Td, Th } from "@/components/admin/AdminUI";
import { adminKpis, distributions, listings, members, operationalSummary } from "@/lib/adminMockData";

const toneClasses: Record<string, string> = {
  slate: "bg-slate-50 text-slate-700 ring-slate-200",
  sand: "bg-papaipay-sand/60 text-slate-700 ring-slate-200",
  green: "bg-emerald-50/80 text-papaipay-green ring-emerald-100",
  mint: "bg-papaipay-mint/60 text-papaipay-green ring-emerald-100",
};

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <PageHeader title="Dashboard" description="A data-rich overview of members, listings, participation and distribution operations." />

      <section aria-label="Operational Summary" className="space-y-3">
        <h2 className="text-lg font-bold tracking-tight">Operational Summary</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {operationalSummary.map((item) => (
            <article key={item.label} className={`rounded-xl border border-slate-200/70 bg-white p-4 ring-1 ${toneClasses[item.tone]}`}>
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="Admin performance summary" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {adminKpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_.8fr]">
        <Card>
          <h2 className="text-lg font-bold tracking-tight">Distribution Overview</h2>
          <div className="mt-5 space-y-4">
            {distributions.map((distribution) => (
              <div key={distribution.id} className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-3">
                <div>
                  <p className="font-bold">{distribution.campaign}</p>
                  <p className="text-sm text-slate-500">{distribution.member} • {distribution.amount}</p>
                </div>
                <Badge>{distribution.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold tracking-tight">Monthly Participation</h2>
          <div className="mt-6 flex h-56 items-end gap-3">
            {[48, 62, 54, 72, 81, 68, 88, 76].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-lg bg-papaipay-green/80" style={{ height: `${height}%` }} />
                <span className="text-[0.65rem] font-bold text-slate-400">W{index + 1}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-bold tracking-tight">Recent Listings</h2>
          <div className="mt-4 space-y-3">
            {listings.slice(0, 3).map((listing) => (
              <div key={listing.slug}>
                <div className="flex justify-between text-sm">
                  <b>{listing.name}</b>
                  <span>{Math.round((listing.collected / listing.target) * 100)}%</span>
                </div>
                <ProgressBar value={(listing.collected / listing.target) * 100} />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-bold tracking-tight">Recent Member Registrations</h2>
          <TableWrap>
            <thead><tr><Th>Name</Th><Th>Status</Th><Th>Joined</Th></tr></thead>
            <tbody>
              {members.slice(0, 4).map((member) => (
                <tr key={member.id} className="border-t border-slate-100"><Td>{member.name}</Td><Td><Badge>{member.status}</Badge></Td><Td>{member.joined}</Td></tr>
              ))}
            </tbody>
          </TableWrap>
        </Card>
      </section>
    </div>
  );
}
