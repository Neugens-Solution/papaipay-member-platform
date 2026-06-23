"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export type ParticipationFormState = { error?: string };

const DEMO_MEMBER_REF = process.env.DEMO_MEMBER_REF || "MEM-000001";
const RESERVATION_MINUTES = 60;

function makeRef(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function parseAmount(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || value.trim() === "") {
    return { error: "Participation amount is required." };
  }

  const normalized = value.replace(/,/g, "").trim();
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) {
    return { error: "Participation amount must be numeric." };
  }

  const amount = Number(normalized);
  if (!Number.isFinite(amount)) {
    return { error: "Participation amount must be numeric." };
  }

  return { amount };
}

async function getCurrentMemberId(tx: Prisma.TransactionClient) {
  // Temporary Phase 2C strategy until member authentication is integrated:
  // only use the seeded/demo member outside production. Production must wire a real session.
  if (process.env.NODE_ENV === "production" && !process.env.DEMO_MEMBER_REF) {
    throw new Error("Member authentication is not integrated yet.");
  }

  const member = await tx.member.findUnique({
    where: { memberRef: DEMO_MEMBER_REF },
    select: { id: true },
  });

  if (!member) {
    throw new Error(`Demo member ${DEMO_MEMBER_REF} was not found.`);
  }

  return member.id;
}

export async function createParticipationAction(
  _state: ParticipationFormState,
  formData: FormData,
): Promise<ParticipationFormState> {
  const campaignId = formData.get("campaignId");
  const parsedAmount = parseAmount(formData.get("amount"));

  if (typeof campaignId !== "string" || !campaignId) {
    return { error: "Campaign is required." };
  }

  if (parsedAmount.error || parsedAmount.amount === undefined) {
    return { error: parsedAmount.error };
  }

  let participationId: string;

  try {
    participationId = await db.$transaction(async (tx) => {
      const campaign = await tx.campaign.findUnique({
        where: { id: campaignId },
        select: {
          id: true,
          campaignRef: true,
          title: true,
          lifecycleStatus: true,
          publishStatus: true,
          visibility: true,
          campaignTarget: true,
          collectedAmountSnapshot: true,
          reservedAmountSnapshot: true,
          minimumParticipationAmount: true,
          maximumParticipationAmount: true,
          campaignOpenDate: true,
          campaignCloseDate: true,
        },
      });

      if (!campaign) throw new Error("Campaign was not found.");

      const now = new Date();
      const target = Number(campaign.campaignTarget);
      const collected = Number(campaign.collectedAmountSnapshot);
      const reserved = Number(campaign.reservedAmountSnapshot);
      const min = Number(campaign.minimumParticipationAmount);
      const max = Number(campaign.maximumParticipationAmount);
      const remaining = Math.max(target - collected - reserved, 0);
      const amount = parsedAmount.amount!;

      if (
        campaign.publishStatus !== "Published" ||
        campaign.visibility !== "MemberVisible" ||
        campaign.lifecycleStatus !== "Open" ||
        (campaign.campaignOpenDate && campaign.campaignOpenDate > now) ||
        (campaign.campaignCloseDate && campaign.campaignCloseDate < now)
      ) {
        throw new Error("Campaign is not currently open for participation.");
      }

      if (remaining <= 0) {
        throw new Error("Campaign is fully funded or closed.");
      }

      if (amount < min) {
        throw new Error(`Participation amount must be at least RM${min.toLocaleString()}.`);
      }

      if (amount > max) {
        throw new Error(`Participation amount must not exceed RM${max.toLocaleString()}.`);
      }

      if (amount > remaining) {
        throw new Error(`Participation amount must not exceed the remaining campaign amount of RM${remaining.toLocaleString()}.`);
      }

      const memberId = await getCurrentMemberId(tx);
      const reservedAt = now;
      const reservedUntil = new Date(now.getTime() + RESERVATION_MINUTES * 60 * 1000);
      const participation = await tx.participation.create({
        data: {
          participationRef: makeRef("PAR"),
          memberId,
          campaignId: campaign.id,
          participationAmount: new Prisma.Decimal(amount),
          participationStatus: "PendingPayment",
          reservedAt,
          reservedUntil,
          expiresAt: reservedUntil,
        },
      });

      await tx.campaign.update({
        where: { id: campaign.id },
        data: {
          reservedAmountSnapshot: { increment: new Prisma.Decimal(amount) },
        },
      });

      await tx.auditLog.create({
        data: {
          auditRef: makeRef("AUD"),
          action: "ParticipationCreated",
          entityType: "Participation",
          entityId: participation.id,
          afterSnapshot: {
            participationRef: participation.participationRef,
            campaignId: campaign.id,
            campaignRef: campaign.campaignRef,
            memberId,
            amount,
            status: participation.participationStatus,
            reservedUntil: reservedUntil.toISOString(),
            paymentIntegration: "Pending - no payment gateway in Phase 2C",
          },
        },
      });

      return participation.id;
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unable to create participation." };
  }

  redirect(`/member/participations/${participationId}`);
}
