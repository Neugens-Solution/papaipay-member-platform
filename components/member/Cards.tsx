import Link from "next/link";
import type { Opportunity } from "@/lib/memberMockData";

export function StatusBadge({ status }: { status: string }) {
  return <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-800">{status}</span>;
}

export function ContentCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft ${className}`}>{children}</section>;
}

export function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return <ContentCard><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold">{value}</p><p className="mt-2 text-sm text-slate-500">{helper}</p></ContentCard>;
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-papaipay-green" style={{ width: `${Math.min(value, 100)}%` }} /></div>;
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const progress = Math.round((opportunity.fundedAmount / opportunity.targetAmount) * 100);
  return (
    <Link href={`/member/opportunities/${opportunity.slug}`} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <div className="h-52 bg-cover bg-center" style={{ backgroundImage: `url(${opportunity.imageUrl})` }} />
      <div className="space-y-4 p-6">
        <div className="flex items-start justify-between gap-3"><div><h3 className="text-xl font-bold group-hover:text-papaipay-green">{opportunity.title}</h3><p className="mt-1 text-sm text-slate-500">{opportunity.location}</p></div><StatusBadge status={opportunity.status} /></div>
        <p className="text-sm leading-6 text-slate-600">{opportunity.summary}</p>
        <div className="grid grid-cols-2 gap-3 text-sm"><Info label="Property Type" value={opportunity.propertyType} /><Info label="Tenure" value={opportunity.tenure} /><Info label="Unit Price" value={`$${opportunity.unitPrice.toLocaleString()}`} /><Info label="Available Units" value={opportunity.availableUnits.toString()} /></div>
        <div><div className="mb-2 flex justify-between text-sm font-semibold"><span>Funding Progress</span><span>{progress}%</span></div><ProgressBar value={progress} /></div>
        <p className="text-sm font-semibold text-slate-600">Campaign ends {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(opportunity.closeDate))}</p>
      </div>
    </Link>
  );
}

export function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 p-3"><p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 font-semibold text-slate-800">{value}</p></div>;
}
