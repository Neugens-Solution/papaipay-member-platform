"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createParticipationAction } from "@/lib/member/actions/participations";
import type { ParticipationFormState } from "@/lib/member/actions/participations";

function ConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-papaipay-green px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70" type="submit">
      {pending ? "Creating participation..." : "Confirm Participation"}
    </button>
  );
}

export function ConfirmParticipationForm({ campaignId, campaignSlug, amount }: { campaignId: string; campaignSlug: string; amount: number }) {
  const initialState: ParticipationFormState = {};
  const [state, formAction] = useFormState(createParticipationAction, initialState);

  return (
    <form action={formAction} className="mt-6">
      <input type="hidden" name="campaignId" value={campaignId} />
      <input type="hidden" name="campaignSlug" value={campaignSlug} />
      <input type="hidden" name="amount" value={amount} />
      <input type="hidden" name="redirectTo" value="participationSuccess" />
      {state.error ? <p className="mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{state.error}</p> : null}
      <ConfirmButton />
    </form>
  );
}
