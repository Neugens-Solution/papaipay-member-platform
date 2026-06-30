"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  approveProjectFinancialsAction,
  lockProjectFinancialsAction,
  markProjectFinancialsReviewedAction,
  type ProjectFinancialStatusActionState,
} from "@/lib/admin/project-financials/actions";
import { formatEnumLabel } from "@/lib/utils/formatters";

type SettlementActor = { email?: string | null } | null;

type FinancialApprovalStatusCardProps = {
  campaignId: string;
  settlement?: {
    calculationStatus: string;
    reviewedAt?: Date | string | null;
    reviewedBy?: SettlementActor;
    approvedAt?: Date | string | null;
    approvedBy?: SettlementActor;
    lockedAt?: Date | string | null;
    lockedBy?: SettlementActor;
  };
};

function statusBadgeClass(status: string) {
  const normalized = status.toLowerCase();

  if (["approved", "locked", "completed"].some((value) => normalized.includes(value))) {
    return "border-emerald-200 bg-emerald-50 text-papaipay-green";
  }

  if (["draft", "review"].some((value) => normalized.includes(value))) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-600";
}

function StatusBadge({ status, fallback = "Not started" }: { status?: string | null; fallback?: string }) {
  const label = status ? formatEnumLabel(status) : fallback;

  return (
    <span className={`inline-flex whitespace-nowrap rounded-md border px-2.5 py-1 text-[0.68rem] font-bold uppercase tracking-wide ${statusBadgeClass(label)}`}>
      {label}
    </span>
  );
}

function formatStatusDate(value?: string | Date | null) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function actorLabel(user?: SettlementActor) {
  return user?.email || "Unknown admin";
}

function financialStatusExplanation(status?: string | null) {
  if (status === "Draft") return "Draft financials can be edited before admin review.";
  if (status === "Reviewed") return "Reviewed financials can still be edited, but changes may require another review.";
  if (status === "Approved") return "Approved financials are validated for distribution preview. Edits are blocked until a future reopen workflow exists.";
  if (status === "Locked") return "Locked financials are ready for distribution preview and future batch processing. Edits are blocked.";
  return "Create a financial summary to begin the approval workflow.";
}

function ApprovalButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-papaipay-green px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-papaipay-ink disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

const initialState: ProjectFinancialStatusActionState = { status: "idle", message: null, errors: [] };

export function FinancialApprovalStatusCard({ campaignId, settlement }: FinancialApprovalStatusCardProps) {
  const status = settlement ? String(settlement.calculationStatus) : null;
  const action = status === "Draft" ? markProjectFinancialsReviewedAction : status === "Reviewed" ? approveProjectFinancialsAction : status === "Approved" ? lockProjectFinancialsAction : null;
  const actionLabel = status === "Draft" ? "Mark as Reviewed" : status === "Reviewed" ? "Approve Financials" : status === "Approved" ? "Lock Financials" : null;
  const [state, formAction] = useFormState(action ?? markProjectFinancialsReviewedAction, initialState);

  return (
    <div className="mt-6 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-papaipay-green">Financial Approval / Status</p>
          <div className="mt-2 flex items-center gap-3">
            <h3 className="text-lg font-black text-papaipay-ink">{status ? formatEnumLabel(status) : "No settlement"}</h3>
            <StatusBadge status={status} />
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{financialStatusExplanation(status)}</p>
        </div>
        {action && actionLabel ? (
          <form action={formAction}>
            <input type="hidden" name="campaignId" value={campaignId} />
            <ApprovalButton label={actionLabel} />
          </form>
        ) : status === "Locked" ? (
          <span className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-sm font-bold text-papaipay-green">Locked — no action available</span>
        ) : null}
      </div>

      {state.status === "success" ? (
        <p className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-semibold text-papaipay-green" role="status">
          {state.message || "Financial approval status updated."}
        </p>
      ) : null}
      {state.status === "error" ? (
        <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm font-semibold text-rose-700" role="alert">
          <p>{state.message || "Financial approval status could not be updated."}</p>
          {state.errors.length > 0 ? <ul className="mt-2 list-disc space-y-1 pl-5">{state.errors.map((error) => <li key={error}>{error}</li>)}</ul> : null}
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm">
          <span className="block text-xs font-bold uppercase tracking-wide text-slate-400">Reviewed</span>
          <span className="mt-1 block font-semibold text-slate-700">{settlement?.reviewedAt ? `${formatStatusDate(settlement.reviewedAt)} by ${actorLabel(settlement.reviewedBy)}` : "Not reviewed"}</span>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm">
          <span className="block text-xs font-bold uppercase tracking-wide text-slate-400">Approved</span>
          <span className="mt-1 block font-semibold text-slate-700">{settlement?.approvedAt ? `${formatStatusDate(settlement.approvedAt)} by ${actorLabel(settlement.approvedBy)}` : "Not approved"}</span>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm">
          <span className="block text-xs font-bold uppercase tracking-wide text-slate-400">Locked</span>
          <span className="mt-1 block font-semibold text-slate-700">{settlement?.lockedAt ? `${formatStatusDate(settlement.lockedAt)} by ${actorLabel(settlement.lockedBy)}` : "Not locked"}</span>
        </div>
      </div>
    </div>
  );
}
