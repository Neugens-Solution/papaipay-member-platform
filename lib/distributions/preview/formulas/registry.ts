import { standardFinalDistributionV1 } from "./standardFinalDistributionV1";

export const distributionFormulaRegistry = {
  STANDARD_FINAL_DISTRIBUTION_V1: standardFinalDistributionV1,
};

export function getDistributionFormula(profile: string) {
  return distributionFormulaRegistry[profile as keyof typeof distributionFormulaRegistry] ?? null;
}
