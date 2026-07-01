"use client";

import { useFormState, useFormStatus } from "react-dom";
import { approveDistributionBatchAction, markDistributionBatchPaidAction, saveDraftDistributionBatchAction, type DistributionBatchActionState } from "@/lib/admin/project-distributions-actions";

const initialState: DistributionBatchActionState = { status: "idle", message: null, errors: [] };

function SubmitButton({ disabled, label, pendingLabel, activeClass }: { disabled: boolean; label: string; pendingLabel: string; activeClass: string }) {
  const { pending } = useFormStatus();
  return <button disabled={disabled || pending} className={disabled || pending ? "cursor-not-allowed rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-400" : activeClass} type="submit">{pending ? pendingLabel : label}</button>;
}

export function DistributionBatchActionsForm({ campaignId, settlementId, batchId, saveDisabled, draftSaved, approveDisabled, approved, completed }: { campaignId: string; settlementId?: string | null; batchId?: string | null; saveDisabled: boolean; draftSaved: boolean; approveDisabled: boolean; approved: boolean; completed?: boolean; }) {
  const [saveState, saveAction] = useFormState(saveDraftDistributionBatchAction, initialState);
  const [approveState, approveAction] = useFormState(approveDistributionBatchAction, initialState);
  const [markPaidState, markPaidAction] = useFormState(markDistributionBatchPaidAction, initialState);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <form action={saveAction}><input type="hidden" name="campaignId" value={campaignId} /><input type="hidden" name="settlementId" value={settlementId ?? ""} /><SubmitButton disabled={saveDisabled || Boolean(completed)} label={draftSaved ? "Draft Batch Saved" : "Save Draft Batch"} pendingLabel="Saving Draft…" activeClass="rounded-lg border border-papaipay-green bg-papaipay-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-papaipay-green/90" /></form>
        <form action={approveAction}><input type="hidden" name="campaignId" value={campaignId} /><input type="hidden" name="settlementId" value={settlementId ?? ""} /><input type="hidden" name="batchId" value={batchId ?? ""} /><SubmitButton disabled={approveDisabled || Boolean(completed)} label={approved ? "Approved" : "Approve Distribution"} pendingLabel="Approving…" activeClass="rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700" /></form>
      </div>

      {approved ? (
        <form action={markPaidAction} className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
          <input type="hidden" name="campaignId" value={campaignId} /><input type="hidden" name="settlementId" value={settlementId ?? ""} /><input type="hidden" name="batchId" value={batchId ?? ""} />
          <div><h3 className="text-base font-bold text-papaipay-ink">Record Manual Payment</h3><p className="mt-1 text-sm leading-6 text-slate-600">Use this only after finance has completed the manual transfer outside PAPAIPAY. This action records the payment outcome and does not execute a transfer.</p></div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Payment Date<input name="paymentDate" type="date" required className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-papaipay-green" /></label>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Payment Reference<input name="paymentReference" required placeholder="Manual transfer/reference number" className="mt-1 min-h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold outline-none focus:border-papaipay-green" /></label>
          </div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Admin Notes<textarea name="adminNotes" required rows={3} placeholder="Record who completed the transfer and any finance context." className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-papaipay-green" /></label>
          <label className="flex gap-3 rounded-xl border border-amber-200 bg-white p-3 text-sm font-semibold leading-6 text-slate-700"><input name="confirmation" type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-papaipay-green" />I confirm the manual transfer/payment has already been completed outside PAPAIPAY. This action only records the outcome and does not execute a transfer.</label>
          <SubmitButton disabled={!batchId} label="Record Manual Payment & Mark Batch Paid" pendingLabel="Recording Manual Payment…" activeClass="rounded-lg border border-amber-600 bg-amber-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-amber-700" />
        </form>
      ) : null}

      {saveState.status === "success" ? <p className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-papaipay-green">{saveState.message}</p> : null}
      {saveState.status === "error" ? <p className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{saveState.message}</p> : null}
      {approveState.status === "success" ? <p className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-papaipay-green">{approveState.message}</p> : null}
      {approveState.status === "error" ? <p className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{approveState.message}</p> : null}
      {markPaidState.status === "success" ? <p className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-papaipay-green">{markPaidState.message}</p> : null}
      {markPaidState.status === "error" ? <p className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm font-semibold text-rose-700">{markPaidState.message}</p> : null}
    </div>
  );
}
