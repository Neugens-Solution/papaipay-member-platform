"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

import { memberProfileDetails } from "@/lib/memberMockData";

type ModalType = "personal" | "email" | "bank" | "nominee" | "password" | null;

const profile = memberProfileDetails;

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
      <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{title}</h2>
      <dl className="mt-3">{children}</dl>
      {action ? <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">{action}</div> : null}
    </section>
  );
}

function ActionButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex min-h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-papaipay-green/30 hover:bg-emerald-50/60 hover:text-papaipay-green">
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-papaipay-green ring-1 ring-inset ring-emerald-100">{status}</span>;
}

function Field({ label, value = "", type = "text" }: { label: string; value?: string; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <input type={type} className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-papaipay-ink outline-none transition placeholder:text-slate-400 focus:border-papaipay-green/50 focus:ring-2 focus:ring-papaipay-green/10" defaultValue={value} placeholder={label} />
    </label>
  );
}

function AccountAction({ href, title, body }: { href: string; title: string; body: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-slate-200/70 bg-slate-50/60 px-4 py-3 transition hover:border-papaipay-green/30 hover:bg-emerald-50/60">
      <p className="text-sm font-semibold text-papaipay-ink">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{body}</p>
    </Link>
  );
}

function EditModal({ type, onClose }: { type: Exclude<ModalType, null>; onClose: () => void }) {
  const config = {
    personal: {
      title: "Edit Personal Information",
      action: "Save Changes",
      fields: [<Field key="name" label="Full name" value={profile.personal.fullName} />, <Field key="phone" label="Phone number" value={profile.personal.phone} />, <Field key="address" label="Residential address" value={profile.personal.address} />],
    },
    email: {
      title: "Change Email",
      action: "Continue",
      fields: [<Field key="current" label="Current email" value={profile.personal.email} />, <Field key="new" label="New email" />],
    },
    bank: {
      title: "Update Bank Account",
      action: "Save Changes",
      fields: [<Field key="bank" label="Bank name" value={profile.bank.bankName} />, <Field key="holder" label="Account holder name" value={profile.bank.accountHolderName} />, <Field key="number" label="Account number" />],
    },
    nominee: {
      title: "Edit Nominee",
      action: "Save Changes",
      fields: [<Field key="name" label="Name" value={profile.nominee.name} />, <Field key="relationship" label="Relationship" value={profile.nominee.relationship} />, <Field key="phone" label="Phone number" value={profile.nominee.phone} />],
    },
    password: {
      title: "Change Password",
      action: "Save Changes",
      fields: [<Field key="current" label="Current password" type="password" />, <Field key="new" label="New password" type="password" />, <Field key="confirm" label="Confirm password" type="password" />],
    },
  }[type];

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-slate-950/30 p-0 backdrop-blur-sm sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="profile-modal-title">
      <div className="w-full rounded-t-3xl bg-white p-5 shadow-soft sm:max-w-lg sm:rounded-3xl sm:p-6">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
        <h2 id="profile-modal-title" className="text-lg font-semibold tracking-tight text-papaipay-ink">{config.title}</h2>
        <div className="mt-5 grid gap-4">{config.fields}</div>
        {type === "email" ? <p className="mt-3 text-xs leading-5 text-slate-500">A confirmation code placeholder will be required before the email is changed.</p> : null}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} className="min-h-11 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Cancel</button>
          <button type="button" onClick={onClose} className="min-h-11 rounded-xl bg-papaipay-green text-sm font-semibold text-white transition hover:bg-papaipay-green/90">{config.action}</button>
        </div>
      </div>
    </div>
  );
}

export default function MemberProfilePage() {
  const [modal, setModal] = useState<ModalType>(null);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-papaipay-ink sm:text-3xl">My Profile</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Manage account details, security, distributions, and member documents.</p>
        </div>
      </header>

      <div className="grid gap-5">
        <Section title="Personal Information" action={<ActionButton onClick={() => setModal("personal")}>Edit Information</ActionButton>}>
          <InfoRow label="Full Name" value={profile.personal.fullName} />
          <InfoRow label="IC Number" value={profile.personal.icNumberMasked} />
          <InfoRow label="Phone Number" value={profile.personal.phone} />
          <InfoRow label="Residential Address" value={profile.personal.address} />
        </Section>

        <Section title="Email" action={<ActionButton onClick={() => setModal("email")}>Change Email</ActionButton>}>
          <InfoRow label="Current Email" value={profile.personal.email} />
        </Section>

        <section className="rounded-2xl border border-slate-200/70 bg-white/90 px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:px-5 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Verification Status</h2>
            <StatusBadge status={profile.verification.status} />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">Verified on {profile.verification.verifiedDate}. Identity verification is handled by PAPAIPAY&apos;s third-party e-KYC provider.</p>
        </section>

        <Section title="Bank Account" action={<ActionButton onClick={() => setModal("bank")}>Update Bank Account</ActionButton>}>
          <InfoRow label="Bank Name" value={profile.bank.bankName} />
          <InfoRow label="Account Holder Name" value={profile.bank.accountHolderName} />
          <InfoRow label="Account Number" value={profile.bank.accountNumber} />
          <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">Distribution payments will be sent to this bank account.</p>
        </Section>

        <Section title="Nominee / Beneficiary" action={<ActionButton onClick={() => setModal("nominee")}>Edit Nominee</ActionButton>}>
          <InfoRow label="Nominee Name" value={profile.nominee.name} />
          <InfoRow label="Relationship" value={profile.nominee.relationship} />
          <InfoRow label="Phone Number" value={profile.nominee.phone} />
          <InfoRow label="IC Number" value={profile.nominee.icNumberMasked} />
        </Section>

        <Section title="Password" action={<ActionButton onClick={() => setModal("password")}>Change Password</ActionButton>}>
          <InfoRow label="Password Status" value={profile.security.passwordStatus} />
          <InfoRow label="Last Login" value={profile.security.lastLogin} />
          <InfoRow label="Two-Factor Authentication" value="Coming Soon" />
        </Section>

        <Section title="Statements & Reports">
          <div className="grid gap-3 sm:grid-cols-2">
            <AccountAction href="/member/reports" title="Reports" body="View member participation and distribution statements." />
          </div>
        </Section>
      </div>

      {modal ? <EditModal type={modal} onClose={() => setModal(null)} /> : null}
    </div>
  );
}
