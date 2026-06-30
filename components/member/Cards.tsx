import { PendingLink } from "@/components/common/PendingLink";
import type { Opportunity } from "@/lib/memberMockData";

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-papaipay-green">
      {status}
    </span>
  );
}

export function ContentCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-xl border border-slate-200/70 bg-white p-5 sm:p-6 ${className}`}>{children}</section>;
}

export function MetricCard({ label, value, helper, trend }: { label: string; value: string; helper: string; trend?: string }) {
  return (
    <article className="min-w-0 rounded-2xl border border-slate-200/60 bg-white/85 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition hover:border-slate-300/80 sm:p-5">
      <p className="truncate text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-3 text-xl font-semibold tracking-[-0.04em] text-papaipay-ink sm:text-3xl">{value}</p>
      <p className="mt-2 text-[0.72rem] leading-5 text-slate-500 sm:text-sm">{helper}</p>
      {trend ? <p className="mt-4 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-[0.68rem] font-semibold text-papaipay-green">{trend}</p> : null}
    </article>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2.5 overflow-hidden rounded-md bg-slate-100">
      <div className="h-full rounded-md bg-papaipay-green" style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

function participantCountLabel(count: number) {
  return count === 1 ? "1 member participating" : `${count.toLocaleString()} members participating`;
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const progress = Math.round((opportunity.collectedAmount / opportunity.targetAmount) * 100);
  const detailHref = `/member/opportunities/${opportunity.slug}`;
  const statusLabel = opportunity.status.replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:border-slate-300">
      <PendingLink href={detailHref} pendingLabel="Opening..." className="group block">
        <div className={`relative grid h-44 place-items-center sm:h-48 ${opportunity.imageUrl ? "bg-cover bg-center" : "bg-slate-100"}`} style={opportunity.imageUrl ? { backgroundImage: `url(${opportunity.imageUrl})` } : undefined}>
          {!opportunity.imageUrl ? <div className="text-center"><p className="text-sm font-black text-slate-500">Image pending</p><p className="mt-1 text-xs font-semibold text-slate-400">Media will be available soon</p></div> : null}
          <span className="absolute left-3 top-3 rounded-md bg-white/95 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-papaipay-green">{statusLabel}</span>
        </div>
      </PendingLink>
      <div className="space-y-4 p-5">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-slate-400">Listing Reference: {opportunity.campaignId} • {opportunity.campaignCode}</p>
          <PendingLink href={detailHref} pendingLabel="Opening..." className="group">
            <h3 className="text-lg font-bold tracking-tight group-hover:text-papaipay-green">{opportunity.title}</h3>
          </PendingLink>
          <p className="mt-1 text-sm text-slate-500">{opportunity.location}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge status={opportunity.tenure} />
            <StatusBadge status={opportunity.bumiStatus} />
            {opportunity.isLaca ? <StatusBadge status="LACA" /> : null}
          </div>
        </div>

        <div>
          <ProgressBar value={progress} />
          <div className="mt-2 space-y-1 text-sm font-semibold text-slate-600">
            <p>RM{opportunity.collectedAmount.toLocaleString()} / RM{opportunity.targetAmount.toLocaleString()}</p>
            <p>{progress}% Listing Progress</p>
            <p>{participantCountLabel(opportunity.participants)}</p>
          </div>
        </div>

        <dl className="space-y-2 text-sm">
          <DetailRow label="Asset Category" value={opportunity.assetCategory} />
          <DetailRow label="Occupancy Status" value={opportunity.occupancyStatus} />
          <DetailRow label="Built-up" value={opportunity.builtUpArea} />
          <DetailRow label="Bedrooms / Bathrooms" value={`${opportunity.bedrooms} / ${opportunity.bathrooms}`} />
          <DetailRow label="Market Value" value={`RM${opportunity.marketValue.toLocaleString()}`} />
          <DetailRow label="Projected Holding Return" value={opportunity.estimatedYield} />
          <DetailRow label="Min / Max Participation Amount" value={`RM${opportunity.minimumParticipation.toLocaleString()} - RM${opportunity.maximumParticipation.toLocaleString()}`} />
        </dl>

        <PendingLink href={detailHref} pendingLabel="Opening..." className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-papaipay-green px-4 py-2 text-sm font-bold text-white transition hover:bg-papaipay-green/90">
          View Listing Details
        </PendingLink>
      </div>
    </article>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-slate-100 pt-2 first:border-t-0 first:pt-0">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-semibold text-slate-800">{value}</dd>
    </div>
  );
}

export function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50/80 p-3">
      <p className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-bold text-slate-800">{value}</p>
    </div>
  );
}
