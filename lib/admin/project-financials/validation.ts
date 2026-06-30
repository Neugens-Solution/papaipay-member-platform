import { Prisma } from "@prisma/client";

export type FinancialSummaryInput = {
  purchasePrice: string | null;
  salePrice: string | null;
  totalCostsSnapshot: string | null;
  grossProfitSnapshot: string | null;
  netProfitSnapshot: string | null;
  memberProfitDistributionPercentage: string | null;
  platformProfitSharePercentage: string | null;
  platformShare: string | null;
  principalReturnPool: string | null;
  holdingReturnPool: string | null;
  profitDistributionPool: string | null;
  finalDistributionPool: string | null;
  calculationRemarks: string | null;
  saleCompletedAt: Date | null;
  distributionCalculationDate: Date | null;
};

export type FinancialSummaryPrismaData = Pick<
  Prisma.CampaignSettlementUncheckedCreateInput,
  | "purchasePrice"
  | "salePrice"
  | "totalCostsSnapshot"
  | "grossProfitSnapshot"
  | "netProfitSnapshot"
  | "memberProfitDistributionPercentage"
  | "platformProfitSharePercentage"
  | "platformShare"
  | "principalReturnPool"
  | "holdingReturnPool"
  | "profitDistributionPool"
  | "finalDistributionPool"
  | "calculationRemarks"
  | "saleCompletedAt"
  | "distributionCalculationDate"
>;

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseDecimal(formData: FormData, key: string, label: string, errors: string[], options: { min?: number; max?: number } = {}) {
  const value = readString(formData, key);
  if (value === "") return null;
  const normalized = value.replace(/,/g, "");
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    errors.push(`${label} must be a valid number.`);
    return null;
  }
  const numeric = Number(normalized);
  if (!Number.isFinite(numeric)) {
    errors.push(`${label} must be a valid number.`);
    return null;
  }
  if (options.min !== undefined && numeric < options.min) errors.push(`${label} must be at least ${options.min}.`);
  if (options.max !== undefined && numeric > options.max) errors.push(`${label} must be no more than ${options.max}.`);
  return normalized;
}

function parseDate(formData: FormData, key: string, label: string, errors: string[]) {
  const value = readString(formData, key);
  if (value === "") return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    errors.push(`${label} must be a valid date.`);
    return null;
  }
  return date;
}

export type FinancialSummaryValidationResult =
  | { success: true; data: FinancialSummaryInput }
  | { success: false; error: string; errors: string[] };

export function validateFinancialSummaryForm(formData: FormData): FinancialSummaryValidationResult {
  const errors: string[] = [];
  const moneyOptions = { min: 0 };
  const percentOptions = { min: 0, max: 100 };

  const data: FinancialSummaryInput = {
    purchasePrice: parseDecimal(formData, "purchasePrice", "Acquisition Price", errors, moneyOptions),
    salePrice: parseDecimal(formData, "salePrice", "Sale Price / Disposal Price", errors, moneyOptions),
    totalCostsSnapshot: parseDecimal(formData, "totalCostsSnapshot", "Total Approved Costs", errors, moneyOptions),
    grossProfitSnapshot: parseDecimal(formData, "grossProfitSnapshot", "Gross Return", errors, moneyOptions),
    netProfitSnapshot: parseDecimal(formData, "netProfitSnapshot", "Net Return", errors, moneyOptions),
    memberProfitDistributionPercentage: parseDecimal(formData, "memberProfitDistributionPercentage", "Member Return Share %", errors, percentOptions),
    platformProfitSharePercentage: parseDecimal(formData, "platformProfitSharePercentage", "Platform Return Share %", errors, percentOptions),
    platformShare: parseDecimal(formData, "platformShare", "Platform Share Amount", errors, moneyOptions),
    principalReturnPool: parseDecimal(formData, "principalReturnPool", "Principal Return Pool", errors, moneyOptions),
    holdingReturnPool: parseDecimal(formData, "holdingReturnPool", "Holding Return Pool", errors, moneyOptions),
    profitDistributionPool: parseDecimal(formData, "profitDistributionPool", "Member Profit Distribution Pool", errors, moneyOptions),
    finalDistributionPool: parseDecimal(formData, "finalDistributionPool", "Final Distribution Pool", errors, moneyOptions),
    calculationRemarks: readString(formData, "calculationRemarks") || null,
    saleCompletedAt: parseDate(formData, "saleCompletedAt", "Sale Completed Date", errors),
    distributionCalculationDate: parseDate(formData, "distributionCalculationDate", "Distribution Calculation Date", errors),
  };

  return errors.length > 0 ? { success: false, error: errors.join(" "), errors } : { success: true, data };
}

function decimalOrNull(value: string | null) {
  return value === null ? null : new Prisma.Decimal(value);
}

export function financialSummaryToPrismaData(data: FinancialSummaryInput): FinancialSummaryPrismaData {
  return {
    purchasePrice: decimalOrNull(data.purchasePrice),
    salePrice: decimalOrNull(data.salePrice),
    totalCostsSnapshot: decimalOrNull(data.totalCostsSnapshot),
    grossProfitSnapshot: decimalOrNull(data.grossProfitSnapshot),
    netProfitSnapshot: decimalOrNull(data.netProfitSnapshot),
    memberProfitDistributionPercentage: decimalOrNull(data.memberProfitDistributionPercentage),
    platformProfitSharePercentage: decimalOrNull(data.platformProfitSharePercentage),
    platformShare: decimalOrNull(data.platformShare),
    principalReturnPool: decimalOrNull(data.principalReturnPool),
    holdingReturnPool: decimalOrNull(data.holdingReturnPool),
    profitDistributionPool: decimalOrNull(data.profitDistributionPool),
    finalDistributionPool: decimalOrNull(data.finalDistributionPool),
    calculationRemarks: data.calculationRemarks,
    saleCompletedAt: data.saleCompletedAt,
    distributionCalculationDate: data.distributionCalculationDate,
  };
}
