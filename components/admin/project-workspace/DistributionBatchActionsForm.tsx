"use client";

import { useFormState, useFormStatus } from "react-dom";
import { approveDistributionBatchAction, saveDraftDistributionBatchAction, type DistributionBatchActionState } from "@/lib/admin/project-distributions-actions";

const initialState: DistributionBatchActionState = { status: "idle", message: null, errors: [] };

function SubmitButton({ disabled, label, pendingLabel, activeClass }: { disabled: boolean; label: string; pendingLabel: string; activeClass: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={disabled || pending}
      className={disabled || pending ? "cursor-not-allowed rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-400" : activeClass}
      type="submit"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

export function DistributionBatchActionsForm({
  campaignId,
  settlementId,
  batchId,
  saveDisabled,
  draftSaved,
  approveDisabled,
  approved,
}: {
  campaignId: string;
  settlementId?: string | null;
  batchId?: string | null;
  saveDisabled: boolean;
  draftSaved: boolean;
  approveDisabled: boolean;
  approved: boolean;
}) {
  const [saveState, saveAction] = useFormState(saveDraftDistributionBatchAction, initialState);
  const [approveState, approveAction] = useFormState(approveDistributionBatchAction, initialState);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <form action={saveAction}>
          <input type="hidden" name="campaignId" value={campaignId} />
          <input type="hidden" name="settlementId" value={settlementId ?? ""} />
          <SubmitButton disabled={saveDisabled} label={draftSaved ? "Draft Batch Saved" : "Save Draft Batch"} pendingLabel="Saving Draft…" activeClass="rounded-lg border border-papaipay-green bg-papaipay-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-papaipay-green/90" />
        </form>
        <form action={approveAction}>
          <input type="hidden" name="campaignId" value={campaignId} />
          <input type="hidden" name="settlementId" value={settlementId ?? ""} />
          <input type="hidden" name="batchId" value={batchId ?? ""} />
          <SubmitButton disabled={approveDisabled} label={approved ? "Approved" : "Approve Distribution"} pendingLabel="Approving…" activeClass="rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700" />
        </form>
        <button disabled className="cursor-not-allowed rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-400" type="button">Mark Paid</button>
      </div>
      {saveState.status === "success" ? <p className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-papaipay-green">{saveState.message}</p> : null}
      {saveState.status === "error" ? <p className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{saveState.message}</p> : null}
      {approveState.status === "success" ? <p className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-papaipay-green">{approveState.message}</p> : null}
      {approveState.status === "error" ? <p className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{approveState.message}</p> : null}
    </div>
  );
}
