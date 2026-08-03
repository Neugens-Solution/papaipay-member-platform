"use client";

import { useActionState as useFormState } from "react";
import { useFormStatus } from "react-dom";
import { submitManualKycAction, type ManualKycFormState } from "@/lib/member/actions/manualKyc";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-papaipay-green px-4 py-2.5 text-sm font-bold text-white transition hover:bg-papaipay-ink disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
      {pending ? "Uploading securely…" : "Submit IC for Verification"}
    </button>
  );
}

function FileField({ name, label, helper }: { name: string; label: string; helper: string }) {
  return (
    <label className="block rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <span className="block text-sm font-bold text-papaipay-ink">{label}</span>
      <span className="mt-1 block text-xs leading-5 text-slate-500">{helper}</span>
      <input name={name} type="file" accept="image/jpeg,image/png,application/pdf" required className="mt-3 block w-full min-w-0 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-bold file:text-papaipay-green" />
    </label>
  );
}

export function ManualKycForm() {
  const [state, formAction] = useFormState(submitManualKycAction, {} as ManualKycFormState);
  return (
    <form action={formAction} className="mt-5 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <FileField name="icFront" label="IC Front" helper="Clear colour image showing all details." />
        <FileField name="icBack" label="IC Back" helper="Clear colour image showing the full reverse side." />
      </div>
      <p className="text-xs leading-5 text-slate-500">Accepted: JPG, PNG or PDF, up to 5MB per file. Your documents are stored privately and can only be viewed by you and authorised PAPAIPAY admins.</p>
      {state.error ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{state.error}</p> : null}
      {state.success ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-papaipay-green">{state.success}</p> : null}
      <SubmitButton />
    </form>
  );
}
