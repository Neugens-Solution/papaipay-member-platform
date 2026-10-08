import "server-only";

import { db } from "@/lib/db";

export async function getApplicationStatus(memberId: string, verificationStatus: string) {
  if (verificationStatus === "Approved") return "Approved" as const;
  const latest = await db.manualKycSubmission.findFirst({
    where: { memberId },
    orderBy: { createdAt: "desc" },
    select: { status: true },
  });
  if (latest?.status === "Approved") return "Approved" as const;
  if (latest?.status === "Submitted" || latest?.status === "UnderReview") return "Pending" as const;
  if (latest?.status === "ResubmissionRequired") return "CorrectionRequired" as const;
  return "Incomplete" as const;
}
