"use server";

import { notifyAdmins } from "@/lib/notifications";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireMember } from "@/lib/auth/guards";
import { notifyMember } from "@/lib/notifications";
import { sendApplicationEmail } from "@/lib/email/application";
import {
  deletePrivateDocuments,
  uploadPrivateDocument,
  validatePrivateDocument,
} from "@/lib/storage/privateDocumentStorage";

export type ManualKycFormState = { error?: string; success?: string };

function makeRef(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function optionalFile(value: FormDataEntryValue | null) {
  if (!(value instanceof File) || value.size === 0) return null;
  validatePrivateDocument(value);
  return value;
}

export async function submitManualKycAction(
  _state: ManualKycFormState,
  formData: FormData,
): Promise<ManualKycFormState> {
  const { user, member } = await requireMember();

  try {
    const completeProfile = await db.member.findUnique({ where: { id: member.id }, select: { profileCompletedAt: true } });
    if (!completeProfile?.profileCompletedAt) return { error: "Save your full name, phone, nationality, date of birth and complete address before submitting your application." };
    const icFront = optionalFile(formData.get("icFront"));
    const icBack = optionalFile(formData.get("icBack"));
    if ((icFront?.size || 0) + (icBack?.size || 0) > 4 * 1024 * 1024) {
      return { error: "The two files must total 4MB or less. Choose smaller images or PDFs and try again." };
    }
    const current = await db.manualKycSubmission.findFirst({
      where: { memberId: member.id },
      orderBy: { createdAt: "desc" },
      include: { documents: true },
    });

    if (current?.status === "Approved" || member.verificationStatus === "Approved") {
      return { error: "Identity verification has already been approved." };
    }

    if (current && ["Submitted", "UnderReview"].includes(String(current.status))) {
      return { error: "Your identity documents are already under review." };
    }
    const previousFront = current?.status === "ResubmissionRequired" ? current.documents.find((document) => document.documentType === "IcFront") : null;
    const previousBack = current?.status === "ResubmissionRequired" ? current.documents.find((document) => document.documentType === "IcBack") : null;
    if (!icFront && !previousFront || !icBack && !previousBack) {
      return { error: "Both front and back identification documents are required." };
    }

    const storedDocuments: Awaited<ReturnType<typeof uploadPrivateDocument>>[] = [];
    try {
      if (icFront) storedDocuments.push(await uploadPrivateDocument(icFront, "kyc", member.memberRef));
      if (icBack) storedDocuments.push(await uploadPrivateDocument(icBack, "kyc", member.memberRef));

      const submissionId = await db.$transaction(async (tx) => {
        const submission = await tx.manualKycSubmission.create({
          data: { memberId: member.id, status: "Submitted", submittedAt: new Date() },
        });

        let uploadedIndex = 0;
        for (const [documentType, file, previous] of [["IcFront", icFront, previousFront], ["IcBack", icBack, previousBack]] as const) {
          let fileAssetId = previous?.fileAssetId;
          if (file) {
            const stored = storedDocuments[uploadedIndex++];
            const fileAsset = await tx.fileAsset.create({
              data: {
                fileRef: makeRef("FIL"), bucket: stored.bucket, objectKey: stored.objectKey,
                originalFilename: file.name, contentType: stored.contentType, sizeBytes: stored.sizeBytes,
                visibility: "Authenticated", purpose: "ManualKycDocument",
              },
            });
            fileAssetId = fileAsset.id;
          }
          if (!fileAssetId) throw new Error("Both sides of the identification document are required.");
          await tx.manualKycDocument.create({ data: { submissionId: submission.id, fileAssetId, documentType } });
        }

        const claimedMember = await tx.member.updateMany({
          where: {
            id: member.id,
            verificationStatus: { in: ["NotStarted", "Rejected", "ManualReview", "Expired", "Cancelled"] },
          },
          data: { verificationStatus: "Pending" },
        });
        if (claimedMember.count !== 1) {
          throw new Error("Your identity status changed while the documents were uploading. Refresh and check the latest status.");
        }

        await tx.auditLog.create({
          data: {
            auditRef: makeRef("AUD"),
            actorId: user.id,
            action: "ManualKycSubmitted",
            entityType: "ManualKycSubmission",
            entityId: submission.id,
            afterSnapshot: {
              memberId: member.id,
              memberRef: member.memberRef,
              status: "Submitted",
              documentTypes: ["IcFront", "IcBack"],
            },
          },
        });
        return submission.id;
      });
      // The database transaction owns the submitted state. Notification failures
      // must not remove documents that are already referenced by that state.
      await notifyMember(member.id, { title: "Application received", body: "Your membership application is under review." }).catch(() => undefined);
      await sendApplicationEmail({ kind: "received", to: user.email, name: member.fullName, eventId: submissionId });
    } catch (error) {
      // Only clean up uploaded blobs if no submission references them.
      const persisted = await db.manualKycSubmission.findFirst({ where: { memberId: member.id, status: "Submitted" }, orderBy: { createdAt: "desc" }, select: { id: true } }).catch(() => null);
      if (!persisted) await deletePrivateDocuments(storedDocuments.map((document) => document.objectKey)).catch(() => undefined);
      throw error;
    }

    await notifyAdmins({ title: "KYC submitted for review", body: `${member.fullName} (${member.memberRef}) uploaded IC documents for identity verification.` }).catch(() => undefined);
    revalidatePath("/member/profile");
    revalidatePath("/application");
    revalidatePath("/admin/members");
    return { success: "Your membership application was submitted for review. Dashboard access will be available after approval." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to submit identity documents." };
  }
}
