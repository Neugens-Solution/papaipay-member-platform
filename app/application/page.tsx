import Link from "next/link";
import { redirect } from "next/navigation";
import MemberProfilePage from "@/app/member/profile/page";
import { requireMember } from "@/lib/auth/guards";
import { getApplicationStatus } from "@/lib/member/applicationStatus";

export default async function ApplicationPage() {
  const { member } = await requireMember();
  const status = await getApplicationStatus(member.id, member.verificationStatus);
  if (status === "Approved") redirect("/member/dashboard");
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto mb-6 flex max-w-5xl items-center justify-between gap-4">
        <strong className="text-lg text-kasset-green">K Asset Ventures</strong>
        <Link href="/logout" className="text-sm font-semibold text-slate-600 underline">Sign out</Link>
      </div>
      <div className="mx-auto mb-6 max-w-5xl rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-900">
        {status === "Pending"
          ? "Your membership application has been received and is under review. Dashboard access will be available after approval."
          : status === "CorrectionRequired"
            ? "Your application needs correction. Review the reason below, update your details or documents, and resubmit for review."
            : "Complete your profile and upload both sides of your identification document to submit your membership application."}
      </div>
      <MemberProfilePage />
    </main>
  );
}
