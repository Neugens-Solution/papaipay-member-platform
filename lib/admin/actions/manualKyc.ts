"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminPermission } from "@/lib/auth/guards";

function makeRef(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function requiredString(value: FormDataEntryValue | null, message: string) {
  if (typeof value !== "string" || value.trim() === "") throw new Error(message);
  return value.trim();
}

export async function reviewManualKycAction(formData: FormData) {
  const { user } = await requireAdminPermission("members.review-kyc");
  const memberId = requiredString(formData.get("memberId"), "Member is required.");
  const submissionId = requiredString(formData.get("submissionId"), "KYC submission is required.");
  const decision = requiredString(formData.get("decision"), "Review decision is required.");
  const reason = typeof formData.get("reason") === "string" ? String(formData.get("reason")).trim() : "";
  if (!["Approved", "ResubmissionRequired"].includes(decision)) throw new Error("Invalid KYC review decision.");
  if (decision === "ResubmissionRequired" && !reason) throw new Error("Provide a reason for resubmission.");

  await db.$transaction(async (tx) => {
    const submission = await tx.manualKycSubmission.findFirst({
      where: { id: submissionId, memberId, status: { in: ["Submitted", "UnderReview"] } },
      include: { documents: true },
    });
    if (!submission) throw new Error("This KYC submission is no longer pending review.");
    if (!submission.documents.some((document) => document.documentType === "IcFront") || !submission.documents.some((document) => document.documentType === "IcBack")) {
      throw new Error("Both IC front and IC back documents are required before review.");
    }

    const approved = decision === "Approved";
    const updatedSubmission = await tx.manualKycSubmission.updateMany({
      where: { id: submission.id, memberId, status: { in: ["Submitted", "UnderReview"] } },
      data: {
        status: approved ? "Approved" : "ResubmissionRequired",
        reviewedById: user.id,
        reviewedAt: new Date(),
        rejectionReason: approved ? null : reason,
      },
    });
    if (updatedSubmission.count !== 1) throw new Error("This KYC submission was already reviewed. Refresh to see its latest status.");
    await tx.manualKycDocument.updateMany({
      where: { submissionId: submission.id },
      data: { documentStatus: approved ? "Accepted" : "Rejected", rejectionReason: approved ? null : reason },
    });
    await tx.member.update({
      where: { id: memberId },
      data: { verificationStatus: approved ? "Approved" : "Rejected" },
    });
    await tx.auditLog.create({
      data: {
        auditRef: makeRef("AUD"),
        actorId: user.id,
        action: approved ? "ManualKycApproved" : "ManualKycResubmissionRequired",
        entityType: "ManualKycSubmission",
        entityId: submission.id,
        beforeSnapshot: { status: submission.status },
        afterSnapshot: { status: decision, memberId, reason: approved ? null : reason },
      },
    });
  });

  revalidatePath("/admin/members");
  revalidatePath(`/admin/members/${memberId}`);
  revalidatePath("/member/profile");
}
