import { Prisma } from "@prisma/client";

export type WorkspaceModuleStatus = "not_started" | "unsaved" | "saving" | "saved" | "error";

export type WorkspaceIntent =
  | "save-overview"
  | "save-property"
  | "save-participation"
  | "save-settlement"
  | "save-media"
  | "save-documents"
  | "save-member-info"
  | "publish"
  | "unpublish";

export type WorkspaceReadinessModuleKey =
  | "overview"
  | "property"
  | "participation"
  | "settlement"
  | "media"
  | "documents"
  | "memberInfo";

export type WorkspaceReadinessModule = {
  key: WorkspaceReadinessModuleKey;
  label: string;
  ready: boolean;
  optional?: boolean;
  missingFields: string[];
  warnings: string[];
};

export type WorkspaceReadinessResult = {
  ready: boolean;
  completionPercentage: number;
  modules: WorkspaceReadinessModule[];
};

export type WorkspaceModuleResult = {
  ok: boolean;
  status: WorkspaceModuleStatus;
  message?: string;
  fieldErrors?: Record<string, string>;
  warnings?: string[];
  updatedAt?: string;
  readiness?: WorkspaceReadinessResult;
  redirectTo?: string;
};

export class WorkspaceValidationError extends Error {
  constructor(
    message: string,
    public readonly fieldErrors: Record<string, string> = {},
  ) {
    super(message);
  }
}

export function requiredString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function optionalString(formData: FormData, key: string) {
  const value = requiredString(formData, key);
  return value || undefined;
}

export function optionalDate(formData: FormData, key: string) {
  const value = requiredString(formData, key);
  return value ? new Date(value) : null;
}

export function fileFromForm(formData: FormData, key: string) {
  const value = formData.get(key);
  return value instanceof File && value.size > 0 ? value : null;
}

export function filesFromForm(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

export function checkboxBoolean(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true";
}

export function decimalOrZero(value: string | undefined) {
  return new Prisma.Decimal(value && value.trim() ? value : "0");
}

export function optionalDecimal(value: string | undefined) {
  return value && value.trim() ? new Prisma.Decimal(value) : null;
}

export function toJsonValue(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}
