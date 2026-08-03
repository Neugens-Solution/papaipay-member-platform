"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireMember } from "@/lib/auth/guards";
import {
  deletePrivateDocuments,
  uploadPrivateDocument,
  validatePrivateDocument,
} from "@/lib/storage/privateDocumentStorage";

export type PaymentReceiptFormState = { error?: string; success?: string };

function makeRef(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function requiredString(value: FormDataEntryValue | null, message: string) {
  if (typeof value !== "string" || value.trim() === "") throw new Error(message);
  return value.trim();
}

export async function submitPaymentReceiptAction(
  _state: PaymentReceiptFormState,
  formData: FormData,
): Promise<PaymentReceiptFormState> {
  const { user, member } = await requireMember();

  try {
    const participationId = requiredString(formData.get("participationId"), "Participation is required.");
    const paymentId = requiredString(formData.get("paymentId"), "Payment record is required.");
    const bankReference = requiredString(formData.get("bankReference"), "Bank transfer reference is required.");
    const receipt = formData.get("receipt");
    if (!(receipt instanceof File) || receipt.size === 0) throw new Error("Payment receipt is required.");
    validatePrivateDocument(receipt);

    const payment = await db.payment.findFirst({
      where: {
        id: paymentId,
        memberId: member.id,
        participationId,
        participation: { memberId: member.id, participationStatus: "PendingPayment" },
        status: { in: ["Pending", "Processing"] },
      },
      include: { receiptFileAsset: { select: { objectKey: true } } },
    });
    if (!payment) throw new Error("This pending payment record is no longer available for receipt upload.");

    const stored = await uploadPrivateDocument(receipt, "payment-receipts", payment.paymentRef);
    try {
      await db.$transaction(async (tx) => {
        const fileAsset = await tx.fileAsset.create({
          data: {
            fileRef: makeRef("FIL"),
            bucket: stored.bucket,
            objectKey: stored.objectKey,
            originalFilename: receipt.name,
            contentType: stored.contentType,
            sizeBytes: stored.sizeBytes,
            visibility: "Authenticated",
            purpose: "PaymentReceipt",
          },
        });

        const updatedPayment = await tx.payment.updateMany({
          where: {
            id: payment.id,
            memberId: member.id,
            status: { in: ["Pending", "Processing"] },
            participation: { memberId: member.id, participationStatus: "PendingPayment" },
          },
          data: {
            status: "Processing",
            receiptFileAssetId: fileAsset.id,
            submittedReference: bankReference,
            memberNotes: typeof formData.get("notes") === "string" ? String(formData.get("notes")).trim() || null : null,
            submittedAt: new Date(),
          },
        });
        if (updatedPayment.count !== 1) {
          throw new Error("This payment changed while the receipt was uploading. Refresh and check its latest status.");
        }

        await tx.auditLog.create({
          data: {
            auditRef: makeRef("AUD"),
            actorId: user.id,
            action: "ManualPaymentReceiptSubmitted",
            entityType: "Payment",
            entityId: payment.id,
            beforeSnapshot: { status: payment.status, receiptFileAssetId: payment.receiptFileAssetId },
            afterSnapshot: { status: "Processing", receiptFileAssetId: fileAsset.id, submittedReference: bankReference },
          },
        });
      });
    } catch (error) {
      await deletePrivateDocuments([stored.objectKey]).catch(() => undefined);
      throw error;
    }

    if (payment.receiptFileAsset?.objectKey) {
      await deletePrivateDocuments([payment.receiptFileAsset.objectKey]).catch(() => undefined);
    }

    revalidatePath(`/member/participations/${participationId}`);
    revalidatePath("/member/portfolio");
    return { success: "Payment receipt submitted. The admin team can now review it." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to submit payment receipt." };
  }
}
