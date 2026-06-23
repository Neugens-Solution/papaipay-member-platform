export function decimalToNumber(value: unknown): number {
  if (
    value &&
    typeof value === "object" &&
    "toNumber" in value &&
    typeof value.toNumber === "function"
  ) {
    return value.toNumber();
  }

  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);

  return 0;
}

export function formatDate(value: Date | null | undefined, fallback = "To be confirmed"): string {
  if (!value) return fallback;

  return new Intl.DateTimeFormat("en-MY", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(value);
}

export function formatEnumLabel(value: string): string {
  return value.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function formatCurrency(amount: number, currency = "RM"): string {
  return `${currency}${amount.toLocaleString()}`;
}

export function calculateDaysRemaining(value: Date | null | undefined): number {
  if (!value) return 0;

  const diff = value.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
