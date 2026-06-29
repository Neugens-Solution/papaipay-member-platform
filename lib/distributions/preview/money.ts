import type { MoneyInput } from "./types";

const MONEY_RE = /^(0|[1-9]\d*)(\.\d{1,2})?$/;

export function parseMoneyToCents(value: MoneyInput | null | undefined, opts: { allowNegative?: boolean; fieldName?: string } = {}): bigint {
  if (value === null || value === undefined) throw new Error(`${opts.fieldName ?? "money"} is required`);
  const raw = typeof value === "bigint" ? value.toString() : String(value).trim();
  const negative = raw.startsWith("-");
  const unsigned = negative ? raw.slice(1) : raw;
  if (negative && !opts.allowNegative) throw new Error(`${opts.fieldName ?? "money"} cannot be negative`);
  if (!MONEY_RE.test(unsigned)) throw new Error(`${opts.fieldName ?? "money"} must be a decimal money string with at most 2 decimal places`);
  const [whole, fraction = ""] = unsigned.split(".");
  const cents = BigInt(whole) * BigInt(100) + BigInt((fraction + "00").slice(0, 2));
  return negative ? -cents : cents;
}

export function centsToMoney(cents: bigint): string {
  const negative = cents < BigInt(0);
  const abs = negative ? -cents : cents;
  const whole = abs / BigInt(100);
  const fraction = (abs % BigInt(100)).toString().padStart(2, "0");
  return `${negative ? "-" : ""}${whole}.${fraction}`;
}

export function basisPointsPercent(numerator: bigint, denominator: bigint): string {
  if (denominator === BigInt(0)) return "0.0000";
  const scaled = (numerator * BigInt(1000000)) / denominator;
  return `${scaled / BigInt(10000)}.${(scaled % BigInt(10000)).toString().padStart(4, "0")}`;
}
