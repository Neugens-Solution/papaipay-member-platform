import Link from "next/link";
import type { ReactNode } from "react";

import { memberProfileDetails } from "@/lib/memberMockData";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-100/80 py-3 last:border-b-0 sm:grid sm:grid-cols-[210px_1fr] sm:gap-4">
      <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium leading-6 text-papaipay-ink sm:mt-0">{value}</dd>
    </div>
  );
}

function Section({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:px-5 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h2>
        {action}
      </div>
      <dl className="mt-3">{children}</dl>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-papaipay-green ring-1 ring-inset ring-emerald-100">
      {status}
    </span>
  );
}

function ActionButton({ children }: { children: ReactNode }) {
  return (
    <button type="button" className="inline-flex min-h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-papaipay-green/30 hover:bg-emerald-50/60 hover:text-papaipay-green">
      {children}
    </button>
  );
}

function Field({ label, value = "" }: { label: string; value?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <input className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-papaipay-ink outline-none transition placeholder:text-slate-400 focus:border-papaipay-green/50 focus:ring-2 focus:ring-papaipay-green/10" defaultValue={value} placeholder={label} />
    </label>
  );
}

function PlaceholderFlow({ summary, note, children }: { summary: string; note: string; children: ReactNode }) {
  return (
    <details className="mt-4 rounded-xl border border-slate-200/70 bg-slate-50/60 p-3">
      <summary className="cursor-pointer list-none text-sm font-semibold text-papaipay-green">{summary}</summary>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {children}
      </div>
      <p className="mt-3 text-xs leading-5 text-slate-500">{note}</p>
    </details>
  );
}

function PreferenceToggle({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100/80 py-3 last:border-b-0">
      <span className="text-sm font-medium text-papaipay-ink">{label}</span>
      <span
        aria-label={`${label} ${enabled ? "enabled" : "disabled"}`}
        className={`relative inline-flex h-6 w-11 rounded-full transition ${enabled ? "bg-papaipay-green" : "bg-slate-300"}`}
      >
        <span className={`mt-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${enabled ? "ml-5" : "ml-0.5"}`} />
      </span>
    </div>
  );
}

export default function MemberProfilePage() {
  const profile = memberProfileDetails;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-papaipay-ink sm:text-3xl">My Profile</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Manage account details, security, distributions, and member documents.</p>
        </div>
        <Link href="/member/reports" className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-papaipay-green/30 hover:bg-emerald-50/60 hover:text-papaipay-green">
          Reports
        </Link>
      </header>

      <div className="grid gap-5">
        <Section title="Personal Information" action={<ActionButton>Edit Information</ActionButton>}>
          <InfoRow label="Full Name" value={profile.personal.fullName} />
          <InfoRow label="IC Number" value={profile.personal.icNumberMasked} />
          <InfoRow label="Phone Number" value={profile.personal.phone} />
          <InfoRow label="Residential Address" value={profile.personal.address} />
          <PlaceholderFlow summary="Edit personal information" note="Frontend placeholder only. Submitted changes will require verification before being applied.">
            <Field label="Full name" value={profile.personal.fullName} />
            <Field label="Phone number" value={profile.personal.phone} />
            <Field label="Residential address" value={profile.personal.address} />
          </PlaceholderFlow>
        </Section>

        <Section title="Email" action={<ActionButton>Change Email</ActionButton>}>
          <InfoRow label="Current Email" value={profile.personal.email} />
          <PlaceholderFlow summary="Change email" note="A one-time confirmation code placeholder will be sent before the email is changed.">
            <Field label="Current email" value={profile.personal.email} />
            <Field label="New email" />
          </PlaceholderFlow>
        </Section>

        <section className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:px-5 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Verification Status</h2>
            <StatusBadge status={profile.verification.status} />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Verified on {profile.verification.verifiedDate}. Identity verification is handled by PAPAIPAY&apos;s third-party e-KYC provider.</p>
        </section>

        <Section title="Bank Account" action={<ActionButton>Update Bank Account</ActionButton>}>
          <InfoRow label="Bank Name" value={profile.bank.bankName} />
          <InfoRow label="Account Holder Name" value={profile.bank.accountHolderName} />
          <InfoRow label="Account Number" value={profile.bank.accountNumber} />
          <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">Distribution payments will be sent to this bank account.</p>
          <PlaceholderFlow summary="Update bank account" note="Frontend placeholder only. Bank account changes will require member verification.">
            <Field label="Bank name" value={profile.bank.bankName} />
            <Field label="Account holder name" value={profile.bank.accountHolderName} />
            <Field label="Account number" />
          </PlaceholderFlow>
        </Section>

        <Section title="Nominee / Beneficiary" action={<ActionButton>Edit Nominee</ActionButton>}>
          <InfoRow label="Nominee Name" value={profile.nominee.name} />
          <InfoRow label="Relationship" value={profile.nominee.relationship} />
          <InfoRow label="Phone Number" value={profile.nominee.phone} />
          <InfoRow label="IC Number" value={profile.nominee.icNumberMasked} />
          <PlaceholderFlow summary="Edit nominee details" note="Frontend placeholder only. Nominee changes may require supporting verification.">
            <Field label="Nominee name" value={profile.nominee.name} />
            <Field label="Relationship" value={profile.nominee.relationship} />
            <Field label="Phone number" value={profile.nominee.phone} />
            <Field label="IC number" />
          </PlaceholderFlow>
        </Section>

        <Section title="Security" action={<ActionButton>Change Password</ActionButton>}>
          <InfoRow label="Password Status" value={profile.security.passwordStatus} />
          <InfoRow label="Last Login" value={profile.security.lastLogin} />
          <InfoRow label="Two-Factor Authentication" value="Coming Soon" />
          <PlaceholderFlow summary="Change password" note="Frontend placeholder only. Password validation and confirmation will be connected later.">
            <Field label="Current password" />
            <Field label="New password" />
            <Field label="Confirm new password" />
          </PlaceholderFlow>
        </Section>

        <section className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:px-5 sm:py-5">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Communication Preferences</h2>
          <div className="mt-3">
            {profile.communicationPreferences.map((preference) => (
              <PreferenceToggle key={preference.label} label={preference.label} enabled={preference.enabled} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
