import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard, Info, StatusBadge } from "@/components/member/Cards";
import { reportRecords, formatRM } from "@/lib/memberMockData";

export function generateStaticParams() {
  return reportRecords.map((report) => ({ slug: report.slug }));
}

export default function Page({ params }: { params: { slug: string } }) {
  const report = reportRecords.find((item) => item.slug === params.slug);
  if (!report) notFound();

  return (
    <div className="space-y-6">
      <Link href="/member/reports" className="inline-flex items-center rounded-md text-sm font-bold text-papaipay-green hover:text-papaipay-ink">← Back to Reports</Link>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[1.7rem]">{report.reportName}</h1>
          <p className="mt-2 text-sm text-slate-600">{report.period}</p>
        </div>
        <StatusBadge status={report.status} />
      </header>

      <ContentCard>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Info label="Report Name" value={report.reportName} />
          <Info label="Report Type" value={report.reportType} />
          <Info label="Period" value={report.period} />
          <Info label="Generated Date" value={report.generatedDate} />
          <Info label="Status" value={report.status} />
        </div>
      </ContentCard>

      <ContentCard>
        <h2 className="text-base font-bold">Mock Report Content</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <SummaryBlock title="Participation Summary" lines={[`Recorded Amount: ${formatRM(report.content.participationAmount)}`, `${report.content.participationRecords} auction residential property records`]} />
          <SummaryBlock title="Distribution Summary" lines={[`Recorded Amount: ${formatRM(report.content.distributionAmount)}`, report.content.distributionNote]} />
          <SummaryBlock title="Property Records" lines={report.content.propertyRecords} />
        </div>
      </ContentCard>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="min-h-10 rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white">Download PDF</button>
        <Link href="/member/reports" className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-papaipay-green hover:text-papaipay-green">Back to Reports</Link>
      </div>
    </div>
  );
}

function SummaryBlock({ title, lines }: { title: string; lines: string[] }) {
  return <section className="rounded-md border border-slate-100 bg-slate-50/80 p-4"><h3 className="text-sm font-bold text-papaipay-ink">{title}</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">{lines.map((line) => <li key={line}>{line}</li>)}</ul></section>;
}
