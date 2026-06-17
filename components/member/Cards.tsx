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
    <ContentCard className="p-4 sm:p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold tracking-tight text-papaipay-ink">{value}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{helper}</p>
    </ContentCard>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="h-2.5 overflow-hidden rounded-md bg-slate-100"><div className="h-full rounded-md bg-papaipay-green" style={{ width: `${Math.min(value, 100)}%` }} /></div>;
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const progress = Math.round((opportunity.collectedAmount / opportunity.targetAmount) * 100);
  const daysRemaining = Math.max(0, Math.ceil((new Date(opportunity.closeDate).getTime() - new Date("2026-06-17").getTime()) / 86400000));
  const statusLabel = opportunity.status.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <Link href={`/member/opportunities/${opportunity.slug}`} className="group overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-slate-300">
      <div className="relative h-44 bg-cover bg-center sm:h-48" style={{ backgroundImage: `url(${opportunity.imageUrl})` }}>
        <span className="absolute left-3 top-3 rounded-md bg-white/95 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-papaipay-green">{statusLabel}</span>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-lg font-bold tracking-tight group-hover:text-papaipay-green">{opportunity.title}</h3>
          <p className="mt-1 text-sm text-slate-500">{opportunity.location}</p>
        </div>
        <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2"><Info label="Property Type" value={opportunity.propertyType} /><Info label="Participation Range" value={`RM${opportunity.minimumParticipation.toLocaleString()} - RM${opportunity.maximumParticipation.toLocaleString()}`} /></div>
        <div><div className="mb-2 flex justify-between text-sm font-bold"><span>Campaign Progress</span><span>{progress}%</span></div><ProgressBar value={progress} /><p className="mt-2 text-sm font-semibold text-slate-600">RM{opportunity.collectedAmount.toLocaleString()} / RM{opportunity.targetAmount.toLocaleString()}</p></div>
        <div className="grid gap-2 text-sm font-semibold text-slate-600 sm:grid-cols-2"><p>{opportunity.participants} Participants</p><p>{daysRemaining} Days Remaining</p><p>Closing Date: {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(opportunity.closeDate))}</p></div>
      </div>
    </Link>
  );
}

export function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-md border border-slate-100 bg-slate-50/80 p-3"><p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 font-bold text-slate-800">{value}</p></div>;
}
