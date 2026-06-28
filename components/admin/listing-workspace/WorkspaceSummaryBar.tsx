"use client";

function formatDateTime(value?: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : new Intl.DateTimeFormat("en-MY", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

export function WorkspaceSummaryBar({
  listingStatus,
  readinessPercentage,
  lastUpdated,
}: {
  listingStatus: string;
  readinessPercentage?: number;
  lastUpdated?: string | null;
}) {
  return (
    <div className="grid gap-3 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50/80 to-white p-4 sm:grid-cols-3">
      <div>
        <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-400">
          Listing Status
        </p>
        <p className="mt-1 text-sm font-black text-papaipay-ink">
          {listingStatus}
        </p>
      </div>
      <div>
        <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-400">
          Workspace Readiness
        </p>
        <p className="mt-1 text-sm font-black text-papaipay-green">
          {typeof readinessPercentage === "number"
            ? `${readinessPercentage}% ready`
            : "Available after save"}
        </p>
      </div>
      <div>
        <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-slate-400">
          Last Saved / Updated
        </p>
        <p className="mt-1 text-sm font-black text-papaipay-ink">
          {formatDateTime(lastUpdated)}
        </p>
      </div>
    </div>
  );
}
