export const PROJECT_PROGRESS_BY_STATUS = {
  "Asset Secured": 10,
  "Preparing Asset": 25,
  "Seeking Buyer": 40,
  "Buyer Found": 60,
  "Legal Completion": 80,
  Distribution: 95,
  Completed: 100,
} as const;

export type ProjectProgressStatus = keyof typeof PROJECT_PROGRESS_BY_STATUS;

export const PROJECT_PROGRESS_STATUSES = Object.keys(PROJECT_PROGRESS_BY_STATUS) as ProjectProgressStatus[];

export function isProjectProgressStatus(value: string): value is ProjectProgressStatus {
  return PROJECT_PROGRESS_STATUSES.includes(value as ProjectProgressStatus);
}

export function progressForProjectStatus(status: ProjectProgressStatus) {
  return PROJECT_PROGRESS_BY_STATUS[status];
}

export function deriveLifecycleFallbackProjectStatus(status: string): ProjectProgressStatus {
  if (status === "Distributed") return "Completed";
  if (status === "DistributionProcessing") return "Distribution";
  if (status === "Sold") return "Legal Completion";
  if (status === "Holding") return "Seeking Buyer";
  if (status === "Funded") return "Preparing Asset";
  return "Asset Secured";
}
