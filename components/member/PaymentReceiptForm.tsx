"use client";

import { useActionState as useFormState } from "react";
import { useFormStatus } from "react-dom";
import { submitPaymentReceiptAction, type PaymentReceiptFormState } from "@/lib/member/actions/paymentReceipts";

function SubmitButton({ resubmission }: { resubmission: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-kasset-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-kasset-ink disabled:cursor-not-allowed disabled:opacity-60">
      {pending ? "Uploading receipt…" : resubmission ? "Replace Payment Receipt" : "Submit Payment Receipt"}
    </button>
  );
}

export function PaymentReceiptForm({ participationId, paymentId, existingReference }: { participationId: string; paymentId: string; existingReference?: string | null }) {
  const [state, formAction] = useFormState(submitPaymentReceiptAction, {} as PaymentReceiptFormState);
  const resubmission = Boolean(existingReference);

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <input type="hidden" name="participationId" value={participationId} />
      <input type="hidden" name="paymentId" value={paymentId} />
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Bank transfer reference</span>
        <input name="bankReference" required defaultValue={existingReference ?? ""} placeholder="Example: bank transaction reference" className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-kasset-green" />
      </label>
      <label className="block rounded-xl border border-dashed border-slate-300 bg-white p-4">
        <span className="block text-sm font-bold text-kasset-ink">Receipt file</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">JPG, PNG or PDF, up to 5MB.</span>
        <input name="receipt" type="file" accept="image/jpeg,image/png,application/pdf" required className="mt-3 block w-full min-w-0 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-xs file:font-bold file:text-kasset-green" />
      </label>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Note (optional)</span>
        <textarea name="notes" rows={2} placeholder="Add any information for the admin reviewer." className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-kasset-green" />
      </label>
      {state.error ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{state.error}</p> : null}
      {state.success ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-kasset-green">{state.success}</p> : null}
      <SubmitButton resubmission={resubmission} />
    </form>
  );
}
