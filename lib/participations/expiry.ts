import "server-only";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { formatRinggit, notifyMember } from "@/lib/notifications";

function makeRef(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

type ReleaseReason = "expired" | "admin-cancelled";

/**
 * Cancels one pending reservation and returns its amount to the listing's
 * remaining capacity. Returns null when the participation is no longer a
 * pending reservation (already confirmed, cancelled, or changed meanwhile).
 */
export async function releaseReservation(participationId: string, reason: ReleaseReason, actorId?: string) {
  const released = await db.$transaction(async (tx) => {
    const participation = await tx.participation.findUnique({
      where: { id: participationId },
      select: {
        id: true,
        memberId: true,
        campaignId: true,
        participationRef: true,
        participationAmount: true,
        participationStatus: true,
        campaign: { select: { title: true, reservedAmountSnapshot: true } },
        payments: { select: { id: true, status: true, receiptFileAssetId: true } },
      },
    });
    if (!participation || participation.participationStatus !== "PendingPayment") return null;
    // Never auto-expire once a receipt is in; the member may already have paid.
    if (reason === "expired" && participation.payments.some((payment) => payment.receiptFileAssetId)) return null;

    const claimed = await tx.participation.updateMany({
      where: { id: participation.id, participationStatus: "PendingPayment" },
      data: { participationStatus: "Cancelled" },
    });
    if (claimed.count !== 1) return null;

    await tx.payment.updateMany({
      where: { participationId: participation.id, status: { in: ["Pending", "Processing"] } },
      data: { status: reason === "expired" ? "Expired" : "Cancelled" },
    });

    const amount = Number(participation.participationAmount);
    const nextReserved = Math.max(Number(participation.campaign.reservedAmountSnapshot) - amount, 0);
    await tx.campaign.update({
      where: { id: participation.campaignId },
      data: { reservedAmountSnapshot: new Prisma.Decimal(nextReserved) },
    });

    await tx.auditLog.create({
      data: {
        auditRef: makeRef("AUD"),
        ...(actorId ? { actorId } : {}),
        action: reason === "expired" ? "ParticipationReservationExpired" : "ParticipationReservationCancelled",
        entityType: "Participation",
        entityId: participation.id,
        beforeSnapshot: { status: participation.participationStatus, reservedAmountSnapshot: Number(participation.campaign.reservedAmountSnapshot) },
        afterSnapshot: { status: "Cancelled", reservedAmountSnapshot: nextReserved, releasedAmount: amount },
      },
    });

    return { memberId: participation.memberId, campaignId: participation.campaignId, title: participation.campaign.title, ref: participation.participationRef, amount };
  });

  if (released) {
    await notifyMember(released.memberId, {
      campaignId: released.campaignId,
      title: reason === "expired" ? "Reservation expired" : "Reservation cancelled",
      body:
        reason === "expired"
          ? `Your reservation ${released.ref} of ${formatRinggit(released.amount)} for ${released.title} has expired because no payment receipt was received in time.`
          : `Your reservation ${released.ref} of ${formatRinggit(released.amount)} for ${released.title} was cancelled by the admin team.`,
    });
  }
  return released;
}

/**
 * Expires pending reservations whose reservedUntil has passed and that have no
 * receipt. Safe to call often (page loads, cron); failures are logged, never thrown.
 */
export async function expireStaleReservations(options: { campaignId?: string; participationId?: string } = {}) {
  try {
    const stale = await db.participation.findMany({
      where: {
        participationStatus: "PendingPayment",
        reservedUntil: { lt: new Date() },
        payments: { none: { receiptFileAssetId: { not: null } } },
        ...(options.campaignId ? { campaignId: options.campaignId } : {}),
        ...(options.participationId ? { id: options.participationId } : {}),
      },
      select: { id: true },
      take: 200,
    });
    let expired = 0;
    for (const { id } of stale) {
      if (await releaseReservation(id, "expired")) expired += 1;
    }
    return expired;
  } catch (error) {
    console.error("Expiring stale reservations failed", error);
    return 0;
  }
}
