export type MoneyInput = string | number | bigint | { toString(): string };
export type MoneyCents = bigint;

export type FormulaProfile = "STANDARD_FINAL_DISTRIBUTION_V1";
export type FormulaVersion = "1.0.0";
export type CalculationStatus = "Draft" | "Reviewed" | "Approved" | "Locked" | string;
export type SettlementScenario = "SuccessfulExit" | "PrincipalOnlyAfterMaxHoldingPeriod" | string;
export type FindingSeverity = "info" | "warning" | "blocker";

export type Finding = {
  code: string;
  severity: FindingSeverity;
  message: string;
  affectedParticipationIds?: string[];
  affectedField?: string;
  metadata?: Record<string, unknown>;
};

export type ExclusionReasonCode =
  | "PARTICIPATION_NOT_CONFIRMED"
  | "PAYMENT_NOT_SUCCEEDED"
  | "PAYMENT_AMOUNT_INSUFFICIENT"
  | "PARTICIPATION_REFUNDED"
  | "PARTICIPATION_CANCELLED"
  | "EXISTING_DISTRIBUTION_FOUND"
  | "INVALID_PARTICIPATION_AMOUNT";

export type PaymentLike = { id?: string; amount: MoneyInput | null | undefined; status: string };
export type DistributionLike = { id?: string; status: string };
export type MemberLike = { id: string; memberRef?: string | null; fullName?: string | null; email?: string | null; user?: { email?: string | null } | null };
export type ParticipationLike = {
  id: string;
  memberId: string;
  participationAmount: MoneyInput | null | undefined;
  participationStatus: string;
  confirmedAt?: Date | string | null;
  member?: MemberLike | null;
  payments?: PaymentLike[];
  distributions?: DistributionLike[];
};
export type CampaignLike = { id: string; title?: string | null; currency?: string | null };
export type SettlementLike = {
  id: string;
  campaignId: string;
  calculationStatus: CalculationStatus;
  settlementScenario: SettlementScenario;
  principalReturnPool?: MoneyInput | null;
  holdingReturnPool?: MoneyInput | null;
  profitDistributionPool?: MoneyInput | null;
  finalDistributionPool?: MoneyInput | null;
  calculationRemarks?: string | null;
};

export type DistributionPreviewInput = {
  campaign: CampaignLike;
  settlement?: SettlementLike | null;
  participations: ParticipationLike[];
  formulaProfile?: FormulaProfile | string;
  currency?: string;
  generatedAt?: Date;
  config?: { allowPreviewOnDraftSettlement?: boolean };
};

export type MoneyPools = {
  principalReturnPool: string;
  holdingReturnPool: string;
  profitDistributionPool: string;
  finalDistributionPool: string;
};
export type MoneyPoolCents = Record<keyof MoneyPools, bigint>;

export type EligibleParticipation = {
  participation: ParticipationLike;
  participationAmountCents: bigint;
  succeededPaymentAmountCents: bigint;
};
export type ExcludedParticipation = {
  participation: ParticipationLike;
  participationAmountCents?: bigint;
  succeededPaymentAmountCents: bigint;
  reasonCode: ExclusionReasonCode;
  reasonMessage: string;
};

export type DistributionPreviewRow = {
  participationId: string;
  memberId: string;
  memberRef?: string | null;
  name?: string | null;
  email?: string | null;
  participationAmount: string;
  succeededPaymentAmount: string;
  memberSharePercent: string;
  principalReturn: string;
  holdingReturn: string;
  profitDistribution: string;
  finalDistributionTotal: string;
  roundingAdjustment: string;
  eligibilityStatus: "eligible";
  warningCodes: string[];
};
export type DistributionPreviewExcludedRow = {
  participationId: string;
  memberId: string;
  participationAmount: string | null;
  succeededPaymentAmount: string;
  reasonCode: ExclusionReasonCode;
  reasonMessage: string;
};
export type ReconciliationLine = { source: string; allocated: string; difference: string };
export type DistributionPreviewResult = {
  summary: {
    formulaProfile: string;
    formulaVersion: string;
    currency: string;
    campaignId: string;
    campaignTitle?: string | null;
    settlementId?: string | null;
    calculationStatus?: string | null;
    settlementScenario?: string | null;
    totalEligibleParticipationAmount: string;
    eligibleParticipantCount: number;
    excludedParticipantCount: number;
    sourcePools: MoneyPools;
    allocatedTotals: Omit<MoneyPools, "finalDistributionPool"> & { finalDistributionTotal: string };
    reconciliationDifferences: { principalReturn: string; holdingReturn: string; profitDistribution: string; finalDistributionTotal: string; };
    warningCount: number;
    blockerCount: number;
    isPreviewValid: boolean;
    isPersistable: false;
  };
  rows: DistributionPreviewRow[];
  excludedRows: DistributionPreviewExcludedRow[];
  reconciliation: {
    principalReturn: ReconciliationLine;
    holdingReturn: ReconciliationLine;
    profitDistribution: ReconciliationLine;
    finalDistributionTotal: ReconciliationLine;
  };
  findings: Finding[];
  generatedAt: string;
};
