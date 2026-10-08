import Link from "next/link";
import { redirect } from "next/navigation";
import { ManualKycForm } from "@/components/member/ManualKycForm";
import { getMemberProfile } from "@/lib/data/memberProfile";
import { getApplicationStatus } from "@/lib/member/applicationStatus";
import { correctionReasonText } from "@/lib/member/correctionReasons";
import { formatDate, formatEnumLabel } from "@/lib/utils/formatters";
import { logoutAction } from "@/app/login/actions";

export default async function ApplicationDocumentsPage() {
  const { profile } = await getMemberProfile();
  const status = await getApplicationStatus(profile.id, profile.verificationStatus);
  if (status === "Approved") redirect("/member/dashboard");
  if (!profile.profileCompletedAt) redirect("/application");
  const submission = profile.manualKycSubmissions[0];
  const underReview = status === "Pending";

  return <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
    <div className="mx-auto mb-6 flex max-w-3xl items-center justify-between"><strong className="text-lg text-kasset-green">K Asset Ventures</strong><form action={logoutAction}><button type="submit" className="text-sm font-semibold text-slate-600 underline">Sign out</button></form></div>
    <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-kasset-green">Membership application · Step 2 of 2</p>
      <h1 className="mt-3 text-3xl font-semibold text-kasset-ink">Identity documents</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">Upload clear images of both sides of your IC. Your application goes to manual review when you press Submit Membership Application.</p>
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">Status: {formatEnumLabel(underReview ? "Pending" : status)}</div>
      {submission?.submittedAt ? <p className="mt-3 text-xs text-slate-500">Submitted {formatDate(submission.submittedAt)}</p> : null}
      {submission?.rejectionReason ? <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">Correction required: {correctionReasonText(submission.rejectionReason, submission.adminNotes)}</p> : null}
      {submission?.documents.length ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{submission.documents.map((document) => <Link key={document.id} href={`/files/${document.fileAsset.id}`} target="_blank" className="rounded-xl border border-slate-200 p-4 text-sm font-semibold text-kasset-green">{formatEnumLabel(String(document.documentType))}: {document.fileAsset.originalFilename}</Link>)}</div> : null}
      {underReview ? <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">Your application has been received and is under review. Dashboard access will be available after approval.</p> : <ManualKycForm correction={submission?.status === "ResubmissionRequired"} />}
      {!underReview ? <Link href="/application" className="mt-7 inline-block text-sm font-semibold text-kasset-green underline">Back to profile</Link> : null}
    </div>
  </main>;
}
