"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireMember } from "@/lib/auth/guards";
import {
  deletePrivateDocuments,
  uploadPrivateDocument,
  validatePrivateDocument,
} from "@/lib/storage/privateDocumentStorage";

export type ManualKycFormState = { error?: string; success?: string };

function makeRef(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function requiredFile(value: FormDataEntryValue | null, label: string) {
  if (!(value instanceof File) || value.size === 0) throw new Error(`${label} is required.`);
  validatePrivateDocument(value);
  return value;
}

export async function submitManualKycAction(
  _state: ManualKycFormState,
  formData: FormData,
): Promise<ManualKycFormState> {
  const { user, member } = await requireMember();

  try {
    const icFront = requiredFile(formData.get("icFront"), "IC front image");
    const icBack = requiredFile(formData.get("icBack"), "IC back image");
    const current = await db.manualKycSubmission.findFirst({
      where: { memberId: member.id },
      orderBy: { createdAt: "desc" },
      select: { status: true },
    });

    if (current?.status === "Approved" || member.verificationStatus === "Approved") {
      return { error: "Identity verification has already been approved." };
    }

    if (current && ["Submitted", "UnderReview"].includes(String(current.status))) {
      return { error: "Your identity documents are already under review." };
    }

    const storedDocuments: Awaited<ReturnType<typeof uploadPrivateDocument>>[] = [];
    try {
      storedDocuments.push(await uploadPrivateDocument(icFront, "kyc", member.memberRef));
      storedDocuments.push(await uploadPrivateDocument(icBack, "kyc", member.memberRef));

      await db.$transaction(async (tx) => {
        const submission = await tx.manualKycSubmission.create({
          data: { memberId: member.id, status: "Submitted", submittedAt: new Date() },
        });

        for (let index = 0; index < storedDocuments.length; index += 1) {
          const stored = storedDocuments[index];
          const file = index === 0 ? icFront : icBack;
          const fileAsset = await tx.fileAsset.create({
            data: {
              fileRef: makeRef("FIL"),
              bucket: stored.bucket,
              objectKey: stored.objectKey,
              originalFilename: file.name,
              contentType: stored.contentType,
              sizeBytes: stored.sizeBytes,
              visibility: "Authenticated",
              purpose: "ManualKycDocument",
            },
          });

          await tx.manualKycDocument.create({
            data: {
              submissionId: submission.id,
              fileAssetId: fileAsset.id,
              documentType: index === 0 ? "IcFront" : "IcBack",
            },
          });
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
      });
    } catch (error) {
      await deletePrivateDocuments(storedDocuments.map((document) => document.objectKey)).catch(() => undefined);
      throw error;
    }

    revalidatePath("/member/profile");
    revalidatePath("/admin/members");
    return { success: "IC front and back were submitted securely for review." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to submit identity documents." };
  }
}
