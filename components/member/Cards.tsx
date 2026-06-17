import Link from "next/link";
import type { Opportunity } from "@/lib/memberMockData";

export function StatusBadge({ status }: { status: string }) {
  return <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-papaipay-green">{status}</span>;
}

export function ContentCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-slate-200 bg-white p-5 sm:p-6 ${className}`}>{children}</section>;
}

export function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <ContentCard className="">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-bold tracking-tight text-papaipay-ink">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
    </ContentCard>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="h-2.5 overflow-hidden rounded-md bg-slate-100"><div className="h-full rounded-md bg-papaipay-green" style={{ width: `${Math.min(value, 100)}%` }} /></div>;
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const progress = Math.round((opportunity.participationAmount / opportunity.targetAmount) * 100);
  return (
    <Link href={`/member/opportunities/${opportunity.slug}`} className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-slate-300">
      <div className="h-44 bg-cover bg-center sm:h-48" style={{ backgroundImage: `url(${opportunity.imageUrl})` }} />
      <div className="space-y-4 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight group-hover:text-papaipay-green">{opportunity.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{opportunity.location}</p>
          </div>
          <StatusBadge status={opportunity.status} />
        </div>
        <p className="text-sm leading-6 text-slate-600">{opportunity.summary}</p>
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2"><Info label="Auction Type" value={opportunity.propertyType} /><Info label="Tenure" value={opportunity.tenure} /><Info label="Minimum Participation" value={`RM ${opportunity.minimumParticipation.toLocaleString()}`} /><Info label="Maximum Participation" value={`RM ${opportunity.maximumParticipation.toLocaleString()}`} /></div>
        <div><div className="mb-2 flex justify-between text-sm font-bold"><span>Campaign Progress</span><span>{progress}%</span></div><ProgressBar value={progress} /></div>
        <p className="text-sm font-semibold text-slate-500">Campaign ends {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(opportunity.closeDate))}</p>
      </div>
    </Link>
  );
}

export function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3"><p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 font-bold text-slate-800">{value}</p></div>;
}
