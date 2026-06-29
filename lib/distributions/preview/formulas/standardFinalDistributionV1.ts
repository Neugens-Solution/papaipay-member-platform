import { allocateLargestRemainderCents } from "../rounding";
import type { EligibleParticipation } from "../types";

export const standardFinalDistributionV1 = {
  profile: "STANDARD_FINAL_DISTRIBUTION_V1" as const,
  version: "1.0.0" as const,
  calculate(input: { eligible: EligibleParticipation[]; pools: { principalReturnPool: bigint; holdingReturnPool: bigint; profitDistributionPool: bigint } }) {
    const allocationInputs = input.eligible.map((item) => ({ id: item.participation.id, participationAmountCents: item.participationAmountCents, confirmedAt: item.participation.confirmedAt }));
    return {
      principalReturn: allocateLargestRemainderCents(input.pools.principalReturnPool, allocationInputs),
      holdingReturn: allocateLargestRemainderCents(input.pools.holdingReturnPool, allocationInputs),
      profitDistribution: allocateLargestRemainderCents(input.pools.profitDistributionPool, allocationInputs),
    };
  },
};
