"use server";

import { formatRinggit, notifyAdmins } from "@/lib/notifications";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { requireMember } from "@/lib/auth/guards";

const DAY_MS = 24 * 60 * 60 * 1000;
const MYT_OFFSET_MS = 8 * 60 * 60 * 1000;

function formatMalaysiaDate(date: Date) {
  return date.toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export type ParticipationFormState = { error?: string };

type AuthenticatedMember = Awaited<ReturnType<typeof requireMember>>;

const RESERVATION_MINUTES = 24 * 60;

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

async function createParticipationRecord({
  campaignId,
  campaignSlug,
  amount,
  authenticatedMember,
}: {
  campaignId: string;
  campaignSlug?: string;
  amount: number;
  authenticatedMember: AuthenticatedMember;
}) {
  return db.$transaction(async (tx) => {
    const campaign = await tx.campaign.findFirst({
      where: { id: campaignId, ...(campaignSlug ? { slug: campaignSlug } : {}) },
      select: {
        id: true,
        campaignRef: true,
        slug: true,
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

    if (!campaign) throw new Error("Opportunity was not found.");

    const now = new Date();
    const target = Number(campaign.campaignTarget);
    const collected = Number(campaign.collectedAmountSnapshot);
    const reserved = Number(campaign.reservedAmountSnapshot);
    const min = Number(campaign.minimumParticipationAmount);
    const max = Number(campaign.maximumParticipationAmount);
    const remaining = Math.max(target - collected - reserved, 0);

    if (
      campaign.publishStatus !== "Published" ||
      campaign.visibility !== "MemberVisible" ||
      campaign.lifecycleStatus !== "Open"
    ) {
      throw new Error("Opportunity is not currently open for participation.");
    }
    // Admin dates are calendar days (stored as UTC midnight). Treat them as
    // Malaysia-time days: open from 00:00 MYT, close after 23:59 MYT.
    const openAt = campaign.campaignOpenDate ? new Date(campaign.campaignOpenDate.getTime() - MYT_OFFSET_MS) : null;
    const closeAt = campaign.campaignCloseDate ? new Date(campaign.campaignCloseDate.getTime() - MYT_OFFSET_MS + DAY_MS) : null;
    if (openAt && openAt > now) {
      throw new Error(`Opportunity opens for participation on ${formatMalaysiaDate(campaign.campaignOpenDate!)}.`);
    }
    if (closeAt && closeAt <= now) {
      throw new Error(`Opportunity closed for participation on ${formatMalaysiaDate(campaign.campaignCloseDate!)}.`);
    }

    if (remaining <= 0) {
      throw new Error("Opportunity is fully funded or closed.");
    }

    if (amount < min) {
      throw new Error(`Participation amount must be at least RM${min.toLocaleString()}.`);
    }

    if (amount > max) {
      throw new Error(`Participation amount must not exceed RM${max.toLocaleString()}.`);
    }

    if (amount > remaining) {
      throw new Error(`Participation amount must not exceed the remaining opportunity amount of RM${remaining.toLocaleString()}.`);
    }

    const memberId = authenticatedMember.member.id;
    const reservedAt = now;
    const reservedUntil = new Date(now.getTime() + RESERVATION_MINUTES * 60 * 1000);
    const paymentRef = makeRef("PAY");
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

    const payment = await tx.payment.create({
      data: {
        paymentRef,
        memberId,
        campaignId: campaign.id,
        participationId: participation.id,
        gateway: "manual",
        amount: new Prisma.Decimal(amount),
        status: "Pending",
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
        actorId: authenticatedMember.user.id,
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
          paymentIntegration: "Manual confirmation pending",
        },
      },
    });

    await tx.auditLog.create({
      data: {
        auditRef: makeRef("AUD"),
        actorId: authenticatedMember.user.id,
        action: "PaymentCreated",
        entityType: "Payment",
        entityId: payment.id,
        afterSnapshot: {
          paymentRef: payment.paymentRef,
          campaignId: campaign.id,
          campaignRef: campaign.campaignRef,
          memberId,
          participationId: participation.id,
          amount,
          status: payment.status,
          gateway: payment.gateway,
        },
      },
    });

    return {
      participationId: participation.id,
      participationRef: participation.participationRef,
      paymentRef: payment.paymentRef,
      campaignSlug: campaign.slug,
      campaignId: campaign.id,
      campaignTitle: campaign.title,
    };
  });
}

export async function createParticipationAction(formData: FormData): Promise<void>;
export async function createParticipationAction(
  _state: ParticipationFormState,
  formData: FormData,
): Promise<ParticipationFormState>;
export async function createParticipationAction(
  stateOrFormData: ParticipationFormState | FormData,
  maybeFormData?: FormData,
): Promise<ParticipationFormState | void> {
  const directSubmit = stateOrFormData instanceof FormData;
  const formData = directSubmit ? stateOrFormData : maybeFormData;

  if (!formData) {
    if (directSubmit) throw new Error("Participation form data is required.");
    return { error: "Participation form data is required." };
  }

  const campaignId = formData.get("campaignId");
  const campaignSlug = formData.get("campaignSlug");
  const parsedAmount = parseAmount(formData.get("amount"));
  const authenticatedMember = await requireMember();

  if (authenticatedMember.member.verificationStatus !== "Approved") {
    const message = "Complete and obtain approval for identity verification before participating.";
    if (directSubmit) throw new Error(message);
    return { error: message };
  }

  if (typeof campaignId !== "string" || !campaignId) {
    if (directSubmit) throw new Error("Opportunity is required.");
    return { error: "Opportunity is required." };
  }

  if (parsedAmount.error || parsedAmount.amount === undefined) {
    if (directSubmit) throw new Error(parsedAmount.error || "Participation amount is required.");
    return { error: parsedAmount.error };
  }

  let result: Awaited<ReturnType<typeof createParticipationRecord>>;

  try {
    result = await createParticipationRecord({
      campaignId,
      campaignSlug: typeof campaignSlug === "string" && campaignSlug ? campaignSlug : undefined,
      amount: parsedAmount.amount,
      authenticatedMember,
    });
  } catch (error) {
    if (directSubmit) throw error;
    return { error: error instanceof Error ? error.message : "Unable to create participation." };
  }

  await notifyAdmins({
    campaignId: result.campaignId,
    title: "New participation",
    body: `${authenticatedMember.member.fullName} joined ${result.campaignTitle} with ${formatRinggit(parsedAmount.amount)} (${result.participationRef}). Awaiting payment receipt.`,
  });
  revalidatePath("/member/portfolio");
  revalidatePath(`/member/opportunities/${result.campaignSlug}`);
  revalidatePath(`/admin/projects/${result.campaignSlug}`);

  if (formData.get("redirectTo") === "participationSuccess") {
    redirect(`/member/opportunities/${result.campaignSlug}/participate/success?participationId=${result.participationId}`);
  }

  redirect(`/member/participations/${result.participationId}`);
}
