import { Card, KpiCard, PageHeader } from "@/components/admin/AdminUI";
import { adminKpis, exportCentreItems, reportGroups } from "@/lib/adminMockData";

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader eyebrow="Reports" title="Reports & Analytics" description="Member, participation, listing and distribution reporting with placeholder export actions." />

      <Card>
        <h2 className="text-lg font-bold tracking-tight">Export Centre</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {exportCentreItems.map((item) => <button key={item} className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-4 text-left text-sm font-bold text-papaipay-ink transition hover:border-papaipay-green/40 hover:bg-emerald-50/40">{item}<span className="mt-1 block text-xs font-medium text-slate-500">Generate export</span></button>)}
        </div>
      </Card>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">{adminKpis.slice(0, 4).map((kpi) => <KpiCard key={kpi.label} {...kpi} />)}</section>
      <section className="grid gap-4 lg:grid-cols-2">{reportGroups.map((group, index) => <Card key={group}><div className="flex items-start justify-between gap-3"><div><h2 className="text-lg font-bold">{group}</h2><p className="mt-2 text-sm leading-6 text-slate-500">Analytics summary, trend chart placeholder and filters for {group.toLowerCase()}.</p></div><button className="rounded-md border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600">Export</button></div><div className="mt-6 flex h-40 items-end gap-2">{[42, 65, 51, 74, 60, 88].map((height, bar) => <div key={bar} className="flex-1 rounded-t-lg bg-papaipay-green/70" style={{ height: `${height - index * 4}%` }} />)}</div></Card>)}</section>
    </div>
  );
}
