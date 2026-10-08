import Link from "next/link";
import { redirect } from "next/navigation";
import { MemberProfileForm } from "@/components/member/MemberProfileForm";
import { getMemberProfile } from "@/lib/data/memberProfile";
import { getApplicationStatus } from "@/lib/member/applicationStatus";
import { logoutAction } from "@/app/login/actions";
import { saveApplicationProfileAction } from "./actions";

export default async function ApplicationPage() {
  const { user, profile } = await getMemberProfile();
  const status = await getApplicationStatus(profile.id, profile.verificationStatus);
  if (status === "Approved") redirect("/member/dashboard");
  if (status === "Pending") redirect("/application/documents");
  const contact = profile.contacts[0];
  const address = profile.addresses[0];
  const bank = profile.bankAccounts[0];
  const nominee = profile.nominees[0];

  return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
    <div className="mx-auto mb-6 flex max-w-3xl items-center justify-between"><strong className="text-lg text-kasset-green">K Asset Ventures</strong><form action={logoutAction}><button type="submit" className="text-sm font-semibold text-slate-600 underline">Sign out</button></form></div>
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-kasset-green">Membership application · Step 1 of 2</p>
      <h1 className="mt-3 text-3xl font-semibold text-kasset-ink">Your profile</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">Complete your personal and address details. Your IC documents are uploaded on the next page.</p>
      {status === "CorrectionRequired" && profile.profileCompletedAt ? <p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">If your profile details are already correct, <Link href="/application/documents" className="font-bold underline">continue to your documents</Link>.</p> : null}
      <div className="mt-7"><MemberProfileForm onboarding saveAction={saveApplicationProfileAction} values={{
        fullName: profile.fullName, phone: contact?.phone || user.phone || "", nationality: profile.nationality || "",
        dateOfBirth: profile.dateOfBirth?.toISOString().slice(0, 10) || "",
        addressLine1: address?.addressLine1 || "", addressLine2: address?.addressLine2 || "", city: address?.city || "", state: address?.state || "", postcode: address?.postcode || "", country: address?.country || "Malaysia",
        bankName: bank?.bankName || "", accountHolderName: bank?.accountHolderName || "", accountNumberLast4: bank?.accountNumberLast4 || "",
        nomineeName: nominee?.fullName || "", nomineeRelationship: nominee?.relationship || "", nomineePhone: nominee?.phone || "", nomineeEmail: nominee?.email || "",
      }} /></div>
    </div>
  </main>;
}
