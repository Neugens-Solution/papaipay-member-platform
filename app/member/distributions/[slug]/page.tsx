import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentCard, Info, StatusBadge } from "@/components/member/Cards";
import { distributionRecords, formatRM } from "@/lib/memberMockData";

const timeline = ["Pending", "Processing", "Paid", "Completed"];

export function generateStaticParams() {
  return distributionRecords.map((record) => ({ slug: record.slug }));
}

export default function Page({ params }: { params: { slug: string } }) {
  const record = distributionRecords.find((item) => item.slug === params.slug);
  if (!record) notFound();

  const currentIndex = timeline.indexOf(record.status);

  return (
    <div className="space-y-6">
      <Link href="/member/distributions" className="inline-flex items-center rounded-md text-sm font-bold text-papaipay-green hover:text-papaipay-ink">← Back to Distributions</Link>
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[1.7rem]">{record.propertyName}</h1>
          <p className="mt-2 text-sm text-slate-600">{record.location}</p>
        </div>
        <StatusBadge status={record.status} />
      </header>

      <ContentCard>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Info label="Property Name" value={record.propertyName} />
          <Info label="Location" value={record.location} />
          <Info label="Participation Amount" value={formatRM(record.participationAmount)} />
          <Info label="Distribution Amount" value={formatRM(record.distributionAmount)} />
          <Info label="Distribution Status" value={record.status} />
          <Info label="Paid Date" value={record.paidDate} />
          <Info label="Reference Number" value={record.referenceNumber} />
        </div>
        <div className="mt-4 rounded-md border border-slate-100 bg-slate-50/80 p-3">
          <p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-400">Notes</p>
          <p className="mt-1 text-sm leading-6 text-slate-700">{record.notes}</p>
        </div>
      </ContentCard>

      <ContentCard>
        <h2 className="text-base font-bold">Distribution Timeline</h2>
        <div className="mt-4 space-y-3">
          {timeline.map((step, index) => (
            <div key={step} className="flex items-center gap-3">
              <span className={`grid h-7 w-7 place-items-center rounded-md text-xs font-bold ${index <= currentIndex ? "bg-papaipay-green text-white" : "bg-slate-100 text-slate-400"}`}>{index + 1}</span>
              <span className={`text-sm font-semibold ${index <= currentIndex ? "text-papaipay-ink" : "text-slate-400"}`}>{step}</span>
            </div>
          ))}
        </div>
      </ContentCard>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="min-h-10 rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white">Download Receipt</button>
        <Link href="/member/distributions" className="inline-flex min-h-10 items-center justify-center rounded-md border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:border-papaipay-green hover:text-papaipay-green">Back to Distributions</Link>
      </div>
    </div>
  );
}
