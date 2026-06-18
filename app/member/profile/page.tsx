import type { ReactNode } from "react";

import { memberProfileDetails } from "@/lib/memberMockData";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0 sm:grid sm:grid-cols-[220px_1fr] sm:gap-4">
      <dt className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-semibold leading-6 text-papaipay-ink sm:mt-0">{value}</dd>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white px-4 py-4 sm:px-5">
      <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-papaipay-green">{title}</h2>
      <dl className="mt-3">{children}</dl>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="inline-flex rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-100">
      {status}
    </span>
  );
}

function PreferenceToggle({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0">
      <span className="text-sm font-semibold text-papaipay-ink">{label}</span>
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
    <div className="mx-auto max-w-4xl space-y-5">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-papaipay-ink sm:text-[1.7rem]">My Profile</h1>
      </header>

      <div className="grid gap-5">
        <Section title="Personal Information">
          <InfoRow label="Full Name" value={profile.personal.fullName} />
          <InfoRow label="IC Number" value={profile.personal.icNumberMasked} />
          <InfoRow label="Email Address" value={profile.personal.email} />
          <InfoRow label="Phone Number" value={profile.personal.phone} />
          <InfoRow label="Residential Address" value={profile.personal.address} />
        </Section>

        <section className="rounded-lg border border-slate-200 bg-white px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-papaipay-green">Verification Status</h2>
            <StatusBadge status={profile.verification.status} />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Identity verification is handled by PAPAIPAY&apos;s third-party e-KYC provider. This page only displays the current member status.</p>
        </section>

        <Section title="Bank Account">
          <InfoRow label="Bank Name" value={profile.bank.bankName} />
          <InfoRow label="Account Holder Name" value={profile.bank.accountHolderName} />
          <InfoRow label="Account Number" value={profile.bank.accountNumber} />
          <InfoRow label="Purpose" value="Distribution payments will be sent here." />
        </Section>

        <Section title="Nominee / Beneficiary">
          <InfoRow label="Nominee Name" value={profile.nominee.name} />
          <InfoRow label="Relationship" value={profile.nominee.relationship} />
          <InfoRow label="Phone Number" value={profile.nominee.phone} />
          <InfoRow label="IC Number" value={profile.nominee.icNumberMasked} />
        </Section>

        <Section title="Security">
          <InfoRow label="Password Status" value={profile.security.passwordStatus} />
          <InfoRow label="Last Login" value={profile.security.lastLogin} />
          <InfoRow label="Two-Factor Authentication" value="Coming Soon" />
        </Section>

        <section className="rounded-lg border border-slate-200 bg-white px-4 py-4 sm:px-5">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-papaipay-green">Communication Preferences</h2>
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
