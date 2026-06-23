"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createParticipationAction } from "@/lib/member/actions/participations";
import type { ParticipationFormState } from "@/lib/member/actions/participations";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="mt-5 min-h-12 w-full rounded-xl bg-papaipay-green px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(34,139,76,0.24)] transition hover:bg-papaipay-green/90 disabled:cursor-not-allowed disabled:opacity-70">
      {pending ? "Reserving participation..." : "Proceed to Payment"}
    </button>
  );
}

export function ParticipationForm({ campaignId, minimumParticipation, maximumParticipation, targetAmount, remainingAmount, compact = false }: { campaignId: string; minimumParticipation: string; maximumParticipation: string; targetAmount: string; remainingAmount: string; compact?: boolean }) {
  const initialState: ParticipationFormState = {};
  const [state, formAction] = useFormState(createParticipationAction, initialState);
  const inputId = compact ? "mobile-participation-amount" : "participation-amount";

  return (
    <form action={formAction}>
      <input type="hidden" name="campaignId" value={campaignId} />
      <label className="mt-5 block text-sm font-bold text-slate-600" htmlFor={inputId}>Participation Amount</label>
      <div className="mt-2 flex rounded-xl border border-slate-200 bg-white shadow-inner"><span className="px-3 py-3 text-sm font-bold text-slate-500">RM</span><input id={inputId} name="amount" inputMode="decimal" className="min-h-11 flex-1 rounded-xl px-2 py-3 text-sm outline-none" placeholder="10,000" /></div>
      {state.error ? <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{state.error}</p> : null}
      <div className="mt-4 divide-y divide-slate-100 rounded-xl bg-slate-50/70 px-3">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3"><dt className="text-sm text-slate-500">Minimum Participation Amount</dt><dd className="text-right text-sm font-bold text-papaipay-ink">{minimumParticipation}</dd></div>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3"><dt className="text-sm text-slate-500">Maximum Participation Amount</dt><dd className="text-right text-sm font-bold text-papaipay-ink">{maximumParticipation}</dd></div>
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 py-3"><dt className="text-sm text-slate-500">Listing Target</dt><dd className="text-right text-sm font-bold text-papaipay-ink">{targetAmount}</dd></div>
        <div className="flex items-start justify-between gap-4 py-3"><dt className="text-sm text-slate-500">Available to Reserve</dt><dd className="text-right text-sm font-bold text-papaipay-ink">{remainingAmount}</dd></div>
      </div>
      <SubmitButton />
      <p className="mt-3 text-center text-xs font-semibold leading-5 text-slate-500">No payment gateway is connected yet. Your participation will be reserved as pending payment.</p>
    </form>
  );
}
