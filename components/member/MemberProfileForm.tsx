"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateMemberProfileAction, type MemberProfileFormState } from "@/lib/member/actions/profile";

type ProfileValues = {
  fullName: string; phone: string; nationality: string; dateOfBirth: string;
  addressLine1: string; addressLine2: string; city: string; state: string; postcode: string; country: string;
  bankName: string; accountHolderName: string; accountNumberLast4: string;
  nomineeName: string; nomineeRelationship: string; nomineePhone: string; nomineeEmail: string;
};

function Field({ label, name, defaultValue, type = "text", placeholder, autoComplete, inputMode }: { label: string; name: string; defaultValue?: string; type?: string; placeholder?: string; autoComplete?: string; inputMode?: "text" | "numeric" | "tel" | "email" }) {
  return <label className="block"><span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span><input name={name} type={type} inputMode={inputMode} defaultValue={defaultValue} placeholder={placeholder} autoComplete={autoComplete} className="mt-1 min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-kasset-ink outline-none transition focus:border-kasset-green focus:ring-2 focus:ring-kasset-green/10" /></label>;
}

function SaveButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="min-h-11 rounded-xl bg-kasset-green px-5 text-sm font-bold text-white transition hover:bg-kasset-ink disabled:cursor-not-allowed disabled:opacity-60">{pending ? "Saving…" : "Save Profile"}</button>;
}

export function MemberProfileForm({ values }: { values: ProfileValues }) {
  const [state, action] = useActionState(updateMemberProfileAction, {} as MemberProfileFormState);
  return (
    <form action={action} className="space-y-6">
      <fieldset><legend className="text-base font-bold text-kasset-ink">Personal Information</legend><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Full Name *" name="fullName" defaultValue={values.fullName} autoComplete="name" /><Field label="Phone" name="phone" defaultValue={values.phone} autoComplete="tel" /><Field label="Nationality" name="nationality" defaultValue={values.nationality} placeholder="Malaysian" /><Field label="Date of Birth" name="dateOfBirth" defaultValue={values.dateOfBirth} type="date" /></div></fieldset>
      <fieldset className="border-t border-slate-100 pt-6"><legend className="text-base font-bold text-kasset-ink">Contact Address</legend><div className="mt-4 grid gap-4 sm:grid-cols-2"><div className="sm:col-span-2"><Field label="Address Line 1" name="addressLine1" defaultValue={values.addressLine1} autoComplete="address-line1" /></div><div className="sm:col-span-2"><Field label="Address Line 2" name="addressLine2" defaultValue={values.addressLine2} autoComplete="address-line2" /></div><Field label="City" name="city" defaultValue={values.city} autoComplete="address-level2" /><Field label="State" name="state" defaultValue={values.state} autoComplete="address-level1" /><Field label="Postcode" name="postcode" defaultValue={values.postcode} autoComplete="postal-code" /><Field label="Country" name="country" defaultValue={values.country || "Malaysia"} autoComplete="country-name" /></div></fieldset>
      <fieldset className="border-t border-slate-100 pt-6"><legend className="text-base font-bold text-kasset-ink">Bank Account</legend><p className="mt-1 text-xs leading-5 text-slate-500">Used for distributions. Leave the account number blank to keep the current account ending {values.accountNumberLast4 || "not yet provided"}. A changed account number returns bank verification to pending.</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Bank Name" name="bankName" defaultValue={values.bankName} /><Field label="Account Holder Name" name="accountHolderName" defaultValue={values.accountHolderName} /><div className="sm:col-span-2"><Field label="New Account Number" name="accountNumber" inputMode="numeric" placeholder={values.accountNumberLast4 ? `Current account ends ${values.accountNumberLast4}` : "Enter account number"} autoComplete="off" /></div></div></fieldset>
      <fieldset className="border-t border-slate-100 pt-6"><legend className="text-base font-bold text-kasset-ink">Nominee / Beneficiary</legend><div className="mt-4 grid gap-4 sm:grid-cols-2"><Field label="Full Name" name="nomineeName" defaultValue={values.nomineeName} /><Field label="Relationship" name="nomineeRelationship" defaultValue={values.nomineeRelationship} /><Field label="Phone" name="nomineePhone" defaultValue={values.nomineePhone} /><Field label="Email" name="nomineeEmail" defaultValue={values.nomineeEmail} type="email" /></div></fieldset>
      {state.error ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{state.error}</p> : null}
      {state.success ? <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-kasset-green">{state.success}</p> : null}
      <div className="flex justify-end"><SaveButton /></div>
    </form>
  );
}
