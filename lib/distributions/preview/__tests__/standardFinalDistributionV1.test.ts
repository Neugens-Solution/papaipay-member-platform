import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { standardFinalDistributionV1 } from "../formulas/standardFinalDistributionV1";
import type { EligibleParticipation } from "../types";

function eligible(id: string, amount: bigint): EligibleParticipation {
  return { participation: { id, memberId: `m-${id}`, participationAmount: amount.toString(), participationStatus: "Confirmed" }, participationAmountCents: amount, succeededPaymentAmountCents: amount };
}

describe("STANDARD_FINAL_DISTRIBUTION_V1", () => {
  it("allocates all pools to a single member", () => {
    const result = standardFinalDistributionV1.calculate({ eligible: [eligible("p1", BigInt(10000))], pools: { principalReturnPool: BigInt(10000), holdingReturnPool: BigInt(500), profitDistributionPool: BigInt(250) } });
    assert.equal(result.principalReturn[0].cents, BigInt(10000));
    assert.equal(result.holdingReturn[0].cents + result.profitDistribution[0].cents, BigInt(750));
  });
  it("splits equal and unequal members proportionally", () => {
    const equal = standardFinalDistributionV1.calculate({ eligible: [eligible("p1", BigInt(10000)), eligible("p2", BigInt(10000))], pools: { principalReturnPool: BigInt(10000), holdingReturnPool: BigInt(0), profitDistributionPool: BigInt(0) } });
    assert.deepEqual(equal.principalReturn.map((row) => row.cents), [BigInt(5000), BigInt(5000)]);
    const unequal = standardFinalDistributionV1.calculate({ eligible: [eligible("p1", BigInt(10000)), eligible("p2", BigInt(30000))], pools: { principalReturnPool: BigInt(10000), holdingReturnPool: BigInt(0), profitDistributionPool: BigInt(0) } });
    assert.deepEqual(unequal.principalReturn.map((row) => row.cents), [BigInt(2500), BigInt(7500)]);
  });
});
