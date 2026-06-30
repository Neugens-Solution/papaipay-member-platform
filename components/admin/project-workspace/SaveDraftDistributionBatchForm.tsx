"use client";

import { useFormState, useFormStatus } from "react-dom";
import { saveDraftDistributionBatchAction, type SaveDraftDistributionBatchState } from "@/lib/admin/project-distributions-actions";

const initialState: SaveDraftDistributionBatchState = { status: "idle", message: null, errors: [] };

function SubmitButton({ disabled, saved }: { disabled: boolean; saved: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={disabled || pending}
      className={disabled || pending ? "cursor-not-allowed rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-400" : "rounded-lg border border-papaipay-green bg-papaipay-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-papaipay-green/90"}
      type="submit"
    >
      {pending ? "Saving Draft…" : saved ? "Draft Batch Saved" : "Save Draft Batch"}
    </button>
  );
}

export function SaveDraftDistributionBatchForm({ campaignId, settlementId, disabled, saved }: { campaignId: string; settlementId?: string | null; disabled: boolean; saved: boolean }) {
  const [state, formAction] = useFormState(saveDraftDistributionBatchAction, initialState);
  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="campaignId" value={campaignId} />
      <input type="hidden" name="settlementId" value={settlementId ?? ""} />
      <div className="flex flex-wrap gap-3">
        <SubmitButton disabled={disabled} saved={saved} />
        <button disabled className="cursor-not-allowed rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-400" type="button">Approve Distribution</button>
        <button disabled className="cursor-not-allowed rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-400" type="button">Mark Paid</button>
      </div>
      {state.status === "success" ? <p className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-papaipay-green">{state.message}</p> : null}
      {state.status === "error" ? <p className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{state.message}</p> : null}
    </form>
  );
}
