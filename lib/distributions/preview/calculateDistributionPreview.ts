import { splitEligibleParticipations, formatParticipationAmount } from "./eligibility";
import { basisPointsPercent, centsToMoney, parseMoneyToCents } from "./money";
import { getDistributionFormula } from "./formulas/registry";
import type { DistributionPreviewInput, DistributionPreviewResult, Finding, MoneyPoolCents, MoneyPools } from "./types";

const ZERO_POOLS: MoneyPools = { principalReturnPool: "0.00", holdingReturnPool: "0.00", profitDistributionPool: "0.00", finalDistributionPool: "0.00" };

export function calculateDistributionPreview(input: DistributionPreviewInput): DistributionPreviewResult {
  const generatedAt = (input.generatedAt ?? new Date()).toISOString();
  const formulaProfile = input.formulaProfile ?? "STANDARD_FINAL_DISTRIBUTION_V1";
  const formula = getDistributionFormula(formulaProfile);
  const findings: Finding[] = [];
  const { eligible, excluded } = splitEligibleParticipations(input.participations);
  const settlement = input.settlement;
  const currency = input.currency ?? input.campaign.currency ?? "MYR";

  if (!formula) findings.push(blocker("UNSUPPORTED_FORMULA_PROFILE", `Formula profile ${formulaProfile} is not supported.`));
  if (!settlement) findings.push(blocker("NO_SETTLEMENT_FOUND", "No settlement was provided for distribution preview."));

  let poolCents: MoneyPoolCents = { principalReturnPool: BigInt(0), holdingReturnPool: BigInt(0), profitDistributionPool: BigInt(0), finalDistributionPool: BigInt(0) };
  if (settlement) {
    if (!["SuccessfulExit"].includes(settlement.settlementScenario)) findings.push(blocker("UNSUPPORTED_SETTLEMENT_SCENARIO", `Settlement scenario ${settlement.settlementScenario} is not supported by this formula.`));
    if (["Draft", "Reviewed"].includes(settlement.calculationStatus) && !input.config?.allowPreviewOnDraftSettlement) findings.push(blocker("SETTLEMENT_DRAFT_NOT_ALLOWED", "Draft or reviewed settlements are not ready for preview."));
    if (!["Approved", "Locked"].includes(settlement.calculationStatus) && !input.config?.allowPreviewOnDraftSettlement) findings.push(blocker("SETTLEMENT_NOT_APPROVED", "Settlement must be approved or locked before preview is valid."));
    if (settlement.calculationStatus === "Approved") findings.push(warning("SETTLEMENT_APPROVED_NOT_LOCKED", "Settlement is approved but not locked."));
    if (!settlement.calculationRemarks) findings.push(warning("MISSING_OPTIONAL_REMARKS", "Settlement calculation remarks are missing."));
    poolCents = readPools(settlement, findings);
    if (poolCents.principalReturnPool + poolCents.holdingReturnPool + poolCents.profitDistributionPool !== poolCents.finalDistributionPool) findings.push(blocker("COMPONENT_POOLS_DO_NOT_MATCH_FINAL_POOL", "Component pools must sum exactly to final distribution pool.", undefined, "finalDistributionPool"));
  }

  if (eligible.length === 0) findings.push(blocker("NO_ELIGIBLE_PARTICIPANTS", "No eligible participations are available for preview."));
  if (excluded.length > 0) findings.push(warning("SOME_PARTICIPANTS_EXCLUDED", "Some participations were excluded from preview.", excluded.map((row) => row.participation.id)));
  if (input.participations.length > 0 && input.participations.every((p) => (p.payments ?? []).every((payment) => payment.status !== "Succeeded"))) findings.push(blocker("ALL_PARTICIPANTS_MISSING_PAYMENT_COVERAGE", "No participation has succeeded payment coverage."));

  const totalEligible = eligible.reduce((sum, row) => sum + row.participationAmountCents, BigInt(0));
  const sourcePools = poolsToMoney(poolCents);
  const blockedBeforeFormula = findings.some((finding) => finding.severity === "blocker") || !formula;

  let rows: DistributionPreviewResult["rows"] = [];
  let allocated = { principalReturnPool: BigInt(0), holdingReturnPool: BigInt(0), profitDistributionPool: BigInt(0), finalDistributionTotal: BigInt(0) };

  if (!blockedBeforeFormula && formula && totalEligible > BigInt(0)) {
    const allocations = formula.calculate({ eligible, pools: poolCents });
    rows = eligible.map((item) => {
      const principal = allocations.principalReturn.find((row) => row.id === item.participation.id)!;
      const holding = allocations.holdingReturn.find((row) => row.id === item.participation.id)!;
      const profit = allocations.profitDistribution.find((row) => row.id === item.participation.id)!;
      const finalTotal = principal.cents + holding.cents + profit.cents;
      const roundingAdjustment = principal.roundingAdjustmentCents + holding.roundingAdjustmentCents + profit.roundingAdjustmentCents;
      allocated.principalReturnPool += principal.cents;
      allocated.holdingReturnPool += holding.cents;
      allocated.profitDistributionPool += profit.cents;
      allocated.finalDistributionTotal += finalTotal;
      return {
        participationId: item.participation.id,
        memberId: item.participation.memberId,
        memberRef: item.participation.member?.memberRef ?? null,
        name: item.participation.member?.fullName ?? null,
        email: item.participation.member?.email ?? item.participation.member?.user?.email ?? null,
        participationAmount: centsToMoney(item.participationAmountCents),
        succeededPaymentAmount: centsToMoney(item.succeededPaymentAmountCents),
        memberSharePercent: basisPointsPercent(item.participationAmountCents, totalEligible),
        principalReturn: centsToMoney(principal.cents),
        holdingReturn: centsToMoney(holding.cents),
        profitDistribution: centsToMoney(profit.cents),
        finalDistributionTotal: centsToMoney(finalTotal),
        roundingAdjustment: centsToMoney(roundingAdjustment),
        eligibilityStatus: "eligible" as const,
        warningCodes: [],
      };
    });
    if (allocated.principalReturnPool !== poolCents.principalReturnPool || allocated.holdingReturnPool !== poolCents.holdingReturnPool || allocated.profitDistributionPool !== poolCents.profitDistributionPool || allocated.finalDistributionTotal !== poolCents.finalDistributionPool) findings.push(blocker("ROUNDING_RECONCILIATION_FAILED", "Allocated totals do not reconcile to source pools."));
  }

  const reconciliation = {
    principalReturn: line(poolCents.principalReturnPool, allocated.principalReturnPool),
    holdingReturn: line(poolCents.holdingReturnPool, allocated.holdingReturnPool),
    profitDistribution: line(poolCents.profitDistributionPool, allocated.profitDistributionPool),
    finalDistributionTotal: line(poolCents.finalDistributionPool, allocated.finalDistributionTotal),
  };
  const warningCount = findings.filter((finding) => finding.severity === "warning").length;
  const blockerCount = findings.filter((finding) => finding.severity === "blocker").length;
  return {
    summary: {
      formulaProfile, formulaVersion: formula?.version ?? "unsupported", currency,
      campaignId: input.campaign.id, campaignTitle: input.campaign.title ?? null, settlementId: settlement?.id ?? null,
      calculationStatus: settlement?.calculationStatus ?? null, settlementScenario: settlement?.settlementScenario ?? null,
      totalEligibleParticipationAmount: centsToMoney(totalEligible), eligibleParticipantCount: eligible.length, excludedParticipantCount: excluded.length,
      sourcePools, allocatedTotals: { principalReturnPool: centsToMoney(allocated.principalReturnPool), holdingReturnPool: centsToMoney(allocated.holdingReturnPool), profitDistributionPool: centsToMoney(allocated.profitDistributionPool), finalDistributionTotal: centsToMoney(allocated.finalDistributionTotal) },
      reconciliationDifferences: { principalReturn: reconciliation.principalReturn.difference, holdingReturn: reconciliation.holdingReturn.difference, profitDistribution: reconciliation.profitDistribution.difference, finalDistributionTotal: reconciliation.finalDistributionTotal.difference },
      warningCount, blockerCount, isPreviewValid: blockerCount === 0, isPersistable: false,
    },
    rows,
    excludedRows: excluded.map((row) => ({ participationId: row.participation.id, memberId: row.participation.memberId, participationAmount: formatParticipationAmount(row.participationAmountCents), succeededPaymentAmount: centsToMoney(row.succeededPaymentAmountCents), reasonCode: row.reasonCode, reasonMessage: row.reasonMessage })),
    reconciliation, findings, generatedAt,
  };
}

function readPools(settlement: NonNullable<DistributionPreviewInput["settlement"]>, findings: Finding[]): MoneyPoolCents {
  const out: MoneyPoolCents = { principalReturnPool: BigInt(0), holdingReturnPool: BigInt(0), profitDistributionPool: BigInt(0), finalDistributionPool: BigInt(0) };
  for (const field of Object.keys(out) as Array<keyof MoneyPoolCents>) {
    if (settlement[field] === null || settlement[field] === undefined) { findings.push(blocker(field === "finalDistributionPool" ? "MISSING_FINAL_DISTRIBUTION_POOL" : "MISSING_COMPONENT_POOL", `${field} is required.`, undefined, field)); continue; }
    try { out[field] = parseMoneyToCents(settlement[field], { fieldName: field }); }
    catch (error) { findings.push(blocker(String(error).includes("negative") ? "INVALID_NEGATIVE_POOL" : "MISSING_COMPONENT_POOL", error instanceof Error ? error.message : `${field} is invalid.`, undefined, field)); }
  }
  return out;
}
function poolsToMoney(pools: MoneyPoolCents): MoneyPools { return { principalReturnPool: centsToMoney(pools.principalReturnPool), holdingReturnPool: centsToMoney(pools.holdingReturnPool), profitDistributionPool: centsToMoney(pools.profitDistributionPool), finalDistributionPool: centsToMoney(pools.finalDistributionPool) }; }
function line(source: bigint, allocated: bigint) { return { source: centsToMoney(source), allocated: centsToMoney(allocated), difference: centsToMoney(source - allocated) }; }
function blocker(code: string, message: string, affectedParticipationIds?: string[], affectedField?: string): Finding { return { code, severity: "blocker", message, affectedParticipationIds, affectedField }; }
function warning(code: string, message: string, affectedParticipationIds?: string[], affectedField?: string): Finding { return { code, severity: "warning", message, affectedParticipationIds, affectedField }; }
