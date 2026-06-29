import { centsToMoney, parseMoneyToCents } from "./money";
import type { EligibleParticipation, ExcludedParticipation, ExclusionReasonCode, ParticipationLike } from "./types";

const ACTIVE_DISTRIBUTION_STATUSES = new Set(["Pending", "Processing", "Paid"]);
const REASON_MESSAGES: Record<ExclusionReasonCode, string> = {
  INVALID_PARTICIPATION_AMOUNT: "Participation amount must be greater than zero.",
  PARTICIPATION_CANCELLED: "Participation has been cancelled.",
  PARTICIPATION_REFUNDED: "Participation has been refunded.",
  PARTICIPATION_NOT_CONFIRMED: "Participation is not confirmed.",
  PAYMENT_NOT_SUCCEEDED: "No succeeded payment covers this participation.",
  PAYMENT_AMOUNT_INSUFFICIENT: "Succeeded payment amount is less than the participation amount.",
  EXISTING_DISTRIBUTION_FOUND: "An active distribution already exists for this participation.",
};

export function succeededPaymentAmountCents(participation: ParticipationLike): bigint {
  return (participation.payments ?? []).filter((payment) => payment.status === "Succeeded").reduce((sum, payment) => sum + parseMoneyToCents(payment.amount, { fieldName: "payment.amount" }), BigInt(0));
}

export function evaluateParticipationEligibility(participation: ParticipationLike): EligibleParticipation | ExcludedParticipation {
  let participationAmountCents: bigint | undefined;
  let succeeded = BigInt(0);
  try { participationAmountCents = parseMoneyToCents(participation.participationAmount, { fieldName: "participation.participationAmount" }); } catch { participationAmountCents = undefined; }
  try { succeeded = succeededPaymentAmountCents(participation); } catch { succeeded = BigInt(0); }

  const reason = getExclusionReason(participation, participationAmountCents, succeeded);
  if (reason) return { participation, participationAmountCents, succeededPaymentAmountCents: succeeded, reasonCode: reason, reasonMessage: REASON_MESSAGES[reason] };
  return { participation, participationAmountCents: participationAmountCents!, succeededPaymentAmountCents: succeeded };
}

function getExclusionReason(participation: ParticipationLike, amount: bigint | undefined, succeeded: bigint): ExclusionReasonCode | null {
  if (amount === undefined || amount <= BigInt(0)) return "INVALID_PARTICIPATION_AMOUNT";
  if (participation.participationStatus === "Cancelled") return "PARTICIPATION_CANCELLED";
  if (participation.participationStatus === "Refunded") return "PARTICIPATION_REFUNDED";
  if (participation.participationStatus !== "Confirmed") return "PARTICIPATION_NOT_CONFIRMED";
  if ((participation.payments ?? []).every((payment) => payment.status !== "Succeeded")) return "PAYMENT_NOT_SUCCEEDED";
  if (succeeded < amount) return "PAYMENT_AMOUNT_INSUFFICIENT";
  if ((participation.distributions ?? []).some((distribution) => ACTIVE_DISTRIBUTION_STATUSES.has(distribution.status))) return "EXISTING_DISTRIBUTION_FOUND";
  return null;
}

export function splitEligibleParticipations(participations: ParticipationLike[]) {
  const eligible: EligibleParticipation[] = [];
  const excluded: ExcludedParticipation[] = [];
  for (const participation of participations) {
    const result = evaluateParticipationEligibility(participation);
    if ("reasonCode" in result) excluded.push(result); else eligible.push(result);
  }
  return { eligible, excluded };
}

export function formatParticipationAmount(amount: bigint | undefined): string | null { return amount === undefined ? null : centsToMoney(amount); }
