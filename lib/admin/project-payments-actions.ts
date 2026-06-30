"use server";

import { revalidatePath } from "next/cache";
import { Prisma, PaymentStatus, ParticipationStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guards";

function makeRef(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function parseMoney(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") throw new Error("Payment amount is required.");
  const normalized = value.replace(/,/g, "").trim();
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) throw new Error("Payment amount must be a valid money value.");
  const amount = Number(normalized);
  if (!Number.isFinite(amount) || amount <= 0) throw new Error("Payment amount must be greater than zero.");
  return amount;
}

function requiredString(value: FormDataEntryValue | null, message: string) {
  if (typeof value !== "string" || value.trim() === "") throw new Error(message);
  return value.trim();
}

export async function confirmManualPaymentAction(formData: FormData): Promise<void> {
  const { user, admin } = await requireAdmin();
  const campaignId = requiredString(formData.get("campaignId"), "Campaign is required.");
  const participationId = requiredString(formData.get("participationId"), "Participation is required.");
  const projectSlug = requiredString(formData.get("projectSlug"), "Project workspace is required.");
  const submittedAmount = parseMoney(formData.get("paymentAmount"));
  const reference = requiredString(formData.get("paymentReference"), "Payment reference is required.");
  const paymentDate = requiredString(formData.get("paymentDate"), "Payment date is required.");
  const notesValue = formData.get("notes");
  const notes = typeof notesValue === "string" ? notesValue.trim() : "";

  const submittedPaymentDate = new Date(`${paymentDate}T00:00:00.000Z`);
  if (Number.isNaN(submittedPaymentDate.getTime())) throw new Error("Payment date is invalid.");

  await db.$transaction(async (tx) => {
    const participation = await tx.participation.findFirst({
      where: { id: participationId, campaignId },
      include: { payments: { where: { gateway: "manual" }, orderBy: { updatedAt: "desc" }, take: 1 } },
    });

    if (!participation) throw new Error("Participation was not found for this project.");
    const payment = participation.payments[0];
    if (!payment) throw new Error("Pending manual payment was not found for this participation.");

    if (participation.participationStatus === ParticipationStatus.Confirmed && payment.status === PaymentStatus.Succeeded) return;
    if (
      participation.participationStatus === ParticipationStatus.Cancelled ||
      participation.participationStatus === ParticipationStatus.Refunded
    ) throw new Error("Cancelled or refunded participations cannot be confirmed.");
    if (participation.participationStatus !== ParticipationStatus.PendingPayment) throw new Error("Only pending payment participations can be manually confirmed.");
    if (
      payment.status !== PaymentStatus.Pending &&
      payment.status !== PaymentStatus.Processing
    ) throw new Error(`Manual confirmation is not allowed for ${payment.status} payments.`);

    const participationAmount = Number(participation.participationAmount);
    if (submittedAmount !== participationAmount) throw new Error("Manual confirmation amount must exactly equal the participation amount for Phase 1.");

    const duplicate = await tx.payment.findFirst({
      where: { gateway: "manual", reconciliationReference: reference, NOT: { id: payment.id } },
      select: { id: true },
    });
    if (duplicate) throw new Error("A manual payment with this reference already exists.");

    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.Succeeded,
        amount: new Prisma.Decimal(submittedAmount),
        reconciliationReference: reference,
        providerResponse: {
          provider: "manual",
          confirmedByAdminId: admin.id,
          confirmedByUserId: user.id,
          paymentDate: submittedPaymentDate.toISOString(),
          notes: notes || null,
          redacted: true,
        },
      },
    });

    const confirmedAt = new Date();
    const campaignSnapshot = await tx.campaign.findUniqueOrThrow({
      where: { id: participation.campaignId },
      select: { reservedAmountSnapshot: true },
    });
    const nextReservedSnapshot = Math.max(Number(campaignSnapshot.reservedAmountSnapshot) - participationAmount, 0);

    await tx.participation.update({ where: { id: participation.id }, data: { participationStatus: ParticipationStatus.Confirmed, confirmedAt } });
    await tx.campaign.update({
      where: { id: participation.campaignId },
      data: {
        reservedAmountSnapshot: new Prisma.Decimal(nextReservedSnapshot),
        collectedAmountSnapshot: { increment: new Prisma.Decimal(participationAmount) },
      },
    });

    await tx.auditLog.createMany({
      data: [
        { auditRef: makeRef("AUD"), actorId: user.id, action: "ManualPaymentConfirmed", entityType: "Payment", entityId: payment.id, beforeSnapshot: { status: payment.status, reconciliationReference: payment.reconciliationReference }, afterSnapshot: { status: PaymentStatus.Succeeded, reconciliationReference: reference, amount: submittedAmount, paymentDate: submittedPaymentDate.toISOString() } },
        { auditRef: makeRef("AUD"), actorId: user.id, action: "ParticipationConfirmed", entityType: "Participation", entityId: participation.id, beforeSnapshot: { status: participation.participationStatus }, afterSnapshot: { status: ParticipationStatus.Confirmed, confirmedAt: confirmedAt.toISOString() } },
        { auditRef: makeRef("AUD"), actorId: user.id, action: "CampaignSnapshotsUpdated", entityType: "Campaign", entityId: participation.campaignId, beforeSnapshot: { reservedAmountSnapshot: Number(campaignSnapshot.reservedAmountSnapshot) }, afterSnapshot: { reservedAmountSnapshot: nextReservedSnapshot, collectedAmountIncrement: participationAmount, source: "manual-payment-confirmation" } },
      ],
    });
  });

  revalidatePath(`/admin/projects/${projectSlug}`);
}
