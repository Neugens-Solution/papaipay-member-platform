import Link from "next/link";
import type { Opportunity } from "@/lib/memberMockData";

export function StatusBadge({ status }: { status: string }) {
  return <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-emerald-700">{status}</span>;
}

export function ContentCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.06)] sm:p-6 ${className}`}>{children}</section>;
}

export function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <ContentCard className="transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-papaipay-ink sm:text-4xl">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
    </ContentCard>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="h-2.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-papaipay-green" style={{ width: `${Math.min(value, 100)}%` }} /></div>;
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const progress = Math.round((opportunity.fundedAmount / opportunity.targetAmount) * 100);
  return (
    <Link href={`/member/opportunities/${opportunity.slug}`} className="group overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)]">
      <div className="h-48 bg-cover bg-center sm:h-52" style={{ backgroundImage: `url(${opportunity.imageUrl})` }} />
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight group-hover:text-papaipay-green">{opportunity.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{opportunity.location}</p>
          </div>
          <StatusBadge status={opportunity.status} />
        </div>
        <p className="text-sm leading-6 text-slate-600">{opportunity.summary}</p>
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2"><Info label="Property Type" value={opportunity.propertyType} /><Info label="Tenure" value={opportunity.tenure} /><Info label="Unit Price" value={`$${opportunity.unitPrice.toLocaleString()}`} /><Info label="Available Units" value={opportunity.availableUnits.toString()} /></div>
        <div><div className="mb-2 flex justify-between text-sm font-bold"><span>Funding Progress</span><span>{progress}%</span></div><ProgressBar value={progress} /></div>
        <p className="text-sm font-semibold text-slate-500">Campaign ends {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(opportunity.closeDate))}</p>
      </div>
    </Link>
  );
}

export function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3"><p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 font-bold text-slate-800">{value}</p></div>;
}
