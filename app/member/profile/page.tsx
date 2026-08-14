import Link from "next/link";
import type { ReactNode } from "react";
import { ManualKycForm } from "@/components/member/ManualKycForm";
import { MemberProfileForm } from "@/components/member/MemberProfileForm";
import { getMemberProfile } from "@/lib/data/memberProfile";
import { formatDate, formatEnumLabel } from "@/lib/utils/formatters";

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/70 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-6">
      <h2 className="text-base font-bold text-kasset-ink">{title}</h2>
      {description ? <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 border-b border-slate-100 py-3 last:border-0 sm:grid sm:grid-cols-[190px_minmax(0,1fr)] sm:gap-4">
      <dt className="text-[0.68rem] font-bold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 min-w-0 break-words text-sm font-semibold leading-6 text-kasset-ink sm:mt-0">{value}</dd>
    </div>
  );
}

function statusTone(status: string) {
  if (status === "Approved") return "border-emerald-200 bg-emerald-50 text-kasset-green";
  if (["Submitted", "UnderReview", "Pending"].includes(status)) return "border-amber-200 bg-amber-50 text-amber-800";
  if (["Rejected", "ResubmissionRequired"].includes(status)) return "border-rose-200 bg-rose-50 text-rose-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}

export default async function MemberProfilePage() {
  const { user, profile } = await getMemberProfile();
  const contact = profile.contacts[0];
  const address = profile.addresses[0];
  const bank = profile.bankAccounts[0];
  const nominee = profile.nominees[0];
  const submission = profile.manualKycSubmissions[0];
  const verificationStatus = submission?.status === "Approved" || profile.verificationStatus === "Approved"
    ? "Approved"
    : submission?.status || profile.verificationStatus;
  const underReview = ["Submitted", "UnderReview"].includes(String(verificationStatus));
  const canSubmit = verificationStatus !== "Approved" && !underReview;
  const formattedAddress = address
    ? [address.addressLine1, address.addressLine2, address.postcode, address.city, address.state, address.country].filter(Boolean).join(", ")
    : "Not provided";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-kasset-green">Account</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-kasset-ink sm:text-3xl">My Profile</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Review your member information and complete the required manual identity verification.</p>
      </header>

      <Section title="Identity Verification" description="K Asset Ventures currently verifies members manually. No third-party e-KYC service is used.">
        <div className={`rounded-xl border p-4 ${statusTone(String(verificationStatus))}`}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-bold">Status: {formatEnumLabel(String(verificationStatus))}</p>
            {submission?.submittedAt ? <p className="text-xs font-semibold">Submitted {formatDate(submission.submittedAt)}</p> : null}
          </div>
          {submission?.rejectionReason ? <p className="mt-2 text-sm leading-6">Reason: {submission.rejectionReason}</p> : null}
        </div>

        {submission?.documents.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {submission.documents.map((document) => (
              <Link key={document.id} href={`/files/${document.fileAsset.id}`} target="_blank" className="min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-kasset-green hover:border-kasset-green/40">
                <span className="block text-xs uppercase tracking-wide text-slate-400">{formatEnumLabel(String(document.documentType))}</span>
                <span className="mt-1 block truncate">{document.fileAsset.originalFilename}</span>
              </Link>
            ))}
          </div>
        ) : null}

        {canSubmit ? <ManualKycForm /> : null}
        {underReview ? <p className="mt-4 text-sm leading-6 text-slate-600">Your IC documents have been received. You can continue using the portal while the admin team reviews them, but participation confirmation requires approved verification.</p> : null}
      </Section>

      <Section title="Update Profile" description="Keep your personal, contact, bank and nominee information current.">
        <MemberProfileForm values={{
          fullName: profile.fullName,
          phone: contact?.phone || user.phone || "",
          nationality: profile.nationality || "",
          dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.toISOString().slice(0, 10) : "",
          addressLine1: address?.addressLine1 || "",
          addressLine2: address?.addressLine2 || "",
          city: address?.city || "",
          state: address?.state || "",
          postcode: address?.postcode || "",
          country: address?.country || "Malaysia",
          bankName: bank?.bankName || "",
          accountHolderName: bank?.accountHolderName || "",
          accountNumberLast4: bank?.accountNumberLast4 || "",
          nomineeName: nominee?.fullName || "",
          nomineeRelationship: nominee?.relationship || "",
          nomineePhone: nominee?.phone || "",
          nomineeEmail: nominee?.email || "",
        }} />
      </Section>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <Section title="Personal Information">
          <dl>
            <InfoRow label="Member ID" value={profile.memberRef} />
            <InfoRow label="Full Name" value={profile.fullName} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={contact?.phone || user.phone || "Not provided"} />
            <InfoRow label="Nationality" value={profile.nationality || "Not provided"} />
            <InfoRow label="Date of Birth" value={profile.dateOfBirth ? formatDate(profile.dateOfBirth) : "Not provided"} />
          </dl>
        </Section>

        <Section title="Contact Address">
          <dl><InfoRow label="Primary Address" value={formattedAddress} /></dl>
        </Section>

        <Section title="Bank Account" description="Approved distributions are recorded against this account.">
          <dl>
            <InfoRow label="Bank" value={bank?.bankName || "Not provided"} />
            <InfoRow label="Account Holder" value={bank?.accountHolderName || "Not provided"} />
            <InfoRow label="Account Number" value={bank?.accountNumberLast4 ? `•••• ${bank.accountNumberLast4}` : "Not provided"} />
            <InfoRow label="Verification" value={bank ? formatEnumLabel(String(bank.verificationStatus)) : "Not started"} />
          </dl>
        </Section>

        <Section title="Nominee / Beneficiary">
          <dl>
            <InfoRow label="Name" value={nominee?.fullName || "Not provided"} />
            <InfoRow label="Relationship" value={nominee?.relationship || "Not provided"} />
            <InfoRow label="Phone" value={nominee?.phone || "Not provided"} />
          </dl>
        </Section>
      </div>
    </div>
  );
}
