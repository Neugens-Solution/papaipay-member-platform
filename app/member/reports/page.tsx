import { ContentCard, StatusBadge } from "@/components/member/Cards";
import { reportRecords } from "@/lib/memberMockData";

const categories = ["Participation Statements", "Distribution Statements", "Annual Summaries"];

export default function Page() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight sm:text-[1.7rem]">Reports</h1>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        {categories.map((category) => (
          <div key={category} className="rounded-lg border border-slate-200 bg-white p-4">
            <p className="text-sm font-bold text-papaipay-ink">{category}</p>
          </div>
        ))}
      </section>

      <ContentCard className="p-0">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <h2 className="text-base font-bold">Reports List</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {reportRecords.map((report) => (
            <div key={report.slug} className="grid gap-3 px-4 py-4 sm:px-5 lg:grid-cols-[1.4fr_0.8fr_0.9fr_0.8fr_auto_auto] lg:items-center">
              <div>
                <p className="text-sm font-bold text-papaipay-ink">{report.reportName}</p>
                <p className="mt-1 text-xs text-slate-500">{report.reportType}</p>
              </div>
              <ListField label="Period" value={report.period} />
              <ListField label="Generated Date" value={report.generatedDate} />
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400 lg:hidden">Status</p>
                <StatusBadge status={report.status} />
              </div>
              <button className="inline-flex min-h-10 items-center justify-center rounded-md border border-papaipay-green px-4 py-2 text-sm font-bold text-papaipay-green transition hover:bg-papaipay-green hover:text-white">View</button>
              <button className="min-h-10 rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white">Download</button>
            </div>
          ))}
        </div>
      </ContentCard>
    </div>
  );
}

function ListField({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-semibold text-slate-700">{value}</p></div>;
}
