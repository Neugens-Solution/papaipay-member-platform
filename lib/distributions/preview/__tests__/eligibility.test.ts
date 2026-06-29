import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateParticipationEligibility } from "../eligibility";
import type { ParticipationLike } from "../types";

function participation(overrides: Partial<ParticipationLike> = {}): ParticipationLike {
  return { id: "p1", memberId: "m1", participationAmount: "100.00", participationStatus: "Confirmed", payments: [{ amount: "100.00", status: "Succeeded" }], distributions: [], ...overrides };
}

describe("distribution preview eligibility", () => {
  it("includes confirmed participations with succeeded payment coverage", () => {
    assert.equal("reasonCode" in evaluateParticipationEligibility(participation()), false);
  });
  it("excludes statuses and payment failures deterministically", () => {
    assert.equal((evaluateParticipationEligibility(participation({ participationStatus: "PendingPayment" })) as any).reasonCode, "PARTICIPATION_NOT_CONFIRMED");
    assert.equal((evaluateParticipationEligibility(participation({ participationStatus: "Cancelled" })) as any).reasonCode, "PARTICIPATION_CANCELLED");
    assert.equal((evaluateParticipationEligibility(participation({ participationStatus: "Refunded" })) as any).reasonCode, "PARTICIPATION_REFUNDED");
    assert.equal((evaluateParticipationEligibility(participation({ payments: [] })) as any).reasonCode, "PAYMENT_NOT_SUCCEEDED");
    assert.equal((evaluateParticipationEligibility(participation({ payments: [{ amount: "99.99", status: "Succeeded" }] })) as any).reasonCode, "PAYMENT_AMOUNT_INSUFFICIENT");
    assert.equal((evaluateParticipationEligibility(participation({ participationAmount: "0.00" })) as any).reasonCode, "INVALID_PARTICIPATION_AMOUNT");
  });
  it("allows multiple succeeded payments to cover the participation and excludes active distributions", () => {
    assert.equal("reasonCode" in evaluateParticipationEligibility(participation({ payments: [{ amount: "40.00", status: "Succeeded" }, { amount: "60.00", status: "Succeeded" }] })), false);
    assert.equal((evaluateParticipationEligibility(participation({ distributions: [{ status: "Pending" }] })) as any).reasonCode, "EXISTING_DISTRIBUTION_FOUND");
  });
});
