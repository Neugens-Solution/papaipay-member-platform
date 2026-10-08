import Link from "next/link";
import { redirect } from "next/navigation";
import { ManualKycForm } from "@/components/member/ManualKycForm";
import { getMemberProfile } from "@/lib/data/memberProfile";
import { getApplicationStatus } from "@/lib/member/applicationStatus";
import { correctionReasonText } from "@/lib/member/correctionReasons";
import { formatDate } from "@/lib/utils/formatters";
import { logoutAction } from "@/app/login/actions";

export default async function ApplicationDocumentsPage() {
  const { profile } = await getMemberProfile();
  const status = await getApplicationStatus(profile.id, profile.verificationStatus);
  if (status === "Approved") redirect("/member/dashboard");
  if (!profile.profileCompletedAt) redirect("/application");

  const submission = profile.manualKycSubmissions[0];
  const underReview = status === "Pending";
  const correctionRequired = status === "CorrectionRequired";
  const documents = submission?.documents ?? [];
  const firstName = profile.fullName.trim().split(/\\s+/)[0] || "there";

  return (
    <main className="min-h-screen bg-[#f4f7f5] px-4 py-6 sm:px-6 sm:py-10">
      <header className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/application" className="flex items-center gap-3" aria-label="K Asset Ventures member application">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-kasset-green text-sm font-extrabold tracking-tight text-white">K</span>
          <span className="leading-tight">
            <strong className="block text-sm font-bold text-kasset-ink">K Asset Ventures</strong>
            <span className="text-xs text-slate-500">Member Portal</span>
          </span>
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-white">Sign out</button>
        </form>
      </header>

      <div className="mx-auto mt-8 max-w-4xl">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-kasset-green">Membership application</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-kasset-ink sm:text-3xl">
            {underReview ? `Welcome, ${firstName}` : correctionRequired ? "A quick update is needed" : "Complete your application"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {underReview
              ? "Your application is in our review queue. This page is where you can check what happens next."
              : correctionRequired
                ? "Please review the update requested by our team and resubmit your documents."
                : "Submit both sides of your identification document to begin the membership review."}
          </p>
        </div>

        {underReview ? (
          <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm" aria-labelledby="review-status-heading">
            <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-5 sm:p-7">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-800" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.5 2.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 id="review-status-heading" className="text-lg font-bold text-kasset-ink">Application under review</h2>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900">Pending decision</span>
                  </div>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                    We have received your application and identification documents. Our team will review them and notify you by email when a decision is made.
                  </p>
                  {submission?.submittedAt ? <p className="mt-3 text-xs font-medium text-slate-500">Submitted on {formatDate(submission.submittedAt)}</p> : null}
                </div>
              </div>
            </div>

            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h3 className="text-sm font-bold text-kasset-ink">What happens next</h3>
                <ol className="mt-4 space-y-4">
                  <li className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-700 text-xs font-bold text-white">✓</span>
                    <div><p className="text-sm font-semibold text-slate-800">Application received</p><p className="mt-0.5 text-xs leading-5 text-slate-500">Your profile and documents have been submitted.</p></div>
                  </li>
                  <li className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-emerald-600 bg-white text-xs font-bold text-emerald-700">2</span>
                    <div><p className="text-sm font-semibold text-slate-800">Team review</p><p className="mt-0.5 text-xs leading-5 text-slate-500">Our team is checking the information and documents.</p></div>
                  </li>
                  <li className="flex gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-300 bg-slate-50 text-xs font-bold text-slate-500">3</span>
                    <div><p className="text-sm font-semibold text-slate-800">Decision and portal access</p><p className="mt-0.5 text-xs leading-5 text-slate-500">We will email you when your application is approved or if an update is needed.</p></div>
                  </li>
                </ol>
              </div>

              <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-bold text-kasset-ink">While you wait</h3>
                <ul className="mt-3 space-y-2 text-sm leading-5 text-slate-600">
                  <li>• No further action is needed right now.</li>
                  <li>• Please check your inbox and spam folder for updates.</li>
                  <li>• Dashboard access opens after approval.</li>
                </ul>
                <details className="mt-5 border-t border-slate-200 pt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-kasset-green">
                    Documents submitted ({documents.length})
                  </summary>
                  <p className="mt-2 text-xs leading-5 text-slate-500">Your files are available only to you and authorized reviewers.</p>
                  <ul className="mt-3 space-y-2">
                    {documents.map((document) => (
                      <li key={document.id}>
                        <Link href={`/files/${document.fileAsset.id}`} target="_blank" rel="noreferrer" className="text-xs font-semibold text-kasset-green underline">
                          View {String(document.documentType) === "IcFront" ? "front of ID" : "back of ID"} ↗
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </aside>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            {correctionRequired && submission?.rejectionReason ? (
              <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                <strong className="block">Correction requested</strong>
                <span>{correctionReasonText(submission.rejectionReason, submission.adminNotes)}</span>
              </div>
            ) : null}
            <div className="mb-5">
              <h2 className="text-lg font-bold text-kasset-ink">Identity documents</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">Upload clear images of both sides of your IC. Your application will be sent for manual review after submission.</p>
            </div>
            <ManualKycForm correction={submission?.status === "ResubmissionRequired"} />
            <Link href="/application" className="mt-6 inline-block text-sm font-semibold text-kasset-green underline">Back to profile</Link>
          </section>
        )}

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">Need help? Contact the K Asset Ventures team using the official contact details on our website.</p>
      </div>
    </main>
  );
}
