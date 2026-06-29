import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateDistributionPreview } from "../calculateDistributionPreview";
import type { DistributionPreviewInput } from "../types";

function input(overrides: Partial<DistributionPreviewInput> = {}): DistributionPreviewInput {
  return {
    campaign: { id: "c1", title: "Campaign", currency: "MYR" },
    settlement: { id: "s1", campaignId: "c1", calculationStatus: "Locked", settlementScenario: "SuccessfulExit", principalReturnPool: "100.00", holdingReturnPool: "10.00", profitDistributionPool: "5.00", finalDistributionPool: "115.00", calculationRemarks: "ok" },
    participations: [{ id: "p1", memberId: "m1", participationAmount: "100.00", participationStatus: "Confirmed", confirmedAt: "2026-01-01", payments: [{ status: "Succeeded", amount: "100.00" }], distributions: [] }],
    generatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

describe("calculateDistributionPreview", () => {
  it("returns a valid reconciled preview", () => {
    const result = calculateDistributionPreview(input());
    assert.equal(result.summary.isPreviewValid, true);
    assert.equal(result.rows[0].finalDistributionTotal, "115.00");
    assert.equal(result.reconciliation.finalDistributionTotal.difference, "0.00");
    assert.equal(result.summary.isPersistable, false);
  });
  it("blocks invalid pools and missing eligible participants", () => {
    assert.equal(calculateDistributionPreview(input({ settlement: { ...input().settlement!, finalDistributionPool: "116.00" } })).findings.some((f) => f.code === "COMPONENT_POOLS_DO_NOT_MATCH_FINAL_POOL"), true);
    assert.equal(calculateDistributionPreview(input({ settlement: { ...input().settlement!, finalDistributionPool: null } })).findings.some((f) => f.code === "MISSING_FINAL_DISTRIBUTION_POOL"), true);
    assert.equal(calculateDistributionPreview(input({ participations: [] })).findings.some((f) => f.code === "NO_ELIGIBLE_PARTICIPANTS"), true);
  });
  it("warns when approved but not locked", () => {
    const result = calculateDistributionPreview(input({ settlement: { ...input().settlement!, calculationStatus: "Approved" } }));
    assert.equal(result.findings.some((finding) => finding.code === "SETTLEMENT_APPROVED_NOT_LOCKED"), true);
  });
});
